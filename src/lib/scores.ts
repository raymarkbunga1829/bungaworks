import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { z } from "zod";

const runSchema = z.object({
  score: z.number().int().min(0).max(99_999_999),
  lines: z.number().int().min(0).max(99_999),
  level: z.number().int().min(1).max(30),
});

export const submitRun = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(runSchema)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const id = crypto.randomUUID();
    await sql`
      insert into stack_runs (id, user_id, score, lines, level)
      values (${id}, ${context.userId}, ${data.score}, ${data.lines}, ${data.level})
    `;
    return { id };
  });

export const listTopRuns = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  return sql<{
    name: string;
    score: number;
    lines: number;
    level: number;
    created_at: string;
  }>`
    select u."name" as name, r.score, r.lines, r.level, r.created_at
    from stack_runs r
    join "user" u on u."id" = r.user_id
    order by r.score desc
    limit 12
  `;
});

export const listMyRuns = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    return sql<{
      score: number;
      lines: number;
      level: number;
      created_at: string;
    }>`
      select score, lines, level, created_at
      from stack_runs
      where user_id = ${context.userId}
      order by score desc
      limit 10
    `;
  });
