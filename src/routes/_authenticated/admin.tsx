import { useEffect, useState } from "react";
import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import {
  ExternalLink,
  Eye,
  FileText,
  LayoutDashboard,
  Loader2,
  LogOut,
  Mail,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  ShieldCheck,
  Users,
  Boxes,
} from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { claimFirstAdmin } from "@/lib/admin.functions";
import { useAppRole } from "@/hooks/use-app-role";
import { ROLE_LABELS } from "@/lib/roles";
import { ADMIN_PAGES, type Resource } from "@/lib/permissions";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout,
});

const RESOURCE_ICONS: Record<Resource, typeof Settings> = {
  settings: Settings,
  content: Boxes,
  news: FileText,
  messages: Mail,
  users: Users,
};

function AdminLayout() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { user, role, isLoading, can } = useAppRole();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("admin-sidebar-collapsed");
    if (saved === "1") setCollapsed(true);
  }, []);

  function toggleCollapsed() {
    setCollapsed((v) => {
      localStorage.setItem("admin-sidebar-collapsed", v ? "0" : "1");
      return !v;
    });
  }

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
    { to: "/admin", label: "Tableau de bord", exact: true, Icon: LayoutDashboard },
    ...ADMIN_PAGES.filter((page) => can(page.resource, "view")).map((page) => ({
      to: page.to,
      label: page.label,
      exact: false,
      Icon: RESOURCE_ICONS[page.resource],
    })),
  ];

  const nav = (
    <nav className="space-y-0.5 px-2 py-3">
      {links.map((l) => (
        <Link
          key={l.to}
          to={l.to}
          onClick={() => setMobileOpen(false)}
          activeOptions={{ exact: l.exact }}
          activeProps={{
            className: "bg-sidebar-accent text-sidebar-accent-foreground border-l-accent",
          }}
          inactiveProps={{
            className: "border-l-transparent text-sidebar-foreground/75 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
          }}
          title={collapsed ? l.label : undefined}
          className="flex items-center gap-3 border-l-[3px] px-3 py-2.5 text-sm font-medium transition-colors"
        >
          <l.Icon className="size-4.5 shrink-0" />
          {!collapsed ? <span className="truncate">{l.label}</span> : null}
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-secondary font-sans">
      {/* Admin bar */}
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-4 bg-primary px-4 text-primary-foreground">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="rounded-md p-2 hover:bg-primary-foreground/10 lg:hidden"
            aria-label="Ouvrir le menu"
          >
            <Menu className="size-5" />
          </button>
          <button
            type="button"
            onClick={toggleCollapsed}
            className="hidden rounded-md p-2 hover:bg-primary-foreground/10 lg:inline-flex"
            aria-label={collapsed ? "Déplier le menu" : "Replier le menu"}
          >
            {collapsed ? <PanelLeftOpen className="size-5" /> : <PanelLeftClose className="size-5" />}
          </button>
          <span className="flex items-center gap-2.5">
            <img src={logo} alt="" width={28} height={28} className="size-7 rounded bg-background/95 p-0.5" />
            <span className="font-display text-sm font-bold">POLY-SOLUTIONS</span>
          </span>
          <Link
            to="/"
            className="hidden items-center gap-1.5 rounded-full bg-primary-foreground/10 px-3 py-1.5 text-xs font-medium hover:bg-primary-foreground/20 sm:inline-flex"
          >
            <ExternalLink className="size-3.5" /> Voir le site
          </Link>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <span className="hidden text-primary-foreground/80 md:inline">{user?.email}</span>
          {role ? (
            <span className="rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-semibold">
              {ROLE_LABELS[role]}
            </span>
          ) : null}
          <button
            type="button"
            onClick={signOut}
            className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium hover:bg-primary-foreground/10"
          >
            <LogOut className="size-4" /> <span className="hidden sm:inline">Déconnexion</span>
          </button>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-3.5rem)]">
        {/* Desktop sidebar */}
        <aside
          className={`hidden shrink-0 border-r border-sidebar-border bg-sidebar transition-[width] lg:block ${
            collapsed ? "w-16" : "w-60"
          }`}
        >
          <div className="sticky top-14">{nav}</div>
        </aside>

        {/* Mobile drawer */}
        {mobileOpen ? (
          <div className="fixed inset-0 z-30 lg:hidden">
            <button
              type="button"
              aria-label="Fermer le menu"
              onClick={() => setMobileOpen(false)}
              className="absolute inset-0 bg-foreground/40"
            />
            <aside className="absolute left-0 top-14 h-full w-64 bg-sidebar shadow-xl">{nav}</aside>
          </div>
        ) : null}

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-8">
          {isLoading ? (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> Vérification de vos droits…
            </p>
          ) : role ? (
            <>
              {readOnly ? (
                <p className="mb-5 flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-sm text-muted-foreground">
                  <Eye className="size-4 shrink-0" />
                  Votre compte est en consultation seule : les actions de modification sont désactivées.
                </p>
              ) : null}
              <Outlet />
            </>
          ) : (
            <div className="max-w-lg rounded-2xl border border-border bg-background p-8">
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
        </main>
      </div>
    </div>
  );
}
