import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-display text-2xl tracking-tight">Bungaworks</p>
            <p className="mt-1 max-w-sm text-sm text-muted">
              Indie games from Davao. STACK is the first well — guideline Tetris,
              built to be practiced.
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
            <Link to="/play" className="min-h-11 inline-flex items-center hover:text-fg">
              Play STACK
            </Link>
            <Link to="/journal" className="min-h-11 inline-flex items-center hover:text-fg">
              Journal
            </Link>
            <Link to="/studio" className="min-h-11 inline-flex items-center hover:text-fg">
              Studio
            </Link>
            <a
              href="https://x.com/raymarkbunga18"
              target="_blank"
              rel="noreferrer"
              className="min-h-11 inline-flex items-center hover:text-fg"
            >
              X
            </a>
            <a
              href="https://github.com/raymarkbunga1829/bungaworks"
              target="_blank"
              rel="noreferrer"
              className="min-h-11 inline-flex items-center hover:text-fg"
            >
              GitHub
            </a>
          </nav>
        </div>
        <p className="text-xs text-subtle">
          © {new Date().getFullYear()} Ray Mark Bunga · Davao, Philippines
        </p>
      </div>
    </footer>
  );
}
