import { useEffect, useState } from 'react';
import { Redirect, router } from 'expo-router';
import { View, ActivityIndicator, Text } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function Index() {
  const { isAuthenticated, hasEverLoggedIn, checkAuthState } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [destination, setDestination] = useState<string | null>(null);

  useEffect(() => {
    // Use a timer to ensure the root layout is mounted
    const timer = setTimeout(async () => {
      try {
        await checkAuthState();
        
        if (!isAuthenticated) {
          if (!hasEverLoggedIn) {
            setDestination('welcome');
          } else {
            setDestination('login');
          }
        } else {
          setDestination('(tabs)');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setDestination('login');
      } finally {
        setIsLoading(false);
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoading && destination) {
      // Use another timer to ensure navigation happens after layout is ready
      const navTimer = setTimeout(() => {
        router.replace(destination);
      }, 100);
      return () => clearTimeout(navTimer);
    }
  }, [isLoading, destination]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={{ marginTop: 20 }}>Loading...</Text>
    </View>
  );
}