# Phase 4 Implementation Plan: Trainer Mode Components

## Overview
Phase 4 will extract the inline trainer mode logic from `TrainTab.vue` into four separate, reusable components in `src/components/trainer/`. This improves maintainability, testability, and allows for future mode-specific enhancements.

## Phase 4 Deliverables

### Files to Create
```
src/components/trainer/
├── NextLineMode.vue      (~200 lines) - Multiple choice & typing for next line
├── ClozeMode.vue         (~250 lines) - Fill-in-the-blank exercises
├── TypeMode.vue          (~150 lines) - Type the entire line
├── VocabularyMode.vue    (~200 lines) - Word meaning selections
└── TrainerShell.vue      (~100 lines) - Common layout & header
```

**Total**: ~900 lines across 5 new files

### Architecture Changes

#### Current (TrainTab contains all 4 modes inline)
```
TrainTab.vue
├── Header & Mode Selector (shared)
├── Prompt/Answer Display (shared)
├── NextLine Mode (inline)
├── Cloze Mode (inline)
├── Type Mode (inline)
├── Vocabulary Mode (inline)
├── Statistics (shared)
└── Feedback (shared)
```

#### After Phase 4 (Modes extracted to components)
```
TrainTab.vue (refactored to ~100 lines shell)
├── Header & Mode Selector (kept)
├── TrainerShell.vue (new shared layout)
│   ├── Prompt/Answer Display
│   ├── Mode Router (switches based on settings.mode)
│   │   ├── NextLineMode.vue
│   │   ├── ClozeMode.vue
│   │   ├── TypeMode.vue
│   │   └── VocabularyMode.vue
│   ├── Statistics (moved)
│   └── Feedback (moved)
```

## Component Specifications

### NextLineMode.vue
**Purpose**: Handle MCQ and typing for predicting the next line

**Props**:
```typescript
- training: ReturnType<typeof useTraining> (required)
- settings: any (required)
```

**Features**:
- Display MCQ choices when `settings.nextLineInput === 'choice'`
- Display text input + submit button when `settings.nextLineInput === 'type'`
- CSS classes: `.choice`, `.choice.correct`, `.choice.incorrect`
- CSS classes: `.row`, `.row > input`, `.btn`, `.btn.primary`

**Uses**: `choiceClassText()`, `submitChoice()`, `submitTypedNextLine()`

---

### ClozeMode.vue
**Purpose**: Handle fill-in-the-blank exercises with multiple input methods

**Props**:
```typescript
- training: ReturnType<typeof useTraining> (required)
- settings: any (required)
- t: (key: string) => string (i18n function)
```

**Features**:
- Render cloze tokens with clickable blanks
- Support choice-based input (select from word options)
- Support typing-based input (type missing word)
- Show target word helper when enabled
- Track active blank selection

**Uses**: `clozeTokens`, `activeBlankIndex`, `clozeChoices`, `clozeBlanks`, `findBlankIndexByToken()`, `selectBlankByToken()`, `submitClozeChoice()`, `submitTypedCloze()`, `isBlankFilled()`

---

### TypeMode.vue
**Purpose**: Type entire song lines (current or next line based on settings)

**Props**:
```typescript
- training: ReturnType<typeof useTraining> (required)
- settings: any (required)
- t: (key: string) => string (i18n function)
```

**Features**:
- Display prompt based on `settings.typeTarget`
- Show optional hint line based on `settings.showHintLine`
- Text input + submit button
- Enter key support for submission

**Uses**: `promptLine`, `typedInput`, `roundLocked`, `submitTypedType()`

---

### VocabularyMode.vue
**Purpose**: Test understanding of song vocabulary words and their meanings

**Props**:
```typescript
- training: ReturnType<typeof useTraining> (required)
- settings: any (required)
- currentSong: Song | null (required)
- t: (key: string) => string (i18n function)
```

**Features**:
- Display current vocabulary word
- Show multiple choice options for meanings
- Handle no vocabulary case (empty state)
- Track vocabulary index progression

**Uses**: `currentWord`, `vocabChoices`, `roundLocked`, `submitVocabularyChoice()`

---

### TrainerShell.vue
**Purpose**: Common layout container for all trainer modes

**Props**:
```typescript
- currentSong: Song | null (required)
- settings: any (required)
- training: ReturnType<typeof useTraining> | null (required)
- t: (key: string) => string (i18n function)
```

**Template Structure**:
```
<div class="trainer">
  <!-- Song Header -->
  <!-- Prompt Line -->
  <!-- Answer Line (revealed) -->
  <!-- Mode Router (component slot based on mode) -->
  <!-- Continue/Try Again Buttons -->
  <!-- Feedback -->
  <!-- Statistics -->
</div>
```

---

## Integration Plan

### Step 1: Create TrainerShell.vue
- Extract shared layout elements from TrainTab
- Accept current mode from training state
- Use dynamic component rendering

### Step 2: Create Individual Mode Components
- NextLineMode.vue
- ClozeMode.vue  
- TypeMode.vue
- VocabularyMode.vue

### Step 3: Refactor TrainTab.vue
- Remove inline mode templates
- Replace with `<TrainerShell />` component
- Keep mode selector and header
- Simplify to ~100 lines

### Step 4: Test Integration
- Verify all modes work correctly
- Check that styles still apply
- Ensure trainer methods are accessible
- Validate computed properties work

## Implementation Order

1. **Create TrainerShell.vue** (base layout)
2. **Create NextLineMode.vue** (simplest mode)
3. **Create TypeMode.vue** (straightforward mode)
4. **Create ClozeMode.vue** (most complex)
5. **Create VocabularyMode.vue** (vocabulary-specific)
6. **Refactor TrainTab.vue** (integrate all)
7. **Test and verify** (all modes functional)

## Benefits

✅ **Code Organization**: Each mode is isolated
✅ **Reusability**: Modes can be imported elsewhere
✅ **Testability**: Each component can be tested independently
✅ **Maintainability**: Changes to one mode don't affect others
✅ **Scalability**: Easy to add new modes in future
✅ **Performance**: Future opportunity for lazy-loading modes

## Timeline

- **NextLineMode.vue**: 30 minutes
- **TypeMode.vue**: 25 minutes
- **ClozeMode.vue**: 45 minutes
- **VocabularyMode.vue**: 30 minutes
- **TrainerShell.vue**: 20 minutes
- **TrainTab.vue refactor**: 30 minutes
- **Testing**: 20 minutes

**Total: ~3 hours**

## Success Criteria

✅ All 5 new components created
✅ Zero TypeScript errors
✅ Build passes successfully
✅ All 4 trainer modes functional
✅ No styling regressions
✅ TrainTab.vue reduced to ~100 lines
✅ All methods properly bound
✅ Computed properties working correctly
