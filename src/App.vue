<template>
  <div class="app">
    <!-- MODAL: Onboarding / Getting Started -->
    <div v-if="showOnboarding" class="modal-overlay" @click.self="showOnboarding = false">
      <div class="modal-card modal-card-large">
        <div class="modal-header">
          <div class="modal-header-content">
            <h2>{{ t("onboardingTitle") }}</h2>
          </div>
          <button class="close-btn" @click="showOnboarding = false">&times;</button>
        </div>

        <div class="modal-body onboarding-content">
          <div class="onboarding-section">
            <h3>👋 {{ t("onboardingWelcome") }}</h3>
            <p>{{ t("onboardingWelcomeDesc") }}</p>
          </div>

          <div class="onboarding-section">
            <h3>🎵 {{ t("onboardingStep1") }}</h3>
            <p>{{ t("onboardingStep1Desc") }}</p>
            <ul>
              <li>{{ t("onboardingStep1a") }}</li>
              <li>{{ t("onboardingStep1b") }}</li>
              <li>{{ t("onboardingStep1c") }}</li>
            </ul>
          </div>

          <div class="onboarding-section">
            <h3>⚙️ {{ t("onboardingStep2") }}</h3>
            <p>{{ t("onboardingStep2Desc") }}</p>
            <ul>
              <li><strong>{{ t("modeNextLine") }}:</strong> {{ t("onboardingMode1") }}</li>
              <li><strong>{{ t("modeCloze") }}:</strong> {{ t("onboardingMode2") }}</li>
              <li><strong>{{ t("modeType") }}:</strong> {{ t("onboardingMode3") }}</li>
              <li><strong>{{ t("modeVocabulary") }}:</strong> {{ t("onboardingMode4") }}</li>
            </ul>
          </div>

          <div class="onboarding-section">
            <h3>💡 {{ t("onboardingTips") }}</h3>
            <ul>
              <li>{{ t("onboardingTip1") }}</li>
              <li>{{ t("onboardingTip2") }}</li>
              <li>{{ t("onboardingTip3") }}</li>
            </ul>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn primary" @click="showOnboarding = false">{{ t("gotIt") }}</button>
        </div>
      </div>
    </div>

    <div class="topbar">
      <div class="topbar-row">
        <div class="brand">
          <div class="brand-title">{{ t("appTitle") }}</div>
          <!-- <div class="brand-sub">{{ t("appSubtitle") }}</div> -->
        </div>
        <button class="brand-btn" @click="showOnboarding = true" :title="t('helpButton')" :aria-label="t('helpButton')">
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2" />
            <text x="12" y="15.5" text-anchor="middle" font-size="14" font-weight="bold" fill="currentColor">?</text>
          </svg>
        </button>
      </div>

      <nav class="topbar-tabs" role="tablist" aria-label="App sections">
        <button class="topbar-tab" role="tab" :aria-selected="appTab === 'songs'"
          :class="{ active: appTab === 'songs' }" @click="appTab = 'songs'">
          {{ t("sourceAndSongs") }}
        </button>

        <button class="topbar-tab" role="tab" :aria-selected="appTab === 'train'"
          :class="{ active: appTab === 'train' }" @click="appTab = 'train'">
          {{ t("training") }}
        </button>

        <button class="topbar-tab" role="tab" :aria-selected="appTab === 'settings'"
          :class="{ active: appTab === 'settings' }" @click="appTab = 'settings'">
          {{ t("exerciseAndOptions") }}
        </button>

        <button class="topbar-tab" role="tab" :aria-selected="appTab === 'about'"
          :class="{ active: appTab === 'about' }" @click="appTab = 'about'">
          {{ t("tabAbout") }}
        </button>
      </nav>
    </div>

    <main class="main" role="tabpanel">
      <!-- TAB: Songs -->
      <SongsTab v-if="appTab === 'songs'" @edit-song="startEditSong" @navigate="appTab = ($event as AppTab)" />

      <!-- MODAL: Edit Song -->
      <div v-if="editingSongId" class="modal-overlay" @click.self="editingSongId = null">
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
            <button class="close-btn" @click="editingSongId = null">&times;</button>
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
                    <button class="vocab-remove-btn" @click="removeVocabularyItem(idx)" :title="t('delete')" :aria-label="t('delete')">
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

            <div v-if="feedback.message && editingSongId" class="feedback" style="margin-top: 12px;">
              <div :class="['pill', feedback.ok ? 'ok' : 'bad']">{{ feedback.message }}</div>
              <div class="small" v-if="feedback.details">{{ feedback.details }}</div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn" @click="editingSongId = null">{{ t("cancel") }}</button>
            <button class="btn primary" @click="saveEditedSong()">{{ t("saveChanges") }}</button>
          </div>
        </div>
      </div>

      <!-- TAB: Train -->
      <section v-else-if="appTab === 'train'" class="card">
        <!-- <div class="card-head">
          <div class="card-title">{{ t("training") }}</div>
        </div> -->

        <div class="card-body">
          <div v-if="!currentSong" class="empty">{{ t("chooseSongFirst") }}</div>

          <div v-else class="trainer">
            <!-- MODE SELECTOR IN TRAINING -->
            <div class="training-mode-selector">
              <label>{{ t("exercise") }}</label>
              <select v-model="settings.mode" @change="resetRound(true)">
                <option value="nextLine">{{ t("modeNextLine") }}</option>
                <option value="cloze">{{ t("modeCloze") }}</option>
                <option value="type">{{ t("modeType") }}</option>
                <option value="vocabulary">{{ t("modeVocabulary") }}</option>
              </select>
            </div>

            <TrainerShell 
              :current-song="currentSong" 
              :settings="settings" 
              :training="training" 
            />
          </div>
        </div>
      </section>

      <!-- TAB: Settings -->
      <SettingsTab v-else-if="appTab === 'settings'" @reset-round="resetRound" />

      <!-- TAB: About -->
      <section v-else-if="appTab === 'about'" class="about">
        <div class="card-body">
          <h2 class="about-title">{{ t("aboutTitle") }}</h2>
          <p class="about-p">{{ t("aboutP1") }}</p>
          <p class="about-p">{{ t("aboutP2") }}</p>
          <p class="about-p">{{ t("aboutP3") }}</p>
        </div>
      </section>

    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch, Ref } from "vue";
