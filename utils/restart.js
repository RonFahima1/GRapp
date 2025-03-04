/**
 * Utility to restart the app
 */

import { Platform } from 'react-native';

/**
 * Restarts the app if possible
 * @returns {boolean} True if restart was initiated, false otherwise
 */
export const restartApp = () => {
  try {
    console.log('Attempting to restart app with direct require...');
    
    // Direct require to avoid any import issues
    const RNRestart = require('react-native-restart');
    console.log('RNRestart loaded:', RNRestart);
    
    // For version 0.0.27, the correct usage is RNRestart.Restart()
    if (RNRestart && typeof RNRestart.Restart === 'function') {
      console.log('Using RNRestart.Restart()');
      RNRestart.Restart();
      return true;
    }
    
    // Try alternative ways to access the restart function
    if (RNRestart.default && typeof RNRestart.default.Restart === 'function') {
      console.log('Using RNRestart.default.Restart()');
      RNRestart.default.Restart();
      return true;
    }
    
    // Last resort, try calling the module directly
    if (typeof RNRestart === 'function') {
      console.log('Using RNRestart as function');
      RNRestart();
      return true;
    }
    
    console.warn('No valid restart method found in RNRestart:', RNRestart);
    return false;
  } catch (error) {
    console.error('Error restarting app:', error);
    return false;
  }
};
