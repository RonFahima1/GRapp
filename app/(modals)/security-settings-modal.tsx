import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Switch,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Fingerprint, Lock, Key, Moon, Globe } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Platform } from 'react-native';
import { useTranslate, LanguageCode } from '../../context/TranslationContext';
import IOSLanguageSelector from '../../components/IOSLanguageSelector';
import StandardBackButton from '../../components/StandardBackButton';

export default function SecuritySettingsModal() {
  const router = useRouter();
  const { t, isRTL, currentLanguage, languages, changeLanguage } = useTranslate();
  const [isFaceIDEnabled, setIsFaceIDEnabled] = useState(false);
  const [isDarkModeEnabled, setIsDarkModeEnabled] = useState(false);
  const [isLanguageSelectorVisible, setIsLanguageSelectorVisible] = useState(false);

  // Handle tap with haptic feedback
  const handleTap = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  // Navigate to Change Password screen
  const navigateToChangePassword = () => {
    handleTap();
    router.push('/(modals)/change-password');
  };

  // Navigate to Security Questions screen
  const navigateToSecurityQuestions = () => {
    handleTap();
    router.push('/(modals)/security-questions');
  };
  


  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header with title and back button */}
      <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <StandardBackButton />
        <Text style={styles.headerTitle}>{t('security.section_title')}</Text>
        <View style={styles.rightPlaceholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Face ID section */}
        <View style={styles.section}>
          <View style={[styles.sectionHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Fingerprint color="#007AFF" size={22} />
            <Text style={[styles.sectionHeaderTitle, { marginLeft: isRTL ? 0 : 10, marginRight: isRTL ? 10 : 0 }]}>{t('security.faceID')}</Text>
          </View>
          <View style={styles.sectionContent}>
            <Text style={[styles.sectionDescription, { textAlign: isRTL ? 'right' : 'left' }]}>
              {t('security.faceIDDescription')}
            </Text>
            <Switch
              value={isFaceIDEnabled}
              onValueChange={(value) => {
                handleTap();
                setIsFaceIDEnabled(value);
              }}
              trackColor={{ false: '#E0E0E0', true: '#007AFF' }}
              thumbColor={'#FFFFFF'}
              ios_backgroundColor="#E0E0E0"
            />
          </View>
        </View>

        {/* Change Password section */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.sectionItem} 
            onPress={navigateToChangePassword}
          >
            <View style={[styles.sectionItemContent, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Lock color="#007AFF" size={22} style={{ marginRight: isRTL ? 0 : 12, marginLeft: isRTL ? 12 : 0 }} />
              <Text style={styles.itemText}>{t('security.changePassword')}</Text>
              <ChevronLeft color="#CCCCCC" size={20} hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }} />
            </View>
          </TouchableOpacity>
        </View>



        {/* Security Questions section */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.sectionItem} 
            onPress={navigateToSecurityQuestions}
          >
            <View style={[styles.sectionItemContent, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Key color="#007AFF" size={22} style={{ marginRight: isRTL ? 0 : 12, marginLeft: isRTL ? 12 : 0 }} />
              <Text style={styles.itemText}>{t('security.securityQuestions')}</Text>
              <ChevronLeft color="#CCCCCC" size={20} hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }} />
            </View>
          </TouchableOpacity>
        </View>
        
        {/* Preferences Section Title */}
        <View style={styles.sectionTitleContainer}>
          <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>{t('security.preferences')}</Text>
        </View>
        
        {/* Dark Mode section */}
        <View style={styles.section}>
          <View style={[styles.sectionHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Moon color="#007AFF" size={22} />
            <Text style={[styles.sectionHeaderTitle, { marginLeft: isRTL ? 0 : 10, marginRight: isRTL ? 10 : 0 }]}>{t('profile.darkMode')}</Text>
          </View>
          <View style={styles.sectionContent}>
            <Text style={[styles.sectionDescription, { textAlign: isRTL ? 'right' : 'left' }]}>
              {t('common.darkModeDescription')}
            </Text>
            <Switch
              value={isDarkModeEnabled}
              onValueChange={(value) => {
                handleTap();
                setIsDarkModeEnabled(value);
              }}
              trackColor={{ false: '#E0E0E0', true: '#007AFF' }}
              thumbColor={'#FFFFFF'}
              ios_backgroundColor="#E0E0E0"
            />
          </View>
        </View>
        
        {/* Language section */}
        <View style={styles.section}>
          <View style={styles.sectionItem}>
            <TouchableOpacity 
              style={[styles.sectionItemContent, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
              onPress={() => {
                handleTap();
                // Show language selector modal directly rather than navigating
                setIsLanguageSelectorVisible(true);
              }}
            >
              <Globe color="#007AFF" size={22} style={{ marginRight: isRTL ? 0 : 12, marginLeft: isRTL ? 12 : 0 }} />
              <Text style={[styles.itemText, { flex: 1, textAlign: isRTL ? 'right' : 'left' }]}>{t('settings.language')}</Text>
              <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center' }}>
                <Text style={[styles.languageValue, { textAlign: isRTL ? 'right' : 'left' }]}>
                  {currentLanguage === 'th' ? 'ไทย' : languages[currentLanguage].nativeName}
                </Text>
                <ChevronLeft 
                  color="#CCCCCC" 
                  size={20}
                  hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>
      
      {/* iOS-style Language Selector */}
      <IOSLanguageSelector 
        isVisible={isLanguageSelectorVisible}
        onClose={() => setIsLanguageSelectorVisible(false)}
        selectedLanguage={currentLanguage}
        onSelectLanguage={(langCode: string) => {
          changeLanguage(langCode as LanguageCode);
          setIsLanguageSelectorVisible(false);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  rightPlaceholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginVertical: 8,
    borderRadius: 8,
    overflow: 'hidden',
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sectionHeaderTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
    color: '#333333',
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666666',
    flex: 1,
    marginRight: 10,
  },
  sectionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  sectionItem: {
    padding: 0,
  },
  sectionItemContent: {
    alignItems: 'center',
    padding: 16,
  },
  itemIcon: {
    marginRight: 12,
  },
  itemText: {
    fontSize: 16,
    color: '#333333',
    flex: 1,
  },
  chevronIcon: {
    marginLeft: 8,
  },
  languageValue: {
    fontSize: 15,
    color: '#8E8E93',
    marginRight: 8,
    textAlign: 'right',
  },
  bottomPadding: {
    height: 40,
  },
  sectionTitleContainer: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6D6D72',
    // Removed uppercase transformation
  },

});
