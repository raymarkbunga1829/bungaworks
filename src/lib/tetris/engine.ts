import {
  COLS,
  HIDDEN_ROWS,
  PIECE_IDS,
  ROWS,
  SPAWN_X,
  SPAWN_Y,
  SHAPES,
  VISIBLE_ROWS,
  cellsOf,
  kickTable,
  type PieceId,
  type Rot,
} from "./pieces";

export type Status = "ready" | "playing" | "paused" | "clearing" | "over";

export type ClearKind = "single" | "double" | "triple" | "tetris" | "tspin" | "tspin-mini" | null;

export type FxEvent =
  | { type: "lock"; cells: { x: number; y: number }[]; id: PieceId }
  | { type: "clear"; rows: number[]; kind: ClearKind; lines: number }
  | { type: "drop"; cells: number }
  | { type: "over" }
  | { type: "move" }
  | { type: "rotate" }
  | { type: "hold" };

export type ActivePiece = {
  id: PieceId;
  x: number;
  y: number;
  rot: Rot;
};

export type HudSnap = {
  score: number;
  lines: number;
  level: number;
  combo: number;
  best: number;
  hold: PieceId | null;
  holdUsed: boolean;
  queue: PieceId[];
  status: Status;
  lastClear: ClearKind;
  b2b: boolean;
};

const STEP = 1 / 60;
const LOCK_DELAY = 0.5;
const LOCK_RESET_CAP = 15;
const DAS = 0.167;
const ARR = 0.033;
const SOFT_DROP = 0.033;
const CLEAR_TIME = 0.28;

const GRAVITY = [
  48, 43, 38, 33, 28, 23, 18, 13, 8, 6, 5, 5, 5, 4, 4, 4, 3, 3, 3, 2, 2, 2, 2,
  2, 2, 2, 2, 2, 2, 1,
];

function shuffle<T>(list: T[]): T[] {
  const next = [...list];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const a = next[i]!;
    next[i] = next[j]!;
    next[j] = a;
  }
  return next;
}

function emptyGrid(): (PieceId | null)[][] {
  return Array.from({ length: ROWS }, () => Array<PieceId | null>(COLS).fill(null));
}

function occupied(
  grid: (PieceId | null)[][],
  x: number,
  y: number,
): boolean {
  if (x < 0 || x >= COLS || y >= ROWS) return true;
  if (y < 0) return false;
  return grid[y]![x] !== null;
}

function fits(
  grid: (PieceId | null)[][],
  id: PieceId,
  rot: Rot,
  x: number,
  y: number,
): boolean {
  for (const cell of cellsOf(id, rot, x, y)) {
    if (occupied(grid, cell.x, cell.y)) return false;
  }
  return true;
}

function gravityFor(level: number) {
  const idx = Math.min(Math.max(level, 1), GRAVITY.length) - 1;
  return (GRAVITY[idx] ?? 1) / 60;
}

function tCorners(piece: ActivePiece) {
  return [
    { x: piece.x, y: piece.y },
    { x: piece.x + 2, y: piece.y },
    { x: piece.x, y: piece.y + 2 },
    { x: piece.x + 2, y: piece.y + 2 },
  ];
}

function facingCorners(piece: ActivePiece) {
  const { x, y, rot } = piece;
  if (rot === 0) return [
    { x, y },
    { x: x + 2, y },
  ];
  if (rot === 1) return [
    { x: x + 2, y },
    { x: x + 2, y: y + 2 },
  ];
  if (rot === 2) return [
    { x, y: y + 2 },
    { x: x + 2, y: y + 2 },
  ];
  return [
    { x, y },
    { x, y: y + 2 },
  ];
}

export class TetrisEngine {
  grid = emptyGrid();
  active: ActivePiece | null = null;
  hold: PieceId | null = null;
  holdUsed = false;
  queue: PieceId[] = [];
  bag: PieceId[] = [];
  score = 0;
  lines = 0;
  level = 1;
  combo = -1;
  b2b = false;
  lastClear: ClearKind = null;
  status: Status = "ready";
  best = 0;

  fallAcc = 0;
  lockTimer = 0;
  lockResets = 0;
  grounded = false;
  lastRotate = false;
  lastKick = 0;
  clearRows: number[] = [];
  clearTimer = 0;
  pendingKind: ClearKind = null;

  dasDir: -1 | 0 | 1 = 0;
  dasTimer = 0;
  dasRepeat = false;
  soft = false;
  leftHeld = false;
  rightHeld = false;

  fx: FxEvent[] = [];
  private acc = 0;
  private lastMoveDir: -1 | 1 = -1;

