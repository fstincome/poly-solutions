import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

function publicClient() {
  const url = process.env["SUPABASE_URL"]!;
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
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

export type SiteContent = {
  settings: Record<string, string>;
  services: Database["public"]["Tables"]["services"]["Row"][];
  values: Database["public"]["Tables"]["core_values"]["Row"][];
  projects: Database["public"]["Tables"]["projects"]["Row"][];
  achievements: Database["public"]["Tables"]["achievements"]["Row"][];
  partners: Database["public"]["Tables"]["partners"]["Row"][];
  team: Database["public"]["Tables"]["team_members"]["Row"][];
};

export const getSiteContent = createServerFn({ method: "GET" }).handler(async (): Promise<SiteContent> => {
  const db = publicClient();
  const [settings, services, values, projects, achievements, partners, team] = await Promise.all([
    db.from("site_settings").select("key, value"),
    db.from("services").select("*").eq("is_published", true).order("sort_order"),
    db.from("core_values").select("*").order("sort_order"),
    db.from("projects").select("*").order("sort_order"),
    db.from("achievements").select("*").order("sort_order"),
    db.from("partners").select("*").order("sort_order"),
    db.from("team_members").select("*").order("sort_order"),
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
});

export const getNewsList = createServerFn({ method: "GET" }).handler(async () => {
  const db = publicClient();
  const { data } = await db
    .from("news_posts")
    .select("id, slug, title, excerpt, cover_url, published_at")
    .eq("is_published", true)
    .order("published_at", { ascending: false });
  return data ?? [];
});

export const getNewsPost = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    const db = publicClient();
    const { data: post } = await db
      .from("news_posts")
      .select("*")
      .eq("slug", data.slug)
      .eq("is_published", true)
      .maybeSingle();
    return post;
  });

export const sendContactMessage = createServerFn({ method: "POST" })
  .inputValidator((data: {
    name: string;
    email: string;
    phone?: string;
    organization?: string;
    request_type: string;
    message: string;
  }) => data)
  .handler(async ({ data }) => {
    if (!data.name.trim() || !data.email.trim() || !data.message.trim()) {
      throw new Error("Champs obligatoires manquants");
    }
    const db = publicClient();
    const { error } = await db.from("contact_messages").insert({
      name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone?.trim() || null,
      organization: data.organization?.trim() || null,
      request_type: data.request_type,
      message: data.message.trim(),
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
