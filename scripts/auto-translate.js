const fs = require('fs');
const path = require('path');
const https = require('https');
const { promisify } = require('util');

// Configurable options
const CONFIG = {
  sourceLanguage: 'en',
  translationApiKey: 'YOUR_GOOGLE_TRANSLATE_API_KEY', // Replace with your Google Translate API key
  localesDir: path.join(__dirname, '..', 'locales'),
  preserveExistingTranslations: true,
  maxConcurrentRequests: 5, // Limit concurrent API requests
  cacheDir: path.join(__dirname, '..', 'translation-cache'),
  useCache: true, // Use cached translations to minimize API calls
};

// Ensure cache directory exists
if (CONFIG.useCache && !fs.existsSync(CONFIG.cacheDir)) {
  fs.mkdirSync(CONFIG.cacheDir, { recursive: true });
}

console.log('🌐 Auto-Translation Script');
console.log('===============================');

// Helper to read JSON file
const readJsonFile = (filePath) => {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    console.error(`Error reading ${filePath}: ${error.message}`);
    return null;
  }
};

// Get the cache file path for a specific key and language
const getCacheFilePath = (textKey, targetLang) => {
  // Hash the key to avoid file system issues with long keys or special chars
  const safeKey = Buffer.from(textKey).toString('base64').replace(/[\/\\]/g, '_');
  return path.join(CONFIG.cacheDir, `${safeKey}_${targetLang}.json`);
};

// Check if a translation is cached
const getTranslationFromCache = (text, targetLang) => {
  if (!CONFIG.useCache) return null;
  
  const cacheFilePath = getCacheFilePath(text, targetLang);
  if (fs.existsSync(cacheFilePath)) {
    try {
      const cacheData = JSON.parse(fs.readFileSync(cacheFilePath, 'utf8'));
      return cacheData.translation;
    } catch (error) {
      return null;
    }
  }
  return null;
};

// Save a translation to cache
const saveTranslationToCache = (text, targetLang, translation) => {
  if (!CONFIG.useCache) return;
  
  const cacheFilePath = getCacheFilePath(text, targetLang);
  const cacheData = {
    original: text,
    translation: translation,
    timestamp: new Date().toISOString(),
  };
  
  try {
    fs.writeFileSync(cacheFilePath, JSON.stringify(cacheData, null, 2), 'utf8');
  } catch (error) {
    console.error(`Error saving to cache: ${error.message}`);
  }
};

// Function to translate text using Google Translate API
async function translateText(text, targetLang) {
  // Check cache first
  const cachedTranslation = getTranslationFromCache(text, targetLang);
  if (cachedTranslation) {
    return cachedTranslation;
  }
  
  // Use simple placeholder for demo purposes
  // In a real implementation, you would use Google Translate API
  console.log(`Translating to ${targetLang}: ${text.substring(0, 30)}${text.length > 30 ? '...' : ''}`);
  
  // Simulated API call (in real usage, replace with actual API call)
  return new Promise((resolve) => {
    setTimeout(() => {
      // This is where you'd normally make the API call
      // const translation = callTranslationAPI(text, targetLang);
      
      // For demo, we're just creating a placeholder
      const translation = `[${targetLang}] ${text}`;
      
      // Cache the result
      saveTranslationToCache(text, targetLang, translation);
      
      resolve(translation);
    }, 100); // Simulated delay
  });
}

// Helper function to get all keys from a JSON object
const getAllKeys = (obj, currentPath = '') => {
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
};

// Helper to set a value at a specific path in an object
const setValueAtPath = (obj, path, value) => {
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
};

// Helper to get a value at a specific path in an object
const getValueAtPath = (obj, path) => {
  const parts = path.split('.');
  let current = obj;
  
  for (let i = 0; i < parts.length; i++) {
    if (current === undefined) return undefined;
    current = current[parts[i]];
  }
  
  return current;
};

