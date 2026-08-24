export type WorkKind = "game" | "tool" | "app";

export type WorkItem = {
  slug: string;
  name: string;
  dek: string;
  kind: WorkKind;
  featured?: boolean;
  /** In-app path, used for STACK on this site. */
  path?: "/play";
  live?: string;
  repo: string;
  note?: string;
};

/**
 * Verified work only. STACK is this site (/play) — do not also list
 * stack-tetris as a second game.
 */
export const works: WorkItem[] = [
  {
    slug: "stack",
    name: "STACK",
    dek: "Guideline Tetris on this site. 7-bag, Super Rotation, lock delay, ghost, hold.",
    kind: "game",
    featured: true,
    path: "/play",
    live: "https://bungaworks.vercel.app/play",
    repo: "https://github.com/raymarkbunga1829/bungaworks",
  },
  {
    slug: "diner-town",
    name: "Diner Town",
    dek: "Isometric restaurant sim for a phone or a desk browser. Seat guests, cook, keep the floor moving.",
    kind: "game",
    live: "https://diner-town.vercel.app",
    repo: "https://github.com/raymarkbunga1829/diner-town",
  },
  {
    slug: "small-fish",
    name: "SmallFish",
    dek: "Chess PWA with Stockfish 18. A small board you can open again.",
    kind: "game",
    live: "https://small-fish-lemon.vercel.app",
    repo: "https://github.com/raymarkbunga1829/small-fish",
  },
  {
    slug: "short-clips",
    name: "Short-clips",
    dek: "Pick a topic, a length, a voice. Get a short spoken clip back.",
    kind: "tool",
    live: "https://short-clips-pi.vercel.app",
    repo: "https://github.com/raymarkbunga1829/Short-clips",
  },
  {
    slug: "folio",
    name: "Folio",
    dek: "Native iPhone document scanner. Xcode project — GitHub only for now.",
    kind: "app",
    repo: "https://github.com/raymarkbunga1829/folio-ios",
    note: "No public live URL yet.",
  },
];

export const featuredWork = works.find((w) => w.featured) ?? works[0];
export const otherWork = works.filter((w) => !w.featured);
