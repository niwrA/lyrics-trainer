/**
 * useSongs - Song management composable
 * Handles CRUD operations, persistence, and song set management
 * Module-level singleton state shared across all callers.
 */

import { computed, ref, watch } from "vue";
import type { Song, SongSet } from "../types";
import { LS_SONGS } from "../utils/storage";
import { sanitizeSong, validateSongSet } from "../utils/sanitize";
import { cryptoRandomId, sampleUnique } from "../utils/math";
import { normalizeLines, splitIntoLines } from "../utils/text";
import { downloadText } from "../utils/export";

// --- Singleton state (shared across all useSongs() calls) ---
const songSets = ref<SongSet[]>([]);
const currentSetId = ref<string | null>(null);
const currentSongId = ref<string | null>(null);

const songs = computed(() => {
  const set = songSets.value.find((s) => s.id === currentSetId.value);
  return set?.songs ?? [];
});

const currentSong = computed(() =>
  songs.value.find((s) => s.id === currentSongId.value) ?? null
);

function persistSongs(): void {
  localStorage.setItem(
    LS_SONGS,
    JSON.stringify({
      songSets: songSets.value,
      currentSetId: currentSetId.value,
      currentSongId: currentSongId.value,
    })
  );
}

// ------------------------------------------------------------

export function useSongs() {
  function getCurrentSet(): SongSet | null {
    return songSets.value.find((s) => s.id === currentSetId.value) ?? null;
  }

  function addSong(song: Song): boolean {
    const set = getCurrentSet();
    if (!set) return false;
    set.songs.unshift(song);
    currentSongId.value = song.id;
    return true;
  }

  function deleteSongById(id: string): boolean {
    const set = getCurrentSet();
    if (!set) return false;
    set.songs = set.songs.filter((x) => x.id !== id);
    if (currentSongId.value === id) {
      currentSongId.value = set.songs.length ? set.songs[0].id : null;
    }
    return true;
  }

  function updateSong(id: string, updates: Partial<Song>): boolean {
    const song = songs.value.find((s) => s.id === id);
    if (!song) return false;
    Object.assign(song, updates);
    return true;
  }

  function selectSong(id: string): boolean {
    if (!songs.value.find((s) => s.id === id)) return false;
    currentSongId.value = id;
    return true;
  }

  function createNewSet(name: string): SongSet | null {
    if (!name || !name.trim()) return null;
    const newSet: SongSet = {
      id: cryptoRandomId(),
      name: name.trim(),
      createdAt: new Date().toISOString(),
      songs: [],
    };
    songSets.value.push(newSet);
    currentSetId.value = newSet.id;
    currentSongId.value = null;
    return newSet;
  }

  function deleteCurrentSet(): boolean {
    const set = getCurrentSet();
    if (!set) return false;
    songSets.value = songSets.value.filter((s) => s.id !== set.id);
    currentSetId.value = songSets.value.length ? songSets.value[0].id : null;
    currentSongId.value = null;
    return true;
  }

  function renameCurrentSet(newName: string): boolean {
    const set = getCurrentSet();
    if (!set || !newName || !newName.trim()) return false;
    const trimmed = newName.trim();
    if (trimmed === set.name) return false;
    set.name = trimmed;
    return true;
  }

  function importSongsJson(jsonStr: string): number {
    try {
      const parsed = JSON.parse(jsonStr);

      if (Array.isArray(parsed.songSets)) {
        const incomingSets = parsed.songSets as any[];
        const setById = new Map<string, SongSet>();
        for (const set of songSets.value) setById.set(set.id, set);
        let importedCount = 0;
        for (const incomingSet of incomingSets) {
          const validated = validateSongSet(incomingSet);
          if (validated) {
            setById.set(validated.id, validated);
            importedCount++;
          }
        }
        songSets.value = Array.from(setById.values());
        if (!currentSetId.value && songSets.value.length) {
          currentSetId.value = songSets.value[0].id;
        }
        return importedCount;
      }

      const incomingSongs: Song[] = Array.isArray(parsed)
        ? parsed
        : Array.isArray(parsed?.songs)
          ? parsed.songs
          : [];

      const cleaned = incomingSongs
        .map((x) => sanitizeSong(x))
        .filter((x): x is Song => !!x && x.lines.length >= 2 && !!x.title);

      if (!cleaned.length) return 0;

      if (!currentSetId.value || !getCurrentSet()) {
        const newSet: SongSet = {
          id: cryptoRandomId(),
          name: `Imported ${new Date().toLocaleDateString()}`,
          createdAt: new Date().toISOString(),
          songs: cleaned,
        };
        songSets.value.push(newSet);
        currentSetId.value = newSet.id;
      } else {
        const set = getCurrentSet();
        if (set) {
          const byId = new Map<string, Song>();
          for (const s of set.songs) byId.set(s.id, s);
          for (const s of cleaned) byId.set(s.id, s);
          set.songs = Array.from(byId.values());
        }
      }

      if (!currentSongId.value && songs.value.length)
        currentSongId.value = songs.value[0].id;

      return cleaned.length;
    } catch {
      return 0;
    }
  }

  function exportSongsJson(): void {
    const payload = JSON.stringify({ songSets: songSets.value }, null, 2);
    downloadText("\uFEFF" + payload, "song-sets.json", "application/json;charset=utf-8");
  }

  function addSongFromPaste(
    title: string,
    artist: string | undefined,
    album: string | undefined,
    lyricsText: string
  ): boolean {
    const lines = normalizeLines(splitIntoLines(lyricsText));
    if (lines.length < 2) return false;
    const set = getCurrentSet();
    if (!set) return false;
    const song: Song = {
      id: cryptoRandomId(),
      title,
      artist: artist?.trim() || undefined,
      album: album?.trim() || undefined,
      createdAt: new Date().toISOString(),
      lines,
    };
    return addSong(song);
  }

  function loadSongs(): void {
    const raw = localStorage.getItem(LS_SONGS);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as any;

      if (Array.isArray(parsed.songSets) && parsed.songSets.length > 0) {
        songSets.value = parsed.songSets;
        currentSetId.value =
          parsed.currentSetId ||
          (parsed.songSets.length > 0 ? parsed.songSets[0].id : null);
        currentSongId.value = parsed.currentSongId || null;
        return;
      }

      if (Array.isArray(parsed.songs) && parsed.songs.length > 0) {
        const existingSet: SongSet = {
          id: cryptoRandomId(),
          name: "Existing Songs",
          createdAt: new Date().toISOString(),
          songs: parsed.songs,
        };
        songSets.value = [existingSet];
        currentSetId.value = existingSet.id;
        currentSongId.value = parsed.currentSongId || null;
      }
    } catch {
      // Ignore parse errors
    }
  }

  return {
    songSets,
    currentSetId,
    currentSongId,
    songs: computed(() => songs.value),
    currentSong,

    addSong,
    deleteSongById,
    updateSong,
    selectSong,

    createNewSet,
    deleteCurrentSet,
    renameCurrentSet,
    getCurrentSet,

    importSongsJson,
    exportSongsJson,
    addSongFromPaste,

    loadSongs,
    persistSongs,
    watchAndPersist: () => {
      watch(
        () => [songSets.value, currentSetId.value, currentSongId.value],
        () => persistSongs(),
        { deep: true }
      );
    },
  };
}
