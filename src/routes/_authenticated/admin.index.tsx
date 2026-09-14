import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Boxes,
  Check,
  FileText,
  Handshake,
  Mail,
  MailOpen,
  Minus,
  Plus,
  Settings,
  Users,
} from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { useAppRole } from "@/hooks/use-app-role";
import { ROLE_LABELS, ROLE_ORDER } from "@/lib/roles";
import { ACTION_LABELS, ADMIN_PAGES, PERMISSIONS, RESOURCE_ACTIONS } from "@/lib/permissions";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminHome,
});

function useDashboardStats() {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const count = async (table: "services" | "partners" | "team_members" | "news_posts" | "contact_messages", filter?: (q: any) => any) => {
        let q = supabase.from(table).select("id", { count: "exact", head: true });
        if (filter) q = filter(q);
        const { count: c } = await q;
        return c ?? 0;
      };
      const [services, partners, team, news, published, messages, unread] = await Promise.all([
        count("services"),
        count("partners"),
        count("team_members"),
        count("news_posts"),
        count("news_posts", (q) => q.eq("is_published", true)),
        count("contact_messages"),
        count("contact_messages", (q) => q.eq("is_read", false)),
      ]);
      return { services, partners, team, news, published, messages, unread };
    },
  });
}

function StatCard({
  Icon,
  label,
  value,
  hint,
  to,
}: {
  Icon: typeof Mail;
  label: string;
  value: number | string;
  hint?: string | undefined;
  to: string;
}) {
  return (
    <Link
      to={to}
      className="flex items-center gap-4 rounded-xl border border-border bg-background p-5 transition-colors hover:border-accent"
    >
      <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-secondary text-primary">
        <Icon className="size-5" />
      </span>
      <span className="min-w-0">
        <span className="block font-display text-2xl font-bold leading-none">{value}</span>
        <span className="block truncate text-sm font-medium text-foreground/80">{label}</span>
        {hint ? <span className="block text-xs text-muted-foreground">{hint}</span> : null}
      </span>
    </Link>
  );
}

