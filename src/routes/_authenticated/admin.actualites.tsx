import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { usePermissions } from "@/hooks/use-app-role";

export const Route = createFileRoute("/_authenticated/admin/actualites")({
  component: NewsAdminPage,
});

type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  cover_url: string | null;
  is_published: boolean;
  published_at: string;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

function NewsAdminPage() {
  const qc = useQueryClient();
  const perm = usePermissions("news");
  const key = ["admin", "news_posts"];

  const { data: posts = [], isLoading } = useQuery({
    queryKey: key,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news_posts")
        .select("*")
        .order("published_at", { ascending: false });
      if (error) throw error;
      return data as Post[];
    },
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: key });
    qc.invalidateQueries({ queryKey: ["site-content"] });
    qc.invalidateQueries({ queryKey: ["news-list"] });
  };

  const create = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("news_posts").insert({
        slug: `article-${Date.now()}`,
        title: "Nouvel article",
        excerpt: "",
        body: "",
        is_published: false,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Article créé");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const save = useMutation({
    mutationFn: async (post: Post) => {
      const { id, ...rest } = post;
      const { error } = await supabase.from("news_posts").update(rest).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Article enregistré");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("news_posts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Article supprimé");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Actualités</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Seuls les articles publiés apparaissent sur le site public.
          </p>
        </div>
        {perm.canCreate ? (
          <button
            type="button"
            onClick={() => create.mutate()}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground"
          >
            <Plus className="size-4" /> Nouvel article
          </button>
        ) : null}
      </div>

      {isLoading ? (
        <p className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Chargement…
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {posts.map((p) => (
            <PostCard
              key={p.id}
              post={p}
              onSave={(v) => save.mutate(v)}
              onDelete={() => remove.mutate(p.id)}
              canUpdate={perm.canUpdate}
              canDelete={perm.canDelete}
              canPublish={perm.canPublish}
            />
          ))}
          {posts.length === 0 ? <p className="text-sm text-muted-foreground">Aucun article pour l'instant.</p> : null}
        </div>
      )}
    </div>
  );
}

function PostCard({
  post,
  onSave,
  onDelete,
  canUpdate,
  canDelete,
  canPublish,
}: {
  post: Post;
  onSave: (p: Post) => void;
  onDelete: () => void;
  canUpdate: boolean;
  canDelete: boolean;
  canPublish: boolean;
}) {
  const [draft, setDraft] = useState<Post>(post);
  const set = (k: keyof Post, v: unknown) => setDraft((d) => ({ ...d, [k]: v }) as Post);

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <fieldset disabled={!canUpdate} className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium">
          Titre
          <input
            value={draft.title}
            onChange={(e) => set("title", e.target.value)}
            onBlur={() => {
              if (!draft.slug || draft.slug.startsWith("article-")) set("slug", slugify(draft.title));
            }}
            className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-normal"
          />
        </label>
        <label className="text-sm font-medium">
          Adresse de la page (slug)
          <input
            value={draft.slug}
            onChange={(e) => set("slug", slugify(e.target.value))}
            className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-normal"
          />
        </label>
        <label className="text-sm font-medium md:col-span-2">
          Résumé
          <textarea
            rows={2}
            value={draft.excerpt}
            onChange={(e) => set("excerpt", e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-normal"
          />
        </label>
        <label className="text-sm font-medium md:col-span-2">
          Contenu
          <textarea
            rows={8}
            value={draft.body}
            onChange={(e) => set("body", e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-normal"
          />
        </label>
        <label className="text-sm font-medium">
          Image de couverture (adresse web)
          <input
            value={draft.cover_url ?? ""}
            onChange={(e) => set("cover_url", e.target.value || null)}
            className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-normal"
          />
        </label>
        <label className="text-sm font-medium">
          Date de publication
          <input
            type="date"
            value={draft.published_at.slice(0, 10)}
            onChange={(e) => set("published_at", new Date(e.target.value).toISOString())}
            className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-normal"
          />
        </label>
        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={draft.is_published}
            disabled={!canPublish}
            onChange={(e) => set("is_published", e.target.checked)}
            className="size-4"
          />
          Publié sur le site
        </label>
      </fieldset>

      <div className="mt-5 flex gap-2">
        {canUpdate ? (
          <button
            type="button"
            onClick={() => onSave(draft)}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground"
          >
            <Save className="size-4" /> Enregistrer
          </button>
        ) : null}
        {canDelete ? (
          <button
            type="button"
            onClick={() => {
              if (confirm("Supprimer définitivement cet article ?")) onDelete();
            }}
            className="inline-flex items-center gap-2 rounded-full border border-destructive/40 px-5 py-2 text-sm font-semibold text-destructive"
          >
            <Trash2 className="size-4" /> Supprimer
          </button>
        ) : null}
      </div>
    </div>
  );
}
