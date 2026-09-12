import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { ShieldAlert, Trash2, UserPlus } from "lucide-react";

import { listTeamAccounts, revokeUserAccess, setUserRole } from "@/lib/admin.functions";
import { useAppRole } from "@/hooks/use-app-role";
import { ROLE_DESCRIPTIONS, ROLE_LABELS, ROLE_ORDER, canManageUsers, type AppRole } from "@/lib/roles";

export const Route = createFileRoute("/_authenticated/admin/administrateurs")({
  component: UsersPage,
});

function UsersPage() {
  const qc = useQueryClient();
  const { role: myRole, isLoading: roleLoading } = useAppRole();
  const list = useServerFn(listTeamAccounts);
  const save = useServerFn(setUserRole);
  const revoke = useServerFn(revokeUserAccess);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<AppRole>("editor");

  const allowed = canManageUsers(myRole);

  const { data: accounts, isLoading } = useQuery({
    queryKey: ["team-accounts"],
    enabled: allowed,
    queryFn: () => list({ data: undefined as never }),
  });

  const saveMutation = useMutation({
    mutationFn: () => save({ data: { email, password, role } }),
    onSuccess: (r) => {
      toast.success(`${r.email} est maintenant ${ROLE_LABELS[r.role as AppRole].toLowerCase()}.`);
      setEmail("");
      setPassword("");
      qc.invalidateQueries({ queryKey: ["team-accounts"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const revokeMutation = useMutation({
    mutationFn: (userId: string) => revoke({ data: { userId } }),
    onSuccess: () => {
      toast.success("Accès retiré.");
      qc.invalidateQueries({ queryKey: ["team-accounts"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (roleLoading) return <p className="text-sm text-muted-foreground">Chargement…</p>;

  if (!allowed) {
    return (
      <div className="max-w-lg">
        <ShieldAlert className="size-8 text-accent" />
        <h1 className="mt-4 font-display text-xl font-bold">Réservé aux administrateurs</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Seuls les administrateurs peuvent créer des comptes et attribuer des rôles.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-xl font-bold">Comptes et rôles</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Chaque compte reçoit un rôle qui limite automatiquement ce qu'il peut faire. Si l'adresse n'a pas encore de
          compte, il est créé avec le mot de passe indiqué.
        </p>
        <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
          {ROLE_ORDER.map((r) => (
            <li key={r}>
              <span className="font-semibold text-foreground">{ROLE_LABELS[r]} :</span> {ROLE_DESCRIPTIONS[r]}
            </li>
          ))}
        </ul>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          saveMutation.mutate();
        }}
        className="grid gap-4 rounded-2xl border border-border p-6 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_180px_auto] lg:items-end"
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
        <label className="block text-sm font-medium">
          Rôle
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as AppRole)}
            className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm"
          >
            {ROLE_ORDER.map((r) => (
              <option key={r} value={r}>
                {ROLE_LABELS[r]}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          disabled={saveMutation.isPending}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground disabled:opacity-60"
        >
          <UserPlus className="size-4" /> Enregistrer
        </button>
      </form>

      <div className="rounded-2xl border border-border">
        {isLoading ? (
          <p className="p-6 text-sm text-muted-foreground">Chargement…</p>
        ) : (
          <ul className="divide-y divide-border">
            {(accounts ?? []).map((a) => (
              <li key={a.id} className="flex flex-wrap items-center justify-between gap-4 px-6 py-4">
                <div>
                  <p className="text-sm font-medium">{a.email}</p>
                  <p className="text-xs text-muted-foreground">{ROLE_LABELS[a.role]}</p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={a.role}
                    onChange={(e) => changeRole.mutate({ email: a.email, role: e.target.value })}

                    className="rounded-full border border-input bg-background px-4 py-2 text-sm"
                  >
                    {ROLE_ORDER.map((r) => (
                      <option key={r} value={r}>
                        {ROLE_LABELS[r]}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => revokeMutation.mutate(a.userId)}
                    className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-destructive"
                  >
                    <Trash2 className="size-4" /> Retirer
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
