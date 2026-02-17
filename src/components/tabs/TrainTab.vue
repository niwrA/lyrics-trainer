<template>
  <section class="card">
    <div class="card-body">
      <div v-if="!currentSong" class="empty">{{ t("chooseSongFirst") }}</div>

      <div v-else class="trainer">
        <!-- Song Header -->
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

        <!-- Mode Selector -->
        <div class="training-mode-selector">
          <label>{{ t("exercise") }}</label>
          <select v-model="settings.mode" @change="resetRound(true)">
            <option value="nextLine">{{ t("modeNextLine") }}</option>
            <option value="cloze">{{ t("modeCloze") }}</option>
            <option value="type">{{ t("modeType") }}</option>
            <option value="vocabulary">{{ t("modeVocabulary") }}</option>
          </select>
        </div>

        <!-- Prompt Line (non-vocabulary) -->
        <div v-if="settings.mode !== 'vocabulary'" class="prompt">
          <div class="label">{{ t("prompt") }}</div>
          <div class="line">{{ promptLine }}</div>
        </div>

        <!-- Answer Line (revealed) -->
        <div v-if="settings.mode !== 'vocabulary' && revealAnswer" class="answer">
          <div class="label">{{ t("answer") }}</div>
          <div class="line">{{ answerLine }}</div>
        </div>

        <!-- MODE: nextLine -->
        <div v-if="settings.mode === 'nextLine'" class="mode-content">
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
        <div v-else-if="settings.mode === 'cloze'" class="mode-content">
          <h3>{{ t("fillMissingWords") }}</h3>

          <div class="cloze-line">
            <span v-for="(tkn, i) in clozeTokens" :key="i">
              <template v-if="tkn.type === 'text'">{{ tkn.value }}</template>
              <template v-else>
                <button class="blank-btn" :class="{
                  active: findBlankIndexByToken(tkn) === activeBlankIndex && settings.clozeInput === 'choice',
                  filled: !!tkn.filled
                }" :disabled="roundLocked || !!tkn.filled" @click="selectBlankByToken(tkn)">
                  {{ tkn.filled ?? "____" }}
                </button>
              </template>
            </span>
          </div>

          <div v-if="settings.clozeInput === 'choice'">
            <div class="small">{{ t("clozeChoiceHint") }}</div>

            <div class="row" v-if="settings.showClozeTarget === 'on'">
              <div class="field" style="flex: 1">
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
        <div v-else-if="settings.mode === 'type'" class="mode-content">
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
        <div v-else-if="settings.mode === 'vocabulary'" class="mode-content">
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
              <button v-for="(option, idx) in vocabChoices" :key="idx" class="choice" :disabled="roundLocked"
                @click="submitVocabularyChoice(option)">
                <div class="vocab-option-text">{{ option }}</div>
              </button>
            </div>
          </div>
        </div>

        <!-- Continue / Try Again Buttons -->
        <div class="row">
          <div class="row">
            <button v-if="showContinue" class="btn" @click="continueAfterWrong()">
              {{ t("continue") }}
            </button>
            <button v-if="showContinue" class="btn primary" @click="tryAgainSamePrompt()">
              {{ t("tryAgain") }}
            </button>
          </div>
        </div>

        <!-- Feedback -->
        <div class="feedback" v-if="feedback.message">
          <div :class="['pill', feedback.ok ? 'ok' : 'bad']">{{ feedback.message }}</div>
          <div class="pill pill-info" v-if="feedback.details">{{ feedback.details }}</div>
        </div>

        <!-- Statistics -->
        <div class="stats">
          <div class="stat">
            <div class="label">{{ t("statsScore") }}</div>
            <div class="value">{{ t("scoreLineShort", { ok: stats.correct, total: stats.total }) }}</div>
          </div>

          <div class="stat" v-if="settings.mode === 'cloze'">
            <div class="label">{{ t("statsClozeDifficulty") }}</div>
            <div class="value">{{ t("missingWords", { n: clozeMissingCount }) }}</div>
          </div>

          <div class="stat" v-if="settings.mode !== 'vocabulary'">
            <div class="label">{{ t("statsLineIndex") }}</div>
            <div class="value">
              {{ t("indexOf", { i: currentIndex + 1, n: currentSong.lines.length }) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, computed } from "vue";
import { useSongs } from "../../composables/useSongs";
import { useSettings } from "../../composables/useSettings";
import { useTraining } from "../../composables/useTraining";
import { useI18n } from "../../composables/useI18n";

// Composables
const { t } = useI18n("en");
const songs = useSongs();
const { settings, loadSettings } = useSettings();

// Load data on mount
onMounted(() => {
  songs.loadSongs();
  loadSettings();
});

// Get refs
const { currentSong } = songs;

// Initialize training state
const training = ref<ReturnType<typeof useTraining> | null>(null);

// Watch for song changes
watch(
  () => songs.currentSong.value,
  (newSong) => {
    if (newSong) {
      training.value = useTraining(newSong, settings);
    }
  },
  { immediate: true }
);

// Reactive references to training properties
const stats = computed(() => training.value?.stats ?? { correct: 0, total: 0 });
const currentIndex = computed(() => training.value?.currentIndex ?? 0);
const promptLine = computed(() => training.value?.promptLine ?? "");
const answerLine = computed(() => training.value?.answerLine ?? "");
const roundLocked = computed(() => training.value?.roundLocked ?? false);
const revealAnswer = computed(() => training.value?.revealAnswer ?? false);
const typedInput = computed({
  get: () => training.value?.typedInput ?? "",
  set: (val) => {
    if (training.value) training.value.typedInput = val;
  }
});
const showContinue = computed(() => training.value?.showContinue ?? false);
const mcqChoices = computed(() => training.value?.mcqChoices ?? []);
const clozeTokens = computed(() => training.value?.clozeTokens ?? []);
const activeBlankIndex = computed(() => training.value?.activeBlankIndex ?? 0);
const clozeChoices = computed(() => training.value?.clozeChoices ?? []);
const clozeMissingCount = computed(() => training.value?.clozeMissingCount ?? 1);
const clozeBlanks = computed(() => training.value?.clozeBlanks ?? []);
const vocabChoices = computed(() => training.value?.vocabChoices ?? []);
const vocabIndex = computed(() => training.value?.vocabIndex ?? 0);
const feedback = computed(() => training.value?.feedback ?? { ok: true, message: "", details: "" });

// Vocabulary mode - get current word (needs to be implemented)
const currentWord = computed(() => {
  if (!training.value || !currentSong.value || settings.mode !== "vocabulary") return null;
  const song = currentSong.value;
  const vocab = song.vocabulary?.[vocabIndex.value];
  return vocab ?? null;
});

// Methods - bind to training instance
const resetRound = (resetIndex: boolean) => training.value?.resetRound(resetIndex);
const submitChoice = (text: string) => training.value?.submitChoice(text);
const submitTypedNextLine = () => training.value?.submitTypedNextLine();
const submitTypedType = () => training.value?.submitTypedType();
const continueAfterWrong = () => training.value?.continueAfterWrong();
const tryAgainSamePrompt = () => training.value?.tryAgainSamePrompt();
const selectBlankByToken = (token: any) => training.value?.selectBlankByToken(token);
const findBlankIndexByToken = (token: any) => training.value?.findBlankIndexByToken(token) ?? -1;
const isBlankFilled = (idx: number) => training.value?.isBlankFilled(idx) ?? false;

// Missing method implementations - TODO: These need to be added to useTraining
const submitTypedCloze = () => {
  // TODO: Implement cloze typed submission
  console.warn("submitTypedCloze not yet implemented");
};

const submitTypedLine = () => {
  // TODO: Implement line typed submission
  console.warn("submitTypedLine not yet implemented");
};

const submitClozeChoice = (word: string) => {
  // TODO: Implement cloze choice submission
  console.warn("submitClozeChoice not yet implemented");
};

const submitVocabularyChoice = (option: string) => {
  // TODO: Implement vocabulary choice submission
  console.warn("submitVocabularyChoice not yet implemented");
};

// CSS class helpers
const choiceClassText = (text: string) => {
  if (!training.value) return {};
  // TODO: Determine if this choice is correct/incorrect
  return {};
};

const choiceClassWord = (word: string) => {
  if (!training.value) return {};
  // TODO: Determine if this word is correct/incorrect
  return {};
};
</script>

<style scoped>
.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.card-body {
  padding: 20px;
}

.empty {
  text-align: center;
  padding: 40px 20px;
  color: #999;
  font-size: 16px;
}

.trainer {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.song-header {
  padding: 16px;
  background: #f5f5f5;
  border-radius: 8px;
}

.now-playing {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.small {
  font-size: 13px;
  color: #999;
  margin-top: 4px;
}

.training-mode-selector {
  display: flex;
  gap: 12px;
  align-items: center;
}

.training-mode-selector > label {
  font-weight: 500;
  min-width: 80px;
}

.training-mode-selector > select {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.prompt,
.answer {
  padding: 16px;
  border-radius: 8px;
  background: #f9f9f9;
  border: 1px solid #e0e0e0;
}

.prompt {
  background: #f0f7ff;
  border-color: #b3d9ff;
}

.answer {
  background: #f0fff0;
  border-color: #b3ffb3;
}

.label {
  font-size: 12px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.line {
  font-size: 16px;
  line-height: 1.6;
  color: #333;
}

.mode-content {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.mode-content > h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.choices {
  display: grid;
  gap: 10px;
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .choices {
    grid-template-columns: 1fr 1fr;
  }
}

.choice {
  padding: 12px 16px;
  background: white;
  border: 2px solid #ddd;
  border-radius: 6px;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
}

.choice:hover:not(:disabled) {
  border-color: #1976d2;
  background: #f5f5f5;
}

.choice:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.choice.correct {
  border-color: #4caf50;
  background: #e8f5e9;
}

.choice.incorrect {
  border-color: #f44336;
  background: #ffebee;
}

.row {
  display: flex;
  gap: 10px;
  align-items: center;
}

.row > input {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.row > input:focus {
  outline: none;
  border-color: #1976d2;
  box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.1);
}

.btn {
  padding: 10px 16px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.btn:hover:not(:disabled) {
  background: #f5f5f5;
  border-color: #999;
}

.btn.primary {
  background: #1976d2;
  color: white;
  border-color: #1976d2;
}

.btn.primary:hover:not(:disabled) {
  background: #1565c0;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.cloze-line {
  font-size: 18px;
  line-height: 1.8;
  padding: 16px;
  background: #f9f9f9;
  border-radius: 8px;
  word-break: break-word;
}

.blank-btn {
  padding: 4px 8px;
  margin: 0 2px;
  background: white;
  border: 2px dashed #1976d2;
  border-radius: 4px;
  font-weight: 600;
  color: #1976d2;
  cursor: pointer;
  min-width: 80px;
  transition: all 0.2s;
}

.blank-btn:hover:not(:disabled) {
  background: #e3f2fd;
}

.blank-btn.active {
  background: #e3f2fd;
  border-style: solid;
}

.blank-btn.filled {
  border-style: solid;
  background: #e8f5e9;
  color: #4caf50;
  cursor: default;
}

.blank-btn:disabled {
  opacity: 0.6;
}

.field {
  display: flex;
  flex-direction: column;
}

.field > label {
  font-weight: 500;
  font-size: 13px;
  margin-bottom: 4px;
}

.field > input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #f9f9f9;
}

.vocabulary-word {
  padding: 24px;
  text-align: center;
  background: #f0f7ff;
  border-radius: 8px;
}

.word-display {
  font-size: 32px;
  font-weight: 700;
  color: #1976d2;
  margin-top: 12px;
}

.vocabulary-choices {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.vocab-option-text {
  font-size: 14px;
}

.feedback {
  padding: 12px 16px;
  border-radius: 8px;
  background: #f9f9f9;
}

.pill {
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
}

.pill.ok {
  background: #e8f5e9;
  color: #2e7d32;
  border: 1px solid #4caf50;
}

.pill.bad {
  background: #ffebee;
  color: #c62828;
  border: 1px solid #f44336;
}

.pill.pill-info {
  background: #e3f2fd;
  color: #1565c0;
  border: 1px solid #1976d2;
  margin-top: 6px;
}

.stats {
  display: grid;
  gap: 15px;
  grid-template-columns: 1fr;
  padding: 16px;
  background: #f5f5f5;
  border-radius: 8px;
}

@media (min-width: 768px) {
  .stats {
    grid-template-columns: repeat(3, 1fr);
  }
}

.stat {
  text-align: center;
}

.stat > .label {
  font-size: 11px;
}

.stat > .value {
  font-size: 20px;
  font-weight: 700;
  color: #1976d2;
  margin-top: 8px;
}
</style>
