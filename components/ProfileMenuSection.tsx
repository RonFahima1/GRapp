import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ProfileMenuItem, { MenuItemProps } from './ProfileMenuItem';
import { useTranslate } from '../context/TranslationContext';

type ProfileMenuSectionProps = {
  title?: string;
  items: MenuItemProps[];
};

const ProfileMenuSection: React.FC<ProfileMenuSectionProps> = ({ title, items }) => {
  const { isRTL } = useTranslate();
  return (
    <View style={styles.section}>
      {title && <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>{title}</Text>}
      <View style={styles.sectionContent}>
        {items.map((item, index) => (
          <View key={item.id} style={[
            styles.itemContainer,
            index < items.length - 1 && styles.itemWithBorder
          ]}>
            <ProfileMenuItem {...item} />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6D6D72',
    marginHorizontal: 16,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  sectionContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    marginHorizontal: 16,
  },
  itemContainer: {
    backgroundColor: '#FFFFFF',
  },
  itemWithBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#E0E0E0',
  },
});

export default ProfileMenuSection;
