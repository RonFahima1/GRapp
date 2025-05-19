import * as SecureStore from 'expo-secure-store';

async function clearAllStorage() {
  try {
    await SecureStore.deleteItemAsync('user_data');
    await SecureStore.deleteItemAsync('has_ever_logged_in');
    await SecureStore.deleteItemAsync('biometric_enabled');
    await SecureStore.deleteItemAsync('transaction_auth_config');
    await SecureStore.deleteItemAsync('transaction_pin');
    await SecureStore.deleteItemAsync('language');
    await SecureStore.deleteItemAsync('preferred_languages');
    console.log('Successfully cleared all storage');
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
}

clearAllStorage();
