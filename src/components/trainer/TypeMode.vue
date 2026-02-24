<template>
  <div class="mode-content">
    <h3>{{ t("modeType") }}</h3>

    <!-- Optional hint text -->
    <div
      v-if="settings.typeTarget === 'currentLine' && settings.showHintLine === 'on'"
      class="small"
    >
      {{ t("typeHintLine") }}
    </div>

    <!-- Text input -->
    <div class="row">
      <input
        v-model="typedInput"
        :disabled="training.roundLocked"
        :placeholder="t('typeHere')"
        @keydown.enter.prevent="training.submitTypedLine()"
      />
      <button
        class="btn primary"
        :disabled="training.roundLocked"
        @click="training.submitTypedLine()"
      >
        {{ t("check") }}
      </button>
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
