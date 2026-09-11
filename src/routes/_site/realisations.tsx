import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CheckCircle2 } from "lucide-react";

import { siteContentQuery } from "@/lib/site-queries";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/_site/realisations")({
  loader: ({ context }) => context.queryClient.ensureQueryData(siteContentQuery),
  head: () => ({
    meta: [
      { title: "Réalisations & A-CAT — POLY-SOLUTIONS SPRL" },
      {
        name: "description",
        content:
          "Outil A-CAT digitalisé, projets MAVC (ICCO) et PADFIR (Cordaid), financement « rayonnante » et assurance agricole avec Inkinzo.",
      },
      { property: "og:title", content: "Réalisations et produits phares — POLY-SOLUTIONS" },
      { property: "og:description", content: "Des projets déployés sur le terrain avec les IMF burundaises." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RealisationsPage,
});

function RealisationsPage() {
  const { data } = useSuspenseQuery(siteContentQuery);
  const s = data.settings;

  return (
    <>
      <PageHero
        eyebrow="Réalisations"
        title={s["projects_title"] ?? "Réalisations"}
        intro={s["projects_intro"]}
      />

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-6 md:grid-cols-2">
          {data.projects.map((p) => (
            <article key={p.id} className="rounded-3xl border border-border bg-card p-8">
              <span className="inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                {p.tag}
              </span>
              <h2 className="mt-4 font-display text-xl font-semibold">{p.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.description}</p>
              <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
                {p.points.map((pt) => (
                  <li key={pt} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-accent" /> {pt}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-secondary py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Résultats obtenus sur le terrain</h2>
          <ul className="mt-8 grid gap-4 md:grid-cols-2">
            {data.achievements.map((a) => (
              <li key={a.id} className="flex items-start gap-3 rounded-2xl border border-border bg-card p-5 text-sm">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-accent" />
                <span className="text-muted-foreground">{a.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
