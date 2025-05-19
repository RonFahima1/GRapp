#!/bin/bash

# Fix the ChevronLeft errors in exchange-flow/amount.tsx
# This replaces line 192 and 247 with ArrowDown components

# First let's create a backup
cp "/Users/ron/Downloads/New Folder With Items/remit2 2/app/(modals)/exchange-flow/amount.tsx" "/Users/ron/Downloads/New Folder With Items/remit2 2/app/(modals)/exchange-flow/amount.tsx.bak"

# Now use sed to replace the problematic lines
# Replace line 192
sed -i '' '192s/<ChevronLeft color="#8E8E93" size={16} style={{ transform: \[{ rotate: '\''\\-90deg'\''\' }] }} \/>/<ArrowDown color="#8E8E93" size={16} \/>/' "/Users/ron/Downloads/New Folder With Items/remit2 2/app/(modals)/exchange-flow/amount.tsx"

# Replace line 247
sed -i '' '247s/<ChevronLeft color="#8E8E93" size={16} style={{ transform: \[{ rotate: '\''\\-90deg'\''\' }] }} \/>/<ArrowDown color="#8E8E93" size={16} \/>/' "/Users/ron/Downloads/New Folder With Items/remit2 2/app/(modals)/exchange-flow/amount.tsx"

echo "Fixed ChevronLeft issues in exchange-flow/amount.tsx"
