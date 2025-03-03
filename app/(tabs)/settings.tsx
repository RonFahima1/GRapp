import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { useTranslation } from '@/context/I18nContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Globe, Moon, Bell, Lock, CreditCard, CircleHelp as HelpCircle, ChevronRight } from 'lucide-react-native';

export default function SettingsScreen() {
  const { t, changeLanguage, currentLanguage } = useTranslation();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [biometrics, setBiometrics] = useState(true);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'zh', name: 'Chinese (中文)' },
    { code: 'hi', name: 'Hindi (हिन्दी)' },
    { code: 'ar', name: 'Arabic (العربية)' },
  ];

  const settingsSections = [
    {
      id: 'appearance',
      title: t('appearance'),
      items: [
        {
          id: 'darkMode',
          icon: <Moon color="#FF6B6B" size={24} />,
          title: t('dark_mode'),
          type: 'switch',
          value: darkMode,
          onValueChange: setDarkMode,
        },
      ],
    },
    {
      id: 'notifications',
      title: t('notifications'),
      items: [
        {
          id: 'pushNotifications',
          icon: <Bell color="#FF6B6B" size={24} />,
          title: t('push_notifications'),
          type: 'switch',
          value: notifications,
          onValueChange: setNotifications,
        },
      ],
    },
    {
      id: 'security',
      title: t('security'),
      items: [
        {
          id: 'biometrics',
          icon: <Lock color="#FF6B6B" size={24} />,
          title: t('biometric_authentication'),
          type: 'switch',
          value: biometrics,
          onValueChange: setBiometrics,
        },
        {
          id: 'changePassword',
          icon: <Lock color="#FF6B6B" size={24} />,
          title: t('change_password'),
          type: 'link',
        },
      ],
    },
    {
      id: 'payment',
      title: t('payment'),
      items: [
        {
          id: 'paymentMethods',
          icon: <CreditCard color="#FF6B6B" size={24} />,
          title: t('payment_methods'),
          type: 'link',
        },
        {
          id: 'currencies',
          icon: <Globe color="#FF6B6B" size={24} />,
          title: t('currencies'),
          type: 'link',
        },
      ],
    },
    {
      id: 'support',
      title: t('support'),
      items: [
        {
          id: 'helpCenter',
          icon: <HelpCircle color="#FF6B6B" size={24} />,
          title: t('help_center'),
          type: 'link',
        },
        {
          id: 'contactUs',
          icon: <HelpCircle color="#FF6B6B" size={24} />,
          title: t('contact_us'),
          type: 'link',
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('settings')}</Text>
        </View>

        <View style={styles.languageSection}>
          <View style={styles.sectionHeader}>
            <Globe color="#FF6B6B" size={24} />
            <Text style={styles.sectionTitle}>{t('language')}</Text>
          </View>
          <View style={styles.languageGrid}>
            {languages.map((language) => (
              <TouchableOpacity
                key={language.code}
                style={[
                  styles.languageButton,
                  currentLanguage === language.code && styles.activeLanguageButton,
                ]}
                onPress={() => changeLanguage(language.code)}
              >
                <Text
                  style={[
                    styles.languageButtonText,
                    currentLanguage === language.code && styles.activeLanguageButtonText,
                  ]}
                >
                  {language.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {settingsSections.map((section) => (
          <View key={section.id} style={styles.settingsSection}>
            <Text style={styles.settingsSectionTitle}>{section.title}</Text>
            {section.items.map((item) => (
              <View key={item.id} style={styles.settingsItem}>
                <View style={styles.settingsItemLeft}>
                  <View style={styles.settingsItemIconContainer}>{item.icon}</View>
                  <Text style={styles.settingsItemTitle}>{item.title}</Text>
                </View>
                {item.type === 'switch' ? (
                  <Switch
                    value={item.value}
                    onValueChange={item.onValueChange}
                    trackColor={{ false: '#E0E0E0', true: '#FFB6B6' }}
                    thumbColor={item.value ? '#FF6B6B' : '#f4f3f4'}
                  />
                ) : (
                  <ChevronRight color="#999" size={20} />
                )}
              </View>
            ))}
          </View>
        ))}

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
  },
  languageSection: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginLeft: 10,
  },
  languageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  languageButton: {
    width: '48%',
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
  },
  activeLanguageButton: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  languageButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeLanguageButtonText: {
    color: '#FF6B6B',
  },
  settingsSection: {
    marginHorizontal: 20,
    marginBottom: 25,
  },
  settingsSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 15,
    paddingLeft: 5,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsItemIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  settingsItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  versionContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  versionText: {
    fontSize: 14,
    color: '#999',
  },
});