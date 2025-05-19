const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration
const CONFIG = {
  sourceLanguage: 'en',
  localesDir: path.join(__dirname, '..', 'locales'),
  preserveExisting: true,
  newTranslationPrefix: '🆕 ',
  placeholderPrefix: '⚠️ ',
  useCache: true,
  cacheDir: path.join(__dirname, '..', '.translation-cache'),
  minDelayMs: 1000,  // Minimum delay between API calls to avoid rate limiting
  batchSize: 5,      // Number of translations per batch
  concurrentLanguages: 1  // Number of languages to process concurrently
};

// Create cache directory if needed
if (CONFIG.useCache && !fs.existsSync(CONFIG.cacheDir)) {
  fs.mkdirSync(CONFIG.cacheDir, { recursive: true });
}

// Statistics tracking
const stats = {
  startTime: new Date(),
  endTime: null,
  totalKeys: 0,
  totalLanguages: 0,
  languages: {}
};

// Console formatting
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// Map language codes for translation service
const langMap = {
  'en': 'en',
  'ar': 'ar',
  'cn': 'zh-CN',
  'zh': 'zh-CN',
  'es': 'es',
  'fr': 'fr',
  'he': 'iw',  // Hebrew
  'hi': 'hi',
  'ja': 'ja',
  'np': 'ne',  // Nepali
  'pt': 'pt',
  'ro': 'ro',
  'ru': 'ru',
  'si': 'si',  // Sinhala
  'th': 'th',
  'tl': 'tl'   // Filipino/Tagalog
};

// Helper functions
function log(message, color = '') {
  console.log(`${color}${message}${colors.reset}`);
}

function logError(message) {
  log(message, colors.red);
}

function logSuccess(message) {
  log(message, colors.green);
}

function logInfo(message) {
  log(message, colors.blue);
}

function logWarning(message) {
  log(message, colors.yellow);
}

// Read JSON file
function readJsonFile(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    logError(`Error reading ${filePath}: ${error.message}`);
    return null;
  }
}

// Get all keys from an object (including nested keys)
function getAllKeys(obj, currentPath = '') {
  let keys = [];
  
  for (const key in obj) {
    const newPath = currentPath ? `${currentPath}.${key}` : key;
    
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      keys = [...keys, ...getAllKeys(obj[key], newPath)];
    } else {
      keys.push({ path: newPath, value: obj[key] });
    }
  }
  
  return keys;
}

// Set a value at a specific path in an object
function setValueAtPath(obj, path, value) {
  const parts = path.split('.');
  let current = obj;
  
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (!current[part]) {
      current[part] = {};
    }
    current = current[part];
  }
  
  current[parts[parts.length - 1]] = value;
  return obj;
}

// Get a value at a specific path in an object
function getValueAtPath(obj, path) {
  const parts = path.split('.');
  let current = obj;
  
  for (let i = 0; i < parts.length; i++) {
    if (current === undefined || current === null) return undefined;
    current = current[parts[i]];
  }
  
  return current;
}

// Cache functions
function getCacheKey(text, targetLang) {
  const hash = Buffer.from(`${targetLang}:${text}`).toString('base64');
  return hash.replace(/[/+=]/g, '_');
}

function getFromCache(text, targetLang) {
  if (!CONFIG.useCache) return null;
  
  const cacheKey = getCacheKey(text, targetLang);
  const cacheFile = path.join(CONFIG.cacheDir, `${cacheKey}.json`);
  
  if (fs.existsSync(cacheFile)) {
    try {
      const cacheData = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
      return cacheData.translation;
    } catch (error) {
      return null;
    }
  }
  
  return null;
}

function saveToCache(text, translation, targetLang) {
  if (!CONFIG.useCache) return;
  
  const cacheKey = getCacheKey(text, targetLang);
  const cacheFile = path.join(CONFIG.cacheDir, `${cacheKey}.json`);
  
  const cacheData = {
    source: text,
    translation: translation,
    targetLang: targetLang,
    timestamp: new Date().toISOString()
  };
  
  try {
    fs.writeFileSync(cacheFile, JSON.stringify(cacheData, null, 2), 'utf8');
  } catch (error) {
    logError(`Error saving to cache: ${error.message}`);
  }
}

