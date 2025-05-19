import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { useTranslate } from '../context/TranslationContext';

type LogoutButtonProps = {
  onLogout: () => void;
};

const LogoutButton: React.FC<LogoutButtonProps> = ({ onLogout }) => {
  const { t } = useTranslate();
  // Handle tap with haptic feedback
  const handleTap = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  // Confirm logout
  const confirmLogout = () => {
    handleTap();
    Alert.alert(
      t('logout'),
      t('profile.logoutConfirmation'),
      [
        {
          text: t('cancel'),
          style: 'cancel',
        },
        {
          text: t('logout'),
          style: 'destructive',
          onPress: onLogout,
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <TouchableOpacity 
      style={styles.logoutButton} 
      onPress={confirmLogout}
      accessibilityLabel={t('logout')}
    >
      <Text style={styles.logoutText}>{t('logout')}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
    color: '#FF3B30', // iOS red
  },
});

export default LogoutButton;
