# Automatic Translation System for the Remit App

This guide explains how to use the automatic translation system I've created for your app, which allows you to make changes to only the English translation file and automatically update all other language files.

## Quick Start (FREE Version - No API Key Required)

1. Install required dependencies:
   ```
   npm install google-translator
   ```

2. Run the free translation script after updating the English file:
   ```
   node scripts/translate-from-english-free.js
   ```

3. That's it! No API keys or accounts needed!

## How It Works

1. You only need to update the `/locales/en.json` file with new English text
2. Run the script to automatically translate to all other languages
3. Existing valid translations are preserved by default
4. New translations are marked with `🆕` for easy review
5. Missing/failed translations are marked with `⚠️`

## Features

- **Smart Translation**: Handles placeholders like `{{name}}` properly
- **Caching**: Stores translations to reduce API calls
- **Concurrency Control**: Respects API rate limits
- **Detailed Reporting**: Generates summary of translation status
- **Translation Quality**: Uses professional translation APIs

## Configuration

All options can be configured in the `CONFIG` object at the top of the `scripts/translate-from-english.js` file:

- Choose between Google Translate or DeepL APIs
- Set concurrency and rate limits
- Configure preservation options for existing translations
- Customize markers for new translations

## Command Line Options

```
node scripts/translate-from-english.js --help     # Show help
node scripts/translate-from-english.js --dry-run  # Test without changing files
node scripts/translate-from-english.js --force-all # Override existing translations
node scripts/translate-from-english.js --no-cache # Don't use cached translations
```

## Translation Options

### FREE Option (No API Key Required)

The free version uses the `google-translator` package which doesn't require an API key:

```
node scripts/translate-from-english-free.js
```

Benefits:
- No signup required
- No API key needed
- Completely free to use
- Handles all language translations

Limitations:
- Slightly slower (throttled to avoid IP blocking)
- May have occasional connection issues
- Less reliable for very large translation jobs

### Professional Option (API Key Required)

For higher quality and more reliable translations, you can still use the original script with a paid API:

```
node scripts/translate-from-english.js
```

This requires:
1. **Google Translate API**:
   - Sign up for Google Cloud
   - Enable the Translation API
   - Create an API key
   - Set `useGoogleTranslate: true` in the config

2. **DeepL API** (highest quality):
   - Sign up at DeepL.com/pro (or free tier)
   - Create an API key
   - Set `useDeepL: true` in the config

## Workflow Recommendation

1. Make all your text changes in the English file
2. Run the translation script: `node scripts/translate-from-english.js`
3. Review the new translations (marked with 🆕)
4. If needed, manually adjust any translations 
5. When translations are reviewed, run with `--force-all` to remove the 🆕 markers

This approach ensures you only need to manage one language file for most changes, while maintaining high-quality translations across all supported languages.
