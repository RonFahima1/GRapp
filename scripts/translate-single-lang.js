/**
 * translate-single-lang.js - A modified script to translate JSON files one language at a time
 * 
 * This script translates your English JSON file to a single target language
 * while preserving existing good translations.
 * 
 * Usage: node scripts/translate-single-lang.js <language-code>
 * Example: node scripts/translate-single-lang.js zh
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration
const CONFIG = {
  sourceLang: 'en',
  localesDir: path.join(__dirname, '..', 'locales'),
  preserveExisting: true,    // Keep existing translations if they exist
  delayBetweenRequests: 800, // Delay between requests to avoid rate limiting (ms)
  markNewTranslations: true, // Mark new translations with a prefix for review
  newPrefix: '🆕 ',          // Prefix for new translations
  reportProgress: true,      // Show progress in console
  batchSize: 5               // Small batch size to avoid rate limiting
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
  translated: 0,
  preserved: 0,
  failed: 0
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
async function translateText(text, targetLang) {
  // Skip empty or non-string input
  if (!text || typeof text !== 'string' || text.trim() === '') {
    return text;
  }
  
  // Skip texts that contain mostly code/variables
  if (text.includes('{{') && text.includes('}}')) {
    return text; // For simplicity, return as is
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
    const newPrefix = prefix ? `${prefix}.${key}` : key;
    
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      // Recursive call for nested objects
      keys = keys.concat(getAllKeys(obj[key], newPrefix));
    } else {
      // Add the leaf node's path and value
      keys.push({
        path: newPrefix,
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
  
  // Build the path if it doesn't exist
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (!current[part]) {
      current[part] = {};
    } else if (typeof current[part] !== 'object') {
      // Handle case where we're trying to set a property on a non-object
      current[part] = {};
    }
    current = current[part];
  }
  
  // Set the value at the final part
  current[parts[parts.length - 1]] = value;
}

// Process a batch of translations for a single language
async function processBatch(items, langCode, existingTranslations, resultObj) {
  for (const item of items) {
    const { path, value } = item;
    
    // Skip if it's not a string (we don't translate arrays, objects, etc.)
    if (typeof value !== 'string') continue;
    
    const existingValue = getValueAtPath(existingTranslations, path);
    
    // If we have an existing non-empty translation and we're preserving them, use it
    if (
      CONFIG.preserveExisting && 
      existingValue && 
      typeof existingValue === 'string' && 
      existingValue.trim() !== ''
    ) {
      setValueAtPath(resultObj, path, existingValue);
      stats.preserved++;
      if (CONFIG.reportProgress) {
        log(`  ✓ Preserved: ${path}`, colors.dim);
      }
      continue;
    }
    
    // No valid existing translation, so translate it
    try {
      const translatedText = await translateText(value, langCode);
      if (translatedText) {
        // Add prefix to mark new translations if enabled
        const finalText = CONFIG.markNewTranslations ? 
          `${CONFIG.newPrefix}${translatedText}` : 
          translatedText;
        
        setValueAtPath(resultObj, path, finalText);
        stats.translated++;
        
        if (CONFIG.reportProgress) {
          log(`  + Translated: ${path}`, colors.green);
        }
      } else {
        // If translation failed, use the original text
        setValueAtPath(resultObj, path, value);
        stats.failed++;
        
        if (CONFIG.reportProgress) {
          log(`  ! Failed: ${path}`, colors.red);
        }
      }
    } catch (error) {
      // On error, use the original text
      setValueAtPath(resultObj, path, value);
      stats.failed++;
      
      if (CONFIG.reportProgress) {
        log(`  ! Error (${error.message}): ${path}`, colors.red);
      }
    }
    
    // Add delay between translations to avoid rate limiting
    await delay(CONFIG.delayBetweenRequests);
  }
  
  return resultObj;
}

// Main function to process translations for a single language
async function translateSingleLanguage(langCode) {
  // Banner
  log('\n' + '='.repeat(70), colors.bright);
  log(`  🌐  TRANSLATING ENGLISH TO ${langCode.toUpperCase()}`, colors.bright + colors.cyan);
  log('='.repeat(70), colors.bright);
  
  // Validate language code
  if (!LANGUAGE_MAP[langCode]) {
    log(`❌ Error: Invalid language code "${langCode}"`, colors.red);
    log(`Valid language codes: ${Object.keys(LANGUAGE_MAP).join(', ')}`, colors.yellow);
    process.exit(1);
  }
  
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
  
  const targetFile = path.join(CONFIG.localesDir, `${langCode}.json`);
  
  // Load existing translations
  let existingTranslations = {};
  try {
    existingTranslations = JSON.parse(fs.readFileSync(targetFile, 'utf8'));
    log(`Loaded existing translations for ${langCode}`, colors.dim);
  } catch (error) {
    log(`No existing translations found for ${langCode}, creating new file`, colors.dim);
  }
  
  // Process translations in small batches to avoid rate limiting
  let updatedTranslations = {};
  
  // Calculate total batches for progress reporting
  const totalBatches = Math.ceil(allItems.length / CONFIG.batchSize);
  
  for (let i = 0; i < allItems.length; i += CONFIG.batchSize) {
    const batch = allItems.slice(i, i + CONFIG.batchSize);
    log(`Processing batch ${Math.floor(i/CONFIG.batchSize) + 1}/${totalBatches}...`, colors.blue);
    
    // Update translations with this batch
    updatedTranslations = await processBatch(
      batch, 
      langCode, 
      existingTranslations, 
      updatedTranslations
    );
  }
  
  // Write the updated translations back to file
  try {
    fs.writeFileSync(
      targetFile,
      JSON.stringify(updatedTranslations, null, 2),
      'utf8'
    );
    
    log(`\n✅ Updated ${langCode}.json:`, colors.green);
    log(`  - Translated: ${stats.translated}`, colors.green);
    log(`  - Preserved: ${stats.preserved}`, colors.blue);
    log(`  - Failed: ${stats.failed}`, stats.failed > 0 ? colors.red : colors.dim);
  } catch (error) {
    log(`❌ Error writing ${langCode}.json: ${error.message}`, colors.red);
    process.exit(1);
  }
  
  log('\n✨ Translation completed!');
}

// Get the language code from command-line arguments
const targetLang = process.argv[2];

if (!targetLang) {
  log('\n❌ Error: Please specify a language code', colors.red);
  log('Usage: node scripts/translate-single-lang.js <language-code>', colors.yellow);
  log(`Valid language codes: ${Object.keys(LANGUAGE_MAP).join(', ')}`, colors.yellow);
  process.exit(1);
}

// Run the script
translateSingleLanguage(targetLang).catch(error => {
  log(`\n❌ Script error: ${error.message}`, colors.red);
  process.exit(1);
});
