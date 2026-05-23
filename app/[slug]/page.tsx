import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { entries } from "@/lib/schema";
import { NoteView } from "@/components/NoteView";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function now(): number {
  return Date.now();
}

export default async function SlugPage(props: PageProps<"/[slug]">) {
  const { slug } = await props.params;
  const normalized = slug.toLowerCase();

  const rows = await db
    .select()
    .from(entries)
    .where(eq(entries.slug, normalized))
    .limit(1);

  const row = rows[0];
  if (!row) notFound();

  if (row.expiresAt && row.expiresAt < now()) {
    void db.delete(entries).where(eq(entries.slug, normalized)).catch(() => {});
    notFound();
  }

  void db
    .update(entries)
    .set({ viewCount: sql`${entries.viewCount} + 1` })
    .where(eq(entries.slug, normalized))
    .catch(() => {});

  if (row.type === "link") {
    redirect(row.content);
  }

  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <header className="mb-4">
          <Link href="/" className="text-xs font-medium text-gray-400 hover:text-gray-600">
            ← golink
          </Link>
        </header>
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <NoteView content={row.content} expiresAt={row.expiresAt} />
        </div>
      </div>
    </main>
  );
}
