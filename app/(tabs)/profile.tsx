import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Image, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { User, File, Shield, Bell, HelpCircle, Info, ChevronLeft, ChevronRight, LogOut, Copy } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useTranslate } from '../../context/TranslationContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { t, isRTL } = useTranslate();

  // Handle copy to clipboard with haptic feedback
  const copyToClipboard = async (text: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    await Clipboard.setStringAsync(text);
    Alert.alert(t('common.copied') || 'Copied to clipboard', text);
  };

  // Function to provide haptic feedback
  const triggerHaptic = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  // Define menu items directly with English text
  const menuItems = React.useMemo(() => [
    {
      id: 'my-account',
      icon: <User color="#007AFF" size={22} />,
      title: t('profile.myAccount'),
      onPress: () => {
        triggerHaptic();
        router.push('/my-account-modal');
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
      title: t('profile.securityAndPreferences'),
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
  ], []);

  // Preferences items
  // Define the type for preference items
  type PreferenceItem = {
    id: string;
    icon: React.ReactNode;
    title: string;
    type: string;
    value?: boolean;
    onValueChange?: (value: boolean) => void;
  };
  
  // Empty preferences array since dark mode is now only in security settings
  const preferencesItems: PreferenceItem[] = [];

  // Handle logout
  const handleLogout = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    // Add your logout logic here
    Alert.alert(
      t('logout'),
      t('profile.logoutConfirmation') || 'Are you sure you want to log out?',
      [
        { text: t('cancel'), style: 'cancel' },
        { 
          text: t('logout'), 
          style: 'destructive',
          onPress: () => console.log('User logged out')
        },
      ]
    );
  };

    return (
    <SafeAreaView style={[styles.container]} edges={['top']}>
      <ScrollView 
        showsVerticalScrollIndicator={true} 
        indicatorStyle="black"
        contentContainerStyle={styles.scrollContentContainer}>
        <View style={styles.profileHeader}>
          {/* Blue profile avatar */}
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>RF</Text>
          </View>
          <Text style={[styles.profileName, { textAlign: isRTL ? 'right' : 'left' }]} numberOfLines={1}>
            {t('profile.fullName')}
          </Text>
          <Text style={[styles.profileEmail, { textAlign: isRTL ? 'right' : 'left' }]}>
            ronfаhima@example.com
          </Text>
        </View>
        
        {/* Account Information */}
        <View style={styles.accountInfoCard}>
          <View style={[styles.accountInfoContainer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            {/* Transactions */}
            <View style={[styles.accountInfoItem, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
              <Text style={[styles.accountInfoLabel, { textAlign: isRTL ? 'right' : 'left' }]}>{t('profile.transactions')}</Text>
              <Text style={[styles.accountInfoValue, { textAlign: isRTL ? 'right' : 'left' }]}>128</Text>
            </View>

            {/* Member Since */}
            <View style={[styles.accountInfoItem, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
              <Text style={[styles.accountInfoLabel, { textAlign: isRTL ? 'right' : 'left' }]}>{t('profile.memberSince')}</Text>
              <Text style={[styles.accountInfoValue, { textAlign: isRTL ? 'right' : 'left' }]}>May 2023</Text>
            </View>

            {/* Account ID */}
            <View style={[styles.accountInfoItem, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
              <Text style={[styles.accountInfoLabel, { textAlign: isRTL ? 'right' : 'left' }]}>{t('profile.accountNumber')}</Text>
              <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center' }}>
                <Text style={[styles.accountInfoValue, { textAlign: isRTL ? 'right' : 'left' }]}>RMT12345</Text>
                <TouchableOpacity 
                  style={[styles.copyButton, { marginLeft: isRTL ? 0 : 10, marginRight: isRTL ? 10 : 0 }]}
                  onPress={() => copyToClipboard('RMT12345')}
                >
                  <Copy size={16} color="#007AFF" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Menu Sections */}
        <View style={styles.menuSectionContainer}>
          {menuItems.map((item) => (
            <View key={item.id} style={styles.menuItemContainer}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={item.onPress}
                activeOpacity={0.7}
              >
                <View style={[styles.menuItemContent, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                  {/* The icon container - properly positioned at the edge in RTL mode */}
                  <View style={[
                    styles.menuItemIcon, 
                    { marginRight: isRTL ? 0 : 14, marginLeft: isRTL ? 14 : 0 }
                  ]}>
                    {item.icon}
                  </View>
                  
                  {/* Menu item text */}
                  <Text style={[
                    styles.menuItemText, 
                    { 
                      flex: 1,
                      textAlign: isRTL ? 'right' : 'left',
                      marginLeft: isRTL ? 0 : 4,
                      marginRight: isRTL ? 4 : 0
                    }
                  ]}>
                    {item.title}
                  </Text>
                  
                  {/* Chevron indicator - properly mirrored in RTL mode */}
                  <View style={styles.menuItemChevron}>
                    {isRTL ? 
                      <ChevronLeft color="#CCCCCC" size={20} /> : 
                      <ChevronRight color="#CCCCCC" size={20} />
                    }
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center' }}>
            <LogOut color="#FF3B30" size={20} />
            <Text style={[styles.logoutText, { marginLeft: isRTL ? 0 : 8, marginRight: isRTL ? 8 : 0 }]}>
              {t('logout')}
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  scrollContentContainer: {
    paddingBottom: 20, // Add some padding at the bottom
  },
  profileHeader: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 28,
    paddingHorizontal: 16,
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    marginBottom: 24,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: 'bold',
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#8A8A8E',
    marginBottom: 8,
  },
  accountInfoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 28,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  accountInfoContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  accountInfoItem: {
    flex: 1,
    paddingHorizontal: 2,
  },
  accountInfoLabel: {
    fontSize: 11,
    color: '#8E8E93',
    marginBottom: 4,
    width: '100%',
  },
  accountInfoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1C1C1E',
  },
  copyButton: {
    padding: 5,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
  },
  copyButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#007AFF',
  },
  menuSectionContainer: {
    marginHorizontal: 16,
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  menuItemContainer: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#E0E0E0',
  },
  menuItem: {
    paddingVertical: 16,
    paddingHorizontal: 18,
    backgroundColor: '#FFFFFF',
  },
  menuItemContent: {
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  menuItemIcon: {
    width: 36, // Icon container size
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderRadius: 10,
  },
  menuItemText: {
    fontSize: 17,
    fontWeight: '500',
    color: '#1C1C1E',
  },
  menuItemChevron: {
    padding: 4,
  },
  logoutButton: {
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(255,59,48,0.1)',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF3B30', // iOS system red
  },
});