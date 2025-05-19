import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LanguagePreferences } from './LanguagePreferences';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslate } from '../context/TranslationContext';
import { ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

/**
 * A test component to demonstrate the enhanced language switcher with iOS-style 
 * picker and haptic feedback.
 */
export function LanguageSwitcherTest() {
  const { t } = useTranslate();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
          accessibilityRole="button"
          accessibilityLabel={t('common.back', 'Back')}
        >
          <ChevronLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('language_settings.title', 'Language Settings')}</Text>
        <View style={styles.placeholder} />
      </View>
      
      <View style={styles.content}>
        <Text style={styles.description}>
          {t('language_settings.description', 'Select your preferred language below. The app will automatically adjust to your selection.')}
        </Text>
        
        <LanguagePreferences 
          onSave={() => {
            console.log('Language saved successfully');
            // In a real app, you might want to reload the app or navigate back
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 60,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 5, // Consistent with the memory requirement
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
  },
  placeholder: {
    width: 24, // Same width as the back button for alignment
  },
  content: {
    flex: 1,
    padding: 16,
  },
  description: {
    fontSize: 16,
    color: '#555555',
    lineHeight: 22,
    marginBottom: 24,
  }
});