function Panel({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-background">
      <header className="flex items-center justify-between gap-3 border-b border-border px-5 py-3">
        <h2 className="font-display text-sm font-bold uppercase tracking-wide text-foreground/80">{title}</h2>
        {action}
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
}

function AdminHome() {
  const { role, can } = useAppRole();
  const pages = ADMIN_PAGES.filter((p) => can(p.resource, "view"));
  const { data: stats } = useDashboardStats();

  const { data: recentMessages } = useQuery({
    queryKey: ["admin-recent-messages"],
    enabled: can("messages", "view"),
    queryFn: async () => {
      const { data } = await supabase
        .from("contact_messages")
        .select("id, name, organization, request_type, is_read, created_at")
        .order("created_at", { ascending: false })
        .limit(5);
      return data ?? [];
    },
  });

  const { data: recentNews } = useQuery({
    queryKey: ["admin-recent-news"],
    enabled: can("news", "view"),
    queryFn: async () => {
      const { data } = await supabase
        .from("news_posts")
        .select("id, title, is_published, published_at")
        .order("published_at", { ascending: false })
        .limit(5);
      return data ?? [];
    },
  });

  const fmt = (d: string) =>
    new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Tableau de bord</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {role ? (
              <>
                Connecté en tant que <span className="font-semibold text-foreground">{ROLE_LABELS[role]}</span> — seules
                les actions autorisées sont affichées.
              </>
            ) : (
              "Aucun rôle ne vous est attribué pour le moment."
            )}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {can("news", "create") ? (
            <Link
              to="/admin/actualites"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground"
            >
              <Plus className="size-4" /> Nouvel article
            </Link>
          ) : null}
          {can("settings", "update") ? (
            <Link
              to="/admin/parametres"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium"
            >
              <Settings className="size-4" /> Textes du site
            </Link>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          Icon={Mail}
          label="Messages reçus"
          value={stats?.messages ?? "—"}
          hint={stats ? `${stats.unread} non lu${stats.unread > 1 ? "s" : ""}` : undefined}
          to="/admin/messages"
        />
        <StatCard
          Icon={FileText}
          label="Actualités"
          value={stats?.news ?? "—"}
          hint={stats ? `${stats.published} publiée${stats.published > 1 ? "s" : ""}` : undefined}
          to="/admin/actualites"
        />
        <StatCard Icon={Boxes} label="Services" value={stats?.services ?? "—"} to="/admin/contenus" />
        <StatCard
          Icon={Handshake}
          label="Partenaires"
          value={stats?.partners ?? "—"}
          hint={stats ? `${stats.team} membre${stats.team > 1 ? "s" : ""} d'équipe` : undefined}
          to="/admin/contenus"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {can("messages", "view") ? (
          <Panel
            title="Derniers messages"
            action={
              <Link to="/admin/messages" className="text-xs font-semibold text-accent">
                Tout voir
              </Link>
            }
          >
            {recentMessages && recentMessages.length ? (
              <ul className="divide-y divide-border">
                {recentMessages.map((m) => (
                  <li key={m.id} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                    {m.is_read ? (
                      <MailOpen className="size-4 shrink-0 text-muted-foreground" />
                    ) : (
                      <Mail className="size-4 shrink-0 text-accent" />
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">
                        {m.name}
                        {m.organization ? ` · ${m.organization}` : ""}
                      </span>
                      <span className="block text-xs text-muted-foreground">{m.request_type}</span>
                    </span>
                    <span className="shrink-0 text-xs text-muted-foreground">{fmt(m.created_at)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Aucun message pour le moment.</p>
            )}
          </Panel>
        ) : null}

        {can("news", "view") ? (
          <Panel
            title="Dernières actualités"
            action={
              <Link to="/admin/actualites" className="text-xs font-semibold text-accent">
                Tout voir
              </Link>
            }
          >
            {recentNews && recentNews.length ? (
              <ul className="divide-y divide-border">
                {recentNews.map((n) => (
                  <li key={n.id} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                    <FileText className="size-4 shrink-0 text-muted-foreground" />
                    <span className="min-w-0 flex-1 truncate text-sm font-medium">{n.title}</span>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        n.is_published ? "bg-secondary text-primary" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {n.is_published ? "Publié" : "Brouillon"}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Aucun article pour le moment.</p>
            )}
          </Panel>
        ) : null}
      </div>

      <Panel title="Raccourcis">
        <div className="grid gap-4 sm:grid-cols-2">
          {pages.map((c) => (
            <Link
              key={c.to}
              to={c.to}
              className="rounded-lg border border-border p-4 transition-colors hover:border-accent"
            >
              <h3 className="font-display text-sm font-semibold">{c.label}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{c.description}</p>
              <p className="mt-2 text-xs font-medium text-accent">
                {role
                  ? RESOURCE_ACTIONS[c.resource]
                      .filter((a) => can(c.resource, a))
                      .map((a) => ACTION_LABELS[a])
                      .join(" · ")
                  : null}
              </p>
            </Link>
          ))}
        </div>
      </Panel>

      <Panel title="Matrice des permissions">
        <p className="mb-4 text-sm text-muted-foreground">
          Ce que chaque rôle peut faire, page par page et action par action.
        </p>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-secondary">
              <tr>
                <th className="px-5 py-3 font-semibold">Page</th>
                <th className="px-5 py-3 font-semibold">Action</th>
                {ROLE_ORDER.map((r) => (
                  <th key={r} className="px-5 py-3 text-center font-semibold">
                    {ROLE_LABELS[r]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {ADMIN_PAGES.map((page) =>
                RESOURCE_ACTIONS[page.resource].map((action, i) => (
                  <tr key={`${page.resource}-${action}`}>
                    <td className="px-5 py-2.5 font-medium">{i === 0 ? page.label : ""}</td>
                    <td className="px-5 py-2.5 text-muted-foreground">{ACTION_LABELS[action]}</td>
                    {ROLE_ORDER.map((r) => {
                      const allowed = PERMISSIONS[r][page.resource].includes(action);
                      return (
                        <td key={r} className="px-5 py-2.5 text-center">
                          {allowed ? (
                            <Check className="mx-auto size-4 text-accent" aria-label="Autorisé" />
                          ) : (
                            <Minus className="mx-auto size-4 text-muted-foreground/50" aria-label="Non autorisé" />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                )),
              )}
            </tbody>
          </table>
        </div>
      </Panel>

      <p className="flex items-center gap-2 text-xs text-muted-foreground">
        <Users className="size-3.5" /> POLY-SOLUTIONS — espace d'administration
      </p>
    </div>
  );
}
