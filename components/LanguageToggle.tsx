import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Modal, FlatList, Alert } from 'react-native';
import { useTranslation } from '../hooks/useTranslation';
import { LanguageCode } from '../context/I18nContext';

export const LanguageToggle = () => {
  const { currentLanguage, changeLanguage, getSupportedLanguages, isRTL } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  // Get supported languages from the hook
  const supportedLanguages = getSupportedLanguages();
  
  const languageList = Object.entries(supportedLanguages).map(([code, details]) => ({
    code,
    name: details.name,
    rtl: details.rtl
  }));

  const renderLanguageItem = ({ item }: { item: { code: string; name: string } }) => (
    <TouchableOpacity
      style={[styles.languageItem, currentLanguage.code === item.code && styles.selectedLanguage]}
      onPress={() => {
        try {
          // Use try-catch to prevent crashes
          changeLanguage(item.code as LanguageCode)
            .then(() => {
              setIsModalVisible(false);
            })
            .catch(error => {
              console.error('Error changing language:', error);
              setIsModalVisible(false);
              Alert.alert('Error', 'There was a problem changing the language');
            });
        } catch (error) {
          console.error('Error changing language:', error);
          setIsModalVisible(false);
          Alert.alert('Error', 'There was a problem changing the language');
        }
      }}
    >
      <Text style={[styles.languageText, currentLanguage.code === item.code && styles.selectedLanguageText]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  // Get the current language name safely
  const getCurrentLanguageName = () => {
    try {
      return currentLanguage.name || 'Select Language';
    } catch (error) {
      console.error('Error getting language name:', error);
      return 'Select Language';
    }
  };

  return (
    <>
      <View style={[styles.toggleContainer, isRTL && { justifyContent: 'flex-start' }]}>
        <TouchableOpacity
          style={styles.toggle}
          onPress={() => setIsModalVisible(true)}
        >
          <Text style={styles.text}>{getCurrentLanguageName()}</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Language</Text>
            </View>
            <FlatList
              data={languageList}
              renderItem={renderLanguageItem}
              keyExtractor={item => item.code}
              style={styles.languageList}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  toggleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 20,
    paddingTop: 50,
    zIndex: 10,
  },
  toggle: {
    padding: 8,
    paddingHorizontal: 12,
    borderRadius: 100,
    backgroundColor: '#F5F5F5',
  },
  text: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalHeader: {
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
  },
  modalContent: {
    width: '80%',
    maxHeight: '70%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  languageList: {
    width: '100%',
  },
  languageItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 4,
  },
  selectedLanguage: {
    backgroundColor: '#F5F5F5',
  },
  languageText: {
    fontSize: 16,
    color: '#333333',
  },
  selectedLanguageText: {
    color: '#0066FF',
    fontWeight: '600',
  },
});
