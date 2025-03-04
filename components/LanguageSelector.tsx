import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from '../context/I18nContext';

export const LanguageSelector = () => {
  const { 
    currentLanguage, 
    changeLanguage, 
    supportedLanguages
  } = useTranslation();

  return (
    <ScrollView style={styles.container}>
      {Object.entries(supportedLanguages).map(([code, { name, rtl }]) => (
        <TouchableOpacity
          key={code}
          style={[
            styles.languageButton,
            currentLanguage === code && styles.selectedLanguage,
          ]}
          onPress={() => {
            console.log('Language button pressed:', code);
            changeLanguage(code);
          }}
        >
          <View style={styles.languageContent}>
            <Text style={[
              styles.languageName,
              currentLanguage === code && styles.selectedText,
              rtl && styles.rtlText
            ]}>
              {name}
            </Text>
            <Text style={[
              styles.languageCode,
              currentLanguage === code && styles.selectedText
            ]}>
              ({code.toUpperCase()})
            </Text>
          </View>
          {currentLanguage === code && (
            <Text style={styles.checkmark}>✓</Text>
          )}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  languageContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageName: {
    fontSize: 16,
    color: '#333',
    marginRight: 8,
  },
  languageCode: {
    fontSize: 14,
    color: '#666',
  },
  selectedLanguage: {
    backgroundColor: '#F0F8FF',
  },
  selectedText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  rtlText: {
    textAlign: 'right',
  },
  checkmark: {
    color: '#007AFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
