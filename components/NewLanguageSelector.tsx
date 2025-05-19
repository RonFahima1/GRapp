import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  SafeAreaView,
  Platform,
} from 'react-native';
import { ChevronLeft, Globe } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useTranslate, LanguageCode } from '../context/TranslationContext';

interface LanguageSelectorProps {
  onPress?: () => void;
  showCurrentLanguage?: boolean;
  style?: any;
  isSettingsItem?: boolean;
}

export const NewLanguageSelector = ({
  onPress,
  showCurrentLanguage = true,
  style,
  isSettingsItem = false
}: LanguageSelectorProps) => {
  const { currentLanguage, languages, changeLanguage, t, isRTL } = useTranslate();
  const [isModalVisible, setIsModalVisible] = useState(false);

  // List of languages from context
  const languageList = Object.entries(languages).map(([code, details]) => ({
    code: code as LanguageCode,
    name: details.name,
    nativeName: details.nativeName,
    rtl: details.rtl
  }));

  const handleTap = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
  };

  const openLanguageSelector = () => {
    handleTap();
    setIsModalVisible(true);
    if (onPress) onPress();
  };

  const handleSelectLanguage = async (languageCode: LanguageCode) => {
    handleTap();
    setIsModalVisible(false);
    
    try {
      await changeLanguage(languageCode);
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  const renderLanguageItem = ({ item }: { item: { code: LanguageCode; name: string; nativeName: string } }) => (
    <TouchableOpacity
      style={[
        styles.languageItem,
        currentLanguage === item.code && styles.selectedLanguageItem
      ]}
      onPress={() => handleSelectLanguage(item.code)}
    >
      <View style={styles.languageNameContainer}>
        <Text style={styles.nativeLanguageName}>{item.nativeName}</Text>
        <Text style={styles.languageName}>({item.name})</Text>
      </View>
      {currentLanguage === item.code && (
        <View style={styles.checkmark}>
          <Text style={styles.checkmarkText}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  // Settings screen item version
  if (isSettingsItem && showCurrentLanguage) {
    return (
      <>
        <TouchableOpacity 
          style={[styles.settingsItem, style]} 
          onPress={openLanguageSelector}
        >
          <View style={styles.settingsItemContent}>
            <Globe color="#007AFF" size={22} style={styles.icon} />
            <Text style={styles.settingsItemLabel}>{t('language')}</Text>
          </View>
          <View style={styles.settingsItemValue}>
            <Text style={styles.currentLanguageText}>
              {languages[currentLanguage]?.nativeName || ''}
            </Text>
            <ChevronLeft 
              color="#CCCCCC" 
              size={20} 
              style={[
                styles.chevron,
                isRTL ? {} : { transform: [{ rotate: '180deg' }] }
              ]} 
            />
          </View>
        </TouchableOpacity>

        <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsModalVisible(false)}
        >
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <TouchableOpacity 
                  onPress={() => setIsModalVisible(false)}
                  style={styles.backButton}
                  hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
                >
                  <ChevronLeft color="#007AFF" size={24} />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>{t('select_language')}</Text>
                <View style={styles.placeholder} />
              </View>
              
              <FlatList
                data={languageList}
                renderItem={renderLanguageItem}
                keyExtractor={item => item.code}
                style={styles.languageList}
                contentContainerStyle={styles.listContent}
              />
            </View>
          </SafeAreaView>
        </Modal>
      </>
    );
  }

  // Floating button version (for home screen)
  return (
    <>
      <TouchableOpacity
        style={[styles.floatingButton, style]}
        onPress={openLanguageSelector}
      >
        <Text style={styles.floatingButtonText}>
          {languages[currentLanguage]?.nativeName || ''}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity 
                onPress={() => setIsModalVisible(false)}
                style={styles.backButton}
                hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
              >
                <ChevronLeft color="#007AFF" size={24} />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>{t('select_language')}</Text>
              <View style={styles.placeholder} />
            </View>
            
            <FlatList
              data={languageList}
              renderItem={renderLanguageItem}
              keyExtractor={item => item.code}
              style={styles.languageList}
              contentContainerStyle={styles.listContent}
            />
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    right: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 100,
  },
  floatingButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingsItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsItemLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginLeft: 12,
  },
  settingsItemValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentLanguageText: {
    fontSize: 16,
    color: '#8E8E93',
    marginRight: 8,
  },
  icon: {
    marginRight: 4,
  },
  chevron: {
    padding: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalContent: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    padding: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 24,
  },
  languageList: {
    flex: 1,
  },
  listContent: {
    paddingVertical: 8,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  selectedLanguageItem: {
    backgroundColor: '#F9F9F9',
  },
  languageNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  nativeLanguageName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginRight: 8,
  },
  languageName: {
    fontSize: 14,
    color: '#8E8E93',
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
