import { createFileRoute, Link } from "@tanstack/react-router";
import { essays, readingMinutes } from "@/data/journal";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/journal/")({
  component: JournalIndex,
  head: () =>
    pageHead({
      title: "Journal — Bungaworks",
      description:
        "Development notes for STACK — rotation, feel, and building a guideline client from Davao.",
      path: "/journal",
    }),
});

function JournalIndex() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
      <p className="text-[11px] uppercase tracking-[0.2em] text-subtle">Journal</p>
      <h1 className="mt-3 font-display text-5xl tracking-tight">Notes from the well</h1>
      <p className="mt-4 max-w-lg text-muted">
        Development notes for STACK — rotation, feel, and building a guideline
        client from Davao.
      </p>
      <ul className="mt-12 divide-y divide-border border-y border-border">
        {essays.map((e) => (
          <li key={e.slug} className="py-8">
            <Link to="/journal/$slug" params={{ slug: e.slug }} className="block">
              <p className="text-sm text-subtle">
                {e.date} · {readingMinutes(e)} min
              </p>
              <h2 className="mt-2 font-display text-3xl tracking-tight">{e.title}</h2>
              <p className="mt-2 text-muted">{e.dek}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
