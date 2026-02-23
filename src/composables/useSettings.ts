/**
 * useSettings - Settings management composable
 * Handles exercise settings persistence and reactive updates
 * Module-level singleton state shared across all callers.
 */

import { reactive, watch } from "vue";
import type { Settings } from "../types";
import { LS_SETTINGS } from "../utils/storage";

const defaultSettings: Settings = {
  uiLang: "en",
  mode: "nextLine",
  order: "sequence",
  optionCount: 4,
  nextLineInput: "choice",
  clozeStartMissing: 1,
  clozeMaxMissing: 6,
  clozeProgression: "on",
  clozeInput: "choice",
  showClozeTarget: "off",
  typeTarget: "nextLine",
  normalize: "basic",
  showHintLine: "on",
};

// --- Singleton state (shared across all useSettings() calls) ---
const settings = reactive<Settings>({ ...defaultSettings });
// ---------------------------------------------------------------

export function useSettings() {
  function loadSettings(): void {
    const raw = localStorage.getItem(LS_SETTINGS);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as Partial<Settings>;
      Object.assign(settings, parsed);
    } catch {
      // Ignore parse errors, keep defaults
    }
  }

  function persistSettings(): void {
    localStorage.setItem(LS_SETTINGS, JSON.stringify(settings));
  }

  function resetToDefaults(): void {
    Object.assign(settings, defaultSettings);
    persistSettings();
  }

  function updateSetting<K extends keyof Settings>(
    key: K,
    value: Settings[K]
  ): void {
    settings[key] = value;
  }

  function updateSettings(updates: Partial<Settings>): void {
    Object.assign(settings, updates);
  }

  // Watch must be called inside a component setup (not at module level)
  // so it runs within an active Vue app instance.
  function watchAndPersist(): void {
    watch(settings, () => persistSettings(), { deep: true });
  }

  return {
    settings,
    loadSettings,
    persistSettings,
    resetToDefaults,
    updateSetting,
    updateSettings,
    watchAndPersist,
  };
}
