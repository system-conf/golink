import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";

export const entries = sqliteTable(
  "entries",
  {
    slug: text("slug").primaryKey(),
    type: text("type", { enum: ["link", "note"] }).notNull(),
    content: text("content").notNull(),
    createdAt: integer("created_at").notNull(),
    expiresAt: integer("expires_at"),
    viewCount: integer("view_count").notNull().default(0),
    createdIpHash: text("created_ip_hash").notNull(),
  },
  (t) => [index("idx_entries_expires_at").on(t.expiresAt)],
);

export type Entry = typeof entries.$inferSelect;
export type NewEntry = typeof entries.$inferInsert;
