<template>
  <div class="app">
    <div class="topbar">
      <div class="topbar-row">
        <div class="brand">
          <div class="brand-title">{{ t("appTitle") }}</div>
          <!-- <div class="brand-sub">{{ t("appSubtitle") }}</div> -->
        </div>
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
      <section v-if="appTab === 'songs'" class="card">
        <!-- <div class="card-head">
          <div class="card-title">{{ t("sourceAndSongs") }}</div>
        </div> -->

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
            <!-- todo: give tab with explanation of what export does etc. -->
            <button class="tab" @click="exportSongsJson()">{{ t("exportSongsJson") }}</button>
          </div>

          <div v-if="sourceTab === 'library'" class="panel">
            <div class="row">
              <label>{{ t("songSets") }}</label>
              <select v-model="currentSetId">
                <option v-for="set in songSets" :key="set.id" :value="set.id">
                  {{ set.name }} ({{ set.songs.length }})
                </option>
              </select>
              <button class="btn" @click="createNewSet()">{{ t("newSet") }}</button>
            </div>

            <div class="row">
              <label>{{ t("sortBy") }}</label>
              <select v-model="songSort.key">
                <option value="title">{{ t("sortTitle") }}</option>
                <option value="artist">{{ t("sortArtist") }}</option>
                <option value="createdAt">{{ t("sortCreatedAt") }}</option>
                <option value="lines">{{ t("sortLines") }}</option>
              </select>
              <select v-model="songSort.dir">
                <option value="asc">{{ t("sortAsc") }}</option>
                <option value="desc">{{ t("sortDesc") }}</option>
              </select>
            </div>

            <div class="row">
              <label>{{ t("search") }}</label>
              <input v-model="songSearch" :placeholder="t('searchPlaceholder')" />
            </div>

            <div class="song-list">
              <div v-for="s in sortedFilteredSongs" :key="s.id" class="song-row"
                :class="{ selected: currentSong?.id === s.id }">
                <button class="song-main" @click="selectSong(s.id)">
                  <div class="song-title">{{ s.title }}</div>
                  <div class="song-meta">
                    <span v-if="s.artist">{{ s.artist }}</span>
                    <span v-if="s.album">• {{ s.album }}</span>
                    <span>• {{ t("linesCount", { n: s.lines.length }) }}</span>
                  </div>
                </button>

                <button class="icon-btn primary" type="button" :aria-label="t('edit')" :title="t('edit')"
                  @click.stop="startEditSong(s.id)">
                  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                    <path
                      d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z"
                      fill="currentColor" />
                    <path d="M20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                      fill="currentColor" />
                  </svg>
                </button>

                <button class="icon-btn danger" type="button" :aria-label="t('delete')" :title="t('delete')"
                  @click.stop="deleteSongById(s.id)">
                  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                    <path
                      d="M9 3h6l1 2h4v2H4V5h4l1-2zm1 7h2v9h-2v-9zm4 0h2v9h-2v-9zM7 10h2v9H7v-9zm1-1h10l-1 12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 9h2z"
                      fill="currentColor" />
                  </svg>
                </button>
              </div>
            </div>

            <div class="small">{{ t("tipAddSongs") }}</div>
          </div>

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
              <button class="btn primary" @click="addSongFromPaste()">
                {{ t("addToLibrary") }}
              </button>
              <button class="btn" @click="clearPasteForm()">
                {{ t("clear") }}
              </button>
            </div>
            <div class="small">{{ t("pasteHint") }}</div>
          </div>

          <div v-else class="panel">
            <label>{{ t("pasteJson") }}</label>
            <textarea v-model="jsonImportText" rows="12" :placeholder="t('jsonPlaceholder')"></textarea>

            <div class="row">
              <button class="btn primary" @click="importSongsJson()">{{ t("import") }}</button>
              <button class="btn" @click="jsonImportText = ''">{{ t("clear") }}</button>
            </div>

            <details class="small">
              <summary>{{ t("jsonSchemaExampleTitle") }}</summary>
              <pre class="code">{{ jsonSchemaExample }}</pre>
            </details>
          </div>
        </div>
      </section>

      <!-- MODAL: Edit Song -->
      <div v-if="editingSongId" class="modal-overlay" @click.self="editingSongId = null">
        <div class="modal-card modal-card-large">
          <div class="modal-header">
            <div class="modal-header-content">
              <h2>{{ t("editSongJson") }}</h2>
              <a class="help-link" href="/json-format-help.html" target="_blank" rel="noopener noreferrer" :title="t('jsonFormatHelp')">
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2" />
                  <text x="12" y="16" text-anchor="middle" font-size="14" font-weight="bold" fill="currentColor">?</text>
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
              </div>

              <div v-if="selectedText" class="translation-panel">
                <div class="translation-header">
                  <strong>{{ t("addTranslation") }}</strong>
                </div>

                <div class="translation-section">
                  <label>{{ t("vocabularyWord") }}</label>
                  <input v-model="translationData.word" type="text" class="editor-input" :placeholder="selectedText" />
                </div>

                <div class="translation-section">
                  <label>{{ t("vocabularyTranslation") }}</label>
                  <input v-model="translationData.translation" type="text" class="editor-input" :placeholder="t('optional')" />
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
                <div v-for="(item, idx) in visualEditData.vocabulary" :key="idx" class="vocab-item">
                  <div class="vocab-word">{{ item.word }}</div>
                  <div class="vocab-meaning">
                    <span v-if="item.translation">{{ item.translation }}</span>
                    <span v-else-if="item.explanation">{{ item.explanation }}</span>
                  </div>
                  <button class="vocab-remove" @click="removeVocabularyItem(idx)">✕</button>
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
            <div class="song-header">
              <div>
                <div class="now-playing">{{ currentSong.title }}</div>
                <div class="small">
                  <span v-if="currentSong.artist">{{ currentSong.artist }}</span>
                  <span v-if="currentSong.album"> • {{ currentSong.album }}</span>
                  <span> • {{ t("linesCount", { n: currentSong.lines.length }) }}</span>
                </div>
              </div>
            </div>

            <div class="prompt">
              <div class="label">{{ t("prompt") }}</div>
              <div class="line">{{ promptLine }}</div>
            </div>

            <div v-if="revealAnswer" class="answer">
              <div class="label">{{ t("answer") }}</div>
              <div class="line">{{ answerLine }}</div>
            </div>

            <!-- MODE: nextLine -->
            <div v-if="settings.mode === 'nextLine'">
              <h3>{{ t("chooseNextLine") }}</h3>

              <div v-if="settings.nextLineInput === 'choice'" class="choices">
                <button v-for="c in mcqChoices" :key="c.key" class="choice" :class="choiceClassText(c.text)"
                  :disabled="roundLocked" @click="submitChoice(c.text)">
                  {{ c.text }}
                </button>
              </div>

              <div v-else>
                <div class="row">
                  <input v-model="typedInput" :disabled="roundLocked" :placeholder="t('typeHere')"
                    @keydown.enter.prevent="submitTypedNextLine()" />
                  <button class="btn primary" :disabled="roundLocked" @click="submitTypedNextLine()">
                    {{ t("check") }}
                  </button>
                </div>
              </div>
            </div>

            <!-- MODE: cloze -->
            <div v-else-if="settings.mode === 'cloze'">
              <h3>{{ t("fillMissingWords") }}</h3>

              <div class="cloze-line">
                <span v-for="(tkn, i) in clozeTokens" :key="i">
                  <template v-if="tkn.type === 'text'">{{ tkn.value }}</template>
                  <template v-else>
                    <span class="blank">{{ tkn.filled ?? "____" }}</span>
                  </template>
                </span>
              </div>

              <div v-if="settings.clozeInput === 'choice'">
                <div class="small">{{ t("clozeChoiceHint") }}</div>

                <div class="row">
                  <div class="field" style="flex: 1">
                    <label>{{ t("blank") }}</label>
                    <select v-model.number="activeBlankIndex" :disabled="roundLocked">
                      <option v-for="(_b, idx) in clozeBlanks" :key="idx" :value="idx">
                        {{ t("blankOf", { i: idx + 1, n: clozeBlanks.length }) }}
                      </option>
                    </select>
                  </div>

                  <div class="field" style="flex: 1" v-if="settings.showClozeTarget === 'on'">
                    <label>{{ t("targetWordHelper") }}</label>
                    <input :value="clozeBlanks[activeBlankIndex]?.correct ?? ''" disabled />
                  </div>
                </div>

                <div class="choices">
                  <button v-for="w in clozeChoices" :key="w" class="choice" :class="choiceClassWord(w)"
                    :disabled="roundLocked || isBlankFilled(activeBlankIndex)" @click="submitClozeChoice(w)">
                    {{ w }}
                  </button>
                </div>
              </div>

              <div v-else>
                <div class="small">{{ t("clozeTypeHint") }}</div>
                <div class="row">
                  <input v-model="typedInput" :disabled="roundLocked" :placeholder="t('typeHere')"
                    @keydown.enter.prevent="submitTypedCloze()" />
                  <button class="btn primary" :disabled="roundLocked" @click="submitTypedCloze()">
                    {{ t("check") }}
                  </button>
                </div>
              </div>
            </div>

            <!-- MODE: type -->
            <div v-else-if="settings.mode === 'type'">
              <h3>{{ t("modeType") }}</h3>

              <div v-if="settings.typeTarget === 'currentLine' && settings.showHintLine === 'on'" class="small">
                {{ t("typeHintLine") }}
              </div>

              <div class="row">
                <input v-model="typedInput" :disabled="roundLocked" :placeholder="t('typeHere')"
                  @keydown.enter.prevent="submitTypedLine()" />
                <button class="btn primary" :disabled="roundLocked" @click="submitTypedLine()">
                  {{ t("check") }}
                </button>
              </div>
            </div>

            <!-- MODE: vocabulary -->
            <div v-else-if="settings.mode === 'vocabulary'">
              <h3>{{ t("modeVocabulary") }}</h3>
              
              <div v-if="!currentWord" class="empty">
                {{ t("noVocabulary") }}
              </div>
              
              <div v-else>
                <div class="vocabulary-word">
                  <div class="label">{{ t("vocabularyWord") }}</div>
                  <div class="word-display">{{ currentWord.word }}</div>
                </div>

                <div class="vocabulary-choices">
                  <div class="small">{{ t("vocabularyHint") }}</div>
                  <button v-for="(option, idx) in vocabChoices" :key="idx" class="choice"
                    :disabled="roundLocked" @click="submitVocabularyChoice(option)">
                    <div class="vocab-option-text">{{ option }}</div>
                  </button>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="row">
                <button class="btn" @click="revealAnswer = !revealAnswer">
                  {{ revealAnswer ? t("hideAnswer") : t("showAnswer") }}
                </button>

                <!-- ✅ only after wrong answer -->
                <button v-if="showContinue" class="btn" @click="continueAfterWrong()">
                  {{ t("continue") }}
                </button>

                <!-- optional -->
                <button v-if="showContinue" class="btn primary" @click="tryAgainSamePrompt()">
                  {{ t("tryAgain") }}
                </button>
              </div>

            </div>

            <div class="feedback" v-if="feedback.message">
              <div :class="['pill', feedback.ok ? 'ok' : 'bad']">{{ feedback.message }}</div>
              <div class="small" v-if="feedback.details">{{ feedback.details }}</div>
            </div>

            <div class="stats">
              <div class="stat">
                <div class="label">{{ t("statsScore") }}</div>
                <div class="value">{{ t("scoreLineShort", { ok: stats.correct, total: stats.total }) }}</div>
              </div>

              <div class="stat" v-if="settings.mode === 'cloze'">
                <div class="label">{{ t("statsClozeDifficulty") }}</div>
                <div class="value">{{ t("missingWords", { n: clozeMissingCount }) }}</div>
              </div>

              <div class="stat">
                <div class="label">{{ t("statsLineIndex") }}</div>
                <div class="value">
                  {{ t("indexOf", { i: currentIndex + 1, n: currentSong.lines.length }) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- TAB: Settings -->
      <section v-else-if="appTab === 'settings'" class="card">
        <!-- <div class="card-head">
          <div class="card-title">{{ t("exerciseAndOptions") }}</div>
        </div> -->

        <div class="card-body">
          <div v-if="!currentSong" class="empty">{{ t("chooseSongFirst") }}</div>

          <div v-else>
            <div class="settings-grid">
              <div class="field">
                <label>{{ t("uiLanguage") }}</label>
                <select v-model="settings.uiLang" @change="resetRound(false)">
                  <option value="en">English</option>
                  <option value="es">Español</option>
                </select>
              </div>

              <div class="field">
                <label>{{ t("exercise") }}</label>
                <select v-model="settings.mode" @change="resetRound(true)">
                  <option value="nextLine">{{ t("modeNextLine") }}</option>
                  <option value="cloze">{{ t("modeCloze") }}</option>
                  <option value="type">{{ t("modeType") }}</option>
                  <option value="vocabulary">{{ t("modeVocabulary") }}</option>
                </select>
              </div>

              <div class="field">
                <label>{{ t("order") }}</label>
                <select v-model="settings.order" @change="resetRound(true)">
                  <option value="sequence">{{ t("orderSequence") }}</option>
                  <option value="random">{{ t("orderRandom") }}</option>
                </select>
              </div>

              <div class="field">
                <label>{{ t("optionCount") }}</label>
                <select v-model.number="settings.optionCount" @change="resetRound(true)">
                  <option :value="3">3</option>
                  <option :value="4">4</option>
                  <option :value="5">5</option>
                  <option :value="6">6</option>
                </select>
              </div>

              <div class="field" v-if="settings.mode === 'nextLine'">
                <label>{{ t("nextLineInput") }}</label>
                <select v-model="settings.nextLineInput" @change="resetRound(false)">
                  <option value="choice">{{ t("inputChoice") }}</option>
                  <option value="type">{{ t("inputType") }}</option>
                </select>
              </div>

              <div class="field" v-if="settings.mode === 'cloze'">
                <label>{{ t("clozeStartMissing") }}</label>
                <input type="number" min="1" :max="12" v-model.number="settings.clozeStartMissing"
                  @change="resetRound(true)" />
              </div>

              <div class="field" v-if="settings.mode === 'cloze'">
                <label>{{ t("clozeMaxMissing") }}</label>
                <input type="number" min="1" :max="16" v-model.number="settings.clozeMaxMissing"
                  @change="resetRound(true)" />
              </div>

              <div class="field" v-if="settings.mode === 'cloze'">
                <label>{{ t("clozeProgression") }}</label>
                <select v-model="settings.clozeProgression" @change="resetRound(true)">
                  <option value="on">{{ t("on") }}</option>
                  <option value="off">{{ t("off") }}</option>
                </select>
              </div>

              <div class="field" v-if="settings.mode === 'cloze'">
                <label>{{ t("clozeInput") }}</label>
                <select v-model="settings.clozeInput" @change="resetRound(true)">
                  <option value="choice">{{ t("inputChoice") }}</option>
                  <option value="type">{{ t("inputType") }}</option>
                </select>
              </div>

              <div class="field" v-if="settings.mode === 'cloze' && settings.clozeInput === 'choice'">
                <label>{{ t("showClozeTarget") }}</label>
                <select v-model="settings.showClozeTarget" @change="resetRound(false)">
                  <option value="off">{{ t("off") }}</option>
                  <option value="on">{{ t("on") }}</option>
                </select>
              </div>

              <div class="field" v-if="settings.mode === 'type'">
                <label>{{ t("typeMode") }}</label>
                <select v-model="settings.typeTarget" @change="resetRound(true)">
                  <option value="nextLine">{{ t("typeNextLine") }}</option>
                  <option value="currentLine">{{ t("typeCurrentLine") }}</option>
                </select>
              </div>

              <div class="field">
                <label>{{ t("normalization") }}</label>
                <select v-model="settings.normalize" @change="resetRound(false)">
                  <option value="strict">{{ t("normStrict") }}</option>
                  <option value="basic">{{ t("normBasic") }}</option>
                  <option value="punct">{{ t("normPunct") }}</option>
                </select>
              </div>

              <div class="field" v-if="settings.mode === 'type' && settings.typeTarget === 'currentLine'">
                <label>{{ t("showHintLine") }}</label>
                <select v-model="settings.showHintLine" @change="resetRound(true)">
                  <option value="on">{{ t("on") }}</option>
                  <option value="off">{{ t("off") }}</option>
                </select>
              </div>
            </div>

            <div class="small" style="margin-top: 10px;">
              {{ t("footer") }}
            </div>
          </div>
        </div>
      </section>

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

    <footer class="footer small">{{ t("footer") }}</footer>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch, Ref } from "vue";

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

type Lang = "en" | "es";
type Messages = Record<string, string>;

const LS_SONGS = "lyricsTrainer.songs.v1";
const LS_SETTINGS = "lyricsTrainer.settings.v1";
const showContinue = ref(false);
const lastWasCorrect = ref(false);
const lastClozePick = ref<{ key: string; ok: boolean } | null>(null);

// Tweak these to taste
const GOOD_MS = 1200; // show success feedback longer


/**
 * -----------------------------
 * ✅ NEW: top-level app tab state
 * -----------------------------
 */
type AppTab = "songs" | "train" | "settings" | "about";
const appTab: Ref<AppTab> = ref("songs");

/**
 * -----------------------------
 * Reactive settings (includes i18n + all prior options)
 * -----------------------------
 */
const settings = reactive<{
  uiLang: Lang;
  mode: Mode;
  order: Order;
  optionCount: number;

  nextLineInput: NextLineInput;

  clozeStartMissing: number;
  clozeMaxMissing: number;
  clozeProgression: ClozeProgression;
  clozeInput: ClozeInput;
  showClozeTarget: "on" | "off";

  typeTarget: TypeTarget;
  normalize: Normalize;
  showHintLine: HintLine;
}>({
  uiLang: "en",
  mode: "nextLine",
  order: "sequence",
  optionCount: 4,

  nextLineInput: "choice",

  clozeStartMissing: 1,
  clozeMaxMissing: 6,
  clozeProgression: "on",
  clozeInput: "choice",
  showClozeTarget: "off",

  typeTarget: "nextLine",
  normalize: "basic",
  showHintLine: "on",
});

/**
 * -----------------------------
 * i18n
 * -----------------------------
 */
const messages: Record<Lang, Messages> = {
  en: {
    appTitle: "Lyrics Trainer",
    appSubtitle:
      "Practice lyrics: next-line (MCQ), cloze, or typing. Source: paste or JSON.",
    resetSession: "Reset session",
    exportSongsJson: "Export songs JSON",

    sourceAndSongs: "Songs",
    tabLibrary: "JSON library",
    tabPaste: "Paste lyrics",
    tabJsonImport: "JSON import",

    sortBy: "Sort by",
    sortTitle: "Title",
    sortArtist: "Artist",
    sortCreatedAt: "Date added",
    sortLines: "# lines",
    sortAsc: "↑",
    sortDesc: "↓",

    search: "Search",
    searchPlaceholder: "search title/artist/album...",
    linesCount: "{n} lines",
    tipAddSongs: "Tip: add songs via “Paste lyrics” or “JSON import”.",

    title: "Title",
    titlePlaceholder: "e.g. Yo soy la milonga criolla",
    artist: "Artist",
    album: "Album",
    optional: "optional",

    edit: "Edit",
    editSong: "Edit song",
    editSongJson: "Edit song data (JSON)",
    saveChanges: "Save changes",
    cancel: "Cancel",
    jsonFormatHelp: "JSON format help (opens in new tab)",
    editModeRaw: "Raw JSON",
    editModeVisual: "Visual Editor",
    selectWordsForTranslation: "Select words in the lyrics to add translations",
    addTranslation: "Add Translation",
    addVocab: "Add to vocabulary",
    vocabularyItems: "Vocabulary items",

    pasteFullLyrics: "Paste the full lyrics",
    pastePlaceholder: "Paste the lyrics here...",
    addToLibrary: "Add to library",
    clear: "Clear",
    pasteHint: "Lines are split by newline; empty lines are ignored.",

    pasteJson: "Paste JSON (songs[])",
    jsonPlaceholder: '[{"id":"...","title":"...","lines":["..."]}]',
    import: "Import",
    jsonSchemaExampleTitle: "JSON schema example",

    training: "Training",
    chooseSongFirst: "First choose a song from the library, or add one.",
    delete: "Delete",

    exerciseAndOptions: "Settings",
    uiLanguage: "UI language",
    exercise: "Exercise",
    modeNextLine: "Next line",
    modeCloze: "Fill blanks (cloze)",
    modeType: "Type (whole line)",
    modeVocabulary: "Word meanings",

    tabAbout: "About",
    aboutTitle: "About Lyrics Trainer",
    aboutP1:
      "Lyrics Trainer is a free, browser-based tool for practicing song lyrics. You can train with next-line questions, fill-in-the-blanks (cloze), and typing exercises.",
    aboutP2:
      "All lyrics are provided by you and stored locally in your browser. No accounts are required, nothing is uploaded, and no tracking or analytics are used.",
    aboutP3:
      "It is designed for language learners, singers, performers, and anyone who wants to memorize lyrics more effectively.",

    order: "Order",
    orderSequence: "In order",
    orderRandom: "Random",

    optionCount: "# options",

    nextLineInput: "Next-line input",
    inputChoice: "Choose (MCQ)",
    inputType: "Type",

    clozeStartMissing: "Start missing (# words)",
    clozeMaxMissing: "Max missing (# words)",
    clozeProgression: "Increase difficulty after correct",
    clozeInput: "Cloze input",
    on: "On",
    off: "Off",

    showClozeTarget: "Show target word (helper)",
    targetWordHelper: "Target word (helper)",

    typeMode: "Typing mode",
    typeNextLine: "Type next line",
    typeCurrentLine: "Type current line",
    showHintLine: "Show hint line",

    normalization: "Comparison",
    normStrict: "Strict",
    normBasic: "Ignore case/spaces",
    normPunct: "Ignore case/spaces/punctuation",

    newQuestion: "New question",
    showAnswer: "Show answer",
    hideAnswer: "Hide answer",

    prompt: "Prompt",
    answer: "Answer",

    chooseNextLine: "Next line",
    fillMissingWords: "Fill the missing words",

    clozeChoiceHint: "Click the correct word per blank. (One blank at a time)",
    clozeTypeHint:
      "Type all missing words (separated by spaces). Order matters.",

    blank: "Blank",
    blankOf: "{i} / {n}",

    typeHere: "type here...",
    check: "Check",

    typeHintLine: "Hint: the prompt above is the line you need to type.",

    good: "Correct!",
    notGood: "Incorrect.",
    correctLabel: "Correct",
    expectedLabel: "Expected",

    wordCorrect: "Correct word!",
    wordIncorrect: "Incorrect word.",
    clozeCorrect: "Cloze: correct!",
    clozeIncorrect: "Cloze: incorrect.",

    statsScore: "Score",
    statsClozeDifficulty: "Cloze difficulty",
    statsLineIndex: "Line index",

    scoreLine: "{ok}/{total} (correct / total)",
    scoreLineShort: "{ok} / {total}",
    missingWords: "{n} words missing",
    indexOf: "{i} / {n}",

    sessionReset: "Session reset.",
    songAdded: "Song added.",
    songUpdated: "Song updated.",
    jsonExportStarted: "JSON export started (download).",
    jsonPasteFirst: "Paste JSON first.",
    jsonParseError: "JSON parse error.",
    noValidSongs: "No valid songs found in JSON.",
    importedSongs: "Imported: {n} songs.",
    importedSongSets: "Imported: {n} song sets.",
    noSetSelected: "No song set selected.",
    provideTitle: "Please provide a title.",
    pasteLyricsFirst: "Paste lyrics first.",
    tooFewLines: "Too few lines. Make sure the text has multiple lines.",
    continue: "Continue",
    tryAgain: "Try again",
    
    vocabularyHint: "Choose the correct meaning.",
    vocabularyWord: "Word",
    vocabularyTranslation: "Translation",
    vocabularyExplanation: "Explanation",
    noVocabulary: "No vocabulary data for this song. Add words and translations/explanations via JSON.",
    manageVocabulary: "Manage vocabulary",
    
    songSets: "Song Sets",
    newSet: "New Set",
    setName: "Set name",
    setNamePlaceholder: "e.g. Spanish Classics",
    deleteSet: "Delete set",
    selectSet: "Select a song set",
    
    footer:
      "Local in your browser (localStorage). No network. JSON import/export available.",
  },
  es: {
    appTitle: "Entrenador de Letras (Vue)",
    appSubtitle:
      "Practica letras: siguiente línea (MCQ), cloze o escribir. Fuente: pegar o JSON.",
    resetSession: "Reiniciar sesión",
    exportSongsJson: "Exportar songs JSON",

    sourceAndSongs: "Canciones",
    tabLibrary: "Biblioteca JSON",
    tabPaste: "Pegar letra",
    tabJsonImport: "Importar JSON",

    sortBy: "Ordenar por",
    sortTitle: "Título",
    sortArtist: "Artista",
    sortCreatedAt: "Fecha",
    sortLines: "# líneas",
    sortAsc: "↑",
    sortDesc: "↓",

    search: "Buscar",
    searchPlaceholder: "buscar título/artista/álbum...",
    linesCount: "{n} líneas",
    tipAddSongs:
      "Consejo: añade canciones con “Pegar letra” o “Importar JSON”.",

    title: "Título",
    titlePlaceholder: "p.ej. Yo soy la milonga criolla",
    artist: "Artista",
    album: "Álbum",
    optional: "opcional",

    edit: "Editar",
    editSong: "Editar canción",
    editSongJson: "Editar datos de canción (JSON)",
    saveChanges: "Guardar cambios",
    cancel: "Cancelar",
    jsonFormatHelp: "Ayuda de formato JSON (abre en una pestaña nueva)",
    editModeRaw: "JSON sin procesar",
    editModeVisual: "Editor visual",
    selectWordsForTranslation: "Selecciona palabras en la letra para agregar traducciones",
    addTranslation: "Agregar traducción",
    addVocab: "Agregar al vocabulario",
    vocabularyItems: "Elementos de vocabulario",

    pasteFullLyrics: "Pega la letra completa",
    pastePlaceholder: "Pega la letra aquí...",
    addToLibrary: "Añadir a la biblioteca",
    clear: "Vaciar",
    pasteHint:
      "Las líneas se separan por salto de línea; se ignoran las vacías.",

    pasteJson: "Pega JSON (songs[])",
    jsonPlaceholder: '[{"id":"...","title":"...","lines":["..."]}]',
    import: "Importar",
    jsonSchemaExampleTitle: "Ejemplo de esquema JSON",

    training: "Práctica",
    chooseSongFirst: "Primero elige una canción de la biblioteca o añade una.",
    delete: "Eliminar",

    exerciseAndOptions: "Opciones",
    uiLanguage: "Idioma de la UI",
    exercise: "Ejercicio",
    modeNextLine: "Siguiente línea",
    modeCloze: "Completar huecos (cloze)",
    modeType: "Escribir (línea completa)",
    modeVocabulary: "Significados de palabras",

    tabAbout: "Acerca de",
    aboutTitle: "Acerca de Lyrics Trainer",
    aboutP1:
      "Lyrics Trainer es una herramienta gratuita en el navegador para practicar letras. Puedes entrenar con preguntas de la siguiente línea, completar huecos (cloze) y ejercicios de escritura.",
    aboutP2:
      "Todas las letras las proporcionas tú y se guardan localmente en tu navegador. No se necesitan cuentas, no se sube nada y no se usa seguimiento ni analítica.",
    aboutP3:
      "Está pensado para estudiantes de idiomas, cantantes, intérpretes y cualquiera que quiera memorizar letras de forma más eficaz.",

    order: "Orden",
    orderSequence: "En orden",
    orderRandom: "Aleatorio",

    optionCount: "# opciones",

    nextLineInput: "Entrada (siguiente línea)",
    inputChoice: "Elegir (MCQ)",
    inputType: "Escribir",

    clozeStartMissing: "Inicio (# palabras omitidas)",
    clozeMaxMissing: "Máximo (# palabras omitidas)",
    clozeProgression: "Aumentar dificultad al acertar",
    clozeInput: "Entrada cloze",
    on: "Activado",
    off: "Desactivado",

    showClozeTarget: "Mostrar palabra objetivo (ayuda)",
    targetWordHelper: "Palabra objetivo (ayuda)",

    typeMode: "Modo de escritura",
    typeNextLine: "Escribir la siguiente línea",
    typeCurrentLine: "Escribir la línea actual",
    showHintLine: "Mostrar pista",

    normalization: "Comparación",
    normStrict: "Estricto",
    normBasic: "Ignorar mayúsculas/espacios",
    normPunct: "Ignorar mayúsculas/espacios/puntuación",

    newQuestion: "Nueva pregunta",
    showAnswer: "Mostrar respuesta",
    hideAnswer: "Ocultar respuesta",

    prompt: "Contexto",
    answer: "Respuesta",

    chooseNextLine: "Siguiente línea",
    fillMissingWords: "Completa las palabras que faltan",

    clozeChoiceHint:
      "Haz clic en la palabra correcta por hueco. (Un hueco a la vez)",
    clozeTypeHint:
      "Escribe todas las palabras faltantes (separadas por espacios). El orden importa.",

    blank: "Hueco",
    blankOf: "{i} / {n}",

    typeHere: "escribe aquí...",
    check: "Comprobar",

    typeHintLine: "Pista: el texto de arriba es la línea que debes escribir.",

    good: "¡Correcto!",
    notGood: "Incorrecto.",
    correctLabel: "Correcto",
    expectedLabel: "Esperado",

    wordCorrect: "¡Palabra correcta!",
    wordIncorrect: "Palabra incorrecta.",
    clozeCorrect: "Cloze: ¡correcto!",
    clozeIncorrect: "Cloze: incorrecto.",

    statsScore: "Puntuación",
    statsClozeDifficulty: "Dificultad cloze",
    statsLineIndex: "Índice",

    scoreLine: "{ok}/{total} (correctas/total)",
    scoreLineShort: "{ok} / {total}",
    missingWords: "{n} palabras omitidas",
    indexOf: "{i} / {n}",

    sessionReset: "Sesión reiniciada.",
    songAdded: "Canción añadida.",
    songUpdated: "Canción actualizada.",
    jsonExportStarted: "Exportación JSON iniciada (descarga).",
    jsonPasteFirst: "Primero pega el JSON.",
    jsonParseError: "Error al parsear JSON.",
    noValidSongs: "No se encontraron canciones válidas en el JSON.",
    importedSongs: "Importadas: {n} canciones.",
    importedSongSets: "Importados: {n} conjuntos de canciones.",
    noSetSelected: "No hay conjunto de canciones seleccionado.",
    provideTitle: "Indica un título.",
    pasteLyricsFirst: "Primero pega la letra.",
    tooFewLines: "Muy pocas líneas. Asegúrate de tener varias líneas.",
    continue: "Continuar",
    tryAgain: "Intentar de nuevo",
    
    vocabularyHint: "Elige el significado correcto.",
    vocabularyWord: "Palabra",
    vocabularyTranslation: "Traducción",
    vocabularyExplanation: "Explicación",
    noVocabulary: "Sin datos de vocabulario para esta canción. Añade palabras y traducciones/explicaciones mediante JSON.",
    manageVocabulary: "Gestionar vocabulario",
    
    songSets: "Conjuntos de canciones",
    newSet: "Nuevo conjunto",
    setName: "Nombre del conjunto",
    setNamePlaceholder: "p.ej. Clásicos españoles",
    deleteSet: "Eliminar conjunto",
    selectSet: "Selecciona un conjunto de canciones",
    
    footer:
      "Local en tu navegador (localStorage). Sin red. Importación/exportación JSON disponible.",
  },
};

function formatParams(
  s: string,
  params?: Record<string, string | number>
): string {
  if (!params) return s;
  let out = s;
  for (const [k, v] of Object.entries(params))
    out = out.replaceAll(`{${k}}`, String(v));
  return out;
}

function t(key: string, params?: Record<string, string | number>): string {
  const lang = settings.uiLang as Lang;
  return formatParams(messages[lang]?.[key] ?? messages.en[key] ?? key, params);
}

/**
 * -----------------------------
 * Minimal seed library
 * -----------------------------
 */
function seedSongs(): Song[] {
  return [
    {
      id: cryptoRandomId(),
      title: "Demo song",
      artist: "Demo",
      album: "Demo",
      createdAt: new Date().toISOString(),
      lines: [
        "This is a demo line",
        "And this is the next line",
        "Another line to practice with",
        "And so the song continues",
      ],
    },
  ];
}

/**
 * -----------------------------
 * State
 * -----------------------------
 */
const sourceTab = ref<"library" | "paste" | "json">("library");

const songSets = ref<SongSet[]>([]);
const currentSetId = ref<string | null>(null);
const songs = computed(() => {
  const set = songSets.value.find((s) => s.id === currentSetId.value);
  return set?.songs ?? [];
});
const currentSongId = ref<string | null>(null);

// Helper to get the current set for mutations
function getCurrentSet(): SongSet | null {
  return songSets.value.find((s) => s.id === currentSetId.value) ?? null;
}

// Song Set management
function createNewSet() {
  const name = prompt(t("setName"));
  if (!name || !name.trim()) return;
  
  const newSet: SongSet = {
    id: cryptoRandomId(),
    name: name.trim(),
    createdAt: new Date().toISOString(),
    songs: [],
  };
  
  songSets.value.push(newSet);
  currentSetId.value = newSet.id;
  currentSongId.value = null;
  
  setFeedback(true, `Set "${newSet.name}" created.`);
}

function deleteCurrentSet() {
  const set = getCurrentSet();
  if (!set) return;
  
  if (!confirm(`Delete set "${set.name}"? This cannot be undone.`)) return;
  
  songSets.value = songSets.value.filter((s) => s.id !== set.id);
  currentSetId.value = songSets.value.length ? songSets.value[0].id : null;
  currentSongId.value = null;
  
  setFeedback(true, `Set deleted.`);
  resetRound(true);
}

const songSearch = ref("");
const songSort = reactive<{
  key: "title" | "artist" | "createdAt" | "lines";
  dir: "asc" | "desc";
}>({
  key: "title",
  dir: "asc",
});

const pasteForm = reactive({ title: "", artist: "", album: "", text: "" });
const jsonImportText = ref("");

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

/**
 * ✅ Optional UX: when user selects a song, jump to Train tab.
 * Comment out if you don't want it.
 */
function selectSong(id: string) {
  currentSongId.value = id;
  revealAnswer.value = false;
  feedback.message = "";
  feedback.details = "";
  appTab.value = "train";
}

const sortedFilteredSongs = computed(() => {
  const q = songSearch.value.trim().toLowerCase();
  const filtered = songs.value.filter((s) => {
    if (!q) return true;
    return (
      s.title.toLowerCase().includes(q) ||
      (s.artist?.toLowerCase().includes(q) ?? false) ||
      (s.album?.toLowerCase().includes(q) ?? false)
    );
  });

  const dirMul = songSort.dir === "asc" ? 1 : -1;

  return filtered.slice().sort((a, b) => {
    let av: any;
    let bv: any;
    switch (songSort.key) {
      case "title":
        av = a.title ?? "";
        bv = b.title ?? "";
        break;
      case "artist":
        av = a.artist ?? "";
        bv = b.artist ?? "";
        break;
      case "createdAt":
        av = a.createdAt;
        bv = b.createdAt;
        break;
      case "lines":
        av = a.lines.length;
        bv = b.lines.length;
        break;
    }
    if (typeof av === "number" && typeof bv === "number")
      return (av - bv) * dirMul;
    return String(av).localeCompare(String(bv)) * dirMul;
  });
});

/**
 * -----------------------------
 * Lifecycle / persistence
 * -----------------------------
 */
onMounted(() => {
  loadSongs();
  loadSettings();
  
  // Initialize default set if none exist
  if (!songSets.value.length) {
    const defaultSet: SongSet = {
      id: cryptoRandomId(),
      name: "Default",
      createdAt: new Date().toISOString(),
      songs: seedSongs(),
    };
    songSets.value = [defaultSet];
    currentSetId.value = defaultSet.id;
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
  () => ({ ...settings }),
  () => persistSettings(),
  { deep: true }
);

watch(
  () => songs.value,
  () => persistSongs(),
  { deep: true }
);

function loadSongs() {
  const raw = localStorage.getItem(LS_SONGS);
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw) as any;
    
    // New format: with sets
    if (Array.isArray(parsed.songSets) && parsed.currentSetId) {
      songSets.value = parsed.songSets;
      currentSetId.value = parsed.currentSetId;
      currentSongId.value = parsed.currentSongId || null;
      return;
    }
    
    // Legacy format: flat songs array. Convert to a default set for backward compatibility
    if (Array.isArray(parsed.songs)) {
      const defaultSet: SongSet = {
        id: cryptoRandomId(),
        name: "Default",
        createdAt: new Date().toISOString(),
        songs: parsed.songs,
      };
      songSets.value = [defaultSet];
      currentSetId.value = defaultSet.id;
      currentSongId.value = parsed.currentSongId || null;
    }
  } catch {
    // ignore
  }
}
function persistSongs() {
  localStorage.setItem(
    LS_SONGS,
    JSON.stringify({
      songSets: songSets.value,
      currentSetId: currentSetId.value,
      currentSongId: currentSongId.value,
    })
  );
}
function loadSettings() {
  const raw = localStorage.getItem(LS_SETTINGS);
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw);
    Object.assign(settings, parsed);
  } catch {
    // ignore
  }
}
function persistSettings() {
  localStorage.setItem(LS_SETTINGS, JSON.stringify(settings));
}

