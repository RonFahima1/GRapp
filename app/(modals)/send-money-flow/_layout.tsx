import { Stack } from 'expo-router';

export default function SendMoneyFlowLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="new-recipient" />
      <Stack.Screen name="amount" />
      <Stack.Screen name="details" />
      <Stack.Screen name="confirmation" />
      <Stack.Screen name="success" />
    </Stack>
  );
}
