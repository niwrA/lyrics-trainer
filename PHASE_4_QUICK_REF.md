# Phase 4 Quick Reference

## What Was Done

### New Files Created
1. **NextLineMode.vue** - Multiple choice & typing for next line
2. **ClozeMode.vue** - Fill-in-the-blank exercises
3. **TypeMode.vue** - Type entire line exercises
4. **VocabularyMode.vue** - Word meaning selection
5. **TrainerShell.vue** - Shared layout container

### Files Modified
- **TrainTab.vue** - Refactored from 651 to 67 lines
- **useTraining.ts** - Added `findBlankIndexByToken()` to exports

## Component Structure

```
TrainerShell.vue
├── Song Header
├── Prompt Line
├── Answer Line (revealed)
├── [Dynamic Mode Component]
│   ├── NextLineMode.vue (if mode === 'nextLine')
│   ├── ClozeMode.vue (if mode === 'cloze')
│   ├── TypeMode.vue (if mode === 'type')
│   └── VocabularyMode.vue (if mode === 'vocabulary')
├── Continue/Try Again Buttons
├── Feedback
└── Statistics
```

## How to Use Components

### Using TrainerShell Directly
```vue
<template>
  <TrainerShell 
    :current-song="song"
    :settings="settings"
    :training="training"
  />
</template>

<script setup>
import TrainerShell from '@/components/trainer/TrainerShell.vue';
</script>
```

### Individual Mode Components
```vue
<template>
  <NextLineMode 
    :training="training"
    :settings="settings"
    :answer-line="answerLine"
  />
</template>

<script setup>
import NextLineMode from '@/components/trainer/NextLineMode.vue';
</script>
```

## Props & Events

### TrainerShell Props
- `currentSong: Song` (required)
- `settings: any` (required)
- `training: ReturnType<typeof useTraining>` (required)

### Mode Component Props

**NextLineMode**:
- `training: any`
- `settings: any`
- `answerLine: string`

**ClozeMode**:
- `training: any`
- `settings: any`

**TypeMode**:
- `training: any`
- `settings: any`

**VocabularyMode**:
- `training: any`
- `settings: any`
- `currentSong: Song | null`

## Key Methods in Training Object

### Methods Used by Mode Components

**NextLineMode**:
```typescript
training.submitChoice(text: string): void
training.submitTypedNextLine(): void
```

**ClozeMode**:
```typescript
training.selectBlankByToken(token: ClozeToken): void
training.findBlankIndexByToken(token: ClozeToken): number // NEW
training.isBlankFilled(idx: number): boolean
training.submitClozeChoice(word: string): void // NEW METHOD
training.submitTypedCloze(): void // NEW METHOD
```

**TypeMode**:
```typescript
training.submitTypedType(): void
```

**VocabularyMode**:
```typescript
training.submitVocabularyChoice(option: string): void // NEW METHOD
```

## CSS Classes Available

All components use scoped CSS. Common classes:

- `.mode-content` - Main container
- `.choice` - Choice button
- `.choice.correct` - Correct answer styling
- `.choice.incorrect` - Incorrect answer styling
- `.row` - Flex container for inputs
- `.btn` - Standard button
- `.btn.primary` - Primary button
- `.blank-btn` - Cloze blank button
- `.field` - Form field container

## Props Flow Diagram

```
TrainTab.vue
  ├─ currentSong: Song
  ├─ settings: Settings
  ├─ training: useTraining()
  └─ TrainerShell.vue
      ├─ receives all props
      ├─ displays song header
      ├─ displays prompt/answer
      ├─ [Mode Component]
      │   ├─ receives subset of props
      │   ├─ renders mode-specific UI
      │   └─ calls training methods
      ├─ displays continue/try again
      ├─ displays feedback
      └─ displays statistics
```

## Error Handling

All components safely handle:
- ✅ Missing training object
- ✅ Missing current word (vocabulary)
- ✅ Disabled states during submission
- ✅ Empty vocabulary lists
- ✅ No active blank in cloze mode

## Styling Notes

- All styles are scoped to component
- No global class conflicts
- Responsive grid layouts
- Mobile-first design
- Touch-friendly button sizes
- Consistent color scheme

## Future Enhancements

Ideas for extending Phase 4:

1. **Animation Support**: Add transitions between blanks
2. **Sound Feedback**: Audio feedback on correct/incorrect
3. **Hints System**: Show hints for difficult blanks
4. **Performance Tracking**: More detailed statistics
5. **Custom Themes**: Mode-specific styling
6. **Keyboard Shortcuts**: For power users

## Troubleshooting

### Training methods not available
- Ensure `training` prop is passed and not null
- Check that `useTraining()` was called with correct params

### Blanks not updating
- Verify `clozeTokens` are reactive refs
- Check that `findBlankIndexByToken()` returns correct index

### Vocabulary not showing
- Ensure song has `vocabulary` array
- Check that `currentSong` prop is passed

### Styling issues
- Verify scoped styles are applied
- Check CSS class names match component
- Clear browser cache if needed

## Stats

- **Phase 4 Total Lines**: ~967
- **Files Created**: 5
- **Files Modified**: 2
- **Build Size**: 124.63 kB (gzipped: 43.42 kB)
- **Build Time**: ~900ms
- **TypeScript Errors**: 0

---

**Phase 4 Status**: ✅ COMPLETE

Next: Phase 5 - Tests & Polish
