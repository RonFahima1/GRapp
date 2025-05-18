import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Image, I18nManager, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { User, File, Shield, Bell, HelpCircle, Info, Moon, ChevronRight, ChevronLeft, LogOut } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useTranslation } from '../../hooks/useTranslation';
import { RTLText } from '../../components/RTLProvider';
import { createRTLAwareStyles, getRTLFlexDirection, getChevronTransform } from '../../utils/rtlUtils';
import { useLanguage } from '../../contexts/LanguageContext';

export default function ProfileScreen() {
  const router = useRouter();
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();

  // Handle copy to clipboard with haptic feedback
  const copyToClipboard = async (text: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    await Clipboard.setStringAsync(text);
    Alert.alert('Copied to clipboard', text);
  };

  // Function to provide haptic feedback
  const triggerHaptic = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  // Define menu items directly as a flat list
  const menuItems = [
    {
      id: 'my-account',
      icon: <User color="#007AFF" size={22} />,
      title: t('profile.myAccount'),
      onPress: () => {
        triggerHaptic();
        router.push('/(modals)/my-account-modal');
      }
    },
    {
      id: 'documents',
      icon: <File color="#007AFF" size={22} />,
      title: t('profile.documents'),
      onPress: () => {
        triggerHaptic();
        router.push('/documents-modal');
      }
    },
    {
      id: 'security',
      icon: <Shield color="#007AFF" size={22} />,
      title: t('profile.securityPreferences'),
      onPress: () => {
        triggerHaptic();
        router.push('/(modals)/security-settings-modal');
      }
    },
    {
      id: 'notifications',
      icon: <Bell color="#007AFF" size={22} />,
      title: t('profile.notificationSettings'),
      onPress: () => {
        triggerHaptic();
        router.push('/(modals)/notifications-settings');
      }
    },
    {
      id: 'help-support',
      icon: <HelpCircle color="#007AFF" size={22} />,
      title: t('profile.helpSupport'),
      onPress: () => {
        triggerHaptic();
        router.push('/(modals)/help-support');
      }
    },
    {
      id: 'about-app',
      icon: <Info color="#007AFF" size={22} />,
      title: t('profile.about'),
      onPress: () => {
        triggerHaptic();
        router.push('/(modals)/about');
      }
    },
  ];

  // Preferences items
  const preferencesItems = [
    {
      id: 'dark-mode',
      icon: <Moon color="#007AFF" size={22} />,
      title: t('profile.darkMode'),
      type: 'toggle',
      value: darkModeEnabled,
      onValueChange: (value: boolean) => {
        triggerHaptic();
        setDarkModeEnabled(value);
      }
    },
  ];

  // Handle logout
  const handleLogout = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    // Add your logout logic here
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => console.log('User logged out')
        },
      ]
    );
  };

  // Create RTL-aware styles dynamically
  const rtlStyles = createRTLAwareStyles(styles);

  return (
    <SafeAreaView style={rtlStyles.container} edges={['top']}>
      <View style={rtlStyles.header}>
        <RTLText style={rtlStyles.headerTitle}>{t('profile.title') || 'Profile'}</RTLText>
      </View>
      <ScrollView 
        showsVerticalScrollIndicator={true} 
        indicatorStyle="black"
        contentContainerStyle={styles.scrollContentContainer}>
        <View style={rtlStyles.profileHeader}>
          {/* Blue profile avatar */}
          <View style={rtlStyles.avatarContainer}>
            <Text style={rtlStyles.avatarText}>JD</Text>
          </View>
          <RTLText style={rtlStyles.profileName}>John Doe</RTLText>
        </View>

        {/* Account Info Card - All in one line with single copy button */}
        <View style={rtlStyles.accountInfoCard}>
          <View style={rtlStyles.accountInfoRow}>
            <View style={rtlStyles.accountInfoSection}>
              <RTLText style={rtlStyles.accountInfoLabel}>{t('profile.accountNumber')}</RTLText>
              <RTLText style={rtlStyles.accountInfoValue}>25365625</RTLText>
            </View>
            <View style={rtlStyles.accountInfoSection}>
              <RTLText style={rtlStyles.accountInfoLabel}>{t('profile.branch')}</RTLText>
              <RTLText style={rtlStyles.accountInfoValue}>998</RTLText>
            </View>
            <View style={rtlStyles.accountInfoSection}>
              <RTLText style={rtlStyles.accountInfoLabel}>{t('profile.bank')}</RTLText>
              <RTLText style={rtlStyles.accountInfoValue}>10</RTLText>
            </View>
            <TouchableOpacity 
              style={rtlStyles.copyButton}
              onPress={() => copyToClipboard('Account: 25365625, Branch: 998, Bank: 10')}
            >
              <RTLText style={rtlStyles.copyButtonText}>Copy</RTLText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu Items Section */}
        <View style={rtlStyles.menuSectionContainer}>
          {menuItems.map((item) => (
            <View key={item.id} style={rtlStyles.menuItemContainer}>
              <TouchableOpacity
                style={rtlStyles.menuItem}
                onPress={item.onPress}
              >
                <View style={rtlStyles.menuItemContent}>
                  <View style={rtlStyles.menuItemLeft}>
                    {I18nManager.isRTL ? (
                      <>
                        <RTLText style={rtlStyles.menuItemText}>{item.title}</RTLText>
                        <View style={rtlStyles.menuItemIcon}>
                          {item.icon}
                        </View>
                      </>
                    ) : (
                      <>
                        <View style={rtlStyles.menuItemIcon}>
                          {item.icon}
                        </View>
                        <RTLText style={rtlStyles.menuItemText}>{item.title}</RTLText>
                      </>
                    )}
                  </View>
                  <View style={rtlStyles.menuItemRight}>
                    {I18nManager.isRTL ? 
                      <ChevronLeft color="#CCCCCC" size={20} /> : 
                      <ChevronRight color="#CCCCCC" size={20} />
                    }
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Preferences Section */}
        <View style={rtlStyles.menuSectionContainer}>
          {preferencesItems.map((item) => (
            <View key={item.id} style={rtlStyles.menuItemContainer}>
              <View style={rtlStyles.menuItem}>
                <View style={rtlStyles.menuItemContent}>
                  <View style={rtlStyles.menuItemLeft}>
                    {I18nManager.isRTL ? (
                      <>
                        <RTLText style={rtlStyles.menuItemText}>{item.title}</RTLText>
                        <View style={rtlStyles.menuItemIcon}>
                          {item.icon}
                        </View>
                      </>
                    ) : (
                      <>
                        <View style={rtlStyles.menuItemIcon}>
                          {item.icon}
                        </View>
                        <RTLText style={rtlStyles.menuItemText}>{item.title}</RTLText>
                      </>
                    )}
                  </View>
                  <View style={rtlStyles.menuItemRight}>
                    <Switch
                      value={item.value}
                      onValueChange={item.onValueChange}
                      trackColor={{ false: '#D1D1D6', true: '#34C759' }}
                    />
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
        
        {/* Logout Button */}
        <TouchableOpacity 
          style={rtlStyles.logoutButton}
          onPress={handleLogout}
        >
          <RTLText style={rtlStyles.logoutText}>{t('profile.logout')}</RTLText>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// Define base styles that will be transformed for RTL
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    // Ensure the container respects RTL layout
    direction: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  header: {
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
    position: 'relative',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
  },
  scrollContentContainer: {
    paddingBottom: 20, // Add some padding at the bottom
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    // Ensure header content is properly aligned for RTL
    flexDirection: getRTLFlexDirection('column'),
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: 'bold',
  },
  profileName: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  accountInfoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  accountInfoRow: {
    flexDirection: getRTLFlexDirection('row'),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accountInfoSection: {
    flex: 1,
  },
  accountInfoLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 4,
  },
  accountInfoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1C1C1E',
  },
  copyButton: {
    flexDirection: getRTLFlexDirection('row'),
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  copyButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#007AFF',
  },
  menuSectionContainer: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  menuItemContainer: {
    marginBottom: 12,
  },
  menuItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  menuItemContent: {
    flexDirection: getRTLFlexDirection('row'),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuItemLeft: {
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemIcon: {
    width: 30, // Icon container size
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: I18nManager.isRTL ? 0 : 12, // Space between icon and text
    marginLeft: I18nManager.isRTL ? 12 : 0,
  },
  menuItemIconRTL: {
    marginRight: 0,
    marginLeft: 12,
  },
  menuItemText: {
    fontSize: 17,
    fontWeight: '500',
    color: '#1C1C1E',
  },
  menuItemRight: {
    alignItems: 'flex-end',
  },
  logoutButton: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30', // iOS system red
  },
});