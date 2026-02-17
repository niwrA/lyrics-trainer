/**
 * useSettings - Settings management composable
 * Handles exercise settings persistence and reactive updates
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

export function useSettings() {
  // Create reactive settings object
  const settings = reactive<Settings>({ ...defaultSettings });

  // Load settings from localStorage
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

  // Save settings to localStorage
  function persistSettings(): void {
    localStorage.setItem(LS_SETTINGS, JSON.stringify(settings));
  }

  // Reset to defaults
  function resetToDefaults(): void {
    Object.assign(settings, defaultSettings);
    persistSettings();
  }

  // Update a single setting
  function updateSetting<K extends keyof Settings>(
    key: K,
    value: Settings[K]
  ): void {
    settings[key] = value;
  }

  // Update multiple settings at once
  function updateSettings(updates: Partial<Settings>): void {
    Object.assign(settings, updates);
  }

  // Watch for changes and persist
  watch(settings, () => persistSettings(), { deep: true });

  // Return public API
  return {
    settings,
    loadSettings,
    persistSettings,
    resetToDefaults,
    updateSetting,
    updateSettings,
  };
}
