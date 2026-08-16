import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteShell } from "@/components/site-shell";
import { LocalBest } from "@/components/local-best";
import { essays } from "@/data/journal";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/")({
  component: Home,
  head: () =>
    pageHead({
      title: "Bungaworks — STACK from Davao",
      description:
        "Ray Mark Bunga’s studio in Davao. Play STACK, a guideline Tetris with 7-bag, SRS, hold, and lock delay.",
      path: "/",
    }),
});

const specs = [
  { k: "Well", v: "10 × 20" },
  { k: "Randomizer", v: "7-bag" },
  { k: "Rotation", v: "SRS + kicks" },
  { k: "Lock", v: "500ms / 15" },
  { k: "Queue", v: "Hold + next 5" },
  { k: "Feel", v: "DAS 167 · ARR 33" },
];

const keys = [
  { k: "A D · ← →", v: "Move" },
  { k: "Z / X · ↑", v: "Rotate" },
  { k: "S · ↓", v: "Soft drop" },
  { k: "Space", v: "Hard drop" },
  { k: "C · Shift", v: "Hold" },
  { k: "Esc", v: "Pause" },
];

function Home() {
  return (
    <SiteShell>
      <main>
        <section className="relative min-h-[78svh] overflow-hidden border-b border-border">
          <img
            src="/hero-studio.jpg"
            alt=""
            width={1792}
            height={1008}
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/55 to-bg/20" />
          <div className="relative mx-auto flex min-h-[78svh] max-w-6xl flex-col justify-end px-4 pb-12 pt-24 sm:px-6 sm:pb-16">
            <p className="reveal text-[11px] uppercase tracking-[0.22em] text-accent">
              Shipped · STACK
            </p>
            <h1 className="reveal reveal-delay-1 mt-3 max-w-3xl font-display text-[3.4rem] leading-[0.92] tracking-tight sm:text-7xl">
              A guideline well from Davao.
            </h1>
            <p className="reveal reveal-delay-2 mt-5 max-w-md text-base text-fg/80 sm:text-lg">
              Ray Mark Bunga’s first shipped game. 7-bag, Super Rotation, lock
              delay, ghost, hold. Built to be practiced, not just clicked.
            </p>
            <div className="reveal reveal-delay-2 mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <Link to="/play">Play STACK</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/studio">The studio</Link>
              </Button>
            </div>
            <LocalBest className="reveal reveal-delay-2 mt-5 text-sm text-muted" />
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-subtle">
              01 — The game
            </p>
            <h2 className="mt-3 font-display text-4xl tracking-tight sm:text-5xl">
              STACK is modern Tetris, complete.
            </h2>
            <p className="mt-5 max-w-xl text-muted">
              The board is a 2D array. Rendering is a thin view. Every move is
              tested before it commits. That is how T-spins stay honest and why
              the I-piece fits a one-wide well.
            </p>
            <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-3">
              {specs.map((s) => (
                <div key={s.k} className="bg-surface px-4 py-4">
                  <dt className="text-[11px] uppercase tracking-[0.16em] text-subtle">
                    {s.k}
                  </dt>
                  <dd className="mt-1 font-medium text-fg">{s.v}</dd>
                </div>
              ))}
            </dl>
            <Link
              to="/play"
              className="mt-8 inline-flex min-h-11 items-center gap-2 text-sm text-fg hover:opacity-80"
            >
              Open the well <ArrowRight className="size-4" />
            </Link>
          </div>
          <figure className="overflow-hidden rounded-xl border border-border bg-surface">
            <img
              src="/still-blocks.jpg"
              alt="Resin tetrominoes on concrete"
              width={1600}
              height={1200}
              loading="lazy"
              decoding="async"
              className="aspect-[4/3] h-full w-full object-cover"
            />
          </figure>
        </section>

        <section className="border-y border-border bg-surface">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
            <p className="text-[11px] uppercase tracking-[0.2em] text-subtle">
              02 — Hands
            </p>
            <h2 className="mt-3 font-display text-4xl tracking-tight">
              How it plays
            </h2>
            <p className="mt-4 max-w-xl text-muted">
              Keyboard on a desk. Swipe on a phone — left and right to shift,
              tap to rotate, swipe down to drop, swipe up to hold.
            </p>
            <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {keys.map((row) => (
                <div
                  key={row.v}
                  className="rounded-md border border-border bg-bg px-3 py-3"
                >
                  <dt className="font-mono text-xs text-fg">{row.k}</dt>
                  <dd className="mt-1 text-[11px] uppercase tracking-[0.14em] text-subtle">
                    {row.v}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-20">
          <figure className="overflow-hidden rounded-xl border border-border">
            <img
              src="/studio-desk.jpg"
              alt="Night studio desk in Davao"
              width={1728}
              height={1152}
              loading="lazy"
              decoding="async"
              className="aspect-[3/2] w-full object-cover"
            />
          </figure>
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-subtle">
              03 — Studio
            </p>
            <h2 className="mt-3 font-display text-4xl tracking-tight">
              Bungaworks
            </h2>
            <p className="mt-4 max-w-md text-muted">
              A one-person studio in Davao, Philippines. I build small games
              with correct systems — timing, input, and a well you can trust.
              STACK is the first thing I am putting in other people’s hands.
            </p>
            <Link
              to="/studio"
              className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm text-fg hover:opacity-80"
            >
              About the studio <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>

        <section className="border-t border-border">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-subtle">
                  04 — Journal
                </p>
                <h2 className="mt-3 font-display text-4xl tracking-tight">
                  Notes from the well
                </h2>
              </div>
              <Link
                to="/journal"
                className="hidden min-h-11 items-center text-sm text-muted hover:text-fg sm:inline-flex"
              >
                All notes
              </Link>
            </div>
            <ul className="mt-10 divide-y divide-border border-y border-border">
              {essays.slice(0, 4).map((e) => (
                <li key={e.slug}>
                  <Link
                    to="/journal/$slug"
                    params={{ slug: e.slug }}
                    className="group flex flex-col gap-2 py-6 sm:flex-row sm:items-baseline sm:justify-between sm:gap-10"
                  >
                    <span>
                      <span className="block font-display text-2xl tracking-tight group-hover:opacity-80">
                        {e.title}
                      </span>
                      <span className="mt-1 block max-w-xl text-sm text-muted">
                        {e.dek}
                      </span>
                    </span>
                    <span className="shrink-0 text-sm text-subtle">{e.date}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-t border-border bg-surface">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-14 sm:flex-row sm:items-center sm:px-6">
            <div>
              <h2 className="font-display text-3xl tracking-tight sm:text-4xl">
                The well is open.
              </h2>
              <p className="mt-2 max-w-md text-muted">
                One run. Guideline rules. Your score stays on this device unless
                you sign in.
              </p>
            </div>
            <Button asChild size="lg">
              <Link to="/play">Play STACK</Link>
            </Button>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
