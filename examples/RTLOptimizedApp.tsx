/**
 * RTLOptimizedApp.tsx - Example of how to integrate RTL optimization
 * 
 * This shows how to properly set up RTL support for Hebrew and Arabic
 * using the components and utilities we've created.
 */

import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';

// Import our RTL components
import RTLLayoutManager from '../components/RTLLayoutManager';
import { configureRTL, isRTL } from '../utils/rtlUtils';

// This would be your actual app navigation
import MainNavigator from '../navigation/MainNavigator'; // Replace with your actual path

const RTLOptimizedApp = () => {
  const { i18n } = useTranslation();
  
  // Configure RTL on app start and language changes
  useEffect(() => {
    const setupRTL = async () => {
      const rtlEnabled = configureRTL(i18n.language);
      console.log(`RTL mode is ${rtlEnabled ? 'enabled' : 'disabled'} for language: ${i18n.language}`);
    };
    
    setupRTL();
    
    // Listen for language changes
    const handleLanguageChange = () => {
      setupRTL();
    };
    
    i18n.on('languageChanged', handleLanguageChange);
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);
  
  // Determine the app layout direction based on current language
  const isRtlLayout = isRTL(i18n.language);
  
  return (
    <SafeAreaProvider>
      <RTLLayoutManager>
        <NavigationContainer>
          <StatusBar style="auto" />
          <MainNavigator />
        </NavigationContainer>
      </RTLLayoutManager>
    </SafeAreaProvider>
  );
};

export default RTLOptimizedApp;
