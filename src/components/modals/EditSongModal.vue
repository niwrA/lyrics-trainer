<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="emitClose()">
    <div class="modal-card modal-card-large">
      <div class="modal-header">
        <div class="modal-header-content">
          <h2>{{ t("editSongJson") }}</h2>
          <a class="help-link" href="/json-format-help.html" target="_blank" rel="noopener noreferrer"
            :title="t('jsonFormatHelp')">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2" />
              <text x="12" y="16" text-anchor="middle" font-size="14" font-weight="bold"
                fill="currentColor">?</text>
            </svg>
          </a>
        </div>
        <button class="close-btn" @click="emitClose()">&times;</button>
      </div>

      <div class="modal-tabs">
        <button class="modal-tab" :class="{ active: editMode === 'raw' }" @click="editMode = 'raw'">
          {{ t("editModeRaw") }}
        </button>
        <button class="modal-tab" :class="{ active: editMode === 'visual' }" @click="editMode = 'visual'">
          {{ t("editModeVisual") }}
        </button>
      </div>

      <div class="modal-body">
        <!-- RAW JSON MODE -->
        <div v-if="editMode === 'raw'" class="edit-mode-content">
          <p class="small">{{ t("editSongJson") }}</p>
          <textarea v-model="editJsonText" class="json-editor" rows="20"></textarea>
        </div>

        <!-- VISUAL EDITOR MODE -->
        <div v-else class="edit-mode-content visual-editor">
          <div class="visual-editor-section">
            <label>{{ t("title") }}</label>
            <input v-model="visualEditData.title" type="text" class="editor-input" />
          </div>

          <div class="visual-editor-section">
            <label>{{ t("artist") }}</label>
            <input v-model="visualEditData.artist" type="text" class="editor-input" />
          </div>

          <div class="visual-editor-section">
            <label>{{ t("album") }}</label>
            <input v-model="visualEditData.album" type="text" class="editor-input" />
          </div>

          <div class="visual-editor-section">
            <label>{{ t("pasteFullLyrics") }}</label>
            <textarea v-model="visualEditData.lyricsText" class="lyrics-editor" rows="10"
              @mouseup="handleLyricsSelection"></textarea>
            <p class="small" style="margin-top: 6px; color: #666;">
              {{ t("selectWordsForTranslation") }}
            </p>
            <button v-if="!selectedText" class="btn" @click="selectedText = 'manually-opened'"
              style="margin-top: 8px;">
              {{ t("addTranslation") }}
            </button>
          </div>

          <div v-if="selectedText" class="translation-panel">
            <div class="translation-header">
              <strong>{{ t("addTranslation") }}</strong>
            </div>

            <div class="translation-section">
              <label>{{ t("vocabularyWord") }}</label>
              <input v-model="translationData.word" type="text" class="editor-input"
                :placeholder="selectedText !== 'manually-opened' ? selectedText : t('typeHere')" />
            </div>

            <div class="translation-section">
              <label>{{ t("vocabularyTranslation") }}</label>
              <input v-model="translationData.translation" type="text" class="editor-input"
                :placeholder="t('optional')" />
            </div>

            <div class="translation-section">
              <label>{{ t("vocabularyExplanation") }}</label>
              <textarea v-model="translationData.explanation" class="explanation-editor" rows="3"
                :placeholder="t('optional')"></textarea>
            </div>

            <div class="translation-actions">
              <button class="btn primary" @click="addVocabularyItem()">{{ t("addVocab") }}</button>
              <button class="btn" @click="selectedText = ''">{{ t("cancel") }}</button>
            </div>
          </div>

          <div v-if="visualEditData.vocabulary && visualEditData.vocabulary.length > 0" class="vocabulary-list">
            <h4>{{ t("vocabularyItems") }} ({{ visualEditData.vocabulary.length }})</h4>
            <div class="vocab-items-container">
              <div v-for="(item, idx) in visualEditData.vocabulary" :key="idx" class="vocab-item-row">
                <div class="vocab-item-fields">
                  <div class="vocab-field">
                    <label class="vocab-label">{{ t("vocabularyWord") }}</label>
                    <input v-model="item.word" type="text" class="vocab-input" />
                  </div>
                  <div class="vocab-field">
                    <label class="vocab-label">{{ t("vocabularyTranslation") }}</label>
                    <input v-model="item.translation" type="text" class="vocab-input" />
                  </div>
                  <div class="vocab-field">
                    <label class="vocab-label">{{ t("vocabularyExplanation") }}</label>
                    <input v-model="item.explanation" type="text" class="vocab-input" />
                  </div>
                </div>
                <button class="vocab-remove-btn" @click="removeVocabularyItem(idx)" :title="t('delete')"
                  :aria-label="t('delete')">
                  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                    <path
                      d="M9 3h6l1 2h4v2H4V5h4l1-2zm1 7h2v9h-2v-9zm4 0h2v9h-2v-9zM7 10h2v9H7v-9zm1-1h10l-1 12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 9h2z"
                      fill="#d32f2f" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="feedback.message" class="feedback" style="margin-top: 12px;">
          <div :class="['pill', feedback.ok ? 'ok' : 'bad']">{{ feedback.message }}</div>
          <div class="small" v-if="feedback.details">{{ feedback.details }}</div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn" @click="emitClose()">{{ t("cancel") }}</button>
        <button class="btn primary" @click="saveEditedSong()">{{ t("saveChanges") }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import { useSongs } from "../../composables/useSongs";
import { useI18n } from "../../composables/useI18n";
import type { Song } from "../../types";

// Props
interface Props {
  isOpen: boolean;
  songId?: string;
}

const props = defineProps<Props>();

// Emits
const emit = defineEmits<{
  close: [];
}>();

// Composables
const { t } = useI18n("en");
const { songs, currentSong, updateSong } = useSongs();

// State
const editMode = ref<"raw" | "visual">("visual");
const editJsonText = ref("");
const selectedText = ref("");

const visualEditData = reactive({
  title: "",
  artist: "",
  album: "",
  lyricsText: "",
  vocabulary: [] as Array<{ word: string; translation?: string; explanation?: string }>,
});

const translationData = reactive({
  word: "",
  translation: "",
  explanation: "",
});

const feedback = reactive({
  ok: true,
  message: "",
  details: "",
});

// Functions
function emitClose() {
  emit("close");
}

function loadSongForEdit() {
  if (!props.songId) return;
  const song = songs.value.find((s) => s.id === props.songId);
  if (!song) return;

  editJsonText.value = JSON.stringify(song, null, 2);
  visualEditData.title = song.title;
  visualEditData.artist = song.artist || "";
  visualEditData.album = song.album || "";
  visualEditData.lyricsText = song.lines.join("\n");
  visualEditData.vocabulary = JSON.parse(JSON.stringify(song.vocabulary || []));
}

function handleLyricsSelection() {
  const selection = window.getSelection();
  if (selection && selection.toString().trim()) {
    selectedText.value = selection.toString().trim();
  }
}

function addVocabularyItem() {
  if (!visualEditData.vocabulary) visualEditData.vocabulary = [];
  visualEditData.vocabulary.push({
    word: translationData.word || selectedText.value,
    translation: translationData.translation,
    explanation: translationData.explanation,
  });
  translationData.word = "";
  translationData.translation = "";
  translationData.explanation = "";
  selectedText.value = "";
}

function removeVocabularyItem(idx: number) {
  visualEditData.vocabulary?.splice(idx, 1);
}

function saveEditedSong() {
  try {
    if (!props.songId) return;

    let updatedSong: Song;

    if (editMode.value === "raw") {
      updatedSong = JSON.parse(editJsonText.value);
    } else {
      updatedSong = {
        id: props.songId,
        title: visualEditData.title,
        artist: visualEditData.artist || undefined,
        album: visualEditData.album || undefined,
        createdAt: new Date().toISOString(),
        lines: visualEditData.lyricsText
          .split("\n")
          .map((l) => l.trim())
          .filter((l) => l.length > 0),
        vocabulary: visualEditData.vocabulary,
      };
    }

    updateSong(props.songId, updatedSong);
    feedback.ok = true;
    feedback.message = t("saveChanges");
    setTimeout(() => {
      feedback.message = "";
      emitClose();
    }, 1000);
  } catch (error) {
    feedback.ok = false;
    feedback.message = `Error: ${error instanceof Error ? error.message : "Unknown error"}`;
  }
}

// Watch for open changes
watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal && props.songId) {
      loadSongForEdit();
    }
  }
);
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  width: 90%;
  max-width: 800px;
}

