import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function ExchangeFlowLayout() {
  const { t } = useTranslation();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#FFFFFF' },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="select-currency" />
      <Stack.Screen name="amount" />
      <Stack.Screen name="review" />
      <Stack.Screen name="confirmation" />
    </Stack>
  );
}
