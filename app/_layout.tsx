import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { I18nProvider } from '@/context/I18nContext';
import { AuthProvider } from '../context/AuthContext';
import { TransactionAuthProvider } from '../context/TransactionAuthContext';
import { LanguageProvider } from '../contexts/LanguageContext';
import { I18nManager, View, StyleSheet } from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';
import { useFonts } from 'expo-font';
import RTLProvider from '../components/RTLProvider';
import { getRTLFlexDirection } from '../utils/rtlUtils';

export default function RootLayout() {
  // Load fonts or other resources if needed
  const [fontsLoaded] = useFonts({
    // Add your fonts here if needed
  });

  return (
    <LanguageProvider>
      <RootLayoutContent />
    </LanguageProvider>
  );
}

// Separate component to access the language context
function RootLayoutContent() {
  const { currentLanguage } = useLanguage();
  
  // Set the layout direction based on the current language
  useEffect(() => {
    if (currentLanguage) {
      // Ensure RTL is properly set for the entire app
      const shouldBeRTL = currentLanguage.isRTL;
      if (I18nManager.isRTL !== shouldBeRTL) {
        // This should be handled by the language change process
        // with app reload, but we set it here as a fallback
        I18nManager.allowRTL(shouldBeRTL);
        I18nManager.forceRTL(shouldBeRTL);
        
        // For React Native, we don't need to manipulate the DOM directly
        // The I18nManager.forceRTL will handle the RTL layout
      }
    }
  }, [currentLanguage]);

  // Create RTL-aware styles
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      // Use column layout for the main container
      flexDirection: 'column',
    },
    contentContainer: {
      flex: 1,
      // Use column layout for content container
      flexDirection: 'column',
    }
  });

  return (
    <I18nProvider>
      <AuthProvider>
        <TransactionAuthProvider>
          {/* Wrap the entire app in the RTLProvider to ensure proper RTL layout */}
          <RTLProvider>
            <View style={styles.container}>
              <Stack screenOptions={{ 
                headerShown: false,
                // Apply RTL-aware animations and layouts
                // For RTL languages, screens should slide from left
                animation: I18nManager.isRTL ? 'slide_from_left' : 'slide_from_right',
                animationDuration: 200,
                // Swap header buttons for RTL languages
                headerLeft: I18nManager.isRTL ? (props) => props.canGoBack ? null : null : undefined,
                headerRight: I18nManager.isRTL ? undefined : (props) => props.canGoBack ? null : null,
                // Apply RTL-specific layout to all screens
                contentStyle: styles.contentContainer,
              }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="(modals)/language-selector-modal" options={{ presentation: 'modal', headerShown: false }} />
                <Stack.Screen name="welcome" />
                <Stack.Screen name="login" />
                <Stack.Screen name="register" />
                <Stack.Screen name="+not-found" />
              </Stack>
            </View>
            <StatusBar style="auto" />
          </RTLProvider>
        </TransactionAuthProvider>
      </AuthProvider>
    </I18nProvider>
  );
}