// Simple translation function - can be replaced with actual API call
// For now, we'll use a simplified mock translation
async function translateText(text, targetLang) {
  // Skip empty or non-string values
  if (!text || typeof text !== 'string' || text.trim() === '') {
    return text;
  }
  
  // Check cache first
  const cachedTranslation = getFromCache(text, targetLang);
  if (cachedTranslation) {
    return cachedTranslation;
  }
  
  // For demonstration, this is a simple mock translation that would be replaced with an actual API call
  // The format is "[TARGET_LANG] Original Text" 
  const translation = `[${targetLang.toUpperCase()}] ${text}`;
  
  // In a real implementation, you would call a translation API here
  // For example:
  // const translation = await callTranslationAPI(text, 'en', targetLang);
  
  // Uncomment below for a mockup of what the translation would look like
  // Different prefixes for different languages to simulate translation
  const prefixes = {
    'fr': 'Le ',
    'es': 'El ',
    'de': 'Das ',
    'it': 'Il ',
    'pt': 'O ',
    'ru': 'Этот ',
    'ja': 'この',
    'zh': '这个',
    'ar': 'هذا ',
    'hi': 'यह ',
    'th': 'นี้ ',
    'nl': 'De ',
    'pl': 'Ten ',
    'tr': 'Bu ',
    'ko': '이 '
  };
  
  const mockTranslation = prefixes[targetLang] ? `${prefixes[targetLang]}${text}` : translation;
  
  // Cache the result
  saveToCache(text, mockTranslation, targetLang);
  
  return mockTranslation;
}

// Process a batch of translations
async function processBatch(items, targetLang, existingTranslations) {
  const results = {};
  
  // Initialize language stats if needed
  if (!stats.languages[targetLang]) {
    stats.languages[targetLang] = {
      total: 0,
      preserved: 0,
      new: 0,
      failed: 0
    };
  }
  
  const langStats = stats.languages[targetLang];
  langStats.total += items.length;
  
  for (const item of items) {
    const existingValue = getValueAtPath(existingTranslations, item.path);
    
    // Skip if we want to preserve existing translations and have one
    if (CONFIG.preserveExisting && 
        existingValue && 
        typeof existingValue === 'string' && 
        !existingValue.startsWith(CONFIG.placeholderPrefix)) {
      results[item.path] = existingValue;
      langStats.preserved++;
      continue;
    }
    
    // Only translate strings
    if (typeof item.value === 'string') {
      try {
        // Get translation
        const translation = await translateText(item.value, targetLang);
        
        // Add prefix for new translations
        results[item.path] = `${CONFIG.newTranslationPrefix}${translation}`;
        langStats.new++;
      } catch (error) {
        // Mark failed translations
        results[item.path] = `${CONFIG.placeholderPrefix}${item.value}`;
        langStats.failed++;
        logError(`Failed to translate '${item.path}': ${error.message}`);
      }
    } else {
      // Keep non-string values as is
      results[item.path] = item.value;
    }
    
    // Add delay to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, CONFIG.minDelayMs));
  }
  
  return results;
}

// Process a single language
async function processLanguage(langCode) {
  logInfo(`\nProcessing ${langCode.toUpperCase()}...`);
  
  // Load source translations
  const sourceFile = path.join(CONFIG.localesDir, `${CONFIG.sourceLanguage}.json`);
  const sourceTranslations = readJsonFile(sourceFile);
  if (!sourceTranslations) {
    logError(`Error: Source language file not found or invalid.`);
    return false;
  }
  
  const items = getAllKeys(sourceTranslations);
  
  // Load existing translations
  const langFilePath = path.join(CONFIG.localesDir, `${langCode}.json`);
  let existingTranslations = {};
  try {
    existingTranslations = readJsonFile(langFilePath) || {};
  } catch (error) {
    logWarning(`No existing translations found for ${langCode}, creating new file.`);
  }
  
  // Split into batches
  const batches = [];
  for (let i = 0; i < items.length; i += CONFIG.batchSize) {
    batches.push(items.slice(i, i + CONFIG.batchSize));
  }
  
  logInfo(`  Processing ${batches.length} batches for ${langCode}...`);
  
  // Process all batches
  let updatedTranslations = {};
  for (let i = 0; i < batches.length; i++) {
    logInfo(`  Batch ${i + 1}/${batches.length}...`);
    
    const batchResults = await processBatch(batches[i], langCode, existingTranslations);
    
    // Update translations
    for (const path in batchResults) {
      updatedTranslations = setValueAtPath(updatedTranslations, path, batchResults[path]);
    }
  }
  
  // Write updated translations to file
  try {
    if (!DRY_RUN) {
      fs.writeFileSync(langFilePath, JSON.stringify(updatedTranslations, null, 2), 'utf8');
      logSuccess(`  ✅ Wrote updated translations to ${langCode}.json`);
    } else {
      logWarning(`  [DRY RUN] Would write to ${langCode}.json`);
    }
    return true;
  } catch (error) {
    logError(`  Error writing translations for ${langCode}: ${error.message}`);
    return false;
  }
}

