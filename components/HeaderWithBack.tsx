/**
 * HeaderWithBack.tsx - Header component with proper RTL-aware back button
 * 
 * This component follows the app's design standards for back navigation:
 * - Uses ChevronLeft icon consistently
 * - Includes proper hitSlop
 * - Uses consistent 5px padding
 * - Properly positions the back button on the right in RTL mode
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, I18nManager } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

interface HeaderWithBackProps {
  title: string;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
}

const HeaderWithBack: React.FC<HeaderWithBackProps> = ({ 
  title, 
  onBackPress,
  rightComponent
}) => {
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'he' || i18n.language === 'ar' || I18nManager.isRTL;

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.container, isRTL ? styles.containerRTL : {}]}>
        {/* Back button - positioned based on RTL */}
        <TouchableOpacity
          style={[
            styles.backButton,
            isRTL ? styles.backButtonRTL : {}
          ]}
          onPress={handleBackPress}
          hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
          accessibilityLabel={t('accessibility.back')}
        >
          {/* Always use ChevronLeft icon as per design standards */}
          <ChevronLeft 
            size={24} 
            color="#007AFF" 
          />
        </TouchableOpacity>

        {/* Title */}
        <Text style={[
          styles.title,
          isRTL ? styles.titleRTL : {}
        ]} numberOfLines={1}>
          {title}
        </Text>

        {/* Right component if provided */}
        {rightComponent && (
          <View style={styles.rightComponent}>
            {rightComponent}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    justifyContent: 'center',
    position: 'relative',
  },
  containerRTL: {
    flexDirection: 'row-reverse',
  },
  backButton: {
    padding: 5, // Consistent padding as per design standards
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  backButtonRTL: {
    left: 'auto',
    right: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
    flex: 1,
  },
  titleRTL: {
    textAlign: 'center', // Keep text centered regardless of RTL
  },
  rightComponent: {
    position: 'absolute',
    right: 16,
  }
});

export default HeaderWithBack;
