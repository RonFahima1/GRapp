import { Stack } from 'expo-router';

export default function MoneyTransferLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="new-recipient" />
      <Stack.Screen name="amount" />
      <Stack.Screen name="details" />
      <Stack.Screen name="confirmation" />
      <Stack.Screen name="success" />
    </Stack>
  );
}
