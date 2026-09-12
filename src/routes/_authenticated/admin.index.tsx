import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Minus } from "lucide-react";

import { useAppRole } from "@/hooks/use-app-role";
import { ROLE_LABELS, ROLE_ORDER } from "@/lib/roles";
import { ACTION_LABELS, ADMIN_PAGES, PERMISSIONS, RESOURCE_ACTIONS } from "@/lib/permissions";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminHome,
});

function AdminHome() {
  const { role, can } = useAppRole();
  const pages = ADMIN_PAGES.filter((p) => can(p.resource, "view"));

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Bienvenue dans l'espace d'administration</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {role ? (
          <>
            Vous êtes connecté en tant que <span className="font-semibold text-foreground">{ROLE_LABELS[role]}</span>.
            Les actions non autorisées pour votre rôle n'apparaissent pas.
          </>
        ) : (
          "Aucun rôle ne vous est attribué pour le moment."
        )}
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {pages.map((c) => (
          <Link
            key={c.to}
            to={c.to}
            className="rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-lg"
          >
            <h2 className="font-display text-lg font-semibold">{c.label}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{c.description}</p>
            <p className="mt-3 text-xs font-medium text-accent">
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

      <section className="mt-12">
        <h2 className="font-display text-lg font-semibold">Matrice des permissions</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Ce que chaque rôle peut faire, page par page et action par action.
        </p>

        <div className="mt-5 overflow-x-auto rounded-2xl border border-border">
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
      </section>
    </div>
  );
}
