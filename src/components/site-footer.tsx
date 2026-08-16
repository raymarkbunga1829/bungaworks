import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-end sm:justify-between sm:px-6">
        <div>
          <p className="font-display text-2xl tracking-tight">Bungaworks</p>
          <p className="mt-1 max-w-sm text-sm text-muted">
            Indie games from Davao. STACK is the first well — guideline Tetris,
            built to be practiced.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
          <Link to="/play" className="hover:text-fg">
            Play STACK
          </Link>
          <Link to="/journal" className="hover:text-fg">
            Journal
          </Link>
          <Link to="/studio" className="hover:text-fg">
            Studio
          </Link>
          <a
            href="https://x.com/raymarkbunga18"
            target="_blank"
            rel="noreferrer"
            className="hover:text-fg"
          >
            X
          </a>
        </div>
      </div>
    </footer>
  );
}
