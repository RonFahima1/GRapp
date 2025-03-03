import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { router } from 'expo-router';
import { secureStorage } from '../utils/secureStorage';

interface RegistrationData {
  phoneNumber?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  gender?: string;
  nationality?: string;
  city?: string;
  address?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  hasEverLoggedIn: boolean;
  registrationData: RegistrationData | null;
  updateRegistrationData: (data: RegistrationData) => void;
  login: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthState: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasEverLoggedIn, setHasEverLoggedIn] = useState(false);
  const [registrationData, setRegistrationData] = useState<RegistrationData | null>(null);

  const updateRegistrationData = (data: RegistrationData) => {
    setRegistrationData(prev => ({ ...prev, ...data }));
  };

  const checkAuthState = async () => {
    try {
      const userData = await secureStorage.getUserData();
      const hasLoggedInBefore = await secureStorage.getHasEverLoggedIn();
      setHasEverLoggedIn(hasLoggedInBefore);
      setIsAuthenticated(!!userData);
    } catch (error) {
      console.error('Error checking auth state:', error);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuthState();
  }, []);

  const login = async (userData: any) => {
    await secureStorage.setUserData(userData);
    await secureStorage.setHasEverLoggedIn(true);
    setIsAuthenticated(true);
    setHasEverLoggedIn(true);
  };

  const logout = async () => {
    await secureStorage.clearUserData();
    setIsAuthenticated(false);
    router.replace('/');
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      hasEverLoggedIn,
      registrationData,
      updateRegistrationData,
      login, 
      logout,
      checkAuthState 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
