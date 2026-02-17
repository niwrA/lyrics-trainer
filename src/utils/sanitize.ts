/**
 * Data sanitization and validation
 */

import type { Song, SongSet, Word } from "../types";
import { cryptoRandomId } from "./math";
import { normalizeLines } from "./text";

export function validateSongSet(x: any): SongSet | null {
  if (!x || typeof x !== "object") return null;
  const id = String(x.id ?? cryptoRandomId());
  const name = String(x.name ?? "").trim();
  const createdAt = x.createdAt
    ? String(x.createdAt)
    : new Date().toISOString();

  const songs = Array.isArray(x.songs)
    ? x.songs
        .map((s: any) => sanitizeSong(s))
        .filter((s): s is Song => !!s && s.lines.length >= 2 && !!s.title)
    : [];

  if (!name || !songs.length) return null;

  return {
    id,
    name,
    createdAt,
    songs,
  };
}

export function sanitizeSong(x: any): Song | null {
  if (!x) return null;
  const title = String(x.title ?? "").trim();
  const lines = Array.isArray(x.lines)
    ? x.lines.map((l: any) => String(l).trim()).filter((l: string) => l)
    : [];
  if (!title || lines.length < 2) return null;
  return {
    id: String(x.id ?? cryptoRandomId()),
    title,
    artist: x.artist ? String(x.artist) : undefined,
    album: x.album ? String(x.album) : undefined,
    createdAt: x.createdAt
      ? String(x.createdAt)
      : new Date().toISOString(),
    lines: normalizeLines(lines),
    vocabulary: sanitizeVocabulary(x.vocabulary),
  };
}

export function sanitizeVocabulary(vocab: any): Word[] | undefined {
  if (!Array.isArray(vocab)) return undefined;
  const sanitized: Word[] = [];
  for (const v of vocab) {
    if (!v || typeof v !== "object") continue;
    const word = String(v.word ?? "").trim();
    if (!word) continue;
    sanitized.push({
      word,
      translation: v.translation ? String(v.translation).trim() : undefined,
      explanation: v.explanation
        ? String(v.explanation).trim()
        : undefined,
    });
  }
  return sanitized.length > 0 ? sanitized : undefined;
}