// Main function
async function main() {
  log('\n' + '='.repeat(70), colors.bright);
  log('🌍  TRANSLATION SYNC TOOL (READY FOR API INTEGRATION)', colors.bright + colors.cyan);
  log('='.repeat(70) + '\n', colors.bright);
  
  // Show configuration
  logInfo('Configuration:');
  logInfo(`  Source Language: ${CONFIG.sourceLanguage}`);
  logInfo(`  Preserve Existing: ${CONFIG.preserveExisting}`);
  logInfo(`  Cache Enabled: ${CONFIG.useCache}`);
  logInfo(`  Dry Run: ${DRY_RUN ? 'Yes' : 'No'}`);
  if (SINGLE_LANG) {
    logInfo(`  Target Language: ${SINGLE_LANG}`);
  }
  log('');
  
  // Load source translations
  const sourceFile = path.join(CONFIG.localesDir, `${CONFIG.sourceLanguage}.json`);
  logInfo(`Loading source translations from ${sourceFile}...`);
  
  const sourceTranslations = readJsonFile(sourceFile);
  if (!sourceTranslations) {
    logError(`Source language file (${CONFIG.sourceLanguage}.json) not found or invalid.`);
    return false;
  }
  
  // Get all translation items and keys
  const allItems = getAllKeys(sourceTranslations);
  stats.totalKeys = allItems.length;
  logSuccess(`Found ${stats.totalKeys} translation keys in source language.`);
  
  // Get target languages
  let languagesToProcess = [];
  
  if (SINGLE_LANG) {
    languagesToProcess = [SINGLE_LANG];
  } else {
    // Get all language files except the source language
    const languageFiles = fs.readdirSync(CONFIG.localesDir)
      .filter(file => file.endsWith('.json') && file !== `${CONFIG.sourceLanguage}.json`)
      .map(file => file.replace('.json', ''));
    
    languagesToProcess = languageFiles;
  }
  
  stats.totalLanguages = languagesToProcess.length;
  logInfo(`Found ${stats.totalLanguages} languages to process.`);
  
  // Process languages
  const results = [];
  const concurrentLimit = CONFIG.concurrentLanguages;
  
  for (let i = 0; i < languagesToProcess.length; i += concurrentLimit) {
    const batch = languagesToProcess.slice(i, i + concurrentLimit);
    const promises = batch.map(processLanguage);
    
    results.push(...(await Promise.all(promises)));
  }
  
  // Generate report
  stats.endTime = new Date();
  stats.totalDurationMs = stats.endTime - stats.startTime;
  
  log('\n' + '='.repeat(70), colors.bright);
  log('📊  TRANSLATION SYNC SUMMARY', colors.bright + colors.green);
  log('='.repeat(70), colors.bright);
  
  const durationSec = (stats.totalDurationMs / 1000).toFixed(2);
  log(`Total duration: ${durationSec} seconds`, colors.cyan);
  log(`Total languages: ${stats.totalLanguages}`, colors.cyan);
  log(`Total keys: ${stats.totalKeys}`, colors.cyan);
  
  log('\nResults by language:', colors.bright);
  for (const [lang, data] of Object.entries(stats.languages)) {
    const completionRate = (((data.preserved + data.new) / data.total) * 100).toFixed(2);
    log(`  ${lang.toUpperCase()}: ${completionRate}% complete`, colors.cyan);
    log(`    - Preserved: ${data.preserved}`, colors.green);
    log(`    - New: ${data.new}`, colors.yellow);
    log(`    - Failed: ${data.failed}`, colors.red);
  }
  
  log('\n' + '='.repeat(70), colors.bright);
  
  return true;
}

// Parse command line arguments
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const SINGLE_LANG = args.find(arg => arg.startsWith('--lang='))?.replace('--lang=', '');
const FORCE_ALL = args.includes('--force-all');
const HELP = args.includes('--help') || args.includes('-h');

if (HELP) {
  log(`
🌐 Translation Sync Tool
========================

This tool automatically syncs translations from English to all other languages.
It's ready to integrate with any translation API of your choice.

Usage: 
  node translate-all.js [options]

Options:
  --help, -h       Show this help message
  --dry-run        Simulate translation without writing files
  --lang=CODE      Process only a specific language (e.g. --lang=es)
  --force-all      Override existing translations

How to use this script:
1. Simply run it to update all language files from English
2. Update the translateText() function to integrate with your preferred API
3. All translations are cached to minimize API calls

Example:
  node translate-all.js --dry-run     # Test without making changes
  node translate-all.js --lang=fr     # Only update French translations
`);
  process.exit(0);
}

// Toggle config based on arguments
if (FORCE_ALL) {
  CONFIG.preserveExisting = false;
  logWarning('Force mode enabled: Will override existing translations');
}

// Run the script
main()
  .then(success => {
    if (success) {
      logSuccess('\n✨ Translation sync completed successfully!');
    } else {
      logError('\n❌ Translation sync failed.');
      process.exit(1);
    }
  })
  .catch(error => {
    logError(`\n❌ An error occurred: ${error.message}`);
    process.exit(1);
  });