import TrainerShell from "./components/trainer/TrainerShell.vue";
import SettingsTab from "./components/tabs/SettingsTab.vue";
import SongsTab from "./components/tabs/SongsTab.vue";
import { useI18n } from "./composables/useI18n";
import { useSongs } from "./composables/useSongs";
import { useSettings } from "./composables/useSettings";
import { sanitizeSong } from "./utils/sanitize";
import { clamp, randomInt, shuffle, sampleUnique, cryptoRandomId } from "./utils/math";
import { compareText, normalizeForCompare, buildWordCorpus, splitIntoLines, normalizeLines } from "./utils/text";
import type { Lang } from "./types";

/**
 * -----------------------------
 * Types / Storage
 * -----------------------------
 */
type Word = {
  word: string;
  translation?: string;
  explanation?: string;
};

type Song = {
  id: string;
  title: string;
  artist?: string;
  album?: string;
  createdAt: string;
  lines: string[];
  vocabulary?: Word[];
};

type SongSet = {
  id: string;
  name: string;
  createdAt: string;
  songs: Song[];
};

type Mode = "nextLine" | "cloze" | "type" | "vocabulary";
type Order = "sequence" | "random";
type Normalize = "strict" | "basic" | "punct";
type ClozeInput = "choice" | "type";
type ClozeProgression = "on" | "off";
type TypeTarget = "nextLine" | "currentLine";
type HintLine = "on" | "off";
type NextLineInput = "choice" | "type";

const LS_SONGS = "lyricsTrainer.songs.v1";
const showContinue = ref(false);
const lastWasCorrect = ref(false);
const lastClozePick = ref<{ key: string; ok: boolean } | null>(null);
const showOnboarding = ref(false);

// Tweak these to taste
const GOOD_MS = 1200; // show success feedback longer
const GOOD_WITH_DETAILS_MS = 2000; // show success feedback with explanation even longer

// Track pending auto-advance timer so it can be cancelled on song change / reset
let advanceTimer: ReturnType<typeof setTimeout> | null = null;


/**
 * -----------------------------
 * ✅ NEW: top-level app tab state
 * -----------------------------
 */
type AppTab = "songs" | "train" | "settings" | "about";
const appTab: Ref<AppTab> = ref("songs");

/**
 * -----------------------------
 * Reactive settings — shared singleton via useSettings()
 * -----------------------------
 */
const { settings, loadSettings, watchAndPersist: watchSettings } = useSettings();

/**
 * -----------------------------
 * i18n  translations live in src/composables/useI18n.ts
 * -----------------------------
 */
const { t } = useI18n(() => settings.uiLang as "en" | "es");

/**
 * -----------------------------
 * Minimal seed library
 * -----------------------------
 */
