const FALLBACK_ORIGIN = "https://bungaworks.vercel.app";

function normalizeOrigin(raw: string): string {
  const trimmed = raw.trim().replace(/\/$/, "");
  if (!trimmed) return FALLBACK_ORIGIN;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

/** Request origin when we have one; otherwise the live Vercel host. */
export function resolveOrigin(): string {
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }
  const envHost = import.meta.env.VITE_PUBLIC_HOSTNAME;
  if (typeof envHost === "string" && envHost.length > 0) {
    return normalizeOrigin(envHost);
  }
  const vercelProd = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercelProd) return normalizeOrigin(vercelProd);
  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) return normalizeOrigin(vercelUrl);
  return FALLBACK_ORIGIN;
}

export function pageHead({
  title,
  description,
  path,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
}) {
  const origin = resolveOrigin();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const url = `${origin}${normalized}`;
  const image = `${origin}/og.jpg`;

  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:type", content: type },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { property: "og:image", content: image },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: image },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}
