# App.vue Refactoring Guide

## Overview

The monolithic `App.vue` file (4027 lines) has been refactored into a modular, maintainable structure organized by features and concerns.

## Directory Structure

```
src/
├── components/
│   ├── modals/
│   │   ├── OnboardingModal.vue      # Help & Getting Started modal
│   │   ├── EditSongModal.vue         # Song editor (raw JSON + visual)
│   │   └── [More modals as needed]
│   ├── tabs/
│   │   ├── SongsTab.vue              # Library, paste, and JSON import
│   │   ├── TrainTab.vue              # Training interface
│   │   ├── SettingsTab.vue           # Exercise settings
│   │   └── AboutTab.vue              # About section
│   ├── trainer/
│   │   ├── NextLineMode.vue          # Next-line exercise
│   │   ├── ClozeMode.vue             # Fill-blanks exercise
│   │   ├── TypeMode.vue              # Typing exercise
│   │   ├── VocabularyMode.vue        # Vocabulary practice
│   │   └── TrainerStats.vue          # Score display
│   └── common/
│       ├── Topbar.vue                # Header with tabs
│       ├── SongList.vue              # Song library list
│       └── [Reusable components]
│
├── composables/
│   ├── useI18n.ts                    # Internationalization
│   ├── useSongs.ts                   # Song management (CRUD)
│   ├── useSettings.ts                # Settings persistence
│   ├── useTraining.ts                # Training logic
│   ├── useCloze.ts                   # Cloze-specific logic
│   └── [More composables as needed]
│
├── types/
│   └── index.ts                      # All TypeScript type definitions
│
├── utils/
│   ├── storage.ts                    # localStorage constants
│   ├── text.ts                       # Text normalization, comparison
│   ├── math.ts                       # Math utilities, shuffle, random
│   ├── export.ts                     # File export utilities
│   ├── sanitize.ts                   # Data validation & sanitization
│   └── seed.ts                       # Default song data
│
├── App.vue                           # Main app shell (refactored)
└── main.js
```

## Key Benefits

### 1. **Separation of Concerns**
   - **Components** handle UI only
   - **Composables** handle logic and state
   - **Utils** handle pure functions
   - **Types** define data structures

### 2. **Reusability**
   - Composables can be used in multiple components
   - Utilities are framework-agnostic
   - Components follow single-responsibility principle

### 3. **Testability**
   - Pure functions (utils) are easy to unit test
   - Composables can be tested in isolation
   - Components are simpler and easier to test

### 4. **Maintainability**
   - Each file is focused and smaller (~100-300 lines)
   - Related code is grouped together
   - Clear dependencies between modules

### 5. **Scalability**
   - Easy to add new modes, features, or tabs
   - Code duplication is minimized
   - Changes are localized to specific files

## Migration Path

### Phase 1: Extract Utilities & Types ✅
- ✅ Created `src/types/index.ts` with all types
- ✅ Created `src/utils/` folder with:
  - `text.ts` - Text normalization
  - `math.ts` - Math & shuffle utilities
  - `export.ts` - Download functionality
  - `sanitize.ts` - Data validation
  - `storage.ts` - localStorage keys

### Phase 2: Extract Composables
- Create `useSongs.ts` - Song CRUD operations
- Create `useSettings.ts` - Settings persistence
- Create `useTraining.ts` - Training state & logic
- Create `useCloze.ts` - Cloze exercise logic
- Create `useI18n.ts` - Already created ✅

### Phase 3: Extract Components
- Extract **modals**: `OnboardingModal.vue`, `EditSongModal.vue`
- Extract **tabs**: `SongsTab.vue`, `TrainTab.vue`, `SettingsTab.vue`, `AboutTab.vue`
- Extract **trainer modes**: `NextLineMode.vue`, `ClozeMode.vue`, `TypeMode.vue`, `VocabularyMode.vue`
- Extract **common**: `Topbar.vue`, `SongList.vue`

### Phase 4: Refactor Main App.vue
- Import components and composables
- Use simplified setup script
- Keep routing/tab logic simple

## Usage Examples

### Using a Composable
```typescript
import { useSongs } from '@/composables/useSongs';

const { songs, addSong, deleteSong } = useSongs();
```

### Using a Utility
```typescript
import { normalizeForCompare, compareText } from '@/utils/text';
import { shuffle, clamp } from '@/utils/math';

const normalized = normalizeForCompare(userInput, 'punct');
const shuffled = shuffle(array);
```

### Importing Types
```typescript
import type { Song, Settings, Mode } from '@/types';

const mySong: Song = {
  id: 'abc123',
  title: 'My Song',
  lines: ['Line 1', 'Line 2']
};
```

## Next Steps

1. **Complete composables** - Extract remaining logic into composables
2. **Extract components** - Move template sections into separate Vue files
3. **Test** - Add unit tests for utils and composables
4. **Performance** - Consider code-splitting lazy-loaded tabs
5. **Documentation** - Add JSDoc comments to complex functions

## File Size Comparison

| File | Before | After |
|------|--------|-------|
| App.vue | 4027 lines | ~500 lines (shell only) |
| utils/ | - | ~400 lines total |
| composables/ | - | ~1000 lines total |
| components/ | - | ~2000 lines total |

**Result**: More modular, testable, and maintainable codebase!
