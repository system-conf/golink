import { NextRequest } from "next/server";
import { lt, isNotNull, and } from "drizzle-orm";
import { db } from "@/lib/db";
import { entries } from "@/lib/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return Response.json({ error: "unauthorized" }, { status: 401 });
    }
  }

  const now = Date.now();
  const deleted = await db
    .delete(entries)
    .where(and(isNotNull(entries.expiresAt), lt(entries.expiresAt, now)))
    .returning({ slug: entries.slug });

  return Response.json({ deleted: deleted.length });
}