  constructor(best = 0) {
    this.best = best;
    this.fillQueue();
  }

  hud(): HudSnap {
    return {
      score: this.score,
      lines: this.lines,
      level: this.level,
      combo: Math.max(0, this.combo),
      best: this.best,
      hold: this.hold,
      holdUsed: this.holdUsed,
      queue: this.queue.slice(0, 5),
      status: this.status,
      lastClear: this.lastClear,
      b2b: this.b2b,
    };
  }

  drainFx() {
    const ev = this.fx;
    this.fx = [];
    return ev;
  }

  start() {
    if (this.status === "playing") return;
    if (this.status === "over") this.reset(this.best);
    this.status = "playing";
    if (!this.active) this.spawn();
  }

  pause() {
    if (this.status === "playing") this.status = "paused";
  }

  resume() {
    if (this.status === "paused") this.status = "playing";
  }

  togglePause() {
    if (this.status === "playing") this.pause();
    else if (this.status === "paused") this.resume();
  }

  reset(best = this.best) {
    this.grid = emptyGrid();
    this.active = null;
    this.hold = null;
    this.holdUsed = false;
    this.queue = [];
    this.bag = [];
    this.score = 0;
    this.lines = 0;
    this.level = 1;
    this.combo = -1;
    this.b2b = false;
    this.lastClear = null;
    this.status = "ready";
    this.best = best;
    this.fallAcc = 0;
    this.lockTimer = 0;
    this.lockResets = 0;
    this.grounded = false;
    this.lastRotate = false;
    this.lastKick = 0;
    this.clearRows = [];
    this.clearTimer = 0;
    this.pendingKind = null;
    this.dasDir = 0;
    this.dasTimer = 0;
    this.dasRepeat = false;
    this.soft = false;
    this.acc = 0;
    this.fillQueue();
  }

  keyDown(code: string) {
    if (code === "ArrowLeft" || code === "KeyA") this.pressDir(-1);
    else if (code === "ArrowRight" || code === "KeyD") this.pressDir(1);
    else if (code === "ArrowDown" || code === "KeyS") this.soft = true;
    else if (code === "ArrowUp" || code === "KeyX") this.rotate(1);
    else if (code === "KeyZ" || code === "ControlLeft") this.rotate(-1);
    else if (code === "Space") this.hardDrop();
    else if (code === "KeyC" || code === "ShiftLeft" || code === "ShiftRight")
      this.holdPiece();
    else if (code === "Escape" || code === "KeyP") this.togglePause();
    else if (code === "KeyR") {
      this.reset(this.best);
      this.start();
    }
  }

  keyUp(code: string) {
    if (code === "ArrowLeft" || code === "KeyA") {
      this.leftHeld = false;
      if (this.dasDir === -1) this.releaseDir();
    } else if (code === "ArrowRight" || code === "KeyD") {
      this.rightHeld = false;
      if (this.dasDir === 1) this.releaseDir();
    } else if (code === "ArrowDown" || code === "KeyS") {
      this.soft = false;
    }
  }

  tapRotate(dir: 1 | -1 = 1) {
    this.rotate(dir);
  }

  tapHold() {
    this.holdPiece();
  }

  tapDrop() {
    this.hardDrop();
  }

  tapSoft() {
    this.nudge(0, 1, true);
  }

  tapMove(dir: -1 | 1) {
    this.nudge(dir, 0, false);
  }

  step(dt: number) {
    this.acc += Math.min(dt, 0.1);
    while (this.acc >= STEP) {
      this.acc -= STEP;
      this.tick(STEP);
    }
  }

  ghostY(): number {
    const p = this.active;
    if (!p) return 0;
    let y = p.y;
    while (fits(this.grid, p.id, p.rot, p.x, y + 1)) y += 1;
    return y;
  }

  private pressDir(dir: -1 | 1) {
    if (dir === -1) this.leftHeld = true;
    else this.rightHeld = true;
    this.lastMoveDir = dir;
    this.dasDir = dir;
    this.dasTimer = 0;
    this.dasRepeat = false;
    this.nudge(dir, 0, false);
  }

  private releaseDir() {
    if (this.leftHeld && !this.rightHeld) this.pressDir(-1);
    else if (this.rightHeld && !this.leftHeld) this.pressDir(1);
    else {
      this.dasDir = 0;
      this.dasTimer = 0;
      this.dasRepeat = false;
    }
  }

