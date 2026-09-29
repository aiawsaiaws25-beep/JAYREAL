import "server-only";
import { headers } from "next/headers";

/**
 * Simple fixed-window rate limiter kept in process memory.
 * Good enough for a single Node instance; on multi-instance serverless
 * each instance keeps its own window, so treat it as a first line of defence.
 */

type Bucket = { count: number; resetAt: number };
type GlobalWithBuckets = typeof globalThis & { __rateBuckets?: Map<string, Bucket> };
const g = globalThis as GlobalWithBuckets;
const buckets = (g.__rateBuckets ??= new Map<string, Bucket>());

export type RateLimitResult = { ok: true; remaining: number } | { ok: false; retryAfterSeconds: number };

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    if (buckets.size > 5000) {
      for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
    }
    return { ok: true, remaining: limit - 1 };
  }

  if (bucket.count >= limit) {
    return { ok: false, retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)) };
  }

  bucket.count += 1;
  return { ok: true, remaining: limit - bucket.count };
}

/** Best-effort client IP from proxy headers (Vercel sets x-forwarded-for). */
export async function getClientIp(): Promise<string> {
  const h = await headers();
  const fwd = h.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return h.get("x-real-ip") ?? h.get("cf-connecting-ip") ?? "unknown";
}
