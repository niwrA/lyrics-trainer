<template>
  <section class="card">
    <div class="card-body">
      <div>
        <!-- Global Settings -->
        <div class="settings-section settings-global">
          <h3 class="settings-section-title">{{ t("exerciseAndOptions") }}</h3>
          <div class="settings-grid">
            <div class="field">
              <label>{{ t("uiLanguage") }}</label>
              <select v-model="settings.uiLang" @change="reset(false)">
                <option value="en">English</option>
                <option value="es">Español</option>
              </select>
            </div>

            <div class="field">
              <label>{{ t("order") }}</label>
              <select v-model="settings.order" @change="reset(true)">
                <option value="sequence">{{ t("orderSequence") }}</option>
                <option value="random">{{ t("orderRandom") }}</option>
              </select>
            </div>

            <div class="field">
              <label>{{ t("optionCount") }}</label>
              <select v-model.number="settings.optionCount" @change="reset(true)">
                <option :value="3">3</option>
                <option :value="4">4</option>
                <option :value="5">5</option>
                <option :value="6">6</option>
              </select>
            </div>

            <div class="field">
              <label>{{ t("normalization") }}</label>
              <select v-model="settings.normalize" @change="reset(false)">
                <option value="strict">{{ t("normStrict") }}</option>
                <option value="basic">{{ t("normBasic") }}</option>
                <option value="punct">{{ t("normPunct") }}</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Mode Selector -->
        <div class="settings-section settings-mode-selector">
          <h3 class="settings-section-title">{{ t("mode") }}</h3>
          <div style="padding: 0 15px;">
            <select v-model="settings.mode" @change="reset(true)" style="width: 100%;">
              <option value="nextLine">{{ t("modeNextLine") }}</option>
              <option value="cloze">{{ t("modeCloze") }}</option>
              <option value="type">{{ t("modeType") }}</option>
              <option value="vocabulary">{{ t("modeVocabulary") }}</option>
            </select>
          </div>
        </div>

        <!-- Mode-Specific Settings -->
        <div class="settings-section settings-mode">
          <h3 class="settings-section-title">{{ t("modeSettings") }}</h3>
          <div class="settings-grid">
            <div class="field" v-if="settings.mode === 'nextLine'">
              <label>{{ t("nextLineInput") }}</label>
              <select v-model="settings.nextLineInput" @change="reset(false)">
                <option value="choice">{{ t("inputChoice") }}</option>
                <option value="type">{{ t("inputType") }}</option>
              </select>
            </div>

            <div class="field" v-if="settings.mode === 'cloze'">
              <label>{{ t("clozeStartMissing") }}</label>
              <input type="number" min="1" :max="12" v-model.number="settings.clozeStartMissing" @change="reset(true)" />
            </div>

            <div class="field" v-if="settings.mode === 'cloze'">
              <label>{{ t("clozeMaxMissing") }}</label>
              <input type="number" min="1" :max="16" v-model.number="settings.clozeMaxMissing" @change="reset(true)" />
            </div>

            <div class="field" v-if="settings.mode === 'cloze'">
              <label>{{ t("clozeProgression") }}</label>
              <select v-model="settings.clozeProgression" @change="reset(true)">
                <option value="on">{{ t("on") }}</option>
                <option value="off">{{ t("off") }}</option>
              </select>
            </div>

            <div class="field" v-if="settings.mode === 'cloze'">
              <label>{{ t("clozeInput") }}</label>
              <select v-model="settings.clozeInput" @change="reset(true)">
                <option value="choice">{{ t("inputChoice") }}</option>
                <option value="type">{{ t("inputType") }}</option>
              </select>
            </div>

            <div class="field" v-if="settings.mode === 'cloze' && settings.clozeInput === 'choice'">
              <label>{{ t("showClozeTarget") }}</label>
              <select v-model="settings.showClozeTarget" @change="reset(false)">
                <option value="off">{{ t("off") }}</option>
                <option value="on">{{ t("on") }}</option>
              </select>
            </div>

            <div class="field" v-if="settings.mode === 'type'">
              <label>{{ t("typeMode") }}</label>
              <select v-model="settings.typeTarget" @change="reset(true)">
                <option value="nextLine">{{ t("typeNextLine") }}</option>
                <option value="currentLine">{{ t("typeCurrentLine") }}</option>
              </select>
            </div>

            <div class="field" v-if="settings.mode === 'type' && settings.typeTarget === 'currentLine'">
              <label>{{ t("showHintLine") }}</label>
              <select v-model="settings.showHintLine" @change="reset(true)">
                <option value="on">{{ t("on") }}</option>
                <option value="off">{{ t("off") }}</option>
              </select>
            </div>

            <div class="field" v-if="!['nextLine', 'cloze', 'type'].includes(settings.mode)">
              <p class="small" style="margin: 0; font-style: italic;">{{ t("noModeSettings") }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useSongs } from "../../composables/useSongs";
import { useSettings } from "../../composables/useSettings";
import { useI18n } from "../../composables/useI18n";

const emit = defineEmits<{ (e: "reset-round", newQuestion: boolean): void }>();
const reset = (newQuestion: boolean) => emit("reset-round", newQuestion);

const { currentSong } = useSongs();
const { settings } = useSettings();
const { t } = useI18n(() => settings.uiLang as "en" | "es");
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

.settings-section {
  margin-bottom: 25px;
  padding: 15px;
  background: #fafafa;
  border-radius: 8px;
}

.settings-section-title {
  margin: 0 0 15px 0;
  font-size: 16px;
  color: #333;
  font-weight: 600;
}

.settings-grid {
  display: grid;
  gap: 15px;
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .settings-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.field {
  display: flex;
  flex-direction: column;
}

.field > label {
  font-weight: 500;
  font-size: 13px;
  margin-bottom: 6px;
  color: #555;
}

.field > input,
.field > select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 13px;
  background: white;
}

.field > input:focus,
.field > select:focus {
  outline: none;
  border-color: #1976d2;
  box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.1);
}

.small {
  font-size: 12px;
  color: #999;
  margin-top: 8px;
}
</style>
