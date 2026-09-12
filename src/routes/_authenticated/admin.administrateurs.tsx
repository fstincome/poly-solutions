import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Trash2, UserPlus } from "lucide-react";

import { addAdmin, listAdmins, removeAdmin } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/administrateurs")({
  component: AdminsPage,
});

function AdminsPage() {
  const qc = useQueryClient();
  const list = useServerFn(listAdmins);
  const add = useServerFn(addAdmin);
  const remove = useServerFn(removeAdmin);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { data: admins, isLoading } = useQuery({
    queryKey: ["admins"],
    queryFn: () => list({ data: undefined as never }),
  });

  const addMutation = useMutation({
    mutationFn: () => add({ data: { email, password } }),
    onSuccess: (r) => {
      toast.success(`${r.email} est maintenant administrateur.`);
      setEmail("");
      setPassword("");
      qc.invalidateQueries({ queryKey: ["admins"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const removeMutation = useMutation({
    mutationFn: (userId: string) => remove({ data: { userId } }),
    onSuccess: () => {
      toast.success("Droits retirés.");
      qc.invalidateQueries({ queryKey: ["admins"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-xl font-bold">Administrateurs</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Ajoutez les personnes autorisées à modifier le contenu du site. Si l'adresse n'a pas encore de compte, un
          compte est créé avec le mot de passe que vous indiquez.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          addMutation.mutate();
        }}
        className="grid gap-4 rounded-2xl border border-border p-6 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
      >
        <label className="block text-sm font-medium">
          Adresse e-mail
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm"
          />
        </label>
        <label className="block text-sm font-medium">
          Mot de passe (si nouveau compte)
          <input
            type="text"
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm"
          />
        </label>
        <button
          type="submit"
          disabled={addMutation.isPending}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground disabled:opacity-60"
        >
          <UserPlus className="size-4" /> Ajouter
        </button>
      </form>

      <div className="rounded-2xl border border-border">
        {isLoading ? (
          <p className="p-6 text-sm text-muted-foreground">Chargement…</p>
        ) : (
          <ul className="divide-y divide-border">
            {(admins ?? []).map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-4 px-6 py-4">
                <span className="text-sm font-medium">{a.email}</span>
                <button
                  type="button"
                  onClick={() => removeMutation.mutate(a.userId)}
                  className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-destructive"
                >
                  <Trash2 className="size-4" /> Retirer
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
