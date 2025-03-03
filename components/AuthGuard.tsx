import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { usePathname } from 'expo-router';
import { useAuthGuard } from '../hooks/useAuthGuard';
import { useState } from 'react';

interface AuthGuardProps {
  children: React.ReactNode;
  excludeRoutes?: string[];
}

export function AuthGuard({ children, excludeRoutes = [] }: AuthGuardProps) {
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuthGuard(excludeRoutes);

  // If the path is excluded from auth checks, always render children
  if (excludeRoutes.includes(pathname)) {
    return <>{children}</>;
  }

  // Show loading indicator while checking auth state
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // If user is authenticated, show the content
  // Otherwise, the useAuthGuard hook will handle redirection
  return <>{children}</>;
}
