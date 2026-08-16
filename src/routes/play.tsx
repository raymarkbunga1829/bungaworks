import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { TetrisGame } from "@/components/tetris/tetris-game";

export const Route = createFileRoute("/play")({ component: PlayPage });

function PlayPage() {
  return (
    <SiteShell bare>
      <main>
        <TetrisGame />
      </main>
    </SiteShell>
  );
}
