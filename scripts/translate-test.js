/**
 * translate-test.js - A simplified test script that translates just 10 items
 * 
 * Usage: node scripts/translate-test.js <language-code>
 * Example: node scripts/translate-test.js es
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration
const CONFIG = {
  sourceLang: 'en',
  localesDir: path.join(__dirname, '..', 'locales'),
  delayBetweenRequests: 500, // Shorter delay for testing
  markNewTranslations: true,  // Mark new translations with a prefix for review
  newPrefix: '🆕 ',           // Prefix for new translations
  maxItems: 10                // Only translate first 10 items
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
  
  return new Promise((resolve, reject) => {
    const sourceLang = 'en'; // Always translate from English
    const googleLangCode = LANGUAGE_MAP[targetLang] || targetLang;
    
    // Format the text for URL encoding
    const encodedText = encodeURIComponent(text);
    
    // Construct the API URL (using free translation endpoint)
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${googleLangCode}&dt=t&q=${encodedText}`;
    
    log(`  Translating: "${text}" to ${targetLang}...`, colors.dim);
    
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
            log(`  Result: "${translatedText}"`, colors.green);
            resolve(translatedText);
          } else {
            log(`  Translation failed: Invalid response format`, colors.red);
            reject(new Error('Invalid translation response format'));
          }
        } catch (error) {
          log(`  Translation error: ${error.message}`, colors.red);
          reject(error);
        }
      });
    }).on('error', (error) => {
      log(`  Request error: ${error.message}`, colors.red);
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

// Main function to process translations for a single language
async function translateTest(langCode) {
  // Banner
  log('\n' + '='.repeat(70), colors.bright);
  log(`  🔬  TESTING TRANSLATION - ENGLISH TO ${langCode.toUpperCase()} (${CONFIG.maxItems} ITEMS)`, colors.bright + colors.cyan);
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
  log(`Will translate first ${CONFIG.maxItems} items as requested`, colors.yellow);
  
  // Process translations for the first few items
  const testItems = allItems.slice(0, CONFIG.maxItems);
  let translatedData = {};
  
  for (const item of testItems) {
    const { path, value } = item;
    
    // Skip if it's not a string (we don't translate arrays, objects, etc.)
    if (typeof value !== 'string') {
      log(`Skipping non-string item: ${path}`, colors.dim);
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
        
        setValueAtPath(translatedData, path, finalText);
        log(`✅ Translated: ${path}`, colors.green);
      } else {
        log(`❌ Failed to translate: ${path}`, colors.red);
        // Use original text as fallback
        setValueAtPath(translatedData, path, value);
      }
    } catch (error) {
      log(`❌ Error translating ${path}: ${error.message}`, colors.red);
      // Use original text as fallback
      setValueAtPath(translatedData, path, value);
    }
    
    // Add delay between translations to avoid rate limiting
    await delay(CONFIG.delayBetweenRequests);
  }
  
  // Write the translated data to a file
  const targetFile = path.join(CONFIG.localesDir, `${langCode}.json`);
  try {
    fs.writeFileSync(
      targetFile,
      JSON.stringify(translatedData, null, 2),
      'utf8'
    );
    
    log(`\n✅ Created ${langCode}.json with ${testItems.length} translated items`, colors.green);
    log(`File location: ${targetFile}`, colors.blue);
  } catch (error) {
    log(`❌ Error writing ${langCode}.json: ${error.message}`, colors.red);
    process.exit(1);
  }
  
  log('\n✨ Test translation completed!');
}

// Get the language code from command-line arguments
const targetLang = process.argv[2];

if (!targetLang) {
  log('\n❌ Error: Please specify a language code', colors.red);
  log('Usage: node scripts/translate-test.js <language-code>', colors.yellow);
  log(`Valid language codes: ${Object.keys(LANGUAGE_MAP).join(', ')}`, colors.yellow);
  process.exit(1);
}

// Run the script
translateTest(targetLang).catch(error => {
  log(`\n❌ Script error: ${error.message}`, colors.red);
  process.exit(1);
});
