export function PageHero({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro?: string | undefined;
}) {
  return (
    <section className="border-b border-border bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{eyebrow}</p>
        <h1 className="mt-4 max-w-4xl font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {intro ? (
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-primary-foreground/80">{intro}</p>
        ) : null}
      </div>
    </section>
  );
}
