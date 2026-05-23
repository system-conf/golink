export const EXPIRATION_OPTIONS = ["1h", "1d", "7d", "30d", "never"] as const;
export type ExpirationOption = (typeof EXPIRATION_OPTIONS)[number];

const MS = {
  "1h": 60 * 60 * 1000,
  "1d": 24 * 60 * 60 * 1000,
  "7d": 7 * 24 * 60 * 60 * 1000,
  "30d": 30 * 24 * 60 * 60 * 1000,
} as const;

export function computeExpiresAt(option: ExpirationOption, now = Date.now()): number | null {
  if (option === "never") return null;
  return now + MS[option];
}
