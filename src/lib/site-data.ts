import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

// Standalone read-only Supabase client (no session, no storage) so the public
// site works as a fully static build with no server runtime.
let _db: ReturnType<typeof createDb> | undefined;

function createDb() {
  const url = (import.meta.env["VITE_SUPABASE_URL"] as string) || process.env["SUPABASE_URL"]!;
  const key =
    (import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] as string) || process.env["SUPABASE_PUBLISHABLE_KEY"]!;

  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

function db() {
  if (!_db) _db = createDb();
  return _db;
}

export type SiteContent = {
  settings: Record<string, string>;
  services: Database["public"]["Tables"]["services"]["Row"][];
  values: Database["public"]["Tables"]["core_values"]["Row"][];
  projects: Database["public"]["Tables"]["projects"]["Row"][];
  achievements: Database["public"]["Tables"]["achievements"]["Row"][];
  partners: Database["public"]["Tables"]["partners"]["Row"][];
  team: Database["public"]["Tables"]["team_members"]["Row"][];
};

export async function getSiteContent(): Promise<SiteContent> {
  const client = db();
  const [settings, services, values, projects, achievements, partners, team] = await Promise.all([
    client.from("site_settings").select("key, value"),
    client.from("services").select("*").eq("is_published", true).order("sort_order"),
    client.from("core_values").select("*").order("sort_order"),
    client.from("projects").select("*").order("sort_order"),
    client.from("achievements").select("*").order("sort_order"),
    client.from("partners").select("*").order("sort_order"),
    client.from("team_members").select("*").order("sort_order"),
  ]);

  const map: Record<string, string> = {};
  for (const row of settings.data ?? []) map[row.key] = row.value;

  return {
    settings: map,
    services: services.data ?? [],
    values: values.data ?? [],
    projects: projects.data ?? [],
    achievements: achievements.data ?? [],
    partners: partners.data ?? [],
    team: team.data ?? [],
  };
}

export async function getNewsList() {
  const { data } = await db()
    .from("news_posts")
    .select("id, slug, title, excerpt, cover_url, published_at")
    .eq("is_published", true)
    .order("published_at", { ascending: false });
  return data ?? [];
}

export async function getNewsPost(slug: string) {
  const { data } = await db()
    .from("news_posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  return data;
}

export async function sendContactMessage(input: {
  name: string;
  email: string;
  phone?: string;
  organization?: string;
  request_type: string;
  message: string;
}) {
  if (!input.name.trim() || !input.email.trim() || !input.message.trim()) {
    throw new Error("Champs obligatoires manquants");
  }
  const { error } = await db().from("contact_messages").insert({
    name: input.name.trim(),
    email: input.email.trim(),
    phone: input.phone?.trim() || null,
    organization: input.organization?.trim() || null,
    request_type: input.request_type,
    message: input.message.trim(),
  });
  if (error) throw new Error(error.message);
  return { ok: true };
}