function seedSongs(): Song[] {
  return [
    {
      id: cryptoRandomId(),
      title: "Greensleeves",
      artist: "Traditional",
      album: "Public Domain",
      createdAt: new Date().toISOString(),
      lines: [
        "Alas, my love, you do me wrong",
        "To cast me off discourteously",
        "For I have loved you so long",
        "Delighting in your company",
      ],
      vocabulary: [
        { word: "Alas", translation: "Ay (expresión de tristeza)", explanation: "Interjection expressing grief or regret" },
        { word: "discourteously", translation: "descortésmente", explanation: "In a rude or impolite manner" },
        { word: "Delighting", translation: "disfrutando", explanation: "Taking great pleasure in something" },
      ],
    },
    {
      id: cryptoRandomId(),
      title: "Twinkle, Twinkle, Little Star",
      artist: "Jane Taylor",
      album: "Public Domain",
      createdAt: new Date().toISOString(),
      lines: [
        "Twinkle, twinkle, little star",
        "How I wonder what you are",
        "Up above the world so high",
        "Like a diamond in the sky",
      ],
      vocabulary: [
        { word: "Twinkle", translation: "Brillar/Centellear", explanation: "To shine with a flickering light" },
        { word: "wonder", translation: "me pregunto", explanation: "To think about something with curiosity" },
        { word: "diamond", translation: "diamante", explanation: "A precious gemstone, very bright and clear" },
      ],
    },
    {
      id: cryptoRandomId(),
      title: "La Marcha de Zacatecas",
      artist: "Genaro Codina",
      album: "Public Domain",
      createdAt: new Date().toISOString(),
      lines: [
        "Por la puerta principal",
        "Entra la comitiva oficial",
        "Con su música marcial",
        "Y su paso procesional",
      ],
      vocabulary: [
        { word: "puerta", translation: "door", explanation: "An opening in a wall to enter or exit" },
        { word: "comitiva", translation: "procession/entourage", explanation: "A group of people traveling together, often in a formal ceremony" },
        { word: "marcial", translation: "martial", explanation: "Relating to soldiers or military" },
        { word: "procesional", translation: "processional", explanation: "Related to a formal procession or parade" },
      ],
    },
    {
      id: cryptoRandomId(),
      title: "Yankee Doodle",
      artist: "Traditional American",
      album: "Public Domain",
      createdAt: new Date().toISOString(),
      lines: [
        "Yankee Doodle went to town",
        "Riding on a pony",
        "Stuck a feather in his cap",
        "And called it macaroni",
      ],
      vocabulary: [
        { word: "Yankee", translation: "Americano", explanation: "A person from the northern United States" },
        { word: "pony", translation: "pony/caballo pequeño", explanation: "A small horse" },
        { word: "feather", translation: "pluma", explanation: "One of the light structures covering a bird's body" },
        { word: "macaroni", translation: "macarrones", explanation: "A type of pasta; also slang for fancy or fashionable" },
      ],
    },
  ];
}

/**
 * -----------------------------
 * State
 * -----------------------------
 */

// Songs state — shared singleton via useSongs()
const {
  songSets,
  currentSetId,
  currentSongId,
  songs,
  getCurrentSet,
  loadSongs,
  persistSongs,
  watchAndPersist: watchSongs,
} = useSongs();

// Song editor state
const editingSongId = ref<string | null>(null);
const editJsonText = ref("");
const editMode = ref<"raw" | "visual">("visual");

// Visual editor state
const visualEditData = reactive<{
  title: string;
  artist: string;
  album: string;
  lyricsText: string;
  vocabulary: Word[];
}>({
  title: "",
  artist: "",
  album: "",
  lyricsText: "",
  vocabulary: [],
});

const selectedText = ref<string | null>(null);
const translationData = reactive({
  word: "",
  translation: "",
  explanation: "",
});

const stats = reactive({ correct: 0, total: 0 });

const revealAnswer = ref(false);
const roundLocked = ref(false);

const feedback = reactive<{ ok: boolean; message: string; details?: string }>({
  ok: true,
  message: "",
  details: "",
});

const currentIndex = ref(0);
const promptLine = ref("");
const answerLine = ref("");

type Choice = { key: string; text: string; isCorrect: boolean };
const mcqChoices = ref<Choice[]>([]);

type ClozeToken =
  | { type: "text"; value: string }
  | { type: "blank"; correct: string; filled: string | null };
const clozeTokens = ref<ClozeToken[]>([]);
const clozeBlanks = computed(() =>
  clozeTokens.value.filter(
    (t): t is Extract<ClozeToken, { type: "blank" }> => t.type === "blank"
  )
);
const activeBlankIndex = ref(0);
const clozeChoices = ref<string[]>([]);
const clozeMissingCount = ref(1);
const clozeConsecutiveCorrect = ref(0);
const clozeConsecutiveIncorrect = ref(0);

const typedInput = ref("");

// Vocabulary training state
const vocabIndex = ref(0);
const vocabChoices = ref<string[]>([]);
const currentWord = computed(() => {
  if (!currentSong.value?.vocabulary || vocabIndex.value >= currentSong.value.vocabulary.length) {
    return null;
  }
  return currentSong.value.vocabulary[vocabIndex.value];
});

const currentSong = computed(
  () => songs.value.find((s) => s.id === currentSongId.value) ?? null
);

// ✅ NEW: Unified training ref for TrainerShell
const training = computed(() => ({
  stats,
  revealAnswer: revealAnswer.value,
  roundLocked: roundLocked.value,
  feedback,
  currentIndex: currentIndex.value,
  promptLine: promptLine.value,
  answerLine: answerLine.value,
  mcqChoices: mcqChoices.value,
  clozeTokens: clozeTokens.value,
  clozeBlanks: clozeBlanks.value,
  activeBlankIndex: activeBlankIndex.value,
  clozeChoices: clozeChoices.value,
  clozeMissingCount: clozeMissingCount.value,
  clozeConsecutiveCorrect: clozeConsecutiveCorrect.value,
  clozeConsecutiveIncorrect: clozeConsecutiveIncorrect.value,
  get typedInput() {
    return typedInput.value;
  },
  set typedInput(val: string) {
    typedInput.value = val;
  },
  vocabIndex: vocabIndex.value,
  vocabChoices: vocabChoices.value,
  currentWord: currentWord.value,
  showContinue: showContinue.value,
  // Methods
  submitChoice,
  submitTypedNextLine,
  submitClozeChoice,
  submitTypedCloze,
  submitVocabularyChoice,
  setFeedback,
  advanceAfterCorrect,
  advanceVocabQuestion,
  findBlankIndexByToken,
  selectBlankByToken,
  isBlankFilled,
  submitTypedLine,
  setActiveBlankIndex,
  tryAgainSamePrompt,
  continueAfterWrong,
}));

