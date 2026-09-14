import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const VALID_ROLES = ["admin", "editor", "user"];

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") ?? Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    if (!authHeader) return json({ error: "Non authentifié." }, 401);

    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userError } = await userClient.auth.getUser();
    if (userError || !userData.user) return json({ error: "Session invalide." }, 401);
    const callerId = userData.user.id;

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);
    const body = await req.json().catch(() => ({}));
    const action = String(body.action ?? "");

    const isAdmin = async () => {
      const { count } = await admin
        .from("user_roles")
        .select("id", { count: "exact", head: true })
        .eq("user_id", callerId)
        .eq("role", "admin");
      return (count ?? 0) > 0;
    };

    if (action === "claim_first_admin") {
      const { count } = await admin
        .from("user_roles")
        .select("id", { count: "exact", head: true })
        .eq("role", "admin");
      if ((count ?? 0) > 0) return json({ error: "Un administrateur existe déjà." }, 400);
      const { error } = await admin.from("user_roles").insert({ user_id: callerId, role: "admin" });
      if (error) return json({ error: error.message }, 400);
      return json({ ok: true });
    }

    if (!(await isAdmin())) return json({ error: "Réservé aux administrateurs." }, 403);

    if (action === "list") {
      const { data: roles, error } = await admin
        .from("user_roles")
        .select("id, user_id, role, created_at");
      if (error) return json({ error: error.message }, 400);
      const { data: users } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
      const emails = new Map((users?.users ?? []).map((u) => [u.id, u.email ?? ""]));
      return json({
        accounts: (roles ?? []).map((r) => ({
          id: r.id,
          userId: r.user_id,
          role: r.role,
          email: emails.get(r.user_id) ?? "(compte inconnu)",
          createdAt: r.created_at,
        })),
      });
    }

    if (action === "set_role") {
      const email = String(body.email ?? "").trim().toLowerCase();
      const password = String(body.password ?? "");
      const role = String(body.role ?? "");
      if (!email) return json({ error: "Adresse e-mail requise." }, 400);
      if (!VALID_ROLES.includes(role)) return json({ error: "Rôle inconnu." }, 400);

      const { data: list } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
      let user = (list?.users ?? []).find((u) => (u.email ?? "").toLowerCase() === email);

      if (!user) {
        if (password.length < 8) return json({ error: "Le mot de passe doit contenir au moins 8 caractères." }, 400);
        const { data: created, error } = await admin.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
        });
        if (error) return json({ error: error.message }, 400);
        user = created.user!;
      }

      if (user.id === callerId && role !== "admin") {
        return json({ error: "Vous ne pouvez pas réduire vos propres droits." }, 400);
      }

      const { error: clearError } = await admin
        .from("user_roles")
        .delete()
        .eq("user_id", user.id)
        .neq("role", role);
      if (clearError) return json({ error: clearError.message }, 400);

      const { error: roleError } = await admin
        .from("user_roles")
        .upsert({ user_id: user.id, role }, { onConflict: "user_id,role" });
      if (roleError) return json({ error: roleError.message }, 400);

      return json({ ok: true, email, role });
    }

    if (action === "revoke") {
      const userId = String(body.userId ?? "");
      if (userId === callerId) return json({ error: "Vous ne pouvez pas retirer vos propres droits." }, 400);
      const { error } = await admin.from("user_roles").delete().eq("user_id", userId);
      if (error) return json({ error: error.message }, 400);
      return json({ ok: true });
    }

    return json({ error: "Action inconnue." }, 400);
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Erreur inattendue." }, 500);
  }
});
