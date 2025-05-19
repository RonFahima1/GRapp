/**
 * translate-all-languages.js - A script to systematically translate into all supported languages
 * 
 * This script translates the English JSON file to all configured languages
 * one at a time, creating complete translation files for each.
 * 
 * Usage: node scripts/translate-all-languages.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration
const CONFIG = {
  sourceLang: 'en',
  localesDir: path.join(__dirname, '..', 'locales'),
  delayBetweenRequests: 800, // Delay between requests to avoid rate limiting (ms)
  markNewTranslations: true,  // Mark new translations with a prefix for review
  newPrefix: '🆕 ',          // Prefix for new translations
  batchSize: 5               // Process translations in batches to avoid rate limiting
};

// Language codes mapping for Google Translate
const LANGUAGE_MAP = {
  'ar': 'ar',    // Arabic
  'cn': 'zh-CN', // Chinese Simplified
  'es': 'es',    // Spanish
  'fr': 'fr',    // French
  'he': 'iw',    // Hebrew in Google is 'iw'
  'hi': 'hi',    // Hindi
  'ja': 'ja',    // Japanese
  'np': 'ne',    // Nepali
  'pt': 'pt',    // Portuguese
  'ro': 'ro',    // Romanian
  'ru': 'ru',    // Russian
  'si': 'si',    // Sinhala
  'th': 'th',    // Thai
  'tl': 'tl',    // Filipino/Tagalog
  'zh': 'zh-TW'  // Chinese Traditional
};

// Stats for reporting
const stats = {
  totalLanguages: Object.keys(LANGUAGE_MAP).length - 1, // Exclude English
  completedLanguages: 0,
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
async function translateText(text, targetLang) {
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
      current[part] = {};
    }
    current = current[part];
  }
  
  // Set the value at the final part
  current[parts[parts.length - 1]] = value;
}

// Process a batch of translations for a single language
async function processBatch(items, langCode, resultObj) {
  const langStats = stats.byLanguage[langCode];
  
  for (const item of items) {
    const { path, value } = item;
    
    // Skip if it's not a string (we don't translate arrays, objects, etc.)
    if (typeof value !== 'string') {
      continue;
    }
    
    // Translate the text
    try {
      const translatedText = await translateText(value, langCode);
      
      if (translatedText) {
        // Add prefix to mark new translations
        const finalText = CONFIG.markNewTranslations ? 
          `${CONFIG.newPrefix}${translatedText}` : 
          translatedText;
        
        setValueAtPath(resultObj, path, finalText);
        langStats.translated++;
        
        if (CONFIG.reportProgress) {
          log(`  + Translated: ${path}`, colors.green);
        }
      } else {
        // If translation failed, use the original text
        setValueAtPath(resultObj, path, value);
        langStats.failed++;
        
        if (CONFIG.reportProgress) {
          log(`  ! Failed: ${path}`, colors.red);
        }
      }
    } catch (error) {
      // On error, use the original text
      setValueAtPath(resultObj, path, value);
      langStats.failed++;
      
      if (CONFIG.reportProgress) {
        log(`  ! Error (${error.message}): ${path}`, colors.red);
      }
    }
    
    // Add delay between translations to avoid rate limiting
    await delay(CONFIG.delayBetweenRequests);
  }
  
  return resultObj;
}

// Translate a single language
async function translateLanguage(langCode, sourceData, allItems) {
  // Initialize stats for this language
  stats.byLanguage[langCode] = {
    translated: 0,
    failed: 0
  };
  
  log(`\n🔄 Processing ${langCode.toUpperCase()}...`, colors.bright);
  
  // Process translations in small batches to avoid rate limiting
  let translatedData = {};
  const totalBatches = Math.ceil(allItems.length / CONFIG.batchSize);
  
  for (let i = 0; i < allItems.length; i += CONFIG.batchSize) {
    const batch = allItems.slice(i, i + CONFIG.batchSize);
    log(`  Processing batch ${Math.floor(i/CONFIG.batchSize) + 1}/${totalBatches}...`, colors.dim);
    
    // Process batch and update translatedData
    translatedData = await processBatch(batch, langCode, translatedData);
  }
  
  // Write the updated translations back to file
  const targetFile = path.join(CONFIG.localesDir, `${langCode}.json`);
  try {
    fs.writeFileSync(
      targetFile,
      JSON.stringify(translatedData, null, 2),
      'utf8'
    );
    
    const langStats = stats.byLanguage[langCode];
    log(`✅ Created ${langCode}.json:`, colors.green);
    log(`  - Translated: ${langStats.translated}`, colors.green);
    log(`  - Failed: ${langStats.failed}`, langStats.failed > 0 ? colors.red : colors.dim);
    
    // Update completed languages count
    stats.completedLanguages++;
  } catch (error) {
    log(`❌ Error writing ${langCode}.json: ${error.message}`, colors.red);
  }
}

// Main function to process all translations
async function translateAllLanguages() {
  // Banner
  log('\n' + '='.repeat(70), colors.bright);
  log('  🌐  TRANSLATING ENGLISH TO ALL LANGUAGES', colors.bright + colors.cyan);
  log('='.repeat(70), colors.bright);
  log('This script will translate your English JSON to all supported languages.\n');
  
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
  
  // Get all language codes (excluding English)
  const languagesToProcess = Object.keys(LANGUAGE_MAP)
    .filter(code => code !== CONFIG.sourceLang);
  
  log(`Found ${languagesToProcess.length} languages to translate`, colors.blue);
  log(`Languages: ${languagesToProcess.join(', ')}`, colors.cyan);
  
  // Process each language one by one
  for (const langCode of languagesToProcess) {
    await translateLanguage(langCode, sourceData, allItems);
  }
  
  // Final report
  log('\n' + '='.repeat(70), colors.bright);
  log('📊  TRANSLATION SUMMARY', colors.bright + colors.green);
  log('='.repeat(70), colors.bright);
  log(`Languages Processed: ${stats.completedLanguages}/${stats.totalLanguages}`, colors.green);
  
  // Report for each language
  for (const langCode in stats.byLanguage) {
    const langStats = stats.byLanguage[langCode];
    log(`${langCode.toUpperCase()}: ${langStats.translated} translated, ${langStats.failed} failed`, 
      langStats.failed > 0 ? colors.yellow : colors.green);
  }
  
  log('\n✨ All translations completed!');
}

// Run the script
translateAllLanguages().catch(error => {
  log(`\n❌ Script error: ${error.message}`, colors.red);
  process.exit(1);
});
