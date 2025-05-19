const fs = require('fs');
const path = require('path');

// Path to the locales directory
const LOCALES_DIR = path.join(__dirname, 'locales');

console.log('Starting translation update process...');

// Read the English translation file (source of truth)
const enPath = path.join(LOCALES_DIR, 'en.json');
const enContent = JSON.parse(fs.readFileSync(enPath, 'utf8'));

// Get all language files except English
const langFiles = fs.readdirSync(LOCALES_DIR)
  .filter(file => file.endsWith('.json') && file !== 'en.json');

console.log(`Found ${langFiles.length} language files to check.`);

// Function to merge missing keys from source to target
function mergeTranslations(source, target) {
  const result = { ...target };
  let addedCount = 0;
  
  // Helper function to recursively merge objects
  function recursiveMerge(src, tgt, path = '') {
    Object.keys(src).forEach(key => {
      const currentPath = path ? `${path}.${key}` : key;
      
      // If key doesn't exist in target, add it with placeholder
      if (!(key in tgt)) {
        tgt[key] = typeof src[key] === 'object' && src[key] !== null 
          ? {} 
          : `[NEEDS TRANSLATION] ${src[key]}`;
        
        addedCount++;
        console.log(`  Added missing key: ${currentPath}`);
      } 
      // If both source and target have objects at this key, recursively merge
      else if (
        typeof src[key] === 'object' && src[key] !== null &&
        typeof tgt[key] === 'object' && tgt[key] !== null
      ) {
        recursiveMerge(src[key], tgt[key], currentPath);
      }
      // Otherwise (scalar values), keep existing translation
    });
  }
  
  recursiveMerge(source, result);
  return { result, addedCount };
}

// Process each language file
let totalAddedKeys = 0;

langFiles.forEach(file => {
  const langCode = file.replace('.json', '');
  console.log(`\nProcessing ${langCode}...`);
  
  const langPath = path.join(LOCALES_DIR, file);
  let langContent;
  
  try {
    langContent = JSON.parse(fs.readFileSync(langPath, 'utf8'));
  } catch (error) {
    console.error(`Error reading ${file}: ${error.message}`);
    return;
  }
  
  // Merge missing translations
  const { result, addedCount } = mergeTranslations(enContent, langContent);
  totalAddedKeys += addedCount;
  
  if (addedCount > 0) {
    // Write the updated translations back to the file
    fs.writeFileSync(langPath, JSON.stringify(result, null, 2), 'utf8');
    console.log(`Updated ${langCode} with ${addedCount} missing keys.`);
  } else {
    console.log(`No missing keys found for ${langCode}.`);
  }
});

// Create a summary report
const report = {
  timestamp: new Date().toISOString(),
  totalLanguages: langFiles.length,
  totalAddedKeys,
  languages: langFiles.map(file => file.replace('.json', ''))
};

fs.writeFileSync(
  path.join(__dirname, 'translation-update-report.json'), 
  JSON.stringify(report, null, 2), 
  'utf8'
);

console.log(`\nTranslation update complete. Added ${totalAddedKeys} keys across ${langFiles.length} languages.`);
console.log('See translation-update-report.json for details.');
