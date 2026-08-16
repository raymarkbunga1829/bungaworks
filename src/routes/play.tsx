import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { TetrisGame } from "@/components/tetris/tetris-game";

export const Route = createFileRoute("/play")({
  component: PlayPage,
  head: () => ({
    meta: [
      { title: "Play STACK — Bungaworks" },
      {
        name: "description",
        content:
          "Play STACK, a guideline Tetris from Davao. 7-bag, SRS wall kicks, lock delay, hold, and a next-5 queue.",
      },
    ],
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
