# Vocabulary Training Mode

This document explains the new **Word Meanings** (vocabulary) training mode in Lyrics Trainer.

## Overview

The vocabulary training mode allows you to train and practice the meanings of words in your songs. This is especially useful for language learners who want to understand Spanish (or other language) words used in their lyrics.

## Features

- **Train word meanings**: Quiz yourself on word translations and explanations
- **Multiple choice format**: Choose the correct meaning from options
- **JSON-based vocabulary data**: Import/export vocabulary along with your songs
- **AI-friendly format**: Easily generate translations and explanations using AI for your entire song library

## JSON Format

The vocabulary training mode extends the song JSON format to include optional vocabulary data.

### Basic Song Format (still supported)

```json
[
  {
    "id": "optional-id",
    "title": "Song Title",
    "artist": "Artist Name",
    "album": "Album Name",
    "createdAt": "2026-02-15T12:00:00.000Z",
    "lines": [
      "First line of lyrics",
      "Second line of lyrics",
      "Third line of lyrics"
    ]
  }
]
```

### Extended Format with Vocabulary

```json
[
  {
    "id": "song-id-123",
    "title": "La Bamba",
    "artist": "Ritchie Valens",
    "album": "La Bamba",
    "createdAt": "2026-02-15T12:00:00.000Z",
    "lines": [
      "Para bailar la bamba",
      "Se necesita una poca de gracia",
      "Una poca de gracia y otra cosita"
    ],
    "vocabulary": [
      {
        "word": "bailar",
        "translation": "to dance",
        "explanation": "Verb meaning to move rhythmically to music"
      },
      {
        "word": "bamba",
        "translation": "bamba",
        "explanation": "A Mexican folk dance and music genre"
      },
      {
        "word": "necesita",
        "translation": "needs",
        "explanation": "Third person singular of necesitar (to need)"
      },
      {
        "word": "gracia",
        "translation": "grace, charm",
        "explanation": "Elegance or skill in movement or behavior"
      },
      {
        "word": "cosita",
        "translation": "little thing",
        "explanation": "Diminutive form of cosa (thing)"
      }
    ]
  }
]
```

## Vocabulary Object Structure

Each vocabulary entry has the following properties:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `word` | string | Yes | The word to learn |
| `translation` | string | No | Translation to your native language |
| `explanation` | string | No | More detailed explanation (can be longer) |

**Important**: At least one of `translation` or `explanation` must be provided for each word.

## How It Works

### In the App

1. Go to **Settings** and select **"Word meanings"** from the Exercise dropdown
2. Select a song from the library that has vocabulary data
3. You'll be shown a word from the song's vocabulary
4. Choose the correct meaning from 4 multiple choice options
5. The app tracks your score and cycles through the vocabulary

### Import/Export

1. **Export**: Use the "Export songs JSON" button to export all songs with their vocabulary
2. **Import**: Use the "JSON import" tab to paste your JSON data with vocabulary
3. The JSON schema example (in the import section) shows the full format including vocabulary

## Generating Vocabulary with AI

You can easily generate translations and explanations for your entire song library using AI models like GPT-4o-mini:

### Example Python Script

```python
import json
import openai

# Load your songs
with open('songs.json', 'r', encoding='utf-8') as f:
    songs = json.load(f)

# Initialize OpenAI client
client = openai.OpenAI(api_key="your-api-key")

for song in songs:
    if not song.get('vocabulary'):
        song['vocabulary'] = []
    
    # Get unique words from lyrics (you could manually add these or use NLP)
    # For now, assume you have them in song.get('words')
    for word_entry in song.get('words', []):
        word = word_entry['word']
        
        # Generate translation and explanation
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "user",
                    "content": f"""Provide a translation and explanation for the Spanish word "{word}".
                    
Format your response as JSON:
{{
  "translation": "English translation",
  "explanation": "Detailed explanation"
}}"""
                }
            ]
        )
        
        vocab_data = json.loads(response.choices[0].message.content)
        song['vocabulary'].append({
            "word": word,
            "translation": vocab_data['translation'],
            "explanation": vocab_data['explanation']
        })

# Save updated songs
with open('songs_with_vocab.json', 'w', encoding='utf-8') as f:
    json.dump(songs, f, ensure_ascii=False, indent=2)
```

## Tips for Building Your Vocabulary Library

1. **Start with key words**: Focus on words that appear in multiple songs or are essential for understanding
2. **Include context**: Use explanations to provide context beyond just a translation
3. **Use both translation and explanation**: 
   - `translation`: Quick answer (shows in quiz options)
   - `explanation`: Deeper context (also shows in quiz options)
4. **Consistency**: Keep translations and explanations consistent across songs
5. **Gradual expansion**: Start with your favorite songs and expand over time

## Quiz Strategy

The vocabulary quiz:
- Shows you a Spanish word (or word in any language)
- Presents 4 options (either translations or explanations)
- Tracks correct answers
- Randomizes the order of options
- Uses your preferred UI language (doesn't translate the actual vocabulary words)

## Compatibility

- **Backward compatible**: Old songs without vocabulary still work normally
- **Optional feature**: You can ignore vocabulary and use the app as before
- **Flexible**: Some songs can have vocabulary, others don't

## Example Workflow

1. **Add a song** via JSON import with just lyrics
2. **Decide on vocabulary**: Pick important words from the lyrics
3. **Generate meanings**: Use AI to create translations and explanations
4. **Import updated JSON**: Paste the enriched JSON back into the app
5. **Train**: Select "Word meanings" mode and quiz yourself
6. **Export**: Save your progress by exporting the full JSON
7. **Share**: Share your vocabulary-enriched song files with others

## API Reference

The vocabulary training uses these internal functions:

- `buildVocabularyOptions()`: Generates 4 multiple choice options
- `submitVocabularyChoice(choice)`: Handles answer submission
- `advanceVocabQuestion()`: Moves to the next word
- `sanitizeVocabulary(vocab)`: Validates vocabulary data on import

## Notes

- The correct answer is determined by either the `translation` (preferred) or `explanation`
- You can't have both as correct answers; the app uses: `translation || explanation`
- Settings like number of options (optionCount) apply to vocabulary mode too
- Score statistics are tracked the same as other modes

## Future Enhancements

Potential future features:
- Spaced repetition (SRS) for vocabulary
- Difficulty levels based on word frequency
- Audio pronunciation
- User-contributed translations
- Vocabulary progress tracking per song
- Export stats on vocabulary knowledge

---

**Happy learning!** 🎵📚
