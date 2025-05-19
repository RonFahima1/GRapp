#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const translate = require('@vitalets/google-translate-api');

// Configuration
const CONFIG = {
  // Source language (always English)
  sourceLanguage: 'en',
  // Directory containing locale files
  localesDir: path.join(__dirname, '..', 'locales'),
  // Translation options
  options: {
    // Keep existing translations (won't override already translated strings)
    preserveExistingTranslations: true,
    // Mark new translations with prefix (helpful for review)
    markNewTranslations: true,
    // Prefix for new translations
    newTranslationPrefix: '🆕 ',
    // Placeholder prefix for failed translations
    placeholderPrefix: '⚠️ ',
    // Cache translations to reduce API calls
    useCache: true,
    // Skip untranslatable items (variables, placeholders, etc.)
    skipPlaceholders: true,
    // Regex to identify placeholders like {{name}}, %s, etc.
    placeholderRegex: /(\{\{.*?\}\}|%[sdfo]|__\w+__|\$\{.*?\})/g
  },
  // Rate limiting to avoid being blocked
  rateLimit: {
    // Maximum concurrent API requests
    maxConcurrentRequests: 2,
    // Delay between batches (ms)
    delayBetweenRequests: 1500,
    // Delay between individual translations (ms)
    delayBetweenTranslations: 800
  },
  // Output/reporting options
  output: {
    // Generate translation report
    generateReport: true,
    // Write report to file
    writeReportToFile: true,
    // Report file path
    reportPath: path.join(__dirname, '..', 'translation-sync-report.json')
  }
};