/**
 * -----------------------------
 * Lifecycle / persistence
 * -----------------------------
 */
onMounted(() => {
  loadSongs();
  loadSettings();
  watchSongs();
  watchSettings();

  // Initialize default set if none exist
  if (!songSets.value.length) {
    const defaultSet: SongSet = {
      id: cryptoRandomId(),
      name: "Default",
      createdAt: new Date().toISOString(),
      songs: seedSongs(),
    };
    songSets.value.push(defaultSet);
    currentSetId.value = defaultSet.id;
    persistSongs();
  }

  // Always ensure "Lyrics Trainer Demo Set" exists (even if local storage exists)
  const demoSetExists = songSets.value.some((s) => s.name === "Lyrics Trainer Demo Set");
  if (!demoSetExists) {
    const demoSet: SongSet = {
      id: cryptoRandomId(),
      name: "Lyrics Trainer Demo Set",
      createdAt: new Date().toISOString(),
      songs: seedSongs(),
    };
    songSets.value.push(demoSet);
    persistSongs();
  }

  // Ensure current set is selected
  if (!currentSetId.value && songSets.value.length) {
    currentSetId.value = songSets.value[0].id;
  }

  // Ensure current song is selected from current set
  const currentSet = getCurrentSet();
  if (!currentSongId.value && currentSet?.songs.length) {
    currentSongId.value = currentSet.songs[0].id;
  }

  resetRound(true);
});

watch(
  () => currentSongId.value,
  () => resetRound(true)
);

watch(
  () => songs.value,
  () => persistSongs(),
  { deep: true }
);

/**
 * -----------------------------
 * Edit Song modal
 * -----------------------------
 */
function startEditSong(id: string) {
  const song = songs.value.find((s) => s.id === id);
  if (!song) return;
  editingSongId.value = id;
  editJsonText.value = JSON.stringify(song, null, 2);
  editMode.value = "visual";

  // Initialize visual editor data
  visualEditData.title = song.title || "";
  visualEditData.artist = song.artist || "";
  visualEditData.album = song.album || "";
  visualEditData.lyricsText = song.lines.join("\n");
  visualEditData.vocabulary = song.vocabulary ? [...song.vocabulary] : [];

  selectedText.value = "";
  translationData.word = "";
  translationData.translation = "";
  translationData.explanation = "";

  feedback.message = "";
  feedback.details = "";
}

function saveEditedSong() {
  if (!editingSongId.value) return;

  try {
    let updated: any;

    if (editMode.value === "raw") {
      // Parse JSON from raw mode
      updated = JSON.parse(editJsonText.value);
    } else {
      // Build song object from visual mode
      updated = {
        id: editingSongId.value,
        title: visualEditData.title.trim(),
        artist: visualEditData.artist.trim() || undefined,
        album: visualEditData.album.trim() || undefined,
        lines: visualEditData.lyricsText
          .split("\n")
          .map((l) => l.trim())
          .filter((l) => l.length > 0),
        vocabulary: visualEditData.vocabulary.length > 0 ? visualEditData.vocabulary : undefined,
        createdAt: songs.value.find((s) => s.id === editingSongId.value)?.createdAt || new Date().toISOString(),
      };
    }

    // Validate the updated song
    const validated = sanitizeSong(updated);
    if (!validated) {
      return setFeedback(false, t("jsonParseError"), "Invalid song structure");
    }

    // Preserve the ID
    validated.id = editingSongId.value;

    // Find and replace the song
    const idx = songs.value.findIndex((s) => s.id === editingSongId.value);
    if (idx !== -1) {
      songs.value[idx] = validated;
      setFeedback(true, t("songUpdated"));
      setTimeout(() => {
        editingSongId.value = null;
        feedback.message = "";
      }, 1000);
    }
  } catch (e: any) {
    setFeedback(false, t("jsonParseError"), String(e?.message ?? e));
  }
}

function handleLyricsSelection() {
  const textarea = document.querySelector(".lyrics-editor") as HTMLTextAreaElement;
  if (!textarea) return;

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;

  if (start !== end) {
    // Text is selected
    selectedText.value = textarea.value.substring(start, end).trim();
    translationData.word = selectedText.value;
  } else {
    // No text selected
    selectedText.value = null;
  }
}

function addVocabularyItem() {
  const word = translationData.word.trim();
  const translation = translationData.translation.trim();

  if (!word || !translation) {
    return setFeedback(false, t("provideTitle"), "Word and translation are required");
  }

  const vocabItem: Word = {
    word,
    translation,
    explanation: translationData.explanation.trim() || undefined,
  };

  visualEditData.vocabulary.push(vocabItem);

  // Clear the form
  translationData.word = "";
  translationData.translation = "";
  translationData.explanation = "";
  selectedText.value = null;

  setFeedback(true, t("addVocab"));
}

