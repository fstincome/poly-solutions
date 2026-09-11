import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Mail, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/messages")({
  component: MessagesPage,
});

function MessagesPage() {
  const qc = useQueryClient();
  const key = ["admin", "contact_messages"];

  const { data: messages = [], isLoading } = useQuery({
    queryKey: key,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const toggleRead = useMutation({
    mutationFn: async ({ id, is_read }: { id: string; is_read: boolean }) => {
      const { error } = await supabase.from("contact_messages").update({ is_read }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("contact_messages").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Message supprimé");
      qc.invalidateQueries({ queryKey: key });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Messages reçus</h1>
      <p className="mt-1 text-sm text-muted-foreground">Demandes envoyées depuis le formulaire de contact.</p>

      {isLoading ? (
        <p className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Chargement…
        </p>
      ) : messages.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">Aucun message pour l'instant.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {messages.map((m) => (
            <article
              key={m.id}
              className={`rounded-2xl border p-6 ${m.is_read ? "border-border bg-card" : "border-accent/40 bg-accent/5"}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display text-base font-semibold">
                    {m.name} {m.organization ? <span className="text-muted-foreground">· {m.organization}</span> : null}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {m.request_type} — {new Date(m.created_at).toLocaleString("fr-FR")}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => toggleRead.mutate({ id: m.id, is_read: !m.is_read })}
                    className="rounded-full border border-border px-4 py-1.5 text-xs font-medium"
                  >
                    {m.is_read ? "Marquer non lu" : "Marquer comme lu"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm("Supprimer ce message ?")) remove.mutate(m.id);
                    }}
                    className="rounded-full border border-destructive/40 px-4 py-1.5 text-xs font-medium text-destructive"
                  >
                    <Trash2 className="inline size-3.5" />
                  </button>
                </div>
              </div>

              <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-foreground/90">{m.message}</p>

              <div className="mt-4 flex flex-wrap gap-4 text-sm">
                <a href={`mailto:${m.email}`} className="inline-flex items-center gap-2 font-medium text-accent">
                  <Mail className="size-4" /> {m.email}
                </a>
                {m.phone ? <span className="text-muted-foreground">{m.phone}</span> : null}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
