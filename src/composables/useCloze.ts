/**
 * useCloze - Cloze exercise specific logic
 * Handles cloze token generation, blank management, and choice building
 */

import type { ClozeToken } from "../types";
import { clamp, sampleUnique, shuffle } from "../utils/math";
import {
  normalizeForCompare,
  buildWordCorpus,
  isWord,
  similarityScore,
} from "../utils/text";

export function useCloze() {
  /**
   * Build cloze tokens from a line with missing word count
   */
  function buildClozeTokens(
    line: string,
    missingCount: number
  ): {
    tokens: ClozeToken[];
    blanks: Extract<ClozeToken, { type: "blank" }>[];
  } {
    const parts = line.match(/[\p{L}\p{N}''\-]+|[^\p{L}\p{N}''\-]+/gu) ?? [
      line,
    ];

    const wordIndices: number[] = [];
    for (let i = 0; i < parts.length; i++)
      if (isWord(parts[i])) wordIndices.push(i);

    const nWords = wordIndices.length;
    const k = clamp(missingCount, 1, Math.max(1, nWords));
    const chosen = pickWeightedIndices(wordIndices, k);

    const tokens: ClozeToken[] = [];
    const blanks: Extract<ClozeToken, { type: "blank" }>[] = [];

    for (let i = 0; i < parts.length; i++) {
      const p = parts[i];
      if (isWord(p) && chosen.has(i)) {
        const blank: Extract<ClozeToken, { type: "blank" }> = {
          type: "blank",
          correct: p,
          filled: null,
        };
        tokens.push(blank);
        blanks.push(blank);
      } else {
        tokens.push({ type: "text", value: p });
      }
    }

    return { tokens, blanks };
  }

  /**
   * Pick weighted indices (later words have higher priority)
   */
  function pickWeightedIndices(
    wordIndices: number[],
    k: number
  ): Set<number> {
    const picks = new Set<number>();
    const weights = wordIndices.map((idx, i) => ({
      idx,
      w: 1 + (i / Math.max(1, wordIndices.length - 1)),
    }));

    while (picks.size < k && picks.size < wordIndices.length) {
      const total = weights.reduce((acc, x) => acc + x.w, 0);
      let r = Math.random() * total;
      for (const x of weights) {
        r -= x.w;
        if (r <= 0) {
          picks.add(x.idx);
          break;
        }
      }
    }
    return picks;
  }

  /**
   * Build cloze choices for a given correct word
   */
  function buildClozeChoices(
    correctWord: string,
    corpus: string[],
    optionCount: number
  ): string[] {
    const candidates = corpus
      .filter(
        (w) =>
          normalizeForCompare(w, "punct") !==
          normalizeForCompare(correctWord, "punct")
      )
      .map((w) => ({ w, score: similarityScore(correctWord, w) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 60)
      .map((x) => x.w);

    const distractors = sampleUnique(
      candidates.map((w) => ({ w, key: normalizeForCompare(w, "punct") })),
      clamp(optionCount, 3, 6) - 1,
      (x) => x.key
    ).map((x) => x.w);

    return shuffle([correctWord, ...distractors]);
  }

  /**
   * Compare cloze text submission
   */
  function compareClozeMissing(typed: string, correct: string[]): boolean {
    const typedNormalized = normalizeForCompare(typed.trim(), "basic")
      .split(/\s+/)
      .filter((w) => w);
    const correctNormalized = correct.map((w) =>
      normalizeForCompare(w, "basic")
    );

    if (typedNormalized.length !== correctNormalized.length) return false;

    for (let i = 0; i < typedNormalized.length; i++) {
      if (typedNormalized[i] !== correctNormalized[i]) return false;
    }

    return true;
  }

  // Return public API
  return {
    buildClozeTokens,
    buildClozeChoices,
    compareClozeMissing,
    pickWeightedIndices,
  };
}