function removeVocabularyItem(idx: number) {
  if (idx >= 0 && idx < visualEditData.vocabulary.length) {
    visualEditData.vocabulary.splice(idx, 1);
  }
}

/**
 * -----------------------------
 * Session controls
 * -----------------------------
 */
function resetSession() {
  stats.correct = 0;
  stats.total = 0;
  clozeMissingCount.value = clamp(
    settings.clozeStartMissing,
    1,
    settings.clozeMaxMissing
  );
  resetRound(true);
  setFeedback(true, t("sessionReset"));
}

function advanceAfterCorrect(delayMs?: number) {
  // Use longer delay if there are feedback details (explanation), otherwise use default
  const actualDelay = delayMs ?? (feedback.details ? GOOD_WITH_DETAILS_MS : GOOD_MS);
  if (advanceTimer !== null) clearTimeout(advanceTimer);
  advanceTimer = setTimeout(() => {
    advanceTimer = null;
    newPrompt();
  }, actualDelay);
}

/**
 * -----------------------------
 * Rounds
 * -----------------------------
 */
function resetRoundUiState() {
  if (advanceTimer !== null) {
    clearTimeout(advanceTimer);
    advanceTimer = null;
  }
  roundLocked.value = false;
  typedInput.value = "";
  revealAnswer.value = false;

  feedback.message = "";
  feedback.details = "";

  // if you added these:
  showContinue.value = false;
  lastWasCorrect.value = false;
  lastClozePick.value = null;

  // NOTE: Do NOT reset cloze progression counters here - they should persist across lines
  // clozeConsecutiveCorrect and clozeConsecutiveIncorrect only reset in resetRound(resetIndex: true)
}

function resetRound(resetIndex: boolean) {
  resetRoundUiState();

  if (!currentSong.value) return;
  const n = currentSong.value.lines.length;
  if (n < 2) return;

  if (resetIndex) {
    currentIndex.value =
      settings.order === "sequence" ? 0 : randomInt(0, n - 2);
    // Also reset cloze progression counters on full reset
    clozeConsecutiveCorrect.value = 0;
    clozeConsecutiveIncorrect.value = 0;
  }

  clozeMissingCount.value = clamp(
    settings.clozeStartMissing,
    1,
    settings.clozeMaxMissing
  );

  buildPromptAndAnswer();
  buildExerciseArtifacts();
}

function newPrompt() {
  if (!currentSong.value) return;

  resetRoundUiState();

  const n = currentSong.value.lines.length;
  if (settings.order === "sequence")
    currentIndex.value = (currentIndex.value + 1) % Math.max(1, n - 1);
  else currentIndex.value = randomInt(0, n - 2);

  buildPromptAndAnswer();
  buildExerciseArtifacts();
}

function buildPromptAndAnswer() {
  if (!currentSong.value) return;

  // For vocabulary mode, don't show prompt/answer lines
  if (settings.mode === "vocabulary") {
    promptLine.value = "";
    answerLine.value = "";
    return;
  }

  const lines = currentSong.value.lines;

  const safeIdx = clamp(currentIndex.value, 0, lines.length - 2);

  if (settings.mode === "type" && settings.typeTarget === "currentLine") {
    promptLine.value = lines[safeIdx];
    answerLine.value = lines[safeIdx];
  } else {
    promptLine.value = lines[safeIdx];
    answerLine.value = lines[safeIdx + 1];
  }
}

function buildExerciseArtifacts() {
  if (!currentSong.value) return;

  if (settings.mode === "nextLine") {
    mcqChoices.value = buildNextLineChoices(currentIndex.value);
    clozeTokens.value = [];
    clozeChoices.value = [];
    activeBlankIndex.value = 0;
    return;
  }

  if (settings.mode === "cloze") {
    const baseLine = answerLine.value;
    const { tokens, blanks } = buildClozeTokens(
      baseLine,
      clozeMissingCount.value
    );
    clozeTokens.value = tokens;
    activeBlankIndex.value = 0;

    if (settings.clozeInput === "choice")
      clozeChoices.value = buildClozeChoices(
        blanks[0]?.correct ?? "",
        settings.optionCount
      );
    else clozeChoices.value = [];

    mcqChoices.value = [];
    return;
  }

  if (settings.mode === "vocabulary") {
    vocabIndex.value = 0;
    buildVocabularyOptions();
    mcqChoices.value = [];
    clozeTokens.value = [];
    clozeChoices.value = [];
    activeBlankIndex.value = 0;
    return;
  }

  mcqChoices.value = [];
  clozeTokens.value = [];
  clozeChoices.value = [];
  activeBlankIndex.value = 0;
}

/**
 * -----------------------------
 * Submit handlers
 * -----------------------------
 */
