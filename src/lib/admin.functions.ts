import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { AppRole } from "@/lib/roles";

const VALID_ROLES: AppRole[] = ["admin", "editor", "user"];

function parseRole(value: unknown): AppRole {
  const role = String(value) as AppRole;
  if (!VALID_ROLES.includes(role)) throw new Error("Rôle inconnu.");
  return role;
}

/**
 * One-time bootstrap: the first signed-in user can claim the admin role
 * as long as no administrator exists yet.
 */
export const claimFirstAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { count, error: countError } = await supabaseAdmin
      .from("user_roles")
      .select("id", { count: "exact", head: true })
      .eq("role", "admin");
    if (countError) throw new Error(countError.message);
    if ((count ?? 0) > 0) throw new Error("Un administrateur existe déjà.");

    const { error } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: context.userId, role: "admin" });
    if (error) throw new Error(error.message);

    return { ok: true };
  });

export const adminExists = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { count } = await supabaseAdmin
    .from("user_roles")
    .select("id", { count: "exact", head: true })
    .eq("role", "admin");
  return { exists: (count ?? 0) > 0 };
});

async function assertAdmin(supabase: any, userId: string) {
  const { data, error } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Réservé aux administrateurs.");
}

export const listTeamAccounts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: roles, error } = await supabaseAdmin
      .from("user_roles")
      .select("id, user_id, role, created_at");
    if (error) throw new Error(error.message);

    const { data: users } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
    const emails = new Map((users?.users ?? []).map((u) => [u.id, u.email ?? ""]));

    return (roles ?? []).map((r) => ({
      id: r.id,
      userId: r.user_id,
      role: r.role as AppRole,
      email: emails.get(r.user_id) ?? "(compte inconnu)",
      createdAt: r.created_at,
    }));
  });

/** Creates the account if needed, then gives it exactly one role. */
export const setUserRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { email: string; password?: string; role: string }) => ({
    email: String(d.email).trim().toLowerCase(),
    password: String(d.password ?? ""),
    role: parseRole(d.role),
  }))
  .handler(async ({ context, data }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: list } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
    let user = (list?.users ?? []).find((u) => (u.email ?? "").toLowerCase() === data.email);

    if (!user) {
      if (data.password.length < 8) throw new Error("Le mot de passe doit contenir au moins 8 caractères.");
      const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
        email: data.email,
        password: data.password,
        email_confirm: true,
      });
      if (error) throw new Error(error.message);
      user = created.user!;
    }

    if (user.id === context.userId && data.role !== "admin") {
      throw new Error("Vous ne pouvez pas réduire vos propres droits.");
    }

    const { error: clearError } = await supabaseAdmin
      .from("user_roles")
      .delete()
      .eq("user_id", user.id)
      .neq("role", data.role);
    if (clearError) throw new Error(clearError.message);

    const { error: roleError } = await supabaseAdmin
      .from("user_roles")
      .upsert({ user_id: user.id, role: data.role }, { onConflict: "user_id,role" });
    if (roleError) throw new Error(roleError.message);

    return { ok: true, email: data.email, role: data.role };
  });

export const revokeUserAccess = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { userId: string }) => ({ userId: String(d.userId) }))
  .handler(async ({ context, data }) => {
    await assertAdmin(context.supabase, context.userId);
    if (data.userId === context.userId) throw new Error("Vous ne pouvez pas retirer vos propres droits.");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("user_roles").delete().eq("user_id", data.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