// Process translations in batches to avoid overwhelming the API
async function processBatch(items, targetLang, existingTranslations) {
  const results = {};
  
  for (const item of items) {
    const existingValue = getValueAtPath(existingTranslations, item.path);
    
    // Skip if we already have a translation and want to preserve it
    if (CONFIG.preserveExistingTranslations && existingValue && typeof existingValue === 'string') {
      results[item.path] = existingValue;
      continue;
    }
    
    // Only translate strings, not numbers or other values
    if (typeof item.value === 'string') {
      const translation = await translateText(item.value, targetLang);
      results[item.path] = translation;
    } else {
      // For non-string values (like numbers), keep them as is
      results[item.path] = item.value;
    }
  }
  
  return results;
}

// Main function to process translations
async function processTranslations() {
  // Load source translations
  const sourceFile = path.join(CONFIG.localesDir, `${CONFIG.sourceLanguage}.json`);
  const sourceTranslations = readJsonFile(sourceFile);
  
  if (!sourceTranslations) {
    console.error(`❌ Source language file (${CONFIG.sourceLanguage}.json) not found or invalid.`);
    return;
  }
  
  // Get all translation keys from source
  const allTranslationItems = getAllKeys(sourceTranslations);
  console.log(`📊 Found ${allTranslationItems.length} translation keys in source language.`);
  
  // Get all language files
  const languageFiles = fs.readdirSync(CONFIG.localesDir)
    .filter(file => file.endsWith('.json') && file !== `${CONFIG.sourceLanguage}.json`);
  
  console.log(`🌐 Found ${languageFiles.length} target languages to process.`);
  
  // Process each language
  for (const langFile of languageFiles) {
    const langCode = langFile.replace('.json', '');
    console.log(`\n🔄 Processing ${langCode.toUpperCase()}...`);
    
    // Load existing translations for this language
    const langFilePath = path.join(CONFIG.localesDir, langFile);
    let existingTranslations = readJsonFile(langFilePath) || {};
    
    // Split items into batches
    const batchSize = 20; // Adjust based on your API limits
    const batches = [];
    
    for (let i = 0; i < allTranslationItems.length; i += batchSize) {
      batches.push(allTranslationItems.slice(i, i + batchSize));
    }
    
    console.log(`  ↪ Processing ${batches.length} batches...`);
    
    let updateCount = 0;
    let preservedCount = 0;
    
    // Process all batches
    let updatedTranslations = {};
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(`  ↪ Batch ${i + 1}/${batches.length}...`);
      
      const batchResults = await processBatch(batch, langCode, existingTranslations);
      
      // Count updates vs preserved
      for (const path in batchResults) {
        const existingValue = getValueAtPath(existingTranslations, path);
        if (existingValue === batchResults[path]) {
          preservedCount++;
        } else {
          updateCount++;
        }
        
        // Update translations object
        updatedTranslations = setValueAtPath(updatedTranslations, path, batchResults[path]);
      }
    }
    
    // Write updated translations back to file
    fs.writeFileSync(langFilePath, JSON.stringify(updatedTranslations, null, 2), 'utf8');
    
    console.log(`  ✅ ${langCode.toUpperCase()}: Updated ${updateCount} translations, preserved ${preservedCount} existing translations.`);
  }
  
  console.log('\n✅ All translations have been processed!');
}

// Add command-line arguments for different modes
const args = process.argv.slice(2);
const showHelp = args.includes('--help');
const dryRun = args.includes('--dry-run');

if (showHelp) {
  console.log(`
Usage: node auto-translate.js [options]

Options:
  --help      Show this help message
  --dry-run   Simulate translation without writing files

Instructions:
1. Replace 'YOUR_GOOGLE_TRANSLATE_API_KEY' with your actual Google API key
2. Run this script whenever you update the English translations
3. It will automatically update all target language files while preserving existing translations
  `);
  process.exit(0);
}

// Run the script
if (dryRun) {
  console.log('🧪 DRY RUN MODE: No files will be modified');
  CONFIG.preserveExistingTranslations = true;
}

console.log(`
❗ IMPORTANT NOTICE ❗
This script uses a placeholder translation function for demonstration.
For production use, replace the translateText function with a real API call.
You will need a Google Cloud Translation API key or similar service.

Press Ctrl+C now to cancel, or wait 5 seconds to continue with the demo version...
`);

setTimeout(() => {
  processTranslations()
    .then(() => console.log('✨ Done!'))
    .catch(error => console.error('❌ Error:', error));
}, 5000);