/**
 * -----------------------------
 * Songs actions
 * -----------------------------
 */
function deleteSongById(id: string) {
  const set = getCurrentSet();
  if (!set) return;
  
  set.songs = set.songs.filter((x) => x.id !== id);
  
  if (currentSongId.value === id) {
    currentSongId.value = set.songs.length ? set.songs[0].id : null;
  }
  resetRound(true);
}

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

function clearPasteForm() {
  pasteForm.title = "";
  pasteForm.artist = "";
  pasteForm.album = "";
  pasteForm.text = "";
}

function addSongFromPaste() {
  const title = pasteForm.title.trim();
  const text = pasteForm.text.trim();

  if (!title) return setFeedback(false, t("provideTitle"));
  if (!text) return setFeedback(false, t("pasteLyricsFirst"));

  const lines = normalizeLines(splitIntoLines(text));
  if (lines.length < 2) return setFeedback(false, t("tooFewLines"));

  const set = getCurrentSet();
  if (!set) return setFeedback(false, t("noSetSelected"));

  const s: Song = {
    id: cryptoRandomId(),
    title,
    artist: pasteForm.artist.trim() || undefined,
    album: pasteForm.album.trim() || undefined,
    createdAt: new Date().toISOString(),
    lines,
  };

  set.songs.unshift(s);
  currentSongId.value = s.id;
  sourceTab.value = "library";

  pasteForm.title = "";
  pasteForm.artist = "";
  pasteForm.album = "";
  pasteForm.text = "";

  setFeedback(true, t("songAdded"));
  resetRound(true);
  appTab.value = "train";
}

