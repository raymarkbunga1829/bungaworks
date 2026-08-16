export type Essay = {
  slug: string;
  title: string;
  date: string;
  dek: string;
  body: string[];
};

export const essays: Essay[] = [
  {
    slug: "studio-door",
    title: "The studio has a door now",
    date: "August 2026",
    dek: "STACK needed a place to live besides a preview tab. This site is that door.",
    body: [
      "A game is not finished when the gravity curve is right. It is finished when someone who is not you can find it, tap Play, and know what their hands are supposed to do. For months STACK lived in a build window. That is useful. It is not a studio.",
      "Bungaworks is the door. The well is on /play. The notes are in the journal. Signed-in runs sit on the studio board. Guests keep a local best on the device they used. I wanted the site to feel like the game: quiet surfaces, honest type, no neon pretending to be taste.",
      "The next thing is not a redesign. It is more evenings in the well, and whatever game comes after STACK. This page is so those games have somewhere to land.",
    ],
  },
  {
    slug: "guideline-well",
    title: "Why STACK is a guideline well",
    date: "August 2026",
    dek: "Classic Tetris is a different sport. STACK is the modern one: 7-bag, SRS, lock delay, hold.",
    body: [
      "When people say Tetris they often mean two games. One is NES gravity, no hold, brutal lock. The other is the guideline: a 10×20 well, a seven-piece bag that never starves you, Super Rotation System wall kicks, a half-second lock delay, a ghost, and a hold.",
      "STACK is the second game. I wanted something I could actually practice — the same muscle memory that carries between modern clients. The bag is shuffled as a full set of I, O, T, S, Z, J, L. You will never see seven O-pieces in a row. You will never wait two minutes for an I.",
      "That single rule changes the whole personality of the well. The puzzle becomes placement, not luck. The next queue of five is a promise: you can plan a T-spin two bags out.",
    ],
  },
  {
    slug: "wall-kicks",
    title: "The y-sign and the I-piece",
    date: "August 2026",
    dek: "SRS tables are written y-up. The grid is written y-down. That one inversion is the most common Tetris bug.",
    body: [
      "Every rotation in STACK tests five offsets. The first is (0, 0) — a clean spin in place. If that cell set collides, the engine walks the rest of the Super Rotation System table for that transition. J, L, S, T, and Z share one table. The I-piece has its own. The O-piece does not kick.",
      "The tables on the Tetris wiki use y-up. A canvas grid uses y-down. If you apply a +2 kick without negating it, the I-piece climbs when it should drop into a well, and T-spins kick the wrong way. STACK negates the y component on every kick.",
      "That is the difference between a toy and a tool. A T-spin triple is not a flourish. It is a kick index that finally fitted.",
    ],
  },
  {
    slug: "feel",
    title: "DAS, ARR, and the lock reset",
    date: "July 2026",
    dek: "The numbers nobody sees are the ones you feel in your hands.",
    body: [
      "Held left or right waits 167 milliseconds, then repeats every 33. That is delayed auto-shift and auto-repeat rate. Too snappy and pieces teleport. Too slack and the well feels like mud. These numbers sit near the modern default so a player coming from any guideline client will not have to relearn their hands.",
      "When a piece lands it does not freeze. It waits half a second. A successful move or rotate inside that window resets the timer, up to fifteen times. After that the piece locks. Unlimited reset is stalling. No reset is cruelty. Fifteen is the guideline bargain.",
      "Hard drop awards two points per cell and locks immediately. Soft drop awards one. The ghost is not decoration — it is the contract between your eyes and the floor.",
    ],
  },
  {
    slug: "davao",
    title: "Notes from Davao",
    date: "June 2026",
    dek: "Bungaworks is a one-person studio. The well is built here.",
    body: [
      "I write STACK at night in Davao. The humidity sits on the keys. The city is loud until it is not. A game like this does not need a team of forty. It needs a correct grid, honest timing, and enough evenings to feel the difference between 33ms ARR and 50.",
      "This site is the studio: the playable build, the notes, the scores. Sign in if you want a run on the board. Play as a guest if you just want the well.",
      "More games will land here. STACK is the first one that is finished enough to put in someone's hands.",
    ],
  },
];

export function getEssay(slug: string) {
  return essays.find((e) => e.slug === slug);
}

export function readingMinutes(essay: Essay) {
  const words = essay.body.join(" ").split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}
