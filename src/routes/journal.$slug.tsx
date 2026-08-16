import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { essays, getEssay, readingMinutes } from "@/data/journal";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/journal/$slug")({
  loader: ({ params }) => {
    const essay = getEssay(params.slug);
    if (!essay) throw notFound();
    return essay;
  },
  head: ({ loaderData }) =>
    pageHead({
      title: loaderData
        ? `${loaderData.title} — Bungaworks`
        : "Journal — Bungaworks",
      description: loaderData?.dek ?? "Notes from the well.",
      path: loaderData ? `/journal/${loaderData.slug}` : "/journal",
      type: "article",
    }),
  component: EssayPage,
});

function EssayPage() {
  const essay = Route.useLoaderData();
  const idx = essays.findIndex((e) => e.slug === essay.slug);
  const prev = idx > 0 ? essays[idx - 1] : undefined;
  const next = idx >= 0 && idx < essays.length - 1 ? essays[idx + 1] : undefined;

  return (
    <article className="mx-auto max-w-2xl px-4 py-14 sm:px-6 sm:py-20">
      <Link to="/journal" className="text-sm text-muted hover:text-fg">
        Journal
      </Link>
      <p className="mt-8 text-sm text-subtle">
        {essay.date} · {readingMinutes(essay)} min read
      </p>
      <h1 className="mt-2 font-display text-4xl tracking-tight sm:text-5xl">
        {essay.title}
      </h1>
      <p className="mt-4 text-lg text-muted">{essay.dek}</p>
      <div className="mt-10 space-y-6 text-[1.05rem] leading-relaxed text-fg/90">
        {essay.body.map((p) => (
          <p key={p.slice(0, 24)}>{p}</p>
        ))}
      </div>
      <nav className="mt-16 flex justify-between gap-6 border-t border-border pt-8 text-sm">
        {prev ? (
          <Link
            to="/journal/$slug"
            params={{ slug: prev.slug }}
            className="text-muted hover:text-fg"
          >
            Previous
            <span className="mt-1 block font-display text-xl text-fg">{prev.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            to="/journal/$slug"
            params={{ slug: next.slug }}
            className="text-right text-muted hover:text-fg"
          >
            Next
            <span className="mt-1 block font-display text-xl text-fg">{next.title}</span>
          </Link>
        ) : null}
      </nav>
    </article>
  );
}
