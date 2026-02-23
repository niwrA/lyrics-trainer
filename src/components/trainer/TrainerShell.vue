<template>
  <div class="trainer">
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

    <!-- Prompt Line (non-vocabulary) -->
    <div v-if="settings.mode !== 'vocabulary'" class="prompt">
      <div class="label">{{ t("prompt") }}</div>
      <div class="line">{{ training.promptLine }}</div>
    </div>

    <!-- Answer Line (revealed) -->
    <div v-if="settings.mode !== 'vocabulary' && training.revealAnswer" class="answer">
      <div class="label">{{ t("answer") }}</div>
      <div class="line">{{ training.answerLine }}</div>
    </div>

    <!-- MODE ROUTER: Render appropriate mode component -->
    <NextLineMode
      v-if="settings.mode === 'nextLine'"
      :training="training"
      :settings="settings"
      :answer-line="training.answerLine"
    />

    <ClozeMode
      v-else-if="settings.mode === 'cloze'"
      :training="training"
      :settings="settings"
    />

    <TypeMode
      v-else-if="settings.mode === 'type'"
      :training="training"
      :settings="settings"
    />

    <VocabularyMode
      v-else-if="settings.mode === 'vocabulary'"
      :training="training"
      :settings="settings"
      :current-song="currentSong"
    />

    <!-- Continue / Try Again Buttons -->
    <div class="row">
      <div class="row">
        <button
          v-if="training.showContinue"
          class="btn"
          @click="training.continueAfterWrong()"
        >
          {{ t("continue") }}
        </button>
        <button
          v-if="training.showContinue"
          class="btn primary"
          @click="training.tryAgainSamePrompt()"
        >
          {{ t("tryAgain") }}
        </button>
      </div>
    </div>

    <!-- Feedback -->
    <div v-if="training.feedback.message" class="feedback">
      <div :class="['pill', training.feedback.ok ? 'ok' : 'bad']">
        {{ training.feedback.message }}
      </div>
      <div v-if="training.feedback.details" class="pill pill-info" style="white-space: pre-wrap;">
        {{ training.feedback.details }}
      </div>
    </div>

    <!-- Statistics -->
    <div class="stats">
      <div class="stat">
        <div class="label">{{ t("statsScore") }}</div>
        <div class="value">
          {{ t("scoreLineShort", { ok: training.stats.correct, total: training.stats.total }) }}
        </div>
      </div>

      <div v-if="settings.mode === 'cloze'" class="stat">
        <div class="label">{{ t("statsClozeDifficulty") }}</div>
        <div class="value">{{ t("missingWords", { n: training.clozeMissingCount }) }}</div>
      </div>

      <div v-if="settings.mode !== 'vocabulary'" class="stat">
        <div class="label">{{ t("statsLineIndex") }}</div>
        <div class="value">
          {{ t("indexOf", { i: training.currentIndex + 1, n: currentSong.lines.length }) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "../../composables/useI18n";
import NextLineMode from "./NextLineMode.vue";
import ClozeMode from "./ClozeMode.vue";
import TypeMode from "./TypeMode.vue";
import VocabularyMode from "./VocabularyMode.vue";
import type { Song } from "../../types";

interface Props {
  currentSong: Song;
  settings: any;
  training: any;
}

defineProps<Props>();
const { t } = useI18n("en");
</script>

<style scoped>
.trainer {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.song-header {
  padding: 0px 0 0 0;
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

.row {
  display: flex;
  gap: 10px;
  align-items: center;
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
