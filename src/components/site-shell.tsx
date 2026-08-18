import type { ReactNode } from "react";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { cn } from "@/lib/utils";

export function SiteShell({
  children,
  bare = false,
}: {
  children: ReactNode;
  bare?: boolean;
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-bg text-fg">
      <SiteHeader />
      <div className={cn("flex-1", bare && "flex min-h-0 flex-col")}>
        {children}
      </div>
      {bare ? null : <SiteFooter />}
    </div>
  );
}
