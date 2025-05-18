import { useEffect, useState } from 'react';
import { usePathname, router } from 'expo-router';
import { useAuth } from '../context/AuthContext';

export const useAuthGuard = (excludeRoutes: string[] = []) => {
  const { isAuthenticated, checkAuthState } = useAuth();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  // Temporarily disabled auth guard to allow viewing all pages
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Disabled redirection
  useEffect(() => {
    // No redirection
  }, []);

  return { isAuthenticated, isLoading };
};
