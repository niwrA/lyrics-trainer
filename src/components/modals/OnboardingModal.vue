<!-- OnboardingModal.vue -->
<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="close">
    <div class="modal-card modal-card-large">
      <div class="modal-header">
        <div class="modal-header-content">
          <h2>{{ t("onboardingTitle") }}</h2>
        </div>
        <button class="close-btn" @click="close">&times;</button>
      </div>

      <div class="modal-body onboarding-content">
        <div class="onboarding-section">
          <h3>👋 {{ t("onboardingWelcome") }}</h3>
          <p>{{ t("onboardingWelcomeDesc") }}</p>
        </div>

        <div class="onboarding-section">
          <h3>🎵 {{ t("onboardingStep1") }}</h3>
          <p>{{ t("onboardingStep1Desc") }}</p>
          <ul>
            <li>{{ t("onboardingStep1a") }}</li>
            <li>{{ t("onboardingStep1b") }}</li>
            <li>{{ t("onboardingStep1c") }}</li>
          </ul>
        </div>

        <div class="onboarding-section">
          <h3>⚙️ {{ t("onboardingStep2") }}</h3>
          <p>{{ t("onboardingStep2Desc") }}</p>
          <ul>
            <li><strong>{{ t("modeNextLine") }}:</strong> {{ t("onboardingMode1") }}</li>
            <li><strong>{{ t("modeCloze") }}:</strong> {{ t("onboardingMode2") }}</li>
            <li><strong>{{ t("modeType") }}:</strong> {{ t("onboardingMode3") }}</li>
            <li><strong>{{ t("modeVocabulary") }}:</strong> {{ t("onboardingMode4") }}</li>
          </ul>
        </div>

        <div class="onboarding-section">
          <h3>💡 {{ t("onboardingTips") }}</h3>
          <ul>
            <li>{{ t("onboardingTip1") }}</li>
            <li>{{ t("onboardingTip2") }}</li>
            <li>{{ t("onboardingTip3") }}</li>
          </ul>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn primary" @click="close">{{ t("gotIt") }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Lang } from "../../types";
import { useI18n } from "../../composables/useI18n";

const props = defineProps<{
  isOpen: boolean;
  uiLang: Lang;
}>();

const emit = defineEmits<{
  close: [];
}>();

const { t } = useI18n(props.uiLang);

const close = () => emit("close");
</script>

<style scoped>
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

.onboarding-content h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
}

.onboarding-content p {
  margin: 0 0 8px 0;
  font-size: 14px;
}

.onboarding-content ul {
  margin: 8px 0 0 20px;
  padding: 0;
}

.onboarding-content li {
  margin: 4px 0;
  font-size: 14px;
}

.onboarding-section {
  margin-bottom: 16px;
}

.modal-footer {
  padding: 16px 20px;
  border-top: 1px solid #e2e2e2;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  background: #fafafa;
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

.btn.primary {
  background: #111;
  color: #fff;
  border-color: #111;
  min-width: 100px;
}

.btn.primary:hover {
  background: #1a1a1a;
}
</style>
