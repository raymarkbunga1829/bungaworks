import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { TetrisGame } from "@/components/tetris/tetris-game";
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
      <main>
        <TetrisGame />
      </main>
    </SiteShell>
  );
}
