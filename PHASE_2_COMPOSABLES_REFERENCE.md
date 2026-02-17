# Phase 2 Quick Reference: Composables

## Import All Composables

```typescript
import { useSongs } from '@/composables/useSongs';
import { useSettings } from '@/composables/useSettings';
import { useTraining } from '@/composables/useTraining';
import { useCloze } from '@/composables/useCloze';
import { useI18n } from '@/composables/useI18n';
```

---

## useSongs() - Song Management

### Basic Usage
```typescript
const {
  songSets,        // Ref<SongSet[]>
  currentSetId,    // Ref<string | null>
  currentSongId,   // Ref<string | null>
  songs,           // ComputedRef<Song[]>
  currentSong,     // ComputedRef<Song | null>
  addSong,
  deleteSongById,
  updateSong,
  selectSong,
  createNewSet,
  deleteCurrentSet,
  renameCurrentSet,
  importSongsJson,
  exportSongsJson,
  addSongFromPaste,
  loadSongs,
} = useSongs();
```

### Common Operations
```typescript
// Load from localStorage (call once on app mount)
loadSongs();

// Create a new set
createNewSet('My Songs');

// Add a song
const song: Song = {
  id: cryptoRandomId(),
  title: 'Song Title',
  artist: 'Artist',
  album: 'Album',
  lines: ['Line 1', 'Line 2'],
  createdAt: new Date().toISOString(),
};
addSong(song);

// Select a song
selectSong(songs.value[0].id);

// Update a song
updateSong(currentSong.value.id, {
  title: 'New Title',
  vocabulary: [...]
});

// Delete a song
deleteSongById(songId);

// Add song from paste form
addSongFromPaste(title, artist, album, lyricsText);

// Import from JSON
const importedCount = importSongsJson(jsonString);

// Export all
const jsonStr = exportSongsJson();
```

---

## useSettings() - Settings Management

### Basic Usage
```typescript
const {
  settings,           // Reactive<Settings>
  loadSettings,
  updateSetting,
  updateSettings,
  resetToDefaults,
} = useSettings();
```

### Settings Object
```typescript
settings = {
  uiLang: "en" | "es",
  mode: "nextLine" | "cloze" | "type" | "vocabulary",
  order: "sequence" | "random",
  optionCount: 3 | 4 | 5 | 6,
  nextLineInput: "choice" | "type",
  clozeStartMissing: number (1-12),
  clozeMaxMissing: number (1-16),
  clozeProgression: "on" | "off",
  clozeInput: "choice" | "type",
  showClozeTarget: "on" | "off",
  typeTarget: "nextLine" | "currentLine",
  normalize: "strict" | "basic" | "punct",
  showHintLine: "on" | "off",
}
```

### Common Operations
```typescript
// Load from localStorage (call once on app mount)
loadSettings();

// Update single setting
updateSetting('mode', 'cloze');

// Update multiple settings
updateSettings({
  mode: 'type',
  optionCount: 5,
  normalize: 'punct'
});

// Reset to defaults
resetToDefaults();

// Access settings
console.log(settings.mode);      // Current mode
console.log(settings.optionCount); // Number of choices
```

### Reactive Usage
```typescript
// Settings are reactive - use in templates directly
<select v-model="settings.mode">
  <option value="nextLine">Next Line</option>
  <option value="cloze">Cloze</option>
  <option value="type">Type</option>
  <option value="vocabulary">Vocabulary</option>
</select>

// Or track changes
watch(() => settings.mode, (newMode) => {
  console.log('Mode changed to:', newMode);
  resetRound(true); // Reset training round
});
```

---

## useTraining() - Training Session

### Initialization
```typescript
const training = useTraining(currentSong.value, settings);

const {
  // Statistics
  stats,                    // { correct: number, total: number }
  
  // Current Round
  currentIndex,             // Current line index
  promptLine,              // Current line to read
  answerLine,              // Expected next/current line
  roundLocked,             // User can't submit during lock
  revealAnswer,            // Show correct answer
  typedInput,              // User typed text
  showContinue,            // Show continue button
  feedback,                // { ok, message, details }
  
  // MCQ
  mcqChoices,              // Choice[] for MCQ
  
  // Cloze
  clozeTokens,             // ClozeToken[]
  activeBlankIndex,        // Which blank selected
  clozeChoices,            // Word options for blank
  clozeMissingCount,       // Number of blanks
  clozeBlanks,             // Only the blank tokens
  
  // Vocabulary
  vocabIndex,              // Current vocab index
  vocabChoices,            // Meaning options
  
  // Methods
  resetRound,
  resetSession,
  submitChoice,
  submitTypedNextLine,
  submitTypedType,
  isBlankFilled,
  selectBlankByToken,
} = training;
```

### Common Operations
```typescript
// Initialize round
resetRound(true);

// Handle answer submission
submitChoice(userAnswer);        // For MCQ
submitTypedNextLine();           // For type-next-line
submitTypedType();               // For type-full-line

// Track statistics
console.log(stats.correct, stats.total); // e.g., 3, 5

// Check current line
console.log(promptLine.value);   // What user sees
console.log(answerLine.value);   // Expected answer

// Check feedback
if (feedback.ok) {
  console.log(feedback.message);     // "Correct!"
  console.log(feedback.details);     // Explanation if any
}

// Handle user errors
if (showContinue.value) {
  // Show continue button
}
```

---

## useCloze() - Cloze Exercise Logic

### Initialization
```typescript
const { 
  buildClozeTokens,
  buildClozeChoices,
  compareClozeMissing,
} = useCloze();
```

