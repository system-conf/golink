import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

declare global {
  var __ratelimitMinute: Ratelimit | undefined;
  var __ratelimitDay: Ratelimit | undefined;
}

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

function build(redis: Redis, limit: number, window: `${number} ${"s" | "m" | "h" | "d"}`, prefix: string) {
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(limit, window),
    analytics: false,
    prefix,
  });
}

export function getRatelimits() {
  const redis = getRedis();
  if (!redis) return null;
  if (!globalThis.__ratelimitMinute) {
    globalThis.__ratelimitMinute = build(redis, 5, "1 m", "rl:create:m");
  }
  if (!globalThis.__ratelimitDay) {
    globalThis.__ratelimitDay = build(redis, 50, "1 d", "rl:create:d");
  }
  return { minute: globalThis.__ratelimitMinute, day: globalThis.__ratelimitDay };
}

export async function checkCreateLimit(ipHash: string): Promise<{ ok: true } | { ok: false; reason: string }> {
  const limits = getRatelimits();
  if (!limits) return { ok: true };
  const m = await limits.minute.limit(ipHash);
  if (!m.success) return { ok: false, reason: "Çok hızlı gidiyorsun, bir dakika sonra dene." };
  const d = await limits.day.limit(ipHash);
  if (!d.success) return { ok: false, reason: "Günlük limite ulaştın, yarın tekrar dene." };
  return { ok: true };
}
