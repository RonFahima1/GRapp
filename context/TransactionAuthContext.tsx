import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useBiometrics } from '../hooks/useBiometrics';
import { secureStorage } from '../utils/secureStorage';

interface TransactionAuthConfig {
  useBiometrics: boolean;
  usePin: boolean;
  isConfigured: boolean;
}

interface TransactionAuthContextType {
  config: TransactionAuthConfig;
  isConfigured: boolean;
  configureAuth: (useBiometrics: boolean, pin?: string) => Promise<void>;
  verifyTransaction: () => Promise<boolean>;
  verifyPin: (pin: string) => Promise<boolean>;
  showPinSetup: () => void;
  isPinSetupVisible: boolean;
  hidePinSetup: () => void;
}

const TransactionAuthContext = createContext<TransactionAuthContextType | undefined>(undefined);

export function TransactionAuthProvider({ children }: { children: ReactNode }) {
  const { authenticate, isAvailable } = useBiometrics();
  const [config, setConfig] = useState<TransactionAuthConfig>({
    useBiometrics: false,
    usePin: false,
    isConfigured: false,
  });
  const [isPinSetupVisible, setIsPinSetupVisible] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    const savedConfig = await secureStorage.getTransactionAuthConfig();
    if (savedConfig) {
      setConfig(savedConfig);
    }
  };

  const configureAuth = async (useBiometrics: boolean, pin?: string) => {
    const newConfig: TransactionAuthConfig = {
      useBiometrics: useBiometrics && isAvailable,
      usePin: !!pin,
      isConfigured: true,
    };

    if (pin) {
      await secureStorage.setTransactionPin(pin);
    }

    await secureStorage.setTransactionAuthConfig(newConfig);
    setConfig(newConfig);
  };

  const verifyTransaction = async (): Promise<boolean> => {
    if (!config.isConfigured) {
      setIsPinSetupVisible(true);
      return false;
    }

    if (config.useBiometrics) {
      try {
        const success = await authenticate();
        if (success) return true;
      } catch (error) {
        console.error('Biometric authentication failed:', error);
      }
    }

    if (config.usePin) {
      setIsPinSetupVisible(true);
      return false;
    }

    return false;
  };

  const verifyPin = async (pin: string): Promise<boolean> => {
    const savedPin = await secureStorage.getTransactionPin();
    return pin === savedPin;
  };

  const showPinSetup = () => setIsPinSetupVisible(true);
  const hidePinSetup = () => setIsPinSetupVisible(false);

  return (
    <TransactionAuthContext.Provider
      value={{
        config,
        isConfigured: config.isConfigured,
        configureAuth,
        verifyTransaction,
        verifyPin,
        showPinSetup,
        hidePinSetup,
        isPinSetupVisible,
      }}
    >
      {children}
    </TransactionAuthContext.Provider>
  );
}

export const useTransactionAuth = () => {
  const context = useContext(TransactionAuthContext);
  if (context === undefined) {
    throw new Error('useTransactionAuth must be used within a TransactionAuthProvider');
  }
  return context;
};
