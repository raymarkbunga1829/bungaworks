import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { listTopRuns } from "@/lib/scores";

import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/studio")({
  component: StudioPage,
  head: () =>
    pageHead({
      title: "Studio — Bungaworks",
      description:
        "Ray Mark Bunga, game developer in Davao. Bungaworks is the studio. STACK is the first game.",
      path: "/studio",
    }),
});

const facts = [
  { k: "Place", v: "Davao, Philippines" },
  { k: "Now", v: "STACK — guideline Tetris" },
  { k: "Stack", v: "Canvas, SRS, 7-bag, local + signed-in scores" },
];

const principles = [
  {
    t: "Correct before pretty",
    d: "The grid, the kicks, the lock delay. If those are wrong, no skin will save the well.",
  },
  {
    t: "Feel is a number",
    d: "DAS, ARR, gravity. I change one value at a time and play until my hands agree.",
  },
  {
    t: "Small enough to finish",
    d: "A one-person studio ships when the game can be practiced. Then the next one starts.",
  },
];

function StudioPage() {
  const board = useQuery({
    queryKey: ["stack-top"],
    queryFn: () => listTopRuns(),
  });

  return (
    <SiteShell>
      <main>
        <section className="border-b border-border">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:py-24">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-subtle">
                Studio
              </p>
              <h1 className="mt-3 font-display text-5xl tracking-tight sm:text-6xl">
                Ray Mark Bunga
              </h1>
              <p className="mt-5 max-w-xl text-lg text-muted">
                Game developer in Davao. Bungaworks is the name on the door.
                STACK is the first game — a guideline Tetris client with the
                systems I actually want to play.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild>
                  <Link to="/play">Play STACK</Link>
                </Button>
                <Button asChild variant="outline">
                  <a
                    href="https://x.com/raymarkbunga18"
                    target="_blank"
                    rel="noreferrer"
                  >
                    @raymarkbunga18
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <a
                    href="https://github.com/raymarkbunga1829/bungaworks"
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
                src="/studio-desk.jpg"
                alt="Night desk in Davao"
                className="aspect-[3/2] w-full object-cover"
              />
            </figure>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-3">
          {facts.map((f) => (
            <div key={f.k}>
              <p className="text-[11px] uppercase tracking-[0.16em] text-subtle">
                {f.k}
              </p>
              <p className="mt-2 text-fg">{f.v}</p>
            </div>
          ))}
        </section>

        <section className="border-t border-border">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <p className="text-[11px] uppercase tracking-[0.2em] text-subtle">
              How I work
            </p>
            <h2 className="mt-3 font-display text-4xl tracking-tight">
              Three rules for the well
            </h2>
            <ul className="mt-10 grid gap-8 md:grid-cols-3">
              {principles.map((p) => (
                <li key={p.t} className="border-t border-border pt-5">
                  <h3 className="font-display text-2xl tracking-tight">{p.t}</h3>
                  <p className="mt-3 text-sm text-muted">{p.d}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-t border-border bg-surface">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <p className="text-[11px] uppercase tracking-[0.2em] text-subtle">
              Work
            </p>
            <h2 className="mt-3 font-display text-4xl tracking-tight">
              On the bench
            </h2>
            <ul className="mt-8 divide-y divide-border border-y border-border">
              <li className="flex flex-col gap-3 py-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-display text-2xl tracking-tight">STACK</p>
                  <p className="mt-1 text-sm text-muted">
                    Guideline Tetris. 10×20, 7-bag, SRS, lock delay, hold.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] uppercase tracking-[0.16em] text-subtle">
                    Shipped
                  </span>
                  <Button asChild size="sm">
                    <Link to="/play">Play</Link>
                  </Button>
                </div>
              </li>
              <li className="flex flex-col gap-2 py-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-display text-2xl tracking-tight">Next</p>
                  <p className="mt-1 text-sm text-muted">
                    Untitled. Same studio, same rule: finish the systems first.
                  </p>
                </div>
                <span className="text-[11px] uppercase tracking-[0.16em] text-subtle">
                  In notes
                </span>
              </li>
            </ul>
          </div>
        </section>

        <section className="border-t border-border">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-subtle">
                  Board
                </p>
                <h2 className="mt-3 font-display text-4xl tracking-tight">
                  Signed-in runs
                </h2>
                <p className="mt-2 max-w-md text-sm text-muted">
                  Sign in before a run to land on the studio board. Guests keep
                  a local best on this device.
                </p>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link to="/login">Sign in</Link>
              </Button>
            </div>
            <div className="mt-8 overflow-hidden rounded-lg border border-border">
              {board.isPending ? (
                <p className="px-4 py-10 text-sm text-muted">Loading board…</p>
              ) : board.isError ? (
                <p className="px-4 py-10 text-sm text-muted">
                  Board is offline right now. Play anyway — your best still
                  saves on this device.
                </p>
              ) : !board.data?.length ? (
                <p className="px-4 py-10 text-sm text-muted">
                  No signed-in runs yet. Sign in, play a game, and you will be
                  first on this list.
                </p>
              ) : (
                <table className="w-full text-left text-sm">
                  <thead className="bg-surface text-[11px] uppercase tracking-[0.14em] text-subtle">
                    <tr>
                      <th className="px-4 py-3 font-medium">#</th>
                      <th className="px-4 py-3 font-medium">Player</th>
                      <th className="px-4 py-3 font-medium">Score</th>
                      <th className="hidden px-4 py-3 font-medium sm:table-cell">
                        Lines
                      </th>
                      <th className="hidden px-4 py-3 font-medium sm:table-cell">
                        Level
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {board.data.map((row, i) => (
                      <tr key={`${row.name}-${row.score}-${i}`}>
                        <td className="px-4 py-3 font-mono tabular-nums text-subtle">
                          {i + 1}
                        </td>
                        <td className="px-4 py-3">{row.name}</td>
                        <td className="px-4 py-3 font-mono tabular-nums">
                          {row.score.toLocaleString()}
                        </td>
                        <td className="hidden px-4 py-3 font-mono tabular-nums sm:table-cell">
                          {row.lines}
                        </td>
                        <td className="hidden px-4 py-3 font-mono tabular-nums sm:table-cell">
                          {row.level}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
