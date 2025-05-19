import { Stack, useRouter } from 'expo-router';
import { useTranslate } from '../../context/TranslationContext';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, StyleSheet } from 'react-native';

export default function RegisterLayout() {
  const { t, isRTL } = useTranslate();
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitle: t('register.title'),
        headerStyle: {
          backgroundColor: 'transparent',
        },
        headerShadowVisible: false,
        headerLeft: ({ canGoBack }) => 
          canGoBack ? (
            <TouchableOpacity 
              style={styles.backButton}
              hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
              accessibilityLabel={t('common.back')}
              onPress={() => router.back()}
            >
              <Ionicons 
                name="chevron-back" 
                size={24} 
                color="#000" 
              />
            </TouchableOpacity>
          ) : null,
        animation: isRTL ? 'slide_from_left' : 'slide_from_right',
      }}
    >
      {/* No need to define index screen as it would conflict with the parent register.tsx */}
      <Stack.Screen 
        name="personal-info" 
        options={{ 
          headerTitle: t('register.personalInfo.title') 
        }} 
      />
      <Stack.Screen 
        name="id-verification" 
        options={{ 
          headerTitle: t('register.idVerification.title') 
        }} 
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  backButton: {
    padding: 5,
  },
});