function importSongsJson() {
  const raw = jsonImportText.value.trim();
  if (!raw) return setFeedback(false, t("jsonPasteFirst"));
  try {
    const parsed = JSON.parse(raw);
    
    // Check if it's a complete sets export (new format)
    if (Array.isArray(parsed.songSets)) {
      // Import complete sets collection
      const incomingSets = parsed.songSets as any[];
      
      // Merge with existing sets (by ID to avoid duplicates)
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
      
      setFeedback(true, t("importedSongSets", { n: importedCount }));
      jsonImportText.value = "";
      sourceTab.value = "library";
      resetRound(true);
      return;
    }
    
    // Legacy/single format: array of songs or { songs: [] }
    const incomingSongs: Song[] = Array.isArray(parsed)
      ? parsed
      : Array.isArray(parsed?.songs)
        ? parsed.songs
        : [];

    const cleaned = incomingSongs
      .map((x) => sanitizeSong(x))
      .filter((x): x is Song => !!x && x.lines.length >= 2 && !!x.title);

    if (!cleaned.length) return setFeedback(false, t("noValidSongs"));

    // If no set data, import into a new set (backward compatibility)
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
      // Merge into current set
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

    setFeedback(true, t("importedSongs", { n: cleaned.length }));
    jsonImportText.value = "";
    sourceTab.value = "library";
    resetRound(true);
  } catch (e: any) {
    setFeedback(false, t("jsonParseError"), String(e?.message ?? e));
  }
}

