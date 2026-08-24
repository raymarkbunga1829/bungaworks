import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { featuredWork, otherWork } from "@/data/work";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/work")({
  component: WorkPage,
  head: () =>
    pageHead({
      title: "Work — Bungaworks",
      description:
        "STACK and other work from Ray Mark Bunga’s studio in Davao — games, a clip tool, and an iPhone scanner.",
      path: "/work",
    }),
});

function WorkPage() {
  return (
    <SiteShell>
      <main id="content">
        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
            <p className="text-[11px] uppercase tracking-[0.2em] text-subtle">
              Work
            </p>
            <h1 className="mt-3 font-display text-5xl tracking-tight sm:text-6xl">
              What is on the bench
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted">
              STACK is the featured game. The rest is other work I have
              actually shipped or published — no extra games invented, no
              second Tetris listing.
            </p>
          </div>
        </section>

        <section className="border-b border-border bg-surface">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-accent">
                Featured · {featuredWork.kind}
              </p>
              <h2 className="mt-3 font-display text-4xl tracking-tight sm:text-5xl">
                {featuredWork.name}
              </h2>
              <p className="mt-4 max-w-lg text-muted">{featuredWork.dek}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                {featuredWork.path ? (
                  <Button asChild>
                    <Link to={featuredWork.path}>Play STACK</Link>
                  </Button>
                ) : null}
                <Button asChild variant="outline">
                  <a
                    href={featuredWork.repo}
                    target="_blank"
                    rel="noreferrer"
                  >
                    GitHub
                  </a>
                </Button>
              </div>
            </div>
            <figure className="overflow-hidden rounded-xl border border-border">
              <img
                src="/still-blocks.jpg"
                alt="Resin tetrominoes on concrete"
                width={1600}
                height={1200}
                className="aspect-[4/3] w-full object-cover"
              />
            </figure>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <p className="text-[11px] uppercase tracking-[0.2em] text-subtle">
              Also
            </p>
            <h2 className="mt-3 font-display text-4xl tracking-tight">
              Other work
            </h2>
            <ul className="mt-10 divide-y divide-border border-y border-border">
              {otherWork.map((item) => (
                <li
                  key={item.slug}
                  className="flex flex-col gap-4 py-7 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.16em] text-subtle">
                      {item.kind}
                    </p>
                    <h3 className="mt-1 font-display text-2xl tracking-tight">
                      {item.name}
                    </h3>
                    <p className="mt-1 max-w-xl text-sm text-muted">
                      {item.dek}
                    </p>
                    {item.note ? (
                      <p className="mt-2 text-xs text-subtle">{item.note}</p>
                    ) : null}
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center gap-3 text-sm">
                    {item.live ? (
                      <a
                        href={item.live}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex min-h-11 items-center text-fg hover:opacity-80"
                      >
                        Live
                      </a>
                    ) : null}
                    <a
                      href={item.repo}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-11 items-center text-muted hover:text-fg"
                    >
                      GitHub
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
