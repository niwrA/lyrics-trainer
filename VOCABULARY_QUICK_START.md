# Vocabulary Training Feature

## 📚 Overview

The **Vocabulary Training** mode is a powerful new feature that lets you train the meanings and translations of words in your songs. This is especially useful for language learners who want to understand Spanish (or any language) lyrics deeply.

## ✨ Key Features

- **Quiz Format**: Test yourself on word meanings in a multiple-choice format
- **AI-Generated Content**: Use the provided Python script to automatically generate translations and explanations for entire song libraries
- **JSON-Based**: All vocabulary data is stored in the same format as your songs, making it easy to export, import, and share
- **Seamless Integration**: Works alongside existing training modes (Next Line, Cloze, Type)
- **Progress Tracking**: Score statistics for vocabulary training just like other modes

## 🚀 Quick Start

### 1. Enable Vocabulary Training

1. Go to **Settings** tab
2. Select **"Word meanings"** from the Exercise dropdown
3. Select a song that has vocabulary data
4. Start training!

### 2. Add Vocabulary to Your Songs

You have two options:

#### Option A: Manual Entry (Small Song Collection)

1. Go to **JSON import** tab
2. Copy your songs JSON
3. Manually add a `vocabulary` array to each song
4. Paste and import

#### Option B: AI Generation (Recommended for Large Collections)

Use the included Python script to automatically generate translations and explanations:

```bash
# Install dependencies
pip install openai

# Generate vocabulary for a song file
python generate_vocabulary.py songs.json songs-with-vocab.json --api-key YOUR_KEY

# Or use environment variable
export OPENAI_API_KEY=sk-...
python generate_vocabulary.py songs.json
```

### 3. Import Your Vocabulary-Enhanced Songs

1. Copy the generated JSON
2. Go to **JSON import** tab
3. Paste and import

## 📋 JSON Format

### Minimal Example

```json
[
  {
    "title": "My Song",
    "lines": ["Line 1", "Line 2"],
    "vocabulary": [
      {
        "word": "ejemplo",
        "translation": "example"
      }
    ]
  }
]
```

### Complete Example

```json
{
  "id": "song-123",
  "title": "La Bamba",
  "artist": "Ritchie Valens",
  "album": "La Bamba",
  "createdAt": "2026-02-15T12:00:00.000Z",
  "lines": [
    "Para bailar la bamba",
    "Se necesita una poca de gracia"
  ],
  "vocabulary": [
    {
      "word": "bailar",
      "translation": "to dance",
      "explanation": "To move rhythmically to music"
    },
    {
      "word": "gracia",
      "translation": "grace, charm",
      "explanation": "Elegance or skill in movement"
    }
  ]
}
```

## 📝 Vocabulary Entry Format

Each vocabulary entry must have:

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `word` | string | ✅ | The word to learn |
| `translation` | string | ⚠️ | Translation (at least one field required) |
| `explanation` | string | ⚠️ | Detailed explanation (at least one field required) |

**Important**: Each vocabulary entry must have either a `translation` or `explanation` (or both).

## 🤖 Using AI to Generate Vocabulary

### With OpenAI (Recommended)

```bash
python generate_vocabulary.py input.json output.json --api-key sk-YOUR_KEY
```

### With Other AI Services

The Python script can be adapted for:
- Claude (Anthropic)
- Gemini (Google)
- Local models (Ollama, LLaMA)
- Any API that returns JSON

### Example with Claude

```python
import anthropic

def generate_with_claude(word: str) -> dict:
    client = anthropic.Anthropic()
    response = client.messages.create(
        model="claude-3-sonnet-20240229",
        max_tokens=200,
        messages=[{
            "role": "user",
            "content": f"""Translate and explain "{word}" (Spanish word):
{{
  "translation": "...",
  "explanation": "..."
}}"""
        }]
    )
    return json.loads(response.content[0].text)
```

## 💡 Tips & Best Practices

### For Language Learners

1. **Start with frequent words**: Focus on words that appear in multiple songs
2. **Use both translation and explanation**: 
   - Short translation = quick lookup
   - Explanation = deeper understanding
3. **Include context**: Mention part of speech (verb, noun, adjective)
4. **Gradual building**: Start with one song, expand your library over time

### For Large Song Collections

