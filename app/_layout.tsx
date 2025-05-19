import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { TranslationProvider, useTranslate } from '../context/TranslationContext';
import { AuthProvider } from '../context/AuthContext';
import { TransactionAuthProvider } from '../context/TransactionAuthContext';
import { I18nManager, View, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';

export default function RootLayout() {
  // Load fonts or other resources if needed
  const [fontsLoaded] = useFonts({
    // Add your fonts here if needed
  });

  return (
    <TranslationProvider>
      <RootLayoutContent />
    </TranslationProvider>
  );
}

// Separate component to access the translation context
function RootLayoutContent() {
  const { currentLanguage, isRTL } = useTranslate();
  
  // Set the layout direction based on the current language
  useEffect(() => {
    // Ensure RTL is properly set for the entire app
    if (I18nManager.isRTL !== isRTL) {
      // This should be handled by the language change process
      // with app reload, but we set it here as a fallback
      I18nManager.allowRTL(isRTL);
      I18nManager.forceRTL(isRTL);
    }
  }, [isRTL]);

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
    <AuthProvider>
      <TransactionAuthProvider>
        <View style={styles.container}>
          <Stack screenOptions={{ 
            headerShown: false,
            // Apply RTL-aware animations and layouts
            // For RTL languages, screens should slide from left
            animation: isRTL ? 'slide_from_left' : 'slide_from_right',
            animationDuration: 200,
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
      </TransactionAuthProvider>
    </AuthProvider>
  );
}