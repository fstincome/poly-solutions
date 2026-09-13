import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { siteContentQuery, newsListQuery } from "@/lib/site-queries";
import { Icon } from "@/lib/icon-map";
import heroImg from "@/assets/hero.jpg";

export const Route = createFileRoute("/_site/")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(siteContentQuery),
      context.queryClient.ensureQueryData(newsListQuery),
    ]);
  },
  head: () => ({
    meta: [
      { title: "POLY-SOLUTIONS SPRL — Transformation numérique au Burundi" },
      {
        name: "description",
        content:
          "POLY-SOLUTIONS SPRL, Bujumbura : logiciels sur mesure, digitalisation des processus, FinTech et outil A-CAT pour le financement agricole.",
      },
      { property: "og:title", content: "POLY-SOLUTIONS SPRL — Transformation numérique au Burundi" },
      {
        property: "og:description",
        content:
          "Développement de logiciels sur mesure, digitalisation des processus et solutions FinTech au Burundi.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { data } = useSuspenseQuery(siteContentQuery);
  const { data: news } = useSuspenseQuery(newsListQuery);
  const s = data.settings;

  const stats = [1, 2, 3, 4]
    .map((i) => ({ k: s[`stat${i}_value`], v: s[`stat${i}_label`] }))
    .filter((x) => x.k);

  return (
    <>
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <img
          src={heroImg}
          alt="Ingénieurs de POLY-SOLUTIONS au travail à Bujumbura"
          width={1600}
          height={1008}
          className="absolute inset-0 size-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,color-mix(in_oklab,var(--accent)_35%,transparent),transparent_60%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-[1.15fr_0.85fr] lg:py-32">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em]">
              {s["hero_eyebrow"]}
            </span>
            <h1 className="mt-6 font-display text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              {s["hero_title"]}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-primary-foreground/80">{s["hero_subtitle"]}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90"
              >
                {s["hero_cta"]} <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/realisations"
                className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/30 px-7 py-3.5 text-sm font-semibold transition-colors hover:bg-primary-foreground/10"
              >
                Voir nos réalisations
              </Link>
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-4 self-end">
            {stats.map((st) => (
              <div key={st.k} className="rounded-2xl border border-primary-foreground/15 bg-primary-foreground/5 p-5">
                <dt className="font-display text-3xl font-bold text-accent">{st.k}</dt>
                <dd className="mt-1 text-sm text-primary-foreground/75">{st.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Pôle d'expertise</p>
            <h2 className="mt-3 max-w-3xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
              {s["services_title"]}
            </h2>
          </div>
          <Link to="/services" className="text-sm font-semibold text-accent hover:underline">
            Tous nos services →
          </Link>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {data.services.slice(0, 4).map((svc, i) => (
            <article key={svc.id} className="rounded-3xl border border-border bg-card p-8">
              <div className="flex items-start justify-between">
                <Icon name={svc.icon} className="size-8 text-accent" />
                <span className="font-display text-4xl font-bold text-border">0{i + 1}</span>
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold">{svc.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{svc.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-secondary py-20">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Réalisations</p>
          <h2 className="mt-3 max-w-3xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {s["projects_title"]}
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {data.projects.slice(0, 2).map((p) => (
              <article key={p.id} className="rounded-3xl border border-border bg-card p-8">
                <span className="inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                  {p.tag}
                </span>
                <h3 className="mt-4 font-display text-xl font-semibold">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.description}</p>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {p.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-accent" /> {pt}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <Link to="/realisations" className="mt-8 inline-block text-sm font-semibold text-accent hover:underline">
            Toutes nos réalisations →
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Produit phare</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              A-CAT — Agri-Crédit Intelligence
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Système digitalisé de gestion et de suivi des crédits agricoles, conçu pour les institutions de
              microfinance du Burundi.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
              {[
                "Gestion centralisée des clients agricoles",
                "Suivi terrain avec géolocalisation",
                "Tableau de bord complet et analytique",
              ].map((pt) => (
                <li key={pt} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-accent" /> {pt}
                </li>
              ))}
            </ul>
            <Link
              to="/contact"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90"
            >
              Demander une démonstration <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-xl">
            <img
              src={acatPreview.url}
              alt="Aperçu de l'interface de connexion de la plateforme A-CAT Agri-Crédit Intelligence"
              width={1536}
              height={780}
              loading="lazy"
              className="w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-primary py-16 text-primary-foreground">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-6">
          <div>
            <h2 className="font-display text-2xl font-bold sm:text-3xl">{s["contact_title"]}</h2>
            <p className="mt-2 max-w-2xl text-primary-foreground/80">{s["contact_intro"]}</p>
          </div>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-accent-foreground"
          >
            Nous contacter <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