1. **Batch processing**: Use the Python script to generate 100+ songs at once
2. **Review and edit**: AI isn't perfect - review and fix translations manually
3. **Maintain consistency**: Keep translations consistent across songs
4. **Export regularly**: Use "Export songs JSON" to backup your work

### Quality Suggestions

```json
{
  "word": "hermoso",
  "translation": "beautiful, lovely",
  "explanation": "Adjective describing something aesthetically pleasing or attractive"
}
```

Good: Includes grammatical info and multiple translations

```json
{
  "word": "extrañar",
  "translation": "to miss",
  "explanation": "Verb meaning to feel nostalgia for or to long for someone/something"
}
```

## 📊 Quiz Mechanics

When training with vocabulary:

1. **You see**: A Spanish word in large text
2. **You choose**: One of 4 possible meanings (translations or explanations)
3. **The app**: Tracks your score and moves to the next word
4. **Ordering**: Sequential or random based on your settings
5. **Scoring**: Same as other modes (correct/total)

### Example Quiz Flow

```
"bailar"

Options:
A) to sing
B) to dance          ✓ Correct!
C) to walk
D) to write

Score: 23/45
```

## 🔧 Advanced Usage

### Bulk Edit Vocabulary

```python
import json

with open('songs.json', 'r') as f:
    songs = json.load(f)

# Add prefix to all explanations
for song in songs:
    for word in song.get('vocabulary', []):
        if word['explanation']:
            word['explanation'] = f"[Spanish] {word['explanation']}"

with open('songs-updated.json', 'w') as f:
    json.dump(songs, f, indent=2)
```

### Filter Songs with Vocabulary

```python
import json

with open('songs.json', 'r') as f:
    songs = json.load(f)

# Find songs with vocabulary
with_vocab = [s for s in songs if s.get('vocabulary')]
without_vocab = [s for s in songs if not s.get('vocabulary')]

print(f"With vocabulary: {len(with_vocab)}")
print(f"Without vocabulary: {len(without_vocab)}")
```

### Extract Vocabulary from Multiple Songs

```python
import json

with open('songs.json', 'r') as f:
    songs = json.load(f)

# Combine all vocabulary
all_words = {}
for song in songs:
    for word in song.get('vocabulary', []):
        all_words[word['word']] = word

# Save as standalone vocabulary
with open('vocabulary.json', 'w') as f:
    json.dump(list(all_words.values()), f, indent=2)
```

## 📚 Example Files

This feature includes example files:

- **`songs-example-with-vocabulary.json`**: 3 complete songs with vocabulary (La Bamba, El Loco, Despierta)
- **`VOCABULARY_TRAINING.md`**: Detailed technical documentation
- **`generate_vocabulary.py`**: Python script for AI-based generation

## 🆘 Troubleshooting

### "No vocabulary data for this song"

**Problem**: Vocabulary mode selected but song has no vocabulary  
**Solution**: Use JSON import to add vocabulary to the song

### Quiz options are the same

**Problem**: Not enough unique translations/explanations in the song's vocabulary  
**Solution**: Add more words or write distinct explanations for existing words

### API rate limits with generate_vocabulary.py

**Problem**: Script hits OpenAI rate limits  
**Solution**: 
- Add delays between requests
- Use batch processing
- Upgrade to higher API tier

### Words not appearing in quiz

**Problem**: Words don't show up when training  
**Solution**: 
1. Check JSON is valid (use JSON validator)
2. Ensure `vocabulary` is an array
3. Each word must have `word` field and at least one of `translation`/`explanation`

## 🎓 Learning Path

1. **Week 1**: Add 1 song with 10-15 key words
2. **Week 2**: Train daily, review weak words
3. **Week 3**: Add 2-3 more songs with vocabulary
4. **Month 2**: Build library to 10+ songs
5. **Month 3**: Use AI script to mass-generate vocabulary
6. **Ongoing**: Maintain and expand your library

## 🤝 Contributing

Have improvements or translations to share? You can:

1. Create vocabulary-enriched versions of popular songs
2. Improve the `generate_vocabulary.py` script
3. Add support for other languages
4. Contribute to translations and explanations

## 📖 See Also

- **VOCABULARY_TRAINING.md**: Full technical documentation
- **songs-example-with-vocabulary.json**: Complete examples
- **generate_vocabulary.py**: Source code for AI generation script
