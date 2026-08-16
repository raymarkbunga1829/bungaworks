import { HIDDEN_ROWS, PIECE_COLORS, VISIBLE_ROWS, cellsOf, type PieceId } from "./pieces";
import type { TetrisEngine } from "./engine";

export type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
};

export type Cam = { trauma: number; x: number; y: number };

export function spawnLockDust(
  particles: Particle[],
  cells: { x: number; y: number }[],
  id: PieceId,
  cell: number,
) {
  for (const c of cells) {
    if (c.y < HIDDEN_ROWS) continue;
    for (let i = 0; i < 5; i++) {
      particles.push({
        x: (c.x + 0.5) * cell,
        y: (c.y - HIDDEN_ROWS + 0.5) * cell,
        vx: (Math.random() - 0.5) * 90,
        vy: -20 - Math.random() * 70,
        life: 0.35 + Math.random() * 0.25,
        color: PIECE_COLORS[id],
        size: 2 + Math.random() * 2.5,
      });
    }
  }
}

export function stepParticles(particles: Particle[], dt: number) {
  for (const p of particles) {
    p.life -= dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy += 220 * dt;
  }
  let w = 0;
  for (const p of particles) {
    if (p.life > 0) particles[w++] = p;
  }
  particles.length = w;
}

function hexRgb(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function drawBlock(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string,
  alpha = 1,
  ghost = false,
) {
  const gap = Math.max(1, size * 0.06);
  const s = size - gap;
  const px = x + gap / 2;
  const py = y + gap / 2;
  const { r, g, b } = hexRgb(color);
  ctx.save();
  ctx.globalAlpha = alpha;
  if (ghost) {
    ctx.strokeStyle = `rgba(${r},${g},${b},0.55)`;
    ctx.lineWidth = Math.max(1, size * 0.06);
    ctx.strokeRect(px + 0.5, py + 0.5, s - 1, s - 1);
    ctx.restore();
    return;
  }
  ctx.fillStyle = color;
  ctx.fillRect(px, py, s, s);
  ctx.fillStyle = "rgba(255,255,255,0.16)";
  ctx.fillRect(px, py, s, Math.max(1.5, s * 0.08));
  ctx.fillRect(px, py, Math.max(1.5, s * 0.08), s);
  ctx.fillStyle = "rgba(0,0,0,0.28)";
  ctx.fillRect(px, py + s - Math.max(1.5, s * 0.08), s, Math.max(1.5, s * 0.08));
  ctx.fillRect(px + s - Math.max(1.5, s * 0.08), py, Math.max(1.5, s * 0.08), s);
  ctx.restore();
}

export function drawWell(
  ctx: CanvasRenderingContext2D,
  engine: TetrisEngine,
  w: number,
  h: number,
  flashRows: Set<number>,
  flashT: number,
  cam: Cam,
) {
  const cell = Math.floor(Math.min(w / 10, h / VISIBLE_ROWS));
  const boardW = cell * 10;
  const boardH = cell * VISIBLE_ROWS;
  const ox = Math.floor((w - boardW) / 2) + cam.x;
  const oy = Math.floor((h - boardH) / 2) + cam.y;

  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#080808";
  ctx.fillRect(ox, oy, boardW, boardH);

  ctx.strokeStyle = "rgba(236,236,228,0.045)";
  ctx.lineWidth = 1;
  for (let x = 0; x <= 10; x++) {
    ctx.beginPath();
    ctx.moveTo(ox + x * cell + 0.5, oy);
    ctx.lineTo(ox + x * cell + 0.5, oy + boardH);
    ctx.stroke();
  }
  for (let y = 0; y <= VISIBLE_ROWS; y++) {
    ctx.beginPath();
    ctx.moveTo(ox, oy + y * cell + 0.5);
    ctx.lineTo(ox + boardW, oy + y * cell + 0.5);
    ctx.stroke();
  }

  for (let y = HIDDEN_ROWS; y < engine.grid.length; y++) {
    const row = engine.grid[y]!;
    const flashing = flashRows.has(y);
    for (let x = 0; x < row.length; x++) {
      const id = row[x];
      if (!id) continue;
      const color = flashing ? "#ecece4" : PIECE_COLORS[id];
      const a = flashing ? 0.55 + 0.45 * Math.sin(flashT * 28) : 1;
      drawBlock(ctx, ox + x * cell, oy + (y - HIDDEN_ROWS) * cell, cell, color, a);
    }
  }

  const p = engine.active;
  if (p && engine.status !== "over") {
    const gy = engine.ghostY();
    if (gy !== p.y) {
      for (const c of cellsOf(p.id, p.rot, p.x, gy)) {
        if (c.y < HIDDEN_ROWS) continue;
        drawBlock(
          ctx,
          ox + c.x * cell,
          oy + (c.y - HIDDEN_ROWS) * cell,
          cell,
          PIECE_COLORS[p.id],
          1,
          true,
        );
      }
    }
    for (const c of cellsOf(p.id, p.rot, p.x, p.y)) {
      if (c.y < HIDDEN_ROWS) continue;
      drawBlock(
        ctx,
        ox + c.x * cell,
        oy + (c.y - HIDDEN_ROWS) * cell,
        cell,
        PIECE_COLORS[p.id],
      );
    }
  }

  return { cell, ox, oy, boardW, boardH };
}

export function drawMini(
  ctx: CanvasRenderingContext2D,
  id: PieceId | null,
  dim = false,
) {
  const { width, height } = ctx.canvas;
  ctx.clearRect(0, 0, width, height);
  if (!id) return;
  const cells = cellsOf(id, 0, 0, 0);
  let minX = 99,
    minY = 99,
    maxX = -99,
    maxY = -99;
  for (const c of cells) {
    minX = Math.min(minX, c.x);
    minY = Math.min(minY, c.y);
    maxX = Math.max(maxX, c.x);
    maxY = Math.max(maxY, c.y);
  }
  const bw = maxX - minX + 1;
  const bh = maxY - minY + 1;
  const pad = 8;
  const cell = Math.floor(Math.min((width - pad * 2) / 4, (height - pad * 2) / 4));
  const ox = (width - bw * cell) / 2 - minX * cell;
  const oy = (height - bh * cell) / 2 - minY * cell;
  for (const c of cells) {
    drawBlock(ctx, ox + c.x * cell, oy + c.y * cell, cell, PIECE_COLORS[id], dim ? 0.38 : 1);
  }
}
