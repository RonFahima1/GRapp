/**
 * rtlUtils.js - Utilities for RTL (Right-to-Left) language support
 * 
 * This file contains helper functions and constants for proper RTL handling
 * in Hebrew and Arabic interfaces.
 */

import { I18nManager } from 'react-native';
import { getLocales } from 'expo-localization';

// List of RTL languages supported in the app
export const RTL_LANGUAGES = ['he', 'ar'];

// Check if the current language is RTL
export const isRTL = (language) => {
  return RTL_LANGUAGES.includes(language);
};

// Get text alignment based on language
export const getTextAlign = (language) => {
  return isRTL(language) ? 'right' : 'left';
};

// Get flex direction for row layouts
export const getRowDirection = (language) => {
  return isRTL(language) ? 'row-reverse' : 'row';
};

// Get the start and end properties (replaces left/right in RTL-aware layouts)
export const getStartPosition = (language) => {
  return isRTL(language) ? 'right' : 'left';
};

export const getEndPosition = (language) => {
  return isRTL(language) ? 'left' : 'right';
};

// Get proper icon rotation for chevrons and arrows in RTL mode
export const getIconRotation = (language, iconType) => {
  if (!isRTL(language)) return '0deg';
  
  switch (iconType) {
    case 'chevron-left':
      return '180deg';
    case 'chevron-right':
      return '180deg';
    case 'arrow-left':
      return '180deg';
    case 'arrow-right':
      return '180deg';
    default:
      return '0deg';
  }
};

// Apply RTL specific style overrides
export const getRTLStyleOverrides = (language, baseStyles) => {
  if (!isRTL(language)) return baseStyles;
  
  const overrides = { ...baseStyles };
  
  // Swap padding/margin left and right if they exist
  if (overrides.paddingLeft !== undefined && overrides.paddingRight !== undefined) {
    const temp = overrides.paddingLeft;
    overrides.paddingLeft = overrides.paddingRight;
    overrides.paddingRight = temp;
  }
  
  if (overrides.marginLeft !== undefined && overrides.marginRight !== undefined) {
    const temp = overrides.marginLeft;
    overrides.marginLeft = overrides.marginRight;
    overrides.marginRight = temp;
  }
  
  // Swap border radius corners if they exist
  if (overrides.borderTopLeftRadius !== undefined && overrides.borderTopRightRadius !== undefined) {
    const temp = overrides.borderTopLeftRadius;
    overrides.borderTopLeftRadius = overrides.borderTopRightRadius;
    overrides.borderTopRightRadius = temp;
  }
  
  if (overrides.borderBottomLeftRadius !== undefined && overrides.borderBottomRightRadius !== undefined) {
    const temp = overrides.borderBottomLeftRadius;
    overrides.borderBottomLeftRadius = overrides.borderBottomRightRadius;
    overrides.borderBottomRightRadius = temp;
  }
  
  return overrides;
};

// Set up the RTL environment for the app based on current language
export const configureRTL = (language) => {
  const shouldUseRTL = isRTL(language);
  
  // Only update if the RTL status is different from current
  if (I18nManager.isRTL !== shouldUseRTL) {
    I18nManager.allowRTL(shouldUseRTL);
    I18nManager.forceRTL(shouldUseRTL);
    // Note: In a real app, you might want to restart the app here
    // to fully apply RTL changes, but this depends on your app architecture
  }
  
  return shouldUseRTL;
};

// Format a number according to RTL language conventions
export const formatNumberForRTL = (number, language) => {
  if (!number && number !== 0) return '';
  
  const numStr = number.toString();
  
  // For RTL languages, we don't need to change the digit characters,
  // but may need to adjust display of currency symbols and other formatting
  if (language === 'ar') {
    // For Arabic, we might want to use Arabic numerals in some cases
    // This would convert 0-9 to Arabic digits ٠-٩
    // Uncomment if needed:
    // return numStr.replace(/[0-9]/g, d => String.fromCharCode(d.charCodeAt(0) + 1584));
  }
  
  return numStr;
};

// Helper specifically for back button navigation
export const getBackButtonProps = (language) => {
  return {
    icon: isRTL(language) ? 'chevron-right' : 'chevron-left',
    style: {
      transform: [{ scaleX: isRTL(language) ? -1 : 1 }]
    },
    // Always include this for better touch target as per memory requirements
    hitSlop: { top: 15, right: 15, bottom: 15, left: 15 }
  };
};

export default {
  RTL_LANGUAGES,
  isRTL,
  getTextAlign,
  getRowDirection,
  getStartPosition,
  getEndPosition,
  getIconRotation,
  getRTLStyleOverrides,
  configureRTL,
  formatNumberForRTL,
  getBackButtonProps
};
