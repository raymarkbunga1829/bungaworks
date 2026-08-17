import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { QueryProvider } from "@/components/query-provider";
import { pageHead } from "@/lib/seo";
import appCss from "../styles.css?url";

const DEFAULT_TITLE = "Bungaworks — STACK from Davao";
const DEFAULT_DESCRIPTION =
  "Bungaworks is Ray Mark Bunga’s studio in Davao. Play STACK, a guideline Tetris with 7-bag, SRS, hold, and lock delay.";

const seo = pageHead({
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  path: "/",
  type: "website",
});

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "apple-mobile-web-app-title", content: "STACK" },
      { name: "theme-color", content: "#0c0c0b" },
      ...seo.meta,
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&family=Instrument+Serif:ital@0;1&display=swap",
      },
    ],
  }),
  notFoundComponent: () => (
    <main className="grid min-h-dvh place-items-center bg-bg px-6 text-center text-fg">
      <div>
        <p className="text-[11px] uppercase tracking-[0.2em] text-subtle">
          Bungaworks
        </p>
        <p className="mt-3 font-display text-5xl tracking-tight">404</p>
        <p className="mt-2 text-muted">That page is not in the studio.</p>
        <a
          href="/"
          className="mt-6 inline-flex min-h-11 items-center text-sm text-fg underline-offset-4 hover:underline"
        >
          Back to Bungaworks
        </a>
      </div>
    </main>
  ),
  component: () => (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <PreviewHostBridge />
        <QueryProvider>
          <AuthProvider>
            <Outlet />
          </AuthProvider>
        </QueryProvider>
        <Scripts />
      </body>
    </html>
  ),
});
