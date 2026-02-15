#!/usr/bin/env python3
"""
Vocabulary Generator for Lyrics Trainer

This script helps generate translations and explanations for words in your song library
using OpenAI's API. It's designed to work with the Lyrics Trainer JSON format.

Requirements:
    pip install openai

Usage:
    python generate_vocabulary.py <input.json> <output.json> --api-key YOUR_API_KEY --model gpt-4o-mini

Example:
    python generate_vocabulary.py songs.json songs-with-vocab.json

Environment:
    Set OPENAI_API_KEY environment variable or pass --api-key flag
"""

import json
import sys
import argparse
from pathlib import Path
from typing import Optional

try:
    import openai
except ImportError:
    print("Error: openai package not found. Install it with: pip install openai")
    sys.exit(1)


def extract_unique_words(lyrics_lines: list[str]) -> list[str]:
    """
    Extract unique words from lyrics.
    This is a simple approach; you may want to customize it.
    """
    words = set()
    for line in lyrics_lines:
        # Split by spaces and remove punctuation (basic)
        line_words = line.split()
        for word in line_words:
            # Remove common punctuation
            cleaned = word.strip('.,!?;:\'"«»').lower()
            if cleaned and len(cleaned) > 2:  # Skip very short words
                words.add(cleaned)
    return sorted(list(words))


def generate_vocabulary(
    word: str,
    language: str = "Spanish",
    client: Optional[openai.OpenAI] = None,
    model: str = "gpt-4o-mini"
) -> Optional[dict]:
    """
    Generate translation and explanation for a word using OpenAI.
    
    Args:
        word: The word to translate and explain
        language: Source language of the word
        client: OpenAI client instance
        model: Model to use (e.g., "gpt-4o-mini", "gpt-4")
    
    Returns:
        Dictionary with 'translation' and 'explanation' or None if error
    """
    if not client:
        return None
    
    try:
        message = f"""Provide a translation and explanation for the {language} word "{word}".

Respond ONLY with valid JSON, no markdown, no extra text:
{{
  "translation": "English translation (1-3 words)",
  "explanation": "Detailed explanation (1-2 sentences)"
}}"""
        
        response = client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": message}],
            temperature=0.3,
            max_tokens=150
        )
        
        content = response.choices[0].message.content.strip()
        # Remove markdown code blocks if present
        if content.startswith("```json"):
            content = content[7:]
        if content.startswith("```"):
            content = content[3:]
        if content.endswith("```"):
            content = content[:-3]
        
        result = json.loads(content.strip())
        return {
            "translation": result.get("translation", ""),
            "explanation": result.get("explanation", "")
        }
    except json.JSONDecodeError as e:
        print(f"  ⚠️  Failed to parse response for '{word}': {e}")
        return None
    except openai.APIError as e:
        print(f"  ❌ API error for '{word}': {e}")
        return None


def process_songs(
    input_file: str,
    output_file: str,
    api_key: Optional[str] = None,
    model: str = "gpt-4o-mini",
    language: str = "Spanish",
    batch_size: int = 5
) -> bool:
    """
    Process songs and generate vocabulary for words in lyrics.
    
    Args:
        input_file: Input JSON file path
        output_file: Output JSON file path
        api_key: OpenAI API key
        model: Model name to use
        language: Language of the lyrics
        batch_size: Number of words to process before showing progress
    
    Returns:
        True if successful, False otherwise
    """
    
    # Load input file
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            songs = json.load(f)
    except FileNotFoundError:
        print(f"❌ Input file not found: {input_file}")
        return False
    except json.JSONDecodeError as e:
        print(f"❌ Invalid JSON in input file: {e}")
        return False
    
    if not isinstance(songs, list):
        print("❌ Input file must contain a JSON array of songs")
        return False
    
    # Initialize OpenAI client
    if not api_key:
        api_key = openai.api_key
    
    if not api_key:
        print("❌ No API key provided. Set OPENAI_API_KEY environment variable or use --api-key")
        return False
    
    client = openai.OpenAI(api_key=api_key)
    
    print(f"📚 Processing {len(songs)} song(s)...")
    print(f"🔧 Model: {model}")
    print(f"🗣️  Language: {language}")
    print()
    
    # Process each song
    for song_idx, song in enumerate(songs, 1):
        title = song.get('title', f'Song {song_idx}')
        print(f"[{song_idx}/{len(songs)}] 📖 {title}")
        
        # Skip if vocabulary already exists
        if song.get('vocabulary'):
            print(f"   ✓ Vocabulary already exists ({len(song['vocabulary'])} words)")
            continue
        
        # Extract words from lyrics
        lines = song.get('lines', [])
        if not lines:
            print("   ⚠️  No lyrics found, skipping")
            continue
        
        words = extract_unique_words(lines)
        if not words:
            print("   ⚠️  No words extracted from lyrics, skipping")
            continue
        
        print(f"   Found {len(words)} unique words")
        
        # Generate vocabulary
        vocabulary = []
        for word_idx, word in enumerate(words, 1):
            vocab_entry = generate_vocabulary(word, language, client, model)
            
            if vocab_entry:
                vocabulary.append({
                    "word": word,
                    "translation": vocab_entry['translation'],
                    "explanation": vocab_entry['explanation']
                })
                
                if word_idx % batch_size == 0:
                    print(f"   ✓ Processed {word_idx}/{len(words)} words")
            else:
                print(f"   ⚠️  Skipped '{word}'")
        
        if vocabulary:
            song['vocabulary'] = vocabulary
            print(f"   ✅ Generated {len(vocabulary)} vocabulary entries")
        else:
            print("   ❌ No vocabulary generated")
        
        print()
    
    # Save output file
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(songs, f, ensure_ascii=False, indent=2)
        print(f"✅ Saved to {output_file}")
        return True
    except IOError as e:
        print(f"❌ Failed to write output file: {e}")
        return False


def main():
    parser = argparse.ArgumentParser(
        description="Generate vocabulary for Lyrics Trainer songs using AI"
    )
    parser.add_argument("input", help="Input JSON file with songs")
    parser.add_argument("output", nargs='?', help="Output JSON file (default: input + '-vocab')")
    parser.add_argument("--api-key", help="OpenAI API key (or set OPENAI_API_KEY env var)")
    parser.add_argument("--model", default="gpt-4o-mini", help="Model to use (default: gpt-4o-mini)")
    parser.add_argument("--language", default="Spanish", help="Language of lyrics (default: Spanish)")
    parser.add_argument("--batch-size", type=int, default=5, help="Progress update frequency")
    
    args = parser.parse_args()
    
    # Determine output file
    output_file = args.output
    if not output_file:
        input_path = Path(args.input)
        output_file = str(input_path.parent / f"{input_path.stem}-vocab.json")
    
    # Process
    success = process_songs(
        args.input,
        output_file,
        api_key=args.api_key,
        model=args.model,
        language=args.language,
        batch_size=args.batch_size
    )
    
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
