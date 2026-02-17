/**
 * Text manipulation and normalization utilities
 */

import type { Normalize } from "../types";

export function compareText(a: string, b: string, mode: Normalize): boolean {
  return normalizeForCompare(a, mode) === normalizeForCompare(b, mode);
}

export function normalizeForCompare(s: string, mode: Normalize): string {
  const x = s ?? "";
  if (mode === "strict") return x.trim();
  if (mode === "basic") return x.trim().toLowerCase().replace(/\s+/g, " ");
  return x
    .trim()
    .toLowerCase()
    .replace(/[\p{P}\p{S}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function splitIntoLines(text: string): string[] {
  return text
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
}

export function normalizeLines(lines: string[]): string[] {
  const out: string[] = [];
  for (const l of lines) {
    if (out.length === 0 || out[out.length - 1] !== l) out.push(l);
  }
  return out;
}

export function buildWordCorpus(lines: string[]): string[] {
  const set = new Set<string>();
  for (const line of lines) {
    const words = line.match(/[\p{L}\p{N}''\-]+/gu) ?? [];
    for (const w of words) {
      const ww = w.trim();
      if (ww.length >= 2) set.add(ww);
    }
  }
  return Array.from(set);
}

export function isWord(s: string): boolean {
  return /^[\p{L}\p{N}''\-]+$/u.test(s);
}

export function commonPrefixLen(a: string, b: string): number {
  const n = Math.min(a.length, b.length);
  let i = 0;
  while (i < n && a[i] === b[i]) i++;
  return i;
}

export function commonSuffixLen(a: string, b: string): number {
  const n = Math.min(a.length, b.length);
  let i = 0;
  while (i < n && a[a.length - 1 - i] === b[b.length - 1 - i]) i++;
  return i;
}

export function similarityScore(a: string, b: string): number {
  const aa = normalizeForCompare(a, "punct");
  const bb = normalizeForCompare(b, "punct");
  if (!aa || !bb) return 0;

  const lenScore =
    1 -
    Math.min(
      1,
      Math.abs(aa.length - bb.length) / Math.max(aa.length, bb.length)
    );
  const pref = commonPrefixLen(aa, bb) / Math.max(aa.length, bb.length);
  const suf = commonSuffixLen(aa, bb) / Math.max(aa.length, bb.length);
  return 0.5 * lenScore + 0.3 * pref + 0.2 * suf;
}
