import { Link, useRouterState } from "@tanstack/react-router";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { UserButton } from "@/lib/auth/gates";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Work", hideOnMobile: true },
  { to: "/play", label: "Play" },
  { to: "/journal", label: "Journal" },
  { to: "/studio", label: "Studio" },
] as const;

export function SiteHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, isPending } = useCurrentUserState();

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6">
        <Link to="/" className="flex shrink-0 items-baseline gap-2 text-fg">
          <span className="font-display text-xl tracking-tight">Bungaworks</span>
          <span className="hidden text-[11px] uppercase tracking-[0.18em] text-subtle sm:inline">
            Davao
          </span>
        </Link>
        <nav className="flex items-center gap-0.5 sm:gap-2">
          {links.map((link) => {
            const active =
              link.to === "/"
                ? pathname === "/"
                : pathname === link.to || pathname.startsWith(`${link.to}/`);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "rounded-sm px-2 py-2 text-sm transition-colors duration-150 sm:px-2.5",
                  active ? "text-fg" : "text-muted hover:text-fg",
                  "hideOnMobile" in link && link.hideOnMobile ? "hidden sm:inline" : "",
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="ml-1 hidden h-4 w-px bg-border sm:block" />
          {isPending ? (
            <div className="h-8 w-12 animate-pulse rounded-sm bg-raised sm:w-20" />
          ) : user ? (
            <div className="hidden sm:block">
              <UserButton />
            </div>
          ) : (
            <Link
              to="/login"
              className="px-2 py-2 text-sm text-muted hover:text-fg sm:px-2.5"
            >
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
