<template>
  <div class="mode-content">
    <h3>{{ t("fillMissingWords") }}</h3>

    <!-- Cloze line with clickable blanks -->
    <div class="cloze-line">
      <span v-for="(tkn, i) in training.clozeTokens" :key="i">
        <template v-if="tkn.type === 'text'">{{ tkn.value }}</template>
        <template v-else>
          <button
            class="blank-btn"
            :class="{
              active:
                training.findBlankIndexByToken(tkn) === training.activeBlankIndex &&
                settings.clozeInput === 'choice',
              filled: !!tkn.filled,
            }"
            :disabled="training.roundLocked || !!tkn.filled"
            @click="training.selectBlankByToken(tkn)"
          >
            {{ tkn.filled ?? "____" }}
          </button>
        </template>
      </span>
    </div>

    <!-- Choice-based input -->
    <div v-if="settings.clozeInput === 'choice'">
      <div class="small">{{ t("clozeChoiceHint") }}</div>

      <!-- Optional target word helper -->
      <div v-if="settings.showClozeTarget === 'on'" class="row">
        <div class="field" style="flex: 1">
          <label>{{ t("targetWordHelper") }}</label>
          <input :value="training.clozeBlanks[training.activeBlankIndex]?.correct ?? ''" disabled />
        </div>
      </div>

      <!-- Choice buttons -->
      <div class="choices">
        <button
          v-for="w in training.clozeChoices"
          :key="w"
          class="choice"
          :class="choiceClassWord(w)"
          :disabled="training.roundLocked || training.isBlankFilled(training.activeBlankIndex)"
          @click="submitClozeChoice(w)"
        >
          {{ w }}
        </button>
      </div>
    </div>

    <!-- Type-based input -->
    <div v-else>
      <div class="small">{{ t("clozeTypeHint") }}</div>
      <div class="row">
        <input
          v-model="typedInput"
          :disabled="training.roundLocked"
          :placeholder="t('typeHere')"
          @keydown.enter.prevent="submitTypedCloze()"
        />
        <button
          class="btn primary"
          :disabled="training.roundLocked"
          @click="submitTypedCloze()"
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
import { normalizeForCompare } from "../../utils/text";

interface Props {
  training: any;
  settings: any;
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

// Determine CSS class for word choice
function choiceClassWord(word: string): Record<string, boolean> {
  const activeBlank = props.training.clozeBlanks[props.training.activeBlankIndex];
  if (!activeBlank) return {};

  if (!props.training.feedback.message) {
    return {};
  }

  // After feedback is shown
  const isCorrect = normalizeForCompare(word, props.settings.normalize) ===
                    normalizeForCompare(activeBlank.correct, props.settings.normalize);
  
  return {
    correct: isCorrect && props.training.feedback.ok,
    incorrect: isCorrect && !props.training.feedback.ok,
  };
}

// Submit a typed cloze answer
function submitTypedCloze(): void {
  if (props.training.roundLocked) return;

  const activeBlank = props.training.clozeBlanks[props.training.activeBlankIndex];
  if (!activeBlank) return;

  props.training.submitTypedLine(activeBlank.correct, props.settings.normalize);
  
  // Fill the blank
  if (props.training.feedback.ok) {
    activeBlank.filled = props.training.typedInput;
  }
}

// Submit a cloze choice answer
function submitClozeChoice(word: string): void {
  if (props.training.roundLocked) return;

  // Delegate to the training method which handles all progression logic
  props.training.submitClozeChoice(word);
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

.small {
  font-size: 13px;
  color: #999;
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
  color: #333;
}

.choice:hover:not(:disabled) {
  border-color: #1976d2;
  background: #f5f5f5;
  color: #333;
}

.choice:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  color: #333;
}

.choice.correct {
  border-color: #4caf50;
  background: #e8f5e9;
  color: #333;
}

.choice.incorrect {
  border-color: #f44336;
  background: #ffebee;
  color: #333;
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
