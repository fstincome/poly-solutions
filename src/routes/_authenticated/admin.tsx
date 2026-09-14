import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Eye, Loader2, LogOut, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { claimFirstAdmin } from "@/lib/admin.functions";
import { useAppRole } from "@/hooks/use-app-role";
import { ROLE_LABELS } from "@/lib/roles";
import { ADMIN_PAGES } from "@/lib/permissions";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout,
});



function AdminLayout() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { user, role, isLoading, can } = useAppRole();

  const claimMutation = useMutation({
    mutationFn: () => claimFirstAdmin(),
    onSuccess: () => {
      toast.success("Vous êtes maintenant administrateur du site.");
      qc.invalidateQueries({ queryKey: ["my-role"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const readOnly = role === "user";
  const links = [
    { to: "/admin", label: "Tableau de bord", exact: true },
    ...ADMIN_PAGES.filter((page) => can(page.resource, "view")).map((page) => ({
      to: page.to,
      label: page.label,
      exact: false,
    })),
  ];

  return (
    <div className="min-h-screen bg-secondary font-sans">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="POLY-SOLUTIONS" width={36} height={36} className="size-9" />
            <span className="font-display text-sm font-bold text-primary">Administration du site</span>
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-muted-foreground sm:inline">{user?.email}</span>
            {role ? (
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary">
                {ROLE_LABELS[role]}
              </span>
            ) : null}
            <button
              type="button"
              onClick={signOut}
              className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 font-medium"
            >
              <LogOut className="size-4" /> Déconnexion
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[240px_1fr]">
        <nav className="space-y-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.exact }}
              activeProps={{ className: "bg-primary text-primary-foreground" }}
              className="block rounded-lg px-4 py-2.5 text-sm font-medium text-foreground/80 hover:bg-background"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="rounded-3xl border border-border bg-background p-8">
          {isLoading ? (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> Vérification de vos droits…
            </p>
          ) : role ? (
            <>
              {readOnly ? (
                <p className="mb-6 flex items-center gap-2 rounded-xl bg-secondary px-4 py-3 text-sm text-muted-foreground">
                  <Eye className="size-4 shrink-0" />
                  Votre compte est en consultation seule : les actions de modification sont désactivées.
                </p>
              ) : null}
              <Outlet />
            </>
          ) : (
            <div className="max-w-lg">
              <ShieldCheck className="size-9 text-accent" />
              <h1 className="mt-4 font-display text-xl font-bold">Aucun droit d'accès</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Votre compte n'a encore aucun rôle. Si vous êtes la première personne de POLY-SOLUTIONS à configurer le
                site, activez vos droits ci-dessous. Sinon, demandez à un administrateur de vous attribuer un rôle
                (Administrateur, Gestionnaire ou Lecteur).
              </p>
              <button
                type="button"
                onClick={() => claimMutation.mutate()}
                disabled={claimMutation.isPending}
                className="mt-5 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground disabled:opacity-60"
              >
                {claimMutation.isPending ? "Activation…" : "Devenir administrateur"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
