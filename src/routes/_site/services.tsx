import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CheckCircle2 } from "lucide-react";

import { siteContentQuery } from "@/lib/site-queries";
import { Icon } from "@/lib/icon-map";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/_site/services")({
  loader: ({ context }) => context.queryClient.ensureQueryData(siteContentQuery),
  head: () => ({
    meta: [
      { title: "Services — Logiciels sur mesure & FinTech | POLY-SOLUTIONS" },
      {
        name: "description",
        content:
          "Développement web et mobile, digitalisation des processus et FinTech, intégration de systèmes et conseil IT à Bujumbura.",
      },
      { property: "og:title", content: "Nos services — POLY-SOLUTIONS SPRL" },
      { property: "og:description", content: "Quatre domaines pour couvrir tout le cycle de votre projet numérique." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const { data } = useSuspenseQuery(siteContentQuery);
  const s = data.settings;

  return (
    <>
      <PageHero eyebrow="Pôle d'expertise" title={s["services_title"] ?? "Nos services"} intro={s["services_intro"]} />

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-6 md:grid-cols-2">
          {data.services.map((svc, i) => (
            <article key={svc.id} className="rounded-3xl border border-border bg-card p-8">
              <div className="flex items-start justify-between">
                <Icon name={svc.icon} className="size-8 text-accent" />
                <span className="font-display text-4xl font-bold text-border">0{i + 1}</span>
              </div>
              <h2 className="mt-5 font-display text-xl font-semibold">{svc.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{svc.description}</p>
              <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
                {svc.points.map((p) => (
                  <li key={p} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-accent" /> {p}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <Link
          to="/contact"
          className="mt-12 inline-flex rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-accent-foreground"
        >
          Demander un devis
        </Link>
      </section>
    </>
  );
}
