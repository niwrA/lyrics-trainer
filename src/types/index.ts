/**
 * Type definitions for Lyrics Trainer
 */

export type Word = {
  word: string;
  translation?: string;
  explanation?: string;
};

export type Song = {
  id: string;
  title: string;
  artist?: string;
  album?: string;
  createdAt: string;
  lines: string[];
  vocabulary?: Word[];
};

export type SongSet = {
  id: string;
  name: string;
  createdAt: string;
  songs: Song[];
};

export type Mode = "nextLine" | "cloze" | "type" | "vocabulary";
export type Order = "sequence" | "random";
export type Normalize = "strict" | "basic" | "punct";
export type ClozeInput = "choice" | "type";
export type ClozeProgression = "on" | "off";
export type TypeTarget = "nextLine" | "currentLine";
export type HintLine = "on" | "off";
export type NextLineInput = "choice" | "type";

export type Lang = "en" | "es";
export type Messages = Record<string, string>;
export type AppTab = "songs" | "train" | "settings" | "about";

export type Choice = { key: string; text: string; isCorrect: boolean };

export type ClozeToken =
  | { type: "text"; value: string }
  | { type: "blank"; correct: string; filled: string | null };

export type Settings = {
  uiLang: Lang;
  mode: Mode;
  order: Order;
  optionCount: number;
  nextLineInput: NextLineInput;
  clozeStartMissing: number;
  clozeMaxMissing: number;
  clozeProgression: ClozeProgression;
  clozeInput: ClozeInput;
  showClozeTarget: "on" | "off";
  typeTarget: TypeTarget;
  normalize: Normalize;
  showHintLine: HintLine;
};

export type FeedbackState = {
  ok: boolean;
  message: string;
  details?: string;
};
