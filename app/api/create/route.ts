import { NextRequest } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { entries } from "@/lib/schema";
import { isValidSlug, generateSlug } from "@/lib/slug";
import { hashIp } from "@/lib/hash";
import { computeExpiresAt, EXPIRATION_OPTIONS } from "@/lib/expiration";
import { checkCreateLimit } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const bodySchema = z
  .object({
    type: z.enum(["link", "note"]),
    content: z.string().min(1).max(10_000),
    slug: z
      .string()
      .trim()
      .toLowerCase()
      .optional()
      .or(z.literal(""))
      .transform((v) => (v ? v : undefined)),
    expiresIn: z.enum(EXPIRATION_OPTIONS).default("7d"),
  })
  .superRefine((val, ctx) => {
    if (val.type === "link") {
      if (val.content.length > 2048) {
        ctx.addIssue({ code: "custom", message: "Link 2048 karakteri aşıyor.", path: ["content"] });
      }
      try {
        const u = new URL(val.content);
        if (u.protocol !== "http:" && u.protocol !== "https:") {
          ctx.addIssue({ code: "custom", message: "Sadece http/https linkleri kabul edilir.", path: ["content"] });
        }
      } catch {
        ctx.addIssue({ code: "custom", message: "Geçerli bir URL gir.", path: ["content"] });
      }
    }
    if (val.slug && !isValidSlug(val.slug)) {
      ctx.addIssue({
        code: "custom",
        message: "İsim sadece küçük harf, rakam ve tire içerebilir (1-32 karakter), rezerve bir isim olamaz.",
        path: ["slug"],
      });
    }
  });

function getClientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "0.0.0.0";
}

function buildPublicUrl(req: NextRequest, slug: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "");
  if (base) return `${base}/${slug}`;
  const origin = req.nextUrl.origin;
  return `${origin}/${slug}`;
}

export async function POST(req: NextRequest) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return Response.json({ error: "Geçersiz JSON." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return Response.json(
      { error: first?.message ?? "Geçersiz veri.", field: first?.path?.[0] },
      { status: 400 },
    );
  }
  const { type, content, slug: requestedSlug, expiresIn } = parsed.data;

  const ipHash = hashIp(getClientIp(req));
  const rl = await checkCreateLimit(ipHash);
  if (!rl.ok) return Response.json({ error: rl.reason }, { status: 429 });

  const expiresAt = computeExpiresAt(expiresIn);
  const createdAt = Date.now();

  if (requestedSlug) {
    const existing = await db.select({ slug: entries.slug }).from(entries).where(eq(entries.slug, requestedSlug)).limit(1);
    if (existing.length > 0) {
      return Response.json({ error: "Bu isim zaten alınmış." }, { status: 409 });
    }
    try {
      await db.insert(entries).values({
        slug: requestedSlug,
        type,
        content,
        createdAt,
        expiresAt,
        createdIpHash: ipHash,
      });
    } catch {
      return Response.json({ error: "Bu isim zaten alınmış." }, { status: 409 });
    }
    return Response.json({ url: buildPublicUrl(req, requestedSlug), slug: requestedSlug, expiresAt });
  }

  for (let i = 0; i < 5; i++) {
    const slug = generateSlug();
    try {
      await db.insert(entries).values({
        slug,
        type,
        content,
        createdAt,
        expiresAt,
        createdIpHash: ipHash,
      });
      return Response.json({ url: buildPublicUrl(req, slug), slug, expiresAt });
    } catch {
      continue;
    }
  }
  return Response.json({ error: "Kısa isim üretilemedi, tekrar dene." }, { status: 500 });
}
