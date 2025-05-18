import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Switch,
  Alert,
  I18nManager
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, Fingerprint, Lock, Key, Moon } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Platform } from 'react-native';
import { LanguageSelector } from '../../components/LanguageSelector';
import { useTranslation } from '../../hooks/useTranslation';

export default function SecuritySettingsModal() {
  const router = useRouter();
  const { t } = useTranslation();
  const [isFaceIDEnabled, setIsFaceIDEnabled] = useState(false);
  const [isDarkModeEnabled, setIsDarkModeEnabled] = useState(false);

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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronRight color="#007AFF" size={24} style={[styles.backIcon, I18nManager.isRTL && styles.backIconRTL]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('security.title')}</Text>
        <View style={styles.rightPlaceholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Face ID section */}
        <View style={styles.section}>
          <View style={[styles.sectionHeader, I18nManager.isRTL && styles.sectionHeaderRTL]}>
            <Fingerprint color="#007AFF" size={22} />
            <Text style={styles.sectionHeaderTitle}>{t('security.faceID')}</Text>
          </View>
          <View style={styles.sectionContent}>
            <Text style={styles.sectionDescription}>
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
            <View style={[styles.sectionItemContent, I18nManager.isRTL && styles.sectionItemContentRTL]}>
              <Lock color="#007AFF" size={22} style={styles.itemIcon} />
              <Text style={styles.itemText}>{t('security.changePassword')}</Text>
              <ChevronRight color="#CCCCCC" size={20} style={[styles.chevronIcon, I18nManager.isRTL && styles.chevronIconRTL]} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Security Questions section */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.sectionItem} 
            onPress={navigateToSecurityQuestions}
          >
            <View style={[styles.sectionItemContent, I18nManager.isRTL && styles.sectionItemContentRTL]}>
              <Key color="#007AFF" size={22} style={styles.itemIcon} />
              <Text style={styles.itemText}>{t('security.securityQuestions')}</Text>
              <ChevronRight color="#CCCCCC" size={20} style={[styles.chevronIcon, I18nManager.isRTL && styles.chevronIconRTL]} />
            </View>
          </TouchableOpacity>
        </View>
        
        {/* Preferences Section Title */}
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>{t('security.preferences')}</Text>
        </View>
        
        {/* Dark Mode section */}
        <View style={styles.section}>
          <View style={[styles.sectionHeader, I18nManager.isRTL && styles.sectionHeaderRTL]}>
            <Moon color="#007AFF" size={22} />
            <Text style={styles.sectionHeaderTitle}>{t('profile.darkMode')}</Text>
          </View>
          <View style={styles.sectionContent}>
            <Text style={styles.sectionDescription}>
              {t('common.darkModeDescription') || 'Use dark theme for the app'}
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
          <LanguageSelector />
        </View>

        {/* Bottom padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>
      

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
    padding: 8,
  },
  backIcon: {
    transform: [{ scaleX: -1 }],
  },
  backIconRTL: {
    transform: [{ scaleX: 1 }],
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
  sectionHeaderRTL: {
    flexDirection: 'row-reverse',
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
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  sectionItem: {
    padding: 0,
  },
  sectionItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  sectionItemContentRTL: {
    flexDirection: 'row-reverse',
  },
  itemIcon: {
    marginRight: I18nManager.isRTL ? 0 : 12,
    marginLeft: I18nManager.isRTL ? 12 : 0,
  },
  itemText: {
    fontSize: 16,
    color: '#333333',
    flex: 1,
  },
  chevronIcon: {
    marginLeft: I18nManager.isRTL ? 0 : 8,
    marginRight: I18nManager.isRTL ? 8 : 0,
  },
  chevronIconRTL: {
    transform: [{ scaleX: -1 }],
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
    textTransform: 'uppercase',
  },

});