  private tick(dt: number) {
    if (this.status === "clearing") {
      this.clearTimer -= dt;
      if (this.clearTimer <= 0) this.finishClear();
      return;
    }
    if (this.status !== "playing" || !this.active) return;

    if (this.dasDir !== 0) {
      this.dasTimer += dt;
      if (!this.dasRepeat && this.dasTimer >= DAS) {
        this.dasRepeat = true;
        this.dasTimer = 0;
        this.nudge(this.dasDir, 0, false);
      } else if (this.dasRepeat) {
        while (this.dasTimer >= ARR) {
          this.dasTimer -= ARR;
          if (!this.nudge(this.dasDir, 0, false)) break;
        }
      }
    }

    const interval = this.soft ? Math.min(SOFT_DROP, gravityFor(this.level)) : gravityFor(this.level);
    this.fallAcc += dt;
    while (this.fallAcc >= interval) {
      this.fallAcc -= interval;
      if (!this.nudge(0, 1, this.soft)) break;
    }

    this.grounded = !fits(
      this.grid,
      this.active.id,
      this.active.rot,
      this.active.x,
      this.active.y + 1,
    );
    if (this.grounded) {
      this.lockTimer += dt;
      if (this.lockTimer >= LOCK_DELAY) this.lock();
    } else {
      this.lockTimer = 0;
    }
  }

  private fillQueue() {
    while (this.queue.length < 7) {
      if (this.bag.length === 0) this.bag = shuffle([...PIECE_IDS]);
      const next = this.bag.shift();
      if (next) this.queue.push(next);
    }
  }

  private spawn(forced?: PieceId) {
    this.fillQueue();
    const id = forced ?? this.queue.shift();
    this.fillQueue();
    if (!id) return;
    const piece: ActivePiece = {
      id,
      x: SPAWN_X[id],
      y: SPAWN_Y,
      rot: 0,
    };
    if (!fits(this.grid, piece.id, piece.rot, piece.x, piece.y)) {
      this.active = piece;
      this.status = "over";
      this.best = Math.max(this.best, this.score);
      this.fx.push({ type: "over" });
      return;
    }
    this.active = piece;
    this.holdUsed = false;
    this.fallAcc = 0;
    this.lockTimer = 0;
    this.lockResets = 0;
    this.lastRotate = false;
    this.lastKick = 0;
  }

  private tryResetLock() {
    if (!this.grounded) return;
    if (this.lockResets >= LOCK_RESET_CAP) return;
    this.lockResets += 1;
    this.lockTimer = 0;
  }

  private nudge(dx: number, dy: number, awardSoft: boolean): boolean {
    if (this.status !== "playing" || !this.active) return false;
    const nextX = this.active.x + dx;
    const nextY = this.active.y + dy;
    if (!fits(this.grid, this.active.id, this.active.rot, nextX, nextY)) return false;
    this.active.x = nextX;
    this.active.y = nextY;
    this.lastRotate = false;
    if (dx !== 0) {
      this.tryResetLock();
      this.fx.push({ type: "move" });
    }
    if (awardSoft && dy > 0) this.score += dy;
    return true;
  }

  private rotate(dir: 1 | -1) {
    if (this.status !== "playing" || !this.active) return;
    const from = this.active.rot;
    const to = ((((from + dir) % 4) + 4) % 4) as Rot;
    const kicks = kickTable(this.active.id, from, to);
    for (let i = 0; i < kicks.length; i++) {
      const [kx, kyUp] = kicks[i]!;
      const nx = this.active.x + kx;
      const ny = this.active.y - kyUp;
      if (fits(this.grid, this.active.id, to, nx, ny)) {
        this.active.x = nx;
        this.active.y = ny;
        this.active.rot = to;
        this.lastRotate = true;
        this.lastKick = i;
        this.tryResetLock();
        this.fx.push({ type: "rotate" });
        return;
      }
    }
  }

  private holdPiece() {
    if (this.status !== "playing" || !this.active || this.holdUsed) return;
    const current = this.active.id;
    const stored = this.hold;
    this.hold = current;
    this.holdUsed = true;
    this.active = null;
    this.fx.push({ type: "hold" });
    this.spawn(stored ?? undefined);
  }

  private hardDrop() {
    if (this.status !== "playing" || !this.active) return;
    const gy = this.ghostY();
    const cells = gy - this.active.y;
    this.active.y = gy;
    this.score += cells * 2;
    this.fx.push({ type: "drop", cells });
    this.lock();
  }

  private classifyClear(n: number, tspin: "none" | "mini" | "full"): ClearKind {
    if (tspin === "full") return "tspin";
    if (tspin === "mini") return "tspin-mini";
    if (n === 4) return "tetris";
    if (n === 3) return "triple";
    if (n === 2) return "double";
    if (n === 1) return "single";
    return null;
  }