function submitChoice(chosenText: string) {
  if (roundLocked.value) return;
  roundLocked.value = true;

  const chosenKey = normalizeForCompare(chosenText, settings.normalize);
  const correctKey = normalizeForCompare(answerLine.value, settings.normalize);
  const ok = chosenKey === correctKey;

  stats.total += 1;
  if (ok) {
    stats.correct += 1;
    setFeedback(true, t("good"));
    advanceAfterCorrect(); // uses GOOD_MS
  } else {
    revealAnswer.value = false;
    setFeedback(false, t("notGood"), `${t("correctLabel")}: "${answerLine.value}"`);
    // showContinue is set by setFeedback(false,...)
  }
}


function submitTypedNextLine() {
  if (roundLocked.value) return;

  const target = answerLine.value;
  const ok = compareText(typedInput.value, target, settings.normalize);

  stats.total += 1;
  if (ok) {
    stats.correct += 1;
    setFeedback(true, t("good"));
    roundLocked.value = true;
    advanceAfterCorrect();
  } else {
    revealAnswer.value = true;
    roundLocked.value = true;
    setFeedback(false, t("notGood"), `${t("expectedLabel")}: "${target}"`);
  }
}


function submitTypedLine() {
  if (roundLocked.value) return;

  const target =
    settings.typeTarget === "currentLine" ? promptLine.value : answerLine.value;
  const ok = compareText(typedInput.value, target, settings.normalize);

  stats.total += 1;
  if (ok) {
    stats.correct += 1;
    setFeedback(true, t("good"));
    roundLocked.value = true;
    advanceAfterCorrect();
  } else {
    revealAnswer.value = true;
    roundLocked.value = true;
    const typed = typedInput.value || "(empty)";
    const detailsMsg = `${t("youTypedLabel")}: "${typed}"\n${t("expectedLabel")}: "${target}"`;
    setFeedback(false, t("notGood"), detailsMsg);
  }
}

function submitClozeChoice(word: string) {
  if (roundLocked.value) return;
  const blank = clozeBlanks.value[activeBlankIndex.value];
  if (!blank || blank.filled) return;

  const ok = compareText(word, blank.correct, settings.normalize);

  // ✅ remember what they clicked (use a stable normalized key)
  lastClozePick.value = {
    key: normalizeForCompare(word, "punct"),
    ok,
  };

  if (ok) {
    blank.filled = blank.correct;
    setFeedback(true, t("wordCorrect"));

    // Track progression on each correct blank
    clozeConsecutiveIncorrect.value = 0;
    clozeConsecutiveCorrect.value += 1;

    // Increase difficulty after 4 consecutive correct answers
    if (settings.clozeProgression === "on" && clozeConsecutiveCorrect.value >= 4) {
      clozeMissingCount.value = clamp(
        clozeMissingCount.value + 1,
        1,
        settings.clozeMaxMissing
      );
      clozeConsecutiveCorrect.value = 0; // Reset counter after increasing
    }

    const nextIdx = findNextUnfilledBlankIndex();
    if (nextIdx === -1) {
      // All blanks filled, finalize the round
      stats.total += 1;
      stats.correct += 1;
      advanceAfterCorrect();
    } else {
      activeBlankIndex.value = nextIdx;
      lastClozePick.value = null; // ✅ reset for next blank
      // Clear feedback and choices so next blank appears fresh
      feedback.message = "";
      feedback.details = "";
      clozeChoices.value = [];
    }
  } else {
    setFeedback(
      false,
      t("wordIncorrect"),
      `${t("correctLabel")}: "${blank.correct}"`
    );

    // Track progression on incorrect blank
    clozeConsecutiveCorrect.value = 0;
    clozeConsecutiveIncorrect.value += 1;

    // Decrease difficulty after 2 consecutive incorrect answers
    if (settings.clozeProgression === "on" && clozeConsecutiveIncorrect.value >= 2) {
      clozeMissingCount.value = clamp(
        clozeMissingCount.value - 1,
        1,
        settings.clozeMaxMissing
      );
      clozeConsecutiveIncorrect.value = 0; // Reset counter after decreasing
    }

    // keep roundLocked = false so they can try again
  }
}


function submitTypedCloze() {
  if (roundLocked.value) return;

  const missing = clozeBlanks.value.map((b) => b.correct);
  const typed = typedInput.value.trim();
  const ok = compareText(typed, missing.join(" "), settings.normalize);

  stats.total += 1;
  if (ok) {
    stats.correct += 1;
    for (const b of clozeBlanks.value) b.filled = b.correct;
    finalizeClozeRound(true);
  } else {
    revealAnswer.value = true;
    finalizeClozeRound(false, `${t("expectedLabel")}: "${missing.join(" ")}"`);
    // finalizeClozeRound(false) currently locks; that's fine
  }
}


function finalizeClozeRound(ok: boolean, details?: string) {
  roundLocked.value = true;

  if (ok) {
    setFeedback(true, t("clozeCorrect"));
    advanceAfterCorrect();
  } else {
    setFeedback(false, t("clozeIncorrect"), details);
  }
}