function exportSongsJson() {
  // Export all sets
  const payload = JSON.stringify({
    songSets: songSets.value,
  }, null, 2);
  // BOM helps some programs detect UTF-8 correctly
  const withBom = "\uFEFF" + payload;
  downloadText(withBom, "song-sets.json", "application/json;charset=utf-8");
  // todo: this feedback is on another component, so do something once we make an export tab
  // setFeedback(true, t("jsonExportStarted"));
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

function advanceAfterCorrect(delayMs = GOOD_MS) {
  setTimeout(() => newPrompt(), delayMs);
}

/**
 * -----------------------------
 * Rounds
 * -----------------------------
 */
function resetRoundUiState() {
  roundLocked.value = false;
  typedInput.value = "";
  revealAnswer.value = false;

  feedback.message = "";
  feedback.details = "";

  // if you added these:
  showContinue.value = false;
  lastWasCorrect.value = false;
  lastClozePick.value = null;
}

function resetRound(resetIndex: boolean) {
  resetRoundUiState();

  if (!currentSong.value) return;
  const n = currentSong.value.lines.length;
  if (n < 2) return;

  if (resetIndex) {
    currentIndex.value =
      settings.order === "sequence" ? 0 : randomInt(0, n - 2);
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
    setFeedback(false, t("notGood"), `${t("expectedLabel")}: "${target}"`);
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

    const nextIdx = findNextUnfilledBlankIndex();
    if (nextIdx === -1) {
      finalizeClozeRound(true);
    } else {
      activeBlankIndex.value = nextIdx;
      lastClozePick.value = null; // ✅ reset for next blank
      clozeChoices.value = buildClozeChoices(
        clozeBlanks.value[nextIdx].correct,
        settings.optionCount
      );
    }
  } else {
    setFeedback(
      false,
      t("wordIncorrect"),
      `${t("correctLabel")}: "${blank.correct}"`
    );
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
    if (settings.clozeProgression === "on")
      clozeMissingCount.value = clamp(
        clozeMissingCount.value + 1,
        1,
        settings.clozeMaxMissing
      );
    advanceAfterCorrect();
  } else {
    setFeedback(false, t("clozeIncorrect"), details);
    if (settings.clozeProgression === "on")
      clozeMissingCount.value = clamp(
        clozeMissingCount.value - 1,
        1,
        settings.clozeMaxMissing
      );
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
    setFeedback(true, t("good"));
    advanceVocabQuestion();
  } else {
    revealAnswer.value = true;
    setFeedback(false, t("notGood"), `${t("correctLabel")}: "${correct}"`);
  }
}

function advanceVocabQuestion() {
  if (!currentSong.value?.vocabulary) return;
  setTimeout(() => {
    const n = currentSong.value!.vocabulary!.length;
    if (settings.order === "sequence") {
      vocabIndex.value = (vocabIndex.value + 1) % Math.max(1, n);
    } else {
      vocabIndex.value = randomInt(0, n - 1);
    }
    resetRoundUiState();
    buildVocabularyOptions();
  }, GOOD_MS);
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
 * Text compare / normalization
 * -----------------------------
 */
function compareText(a: string, b: string, mode: Normalize): boolean {
  return normalizeForCompare(a, mode) === normalizeForCompare(b, mode);
}

function normalizeForCompare(s: string, mode: Normalize): string {
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

/**
 * -----------------------------
 * Line splitting / corpus
 * -----------------------------
 */
function splitIntoLines(text: string): string[] {
  return text
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
}

function normalizeLines(lines: string[]): string[] {
  const out: string[] = [];
  for (const l of lines) {
    if (out.length === 0 || out[out.length - 1] !== l) out.push(l);
  }
  return out;
}

function buildWordCorpus(lines: string[]): string[] {
  const set = new Set<string>();
  for (const line of lines) {
    const words = line.match(/[\p{L}\p{N}’'\-]+/gu) ?? [];
    for (const w of words) {
      const ww = w.trim();
      if (ww.length >= 2) set.add(ww);
    }
  }
  return Array.from(set);
}

/**
 * -----------------------------
 * Feedback
 * -----------------------------
 */
function setFeedback(ok: boolean, message: string, details?: string) {
  feedback.ok = ok;
  feedback.message = message;
  // feedback.details = details;

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
 * -----------------------------
 * Sanitization for JSON import
 * -----------------------------
 */
function validateSongSet(x: any): SongSet | null {
  if (!x || typeof x !== "object") return null;
  const id = String(x.id ?? cryptoRandomId());
  const name = String(x.name ?? "").trim();
  const createdAt = x.createdAt ? String(x.createdAt) : new Date().toISOString();
  
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

function sanitizeSong(x: any): Song | null {
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
    createdAt: x.createdAt ? String(x.createdAt) : new Date().toISOString(),
    lines: normalizeLines(lines),
    vocabulary: sanitizeVocabulary(x.vocabulary),
  };
}

function sanitizeVocabulary(vocab: any): Word[] | undefined {
  if (!Array.isArray(vocab)) return undefined;
  const sanitized: Word[] = [];
  for (const v of vocab) {
    if (!v || typeof v !== "object") continue;
    const word = String(v.word ?? "").trim();
    if (!word) continue;
    sanitized.push({
      word,
      translation: v.translation ? String(v.translation).trim() : undefined,
      explanation: v.explanation ? String(v.explanation).trim() : undefined,
    });
  }
  return sanitized.length > 0 ? sanitized : undefined;
}

/**
 * -----------------------------
 * Utility
 * -----------------------------
 */
function clamp(n: number, lo: number, hi: number): number {
  if (Number.isNaN(n)) return lo;
  return Math.max(lo, Math.min(hi, n));
}
function randomInt(lo: number, hiInclusive: number): number {
  return Math.floor(Math.random() * (hiInclusive - lo + 1)) + lo;
}
function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function sampleUnique<T>(items: T[], k: number, keyFn: (x: T) => string): T[] {
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
function cryptoRandomId(): string {
  const a = new Uint32Array(4);
  crypto.getRandomValues(a);
  return Array.from(a)
    .map((x) => x.toString(16).padStart(8, "0"))
    .join("");
}
function downloadText(text: string, filename: string, mime: string) {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/**
 * -----------------------------
 * JSON schema example
 * -----------------------------
 */
const jsonSchemaExample = `[
  {
    "id": "optional-string-id",
    "title": "Song title",
    "artist": "Optional artist",
    "album": "Optional album",
    "createdAt": "2026-02-08T12:00:00.000Z",
    "lines": [
      "First line",
      "Second line",
      "..."
    ],
    "vocabulary": [
      {
        "word": "palabra",
        "translation": "word",
        "explanation": "A unit of language"
      },
      {
        "word": "canción",
        "translation": "song",
        "explanation": "A piece of music with lyrics"
      }
    ]
  }
]`;

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

<style scoped>
html,
body {
  height: 100%;
  width: 100%;
  max-width: 100%;
  margin: 0;
  overflow-x: hidden;
  overflow-y: auto;
}

#app {
  height: inherit;
  width: inherit;
  margin: inherit;
  padding: 0 0 0 0;
}

:global(*, *::before, *::after) {
  box-sizing: border-box;
}

:global(:root) {
  --topbar-bg: linear-gradient(90deg, #0a3cff, #2563eb);
  --topbar-text: #ffffff;
  --topbar-subtext: rgba(255, 255, 255, 0.85);

  --tab-inactive-bg: rgba(0, 0, 0, 0.18);
  --tab-inactive-text: #ffffff;

  --tab-active-bg: #f6f6f6;
  --tab-active-text: #111111;

  --content-bg: #f6f6f6;
}

.app {
  /* Layout */
  min-height: 100dvh;
  width: 100%;
  display: flex;
  flex-direction: column;

  /* IMPORTANT: no outer padding */
  padding: 0;
  margin: 0;

  /* Typography */
  font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell,
    Noto Sans, Helvetica, Arial, sans-serif;
  line-height: 1.35;

  /* Base colors (light content area) */
  background: #f6f6f6;
  color: #111;

  /* Define theme variables HERE so scoped CSS works */
  --topbar-bg: linear-gradient(140deg, #0a3cff, #3976f9);
  --topbar-text: #ffffff;
  --topbar-subtext: rgba(255, 255, 255, 0.85);

  --tab-inactive-bg: rgba(0, 0, 0, 0.18);
  --tab-inactive-text: #ffffff;

  --tab-active-bg: #f6f6f6;
  --tab-active-text: #111111;

  --content-bg: #f6f6f6;
}


.topbar {
  position: sticky;
  top: 0;
  z-index: 50;

  background: var(--topbar-bg);
  color: var(--topbar-text);
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
}

.topbar-actions {
  display: flex;
  gap: 8px;
  flex: 0 0 auto;
}

.topbar-btn {
  border: 1px solid rgba(255, 255, 255, 0.35);
  background: rgba(0, 0, 0, 0.18);
  color: #fff;

  padding: 7px 10px;
  border-radius: 8px;
  font-size: 12px;
  cursor: pointer;
}

.topbar-btn:hover {
  background: rgba(0, 0, 0, 0.28);
}

.topbar .btn.primary {
  background: #000000;
  border-color: #000000;
}

.header {
  padding: 14px 16px 8px 16px;
}

.header h1 {
  color: var(--topbar-text);
}

.sub {
  color: var(--topbar-subtext);
}

/* optional: make header buttons fit the bar */
.header-actions .btn {
  background: rgba(255, 255, 255, 0.14);
  border-color: rgba(255, 255, 255, 0.30);
  color: #fff;
}

.header-actions .btn:hover {
  background: rgba(255, 255, 255, 0.22);
}

.header-actions .btn.primary {
  background: rgba(0, 0, 0, 0.25);
  border-color: rgba(255, 255, 255, 0.30);
}


.small {
  font-size: 12px;
  color: #555;
}

.topbar-tabs {
  display: flex;
  gap: 2px;
  padding: 0 6px;

  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  border-top: 1px solid rgba(255, 255, 255, 0.18);
}

.topbar-tab {
  appearance: none;
  border: 0;
  border-radius: 0;       /* 🚫 no rounding */

  background: transparent;
  color: rgba(255, 255, 255, 0.9);

  padding: 10px 14px;
  font-size: 13px;
  font-weight: 500;

  cursor: pointer;
  white-space: nowrap;
}


.topbar-tab:hover {
  background: rgba(0, 0, 0, 0.10);
}

.topbar-tab.active {
  color: #ffffff;
  background: transparent;          /* no block */
  border: 0px 2px 0px 0px solid #ffffff; /* classic tab indicator */
}

.app-tabs {
  display: flex;
  gap: 6px;
  padding: 0 12px;
  background: transparent;
}

.app-tab {
  padding: 10px 14px;
  font-size: 13px;

  border-radius: 10px 10px 0 0;
  border: 1px solid rgba(0, 0, 0, 0.25);
  border-bottom: 0;

  background: var(--tab-inactive-bg);
  color: var(--tab-inactive-text);

  cursor: pointer;
}

.app-tab:hover {
  background: rgba(0, 0, 0, 0.28);
}

.app-tab.active {
  background: var(--tab-active-bg);
  color: var(--tab-active-text);
  border-color: rgba(0, 0, 0, 0.15);
}

.main {
  flex: 1 1 auto;
  padding: 0px;
  /* content spacing lives here */
  background: #f6f6f6;
  border-top: 1px solid #e8e8e8;
}


main.grid {
  overflow: visible;
  min-height: auto;
}

/* Card */
.card {
  border-radius: 0;
  /* remove rounded corners */
  border-left: 0;
  border-right: 0;
  border-bottom: 0;
  border-top: 1px solid #e8e8e8;
}


.card-head {
  padding: 10px 14px;
  border-bottom: 1px solid #eee;
}

.card-title {
  font-weight: 750;
  font-size: 14px;
}

.card-body {
  flex: 1 1 auto;
  min-height: 0;
  overflow: auto;
  padding: 0px;
}

/* Shared inputs */
.row {
  display: flex;
  gap: 10px;
  align-items: center;
  margin: 10px 0;
}

.row>label {
  width: 110px;
  color: #444;
  font-size: 13px;
}

input,
select,
textarea {
  width: 100%;
  border: 1px solid #d6d6d6;
  border-radius: 10px;
  padding: 10px 11px;
  font-size: 14px;
  outline: none;
  background: #fff;
  color: #111;
}

input::placeholder,
textarea::placeholder {
  color: #777;
}

textarea {
  resize: vertical;
}

.btn {
  border: 1px solid #d6d6d6;
  background: #f2f2f2;
  color: #111;
  padding: 9px 12px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 13px;
}

.btn:hover {
  background: #eaeaea;
}

.btn.primary {
  background: #111;
  color: #fff;
  border-color: #111;
}

.btn.primary:hover {
  background: #1a1a1a;
}

.btn.danger {
  background: #fff;
  color: #111;
  border-color: #e2b4b4;
}

.btn.danger:hover {
  background: #fff5f5;
}

/* Inner tabs (source tabs) */
.tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.tab {
  border: 1px solid #d6d6d6;
  background: #f7f7f7;
  color: #111;
  padding: 8px 10px;
  cursor: pointer;
  font-size: 13px;
}

.tab.active {
  background: #111;
  color: #fff;
  border-color: #111;
}

.panel {
  margin-top: 8px;
}

/* Songs list */
.song-row {
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid #e8e8e8;
  background: #fff;
  border-radius: 10px;
  padding: 8px;
}

.song-row.selected {
  border-color: #111;
}

.song-main {
  flex: 1;
  text-align: left;
  border: 0;
  background: transparent;
  padding: 6px 8px;
  cursor: pointer;
  color: #111;
  border-radius: 8px;
}

.song-main:hover {
  background: #f7f7f7;
}

.icon-btn {
  flex: 0 0 auto;
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  border: 1px solid #d6d6d6;
  background: #f2f2f2;
  color: #111;
  cursor: pointer;
  padding: 0;
}

.icon-btn:hover {
  background: #eaeaea;
}

.icon-btn.danger {
  background: #fff;
  border-color: #e2b4b4;
}

.icon-btn.danger:hover {
  background: #fff5f5;
}

.song-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow: auto;
  overflow-y: auto;
  max-height: 100%;
  padding-right: 6px;
}

.song-title {
  font-weight: 650;
}

.song-meta {
  font-size: 12px;
  color: #555;
  margin-top: 2px;
}

/* Trainer */
.trainer {
  margin-top: 4px;
}

.song-header {
  /* display: flex; */
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}

.now-playing {
  font-weight: 700;
  font-size: 16px;
}

.prompt,
.answer,
.cloze-line {
  border: 1px solid #e7e7e7;
  background: #ffffff;
  border-radius: 12px;
  padding: 10px 12px;
  margin-bottom: 10px;
  color: #111;
}

.label {
  font-size: 12px;
  color: #555;
  margin-bottom: 6px;
}

.line {
  font-size: 16px;
  white-space: pre-wrap;
  color: #111;
}

.choices {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
  margin-top: 10px;
}

.choice {
  border: 1px solid #e2e2e2;
  background: #fff;
  color: #111;
  border-radius: 12px;
  padding: 10px 12px;
  cursor: pointer;
  text-align: left;
  font-size: 14px;
}

.choice:hover {
  background: #f7f7f7;
}

.choice.correct {
  border-color: #2a7;
  background: #f2fff9;
  color: #111;
}

.choice.wrong {
  border-color: #d66;
  background: #fff4f4;
  color: #111;
  opacity: 1;
}

.feedback {
  margin: 12px 0;
}

.pill {
  display: inline-block;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  border: 1px solid #d6d6d6;
  color: #111;
}

.pill.ok {
  border-color: #2a7;
  background: #f2fff9;
}

.pill.bad {
  border-color: #d66;
  background: #fff4f4;
}

.stats {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
  margin-top: 14px;
}

.sticky-actions {
  position: sticky;
  bottom: 0;
  background: #fff;
  padding: 10px 0;
  margin: 10px 0 0 0;
  border-top: 1px solid #eee;
  z-index: 5;
}

.stat {
  border: 1px solid #e9e9e9;
  border-radius: 12px;
  padding: 10px 12px;
  background: #fff;
  color: #111;
}

.value {
  font-weight: 650;
  color: #111;
}

.blank {
  display: inline-block;
  min-width: 70px;
  padding: 2px 6px;
  margin: 0 2px;
  border-bottom: 2px solid #666;
  border-radius: 8px;
  background: #fff;
  color: #111;
}

.code {
  background: #0b0b0b;
  color: #e6e6e6;
  padding: 10px;
  border-radius: 10px;
  max-width: 100%;
  overflow: auto;
  font-size: 12px;
}

.empty {
  padding: 12px;
  border: 1px dashed #d6d6d6;
  border-radius: 12px;
  color: #444;
  background: #fff;
}

/* Settings */
.settings-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}

@media (min-height: 700px) {
  .stats {
    grid-template-columns: 1fr;
  }

  .settings-grid {
    grid-template-columns: 1fr;
  }

  .app {
    overflow: auto;
    /* was hidden */
  }

  .main {
    overflow: auto;
    /* allow page-level scrolling */
    min-height: auto;
  }

  .card-body {
    overflow: visible;
    /* avoid nested scroll on mobile */
  }
}


.field label {
  display: block;
  font-size: 12px;
  color: #555;
  margin: 0 0 6px 2px;
}

.field input,
.field select {
  width: 100%;
}

.about {
  margin-top: 24px;
  padding: 16px;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: var(--radius);
}

.about h2 {
  margin: 0 0 10px 0;
  font-size: 16px;
  font-weight: 700;
}

.about p {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: var(--text);
}

.about p:last-child {
  margin-bottom: 0;
}

.footer {
  margin-top: 14px;
  text-align: center;
  color: #555;
}

.vocabulary-word {
  margin-bottom: 20px;
  padding: 16px;
  background: #f9f9f9;
  border: 2px solid #ddd;
  border-radius: 8px;
}

.word-display {
  font-size: 28px;
  font-weight: 700;
  color: #111;
  margin-top: 8px;
  word-break: break-word;
}

.vocabulary-choices {
  margin-top: 16px;
}

.vocab-option-text {
  word-break: break-word;
  white-space: pre-wrap;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
}

.modal-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid #e2e2e2;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.modal-header h2 {
  margin: 0;
  font-size: 18px;
  color: #111;
}

.help-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #e8f0ff;
  color: #0066cc;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.help-link:hover {
  background: #0066cc;
  color: white;
}

.help-link svg {
  width: 16px;
  height: 16px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #111;
  background: #f0f0f0;
  border-radius: 4px;
}

.modal-body {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.json-editor {
  width: 100%;
  font-family: "Monaco", "Courier New", monospace;
  font-size: 12px;
  line-height: 1.5;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #fafafa;
  color: #333;
  resize: vertical;
}

.json-editor:focus {
  outline: none;
  border-color: #0a3cff;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(10, 60, 255, 0.1);
}

.modal-footer {
  padding: 16px 20px;
  border-top: 1px solid #e2e2e2;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  background: #fafafa;
}

.modal-footer .btn {
  min-width: 100px;
}

/* Modal tabs styling */
.modal-tabs {
  display: flex;
  gap: 0;
  border-bottom: 2px solid #e2e2e2;
  margin: -20px -20px 0 -20px;
  padding: 0;
  background: #fafafa;
}

.modal-tabs button {
  flex: 1;
  padding: 12px 16px;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #666;
  transition: all 0.2s ease;
}

.modal-tabs button:hover {
  background: #f0f0f0;
  color: #333;
}

.modal-tabs button.active {
  color: #0a3cff;
  border-bottom-color: #0a3cff;
  background: #fff;
}

/* Visual editor styling */
.visual-editor {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.visual-editor-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.visual-editor-section label {
  font-weight: 500;
  font-size: 13px;
  color: #333;
}

.visual-editor-section input,
.visual-editor-section textarea {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
  font-size: 14px;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  color: #333;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.visual-editor-section input:focus,
.visual-editor-section textarea:focus {
  outline: none;
  border-color: #0a3cff;
  box-shadow: 0 0 0 3px rgba(10, 60, 255, 0.1);
}

.lyrics-editor {
  min-height: 150px;
  font-family: "Monaco", "Courier New", monospace;
  font-size: 13px;
  line-height: 1.6;
  resize: vertical;
}

/* Translation panel styling */
.translation-panel {
  background: #f8f9fa;
  border: 1px solid #e2e2e2;
  border-radius: 6px;
  padding: 12px;
  margin-top: 8px;
}

.translation-panel h4 {
  margin: 0 0 12px 0;
  font-size: 13px;
  font-weight: 600;
  color: #333;
}

.translation-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.translation-form-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.translation-form-row label {
  font-size: 12px;
  font-weight: 500;
  color: #666;
}

.translation-form-row input,
.translation-form-row textarea {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
  font-size: 13px;
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 3px;
  background: #fff;
  color: #333;
}

.translation-form-row textarea {
  min-height: 60px;
  font-family: "Monaco", "Courier New", monospace;
  font-size: 12px;
  resize: vertical;
}

.translation-form-row input:focus,
.translation-form-row textarea:focus {
  outline: none;
  border-color: #0a3cff;
  box-shadow: 0 0 0 2px rgba(10, 60, 255, 0.1);
}

.translation-form-buttons {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 4px;
}

.translation-form-buttons button {
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid #ddd;
  border-radius: 3px;
  background: #fff;
  color: #333;
  cursor: pointer;
  transition: all 0.2s ease;
}

.translation-form-buttons button:hover {
  background: #f0f0f0;
  border-color: #ccc;
}

.translation-form-buttons .primary-btn {
  background: #0a3cff;
  color: #fff;
  border-color: #0a3cff;
}

.translation-form-buttons .primary-btn:hover {
  background: #0633d9;
  border-color: #0633d9;
}

/* Vocabulary list styling */
.vocabulary-list {
  background: #f8f9fa;
  border: 1px solid #e2e2e2;
  border-radius: 6px;
  padding: 12px;
}

.vocabulary-list h4 {
  margin: 0 0 12px 0;
  font-size: 13px;
  font-weight: 600;
  color: #333;
}

.vocabulary-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 200px;
  overflow-y: auto;
}

.vocabulary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background: #fff;
  border: 1px solid #e2e2e2;
  border-radius: 4px;
  font-size: 13px;
}

.vocabulary-item-content {
  flex: 1;
}

.vocabulary-item-word {
  font-weight: 600;
  color: #0a3cff;
}

.vocabulary-item-translation {
  color: #666;
  font-size: 12px;
}

.vocabulary-item-explanation {
  color: #999;
  font-size: 11px;
  font-style: italic;
  margin-top: 2px;
}

.vocabulary-item-remove {
  padding: 4px 8px;
  background: #ffebee;
  color: #c62828;
  border: none;
  border-radius: 3px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.vocabulary-item-remove:hover {
  background: #ef5350;
  color: #fff;
}

.empty-vocabulary {
  color: #999;
  font-size: 12px;
  text-align: center;
  padding: 20px 0;
}
</style>
