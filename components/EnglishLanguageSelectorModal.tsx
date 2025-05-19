import React, { useEffect } from 'react';
import { ActionSheetIOS, Platform, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { LanguageCode, SUPPORTED_LANGUAGES } from '../context/TranslationContext';

interface IOSLanguageSelectorProps {
  isVisible: boolean;
  onClose: () => void;
  selectedLanguage: string;
  onSelectLanguage: (code: string) => void;
}

/**
 * iOS-style language selector that uses the native ActionSheet
 * to display languages in their native form
 */
export default function IOSLanguageSelector({
  isVisible,
  onClose,
  selectedLanguage,
  onSelectLanguage,
}: IOSLanguageSelectorProps) {
  // Function to provide haptic feedback
  const handleTap = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  // Show ActionSheet when modal becomes visible
  useEffect(() => {
    if (isVisible && Platform.OS === 'ios') {
      showLanguageActionSheet();
    }
  }, [isVisible]);

  // Show the iOS ActionSheet with languages in their native form
  const showLanguageActionSheet = () => {
    // Prepare language options with native names
    const languageOptions = Object.entries(SUPPORTED_LANGUAGES).map(([code, lang]) => {
      // Show language in its native name (e.g., English, ไทย, हिन्दी)
      return lang.nativeName;
    });

    // Add cancel option
    const options = [...languageOptions, 'Cancel'];
    const cancelButtonIndex = options.length - 1;
    
    // Get the index of the currently selected language
    const languageCodes = Object.keys(SUPPORTED_LANGUAGES);
    const currentIndex = languageCodes.indexOf(selectedLanguage);

    ActionSheetIOS.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        userInterfaceStyle: 'light',
        title: 'Select Language',
      },
      (buttonIndex) => {
        if (buttonIndex !== cancelButtonIndex) {
          // User selected a language
          handleTap();
          const selectedCode = languageCodes[buttonIndex];
          onSelectLanguage(selectedCode);
        }
        
        // Close the modal after selection or cancel
        onClose();
      }
    );
  };

  // This component doesn't render anything visible itself
  // It just triggers the native ActionSheet
  return null;
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#F2F2F7',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    minHeight: '50%',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  closeButton: {
    padding: 5,
  },
  cancelButton: {
    color: '#007AFF',
    fontSize: 16,
  },
  doneButton: {
    padding: 5,
  },
  doneButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
  rightPlaceholder: {
    width: 34, // Same width as close button for centered title
  },
  scrollView: {
    flex: 1,
  },
  languageList: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  languageItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  languageItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  languageName: {
    fontSize: 17,
    color: '#1C1C1E',
  },
});
