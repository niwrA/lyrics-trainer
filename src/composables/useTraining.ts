/**
 * useTraining - Training session management composable
 * Handles training state, round logic, and statistics
 */

import { computed, ref, reactive, watch } from "vue";
import type { Song, ClozeToken, Choice, FeedbackState, Normalize } from "../types";
import { randomInt, clamp } from "../utils/math";
import { normalizeForCompare } from "../utils/text";

export function useTraining(currentSong: Song | null, settings: any) {
  // State
  const stats = reactive({ correct: 0, total: 0 });
  const currentIndex = ref(0);
  const promptLine = ref("");
  const answerLine = ref("");
  const roundLocked = ref(false);
  const revealAnswer = ref(false);
  const typedInput = ref("");
  const showContinue = ref(false);
  const lastWasCorrect = ref(false);

  const feedback = reactive<FeedbackState>({
    ok: true,
    message: "",
    details: "",
  });

  // MCQ state
  const mcqChoices = ref<Choice[]>([]);

  // Cloze state
  const clozeTokens = ref<ClozeToken[]>([]);
  const activeBlankIndex = ref(0);
  const clozeChoices = ref<string[]>([]);
  const clozeMissingCount = ref(1);
  const clozeConsecutiveCorrect = ref(0);
  const clozeConsecutiveIncorrect = ref(0);
  const lastClozePick = ref<{ key: string; ok: boolean } | null>(null);

  // Vocabulary state
  const vocabIndex = ref(0);
  const vocabChoices = ref<string[]>([]);

  // Computed
  const clozeBlanks = computed(() =>
    clozeTokens.value.filter(
      (t): t is Extract<ClozeToken, { type: "blank" }> => t.type === "blank"
    )
  );

  const clozeMissingCount_ = computed(() => clozeBlanks.value.length);

  // Helper functions
  function resetRoundUiState(): void {
    roundLocked.value = false;
    typedInput.value = "";
    revealAnswer.value = false;
    feedback.message = "";
    feedback.details = "";
    showContinue.value = false;
    lastWasCorrect.value = false;
    lastClozePick.value = null;
  }

  function resetRound(resetIndex: boolean): void {
    resetRoundUiState();

    if (!currentSong) return;
    const n = currentSong.lines.length;
    if (n < 2) return;

    if (resetIndex) {
      currentIndex.value =
        settings.order === "sequence" ? 0 : randomInt(0, n - 2);
      clozeConsecutiveCorrect.value = 0;
      clozeConsecutiveIncorrect.value = 0;
    }

    clozeMissingCount.value = clamp(
      settings.clozeStartMissing,
      1,
      settings.clozeMaxMissing
    );

    buildPromptAndAnswer();
  }

  function buildPromptAndAnswer(): void {
    if (!currentSong) return;

    // For vocabulary mode, don't show prompt/answer lines
    if (settings.mode === "vocabulary") {
      promptLine.value = "";
      answerLine.value = "";
      return;
    }

    const lines = currentSong.lines;
    const safeIdx = clamp(currentIndex.value, 0, lines.length - 2);

    if (settings.mode === "type" && settings.typeTarget === "currentLine") {
      promptLine.value = lines[safeIdx];
      answerLine.value = lines[safeIdx];
    } else {
      promptLine.value = lines[safeIdx];
      answerLine.value = lines[safeIdx + 1];
    }
  }

  function newPrompt(): void {
    if (!currentSong) return;

    resetRoundUiState();

    const n = currentSong.lines.length;
    if (settings.order === "sequence")
      currentIndex.value = (currentIndex.value + 1) % Math.max(1, n - 1);
    else currentIndex.value = randomInt(0, n - 2);

    buildPromptAndAnswer();
  }

  function resetSession(): void {
    stats.correct = 0;
    stats.total = 0;
    clozeMissingCount.value = clamp(
      settings.clozeStartMissing,
      1,
      settings.clozeMaxMissing
    );
    resetRound(true);
  }

  function advanceAfterCorrect(delayMs = 1200): void {
    setTimeout(() => newPrompt(), delayMs);
  }

  function setFeedback(
    ok: boolean,
    message: string,
    details?: string
  ): void {
    feedback.ok = ok;
    feedback.message = message;
    feedback.details = details;
    lastWasCorrect.value = ok;
    showContinue.value = !ok;
  }

  function continueAfterWrong(): void {
    revealAnswer.value = false;
    showContinue.value = false;
    roundLocked.value = false;
    typedInput.value = "";
    newPrompt();
  }

  function tryAgainSamePrompt(): void {
    showContinue.value = false;
    roundLocked.value = false;
    typedInput.value = "";
    feedback.message = "";
    feedback.details = "";
  }

  // Submission handlers
  function submitChoice(chosenText: string): void {
    if (roundLocked.value) return;
    roundLocked.value = true;

    const chosenKey = normalizeForCompare(chosenText, settings.normalize);
    const correctKey = normalizeForCompare(answerLine.value, settings.normalize);
    const ok = chosenKey === correctKey;

    stats.total += 1;
    if (ok) {
      stats.correct += 1;
      setFeedback(true, "Correct!");
      advanceAfterCorrect();
    } else {
      revealAnswer.value = false;
      setFeedback(false, "Incorrect.", `Correct: "${answerLine.value}"`);
    }
  }

  function submitTypedLine(
    target: string,
    compareNormalize: Normalize = settings.normalize
  ): void {
    if (roundLocked.value) return;

    const ok =
      normalizeForCompare(typedInput.value, compareNormalize) ===
      normalizeForCompare(target, compareNormalize);

    stats.total += 1;
    if (ok) {
      stats.correct += 1;
      setFeedback(true, "Correct!");
      roundLocked.value = true;
      advanceAfterCorrect();
    } else {
      revealAnswer.value = true;
      roundLocked.value = true;
      const typed = typedInput.value || "(empty)";
      const detailsMsg = `You typed: "${typed}"\nExpected: "${target}"`;
      setFeedback(false, "Incorrect.", detailsMsg);
    }
  }

  function submitTypedNextLine(): void {
    submitTypedLine(answerLine.value);
  }

  function submitTypedType(): void {
    const target =
      settings.typeTarget === "currentLine"
        ? promptLine.value
        : answerLine.value;
    submitTypedLine(target);
  }

  function isBlankFilled(idx: number): boolean {
    const blank = clozeBlanks.value[idx];
    return !!blank?.filled;
  }

  function findNextUnfilledBlankIndex(): number {
    for (let i = 0; i < clozeBlanks.value.length; i++) {
      if (!clozeBlanks.value[i].filled) return i;
    }
    return -1;
  }

  function findBlankIndexByToken(token: ClozeToken): number {
    if (token.type !== "blank") return -1;
    return clozeBlanks.value.indexOf(
      token as Extract<ClozeToken, { type: "blank" }>
    );
  }

  function selectBlankByToken(token: ClozeToken): void {
    if (token.type !== "blank" || roundLocked.value) return;
    const idx = findBlankIndexByToken(token);
    if (idx !== -1 && !isBlankFilled(idx)) {
      activeBlankIndex.value = idx;
    }
  }

  // Return public API
  return {
    // State
    stats,
    currentIndex,
    promptLine,
    answerLine,
    roundLocked,
    revealAnswer,
    typedInput,
    showContinue,
    lastWasCorrect,
    feedback,

    // MCQ state
    mcqChoices,

    // Cloze state
    clozeTokens,
    activeBlankIndex,
    clozeChoices,
    clozeMissingCount,
    clozeConsecutiveCorrect,
    clozeConsecutiveIncorrect,
    lastClozePick,
    clozeBlanks,
    clozeMissingCount_,

    // Vocabulary state
    vocabIndex,
    vocabChoices,

    // Methods
    resetRound,
    resetSession,
    newPrompt,
    buildPromptAndAnswer,
    advanceAfterCorrect,
    setFeedback,
    continueAfterWrong,
    tryAgainSamePrompt,
    submitChoice,
    submitTypedNextLine,
    submitTypedType,
    isBlankFilled,
    findNextUnfilledBlankIndex,
    findBlankIndexByToken,
    selectBlankByToken,
  };
}
