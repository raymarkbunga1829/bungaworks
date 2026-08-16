import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TetrisEngine, type HudSnap } from "@/lib/tetris/engine";
import { COLS, VISIBLE_ROWS } from "@/lib/tetris/pieces";
import {
  isMuted,
  setMuted,
  sfxClear,
  sfxDrop,
  sfxHold,
  sfxLock,
  sfxMove,
  sfxOver,
  sfxRotate,
  unlockAudio,
} from "@/lib/tetris/audio";
import { loadSave, recordRun, setMutedPref } from "@/lib/tetris/persist";
import {
  drawWell,
  spawnLockDust,
  stepParticles,
  type Cam,
  type Particle,
} from "@/lib/tetris/render";
import { submitRun } from "@/lib/scores";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { MiniPiece } from "./mini-piece";
import { cn } from "@/lib/utils";

const emptyHud: HudSnap = {
  score: 0,
  lines: 0,
  level: 1,
  combo: 0,
  best: 0,
  hold: null,
  holdUsed: false,
  queue: [],
  status: "ready",
  lastClear: null,
  b2b: false,
};

export function TetrisGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<TetrisEngine | null>(null);
  const user = useCurrentUser();
  const [hud, setHud] = useState<HudSnap>(emptyHud);
  const [muted, setMutedUi] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const pointer = useRef<{ x: number; y: number; t: number } | null>(null);

  useEffect(() => {
    const save = loadSave();
    setMuted(save.muted);
    setMutedUi(save.muted);
    const engine = new TetrisEngine(save.best);
    engineRef.current = engine;
    setHud(engine.hud());

    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const particles: Particle[] = [];
    const cam: Cam = { trauma: 0, x: 0, y: 0 };
    const flashRows = new Set<number>();
    let flashT = 0;
    let last = performance.now();
    let raf = 0;
    let lastHud = "";

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const maxW = wrap.clientWidth;
      const maxH = wrap.clientHeight;
      const cell = Math.max(
        14,
        Math.floor(Math.min(maxW / COLS, maxH / VISIBLE_ROWS)),
      );
      const cssW = cell * COLS;
      const cssH = cell * VISIBLE_ROWS;
      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;
      canvas.width = Math.floor(cssW * dpr);
      canvas.height = Math.floor(cssH * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      engine.step(dt);

      for (const ev of engine.drainFx()) {
        if (ev.type === "move") sfxMove();
        if (ev.type === "rotate") sfxRotate();
        if (ev.type === "hold") sfxHold();
        if (ev.type === "drop") {
          sfxDrop();
          cam.trauma = Math.min(1, cam.trauma + 0.18);
        }
        if (ev.type === "lock") {
          sfxLock();
          const cell = canvas.clientWidth / COLS;
          spawnLockDust(particles, ev.cells, ev.id, cell);
        }
        if (ev.type === "clear") {
          sfxClear(ev.lines);
          ev.rows.forEach((r) => flashRows.add(r));
          flashT = 0;
          cam.trauma = Math.min(1, cam.trauma + (ev.lines >= 4 ? 0.55 : 0.28));
        }
        if (ev.type === "over") sfxOver();
      }

      if (engine.status !== "clearing" && flashRows.size) flashRows.clear();
      flashT += dt;
      stepParticles(particles, dt);
      cam.trauma = Math.max(0, cam.trauma - dt * 1.8);
      const shake = cam.trauma * cam.trauma;
      cam.x = shake ? (Math.random() * 2 - 1) * 7 * shake : 0;
      cam.y = shake ? (Math.random() * 2 - 1) * 7 * shake : 0;

      const cssW = canvas.clientWidth;
      const cssH = canvas.clientHeight;
      const well = drawWell(ctx, engine, cssW, cssH, flashRows, flashT, cam);
      for (const p of particles) {
        ctx.globalAlpha = Math.max(0, p.life * 2);
        ctx.fillStyle = p.color;
        ctx.fillRect(well.ox + p.x - p.size / 2, well.oy + p.y - p.size / 2, p.size, p.size);
        ctx.globalAlpha = 1;
      }

      const snap = engine.hud();
      const key = `${snap.score}|${snap.lines}|${snap.level}|${snap.status}|${snap.hold}|${snap.queue.join("")}|${snap.combo}|${snap.lastClear}`;
      if (key !== lastHud) {
        lastHud = key;
        setHud(snap);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  useEffect(() => {
    if (hud.status !== "over" || submitted) return;
    recordRun({ score: hud.score, lines: hud.lines, level: hud.level });
    setSubmitted(true);
    if (user) {
      void submitRun({
        data: { score: hud.score, lines: hud.lines, level: hud.level },
      }).catch(() => undefined);
    }
  }, [hud.status, hud.score, hud.lines, hud.level, submitted, user]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const codes = [
        "ArrowLeft",
        "ArrowRight",
        "ArrowDown",
        "ArrowUp",
        "Space",
        "KeyZ",
        "KeyX",
        "KeyC",
        "KeyA",
        "KeyD",
        "KeyS",
        "KeyR",
        "KeyP",
        "Escape",
        "ShiftLeft",
        "ShiftRight",
        "ControlLeft",
      ];
      if (!codes.includes(e.code)) return;
      if (e.code === "Space" || e.code.startsWith("Arrow")) e.preventDefault();
      unlockAudio();
      const engine = engineRef.current;
      if (!engine) return;
      if (engine.status === "ready") {
        engine.start();
        return;
      }
      engine.keyDown(e.code);
    };
    const up = (e: KeyboardEvent) => engineRef.current?.keyUp(e.code);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  const begin = () => {
    unlockAudio();
    engineRef.current?.start();
    setSubmitted(false);
  };

  const toggleMute = () => {
    const next = !isMuted();
    setMuted(next);
    setMutedPref(next);
    setMutedUi(next);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    pointer.current = { x: e.clientX, y: e.clientY, t: performance.now() };
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const start = pointer.current;
    pointer.current = null;
    const engine = engineRef.current;
    if (!start || !engine) return;
    if (engine.status === "ready") {
      begin();
      return;
    }
    if (engine.status !== "playing") return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);
    if (absX < 14 && absY < 14) {
      engine.tapRotate(1);
      return;
    }
    if (absX > absY) {
      const steps = Math.max(1, Math.round(absX / 28));
      for (let i = 0; i < steps; i++) engine.tapMove(dx < 0 ? -1 : 1);
    } else if (dy > 0) {
      if (dy > 70) engine.tapDrop();
      else engine.tapSoft();
    } else {
      engine.tapHold();
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-3 pb-6 pt-4 sm:px-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-subtle">
            Bungaworks
          </p>
          <h1 className="font-display text-4xl leading-none tracking-tight sm:text-5xl">
            STACK
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleMute}
            className="grid size-11 place-items-center rounded-sm text-muted hover:bg-raised hover:text-fg"
            aria-label={muted ? "Unmute" : "Mute"}
          >
            {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
          </button>
          <button
            type="button"
            onClick={() => {
              unlockAudio();
              engineRef.current?.togglePause();
            }}
            className="grid size-11 place-items-center rounded-sm text-muted hover:bg-raised hover:text-fg"
            aria-label="Pause"
          >
            {hud.status === "paused" ? (
              <Play className="size-4" />
            ) : (
              <Pause className="size-4" />
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-[minmax(0,5.5rem)_minmax(0,1fr)_minmax(0,8.5rem)]">
        <aside className="hidden flex-col gap-4 md:flex">
          <MiniPiece id={hud.hold} dim={hud.holdUsed} label="Hold" />
          <Stat label="Score" value={hud.score} />
          <Stat label="Best" value={hud.best} />
        </aside>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3 md:hidden">
            <MiniPiece id={hud.hold} dim={hud.holdUsed} label="Hold" />
            <div className="flex flex-1 justify-center gap-5">
              <Stat label="Score" value={hud.score} compact />
              <Stat label="Lines" value={hud.lines} compact />
              <Stat label="Lv" value={hud.level} compact />
            </div>
            <MiniPiece id={hud.queue[0] ?? null} label="Next" />
          </div>

          <div
            ref={wrapRef}
            className="relative mx-auto aspect-[10/20] w-full max-w-[min(100%,28rem)] touch-none overflow-hidden rounded-md border border-border bg-well shadow-[var(--shadow-panel)]"
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
          >
            <canvas ref={canvasRef} className="mx-auto block h-full w-full" />
            {hud.status === "ready" ? (
              <Overlay>
                <p className="font-display text-4xl tracking-tight">STACK</p>
                <p className="mt-2 max-w-[16rem] text-sm text-muted">
                  Guideline Tetris. Click or tap to start.
                </p>
                {hud.best > 0 ? (
                  <p className="mt-3 font-mono text-xs tabular-nums text-subtle">
                    Best {hud.best.toLocaleString()}
                  </p>
                ) : null}
                <Button className="mt-6" onClick={begin}>
                  Play
                </Button>
                <p className="mt-5 hidden text-[11px] uppercase tracking-[0.14em] text-subtle sm:block">
                  A D move · Z X rotate · space drop
                </p>
                <p className="mt-5 text-[11px] uppercase tracking-[0.14em] text-subtle sm:hidden">
                  Tap to start · swipe to shift
                </p>
              </Overlay>
            ) : null}
            {hud.status === "paused" ? (
              <Overlay>
                <p className="font-display text-3xl tracking-tight">Paused</p>
                <Button className="mt-6" onClick={() => engineRef.current?.resume()}>
                  Resume
                </Button>
              </Overlay>
            ) : null}
            {hud.status === "over" ? (
              <Overlay>
                <p className="text-[11px] uppercase tracking-[0.18em] text-subtle">
                  Game over
                </p>
                <p className="mt-2 font-display text-5xl tracking-tight">
                  {hud.score.toLocaleString()}
                </p>
                <p className="mt-2 text-sm text-muted">
                  {hud.lines} lines · level {hud.level}
                  {user ? " · saved to your board" : ""}
                </p>
                <Button
                  className="mt-6"
                  onClick={() => {
                    engineRef.current?.reset(hud.best);
                    begin();
                  }}
                >
                  Play again
                </Button>
              </Overlay>
            ) : null}
          </div>

          <div className="grid grid-cols-4 gap-2 md:hidden">
            <Pad onClick={() => engineRef.current?.tapHold()}>Hold</Pad>
            <Pad onClick={() => engineRef.current?.tapRotate(-1)}>
              <RotateCcw className="size-4" />
            </Pad>
            <Pad onClick={() => engineRef.current?.tapRotate(1)}>
              <RotateCw className="size-4" />
            </Pad>
            <Pad onClick={() => engineRef.current?.tapDrop()}>Drop</Pad>
            <Pad onClick={() => engineRef.current?.tapMove(-1)}>
              <ChevronLeft className="size-5" />
            </Pad>
            <Pad onClick={() => engineRef.current?.tapSoft()}>
              <ChevronDown className="size-5" />
            </Pad>
            <Pad onClick={() => engineRef.current?.tapMove(1)}>
              <ChevronRight className="size-5" />
            </Pad>
            <Pad
              onClick={() => {
                engineRef.current?.reset(hud.best);
                begin();
              }}
            >
              Reset
            </Pad>
          </div>
        </div>

        <aside className="hidden flex-col gap-4 md:flex">
          <div>
            <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-subtle">
              Next
            </p>
            <div className="flex flex-col gap-2">
              {hud.queue.slice(0, 5).map((id, i) => (
                <MiniPiece key={`${id}-${i}`} id={id} dim={i > 0} />
              ))}
            </div>
          </div>
          <Stat label="Lines" value={hud.lines} />
          <Stat label="Level" value={hud.level} />
          {hud.lastClear ? (
            <p className="text-[11px] uppercase tracking-[0.16em] text-muted">
              {hud.b2b ? "B2B " : ""}
              {hud.lastClear.replace("-", " ")}
              {hud.combo > 1 ? ` · combo ${hud.combo}` : ""}
            </p>
          ) : null}
        </aside>
      </div>

      <dl className="hidden grid-cols-2 gap-x-8 gap-y-1 text-sm text-muted md:grid lg:grid-cols-4">
        <div>
          <dt className="text-subtle">Move</dt>
          <dd className="text-fg">A D · arrows</dd>
        </div>
        <div>
          <dt className="text-subtle">Rotate</dt>
          <dd className="text-fg">Z / X · up</dd>
        </div>
        <div>
          <dt className="text-subtle">Drop</dt>
          <dd className="text-fg">S soft · space hard</dd>
        </div>
        <div>
          <dt className="text-subtle">Hold / pause</dt>
          <dd className="text-fg">C or shift · esc</dd>
        </div>
      </dl>
    </div>
  );
}

function Stat({
  label,
  value,
  compact,
}: {
  label: string;
  value: number;
  compact?: boolean;
}) {
  return (
    <div className={cn(compact ? "text-center" : "")}>
      <p className="text-[10px] uppercase tracking-[0.18em] text-subtle">{label}</p>
      <p className="font-mono text-lg tabular-nums text-fg sm:text-xl">
        {value.toLocaleString()}
      </p>
    </div>
  );
}

function Overlay({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 grid place-items-center bg-bg/78 px-6 text-center">
      <div>{children}</div>
    </div>
  );
}

function Pad({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={() => {
        unlockAudio();
        onClick();
      }}
      className="flex h-12 items-center justify-center rounded-sm border border-border bg-surface text-sm text-fg active:bg-raised"
    >
      {children}
    </button>
  );
}
