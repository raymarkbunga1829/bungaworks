import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { STACK_GAME_REPO, STACK_GAME_URL } from "@/lib/stack-game";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/play")({
  component: PlayPage,
  head: () =>
    pageHead({
      title: "Play STACK — Bungaworks",
      description:
        "Play STACK, a guideline Tetris from Davao. 7-bag, SRS wall kicks, lock delay, hold, and a next-5 queue.",
      path: "/play",
    }),
});

function PlayPage() {
  return (
    <SiteShell bare>
      <main className="flex min-h-0 flex-1 flex-col">
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-4 py-2 sm:px-6">
          <p className="truncate text-sm text-muted">
            STACK — the shipped game
          </p>
          <div className="flex shrink-0 items-center gap-4 text-sm">
            <a
              href={STACK_GAME_REPO}
              target="_blank"
              rel="noreferrer"
              className="text-muted hover:text-fg"
            >
              GitHub
            </a>
            <a
              href={STACK_GAME_URL}
              target="_blank"
              rel="noreferrer"
              className="text-fg hover:opacity-80"
            >
              Full screen
            </a>
          </div>
        </div>
        <iframe
          title="STACK"
          src={STACK_GAME_URL}
          className="min-h-0 w-full flex-1 border-0 bg-well"
          allow="fullscreen; autoplay; gamepad; clipboard-write"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </main>
    </SiteShell>
  );
}
