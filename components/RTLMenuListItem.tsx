/**
 * RTLMenuListItem.tsx - A properly mirrored menu item component for RTL languages
 * 
 * This component ensures proper RTL alignment for menu items, positioning
 * icons at the edge of the screen and correctly mirroring the entire layout
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { isRTL } from '../utils/rtlUtils';

interface RTLMenuListItemProps {
  title: string;
  icon: React.ReactNode;
  onPress: () => void;
  showChevron?: boolean;
  style?: ViewStyle;
  testID?: string;
}

const RTLMenuListItem: React.FC<RTLMenuListItemProps> = ({
  title,
  icon,
  onPress,
  showChevron = true,
  style,
  testID,
}) => {
  const { i18n } = useTranslation();
  const rtl = isRTL(i18n.language);

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      testID={testID}
    >
      {/* Main row that changes direction based on RTL */}
      <View style={[
        styles.row,
        rtl ? styles.rowRTL : {}
      ]}>
        {/* Icon container - positioned at screen edge in RTL */}
        <View style={[
          styles.iconContainer,
          rtl ? styles.iconContainerRTL : {}
        ]}>
          {icon}
        </View>
        
        {/* Title - text alignment follows RTL rules */}
        <Text style={[
          styles.title,
          rtl ? styles.titleRTL : {}
        ]}>
          {title}
        </Text>
        
        {/* Chevron indicator - positioned opposite to icon */}
        {showChevron && (
          <Ionicons
            name={rtl ? "chevron-back" : "chevron-forward"}
            size={16}
            color="#AEAEB2"
            style={rtl ? styles.chevronRTL : styles.chevron}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    backgroundColor: 'white',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  rowRTL: {
    flexDirection: 'row-reverse',
    // Ensure content is pushed to the right edge in RTL
    justifyContent: 'flex-end',
  },
  iconContainer: {
    marginRight: 12,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#E9F0FF',
  },
  iconContainerRTL: {
    marginRight: 0,
    marginLeft: 12,
  },
  title: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
    textAlign: 'left',
  },
  titleRTL: {
    textAlign: 'right',
  },
  chevron: {
    marginLeft: 8,
  },
  chevronRTL: {
    marginLeft: 0,
    marginRight: 8,
  }
});

export default RTLMenuListItem;
