import { useState } from 'react';
import { useTransactionVerification } from './useTransactionVerification';

export const useProtectedTransaction = () => {
  const {
    verifyAndExecute,
    isPinModalVisible,
    handlePinSuccess,
    handlePinCancel,
  } = useTransactionVerification();
  const [isProcessing, setIsProcessing] = useState(false);

  const executeProtectedTransaction = async (
    transactionFn: () => Promise<void>,
    onSuccess?: () => void,
    onError?: (error: any) => void
  ) => {
    verifyAndExecute(async () => {
      try {
        setIsProcessing(true);
        await transactionFn();
        onSuccess?.();
      } catch (error) {
        console.error('Transaction failed:', error);
        onError?.(error);
      } finally {
        setIsProcessing(false);
      }
    });
  };

  return {
    executeProtectedTransaction,
    isProcessing,
    isPinModalVisible,
    handlePinSuccess,
    handlePinCancel,
  };
};
