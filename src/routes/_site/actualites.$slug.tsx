import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";

import { newsPostQuery } from "@/lib/site-queries";

export const Route = createFileRoute("/_site/actualites/$slug")({
  loader: async ({ context, params }) => {
    const post = await context.queryClient.ensureQueryData(newsPostQuery(params.slug));
    if (!post) throw notFound();
    return { title: post.title, excerpt: post.excerpt };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Actualité indisponible — POLY-SOLUTIONS" }, { name: "robots", content: "noindex" }] };
    }
    return {
      meta: [
        { title: `${loaderData.title} — POLY-SOLUTIONS SPRL` },
        { name: "description", content: loaderData.excerpt },
        { property: "og:title", content: loaderData.title },
        { property: "og:description", content: loaderData.excerpt },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: PostNotFound,
  component: PostPage,
});

function PostNotFound() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24 text-center">
      <h1 className="font-display text-2xl font-bold">Actualité introuvable</h1>
      <Link to="/actualites" className="mt-4 inline-block text-sm font-semibold text-accent hover:underline">
        Retour aux actualités
      </Link>
    </div>
  );
}

function PostPage() {
  const { slug } = Route.useParams();
  const { data: post } = useSuspenseQuery(newsPostQuery(slug));
  if (!post) return <PostNotFound />;

  return (
    <article className="mx-auto max-w-3xl px-6 py-20">
      <Link to="/actualites" className="text-sm font-semibold text-accent hover:underline">
        ← Actualités
      </Link>
      <p className="mt-6 text-xs uppercase tracking-[0.2em] text-muted-foreground">
        {new Date(post.published_at).toLocaleDateString("fr-FR", { dateStyle: "long" })}
      </p>
      <h1 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">{post.title}</h1>
      {post.cover_url ? (
        <img src={post.cover_url} alt="" className="mt-8 aspect-video w-full rounded-2xl object-cover" />
      ) : null}
      <p className="mt-8 text-lg leading-relaxed text-muted-foreground">{post.excerpt}</p>
      <div className="mt-6 space-y-4 leading-relaxed text-foreground/90">
        {post.body.split("\n").filter(Boolean).map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </article>
  );
}
