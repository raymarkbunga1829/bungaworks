import { useEffect, useRef } from "react";
import { drawMini } from "@/lib/tetris/render";
import type { PieceId } from "@/lib/tetris/pieces";

export function MiniPiece({
  id,
  dim,
  label,
}: {
  id: PieceId | null;
  dim?: boolean;
  label?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawMini(ctx, id, dim);
  }, [id, dim]);

  return (
    <div className="flex flex-col gap-1.5">
      {label ? (
        <span className="text-[10px] uppercase tracking-[0.18em] text-subtle">
          {label}
        </span>
      ) : null}
      <canvas
        ref={ref}
        className="h-16 w-16 rounded-sm bg-well sm:h-[4.5rem] sm:w-[4.5rem]"
        aria-hidden
      />
    </div>
  );
}
