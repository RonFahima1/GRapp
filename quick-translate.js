// This script quickly synchronizes all language files with the English source
// Run with: node quick-translate.js

const fs = require('fs');
const path = require('path');

// Configuration
const SOURCE_LANG = 'en';
const LOCALES_DIR = path.join(__dirname, 'locales');
const PRESERVE_EXISTING = true; // Set to false to override existing translations
const PREFIX_NEW = '🆕 '; // Optional prefix for new translations
const PREFIX_MISSING = '⚠️ '; // Prefix for missing translations

console.log('🌍 Quick Translation Sync');
console.log('========================');

// Step 1: Load the English source file
console.log(`Loading English source file...`);
const sourceFile = path.join(LOCALES_DIR, `${SOURCE_LANG}.json`);
let sourceData;

try {
  sourceData = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));
  console.log(`✅ Loaded ${Object.keys(sourceData).length} top-level keys from English`);
} catch (error) {
  console.error(`❌ Error loading English file: ${error.message}`);
  process.exit(1);
}

// Step 2: Get all language files
const languageFiles = fs.readdirSync(LOCALES_DIR)
  .filter(file => file.endsWith('.json') && file !== `${SOURCE_LANG}.json`);

console.log(`Found ${languageFiles.length} language files to update`);

// Helper function to get all keys from an object (with dot notation paths)
function getAllPaths(obj, currentPath = '') {
  let paths = [];
  
  for (const key in obj) {
    const newPath = currentPath ? `${currentPath}.${key}` : key;
    
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      paths = [...paths, ...getAllPaths(obj[key], newPath)];
    } else {
      paths.push(newPath);
    }
  }
  
  return paths;
}

// Helper function to get value at a specific path
function getValueAtPath(obj, path) {
  const parts = path.split('.');
  let current = obj;
  
  for (const part of parts) {
    if (current === undefined || current === null) return undefined;
    current = current[part];
  }
  
  return current;
}

// Helper function to set value at a specific path
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
}

// Process each language file
for (const langFile of languageFiles) {
  const langCode = langFile.replace('.json', '');
  console.log(`\nProcessing ${langCode.toUpperCase()}...`);
  
  // Load existing translations
  let langData = {};
  try {
    langData = JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, langFile), 'utf8'));
    console.log(`Loaded existing translations`);
  } catch (error) {
    console.warn(`No existing translations found, creating new file`);
  }
  
  // Get all paths from source
  const allPaths = getAllPaths(sourceData);
  console.log(`Found ${allPaths.length} total translation keys`);
  
  // Counters
  let preserved = 0;
  let added = 0;
  
  // New translation object
  const newLangData = {};
  
  // Process each path
  for (const path of allPaths) {
    const sourceValue = getValueAtPath(sourceData, path);
    const existingValue = getValueAtPath(langData, path);
    
    // If we have an existing translation and want to preserve it
    if (PRESERVE_EXISTING && existingValue && 
        typeof existingValue === 'string' && 
        !existingValue.startsWith(PREFIX_MISSING)) {
      setValueAtPath(newLangData, path, existingValue);
      preserved++;
    } else {
      // Add placeholder with source text
      if (typeof sourceValue === 'string') {
        setValueAtPath(
          newLangData, 
          path, 
          `${PREFIX_MISSING}${sourceValue}`
        );
        added++;
      } else {
        // Copy non-string values as is
        setValueAtPath(newLangData, path, sourceValue);
      }
    }
  }
  
  // Write updated translations back to file
  try {
    fs.writeFileSync(
      path.join(LOCALES_DIR, langFile),
      JSON.stringify(newLangData, null, 2),
      'utf8'
    );
    console.log(`✅ Updated ${langCode}.json: Preserved ${preserved}, Added ${added} translations`);
  } catch (error) {
    console.error(`❌ Error writing to ${langCode}.json: ${error.message}`);
  }
}

console.log('\n✨ Translation sync completed!');