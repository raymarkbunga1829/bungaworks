import { createFileRoute, Link } from "@tanstack/react-router";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";

import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/login")({
  component: Login,
  head: () =>
    pageHead({
      title: "Sign in — Bungaworks",
      description: "Sign in to put a STACK run on the Bungaworks studio board.",
      path: "/login",
    }),
});

function Login() {
  return (
    <SiteShell>
      <main className="mx-auto flex min-h-[70svh] max-w-md flex-col justify-center px-4 py-16">
        <p className="text-[11px] uppercase tracking-[0.2em] text-subtle">Account</p>
        <h1 className="mt-3 font-display text-4xl tracking-tight">Sign in</h1>
        <p className="mt-3 text-muted">
          Signed-in runs go on the studio board. Guests can still play STACK
          with a local best.
        </p>
        <div className="mt-8 space-y-3">
          {authEnabled ? (
            GROK_PROVIDERS.map((p) => (
              <Button
                key={p.providerId}
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => signIn(p.providerId, { callbackURL: "/play" })}
              >
                Continue with {p.label}
              </Button>
            ))
          ) : (
            <p className="text-sm text-muted">Sign-in is disabled.</p>
          )}
        </div>
        <Link to="/play" className="mt-8 text-sm text-muted hover:text-fg">
          Skip and play
        </Link>
      </main>
    </SiteShell>
  );
}
