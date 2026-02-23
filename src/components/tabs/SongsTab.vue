<template>
  <section class="card">
    <div class="card-body">
      <div class="tabs">
        <button class="tab" :class="{ active: sourceTab === 'library' }" @click="sourceTab = 'library'">
          {{ t("tabLibrary") }}
        </button>
        <button class="tab" :class="{ active: sourceTab === 'paste' }" @click="sourceTab = 'paste'">
          {{ t("tabPaste") }}
        </button>
        <button class="tab" :class="{ active: sourceTab === 'json' }" @click="sourceTab = 'json'">
          {{ t("tabJsonImport") }}
        </button>
        <button class="tab" @click="exportSongsJson()">{{ t("exportSongsJson") }}</button>
      </div>

      <!-- LIBRARY TAB -->
      <div v-if="sourceTab === 'library'" class="panel">
        <div class="row">
          <label>{{ t("songSets") }}</label>
          <div class="row-grow">
            <select v-model="currentSetId">
              <option v-for="set in songSets" :key="set.id" :value="set.id">
                {{ set.name }} ({{ set.songs.length }})
              </option>
            </select>
          </div>
          <button class="icon-btn primary" @click="handleNewSet()" :title="t('newSet')" :aria-label="t('newSet')">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor" />
            </svg>
          </button>
          <button class="icon-btn primary" @click="handleRenameSet()" :title="t('renameSet')"
            :aria-label="t('renameSet')">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" fill="currentColor" />
              <path
                d="M20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                fill="currentColor" />
            </svg>
          </button>
          <button class="icon-btn danger" @click="handleDeleteSet()" :title="t('deleteSet')"
            :aria-label="t('deleteSet')">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path
                d="M9 3h6l1 2h4v2H4V5h4l1-2zm1 7h2v9h-2v-9zm4 0h2v9h-2v-9zM7 10h2v9H7v-9zm1-1h10l-1 12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 9h2z"
                fill="#d32f2f" />
            </svg>
          </button>
        </div>

        <div class="row">
          <label>{{ t("search") }}</label>
          <input v-model="songSearch" :placeholder="t('searchPlaceholder')" class="search-input" />
          <div class="sort-controls">
            <label class="sort-label">{{ t("sortBy") }}</label>
            <select v-model="songSort.key" class="sort-select">
              <option value="title">{{ t("sortTitle") }}</option>
              <option value="artist">{{ t("sortArtist") }}</option>
              <option value="createdAt">{{ t("sortCreatedAt") }}</option>
              <option value="lines">{{ t("sortLines") }}</option>
            </select>
            <select v-model="songSort.dir" class="sort-select-dir">
              <option value="asc">{{ t("sortAsc") }}</option>
              <option value="desc">{{ t("sortDesc") }}</option>
            </select>
          </div>
        </div>

        <div class="song-list">
          <div v-for="s in sortedFilteredSongs" :key="s.id" class="song-row"
            :class="{ selected: currentSong?.id === s.id }">
            <button class="song-main" @click="handleSelectSong(s.id)">
              <div class="song-title">{{ s.title }}</div>
              <div class="song-meta">
                <span v-if="s.artist">{{ s.artist }}</span>
                <span v-if="s.album">• {{ s.album }}</span>
                <span>• {{ t("linesCount", { n: s.lines.length }) }}</span>
              </div>
            </button>

            <button class="icon-btn primary" type="button" :aria-label="t('edit')" :title="t('edit')"
              @click.stop="emitEditSong(s.id)">
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" fill="currentColor" />
                <path
                  d="M20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                  fill="currentColor" />
              </svg>
            </button>

            <button class="icon-btn danger" type="button" :aria-label="t('delete')" :title="t('delete')"
              @click.stop="deleteSongById(s.id)">
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path
                  d="M9 3h6l1 2h4v2H4V5h4l1-2zm1 7h2v9h-2v-9zm4 0h2v9h-2v-9zM7 10h2v9H7v-9zm1-1h10l-1 12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 9h2z"
                  fill="#d32f2f" />
              </svg>
            </button>
          </div>
        </div>

        <div class="small">{{ t("tipAddSongs") }}</div>
      </div>

      <!-- PASTE TAB -->
      <div v-else-if="sourceTab === 'paste'" class="panel">
        <div class="row">
          <label>{{ t("title") }}</label>
          <input v-model="pasteForm.title" :placeholder="t('titlePlaceholder')" />
        </div>
        <div class="row">
          <label>{{ t("artist") }}</label>
          <input v-model="pasteForm.artist" :placeholder="t('optional')" />
        </div>
        <div class="row">
          <label>{{ t("album") }}</label>
          <input v-model="pasteForm.album" :placeholder="t('optional')" />
        </div>

        <label>{{ t("pasteFullLyrics") }}</label>
        <textarea v-model="pasteForm.text" rows="12" :placeholder="t('pastePlaceholder')"></textarea>
        <div class="row sticky-actions">
          <button class="btn primary" @click="handlePasteSong()">
            {{ t("addToLibrary") }}
          </button>
          <button class="btn" @click="clearPasteForm()">
            {{ t("clear") }}
          </button>
        </div>
        <div class="small">{{ t("pasteHint") }}</div>
      </div>

      <!-- JSON IMPORT TAB -->
      <div v-else class="panel">
        <div class="row">
          <label>{{ t("importFromFile") }}</label>
          <input type="file" accept=".json" @change="handleFileImport" />
        </div>

        <div style="text-align: center; margin: 16px 0; color: #999;">
          — {{ t("or") }} —
        </div>

        <label>{{ t("pasteJson") }}</label>
        <textarea v-model="jsonImportText" rows="12" :placeholder="t('jsonPlaceholder')"></textarea>

        <div class="row">
          <button class="btn primary" @click="handleJsonImport()">{{ t("import") }}</button>
          <button class="btn" @click="jsonImportText = ''">{{ t("clear") }}</button>
        </div>

        <details class="small">
          <summary>{{ t("jsonSchemaExampleTitle") }}</summary>
          <pre class="code">{{ jsonSchemaExample }}</pre>
        </details>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { useSongs } from "../../composables/useSongs";
