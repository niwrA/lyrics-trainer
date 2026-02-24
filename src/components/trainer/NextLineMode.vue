<template>
  <div class="mode-content">
    <h3>{{ t("chooseNextLine") }}</h3>

    <!-- Multiple Choice -->
    <div v-if="settings.nextLineInput === 'choice'" class="choices">
      <button
        v-for="c in training.mcqChoices"
        :key="c.key"
        class="choice"
        :class="choiceClassText(c.text)"
        :disabled="training.roundLocked"
        @click="training.submitChoice(c.text)"
      >
        {{ c.text }}
      </button>
    </div>

    <!-- Type Input -->
    <div v-else>
      <div class="row">
        <input
          v-model="typedInput"
          :disabled="training.roundLocked"
          :placeholder="t('typeHere')"
          @keydown.enter.prevent="training.submitTypedNextLine()"
        />
        <button
          class="btn primary"
          :disabled="training.roundLocked"
          @click="training.submitTypedNextLine()"
        >
          {{ t("check") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "../../composables/useI18n";
import { useSettings } from "../../composables/useSettings";

interface Props {
  training: any;
  settings: any;
  answerLine: string;
}

const props = defineProps<Props>();
const { settings } = useSettings();
const { t } = useI18n(() => settings.uiLang as "en" | "es");

// Two-way binding for typed input
const typedInput = computed({
  get: () => props.training.typedInput,
  set: (val) => {
    props.training.typedInput = val;
  },
});

// Determine CSS class for each choice
function choiceClassText(text: string): Record<string, boolean> {
  const normalized = (s: string) =>
    s.toLowerCase().trim().replace(/[^\w\s]/g, "");

  if (!props.training.feedback.message) {
    return {};
  }

  // After answer is revealed
  const isCorrect = normalized(text) === normalized(props.answerLine);
  return {
    correct: isCorrect && props.training.feedback.ok,
    incorrect: isCorrect && !props.training.feedback.ok,
  };
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
</style>
