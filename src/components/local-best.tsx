import { useEffect, useState } from "react";
import { loadSave } from "@/lib/tetris/persist";

export function LocalBest({ className = "" }: { className?: string }) {
  const [best, setBest] = useState<number | null>(null);

  useEffect(() => {
    setBest(loadSave().best);
  }, []);

  if (!best) return null;

  return (
    <p className={className}>
      Your best on this device{" "}
      <span className="font-mono tabular-nums text-fg">
        {best.toLocaleString()}
      </span>
    </p>
  );
}
