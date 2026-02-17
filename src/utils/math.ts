/**
 * Math utilities
 */

export function clamp(n: number, lo: number, hi: number): number {
  if (Number.isNaN(n)) return lo;
  return Math.max(lo, Math.min(hi, n));
}

export function randomInt(lo: number, hiInclusive: number): number {
  return Math.floor(Math.random() * (hiInclusive - lo + 1)) + lo;
}

export function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function sampleUnique<T>(
  items: T[],
  k: number,
  keyFn: (x: T) => string
): T[] {
  const out: T[] = [];
  const seen = new Set<string>();
  for (const it of shuffle(items)) {
    const key = keyFn(it);
    if (seen.has(key)) continue;
    out.push(it);
    seen.add(key);
    if (out.length >= k) break;
  }
  return out;
}

export function cryptoRandomId(): string {
  const a = new Uint32Array(4);
  crypto.getRandomValues(a);
  return Array.from(a)
    .map((x) => x.toString(16).padStart(8, "0"))
    .join("");
}
