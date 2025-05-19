/**
 * ProfileMenu.tsx - A fully mirrored profile menu for RTL languages
 * 
 * This component demonstrates proper RTL implementation for profile menu items
 * ensuring icons are properly positioned at the edge of the screen
 */

import React from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { isRTL } from '../utils/rtlUtils';
import RTLMenuListItem from './RTLMenuListItem';

// Import SafeAreaView if you're using it
import { SafeAreaView } from 'react-native-safe-area-context';

const ProfileMenu = () => {
  const { t, i18n } = useTranslation();
  const rtl = isRTL(i18n.language);

  // Menu sections with their respective items
  const menuItems = [
    {
      id: 'myAccount',
      title: t('profile.myAccount'),
      icon: (
        <View style={[styles.iconBg, { backgroundColor: '#E9F0FF' }]}>
          <Ionicons name="person" size={24} color="#2D7CFF" />
        </View>
      ),
      onPress: () => console.log('My Account'),
    },
    {
      id: 'documents',
      title: t('profile.documents'),
      icon: (
        <View style={[styles.iconBg, { backgroundColor: '#E9F0FF' }]}>
          <Ionicons name="document-text" size={24} color="#2D7CFF" />
        </View>
      ),
      onPress: () => console.log('Documents'),
    },
    {
      id: 'securitySettings',
      title: t('profile.securitySettings'),
      icon: (
        <View style={[styles.iconBg, { backgroundColor: '#E9F0FF' }]}>
          <Ionicons name="shield" size={24} color="#2D7CFF" />
        </View>
      ),
      onPress: () => console.log('Security'),
    },
    {
      id: 'notifications',
      title: t('profile.notificationSettings'),
      icon: (
        <View style={[styles.iconBg, { backgroundColor: '#E9F0FF' }]}>
          <Ionicons name="notifications" size={24} color="#2D7CFF" />
        </View>
      ),
      onPress: () => console.log('Notifications'),
    },
    {
      id: 'support',
      title: t('profile.helpAndSupport'),
      icon: (
        <View style={[styles.iconBg, { backgroundColor: '#E9F0FF' }]}>
          <Ionicons name="help-circle" size={24} color="#2D7CFF" />
        </View>
      ),
      onPress: () => console.log('Support'),
    },
    {
      id: 'about',
      title: t('profile.aboutApp'),
      icon: (
        <View style={[styles.iconBg, { backgroundColor: '#E9F0FF' }]}>
          <Ionicons name="information-circle" size={24} color="#2D7CFF" />
        </View>
      ),
      onPress: () => console.log('About'),
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={[styles.scrollView, rtl ? styles.scrollViewRTL : {}]}>
        {/* Header Section */}
        <View style={[styles.headerSection, rtl ? styles.headerSectionRTL : {}]}>
          <View style={styles.userInfoContainer}>
            <Text style={[styles.userName, rtl ? styles.userNameRTL : {}]}>
              {t('profile.fullName')}
            </Text>
            <Text style={[styles.userEmail, rtl ? styles.userEmailRTL : {}]}>
              ronfаhima@example.com
            </Text>
          </View>
        </View>

        {/* Stats Card - Completely mirrored in RTL mode */}
        <View style={styles.statsCard}>
          <View style={[styles.statsRow, rtl ? styles.statsRowRTL : {}]}>
            {/* First Stat */}
            <View style={[styles.statItem, rtl ? styles.statItemRTL : {}]}>
              <Text style={styles.statLabel}>{t('profile.transactions')}</Text>
              <Text style={styles.statValue}>128</Text>
            </View>
            
            {/* Second Stat */}
            <View style={[styles.statItem, styles.middleStat, rtl ? styles.statItemRTL : {}]}>
              <Text style={styles.statLabel}>{t('profile.memberSince')}</Text>
              <Text style={styles.statValue}>May 2023</Text>
            </View>
            
            {/* Third Stat */}
            <View style={[styles.statItem, rtl ? styles.statItemRTL : {}]}>
              <Text style={styles.statLabel}>{t('profile.accountNumber')}</Text>
              <Text style={styles.statValue}>RMT12345</Text>
            </View>
          </View>
        </View>

        {/* Menu List - Using our RTL-aware menu item component */}
        <View style={styles.menuList}>
          {menuItems.map((item) => (
            <RTLMenuListItem
              key={item.id}
              title={item.title}
              icon={item.icon}
              onPress={item.onPress}
              style={styles.menuItem}
              testID={`profile-menu-${item.id}`}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewRTL: {
    // Any RTL-specific scroll view styles
  },
  headerSection: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: 'white',
    marginBottom: 16,
    borderRadius: 12,
    margin: 16,
    alignItems: 'flex-start',
  },
  headerSectionRTL: {
    alignItems: 'flex-end', // Align content to the right in RTL
  },
  userInfoContainer: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
  },
  userNameRTL: {
    textAlign: 'right',
  },
  userEmail: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 4,
    textAlign: 'center',
  },
  userEmailRTL: {
    textAlign: 'right',
  },
  statsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    margin: 16,
    marginTop: 0,
    padding: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statsRowRTL: {
    flexDirection: 'row-reverse', // Reverse the row direction for RTL
  },
  statItem: {
    flex: 1,
    alignItems: 'flex-start', // Align to left in LTR
  },
  statItemRTL: {
    alignItems: 'flex-end', // Align to right in RTL
  },
  middleStat: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#E5E5EA',
    paddingHorizontal: 16,
  },
  statLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  menuList: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 24,
    overflow: 'hidden',
  },
  menuItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  iconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileMenu;
