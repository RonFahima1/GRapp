/**
 * BackButton.tsx - Consistent back navigation button component
 * 
 * This component follows the app's design standard for back navigation:
 * - Uses ChevronLeft icon (not ChevronRight)
 * - Includes hitSlop for better touch target
 * - Uses consistent padding of 5
 * - Properly handles RTL languages by positioning the button on the right side of the screen
 */

import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View, I18nManager } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

interface BackButtonProps {
  onPress?: () => void;
  title?: string;
  color?: string;
  testID?: string;
  position?: 'left' | 'right' | 'auto';
}

const BackButton: React.FC<BackButtonProps> = ({ 
  onPress, 
  title, 
  color = '#007AFF',
  testID = 'back-button',
  position = 'auto' // Default to auto which follows RTL rules
}) => {
  const navigation = useNavigation();
  const { i18n, t } = useTranslation();
  const isRTL = i18n.language === 'he' || i18n.language === 'ar' || I18nManager.isRTL;
  
  // Determine the actual position based on RTL and position prop
  const actualPosition = position === 'auto' ? (isRTL ? 'right' : 'left') : position;
  
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <TouchableOpacity
      testID={testID}
      onPress={handlePress}
      style={[
        styles.backButton,
        actualPosition === 'right' ? styles.backButtonRight : styles.backButtonLeft
      ]}
      hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
      accessibilityLabel={t('accessibility.back')}
    >
      <View style={[styles.container, isRTL ? styles.containerRTL : null]}>
        {/* Always use ChevronLeft icon as per design standards */}
        <Ionicons
          name="chevron-back"
          size={24}
          color={color}
          // For RTL languages, mirror the icon with scaleX
          style={isRTL ? styles.iconRTL : styles.icon}
        />
        
        {title && (
          <Text
            style={[
              styles.title,
              { color },
              isRTL ? styles.titleRTL : null
            ]}
          >
            {title}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backButton: {
    padding: 5, // Consistent padding as per design standards
    position: 'absolute',
    zIndex: 10,
    top: 10,
  },
  backButtonLeft: {
    left: 10,
  },
  backButtonRight: {
    right: 10,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  containerRTL: {
    flexDirection: 'row-reverse',
  },
  icon: {
    // No transform as per design standards
  },
  iconRTL: {
    // Mirror the icon for RTL languages
    transform: [{ scaleX: -1 }]
  },
  title: {
    fontSize: 17,
    marginLeft: 4,
  },
  titleRTL: {
    marginLeft: 0,
    marginRight: 4,
  }
});

export default BackButton;
