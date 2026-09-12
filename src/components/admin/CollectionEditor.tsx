import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Save, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { ICON_NAMES } from "@/lib/icon-map";
import { usePermissions } from "@/hooks/use-app-role";
import type { Resource } from "@/lib/permissions";

export type FieldType = "text" | "textarea" | "list" | "number" | "boolean" | "icon";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
};

type Row = Record<string, unknown> & { id: string };

export function CollectionEditor({
  table,
  title,
  description,
  fields,
  defaults,
  resource = "content",
}: {
  table: string;
  title: string;
  description?: string;
  fields: Field[];
  defaults: Record<string, unknown>;
  resource?: Resource;
}) {
  const qc = useQueryClient();
  const perm = usePermissions(resource);
  const key = ["admin", table];

  const { data: rows = [], isLoading } = useQuery({
    queryKey: key,
    queryFn: async () => {
      const { data, error } = await supabase.from(table as never).select("*").order("sort_order");
      if (error) throw error;
      return (data ?? []) as unknown as Row[];
    },
  });

  const save = useMutation({
    mutationFn: async (row: Row) => {
      const { id, ...rest } = row;
      const { error } = await supabase.from(table as never).update(rest as never).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Modifications enregistrées");
      qc.invalidateQueries({ queryKey: key });
      qc.invalidateQueries({ queryKey: ["site-content"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const create = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from(table as never)
        .insert({ ...defaults, sort_order: rows.length + 1 } as never);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Élément ajouté");
      qc.invalidateQueries({ queryKey: key });
      qc.invalidateQueries({ queryKey: ["site-content"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(table as never).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Élément supprimé");
      qc.invalidateQueries({ queryKey: key });
      qc.invalidateQueries({ queryKey: ["site-content"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold">{title}</h2>
          {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
        </div>
        {perm.canCreate ? (
          <button
            type="button"
            onClick={() => create.mutate()}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground"
          >
            <Plus className="size-4" /> Ajouter
          </button>
        ) : null}
      </div>

      {isLoading ? (
        <p className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Chargement…
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {rows.map((row) => (
            <ItemCard
              key={row.id}
              row={row}
              fields={fields}
              onSave={(r) => save.mutate(r)}
              onDelete={() => remove.mutate(row.id)}
              canUpdate={perm.canUpdate}
              canDelete={perm.canDelete}
            />
          ))}
          {rows.length === 0 ? <p className="text-sm text-muted-foreground">Aucun élément pour l'instant.</p> : null}
        </div>
      )}
    </div>
  );
}

function ItemCard({
  row,
  fields,
  onSave,
  onDelete,
  canUpdate,
  canDelete,
}: {
  row: Row;
  fields: Field[];
  onSave: (row: Row) => void;
  onDelete: () => void;
  canUpdate: boolean;
  canDelete: boolean;
}) {
  const [draft, setDraft] = useState<Row>(row);

  const set = (name: string, value: unknown) => setDraft((d) => ({ ...d, [name]: value }));

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <fieldset disabled={!canUpdate} className="grid gap-4 md:grid-cols-2">
        {fields.map((f) => (
          <label key={f.name} className={`text-sm font-medium ${f.type === "textarea" || f.type === "list" ? "md:col-span-2" : ""}`}>
            {f.label}
            {f.type === "textarea" ? (
              <textarea
                rows={4}
                value={String(draft[f.name] ?? "")}
                onChange={(e) => set(f.name, e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-normal"
              />
            ) : f.type === "list" ? (
              <textarea
                rows={3}
                value={((draft[f.name] as string[]) ?? []).join("\n")}
                onChange={(e) => set(f.name, e.target.value.split("\n").filter((v) => v.trim() !== ""))}
                placeholder="Un élément par ligne"
                className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-normal"
              />
            ) : f.type === "icon" ? (
              <select
                value={String(draft[f.name] ?? "")}
                onChange={(e) => set(f.name, e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-normal"
              >
                {ICON_NAMES.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            ) : f.type === "boolean" ? (
              <span className="mt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={Boolean(draft[f.name])}
                  onChange={(e) => set(f.name, e.target.checked)}
                  className="size-4"
                />
                <span className="text-sm font-normal text-muted-foreground">Activé</span>
              </span>
            ) : (
              <input
                type={f.type === "number" ? "number" : "text"}
                value={String(draft[f.name] ?? "")}
                onChange={(e) => set(f.name, f.type === "number" ? Number(e.target.value) : e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-normal"
              />
            )}
          </label>
        ))}
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
              if (confirm("Supprimer définitivement cet élément ?")) onDelete();
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
