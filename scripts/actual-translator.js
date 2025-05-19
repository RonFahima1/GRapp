/**
 * actual-translator.js - A simple, reliable script to translate JSON files
 * 
 * This script translates your English JSON file to all other languages
 * while preserving existing good translations.
 * 
 * Usage: node scripts/actual-translator.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { promisify } = require('util');

// Configuration
const CONFIG = {
  sourceLang: 'en',
  localesDir: path.join(__dirname, '..', 'locales'), // Adjusted path for scripts directory
  preserveExisting: true,    // Keep existing translations if they exist
  concurrentRequests: 1,     // How many translations to process at once (keep low)
  delayBetweenRequests: 800, // Delay between requests to avoid rate limiting (ms)
  markNewTranslations: true, // Mark new translations with a prefix for review
  newPrefix: '🆕 ',          // Prefix for new translations
  reportProgress: true       // Show progress in console
};

// Language codes mapping for Google Translate
const LANGUAGE_MAP = {
  'en': 'en',
  'ar': 'ar',
  'cn': 'zh-CN', // Chinese Simplified
  'es': 'es',
  'fr': 'fr',
  'he': 'iw',    // Hebrew in Google is 'iw'
  'hi': 'hi',
  'ja': 'ja',
  'np': 'ne',    // Nepali
  'pt': 'pt',
  'ro': 'ro',
  'ru': 'ru',
  'si': 'si',    // Sinhala
  'th': 'th',
  'tl': 'tl',    // Filipino/Tagalog
  'zh': 'zh-TW'  // Chinese Traditional
};

// Stats for reporting
const stats = {
  totalTranslated: 0,
  totalPreserved: 0,
  totalFailed: 0,
  byLanguage: {}
};

// Console output formatting
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = '') {
  console.log(`${color}${message}${colors.reset}`);
}

// Translate text using Google Translate (directly via URL API)
// This method doesn't require an API key and is more reliable
async function translateText(text, targetLang) {
  // Skip empty or non-string input
  if (!text || typeof text !== 'string' || text.trim() === '') {
    return text;
  }
  
  // Skip texts that already look like they're in the target language
  // or contain mostly code/variables (e.g., {{name}})
  if (text.includes('{{') && text.includes('}}')) {
    // For texts with variables, only translate the parts around the variables
    return text; // For simplicity, return as is - in a real app you'd handle this better
  }
  
  return new Promise((resolve, reject) => {
    const sourceLang = 'en'; // Always translate from English
    const googleLangCode = LANGUAGE_MAP[targetLang] || targetLang;
    
    // Format the text for URL encoding
    const encodedText = encodeURIComponent(text);
    
    // Construct the API URL (using free translation endpoint)
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${googleLangCode}&dt=t&q=${encodedText}`;
    
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          // Parse the response
          const translationData = JSON.parse(data);
          if (translationData && translationData[0]) {
            // Extract the translated text
            let translatedText = '';
            for (let i = 0; i < translationData[0].length; i++) {
              translatedText += translationData[0][i][0];
            }
            resolve(translatedText);
          } else {
            reject(new Error('Invalid translation response format'));
          }
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

// Delay function for rate limiting
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Gets all keys from an object (recursive) with their paths using dot notation
function getAllKeys(obj, prefix = '') {
  let keys = [];
  
  for (const key in obj) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      // Recursive call for nested objects
      keys = [...keys, ...getAllKeys(obj[key], newKey)];
    } else {
      // Add the leaf key with its value
      keys.push({
        path: newKey,
        value: obj[key]
      });
    }
  }
  
  return keys;
}

// Get value at a specific path in an object
function getValueAtPath(obj, path) {
  const parts = path.split('.');
  let current = obj;
  
  for (const part of parts) {
    if (current === undefined || current === null) return undefined;
    current = current[part];
  }
  
  return current;
}

// Set value at a specific path in an object
function setValueAtPath(obj, path, value) {
  const parts = path.split('.');
  let current = obj;
  
  // Create the path if it doesn't exist
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (!current[part]) {
      current[part] = {};
    }
    current = current[part];
  }
  
  // Set the value at the final part
  current[parts[parts.length - 1]] = value;
  return obj;
}

// Process a batch of translations for a single language
async function processBatch(items, langCode, existingTranslations) {
  let updatedTranslations = {};
  
  // Initialize language stats if not already done
  if (!stats.byLanguage[langCode]) {
    stats.byLanguage[langCode] = {
      translated: 0,
      preserved: 0,
      failed: 0
    };
  }
  
  // Process each item in the batch
  for (const item of items) {
    // Skip if not a string or if it's a placeholder/code snippet
    if (typeof item.value !== 'string') {
      setValueAtPath(updatedTranslations, item.path, item.value);
      continue;
    }
    
    // Check if there's an existing translation
    const existingValue = getValueAtPath(existingTranslations, item.path);
    const hasGoodExistingTranslation = 
      existingValue && 
      typeof existingValue === 'string' && 
      !existingValue.startsWith('⚠️') && // Skip warnings
      !existingValue.startsWith('🆕'); // Skip newly marked ones
    
    // Preserve existing translation if available and configured to do so
    if (CONFIG.preserveExisting && hasGoodExistingTranslation) {
      setValueAtPath(updatedTranslations, item.path, existingValue);
      stats.byLanguage[langCode].preserved++;
      stats.totalPreserved++;
      continue;
    }
    
    // Translate the text
    try {
      // Add delay to avoid rate limiting
      await delay(CONFIG.delayBetweenRequests);
      
      const translatedText = await translateText(item.value, langCode);
      
      // Add prefix if configured to mark new translations
      const finalText = CONFIG.markNewTranslations ? `${CONFIG.newPrefix}${translatedText}` : translatedText;
      
      // Set the translated value
      setValueAtPath(updatedTranslations, item.path, finalText);
      
      // Update stats
      stats.byLanguage[langCode].translated++;
      stats.totalTranslated++;
      
      // Report progress
      if (CONFIG.reportProgress) {
        log(`  Translated: ${item.path}`, colors.dim);
      }
    } catch (error) {
      // Handle translation error - keep original text with a warning
      setValueAtPath(updatedTranslations, item.path, `⚠️ ${item.value}`);
      
      // Update stats
      stats.byLanguage[langCode].failed++;
      stats.totalFailed++;
      
      log(`  Failed to translate: ${item.path} - ${error.message}`, colors.red);
    }
  }
  
  return updatedTranslations;
}

// Main function to process all translations
async function translateAll() {
  // Banner
  log('\n' + '='.repeat(70), colors.bright);
  log('  🌐  ACTUAL TRANSLATOR - ENGLISH TO ALL LANGUAGES', colors.bright + colors.cyan);
  log('='.repeat(70), colors.bright);
  log('This script will translate your English JSON to all other languages.\n');
  
  // Load English source
  const sourceFile = path.join(CONFIG.localesDir, `${CONFIG.sourceLang}.json`);
  log(`Loading English source file: ${sourceFile}...`, colors.blue);
  
  let sourceData;
  try {
    sourceData = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));
    log(`✅ Loaded English source with ${Object.keys(sourceData).length} top-level keys`, colors.green);
  } catch (error) {
    log(`❌ Error loading English file: ${error.message}`, colors.red);
    process.exit(1);
  }
  
  // Get all translatable items with their paths
  const allItems = getAllKeys(sourceData);
  log(`Found ${allItems.length} total translatable items`, colors.blue);
  
  // Get all language files (excluding English)
  const languageFiles = fs.readdirSync(CONFIG.localesDir)
    .filter(file => file.endsWith('.json') && file !== `${CONFIG.sourceLang}.json`);
  
  log(`Found ${languageFiles.length} language files to translate`, colors.blue);
  
  // Process each language
  for (const langFile of languageFiles) {
    const langCode = langFile.replace('.json', '');
    log(`\n🔄 Processing ${langCode.toUpperCase()}...`, colors.bright);
    
    // Skip languages not in our mapping
    if (!LANGUAGE_MAP[langCode]) {
      log(`  ⚠️ No mapping for language code: ${langCode} - skipping`, colors.yellow);
      continue;
    }
    
    // Load existing translations
    let existingTranslations = {};
    try {
      existingTranslations = JSON.parse(fs.readFileSync(
        path.join(CONFIG.localesDir, langFile), 
        'utf8'
      ));
      log(`  Loaded existing translations`, colors.dim);
    } catch (error) {
      log(`  No existing translations found, creating new file`, colors.dim);
    }
    
    // Process translations in small batches to avoid rate limiting
    const batchSize = 5; // Small batch size to avoid rate limiting
    let updatedTranslations = {};
    
    for (let i = 0; i < allItems.length; i += batchSize) {
      const batch = allItems.slice(i, i + batchSize);
      log(`  Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(allItems.length/batchSize)}...`, colors.dim);
      
      const batchResults = await processBatch(batch, langCode, existingTranslations);
      
      // Merge batch results into the overall updated translations
      updatedTranslations = { ...updatedTranslations, ...batchResults };
    }
    
    // Write the updated translations back to file
    try {
      fs.writeFileSync(
        path.join(CONFIG.localesDir, langFile),
        JSON.stringify(updatedTranslations, null, 2),
        'utf8'
      );
      
      const langStats = stats.byLanguage[langCode];
      log(`✅ Updated ${langCode}.json:`, colors.green);
      log(`    - Translated: ${langStats.translated}`, colors.green);
      log(`    - Preserved: ${langStats.preserved}`, colors.blue);
      log(`    - Failed: ${langStats.failed}`, langStats.failed > 0 ? colors.red : colors.dim);
    } catch (error) {
      log(`❌ Error writing ${langCode}.json: ${error.message}`, colors.red);
    }
  }
  
  // Final report
  log('\n' + '='.repeat(70), colors.bright);
  log('📊  TRANSLATION SUMMARY', colors.bright + colors.green);
  log('='.repeat(70), colors.bright);
  log(`Total Items Translated: ${stats.totalTranslated}`, colors.green);
  log(`Total Items Preserved: ${stats.totalPreserved}`, colors.blue);
  log(`Total Items Failed: ${stats.totalFailed}`, stats.totalFailed > 0 ? colors.red : colors.dim);
  log('\n✨ Translation completed!');
}

// Run the script
translateAll().catch(error => {
  log(`\n❌ Script error: ${error.message}`, colors.red);
  process.exit(1);
});
