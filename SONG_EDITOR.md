# Song Editor Feature

## Overview

The **Song Editor** feature allows you to directly edit a song's JSON data in the library. This is useful for:

- Changing song metadata (title, artist, album)
- Adding or removing lyrics lines
- Editing vocabulary data (translations, explanations)
- Adding pronunciation hints
- Modifying line structure for better training
- Any other JSON modifications

## Accessing the Editor

### From the Song Library

1. Go to the **"Songs"** tab
2. Select the **"JSON library"** sub-tab
3. In the song list, find your song
4. Click the **Edit** button (pencil icon) to the left of the Delete button
5. The editor modal will open with the song's JSON

## Editor Interface

### Modal Components

- **Header**: Shows "Edit song data (JSON)" title with a close button (×)
- **Editor Area**: Large text area with JSON content and monospace font
- **Feedback Area**: Shows success/error messages
- **Footer**: Cancel and Save Changes buttons

### Features

- **Full JSON Editing**: Edit any field of the song
- **Syntax Highlighting**: Monospace font makes JSON readable
- **Error Handling**: Parse errors are caught and displayed
- **Validation**: Updates are validated before saving
- **Undo Option**: Cancel button discards changes

## Editing Song Data

### Basic Song Structure

```json
{
  "id": "song-123",
  "title": "Song Title",
  "artist": "Artist Name",
  "album": "Album Name",
  "createdAt": "2026-02-15T12:00:00.000Z",
  "lines": [
    "First line",
    "Second line",
    "Third line"
  ]
}
```

### With Vocabulary Data

```json
{
  "id": "song-123",
  "title": "La Bamba",
  "artist": "Ritchie Valens",
  "lines": [
    "Para bailar la bamba",
    "Se necesita una poca de gracia"
  ],
  "vocabulary": [
    {
      "word": "bailar",
      "translation": "to dance",
      "explanation": "To move rhythmically to music"
    }
  ]
}
```

### Common Edits

#### Adding Lines
```json
"lines": [
  "Line 1",
  "Line 2",
  "Line 3",
  "New line added here"  // Add new lines
]
```

#### Editing Lyrics
Simply modify the text in any line:
```json
"lines": [
  "Original line",
  "Modified line"  // Change text here
]
```

#### Adding Vocabulary
Add or modify vocabulary entries:
```json
"vocabulary": [
  {
    "word": "palabra",
    "translation": "word",
    "explanation": "A unit of language"
  }
]
```

#### Adding Hints
Extend the Song type to include hints (custom field):
```json
{
  "id": "...",
  "title": "...",
  "lines": ["..."],
  "hints": [
    {
      "lineIndex": 0,
      "text": "Pronunciation: bah-ee-lar"
    }
  ]
}
```

## Workflow Examples

### Example 1: Fix a Typo in Lyrics

1. Click Edit on the song
2. Find the line with the typo
3. Correct the text
4. Click "Save Changes"

### Example 2: Add Vocabulary to Multiple Words

1. Click Edit on the song
2. Add vocabulary entries to the `vocabulary` array
3. Click "Save Changes"

```json
"vocabulary": [
  {"word": "bailar", "translation": "to dance"},
  {"word": "gracia", "translation": "grace"},
  {"word": "necesita", "translation": "needs"}
]
```

### Example 3: Extend Lines in a Song

If you want to add more lyrics:

1. Click Edit
2. Add more strings to the `lines` array
3. Save

### Example 4: Add Pronunciation Hints (Custom Extension)

You can add custom fields for your own use:

```json
{
  "id": "...",
  "title": "...",
  "lines": ["..."],
  "hints": [
    {"lineIndex": 0, "hint": "Sounds like: bah-ee-lar"}
  ]
}
```

Note: Standard fields that the app uses are: `id`, `title`, `artist`, `album`, `createdAt`, `lines`, `vocabulary`

## JSON Format Rules

### Required Fields
- `title` (string) - Song title
- `lines` (array of strings) - At least 2 lines
- At least one line must have content

### Optional Fields
- `id` (string) - Unique identifier (auto-generated if missing)
- `artist` (string) - Artist name
- `album` (string) - Album name
- `createdAt` (string) - ISO date string
- `vocabulary` (array) - Word meanings

### Vocabulary Format
Each vocabulary item has:
```json
{
  "word": "spanish-word",
  "translation": "English translation",  // Optional
  "explanation": "Detailed explanation"  // Optional
}
```

At least one of `translation` or `explanation` is required per word.

## Error Handling

### JSON Parse Errors
If your JSON is invalid (syntax error), you'll see:
```
JSON parsing error: [error message]
```

**Fix**: Check your JSON syntax and try again

### Invalid Song Structure
If required fields are missing:
```
JSON parsing error: Invalid song structure
```

**Fix**: Ensure the song has:
- `title` (not empty)
- `lines` (array with at least 2 lines)

## Tips & Best Practices

### 1. Backup Your Data
- Export your songs before making bulk edits
- Keep multiple versions if making major changes

### 2. Validate JSON
- Use a JSON validator (jsonlint.com) before pasting complex edits
- Check for missing commas and quotes

### 3. Batch Editing
- For many songs, consider exporting all, editing in a text editor, then re-importing
- The individual editor is best for small changes to specific songs

### 4. Song ID
- Don't change the `id` field - it identifies the song
- The app will preserve it even if you edit other fields

### 5. Dates
- `createdAt` should be ISO 8601 format: `"2026-02-15T12:00:00.000Z"`
- This is set automatically when songs are created

### 6. Line Management
- Each line is a separate string in the `lines` array
- Empty lines are trimmed during import
- Minimum 2 lines required

## Keyboard Shortcuts

In the text area:
- `Tab` - Indent code
- `Ctrl+A` - Select all
- `Ctrl+Z` - Undo (browser-level)

## Mobile Considerations

On mobile devices:
- The modal is responsive
- Text area is fully editable
- You may want a landscape orientation for better visibility
- Consider exporting/editing on desktop for complex changes

## Custom Extensions

You can add your own fields to songs for app-specific features:

```json
{
  "id": "...",
  "title": "...",
  "lines": ["..."],
  "hints": [{"text": "custom hint", "type": "pronunciation"}],
  "customField": "custom value"
}
```

The app will preserve these fields when you edit through the JSON editor, though it won't use them directly.

## Troubleshooting

### "Invalid song structure" Error

**Cause**: Missing required fields  
**Solution**: Ensure you have:
```json
{
  "title": "Your Title",
  "lines": ["Line 1", "Line 2"]
}
```

### Changes Not Saved

**Cause**: Forgot to click "Save Changes"  
**Solution**: The Cancel button closes without saving. Make sure to click "Save Changes"

### Can't Edit Modal

**Cause**: Modal is read-only  
**Solution**: The modal should be editable. Try refreshing the page if issues persist

### JSON Gets Reformatted

**Cause**: The app validates and reformats JSON on save  
**Solution**: This is normal and doesn't affect functionality

## Limits & Considerations

- **Text Area Size**: 20 rows visible (scrollable for longer content)
- **File Size**: Limited by browser memory (typically 100MB+)
- **Lines**: No strict limit, but 1000+ lines will be slow
- **Modal Size**: Responsive, up to 800px wide on desktop

## See Also

- [Vocabulary Training Feature](./VOCABULARY_TRAINING.md)
- [Song JSON Format](./VOCABULARY_TRAINING.md#json-format-enhancement)
- [Quick Start Guide](./VOCABULARY_QUICK_START.md)
