import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { listTopRuns } from "@/lib/scores";

export const Route = createFileRoute("/studio")({ component: StudioPage });

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
          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-subtle">
              Place
            </p>
            <p className="mt-2 text-fg">Davao, Philippines</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-subtle">
              Now
            </p>
            <p className="mt-2 text-fg">STACK — guideline Tetris</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-subtle">
              Stack
            </p>
            <p className="mt-2 text-fg">Canvas, SRS, 7-bag, local + signed-in scores</p>
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
                  Board is offline right now.
                </p>
              ) : !board.data?.length ? (
                <p className="px-4 py-10 text-sm text-muted">
                  No signed-in runs yet. Be the first.
                </p>
              ) : (
                <table className="w-full text-left text-sm">
                  <thead className="bg-surface text-[11px] uppercase tracking-[0.14em] text-subtle">
                    <tr>
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
