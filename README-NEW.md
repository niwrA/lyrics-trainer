# Lyrics Trainer

A free, browser-based tool for practicing song lyrics with multiple training modes. Perfect for language learners, singers, and performers who want to memorize lyrics more effectively.

## 🎵 Features

### Training Modes
- **Next Line (MCQ)**: Choose the correct next line from options
- **Fill Blanks (Cloze)**: Complete missing words in the lyrics
- **Type**: Type entire lines to practice accuracy
- **Word Meanings**: NEW! Learn translations and explanations of words in your songs

### Song Management
- Add songs by pasting lyrics
- Batch import/export via JSON
- Search and sort your library
- Full localStorage persistence

### Learning
- Track your progress with score statistics
- Choose sequential or random word/line ordering
- Customize number of options and difficulty
- Support for English and Spanish UI

## 🆕 Vocabulary Training Mode

The latest feature allows you to train word meanings from your lyrics:

- **Quiz Format**: Choose the correct translation/explanation from 4 options
- **Multiple Choice**: Learn word meanings interactively
- **AI-Generated**: Automatically generate translations for entire song libraries
- **Import/Export**: Vocabulary data travels with your songs

### Quick Start with Vocabulary

```bash
# Generate vocabulary for your songs using AI
pip install openai
export OPENAI_API_KEY=sk-your-key
python generate_vocabulary.py songs.json songs-with-vocab.json

# Then import the enhanced JSON in the app
```

See **[VOCABULARY_QUICK_START.md](./VOCABULARY_QUICK_START.md)** for detailed instructions.

## 🚀 Getting Started

### Web App
1. Visit the live demo (link to be added)
2. Add a song via "Paste lyrics" or "JSON import"
3. Select a training mode
4. Start practicing!

### Self-Hosted (Development)

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

### Using with Vocabulary

```bash
# 1. Prepare your songs (see VOCABULARY_QUICK_START.md)
python generate_vocabulary.py your-songs.json

# 2. Import in the app via JSON import tab
# 3. Select "Word meanings" from Settings
# 4. Start training!
```

## 📚 Documentation

- **[VOCABULARY_QUICK_START.md](./VOCABULARY_QUICK_START.md)** - Get started with vocabulary training (START HERE!)
- **[VOCABULARY_TRAINING.md](./VOCABULARY_TRAINING.md)** - Technical documentation and API reference
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Developer overview of new features
- **[songs-example-with-vocabulary.json](./songs-example-with-vocabulary.json)** - Example songs with vocabulary data

## 🔧 Technologies

- **Vue 3** - Progressive JavaScript framework
- **Vite** - Lightning-fast build tool
- **TypeScript** - Type-safe development
- **LocalStorage** - No server required, all data stays in your browser

## 💾 Data Storage

- **Everything is local**: No accounts, no uploads, no tracking
- **Browser storage**: Uses localStorage (typically 5-10MB limit)
- **Export anytime**: Download your songs as JSON backup
- **Import anywhere**: Restore from JSON or use on different devices

## 📋 JSON Format

### Minimal Song
```json
[
  {
    "title": "Song Title",
    "lines": ["Line 1", "Line 2"]
  }
]
```

### With Vocabulary (NEW!)
```json
[
  {
    "title": "La Bamba",
    "lines": ["Para bailar la bamba", "Se necesita una poca de gracia"],
    "vocabulary": [
      {
        "word": "bailar",
        "translation": "to dance",
        "explanation": "To move rhythmically to music"
      }
    ]
  }
]
```

## 🎓 Use Cases

- **Language Learning**: Train Spanish lyrics and learn vocabulary simultaneously
- **Performance Prep**: Practice song lyrics before a performance
- **Memory Training**: Improve memorization with spaced practice
- **Lyrics Study**: Deep dive into song meanings and word usage

## 🤖 AI Vocabulary Generation

Use the included Python script to generate translations and explanations:

```bash
python generate_vocabulary.py input.json output.json --model gpt-4o-mini
```

**Supported AI providers** (via script modifications):
- OpenAI (GPT-4, GPT-4o-mini)
- Claude (Anthropic)
- Gemini (Google)
- Local models (Ollama, LLaMA)

## 📱 Browser Support

Works on modern browsers:
- ✅ Chrome/Brave (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers

## 🔐 Privacy

- ✅ All data stored locally in your browser
- ✅ No server communication required
- ✅ No tracking or analytics
- ✅ No third-party scripts (except fonts)
- ✅ You own your data

## 🤝 Contributing

Ideas, improvements, or translations welcome!

## 📄 License

[Add your license here]

## 🙏 Credits

Built with Vue 3 and Vite

---

**Start learning today!** 🎵📚
