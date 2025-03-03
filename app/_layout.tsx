import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { I18nProvider } from '@/context/I18nContext';
import { AuthProvider } from '../context/AuthContext';
import { TransactionAuthProvider } from '../context/TransactionAuthContext';

export default function RootLayout() {
  return (
    <I18nProvider>
      <AuthProvider>
        <TransactionAuthProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="welcome" />
            <Stack.Screen name="login" />
            <Stack.Screen name="register" />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </TransactionAuthProvider>
      </AuthProvider>
    </I18nProvider>
  );
}