### Building Cloze Exercise
```typescript
// Build tokens and blanks
const line = "The quick brown fox jumps over the lazy dog";
const { tokens, blanks } = buildClozeTokens(line, 3);

// tokens = [
//   { type: 'text', value: 'The ' },
//   { type: 'blank', correct: 'quick', filled: null },
//   { type: 'text', value: ' ' },
//   ...
// ]

// blanks = [
//   { type: 'blank', correct: 'quick', filled: null },
//   { type: 'blank', correct: 'brown', filled: null },
//   { type: 'blank', correct: 'fox', filled: null },
// ]

// Build word corpus for choices
const corpus = buildWordCorpus(song.lines);

// Build choices for each blank
const choices = buildClozeChoices('quick', corpus, 4);
// choices = ['quick', 'brown', 'slow', 'swift'] (shuffled)

// Compare user submission
const userTyped = "quick brown fox";
const correct = ['quick', 'brown', 'fox'];
const isCorrect = compareClozeMissing(userTyped, correct); // true
```

### In Training Loop
```typescript
// Part of useTraining
const { clozeTokens, clozeBlanks, clozeChoices } = useTraining(...);

// Render tokens
<span v-for="token in clozeTokens" :key="token">
  <span v-if="token.type === 'text'">{{ token.value }}</span>
  <button v-else>{{ token.filled ?? '____' }}</button>
</span>

// Display choices
<button v-for="choice in clozeChoices" @click="submitClozeChoice(choice)">
  {{ choice }}
</button>
```

---

## useI18n() - Translations

### Initialization
```typescript
const { t } = useI18n(settings.uiLang);
```

### Usage
```typescript
// Simple translation
<h1>{{ t('appTitle') }}</h1>
// Output: "Lyrics Trainer"

// With parameters
<p>{{ t('linesCount', { n: 5 }) }}</p>
// Output: "5 lines"

// In JavaScript
const message = t('songAdded');
console.log(message); // "Song added."
```

---

## Complete Component Example

```vue
<template>
  <div class="song-trainer">
    <h1>{{ t('training') }}</h1>
    
    <!-- Song Info -->
    <div v-if="currentSong" class="song-header">
      <div>{{ currentSong.title }}</div>
      <div class="meta">{{ currentSong.artist }}</div>
    </div>

    <!-- Mode Selector -->
    <select v-model="settings.mode" @change="resetRound(true)">
      <option value="nextLine">{{ t('modeNextLine') }}</option>
      <option value="cloze">{{ t('modeCloze') }}</option>
      <option value="type">{{ t('modeType') }}</option>
      <option value="vocabulary">{{ t('modeVocabulary') }}</option>
    </select>

    <!-- Prompt -->
    <div class="prompt">
      <div class="label">{{ t('prompt') }}</div>
      <div class="line">{{ promptLine }}</div>
    </div>

    <!-- Answer Choices -->
    <div v-if="settings.mode === 'nextLine'" class="choices">
      <button
        v-for="choice in mcqChoices"
        :key="choice.key"
        @click="submitChoice(choice.text)"
        :disabled="roundLocked"
      >
        {{ choice.text }}
      </button>
    </div>

    <!-- Feedback -->
    <div v-if="feedback.message" class="feedback" :class="feedback.ok ? 'ok' : 'bad'">
      <div>{{ feedback.message }}</div>
      <div v-if="feedback.details" class="details">{{ feedback.details }}</div>
    </div>

    <!-- Statistics -->
    <div class="stats">
      <div>{{ t('statsScore') }}: {{ stats.correct }} / {{ stats.total }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useSongs } from '@/composables/useSongs';
import { useSettings } from '@/composables/useSettings';
import { useTraining } from '@/composables/useTraining';
import { useI18n } from '@/composables/useI18n';

// Load data
const songs = useSongs();
const settings = useSettings();

onMounted(() => {
  songs.loadSongs();
  settings.loadSettings();
});

// Get i18n
const i18n = useI18n(settings.settings.uiLang);
const { t } = i18n;

// Initialize training
const training = useTraining(
  songs.currentSong,
  settings.settings
);

const {
  stats,
  promptLine,
  feedback,
  roundLocked,
  mcqChoices,
  submitChoice,
  resetRound,
} = training;

// Export for template
const currentSong = songs.currentSong;
</script>

<style scoped>
.song-trainer {
  padding: 20px;
}

.prompt {
  margin: 20px 0;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 8px;
}

.choices {
  display: grid;
  gap: 10px;
  margin: 20px 0;
}

.choices button {
  padding: 10px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
}

.choices button:hover:not(:disabled) {
  background: #f0f0f0;
}

.feedback {
  padding: 10px;
  border-radius: 8px;
  margin: 10px 0;
}

.feedback.ok {
  background: #e8f5e9;
  border: 1px solid #4caf50;
  color: #2e7d32;
}

.feedback.bad {
  background: #ffebee;
  border: 1px solid #f44336;
  color: #c62828;
}

.stats {
  margin-top: 20px;
  font-weight: bold;
}
</style>
```

---

## Testing Composables

```typescript
import { describe, it, expect } from 'vitest';
import { useSongs } from '@/composables/useSongs';
import { useSettings } from '@/composables/useSettings';

describe('useSongs', () => {
  it('should add a song', () => {
    const { songs, addSong } = useSongs();
    
    const newSong = {
      id: '1',
      title: 'Test',
      lines: ['Line 1', 'Line 2']
    };
    
    addSong(newSong);
    expect(songs.value).toContain(newSong);
  });
});

describe('useSettings', () => {
  it('should update setting', () => {
    const { settings, updateSetting } = useSettings();
    
    updateSetting('mode', 'cloze');
    expect(settings.mode).toBe('cloze');
  });
});
```

---

**Phase 2 Complete! Ready for Phase 3 components.** 🚀
