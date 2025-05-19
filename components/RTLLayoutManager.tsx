/**
 * RTLLayoutManager.tsx - Component for managing RTL layout across the app
 * 
 * This component should be placed near the root of your application
 * to properly configure RTL handling for Hebrew and Arabic languages.
 */

import React, { useEffect, useContext } from 'react';
import { I18nManager, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import SecureStore from 'expo-secure-store';
import * as Updates from 'expo-updates';

// RTL constants and helper functions
import { RTL_LANGUAGES, configureRTL } from '../utils/rtlUtils';

// Key for storing RTL state
const RTL_STATE_KEY = 'app_rtl_enabled';

interface RTLLayoutManagerProps {
  children: React.ReactNode;
}

const RTLLayoutManager: React.FC<RTLLayoutManagerProps> = ({ children }) => {
  const { i18n } = useTranslation();
  
  useEffect(() => {
    // Function to sync RTL status with selected language
    const syncRTLLayout = async () => {
      try {
        const currentLanguage = i18n.language;
        const isRTLLanguage = RTL_LANGUAGES.includes(currentLanguage);
        
        // Get the current stored RTL state
        const storedRTLState = await SecureStore.getItemAsync(RTL_STATE_KEY);
        const rtlEnabled = storedRTLState === 'true';
        
        // Only update if there's a mismatch
        if (isRTLLanguage !== rtlEnabled || isRTLLanguage !== I18nManager.isRTL) {
          console.log(`Setting RTL mode to: ${isRTLLanguage}`);
          
          // Update native RTL settings
          I18nManager.allowRTL(isRTLLanguage);
          I18nManager.forceRTL(isRTLLanguage);
          
          // Save the new state
          await SecureStore.setItemAsync(RTL_STATE_KEY, isRTLLanguage.toString());
          
          // Check if we need to reload the app
          if (I18nManager.isRTL !== isRTLLanguage) {
            // In development, we can use Updates.reloadAsync()
            // In production, you might want to show a message to the user first
            if (__DEV__) {
              console.log('Reloading app to apply RTL changes...');
              Updates.reloadAsync();
            } else {
              // For production, you might want a more graceful approach
              console.log('RTL setting changed - app should restart');
              // You could show a dialog asking the user to restart
            }
          }
        }
      } catch (error) {
        console.error('Error setting up RTL layout:', error);
      }
    };
    
    // Run the sync when language changes
    syncRTLLayout();
    
    // Subscribe to language changes
    const handleLanguageChange = () => {
      syncRTLLayout();
    };
    
    i18n.on('languageChanged', handleLanguageChange);
    
    // Cleanup
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);
  
  return (
    <View style={styles.container}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default RTLLayoutManager;