.modal-card-large {
  max-width: 900px;
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header-content {
  display: flex;
  gap: 10px;
  align-items: center;
  flex: 1;
}

.modal-header-content > h2 {
  margin: 0;
  font-size: 20px;
  color: #333;
}

.help-link {
  color: #1976d2;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 4px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #999;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #333;
}

.modal-tabs {
  display: flex;
  gap: 10px;
  padding: 10px 20px;
  border-bottom: 1px solid #e0e0e0;
}

.modal-tab {
  padding: 10px 15px;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  font-size: 14px;
  color: #666;
}

.modal-tab.active {
  color: #1976d2;
  border-bottom-color: #1976d2;
}

.modal-body {
  padding: 20px;
  overflow-y: auto;
  flex: 1;
}

.edit-mode-content {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.json-editor {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: monospace;
  font-size: 12px;
  resize: vertical;
}

.visual-editor {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.visual-editor-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.visual-editor-section > label {
  font-weight: 600;
  font-size: 14px;
  color: #333;
}

.editor-input,
.lyrics-editor {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 13px;
}

.editor-input:focus,
.lyrics-editor:focus {
  outline: none;
  border-color: #1976d2;
  box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.1);
}

.translation-panel {
  padding: 15px;
  background: #f5f5f5;
  border-radius: 8px;
}

.translation-header {
  margin-bottom: 12px;
  color: #333;
}

.translation-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
}

.translation-section > label {
  font-weight: 500;
  font-size: 13px;
  color: #555;
}

.explanation-editor {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 12px;
  resize: vertical;
}

.translation-actions {
  display: flex;
  gap: 10px;
  margin-top: 12px;
}

.vocabulary-list {
  margin-top: 20px;
  padding: 15px;
  background: #fafafa;
  border-radius: 8px;
}

.vocabulary-list > h4 {
  margin: 0 0 12px 0;
  color: #333;
}

.vocab-items-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.vocab-item-row {
  display: flex;
  gap: 10px;
  padding: 10px;
  background: white;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
}

.vocab-item-fields {
  flex: 1;
  display: flex;
  gap: 10px;
}

.vocab-field {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.vocab-label {
  font-size: 11px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
}

.vocab-input {
  padding: 6px;
  border: 1px solid #ddd;
  border-radius: 3px;
  font-size: 12px;
}

.vocab-remove-btn {
  padding: 6px;
  background: none;
  border: none;
  cursor: pointer;
  color: #d32f2f;
  display: flex;
  align-items: center;
}

.vocab-remove-btn:hover {
  opacity: 0.7;
}

.modal-footer {
  padding: 20px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn {
  padding: 10px 16px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn:hover {
  background: #f5f5f5;
}

.btn.primary {
  background: #1976d2;
  color: white;
  border-color: #1976d2;
}

.btn.primary:hover {
  background: #1565c0;
}

.feedback {
  padding: 12px;
  background: #f9f9f9;
  border-radius: 4px;
}

.pill {
  padding: 8px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
}

.pill.ok {
  background: #e8f5e9;
  color: #2e7d32;
}

.pill.bad {
  background: #ffebee;
  color: #c62828;
}

.small {
  font-size: 12px;
  color: #999;
}
</style>
