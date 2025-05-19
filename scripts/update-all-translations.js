const fs = require('fs');
const path = require('path');

// Constants
const LOCALES_DIR = path.join(__dirname, '..', 'locales');
const SOURCE_LANG = 'en';
const PLACEHOLDER_PREFIX = '⚠️ '; // Visible marker for missing translations

console.log('🔄 Starting comprehensive translation update process...');

// Read the source language file (English)
const sourcePath = path.join(LOCALES_DIR, `${SOURCE_LANG}.json`);
const sourceContent = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));

// Get all language files
const langFiles = fs.readdirSync(LOCALES_DIR)
  .filter(file => file.endsWith('.json') && file !== `${SOURCE_LANG}.json`);

console.log(`📋 Found ${langFiles.length} languages to update.`);

// Statistics object
const stats = {
  totalKeysInEnglish: 0,
  languages: {}
};

// Count total keys in English
function countKeys(obj, prefix = '') {
  let count = 0;
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      count += countKeys(obj[key], prefix ? `${prefix}.${key}` : key);
    } else {
      count++;
    }
  }
  return count;
}

stats.totalKeysInEnglish = countKeys(sourceContent);
console.log(`🔑 English contains ${stats.totalKeysInEnglish} total keys.`);

/**
 * Deep merge source into target, adding placeholders for missing translations
 */
function mergeTranslations(source, target, langCode, prefix = '') {
  const updatedTarget = { ...target };
  let added = 0;
  let kept = 0;
  let fixed = 0;
  
  for (const key in source) {
    const currentPath = prefix ? `${prefix}.${key}` : key;
    
    // If key doesn't exist in target
    if (!(key in updatedTarget)) {
      if (typeof source[key] === 'object' && source[key] !== null) {
        updatedTarget[key] = {};
        const result = mergeTranslations(source[key], {}, langCode, currentPath);
        updatedTarget[key] = result.target;
        added += result.added;
      } else {
        // Add placeholder for missing translation
        updatedTarget[key] = `${PLACEHOLDER_PREFIX}${source[key]}`;
        added++;
      }
    } 
    // If both are objects, recursively merge
    else if (
      typeof source[key] === 'object' && source[key] !== null &&
      typeof updatedTarget[key] === 'object' && updatedTarget[key] !== null
    ) {
      const result = mergeTranslations(source[key], updatedTarget[key], langCode, currentPath);
      updatedTarget[key] = result.target;
      added += result.added;
      kept += result.kept;
      fixed += result.fixed;
    }
    // If target already has a value
    else if (typeof updatedTarget[key] === 'string') {
      // Check if it's a placeholder that needs fixing
      if (updatedTarget[key].startsWith('[NEEDS TRANSLATION]')) {
        updatedTarget[key] = `${PLACEHOLDER_PREFIX}${source[key]}`;
        fixed++;
      } else {
        // Keep existing translation
        kept++;
      }
    }
    // Handle type mismatch (e.g. object in source but string in target)
    else if (typeof source[key] !== typeof updatedTarget[key]) {
      if (typeof source[key] === 'object') {
        updatedTarget[key] = {};
        const result = mergeTranslations(source[key], {}, langCode, currentPath);
        updatedTarget[key] = result.target;
        added += result.added;
        fixed++;
      } else {
        updatedTarget[key] = `${PLACEHOLDER_PREFIX}${source[key]}`;
        fixed++;
      }
    }
  }
  
  return { target: updatedTarget, added, kept, fixed };
}

// Process each language file
let totalFilesFixed = 0;

for (const file of langFiles) {
  const langCode = file.replace('.json', '');
  console.log(`\n🔄 Processing ${langCode.toUpperCase()}...`);
  
  // Read the language file
  const langPath = path.join(LOCALES_DIR, file);
  let langContent;
  
  try {
    langContent = JSON.parse(fs.readFileSync(langPath, 'utf8'));
  } catch (error) {
    console.error(`  ❌ Error reading ${file}: ${error.message}`);
    continue;
  }
  
  // Merge translations
  const { target: updatedContent, added, kept, fixed } = 
    mergeTranslations(sourceContent, langContent, langCode);
  
  // Calculate completeness percentage (excluding placeholders)
  let totalKeys = 0;
  let placeholderKeys = 0;
  
  function countPlaceholders(obj) {
    for (const key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        countPlaceholders(obj[key]);
      } else {
        totalKeys++;
        if (typeof obj[key] === 'string' && obj[key].startsWith(PLACEHOLDER_PREFIX)) {
          placeholderKeys++;
        }
      }
    }
  }
  
  countPlaceholders(updatedContent);
  const completenessPercentage = ((totalKeys - placeholderKeys) / totalKeys * 100).toFixed(2);
  
  // Update statistics
  stats.languages[langCode] = {
    added,
    kept,
    fixed,
    totalKeys,
    placeholderKeys,
    completenessPercentage
  };
  
  // Write the updated translations back to file
  fs.writeFileSync(langPath, JSON.stringify(updatedContent, null, 2), 'utf8');
  console.log(`  ✅ Updated ${langCode.toUpperCase()}: Added ${added}, Kept ${kept}, Fixed ${fixed}`);
  console.log(`  📊 Completeness: ${completenessPercentage}% (${totalKeys - placeholderKeys}/${totalKeys} keys translated)`);
  
  if (added > 0 || fixed > 0) {
    totalFilesFixed++;
  }
}

// Create a report
stats.timestamp = new Date().toISOString();
stats.totalLanguages = langFiles.length;
stats.totalFilesFixed = totalFilesFixed;

fs.writeFileSync(
  path.join(__dirname, '..', 'translation-update-complete-report.json'),
  JSON.stringify(stats, null, 2),
  'utf8'
);

console.log(`\n✅ Translation update complete! Fixed ${totalFilesFixed} out of ${langFiles.length} language files.`);
console.log('📊 See translation-update-complete-report.json for detailed statistics.');