function submitVocabularyChoice(chosenOption: string) {
  if (roundLocked.value) return;
  if (!currentWord.value) return;

  roundLocked.value = true;

  // The correct answer is either translation or explanation (prefer translation)
  const correct = currentWord.value.translation || currentWord.value.explanation || "";
  const ok = chosenOption === correct;

  stats.total += 1;
  if (ok) {
    stats.correct += 1;
    // Include explanation in the feedback if it exists and is different from the translation
    const explanation = currentWord.value.explanation;
    const hasExplanation = explanation && explanation !== currentWord.value.translation;
    const details = hasExplanation ? explanation : undefined;
    setFeedback(true, t("good"), details);
    advanceVocabQuestion();
  } else {
    setFeedback(false, t("notGood"), `${t("correctLabel")}: "${correct}"`);
    roundLocked.value = true;
  }
}

function advanceVocabQuestion() {
  if (!currentSong.value?.vocabulary) return;
  // Use longer delay if there are feedback details (explanation), otherwise use default
  const delayMs = feedback.details ? GOOD_WITH_DETAILS_MS : GOOD_MS;
  setTimeout(() => {
    const n = currentSong.value!.vocabulary!.length;
    if (settings.order === "sequence") {
      vocabIndex.value = (vocabIndex.value + 1) % Math.max(1, n);
    } else {
      vocabIndex.value = randomInt(0, n - 1);
    }
    resetRoundUiState();
    buildVocabularyOptions();
  }, delayMs);
}

function buildVocabularyOptions() {
  if (!currentWord.value) return;

  // Build choices from all possible answers (translations + explanations) from vocabulary
  const correctAnswer = currentWord.value.translation || currentWord.value.explanation || "";

  if (!currentSong.value?.vocabulary) {
    vocabChoices.value = [];
    return;
  }

  // Get all possible answers from this song's vocabulary
  const allAnswers = currentSong.value.vocabulary
    .map((w) => w.translation || w.explanation || "")
    .filter((a) => a && a !== correctAnswer);

  // Sample unique wrong answers
  const wrongAnswers = sampleUnique(allAnswers, settings.optionCount - 1, (x) => x);

  // Mix in correct answer and shuffle
  const choices = [correctAnswer, ...wrongAnswers];
  vocabChoices.value = shuffle(choices).slice(0, settings.optionCount);
}

/**
 * -----------------------------
 * Choice styling helpers
 * -----------------------------
 */
function choiceClassText(choiceText: string) {
  if (!roundLocked.value) return "";
  const ok =
    normalizeForCompare(choiceText, settings.normalize) ===
    normalizeForCompare(answerLine.value, settings.normalize);
  return ok ? "correct" : "wrong";
}

function choiceClassWord(choiceWord: string) {
  // Only special-case cloze + choice input.
  if (settings.mode !== "cloze" || settings.clozeInput !== "choice") {
    // fallback to your old behavior (if you still need it anywhere)
    if (!roundLocked.value) return "";
    const blank = clozeBlanks.value[activeBlankIndex.value];
    if (!blank) return "";
    const ok =
      normalizeForCompare(choiceWord, settings.normalize) ===
      normalizeForCompare(blank.correct, settings.normalize);
    return ok ? "correct" : "wrong";
  }

  const blank = clozeBlanks.value[activeBlankIndex.value];
  if (!blank) return "";

  const choiceKey = normalizeForCompare(choiceWord, "punct");
  const correctKey = normalizeForCompare(blank.correct, "punct");

  // 1) If user clicked something, only style THAT option (correct or wrong).
  if (lastClozePick.value && lastClozePick.value.key === choiceKey) {
    return lastClozePick.value.ok ? "correct" : "wrong";
  }

  // 2) Optional: if you're revealing the answer, highlight the correct option too.
  if (revealAnswer.value && choiceKey === correctKey) return "correct";

  // 3) Otherwise: no styling for other options.
  return "";
}



function isBlankFilled(idx: number): boolean {
  const blank = clozeBlanks.value[idx];
  return !!blank?.filled;
}

function findNextUnfilledBlankIndex(): number {
  for (let i = 0; i < clozeBlanks.value.length; i++) {
    if (!clozeBlanks.value[i].filled) return i;
  }
  return -1;
}

function findBlankIndexByToken(token: ClozeToken): number {
  if (token.type !== "blank") return -1;
  return clozeBlanks.value.indexOf(token as Extract<ClozeToken, { type: "blank" }>);
}

function selectBlankByToken(token: ClozeToken): void {
  if (token.type !== "blank" || roundLocked.value) return;
  const idx = findBlankIndexByToken(token);
  if (idx !== -1 && !isBlankFilled(idx)) {
    activeBlankIndex.value = idx;
    // Regenerate choices for the selected blank
    const blank = clozeBlanks.value[idx];
    if (blank && settings.clozeInput === "choice") {
      clozeChoices.value = buildClozeChoices(blank.correct, settings.optionCount);
    }
  }
}

function setActiveBlankIndex(idx: number): void {
  if (idx >= 0 && idx < clozeBlanks.value.length) {
    activeBlankIndex.value = idx;
    const blank = clozeBlanks.value[idx];
    if (blank && settings.clozeInput === "choice") {
      clozeChoices.value = buildClozeChoices(blank.correct, settings.optionCount);
    }
  }
}

/**
 * -----------------------------
 * Build MCQ choices (duplicate-safe)
 * -----------------------------
 */
