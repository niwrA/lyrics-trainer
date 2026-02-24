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
    <!-- Feedback + Continue/Try Again on the same row -->
    <div v-if="training.feedback.message || training.showContinue" class="feedback-row">
      <div v-if="training.feedback.message" class="feedback-pills">
        <div :class="['pill', training.feedback.ok ? 'ok' : 'bad']">
          {{ training.feedback.message }}
        </div>
        <div v-if="training.feedback.details" class="pill pill-info" style="white-space: pre-wrap;">
          {{ training.feedback.details }}
        </div>
      </div>
      <div v-if="training.showContinue" class="feedback-actions">
        <button class="btn" @click="training.continueAfterWrong()">
          {{ t("continue") }}
        </button>
        <button class="btn primary" @click="training.tryAgainSamePrompt()">
          {{ t("tryAgain") }}
        </button>
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
import { useSettings } from "../../composables/useSettings";
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
const { settings } = useSettings();
const { t } = useI18n(() => settings.uiLang as "en" | "es");
</script>
