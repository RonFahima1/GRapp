import { useState } from 'react';
import { useTransactionAuth } from '../context/TransactionAuthContext';

export const useTransactionVerification = () => {
  const { verifyTransaction, config } = useTransactionAuth();
  const [isPinModalVisible, setIsPinModalVisible] = useState(false);
  const [pendingCallback, setPendingCallback] = useState<(() => void) | null>(null);

  const verifyAndExecute = async (callback: () => void) => {
    if (!config.isConfigured) {
      // This will show the setup modal
      const success = await verifyTransaction();
      if (success) {
        callback();
      }
      return;
    }

    const success = await verifyTransaction();
    if (success) {
      // Biometric authentication succeeded
      callback();
    } else if (config.usePin) {
      // Show PIN verification modal
      setIsPinModalVisible(true);
      setPendingCallback(() => callback);
    }
  };

  const handlePinSuccess = () => {
    setIsPinModalVisible(false);
    if (pendingCallback) {
      pendingCallback();
      setPendingCallback(null);
    }
  };

  const handlePinCancel = () => {
    setIsPinModalVisible(false);
    setPendingCallback(null);
  };

  return {
    verifyAndExecute,
    isPinModalVisible,
    handlePinSuccess,
    handlePinCancel,
  };
};
