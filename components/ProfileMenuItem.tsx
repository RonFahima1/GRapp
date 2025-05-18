import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export type MenuItemProps = {
  id: string;
  icon: JSX.Element;
  title: string;
  subtitle?: string;
  type: 'toggle' | 'navigate';
  showChevron?: boolean;
  hasNotification?: boolean;
  value?: boolean;
  onValueChange?: (val: boolean) => void;
  onPress?: () => void;
};

const ProfileMenuItem: React.FC<MenuItemProps> = ({
  icon,
  title,
  subtitle,
  type,
  showChevron = true,
  hasNotification = false,
  value = false,
  onValueChange,
  onPress
}) => {
  // Handle tap with haptic feedback
  const handleTap = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  // Handle press for navigation items
  const handlePress = () => {
    if (onPress) {
      handleTap();
      onPress();
    }
  };

  // Handle toggle for switch items
  const handleToggle = (newValue: boolean) => {
    handleTap();
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  return (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={type === 'navigate' ? handlePress : undefined}
      disabled={type === 'toggle'}
    >
      <View style={styles.menuItemContent}>
        <View style={styles.menuItemLeft}>
          <View style={styles.menuItemIcon}>
            {icon}
            {hasNotification && <View style={styles.notificationDot} />}
          </View>
          <View style={styles.menuItemTextContainer}>
            <Text style={styles.menuItemText}>{title}</Text>
            {subtitle && <Text style={styles.menuItemSubtitle}>{subtitle}</Text>}
          </View>
        </View>
        
        <View style={styles.menuItemRight}>
          {type === 'toggle' ? (
            <Switch
              value={value}
              onValueChange={handleToggle}
              trackColor={{ false: '#E0E0E0', true: '#007AFF' }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#E0E0E0"
            />
          ) : (
            showChevron && <ChevronRight color="#CCCCCC" size={20} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  menuItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30',
  },
  menuItemTextContainer: {
    flex: 1,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginLeft: 10,
  },
  menuItemSubtitle: {
    fontSize: 13,
    color: '#999999',
    marginLeft: 10,
    marginTop: 2,
  },
  menuItemRight: {
    width: 40,
    alignItems: 'flex-end',
  },
});

export default ProfileMenuItem;
