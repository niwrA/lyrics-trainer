<template>
  <section class="about">
    <div class="card-body">
      <h2 class="about-title">{{ t("aboutTitle") }}</h2>
      <p class="about-p">{{ t("aboutP1") }}</p>
      <p class="about-p">{{ t("aboutP2") }}</p>
      <p class="about-p">{{ t("aboutP3") }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from "../../composables/useI18n";
import { useSettings } from "../../composables/useSettings";

const { settings } = useSettings();
const { t } = useI18n(() => settings.uiLang as "en" | "es");
</script>

<style scoped>
.about {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.card-body {
  padding: 20px;
}

.about-title {
  margin: 0 0 20px 0;
  font-size: 24px;
  color: #333;
}

.about-p {
  line-height: 1.8;
  color: #666;
  margin-bottom: 16px;
}

.about-p:last-child {
  margin-bottom: 0;
}
</style>