  private detectTSpin(): "none" | "mini" | "full" {
    const p = this.active;
    if (!p || p.id !== "T" || !this.lastRotate) return "none";
    const corners = tCorners(p);
    const filled = corners.filter((c) => occupied(this.grid, c.x, c.y)).length;
    if (filled < 3) return "none";
    const facing = facingCorners(p);
    const faceFilled = facing.every((c) => occupied(this.grid, c.x, c.y));
    if (faceFilled || this.lastKick === 4) return "full";
    return "mini";
  }

  private lock() {
    const p = this.active;
    if (!p) return;
    const tspin = this.detectTSpin();
    const cells = cellsOf(p.id, p.rot, p.x, p.y);
    for (const cell of cells) {
      if (cell.y >= 0 && cell.y < ROWS && cell.x >= 0 && cell.x < COLS) {
        this.grid[cell.y]![cell.x] = p.id;
      }
    }
    this.fx.push({ type: "lock", cells, id: p.id });
    this.active = null;

    const full: number[] = [];
    for (let y = 0; y < ROWS; y++) {
      if (this.grid[y]!.every((c) => c !== null)) full.push(y);
    }

    if (full.length === 0) {
      this.combo = -1;
      this.lastClear = null;
      this.spawn();
      return;
    }

    const kind = this.classifyClear(full.length, tspin);
    this.pendingKind = kind;
    this.clearRows = full;
    this.clearTimer = CLEAR_TIME;
    this.status = "clearing";
    this.fx.push({ type: "clear", rows: full, kind, lines: full.length });
  }

  private finishClear() {
    const n = this.clearRows.length;
    const kind = this.pendingKind;
    const rows = new Set(this.clearRows);
    const next: (PieceId | null)[][] = [];
    for (let y = 0; y < ROWS; y++) {
      if (!rows.has(y)) next.push(this.grid[y]!);
    }
    while (next.length < ROWS) next.unshift(Array<PieceId | null>(COLS).fill(null));
    this.grid = next;

    const difficult = kind === "tetris" || kind === "tspin" || kind === "tspin-mini";
    let pts = 0;
    if (kind === "single") pts = 100;
    else if (kind === "double") pts = 300;
    else if (kind === "triple") pts = 500;
    else if (kind === "tetris") pts = 800;
    else if (kind === "tspin-mini") pts = n === 1 ? 200 : 100;
    else if (kind === "tspin") {
      if (n === 1) pts = 800;
      else if (n === 2) pts = 1200;
      else if (n === 3) pts = 1600;
      else pts = 400;
    }
    pts *= this.level;
    if (difficult && this.b2b) pts = Math.floor(pts * 1.5);
    this.combo += 1;
    if (this.combo > 0) pts += 50 * this.combo * this.level;
    this.score += pts;
    this.lines += n;
    this.level = Math.min(30, Math.floor(this.lines / 10) + 1);
    this.lastClear = kind;
    this.b2b = difficult;
    this.best = Math.max(this.best, this.score);
    this.clearRows = [];
    this.pendingKind = null;
    this.status = "playing";
    this.spawn();
  }
}

export function runSelfTests() {
  const notes: string[] = [];
  const e = new TetrisEngine();
  e.start();
  if (!e.active) notes.push("spawn failed");
  const startX = e.active?.x ?? 0;
  e.tapMove(-1);
  if (e.active && e.active.x !== startX - 1) notes.push("left move failed");
  e.tapMove(1);
  if (e.active && e.active.x !== startX) notes.push("right move failed");

  const empty = emptyGrid();
  const tFits = fits(empty, "T", 0, 3, 0);
  if (!tFits) notes.push("T spawn should fit");

  const kicked = kickTable("T", 0, 1).length === 5;
  if (!kicked) notes.push("T kicks missing");

  const iKicks = kickTable("I", 0, 1);
  if (iKicks.length !== 5) notes.push("I kicks missing");
  const oKicks = kickTable("O", 0, 1);
  if (oKicks.length !== 1) notes.push("O should not kick");

  const cells = SHAPES.I[0];
  if (cells.length !== 4) notes.push("I cells");

  if (HIDDEN_ROWS + VISIBLE_ROWS !== ROWS) notes.push("row math");

  return { ok: notes.length === 0, notes };
}

declare global {
  interface Window {
    __tetrisTest?: typeof runSelfTests;
  }
}

if (typeof window !== "undefined") {
  window.__tetrisTest = runSelfTests;
}
