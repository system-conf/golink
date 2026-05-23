import { customAlphabet } from "nanoid";

const SLUG_RE = /^[a-z0-9-]{1,32}$/;

export const RESERVED_SLUGS = new Set([
  "api",
  "_next",
  "favicon",
  "favicon.ico",
  "robots.txt",
  "sitemap.xml",
  "admin",
  "login",
  "logout",
  "register",
  "signup",
  "dashboard",
  "settings",
  "static",
  "public",
  "assets",
  "about",
  "terms",
  "privacy",
  "contact",
  "help",
  "docs",
  "new",
  "edit",
  "delete",
]);

export function isValidSlug(slug: string): boolean {
  return SLUG_RE.test(slug) && !RESERVED_SLUGS.has(slug);
}

const nano = customAlphabet("abcdefghijkmnpqrstuvwxyz23456789", 6);

export function generateSlug(): string {
  return nano();
}
