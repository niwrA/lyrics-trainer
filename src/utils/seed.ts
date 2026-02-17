/**
 * Seed data for default songs
 */

import type { Song } from "../types";
import { cryptoRandomId } from "./math";

export function seedSongs(): Song[] {
  return [
    {
      id: cryptoRandomId(),
      title: "Greensleeves",
      artist: "Traditional",
      album: "Public Domain",
      createdAt: new Date().toISOString(),
      lines: [
        "Alas, my love, you do me wrong",
        "To cast me off discourteously",
        "For I have loved you so long",
        "Delighting in your company",
      ],
      vocabulary: [
        {
          word: "Alas",
          translation: "Ay (expresión de tristeza)",
          explanation: "Interjection expressing grief or regret",
        },
        {
          word: "discourteously",
          translation: "descortésmente",
          explanation: "In a rude or impolite manner",
        },
        {
          word: "Delighting",
          translation: "disfrutando",
          explanation: "Taking great pleasure in something",
        },
      ],
    },
    {
      id: cryptoRandomId(),
      title: "Twinkle, Twinkle, Little Star",
      artist: "Jane Taylor",
      album: "Public Domain",
      createdAt: new Date().toISOString(),
      lines: [
        "Twinkle, twinkle, little star",
        "How I wonder what you are",
        "Up above the world so high",
        "Like a diamond in the sky",
      ],
      vocabulary: [
        {
          word: "Twinkle",
          translation: "Brillar/Centellear",
          explanation: "To shine with a flickering light",
        },
        {
          word: "wonder",
          translation: "me pregunto",
          explanation: "To think about something with curiosity",
        },
        {
          word: "diamond",
          translation: "diamante",
          explanation: "A precious gemstone, very bright and clear",
        },
      ],
    },
    {
      id: cryptoRandomId(),
      title: "La Marcha de Zacatecas",
      artist: "Genaro Codina",
      album: "Public Domain",
      createdAt: new Date().toISOString(),
      lines: [
        "Por la puerta principal",
        "Entra la comitiva oficial",
        "Con su música marcial",
        "Y su paso procesional",
      ],
      vocabulary: [
        {
          word: "puerta",
          translation: "door",
          explanation: "An opening in a wall to enter or exit",
        },
        {
          word: "comitiva",
          translation: "procession/entourage",
          explanation:
            "A group of people traveling together, often in a formal ceremony",
        },
        {
          word: "marcial",
          translation: "martial",
          explanation: "Relating to soldiers or military",
        },
        {
          word: "procesional",
          translation: "processional",
          explanation: "Related to a formal procession or parade",
        },
      ],
    },
    {
      id: cryptoRandomId(),
      title: "Yankee Doodle",
      artist: "Traditional American",
      album: "Public Domain",
      createdAt: new Date().toISOString(),
      lines: [
        "Yankee Doodle went to town",
        "Riding on a pony",
        "Stuck a feather in his cap",
        "And called it macaroni",
      ],
      vocabulary: [
        {
          word: "Yankee",
          translation: "Americano",
          explanation: "A person from the northern United States",
        },
        {
          word: "pony",
          translation: "pony/caballo pequeño",
          explanation: "A small horse",
        },
        {
          word: "feather",
          translation: "pluma",
          explanation: "One of the light structures covering a bird's body",
        },
        {
          word: "macaroni",
          translation: "macarrones",
          explanation:
            "A type of pasta; also slang for fancy or fashionable",
        },
      ],
    },
  ];
}