function buildNextLineChoices(index: number): Choice[] {
  const s = currentSong.value!;
  const correct = s.lines[index + 1];
  const correctKey = normalizeForCompare(correct, "punct");

  const optionCount = clamp(settings.optionCount, 3, 6);

  const pool = s.lines
    .map((line, idx) => ({
      line,
      idx,
      key: normalizeForCompare(line, "punct"),
    }))
    .filter((x) => x.idx !== index && x.idx !== index + 1)
    .filter((x) => x.key !== correctKey);

  const distractors = sampleUnique(pool, optionCount - 1, (x) => x.key);

  const all: Choice[] = [
    { key: "c", text: correct, isCorrect: true },
    ...distractors.map((d, i) => ({
      key: "d" + i,
      text: d.line,
      isCorrect: false,
    })),
  ];

  return shuffle(all);
}

/**
 * -----------------------------
 * Cloze words choices
 * -----------------------------
 */
function buildClozeChoices(correctWord: string, optionCount: number): string[] {
  const s = currentSong.value!;
  const corpus = buildWordCorpus(s.lines);

  const candidates = corpus
    .filter(
      (w) =>
        normalizeForCompare(w, "punct") !==
        normalizeForCompare(correctWord, "punct")
    )
    .map((w) => ({ w, score: similarityScore(correctWord, w) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 60)
    .map((x) => x.w);

  const distractors = sampleUnique(
    candidates.map((w) => ({ w, key: normalizeForCompare(w, "punct") })),
    clamp(optionCount, 3, 6) - 1,
    (x) => x.key
  ).map((x) => x.w);

  return shuffle([correctWord, ...distractors]);
}

function similarityScore(a: string, b: string): number {
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

function commonPrefixLen(a: string, b: string): number {
  const n = Math.min(a.length, b.length);
  let i = 0;
  while (i < n && a[i] === b[i]) i++;
  return i;
}
function commonSuffixLen(a: string, b: string): number {
  const n = Math.min(a.length, b.length);
  let i = 0;
  while (i < n && a[a.length - 1 - i] === b[b.length - 1 - i]) i++;
  return i;
}

/**
 * -----------------------------
 * Cloze tokenization
 * -----------------------------
 */
function buildClozeTokens(
  line: string,
  missingCount: number
): { tokens: ClozeToken[]; blanks: Extract<ClozeToken, { type: "blank" }>[] } {
  const parts = line.match(/[\p{L}\p{N}’'\-]+|[^\p{L}\p{N}’'\-]+/gu) ?? [line];

  const wordIndices: number[] = [];
  for (let i = 0; i < parts.length; i++)
    if (isWord(parts[i])) wordIndices.push(i);

  const nWords = wordIndices.length;
  const k = clamp(missingCount, 1, Math.max(1, nWords));
  const chosen = pickWeightedIndices(wordIndices, k);

  const tokens: ClozeToken[] = [];
  const blanks: Extract<ClozeToken, { type: "blank" }>[] = [];

  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    if (isWord(p) && chosen.has(i)) {
      const blank: Extract<ClozeToken, { type: "blank" }> = {
        type: "blank",
        correct: p,
        filled: null,
      };
      tokens.push(blank);
      blanks.push(blank);
    } else {
      tokens.push({ type: "text", value: p });
    }
  }

  return { tokens, blanks };
}

function isWord(s: string): boolean {
  return /^[\p{L}\p{N}’'\-]+$/u.test(s);
}

function pickWeightedIndices(wordIndices: number[], k: number): Set<number> {
  const picks = new Set<number>();
  const weights = wordIndices.map((idx, i) => ({
    idx,
    w: 1 + i / Math.max(1, wordIndices.length - 1),
  }));
  while (picks.size < k && picks.size < wordIndices.length) {
    const total = weights.reduce((acc, x) => acc + x.w, 0);
    let r = Math.random() * total;
    for (const x of weights) {
      r -= x.w;
      if (r <= 0) {
        picks.add(x.idx);
        break;
      }
    }
  }
  return picks;
}

/**
 * -----------------------------
 * Feedback
 * -----------------------------
 */
function setFeedback(ok: boolean, message: string, details?: string) {
  feedback.ok = ok;
  feedback.message = message;
  feedback.details = details;

  lastWasCorrect.value = ok;
  // show Continue only after a wrong answer
  showContinue.value = !ok;
}
function continueAfterWrong() {
  // user chooses to move on after seeing correct answer
  revealAnswer.value = false;
  showContinue.value = false;
  roundLocked.value = false;
  typedInput.value = "";
  newPrompt();
}
function tryAgainSamePrompt() {
  // keep same prompt/answer, just let them attempt again
  showContinue.value = false;
  roundLocked.value = false;
  typedInput.value = "";
  feedback.message = "";
  feedback.details = "";
}

/**
 * Keep cloze choices in sync when switching active blank
 */
watch(activeBlankIndex, () => {
  if (settings.mode !== "cloze") return;
  if (settings.clozeInput !== "choice") return;
  const b = clozeBlanks.value[activeBlankIndex.value];
  if (!b) return;

  lastClozePick.value = null; // ✅ clear highlight when switching blanks
  clozeChoices.value = buildClozeChoices(b.correct, settings.optionCount);
});

</script>

