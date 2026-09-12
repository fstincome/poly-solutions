import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Mail } from "lucide-react";

import { siteContentQuery } from "@/lib/site-queries";
import { Icon } from "@/lib/icon-map";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/_site/equipe")({
  loader: ({ context }) => context.queryClient.ensureQueryData(siteContentQuery),
  head: () => ({
    meta: [
      { title: "Équipe de direction et experts — POLY-SOLUTIONS SPRL" },
      {
        name: "description",
        content:
          "Direction académique, ingénieurs logiciels, économistes et agronomes de POLY-SOLUTIONS SPRL à Bujumbura.",
      },
      { property: "og:title", content: "Notre équipe — POLY-SOLUTIONS SPRL" },
      { property: "og:description", content: "Une direction académique et des experts de terrain." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TeamPage,
});

function TeamPage() {
  const { data } = useSuspenseQuery(siteContentQuery);
  const s = data.settings;
  const direction = data.team.filter((m) => m.category === "direction");
  const poles = data.team.filter((m) => m.category === "pole");

  return (
    <>
      <PageHero eyebrow="Équipe" title={s["team_title"] ?? "Notre équipe"} intro={s["team_intro"]} />

      <section className="mx-auto max-w-7xl px-6 py-20">
        {direction.length > 0 && (
        <h2 className="font-display text-2xl font-bold">Direction et experts techniques</h2>
        )}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {direction.map((m) => (
            <article key={m.id} className="rounded-2xl border border-border bg-card p-6">
              <Icon name={m.icon} className="size-6 text-accent" />
              <h3 className="mt-4 font-display text-base font-semibold leading-snug">{m.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{m.role}</p>
              {m.email ? (
                <a
                  href={`mailto:${m.email}`}
                  className="mt-3 inline-flex items-center gap-2 text-xs font-medium text-accent hover:underline"
                >
                  <Mail className="size-3.5" /> {m.email}
                </a>
              ) : null}
            </article>
          ))}
        </div>

        {poles.length > 0 && (
          <>
            <h2 className="mt-16 font-display text-2xl font-bold">Pôles d'expertise</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {poles.map((m) => (
                <article key={m.id} className="rounded-2xl border border-border bg-secondary p-7">
                  <Icon name={m.icon} className="size-7 text-accent" />
                  <h3 className="mt-4 font-display text-lg font-semibold">{m.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{m.description}</p>
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </>
  );
}
