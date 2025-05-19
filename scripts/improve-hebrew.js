/**
 * improve-hebrew.js - A script to enhance Hebrew translations
 * 
 * This script improves the Hebrew translations by:
 * 1. Removing unnecessary diacritics (nikud)
 * 2. Fixing punctuation and spacing issues
 * 3. Making common translation improvements
 * 
 * Usage: node scripts/improve-hebrew.js
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  localesDir: path.join(__dirname, '..', 'locales'),
  hebrewFile: 'he.json'
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

// Common translation improvements
const translationImprovements = {
  // Basic UI elements
  "ברוך הבא ל- REMIT": "ברוך הבא ל-Remit",
  "לְהַמשִׁיך": "המשך",
  "כְּנִיסָה לַמַעֲרֶכֶת": "כניסה",
  "אֶלֶקטרוֹנִי": "דואר אלקטרוני",
  "סִיסמָה": "סיסמה",
  "Hello, {{name}}": "שלום, {{name}}",
  "לִרְשׁוֹם": "הרשמה",
  
  // Cleanup Translations with diacritics (nikud)
  "שַׁלֵם": "שלם",
  "שָׁלַחְתָּ": "שלחת",
  "בְּחִירָה": "בחירה",
  "הַעֲבָרָה": "העברה",
  "קַבֵּל": "קבל",
  "שִׁיטוֹת תַּשְׁלוּם": "שיטות תשלום",
  "פְּעִילוּת אַחֲרוֹנָה": "פעילות אחרונה",
  "כַּרְטִיסִים": "כרטיסים",
  "הוֹסֵף": "הוסף",
  "הַתְחֵל": "התחל",
  "קַבֵּל": "קבל",
  "הַבָּא": "הבא",
  "הוֹסֵף כַּרְטִיס": "הוסף כרטיס",
  "מְאַשֵׁר": "מאשר",
  "תַּאֲרִיךְ תְּפוּגָה": "תאריך תפוגה",
  "בִּטחוֹן": "ביטחון",
  "הַכֹּל": "הכל",
  "אַזְהָרָה": "אזהרה",
  "הוֹדָעָה": "הודעה",
  "לְמַעֲלָה": "למעלה",
  "לְמַטָּה": "למטה",
  "יְצִיאָה": "יציאה",
  "שָׁמוּר": "שמור",
  "עַכשָׁו": "עכשיו",
  "הִגְדָּרוֹת": "הגדרות",
  "בִּטּוּל": "ביטול",
  "שִׁנּוּי": "שינוי",
  
  // Common phrases with spacing/punctuation fixes
  "מספר הטלפון חייב להתחיל עם 0 או 5": "מספר הטלפון חייב להתחיל ב-0 או 5",
  "אנא הזן מספר טלפון תקף": "אנא הזן מספר טלפון תקין",
  "פורמט מספר טלפון לא חוקי": "פורמט מספר טלפון שגוי",
  "אין לך חשבון?": "אין לך חשבון? ",
  "Enable {{biometricType}} login": "הפעל כניסה באמצעות {{biometricType}}",
  
  // Payment related
  "תַּשְׁלוּם": "תשלום",
  "תַּשְׁלוּמִים": "תשלומים",
  "עַמלָה": "עמלה",
  "אִשּׁוּר תַּשְׁלוּם": "אישור תשלום",
  
  // Settings and Profile
  "הַחלֵף שָׂפָה": "החלף שפה",
  "פְּרוֹפִיל": "פרופיל",
  "הַגדָּרוֹת פְּרוֹפִיל": "הגדרות פרופיל",
  "הַגדָּרוֹת הַאַפְּלִיקַצְיָה": "הגדרות האפליקציה",
  "מַטְבֵּעַ מוֹעֲדָף": "מטבע מועדף",
  "שָׂפָה מוֹעֲדֶפֶת": "שפה מועדפת",
  
  // Support
  "תְּמִיכָה": "תמיכה",
  "שְׁאֵלוֹת נְפוֹצוֹת": "שאלות נפוצות",
  "יְצִירַת קֶשֶׁר": "יצירת קשר",
  "שְׁלַח הוֹדָעָה": "שלח הודעה",
};

// Function to remove all diacritics (nikud) from Hebrew text
function removeDiacritics(text) {
  if (typeof text !== 'string') return text;
  
  // This regex matches all Hebrew diacritics (nikud)
  return text.replace(/[\u0591-\u05C7]/g, '');
}

// Process the Hebrew translation file
function improveHebrewTranslations() {
  log('\n' + '='.repeat(70), colors.bright);
  log('  🇮🇱  IMPROVING HEBREW TRANSLATIONS', colors.bright + colors.cyan);
  log('='.repeat(70), colors.bright);
  
  const hebrewFilePath = path.join(CONFIG.localesDir, CONFIG.hebrewFile);
  log(`Processing Hebrew file: ${hebrewFilePath}`, colors.blue);
  
  try {
    // Read the Hebrew file
    const content = fs.readFileSync(hebrewFilePath, 'utf8');
    const translations = JSON.parse(content);
    
    // Track changes
    let diacriticsRemoved = 0;
    let improvementsApplied = 0;
    
    // Function to recursively process all string values in the JSON object
    function processObject(obj) {
      for (const key in obj) {
        if (typeof obj[key] === 'string') {
          const originalText = obj[key];
          
          // Apply specific improvements if available
          if (translationImprovements[originalText]) {
            obj[key] = translationImprovements[originalText];
            improvementsApplied++;
          } 
          // Otherwise remove diacritics if present
          else if (/[\u0591-\u05C7]/.test(originalText)) {
            obj[key] = removeDiacritics(originalText);
            diacriticsRemoved++;
          }
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          // Recursively process nested objects
          processObject(obj[key]);
        }
      }
    }
    
    // Process the translations
    processObject(translations);
    
    // Create backup of original file
    const backupPath = hebrewFilePath + '.backup';
    fs.writeFileSync(backupPath, content, 'utf8');
    log(`  ✅ Created backup at ${backupPath}`, colors.green);
    
    // Write the improved file
    fs.writeFileSync(hebrewFilePath, JSON.stringify(translations, null, 2), 'utf8');
    
    log(`  ✅ Removed diacritics from ${diacriticsRemoved} translations`, colors.green);
    log(`  ✅ Applied ${improvementsApplied} specific improvements`, colors.green);
    log(`  ✅ Updated Hebrew translations file`, colors.green);
  } catch (error) {
    log(`  ❌ Error processing Hebrew file: ${error.message}`, colors.red);
    return;
  }
  
  log('\n✨ Hebrew translations improved!');
}

// Run the script
improveHebrewTranslations();
