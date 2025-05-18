import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Platform, SafeAreaView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { ChevronRight, Globe } from 'lucide-react-native';
import { useLanguage } from '../contexts/LanguageContext';
import { LANGUAGES } from '../translations';
import * as Haptics from 'expo-haptics';

interface LanguageSelectorProps {
  onPress?: () => void;
  showCurrentLanguage?: boolean;
}

export const LanguageSelector = ({ onPress, showCurrentLanguage = true }: LanguageSelectorProps) => {
  const { currentLanguage, setLanguage } = useLanguage();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tempSelectedLanguage, setTempSelectedLanguage] = useState(currentLanguage.code);

  const handleTap = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const openLanguageModal = () => {
    handleTap();
    setTempSelectedLanguage(currentLanguage.code);
    setIsModalVisible(true);
    if (onPress) onPress();
  };

  const handleCancel = () => {
    handleTap();
    setIsModalVisible(false);
  };

  const handleDone = async () => {
    handleTap();
    setIsModalVisible(false);
    
    // Check if selected language is RTL
    const selectedLang = LANGUAGES.find(lang => lang.code === tempSelectedLanguage);
    if (selectedLang && selectedLang.isRTL) {
      Alert.alert(
        'RTL Language Selected',
        `You've selected ${selectedLang.name}, which is a right-to-left language. The app needs to restart to apply this change.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Continue', 
            onPress: () => setLanguage(tempSelectedLanguage)
          }
        ]
      );
    } else {
      // For non-RTL languages, just apply the change
      await setLanguage(tempSelectedLanguage);
    }
  };

  // Component for the language menu item (used in settings screens)
  if (showCurrentLanguage) {
    return (
      <>
        <TouchableOpacity 
          style={styles.languageButton} 
          onPress={openLanguageModal}
        >
          <View style={styles.languageContent}>
            <Globe color="#007AFF" size={22} style={styles.icon} />
            <Text style={styles.languageName}>Language</Text>
          </View>
          <View style={styles.languageSelector}>
            <Text style={styles.currentLanguage}>{currentLanguage.nativeName}</Text>
            <ChevronRight color="#CCCCCC" size={20} />
          </View>
        </TouchableOpacity>

        <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent={true}
        >
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={handleCancel} style={styles.headerButton}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Select Language</Text>
                <TouchableOpacity onPress={handleDone} style={styles.headerButton}>
                  <Text style={styles.doneText}>Done</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={tempSelectedLanguage}
                  onValueChange={(itemValue) => setTempSelectedLanguage(itemValue)}
                  style={styles.picker}
                  itemStyle={styles.pickerItem}
                >
                  {LANGUAGES.map((language) => (
                    <Picker.Item 
                      key={language.code} 
                      label={`${language.nativeName} (${language.name})`} 
                      value={language.code} 
                    />
                  ))}
                </Picker>
              </View>
            </View>
          </SafeAreaView>
        </Modal>
      </>
    );
  }
};

const styles = StyleSheet.create({
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  languageContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 12,
  },
  languageName: {
    fontSize: 17,
    fontWeight: '500',
    color: '#1C1C1E',
  },
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentLanguage: {
    fontSize: 15,
    color: '#8E8E93',
    marginRight: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerButton: {
    padding: 4,
  },
  cancelText: {
    fontSize: 16,
    color: '#999999',
  },
  doneText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  pickerContainer: {
    height: 200,
  },
  picker: {
    height: 200,
  },
  pickerItem: {
    fontSize: 18,
  },
});