// Create cache directory
const CACHE_DIR = path.join(__dirname, '..', '.translation-cache');
if (CONFIG.options.useCache && !fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

// Statistics
const stats = {
  startTime: new Date(),
  endTime: null,
  totalKeys: 0,
  totalLanguages: 0,
  totalAPIRequests: 0,
  totalCharactersTranslated: 0,
  byLanguage: {}
};

// Console output with colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Helper functions
function log(message, color = '') {
  console.log(`${color}${message}${colors.reset}`);
}

function logError(message) {
  console.error(`${colors.red}${message}${colors.reset}`);
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

// Get all keys from an object (including nested)
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

// Helper to set a value at a specific path in an object
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

// Helper to get a value at a specific path in an object
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
function getCacheKey(text, sourceLang, targetLang) {
  // Create a unique but readable cache key
  const hash = Buffer.from(`${sourceLang}:${targetLang}:${text}`).toString('base64');
  return hash.replace(/[/+=]/g, '_');
}

function getFromCache(text, sourceLang, targetLang) {
  if (!CONFIG.options.useCache) return null;
  
  const cacheKey = getCacheKey(text, sourceLang, targetLang);
  const cacheFile = path.join(CACHE_DIR, `${cacheKey}.json`);
  
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

function saveToCache(text, translation, sourceLang, targetLang) {
  if (!CONFIG.options.useCache) return;
  
  const cacheKey = getCacheKey(text, sourceLang, targetLang);
  const cacheFile = path.join(CACHE_DIR, `${cacheKey}.json`);
  
  const cacheData = {
    source: text,
    translation: translation,
    sourceLang: sourceLang,
    targetLang: targetLang,
    timestamp: new Date().toISOString()
  };
  
  try {
    fs.writeFileSync(cacheFile, JSON.stringify(cacheData, null, 2), 'utf8');
  } catch (error) {
    logError(`Error saving to cache: ${error.message}`);
  }
}

// Check if text contains placeholders or variables
function containsPlaceholders(text) {
  if (typeof text !== 'string') return false;
  return CONFIG.options.placeholderRegex.test(text);
}

// Split text for safe translation (preserving placeholders)
function splitForTranslation(text) {
  if (typeof text !== 'string') return { segments: [text], isPlain: true };
  
  // If no placeholders, return as is
  if (!containsPlaceholders(text)) {
    return { segments: [text], isPlain: true };
  }
  
  // Replace placeholders with markers, then restore after translation
  const markers = [];
  let index = 0;
  
  const markedText = text.replace(CONFIG.options.placeholderRegex, (match) => {
    const marker = `__PLHR${index}__`;
    markers.push({ marker, value: match });
    index++;
    return marker;
  });
  
  return { segments: [markedText], markers, isPlain: false };
}

// Restore placeholders after translation
function restorePlaceholders(translatedText, markers) {
  if (!markers || markers.length === 0) return translatedText;
  
  let result = translatedText;
  for (const { marker, value } of markers) {
    // Create a regex with the marker to find it in the translated text
    const markerRegex = new RegExp(marker, 'g');
    result = result.replace(markerRegex, value);
  }
  
  return result;
}

// Map language codes to google-translator format
function mapLanguageCode(langCode) {
  const langMap = {
    'en': 'en',
    'ar': 'ar',
    'zh': 'zh-CN',
    'cn': 'zh-CN',
    'es': 'es',
    'fr': 'fr',
    'he': 'iw', // Hebrew is 'iw' in Google Translate
    'hi': 'hi',
    'ja': 'ja',
    'np': 'ne', // Nepali
    'pt': 'pt',
    'ro': 'ro',
    'ru': 'ru',
    'si': 'si', // Sinhala
    'th': 'th',
    'tl': 'tl', // Filipino/Tagalog
  };
  
  return langMap[langCode] || langCode;
}

// Translation function using @vitalets/google-translate-api
async function translateText(text, sourceLang, targetLang) {
  // Skip empty or non-string values
  if (!text || typeof text !== 'string' || text.trim() === '') {
    return text;
  }
  
  // Check cache first
  const cachedTranslation = getFromCache(text, sourceLang, targetLang);
  if (cachedTranslation) {
    return cachedTranslation;
  }
  
  // Track API requests
  stats.totalAPIRequests++;
  stats.totalCharactersTranslated += text.length;
  
  // Skip translation if it contains only placeholders and config says so
  if (CONFIG.options.skipPlaceholders && containsPlaceholders(text)) {
    // If text is mostly placeholders, don't translate
    const textWithoutPlaceholders = text.replace(CONFIG.options.placeholderRegex, '');
    if (textWithoutPlaceholders.trim().length < 3) {
      return text;
    }
  }
  
  // Split text to protect placeholders
  const { segments, markers, isPlain } = splitForTranslation(text);
  
  try {
    // Map language codes 
    const googleSourceLang = mapLanguageCode(sourceLang);
    const googleTargetLang = mapLanguageCode(targetLang);
    
    // Use @vitalets/google-translate-api (free)
    const result = await translate(segments[0], {
      from: googleSourceLang, 
      to: googleTargetLang
    });
    
    let translation = result.text;
    
    // Restore placeholders if needed
    if (!isPlain && markers) {
      translation = restorePlaceholders(translation, markers);
    }
    
    // Save to cache
    saveToCache(text, translation, sourceLang, targetLang);
    
    return translation;
  } catch (error) {
    logError(`Translation error: ${error.message}`);
    return `${CONFIG.options.placeholderPrefix}${text}`;
  }
}

// Process a batch of translations
async function processBatch(items, targetLang, existingTranslations) {
  const results = {};
  const sourceLang = CONFIG.sourceLanguage;
  
  // Add language stats if not yet added
  if (!stats.byLanguage[targetLang]) {
    stats.byLanguage[targetLang] = {
      total: items.length,
      new: 0,
      preserved: 0,
      failed: 0
    };
  }
  
  for (const item of items) {
    const existingValue = getValueAtPath(existingTranslations, item.path);
    
    // Skip if we already have a translation and want to preserve it
    if (CONFIG.options.preserveExistingTranslations && 
        existingValue && 
        typeof existingValue === 'string' && 
        !existingValue.startsWith(CONFIG.options.placeholderPrefix)) {
      results[item.path] = existingValue;
      stats.byLanguage[targetLang].preserved++;
      continue;
    }
    
    // Only translate strings
    if (typeof item.value === 'string') {
      try {
        const translation = await translateText(item.value, sourceLang, targetLang);
        
        // Prefix new translations if configured
        if (CONFIG.options.markNewTranslations && 
            (!existingValue || existingValue.startsWith(CONFIG.options.placeholderPrefix))) {
          results[item.path] = `${CONFIG.options.newTranslationPrefix}${translation}`;
        } else {
          results[item.path] = translation;
        }
        
        stats.byLanguage[targetLang].new++;
      } catch (error) {
        // Add placeholder prefix to mark failed translations
        results[item.path] = `${CONFIG.options.placeholderPrefix}${item.value}`;
        stats.byLanguage[targetLang].failed++;
        logError(`Failed to translate '${item.path}': ${error.message}`);
      }
    } else {
      // For non-string values (numbers, etc.), keep them as is
      results[item.path] = item.value;
    }
    
    // Add a delay between translations to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, CONFIG.rateLimit.delayBetweenTranslations));
  }
  
  return results;
}

// Main function
async function processAllTranslations() {
  // Print banner
  log('\n' + '='.repeat(70), colors.bright);
  log('🌍  FREE AUTOMATIC TRANSLATION SYNC TOOL', colors.bright + colors.cyan);
  log('='.repeat(70) + '\n', colors.bright);
  
  // Load source translations
  const sourceFile = path.join(CONFIG.localesDir, `${CONFIG.sourceLanguage}.json`);
  logInfo(`Loading source translations from ${sourceFile}...`);
  
  const sourceTranslations = readJsonFile(sourceFile);
  if (!sourceTranslations) {
    logError(`Source language file (${CONFIG.sourceLanguage}.json) not found or invalid.`);
    return false;
  }
  
  // Get all translation items from source
  const allTranslationItems = getAllKeys(sourceTranslations);
  stats.totalKeys = allTranslationItems.length;
  logSuccess(`Found ${stats.totalKeys} translation keys in source language.`);
  
  // Get target language files
  const languageFiles = fs.readdirSync(CONFIG.localesDir)
    .filter(file => file.endsWith('.json') && file !== `${CONFIG.sourceLanguage}.json`);
  
  stats.totalLanguages = languageFiles.length;
  logInfo(`Found ${stats.totalLanguages} target languages to process.`);
  
  // Create a list of languages to process in parallel with rate limiting
  const languageQueue = languageFiles.map(file => file.replace('.json', ''));
  const maxConcurrent = CONFIG.rateLimit.maxConcurrentRequests;
  
  // Process languages with concurrency limit
  const results = [];
  
  for (let i = 0; i < languageQueue.length; i += maxConcurrent) {
    const batch = languageQueue.slice(i, i + maxConcurrent);
    const batchPromises = batch.map(processLanguage);
    results.push(...(await Promise.all(batchPromises)));
    
    // Add delay between batches
    if (i + maxConcurrent < languageQueue.length) {
      await new Promise(resolve => setTimeout(resolve, CONFIG.rateLimit.delayBetweenRequests));
    }
  }
  
  // Generate final report
  stats.endTime = new Date();
  stats.totalDurationMs = stats.endTime - stats.startTime;
  
  if (CONFIG.output.generateReport) {
    logInfo('\nGenerating translation report...');
    
    if (CONFIG.output.writeReportToFile) {
      fs.writeFileSync(
        CONFIG.output.reportPath,
        JSON.stringify(stats, null, 2),
        'utf8'
      );
      logSuccess(`Report saved to ${CONFIG.output.reportPath}`);
    }
    
    // Print summary
    const durationSec = (stats.totalDurationMs / 1000).toFixed(2);
    log('\n' + '='.repeat(70), colors.bright);
    log('📊  TRANSLATION SYNC SUMMARY', colors.bright + colors.green);
    log('='.repeat(70), colors.bright);
    log(`Total duration: ${durationSec} seconds`, colors.cyan);
    log(`Total languages: ${stats.totalLanguages}`, colors.cyan);
    log(`Total keys: ${stats.totalKeys}`, colors.cyan);
    log(`Total API requests: ${stats.totalAPIRequests}`, colors.cyan);
    log(`Total characters translated: ${stats.totalCharactersTranslated}`, colors.cyan);
    
    log('\nResults by language:', colors.bright);
    for (const [lang, data] of Object.entries(stats.byLanguage)) {
      const completionRate = (((data.preserved + data.new) / data.total) * 100).toFixed(2);
      log(`  ${lang.toUpperCase()}: ${completionRate}% complete`, colors.cyan);
      log(`    - Preserved: ${data.preserved}`, data.preserved > 0 ? colors.green : '');
      log(`    - New: ${data.new}`, data.new > 0 ? colors.yellow : '');
      log(`    - Failed: ${data.failed}`, data.failed > 0 ? colors.red : '');
    }
    
    log('\n' + '='.repeat(70), colors.bright);
  }
  
  return true;
}

// Process a single language
async function processLanguage(langCode) {
  logInfo(`\n🔄 Processing ${langCode.toUpperCase()}...`);
  
  // Load source translations
  const sourceFile = path.join(CONFIG.localesDir, `${CONFIG.sourceLanguage}.json`);
  const sourceTranslations = readJsonFile(sourceFile);
  const allTranslationItems = getAllKeys(sourceTranslations);
  
  // Load existing translations for this language
  const langFilePath = path.join(CONFIG.localesDir, `${langCode}.json`);
  let existingTranslations = {};
  
  try {
    existingTranslations = readJsonFile(langFilePath) || {};
  } catch (error) {
    logWarning(`No existing translations found for ${langCode}, creating new file.`);
  }
  
  // Split items into batches
  const batchSize = 5; // Small batch size to avoid rate limiting
  const batches = [];
  
  for (let i = 0; i < allTranslationItems.length; i += batchSize) {
    batches.push(allTranslationItems.slice(i, i + batchSize));
  }
  
  logInfo(`  Processing ${batches.length} batches for ${langCode}...`);
  
  // Process all batches
  let updatedTranslations = {};
  
  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    logInfo(`  Batch ${i + 1}/${batches.length} for ${langCode}...`, colors.dim);
    
    const batchResults = await processBatch(batch, langCode, existingTranslations);
    
    // Update translations object
    for (const path in batchResults) {
      updatedTranslations = setValueAtPath(updatedTranslations, path, batchResults[path]);
    }
    
    // Add delay between batches
    if (i < batches.length - 1) {
      await new Promise(resolve => setTimeout(resolve, CONFIG.rateLimit.delayBetweenRequests));
    }
  }
  
  // Write updated translations back to file
  fs.writeFileSync(langFilePath, JSON.stringify(updatedTranslations, null, 2), 'utf8');
  
  // Get completion statistics
  const langStats = stats.byLanguage[langCode];
  const completionRate = (((langStats.preserved + langStats.new) / langStats.total) * 100).toFixed(2);
  
  logSuccess(`  ✅ ${langCode.toUpperCase()}: ${completionRate}% complete (${langStats.new} new, ${langStats.preserved} preserved, ${langStats.failed} failed)`);
  
  return {
    language: langCode,
    stats: langStats
  };
}

// Command-line argument processing
const args = process.argv.slice(2);
const showHelp = args.includes('--help') || args.includes('-h');
const dryRun = args.includes('--dry-run');
const forceAll = args.includes('--force-all');
const noCache = args.includes('--no-cache');
const singleLang = args.find(arg => arg.startsWith('--lang='));
const targetLang = singleLang ? singleLang.replace('--lang=', '') : null;

if (showHelp) {
  log(`
🌐 Free Auto-Translation Script for i18n JSON files
=================================================

Automatically translates your English language file (en.json) to all other
language files in your locales directory using Google Translate for FREE,
without requiring any API keys.

Usage:
  node scripts/free-translator.js [options]

Options:
  --help, -h       Show this help message
  --dry-run        Simulate translation without writing files
  --force-all      Override existing translations (don't preserve)
  --no-cache       Don't use cached translations
  --lang=CODE      Only translate a single language (e.g. --lang=es)
  
Examples:
  node scripts/free-translator.js                # Normal run
  node scripts/free-translator.js --dry-run      # Test without writing files
  node scripts/free-translator.js --force-all    # Override all existing translations
  node scripts/free-translator.js --lang=fr      # Only translate French
  `, colors.bright);
  process.exit(0);
}

// Apply command-line options
if (dryRun) {
  logWarning('🧪 DRY RUN MODE: No files will be modified');
  // Keep existing configuration, just don't write files
  // We'll override the file writing functions
  const originalWriteFileSync = fs.writeFileSync;
  fs.writeFileSync = (filePath, data, options) => {
    if (filePath.endsWith('.json') && path.dirname(filePath) === CONFIG.localesDir) {
      logInfo(`[DRY RUN] Would write to ${path.basename(filePath)}`);
      return; // Skip writing
    }
    return originalWriteFileSync(filePath, data, options);
  };
}

if (forceAll) {
  logWarning('⚠️ FORCE MODE: Overriding existing translations');
  CONFIG.options.preserveExistingTranslations = false;
}

if (noCache) {
  logWarning('⚠️ CACHE DISABLED: Not using cached translations');
  CONFIG.options.useCache = false;
}

if (targetLang) {
  logWarning(`🌐 SINGLE LANGUAGE MODE: Only translating to ${targetLang.toUpperCase()}`);
}

// Run the script
(async () => {
  try {
    if (targetLang) {
      // Process single language
      await processLanguage(targetLang);
      logSuccess('\n✨ Translation for single language completed successfully!');
    } else {
      // Process all languages
      const success = await processAllTranslations();
      if (success) {
        logSuccess('\n✨ Translation sync completed successfully!');
      } else {
        logError('\n❌ Translation sync failed.');
        process.exit(1);
      }
    }
  } catch (error) {
    logError(`\n❌ An error occurred: ${error.message}`);
    process.exit(1);
  }
})();
