import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Save, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { usePermissions } from "@/hooks/use-app-role";

export const Route = createFileRoute("/_authenticated/admin/parametres")({
  component: SettingsPage,
});

const SIGNED_URL_TTL = 60 * 60 * 24 * 365 * 10;

function SettingImageField({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (url: string) => void;
  disabled: boolean;
}) {
  const [busy, setBusy] = useState(false);

  const upload = async (file: File) => {
    setBusy(true);
    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("site-images").upload(path, file, { upsert: true });
      if (error) throw error;
      const { data, error: signErr } = await supabase.storage
        .from("site-images")
        .createSignedUrl(path, SIGNED_URL_TTL);
      if (signErr) throw signErr;
      onChange(data?.signedUrl ?? "");
      toast.success("Image importée — pensez à enregistrer");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mt-1.5 flex items-center gap-4">
      <div className="flex h-24 w-40 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-background">
        {value ? (
          <img src={value} alt="" className="size-full object-cover" />
        ) : (
          <ImageIcon className="size-6 text-muted-foreground" />
        )}
      </div>
      <div className="flex flex-col gap-2">
        <input
          type="file"
          accept="image/*"
          disabled={disabled || busy}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void upload(f);
          }}
          className="text-xs font-normal file:mr-3 file:rounded-full file:border-0 file:bg-secondary file:px-4 file:py-2 file:text-xs file:font-semibold"
        />
        {busy ? (
          <span className="flex items-center gap-1.5 text-xs font-normal text-muted-foreground">
            <Loader2 className="size-3 animate-spin" /> Import en cours…
          </span>
        ) : value ? (
          <button
            type="button"
            disabled={disabled}
            onClick={() => onChange("")}
            className="self-start text-xs font-normal text-destructive underline"
          >
            Retirer l'image
          </button>
        ) : null}
      </div>
    </div>
  );
}

const SECTION_LABELS: Record<string, string> = {
  identite: "Identité de la société",
  contact: "Coordonnées",
  accueil: "Page d'accueil",
  apropos: "Page À propos",
  services: "Page Services",
  realisations: "Page Réalisations",
  partenaires: "Page Partenaires",
  equipe: "Page Équipe",
  actualites: "Page Actualités",
  general: "Pied de page et divers",
};

function SettingsPage() {
  const qc = useQueryClient();
  const perm = usePermissions("settings");
  const [draft, setDraft] = useState<Record<string, string>>({});

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["admin", "site_settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .order("section")
        .order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (rows.length) setDraft(Object.fromEntries(rows.map((r) => [r.key, r.value])));
  }, [rows]);

  const save = useMutation({
    mutationFn: async () => {
      const changed = rows.filter((r) => draft[r.key] !== undefined && draft[r.key] !== r.value);
      for (const row of changed) {
        const { error } = await supabase
          .from("site_settings")
          .update({ value: draft[row.key]! })
          .eq("key", row.key);
        if (error) throw error;
      }
      return changed.length;
    },
    onSuccess: (n) => {
      toast.success(n === 0 ? "Aucune modification à enregistrer" : `${n} texte(s) mis à jour`);
      qc.invalidateQueries({ queryKey: ["admin", "site_settings"] });
      qc.invalidateQueries({ queryKey: ["site-content"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) {
    return (
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" /> Chargement…
      </p>
    );
  }

  const sections = [...new Set(rows.map((r) => r.section))];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Textes du site</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Modifiez les titres, textes et coordonnées affichés sur les pages publiques.
          </p>
        </div>
        {perm.canUpdate ? (
          <button
            type="button"
            onClick={() => save.mutate()}
            disabled={save.isPending}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground disabled:opacity-60"
          >
            <Save className="size-4" /> {save.isPending ? "Enregistrement…" : "Enregistrer"}
          </button>
        ) : null}
      </div>

      <fieldset disabled={!perm.canUpdate} className="mt-8 space-y-10">
        {sections.map((section) => (
          <section key={section}>
            <h2 className="font-display text-lg font-semibold">{SECTION_LABELS[section] ?? section}</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {rows
                .filter((r) => r.section === section)
                .map((r) => (
                  <label
                    key={r.key}
                    className={`text-sm font-medium ${r.kind === "textarea" ? "md:col-span-2" : ""}`}
                  >
                    {r.label}
                    {r.kind === "image" ? (
                      <SettingImageField
                        value={draft[r.key] ?? ""}
                        disabled={!perm.canUpdate}
                        onChange={(url) => setDraft((d) => ({ ...d, [r.key]: url }))}
                      />
                    ) : r.kind === "textarea" ? (
                      <textarea
                        rows={4}
                        value={draft[r.key] ?? ""}
                        onChange={(e) => setDraft((d) => ({ ...d, [r.key]: e.target.value }))}
                        className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-normal"
                      />
                    ) : (
                      <input
                        value={draft[r.key] ?? ""}
                        onChange={(e) => setDraft((d) => ({ ...d, [r.key]: e.target.value }))}
                        className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-normal"
                      />
                    )}
                  </label>
                ))}
            </div>
          </section>
        ))}
      </fieldset>
    </div>
  );
}
