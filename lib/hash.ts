import { createHash } from "node:crypto";

export function hashIp(ip: string): string {
  const salt = process.env.IP_HASH_SALT ?? "dev-salt-change-me";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}
