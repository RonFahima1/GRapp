import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTranslate } from '../context/TranslationContext';

interface StandardBackButtonProps {
  onPress?: () => void;
  color?: string;
}

/**
 * Standardized back button component with consistent styling
 * Uses ChevronLeft icon with proper hitSlop for better touch target
 */
export default function StandardBackButton({ 
  onPress, 
  color = "#007AFF" 
}: StandardBackButtonProps) {
  const router = useRouter();
  const { t } = useTranslate();
  
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.back();
    }
  };

  return (
    <TouchableOpacity 
      style={styles.backButton}
      onPress={handlePress}
      hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
      accessibilityLabel={t('common.back')}
    >
      <ChevronLeft color={color} size={24} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  backButton: {
    padding: 5,
  },
});
