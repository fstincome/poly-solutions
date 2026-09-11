import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";

import { siteContentQuery, newsListQuery } from "@/lib/site-queries";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/_site/actualites/")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(siteContentQuery),
      context.queryClient.ensureQueryData(newsListQuery),
    ]);
  },
  head: () => ({
    meta: [
      { title: "Actualités — POLY-SOLUTIONS SPRL" },
      {
        name: "description",
        content: "Nouvelles, déploiements et missions de terrain de POLY-SOLUTIONS SPRL à Bujumbura.",
      },
      { property: "og:title", content: "Actualités — POLY-SOLUTIONS SPRL" },
      { property: "og:description", content: "Nos dernières nouvelles et missions de terrain." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NewsPage,
});

function NewsPage() {
  const { data } = useSuspenseQuery(siteContentQuery);
  const { data: news } = useSuspenseQuery(newsListQuery);
  const s = data.settings;

  return (
    <>
      <PageHero eyebrow="Actualités" title={s["news_title"] ?? "Actualités"} intro={s["news_intro"]} />

      <section className="mx-auto max-w-7xl px-6 py-20">
        {news.length === 0 ? (
          <p className="text-muted-foreground">Aucune actualité publiée pour le moment.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {news.map((n) => (
              <Link
                key={n.id}
                to="/actualites/$slug"
                params={{ slug: n.slug }}
                className="flex flex-col rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-lg"
              >
                {n.cover_url ? (
                  <img src={n.cover_url} alt="" className="mb-4 aspect-video w-full rounded-xl object-cover" />
                ) : null}
                <p className="text-xs text-muted-foreground">
                  {new Date(n.published_at).toLocaleDateString("fr-FR", { dateStyle: "long" })}
                </p>
                <h2 className="mt-2 font-display text-lg font-semibold">{n.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{n.excerpt}</p>
                <span className="mt-4 text-sm font-semibold text-accent">Lire la suite →</span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
