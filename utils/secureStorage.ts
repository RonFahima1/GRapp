import * as SecureStore from 'expo-secure-store';

const BIOMETRIC_ENABLED_KEY = 'biometric_enabled';
const USER_DATA_KEY = 'user_data';
const HAS_EVER_LOGGED_IN_KEY = 'has_ever_logged_in';
const TRANSACTION_AUTH_CONFIG_KEY = 'transaction_auth_config';
const TRANSACTION_PIN_KEY = 'transaction_pin';

export const secureStorage = {
  setBiometricEnabled: async (enabled: boolean) => {
    try {
      await SecureStore.setItemAsync(BIOMETRIC_ENABLED_KEY, JSON.stringify(enabled));
    } catch (error) {
      console.error('Error saving biometric preference:', error);
    }
  },

  getBiometricEnabled: async (): Promise<boolean> => {
    try {
      const value = await SecureStore.getItemAsync(BIOMETRIC_ENABLED_KEY);
      return value ? JSON.parse(value) : false;
    } catch (error) {
      console.error('Error reading biometric preference:', error);
      return false;
    }
  },

  setUserData: async (userData: any) => {
    try {
      await SecureStore.setItemAsync(USER_DATA_KEY, JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  },

  getUserData: async () => {
    try {
      const value = await SecureStore.getItemAsync(USER_DATA_KEY);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Error reading user data:', error);
      return null;
    }
  },

  setHasEverLoggedIn: async (value: boolean) => {
    try {
      await SecureStore.setItemAsync(HAS_EVER_LOGGED_IN_KEY, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving login history:', error);
    }
  },

  getHasEverLoggedIn: async (): Promise<boolean> => {
    try {
      const value = await SecureStore.getItemAsync(HAS_EVER_LOGGED_IN_KEY);
      return value ? JSON.parse(value) : false;
    } catch (error) {
      console.error('Error reading login history:', error);
      return false;
    }
  },

  setTransactionAuthConfig: async (config: any) => {
    try {
      await SecureStore.setItemAsync(TRANSACTION_AUTH_CONFIG_KEY, JSON.stringify(config));
    } catch (error) {
      console.error('Error saving transaction auth config:', error);
    }
  },

  getTransactionAuthConfig: async () => {
    try {
      const value = await SecureStore.getItemAsync(TRANSACTION_AUTH_CONFIG_KEY);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Error reading transaction auth config:', error);
      return null;
    }
  },

  setTransactionPin: async (pin: string) => {
    try {
      await SecureStore.setItemAsync(TRANSACTION_PIN_KEY, pin);
    } catch (error) {
      console.error('Error saving transaction PIN:', error);
    }
  },

  getTransactionPin: async () => {
    try {
      return await SecureStore.getItemAsync(TRANSACTION_PIN_KEY);
    } catch (error) {
      console.error('Error reading transaction PIN:', error);
      return null;
    }
  },

  clearUserData: async () => {
    try {
      await SecureStore.deleteItemAsync(USER_DATA_KEY);
      await SecureStore.deleteItemAsync(BIOMETRIC_ENABLED_KEY);
      await SecureStore.deleteItemAsync(TRANSACTION_AUTH_CONFIG_KEY);
      await SecureStore.deleteItemAsync(TRANSACTION_PIN_KEY);
      // Note: We don't clear HAS_EVER_LOGGED_IN_KEY as we want to remember if the user has ever logged in
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  }
};
