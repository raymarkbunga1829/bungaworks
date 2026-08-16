const KEY = "bungaworks.stack.v1";
const VERSION = 1;

export type LocalRun = {
  score: number;
  lines: number;
  level: number;
  at: number;
};

export type SaveBlob = {
  version: number;
  best: number;
  runs: LocalRun[];
  muted: boolean;
};

const defaults: SaveBlob = {
  version: VERSION,
  best: 0,
  runs: [],
  muted: false,
};

function migrate(raw: SaveBlob): SaveBlob {
  const next = { ...defaults, ...raw, version: VERSION };
  if (!Array.isArray(next.runs)) next.runs = [];
  return next;
}

export function loadSave(): SaveBlob {
  if (typeof window === "undefined") return { ...defaults };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { ...defaults };
    return migrate(JSON.parse(raw) as SaveBlob);
  } catch {
    return { ...defaults };
  }
}

export function writeSave(save: SaveBlob) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(save));
  } catch {
    /* quota / private mode */
  }
}

export function recordRun(run: Omit<LocalRun, "at">): SaveBlob {
  const save = loadSave();
  const nextRun: LocalRun = { ...run, at: Date.now() };
  save.runs = [nextRun, ...save.runs].sort((a, b) => b.score - a.score).slice(0, 10);
  save.best = Math.max(save.best, run.score);
  writeSave(save);
  return save;
}

export function setMutedPref(muted: boolean) {
  const save = loadSave();
  save.muted = muted;
  writeSave(save);
}
