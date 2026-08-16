import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";

export const Route = createFileRoute("/journal")({ component: JournalLayout });

function JournalLayout() {
  return (
    <SiteShell>
      <Outlet />
    </SiteShell>
  );
}
