import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Modal, FlatList } from 'react-native';
import { useTranslation, SUPPORTED_LANGUAGES } from '../context/I18nContext';

export const LanguageToggle = () => {
  const { currentLanguage, changeLanguage } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const languageList = Object.entries(SUPPORTED_LANGUAGES).map(([code, details]) => ({
    code,
    ...details
  }));

  const renderLanguageItem = ({ item }: { item: { code: string; name: string } }) => (
    <TouchableOpacity
      style={[styles.languageItem, currentLanguage === item.code && styles.selectedLanguage]}
      onPress={() => {
        changeLanguage(item.code);
        setIsModalVisible(false);
      }}
    >
      <Text style={[styles.languageText, currentLanguage === item.code && styles.selectedLanguageText]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <>
      <TouchableOpacity
        style={styles.toggle}
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={styles.text}>{SUPPORTED_LANGUAGES[currentLanguage].name}</Text>
      </TouchableOpacity>

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
  toggle: {
    position: 'absolute',
    top: 50,
    right: 20,
    padding: 8,
    paddingHorizontal: 12,
    borderRadius: 100,
    backgroundColor: '#F5F5F5',
    zIndex: 1,
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
