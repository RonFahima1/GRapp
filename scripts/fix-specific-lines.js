// fix-specific-lines.js
const fs = require('fs');

// Path to the file we want to modify
const filePath = '/Users/ron/Downloads/New Folder With Items/remit2 2/app/(modals)/exchange-flow/amount.tsx';

// Read the current content
let content = fs.readFileSync(filePath, 'utf8');

// Split the content into lines
const lines = content.split('\n');

// Replace lines 193 and 248 which have the ChevronLeft issues
if (lines.length >= 193) {
  lines[192] = '                <ChevronDown color="#8E8E93" size={16} />';
}

if (lines.length >= 248) {
  lines[247] = '                <ChevronDown color="#8E8E93" size={16} />';
}

// Join the lines back together
const newContent = lines.join('\n');

// Write the modified content back to the file
fs.writeFileSync(filePath, newContent, 'utf8');

console.log('Successfully replaced ChevronLeft references with ChevronDown on lines 193 and 248');
