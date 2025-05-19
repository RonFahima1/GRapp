const fs = require('fs');
const path = require('path');

// Path to locales directory
const localesDir = path.join(__dirname, 'locales');

// Get all language files
const languageFiles = fs.readdirSync(localesDir).filter(file => file.endsWith('.json'));

// Load English as the reference
const englishPath = path.join(localesDir, 'en.json');
const englishTranslations = JSON.parse(fs.readFileSync(englishPath, 'utf8'));

// Function to get all keys from an object (including nested ones)
function getAllKeys(obj, prefix = '') {
  let keys = [];
  for (const key in obj) {
    const currentPrefix = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys = [...keys, ...getAllKeys(obj[key], currentPrefix)];
    } else {
      keys.push(currentPrefix);
    }
  }
  return keys;
}

// Function to get value from object using dot notation path
function getValueByPath(obj, path) {
  const parts = path.split('.');
  return parts.reduce((acc, part) => acc && acc[part], obj);
}

// Function to set value in object using dot notation path
function setValueByPath(obj, path, value) {
  const parts = path.split('.');
  const lastKey = parts.pop();
  let target = obj;
  
  // Build the nested structure if it doesn't exist
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (!target[part]) {
      target[part] = {};
    }
    target = target[part];
  }
  
  target[lastKey] = value;
}

// Get all English keys
const englishKeys = getAllKeys(englishTranslations);
console.log(`English has ${englishKeys.length} translation keys.`);

// Check each language file for missing keys and add English value as placeholder
const missingTranslations = {};

for (const file of languageFiles) {
  if (file === 'en.json') continue; // Skip English
  
  const langCode = file.replace('.json', '');
  const langPath = path.join(localesDir, file);
  const langTranslations = JSON.parse(fs.readFileSync(langPath, 'utf8'));
  const langKeys = getAllKeys(langTranslations);
  
  // Find missing keys
  const missing = englishKeys.filter(key => !langKeys.includes(key));
  
  missingTranslations[langCode] = missing;
  
  if (missing.length > 0) {
    console.log(`\n${langCode} is missing ${missing.length} keys. Updating file...`);
    
    // Add missing keys with English values as placeholders
    for (const key of missing) {
      const englishValue = getValueByPath(englishTranslations, key);
      setValueByPath(langTranslations, key, `[NEEDS TRANSLATION] ${englishValue}`);
    }
    
    // Write updated translations back to file
    fs.writeFileSync(langPath, JSON.stringify(langTranslations, null, 2), 'utf8');
    console.log(`${langCode}.json has been updated with missing keys.`);
  } else {
    console.log(`${langCode} has all required keys.`);
  }
}

// Create summary report
const report = {
  timestamp: new Date().toISOString(),
  totalKeys: englishKeys.length,
  languages: {}
};

for (const langCode in missingTranslations) {
  report.languages[langCode] = {
    missingCount: missingTranslations[langCode].length,
    completionPercentage: 100 - (missingTranslations[langCode].length / englishKeys.length * 100).toFixed(2)
  };
}

// Write report
fs.writeFileSync(path.join(__dirname, 'translation-contingency-report.json'), JSON.stringify(report, null, 2), 'utf8');

console.log('\nTranslation contingency check complete. See translation-contingency-report.json for details.');
