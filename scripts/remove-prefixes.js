/**
 * remove-prefixes.js - A script to remove prefixes (like 🆕) from all translation files
 * 
 * Usage: node scripts/remove-prefixes.js
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  localesDir: path.join(__dirname, '..', 'locales'),
  prefixToRemove: '🆕 '  // The prefix to remove from translations
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

// Process a single translation file
function processFile(filePath, fileName) {
  log(`Processing ${fileName}...`, colors.blue);
  
  try {
    // Read the file
    const content = fs.readFileSync(filePath, 'utf8');
    const translations = JSON.parse(content);
    
    // Track changes
    let changeCount = 0;
    
    // Function to recursively process all string values in the JSON object
    function processObject(obj) {
      for (const key in obj) {
        if (typeof obj[key] === 'string') {
          // If the string starts with the prefix, remove it
          if (obj[key].startsWith(CONFIG.prefixToRemove)) {
            obj[key] = obj[key].substring(CONFIG.prefixToRemove.length);
            changeCount++;
          }
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          // Recursively process nested objects
          processObject(obj[key]);
        }
      }
    }
    
    // Process the translations
    processObject(translations);
    
    // Write the updated file
    fs.writeFileSync(filePath, JSON.stringify(translations, null, 2), 'utf8');
    
    log(`  ✅ Removed ${changeCount} prefixes`, colors.green);
    return changeCount;
  } catch (error) {
    log(`  ❌ Error processing ${fileName}: ${error.message}`, colors.red);
    return 0;
  }
}

// Main function
function removeAllPrefixes() {
  log('\n' + '='.repeat(70), colors.bright);
  log('  🧹  REMOVING PREFIXES FROM TRANSLATION FILES', colors.bright + colors.cyan);
  log('='.repeat(70), colors.bright);
  
  try {
    // Get all JSON files in the locales directory
    const files = fs.readdirSync(CONFIG.localesDir)
      .filter(file => file.endsWith('.json'));
    
    log(`Found ${files.length} language files`, colors.blue);
    
    // Process each file
    let totalChanges = 0;
    for (const file of files) {
      const filePath = path.join(CONFIG.localesDir, file);
      const changesInFile = processFile(filePath, file);
      totalChanges += changesInFile;
    }
    
    // Final report
    log('\n' + '='.repeat(70), colors.bright);
    log('📊  SUMMARY', colors.bright + colors.green);
    log('='.repeat(70), colors.bright);
    log(`Total prefix removals: ${totalChanges}`, colors.green);
    log(`Files processed: ${files.length}`, colors.green);
    log('\n✨ All prefixes removed!');
  } catch (error) {
    log(`\n❌ Error: ${error.message}`, colors.red);
  }
}

// Run the script
removeAllPrefixes();
