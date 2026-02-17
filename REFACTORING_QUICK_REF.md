# Quick Reference: Refactored App Structure

## File Organization

```
src/
├── types/
│   └── index.ts              ← All TypeScript definitions
├── utils/
│   ├── text.ts               ← Normalize, compare, extract words
│   ├── math.ts               ← shuffle, clamp, random
│   ├── sanitize.ts           ← Validate/sanitize data
│   ├── export.ts             ← Download files
│   ├── storage.ts            ← localStorage keys
│   └── seed.ts               ← Default song data
├── composables/
│   ├── useI18n.ts            ← ✅ i18n with t() function
│   ├── useSongs.ts           ← 🔲 Song management (todo)
│   ├── useSettings.ts        ← 🔲 Settings persistence (todo)
│   ├── useTraining.ts        ← 🔲 Training logic (todo)
│   └── useCloze.ts           ← 🔲 Cloze exercises (todo)
├── components/
│   ├── modals/
│   │   ├── OnboardingModal.vue      ← ✅ Help modal
│   │   └── EditSongModal.vue        ← 🔲 Song editor (todo)
│   ├── tabs/
│   │   ├── SongsTab.vue             ← 🔲 Library/paste/import (todo)
│   │   ├── TrainTab.vue             ← 🔲 Training interface (todo)
│   │   ├── SettingsTab.vue          ← 🔲 Settings (todo)
│   │   └── AboutTab.vue             ← 🔲 About (todo)
│   ├── trainer/
│   │   ├── NextLineMode.vue         ← 🔲 Next-line mode (todo)
│   │   ├── ClozeMode.vue            ← 🔲 Cloze mode (todo)
│   │   ├── TypeMode.vue             ← 🔲 Type mode (todo)
│   │   └── VocabularyMode.vue       ← 🔲 Vocabulary mode (todo)
│   └── common/
│       ├── Topbar.vue               ← 🔲 Header (todo)
│       ├── SongList.vue             ← 🔲 Song library (todo)
│       └── ...
├── App.vue                  ← Main shell (refactored)
└── main.js
```

## Usage Quick Reference

### Using Types
```typescript
import type { Song, SongSet, Settings, Mode } from '@/types';

const mySong: Song = {
  id: 'abc',
  title: 'Song Title',
  lines: ['Line 1', 'Line 2']
};
```

### Using Utilities
```typescript
// Text utilities
import { normalizeForCompare, compareText, splitIntoLines } from '@/utils/text';
const normalized = normalizeForCompare('Hello!', 'punct'); // "hello"
const same = compareText('HELLO', 'hello', 'basic'); // true

// Math utilities  
import { shuffle, clamp, randomInt, cryptoRandomId } from '@/utils/math';
const shuffled = shuffle([1,2,3]);
const clamped = clamp(5, 0, 3); // 3
const id = cryptoRandomId(); // "a1b2c3d4..."

// Validation
import { sanitizeSong, validateSongSet } from '@/utils/sanitize';
const valid = sanitizeSong(jsonData);

// Export
import { downloadText } from '@/utils/export';
downloadText(jsonString, 'songs.json', 'application/json');

// Seed data
import { seedSongs } from '@/utils/seed';
const defaultSongs = seedSongs();
```

### Using Composables
```typescript
import { useI18n } from '@/composables/useI18n';

// In setup script
const { t } = useI18n('en');
const message = t('appTitle'); // "Lyrics Trainer"
const formatted = t('linesCount', { n: 5 }); // "5 lines"
```

### Using Components
```vue
<template>
  <!-- Modals -->
  <OnboardingModal 
    :isOpen="showOnboarding" 
    :uiLang="settings.uiLang"
    @close="showOnboarding = false"
  />
  
  <!-- Tabs (use with v-if) -->
  <SongsTab v-if="appTab === 'songs'" />
  <TrainTab v-else-if="appTab === 'train'" />
  <SettingsTab v-else-if="appTab === 'settings'" />
  <AboutTab v-else-if="appTab === 'about'" />
</template>

<script setup>
import OnboardingModal from '@/components/modals/OnboardingModal.vue';
import SongsTab from '@/components/tabs/SongsTab.vue';
import TrainTab from '@/components/tabs/TrainTab.vue';
import SettingsTab from '@/components/tabs/SettingsTab.vue';
import AboutTab from '@/components/tabs/AboutTab.vue';
</script>
```

## Creating New Files

### New Utility Function
```typescript
// src/utils/newutil.ts
export function myFunction(input: string): string {
  return input.toUpperCase();
}
```

### New Composable
```typescript
// src/composables/useMyFeature.ts
import { ref, computed } from 'vue';
import type { MyType } from '../types';

export function useMyFeature() {
  const state = ref<MyType>({});
  
  const update = (value: MyType) => {
    state.value = value;
  };
  
  return {
    state: computed(() => state.value),
    update
  };
}
```

### New Component
```vue
<!-- src/components/MyComponent.vue -->
<template>
  <div class="my-component">
    <h1>{{ t('myTitle') }}</h1>
  </div>
</template>

<script setup lang="ts">
import type { Lang } from '../types';
import { useI18n } from '../composables/useI18n';

const props = defineProps<{ uiLang: Lang }>();
const { t } = useI18n(props.uiLang);
</script>

<style scoped>
/* Scoped styles */
</style>
```

## Common Patterns

### Type-safe Props & Emits
```typescript
// In script setup
const props = defineProps<{ 
  song: Song; 
  uiLang: Lang 
}>();

const emit = defineEmits<{
  select: [id: string]
  delete: [id: string]
}>();

// Use them
const handleSelect = () => emit('select', props.song.id);
```

### Reactive Form Data
```typescript
import { reactive } from 'vue';

const form = reactive({
  title: '',
  artist: '',
  lyrics: ''
});

const submit = () => {
  const song = sanitizeSong({
    ...form,
    lines: splitIntoLines(form.lyrics)
  });
};
```

### Computed with Dependencies
```typescript
import { computed } from 'vue';
import { normalizeForCompare } from '@/utils/text';

const searchResults = computed(() => {
  return songs.value.filter(s => 
    normalizeForCompare(s.title, 'basic')
      .includes(normalizeForCompare(query.value, 'basic'))
  );
});
```

## Performance Tips

1. **Use `computed()`** for derived values
2. **Use `watch()`** for side effects (persistence)
3. **Lazy-load** tabs with `defineAsyncComponent()`
4. **Memoize** expensive functions
5. **Avoid** creating functions in templates

## Testing Strategy

### Test Utilities
```typescript
import { describe, it, expect } from 'vitest';
import { normalizeForCompare, compareText } from '@/utils/text';

describe('text utilities', () => {
  it('should normalize text', () => {
    expect(normalizeForCompare('HELLO!', 'punct')).toBe('hello');
  });
});
```

### Test Composables
```typescript
import { useI18n } from '@/composables/useI18n';

describe('useI18n', () => {
  it('should translate keys', () => {
    const { t } = useI18n('en');
    expect(t('appTitle')).toBe('Lyrics Trainer');
  });
});
```

---

**Remember**: Each file has a single responsibility. Keep utilities pure, composables simple, and components focused on UI!
