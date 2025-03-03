import { useEffect, useState } from 'react';
import { usePathname, router } from 'expo-router';
import { useAuth } from '../context/AuthContext';

export const useAuthGuard = (excludeRoutes: string[] = []) => {
  const { isAuthenticated, checkAuthState } = useAuth();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  // First effect just checks auth without navigation
  useEffect(() => {
    const checkAuth = async () => {
      if (excludeRoutes.includes(pathname)) {
        setIsLoading(false);
        return;
      }

      try {
        await checkAuthState();
        if (!isAuthenticated) {
          setShouldRedirect(true);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setShouldRedirect(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [pathname, isAuthenticated]);

  // Second effect handles navigation after layout is mounted
  useEffect(() => {
    if (shouldRedirect && !isLoading && !excludeRoutes.includes(pathname)) {
      // Use setTimeout to ensure this happens after layout mounting
      const timer = setTimeout(() => {
        router.replace('login');
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [shouldRedirect, isLoading, pathname]);

  return { isAuthenticated, isLoading };
};
