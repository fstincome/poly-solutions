import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";

import { siteContentQuery } from "@/lib/site-queries";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/_site/partenaires")({
  loader: ({ context }) => context.queryClient.ensureQueryData(siteContentQuery),
  head: () => ({
    meta: [
      { title: "Partenaires & réseau IMF — POLY-SOLUTIONS SPRL" },
      {
        name: "description",
        content:
          "Institutions de microfinance et partenaires internationaux accompagnés par POLY-SOLUTIONS : CECM, UCODE, ISHAKA, Cordaid, ICCO et bien d'autres.",
      },
      { property: "og:title", content: "Partenaires et réseau IMF — POLY-SOLUTIONS" },
      { property: "og:description", content: "Un réseau d'institutions et de partenaires de terrain au Burundi." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PartnersPage,
});

function PartnersPage() {
  const { data } = useSuspenseQuery(siteContentQuery);
  const s = data.settings;
  const categories = [...new Set(data.partners.map((p) => p.category))];

  return (
    <>
      <PageHero eyebrow="Partenaires" title={s["partners_title"] ?? "Partenaires"} intro={s["partners_intro"]} />

      <section className="mx-auto max-w-7xl space-y-12 px-6 py-20">
        {categories.map((cat) => (
          <div key={cat}>
            <h2 className="font-display text-xl font-semibold">{cat}</h2>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {data.partners
                .filter((p) => p.category === cat)
                .map((p) => (
                  <div
                    key={p.id}
                    className="rounded-xl border border-border bg-card px-5 py-6 text-center text-sm font-semibold text-primary"
                  >
                    {p.name}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
