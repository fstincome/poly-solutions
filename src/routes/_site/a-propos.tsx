import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";

import { siteContentQuery } from "@/lib/site-queries";
import { Icon } from "@/lib/icon-map";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/_site/a-propos")({
  loader: ({ context }) => context.queryClient.ensureQueryData(siteContentQuery),
  head: () => ({
    meta: [
      { title: "À propos — POLY-SOLUTIONS SPRL, Bujumbura" },
      {
        name: "description",
        content:
          "Histoire, statut juridique et valeurs de POLY-SOLUTIONS SPRL : informaticiens, économistes et agronomes au service de la digitalisation au Burundi.",
      },
      { property: "og:title", content: "À propos — POLY-SOLUTIONS SPRL" },
      { property: "og:description", content: "Une société burundaise à la croisée du numérique et du terrain." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { data } = useSuspenseQuery(siteContentQuery);
  const s = data.settings;

  return (
    <>
      <PageHero eyebrow="Présentation" title={s["about_title"] ?? "À propos"} />

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="leading-relaxed text-muted-foreground">{s["about_p1"]}</p>
            <p className="mt-4 leading-relaxed text-muted-foreground">{s["about_p2"]}</p>
            <div className="mt-8 rounded-2xl border border-border bg-secondary p-6 text-sm">
              <p className="font-semibold text-primary">Identification légale</p>
              <ul className="mt-3 space-y-1.5 text-muted-foreground">
                <li>{s["about_legal"]}</li>
                <li>
                  NIF : {s["nif"]} — RC : {s["rc"]}
                </li>
                <li>Siège : {s["address"]}</li>
              </ul>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {data.values.map((v) => (
              <div key={v.id} className="rounded-2xl border border-border bg-card p-7 transition-shadow hover:shadow-lg">
                <Icon name={v.icon} className="size-7 text-accent" />
                <h2 className="mt-5 font-display text-lg font-semibold">{v.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
