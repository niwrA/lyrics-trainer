<template>
  <div class="mode-content">
    <h3>{{ t("modeVocabulary") }}</h3>

    <!-- Empty state -->
    <div v-if="!currentWord" class="empty">
      {{ t("noVocabulary") }}
    </div>

    <!-- Vocabulary exercise -->
    <div v-else>
      <!-- Display the vocabulary word -->
      <div class="vocabulary-word">
        <div class="label">{{ t("vocabularyWord") }}</div>
        <div class="word-display">{{ currentWord.word }}</div>
      </div>

      <!-- Meaning choices -->
      <div class="vocabulary-choices">
        <div class="small">{{ t("vocabularyHint") }}</div>
        <button
          v-for="(option, idx) in training.vocabChoices"
          :key="idx"
          class="choice"
          :class="choiceClassVocab(option)"
          :disabled="training.roundLocked"
          @click="submitVocabularyChoice(option)"
        >
          <div class="vocab-option-text">{{ option }}</div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "../../composables/useI18n";
import { normalizeForCompare } from "../../utils/text";
import type { Song } from "../../types";

interface Props {
  training: any;
  settings: any;
  currentSong: Song | null;
}

const props = defineProps<Props>();
const { t } = useI18n("en");

// Get current vocabulary word
const currentWord = computed(() => {
  if (!props.training || !props.currentSong || props.settings.mode !== "vocabulary") {
    return null;
  }
  const song = props.currentSong;
  const vocab = song.vocabulary?.[props.training.vocabIndex];
  return vocab ?? null;
});

// Determine CSS class for vocabulary choice
function choiceClassVocab(option: string): Record<string, boolean> {
  if (!currentWord.value) return {};
  if (!props.training.feedback.message) {
    return {};
  }

  // After feedback is shown
  const isCorrect = 
    option.toLowerCase().trim() === (currentWord.value.translation || currentWord.value.explanation)?.toLowerCase().trim();

  return {
    correct: isCorrect && props.training.feedback.ok,
    incorrect: isCorrect && !props.training.feedback.ok,
  };
}

// Submit a vocabulary choice
function submitVocabularyChoice(option: string): void {
  if (props.training.roundLocked || !currentWord.value) return;

  const expected = currentWord.value.translation || currentWord.value.explanation || "";
  const isCorrect = normalizeForCompare(option, props.settings.normalize) ===
                   normalizeForCompare(expected, props.settings.normalize);

  props.training.stats.total += 1;
  if (isCorrect) {
    props.training.stats.correct += 1;
    props.training.setFeedback(true, "Correct!");
    props.training.advanceAfterCorrect();
  } else {
    props.training.roundLocked = true;
    props.training.setFeedback(false, "Incorrect.", `Correct: "${expected}"`);
  }
}
</script>

<style scoped>
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

.empty {
  text-align: center;
  padding: 40px 20px;
  color: #999;
  font-size: 16px;
}

.label {
  font-size: 12px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  margin-bottom: 8px;
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

.small {
  font-size: 13px;
  color: #999;
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

.vocab-option-text {
  font-size: 14px;
}
</style>
