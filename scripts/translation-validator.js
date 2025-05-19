/**
 * Translation Validator
 * 
 * This script scans through all app files to find hardcoded text and missing translations.
 * It creates a report of translation keys that are used in the app but might be missing
 * from some language files, and identifies any hardcoded text that should be translated.
 */

const fs = require('fs');
const path = require('path');
const util = require('util');

const readDir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const stat = util.promisify(fs.stat);

// Configuration
const appRoot = path.resolve(__dirname, '..');
const srcDirs = [
  path.join(appRoot, 'app'),
  path.join(appRoot, 'components'),
  path.join(appRoot, 'screens'),
  path.join(appRoot, 'context'),
  path.join(appRoot, 'hooks'),
];
const localesDir = path.join(appRoot, 'locales');
const reportFile = path.join(appRoot, 'translation-report.json');
const excludedPaths = [
  'node_modules',
  '.git',
  '.expo',
  'build',
  'dist',
  'assets'
];

// Regex patterns
const translationKeyPattern = /t\(['"](.*?)['"](,|\))/g;
const useTranslatePattern = /useTranslate\(\)/g;
const hardcodedTextPattern = /<Text[^>]*>([^{<][^<]+)<\/Text>/g;
const jsxTextPattern = /<[a-zA-Z0-9]+[^>]*>[^{<][^<>]*<\/[a-zA-Z0-9]+>/g;
const propTextPattern = /\w+=['"](.*?)['"](.|\/)/g;
const placeholderPattern = /placeholder=['"]([^'"]+)['"](?![^<]*?\{\s*t\s*\()/g;
const titlePattern = /title=['"]([^'"]+)['"](?![^<]*?\{\s*t\s*\()/g;
const labelPattern = /label=['"]([^'"]+)['"](?![^<]*?\{\s*t\s*\()/g;
const alertTitlePattern = /Alert\.alert\(['"]([^'"]+)['"][,)]/g;

// Results containers
const usedTranslationKeys = new Set();
const missingTranslationKeys = {};
const hardcodedText = [];
const translationFiles = {};

/**
 * Recursively scan a directory for files to analyze
 */
async function scanDirectory(dir) {
  try {
    const entries = await readDir(dir);
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry);
      
      // Skip excluded paths
      if (excludedPaths.some(excl => fullPath.includes(excl))) {
        continue;
      }
      
      const fileStat = await stat(fullPath);
      
      if (fileStat.isDirectory()) {
        await scanDirectory(fullPath);
      } else if (
        fileStat.isFile() && 
        (fullPath.endsWith('.js') || fullPath.endsWith('.jsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.tsx'))
      ) {
        await analyzeFile(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${dir}:`, error);
  }
}

/**
 * Analyze a file for translation keys and hardcoded text
 */
async function analyzeFile(filePath) {
  try {
    console.log(`Analyzing ${filePath}`);
    const content = await readFile(filePath, 'utf8');
    
    // Extract translation keys
    let match;
    while ((match = translationKeyPattern.exec(content)) !== null) {
      const key = match[1];
      usedTranslationKeys.add(key);
    }
    
    // Look for potential hardcoded text
    let hardcodedMatch;
    
    // Check for hardcoded Text components
    while ((hardcodedMatch = hardcodedTextPattern.exec(content)) !== null) {
      const text = hardcodedMatch[1].trim();
      if (text.length > 3 && !isExcludedText(text)) {
        hardcodedText.push({
          file: path.relative(appRoot, filePath),
          text: text,
          context: hardcodedMatch[0],
          type: 'Text component',
          severity: 'high'
        });
      }
    }
    
    // Check for other potential JSX text
    while ((hardcodedMatch = jsxTextPattern.exec(content)) !== null) {
      const text = hardcodedMatch[0].trim();
      if (
        text.length > 3 &&
        !isExcludedText(text) &&
        !text.includes('t(') && // Exclude already translated text
        !text.includes('style=')  // Try to exclude style blocks
      ) {
        hardcodedText.push({
          file: path.relative(appRoot, filePath),
          text: text,
          context: hardcodedMatch[0],
          type: 'JSX text',
          severity: 'medium'
        });
      }
    }
    
    // Check for prop text values
    while ((hardcodedMatch = propTextPattern.exec(content)) !== null) {
      const text = hardcodedMatch[1].trim();
      if (
        text.length > 3 &&
        !isExcludedText(text) &&
        isLikelyTranslatableText(text)
      ) {
        hardcodedText.push({
          file: path.relative(appRoot, filePath),
          text: text,
          context: hardcodedMatch[0],
          type: 'property value',
          severity: 'medium'
        });
      }
    }
    
    // Check for placeholder text
    while ((hardcodedMatch = placeholderPattern.exec(content)) !== null) {
      const text = hardcodedMatch[1].trim();
      if (text.length > 3 && !isExcludedText(text)) {
        hardcodedText.push({
          file: path.relative(appRoot, filePath),
          text: text,
          context: hardcodedMatch[0],
          type: 'placeholder',
          severity: 'high'
        });
      }
    }
    
    // Check for title text
    while ((hardcodedMatch = titlePattern.exec(content)) !== null) {
      const text = hardcodedMatch[1].trim();
      if (text.length > 3 && !isExcludedText(text)) {
        hardcodedText.push({
          file: path.relative(appRoot, filePath),
          text: text,
          context: hardcodedMatch[0],
          type: 'title',
          severity: 'high'
        });
      }
    }
    
    // Check for label text
    while ((hardcodedMatch = labelPattern.exec(content)) !== null) {
      const text = hardcodedMatch[1].trim();
      if (text.length > 3 && !isExcludedText(text)) {
        hardcodedText.push({
          file: path.relative(appRoot, filePath),
          text: text,
          context: hardcodedMatch[0],
          type: 'label',
          severity: 'high'
        });
      }
    }
    
    // Check for Alert titles
    while ((hardcodedMatch = alertTitlePattern.exec(content)) !== null) {
      const text = hardcodedMatch[1].trim();
      if (text.length > 3 && !isExcludedText(text)) {
        hardcodedText.push({
          file: path.relative(appRoot, filePath),
          text: text,
          context: hardcodedMatch[0],
          type: 'alert title',
          severity: 'critical'
        });
      }
    }
  } catch (error) {
    console.error(`Error analyzing file ${filePath}:`, error);
  }
}

/**
 * Check if text should be excluded from hardcoded text analysis
 */
function isExcludedText(text) {
  // Common patterns to exclude
  const excludePatterns = [
    /^[\d\s.,:;!?#@$%()*+-/<=>'"{\[\]}_]+$/, // Numbers and punctuation only
    /^[\s\d.,:]*$/, // Whitespace, numbers and some punctuation only
    /^\s*$/, // Whitespace only
    /^\d+(\.\d+)?%?$/, // Numbers with optional decimal and percent
    /^\${.*}$/, // Template literal expressions
    /^#[0-9a-fA-F]{3,6}$/, // Hex color codes
    /^rgb\(.*\)$/, // RGB color values
    /^\w+:\s*\w+$/, // Key-value pairs
    /^\w+(,\s*\w+)*$/, // Comma-separated values
    /^\d{1,2}\/\d{1,2}\/\d{2,4}$/, // Date format
    /^https?:\/\//, // URLs
    /^data:image/, // Data URIs
    /^[a-zA-Z0-9_]+\.[a-zA-Z0-9_]+$/, // File extensions or object properties
    /^[a-zA-Z0-9_-]+-[a-zA-Z0-9_-]+$/, // Kebab-case IDs
    /^tint-/, // Color tint utility classes
    /^bg-/, // Background utility classes
    /^px-|py-|pt-|pb-|pl-|pr-|m[trblxy]?-/ // Margin/padding utility classes
  ];

  // Additional checks for common non-translatable items
  if (
    text.length <= 3 || // Very short strings
    text === 'null' || 
    text === 'undefined' ||
    text.includes('{{') || // Interpolation syntax
    text.includes('...')
  ) {
    return true;
  }

  return excludePatterns.some(pattern => pattern.test(text));
}

/**
 * Determine if a string is likely to be text that should be translated
 */
function isLikelyTranslatableText(text) {
  // Common phrases that should be translated
  const commonPhrases = [
    'cancel', 'confirm', 'save', 'delete', 'edit', 'update', 'add', 'remove',
    'name', 'email', 'phone', 'address', 'message', 'submit', 'login', 'logout',
    'signup', 'password', 'welcome', 'hello', 'goodbye', 'thanks', 'error', 'success',
    'warning', 'info', 'alert', 'notification', 'profile', 'settings', 'home', 'search',
    'cancel', 'done', 'next', 'previous', 'continue', 'back', 'retry', 'help',
    'select', 'choose', 'pick', 'enter', 'input', 'send', 'receive', 'forgot', 'remember'
  ];

  // Check if the text is a common phrase (case insensitive)
  if (commonPhrases.some(phrase => text.toLowerCase() === phrase)) {
    return true;
  }

  // UI-specific phrases
  const uiPhrases = ['try again', 'sign in', 'sign up', 'sign out', 'log in', 'log out', 'password reset', 'set up'];
  if (uiPhrases.some(phrase => text.toLowerCase().includes(phrase))) {
    return true;
  }

  // Likely translatable if it contains spaces and starts with uppercase or includes multiple words
  return (
    (text.includes(' ') && /^[A-Z]/.test(text)) || 
    (text.includes(' ') && text.split(' ').length > 1) ||
    /^[A-Z][a-z]+\s[A-Z][a-z]+/.test(text) || // "Title Case"
    /^[A-Z][a-z]+$/.test(text) || // Single capitalized word (like "Cancel")
    text.includes('!') || // Exclamation marks usually indicate human readable text
    text.includes('?') // Question marks usually indicate human readable text
  );
}

/**
 * Load all translation files and check for missing keys
 */
async function loadTranslationFiles() {
  try {
    const files = await readDir(localesDir);
    
    for (const file of files) {
      if (!file.endsWith('.json')) continue;
      
      const filePath = path.join(localesDir, file);
      const content = await readFile(filePath, 'utf8');
      const language = file.replace('.json', '');
      
      try {
        const translations = JSON.parse(content);
        translationFiles[language] = flattenTranslations(translations);
      } catch (error) {
        console.error(`Error parsing translation file ${file}:`, error);
      }
    }
    
    // Check for missing translations
    const languages = Object.keys(translationFiles);
    
    for (const key of usedTranslationKeys) {
      const missingIn = languages.filter(lang => !translationFiles[lang][key]);
      
      if (missingIn.length > 0) {
        missingTranslationKeys[key] = missingIn;
      }
    }
  } catch (error) {
    console.error(`Error loading translation files:`, error);
  }
}

/**
 * Flatten nested translation objects to dot-notation
 */
function flattenTranslations(obj, prefix = '') {
  const result = {};
  
  for (const key in obj) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      Object.assign(result, flattenTranslations(obj[key], newKey));
    } else {
      result[newKey] = obj[key];
    }
  }
  
  return result;
}

/**
 * Generate a report of translation issues
 */
async function generateReport() {
  // Group hardcoded text by file for better analysis
  const hardcodedTextByFile = {};
  hardcodedText.forEach(item => {
    if (!hardcodedTextByFile[item.file]) {
      hardcodedTextByFile[item.file] = [];
    }
    hardcodedTextByFile[item.file].push(item);
  });

  // Group hardcoded text by severity
  const hardcodedTextBySeverity = {
    critical: hardcodedText.filter(item => item.severity === 'critical'),
    high: hardcodedText.filter(item => item.severity === 'high'),
    medium: hardcodedText.filter(item => item.severity === 'medium'),
    low: hardcodedText.filter(item => item.severity === 'low' || !item.severity)
  };

  // Group by type
  const hardcodedTextByType = {};
  hardcodedText.forEach(item => {
    const type = item.type || 'unknown';
    if (!hardcodedTextByType[type]) {
      hardcodedTextByType[type] = [];
    }
    hardcodedTextByType[type].push(item);
  });

  const report = {
    scanTime: new Date().toISOString(),
    usedTranslationKeysCount: usedTranslationKeys.size,
    usedTranslationKeys: Array.from(usedTranslationKeys),
    missingTranslationKeys,
    hardcodedText,
    hardcodedTextByFile,
    hardcodedTextBySeverity,
    hardcodedTextByType,
    languages: Object.keys(translationFiles),
    translationCoverage: {},
    summary: {
      filesScanned: 0,
      hardcodedTextCount: hardcodedText.length,
      criticalIssuesCount: hardcodedTextBySeverity.critical.length,
      highIssuesCount: hardcodedTextBySeverity.high.length,
      mediumIssuesCount: hardcodedTextBySeverity.medium.length,
      lowIssuesCount: hardcodedTextBySeverity.low.length
    }
  };
  
  // Calculate translation coverage by language
  for (const language in translationFiles) {
    const totalKeys = Object.keys(translationFiles[language]).length;
    const usedKeys = usedTranslationKeys.size;
    const missingCount = missingTranslationKeys[language] ? missingTranslationKeys[language].length : 0;
    
    report.translationCoverage[language] = {
      totalKeys,
      usedKeys,
      missingCount,
      coverage: (usedKeys - missingCount) / usedKeys * 100
    };
  }
  
  await writeFile(reportFile, JSON.stringify(report, null, 2), 'utf8');
  console.log(`Report generated at ${reportFile}`);
  
  // Print summary to console
  console.log('\n=== Translation Validation Summary ===');
  console.log(`Total translation keys used in code: ${usedTranslationKeys.size}`);
  console.log(`Missing translations found for ${Object.keys(missingTranslationKeys).length} keys`);
  console.log(`Potential hardcoded text: ${hardcodedText.length} instances`);
  console.log(`- Critical issues: ${report.summary.criticalIssuesCount}`);
  console.log(`- High-priority issues: ${report.summary.highIssuesCount}`);
  console.log(`- Medium-priority issues: ${report.summary.mediumIssuesCount}`);
  console.log(`- Low-priority issues: ${report.summary.lowIssuesCount}`);
  
  console.log('\nTop 10 files with most hardcoded text:');
  const topFiles = Object.entries(report.hardcodedTextByFile)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 10);
  
  topFiles.forEach(([file, instances]) => {
    console.log(`- ${file}: ${instances.length} instances`);
  });
  
  console.log('\nLanguage Coverage:');
  
  for (const language in report.translationCoverage) {
    const coverage = report.translationCoverage[language];
    console.log(`- ${language}: ${coverage.coverage.toFixed(2)}% (${coverage.totalKeys} keys, ${coverage.missingCount} missing)`);
  }
  
  console.log('\nFor full details, check the generated report file.');
}

/**
 * Main function
 */
async function main() {
  console.log('Starting translation validation...');
  
  for (const dir of srcDirs) {
    await scanDirectory(dir);
  }
  
  await loadTranslationFiles();
  await generateReport();
  
  console.log('Translation validation complete.');
}

// Run the script
main().catch(error => {
  console.error('Error running translation validator:', error);
  process.exit(1);
});