import { useI18n } from "../../composables/useI18n";
import { useSettings } from "../../composables/useSettings";
import type { Song } from "../../types";

// Props & Emits
const emit = defineEmits<{
  editSong: [songId: string];
  navigate: [tab: string];
}>();

// Composables
const { settings } = useSettings();
const { t } = useI18n(() => settings.uiLang as "en" | "es");
const songs = useSongs();

// Computed
const {
  songSets,
  currentSetId,
  songs: currentSongs,
  currentSong,
  selectSong,
  deleteSongById,
  createNewSet,
  renameCurrentSet,
  deleteCurrentSet,
  exportSongsJson,
  addSongFromPaste,
  importSongsJson,
} = songs;

// Local state
const sourceTab = ref<"library" | "paste" | "json">("library");
const songSearch = ref("");
const songSort = reactive({ key: "title" as keyof Song, dir: "asc" as "asc" | "desc" });

const pasteForm = reactive({
  title: "",
  artist: "",
  album: "",
  text: "",
});

const jsonImportText = ref("");

const jsonSchemaExample = `[
  {
    "id": "song-1",
    "title": "Song Title",
    "artist": "Artist Name",
    "album": "Album Name",
    "createdAt": "2024-01-01T00:00:00Z",
    "lines": [
      "First line of lyrics",
      "Second line of lyrics"
    ],
    "vocabulary": [
      {
        "word": "example",
        "translation": "ejemplo",
        "explanation": "A typical instance"
      }
    ]
  }
]`;

// Computed
const sortedFilteredSongs = computed(() => {
  let result = currentSongs.value.filter((s) =>
    JSON.stringify(s).toLowerCase().includes(songSearch.value.toLowerCase())
  );

  const key = songSort.key;
  result = result.sort((a, b) => {
    let aVal: any = a[key];
    let bVal: any = b[key];

    if (key === "lines") {
      aVal = (a.lines?.length ?? 0) as any;
      bVal = (b.lines?.length ?? 0) as any;
    }

    if (typeof aVal === "string") aVal = (aVal as string).toLowerCase();
    if (typeof bVal === "string") bVal = (bVal as string).toLowerCase();

    if (aVal == null) aVal = "";
    if (bVal == null) bVal = "";

    if (aVal < bVal) return songSort.dir === "asc" ? -1 : 1;
    if (aVal > bVal) return songSort.dir === "asc" ? 1 : -1;
    return 0;
  });

  return result;
});

// Handlers
function handleNewSet() {
  const name = prompt(t("newSet"));
  if (name) {
    createNewSet(name);
  }
}

function handleRenameSet() {
  const name = prompt(t("renameSet"));
  if (name) {
    renameCurrentSet(name);
  }
}

function handleDeleteSet() {
  if (confirm(t("deleteSet"))) {
    deleteCurrentSet();
  }
}

function handlePasteSong() {
  if (!pasteForm.title) {
    alert(t("provideTitle"));
    return;
  }
  if (!pasteForm.text.trim()) {
    alert(t("pasteLyricsFirst"));
    return;
  }
  addSongFromPaste(pasteForm.title, pasteForm.artist, pasteForm.album, pasteForm.text);
  clearPasteForm();
  sourceTab.value = "library";
  emit("navigate", "train");
}

function clearPasteForm() {
  pasteForm.title = "";
  pasteForm.artist = "";
  pasteForm.album = "";
  pasteForm.text = "";
}

function handleFileImport(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const content = e.target?.result as string;
    jsonImportText.value = content;
  };
  reader.readAsText(file);
}

function handleJsonImport() {
  if (!jsonImportText.value.trim()) {
    alert(t("jsonPasteFirst"));
    return;
  }
  try {
    const count = importSongsJson(jsonImportText.value);
    alert(t("importedSongs", { n: count }));
    jsonImportText.value = "";
    sourceTab.value = "library";
  } catch (error) {
    alert(t("jsonParseError") + `: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

function emitEditSong(songId: string) {
  emit("editSong", songId);
}

function handleSelectSong(id: string) {
  selectSong(id);
  emit("navigate", "train");
}
</script>


