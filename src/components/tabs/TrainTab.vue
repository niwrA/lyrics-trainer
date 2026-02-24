<template>
  <section class="card">
    <div class="card-body">
      <div v-if="!currentSong" class="empty">{{ t("chooseSongFirst") }}</div>

      <div v-else>
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

        <!-- Trainer Shell with mode components -->
        <TrainerShell
          :current-song="currentSong"
          :settings="settings"
          :training="training"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useSongs } from "../../composables/useSongs";
import { useSettings } from "../../composables/useSettings";
import { useTraining } from "../../composables/useTraining";
import { useI18n } from "../../composables/useI18n";
import TrainerShell from "../trainer/TrainerShell.vue";

// Composables
const { settings, loadSettings } = useSettings();
const { t } = useI18n(() => settings.uiLang as "en" | "es");
const songs = useSongs();

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

// Helper function to reset round (bound to training if available)
const resetRound = (resetIndex: boolean) => training.value?.resetRound(resetIndex);
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

.training-mode-selector {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 20px;
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
</style>
