import React from 'react';
import { useTransactionVerification } from '../hooks/useTransactionVerification';
import { PinVerificationModal } from './PinVerificationModal';
import { PinSetupModal } from './PinSetupModal';

interface TransactionGuardProps {
  children: (executeTransaction: (callback: () => void) => void) => React.ReactNode;
}

export function TransactionGuard({ children }: TransactionGuardProps) {
  const {
    verifyAndExecute,
    isPinModalVisible,
    handlePinSuccess,
    handlePinCancel,
  } = useTransactionVerification();

  return (
    <>
      {children(verifyAndExecute)}
      
      <PinVerificationModal
        isVisible={isPinModalVisible}
        onSuccess={handlePinSuccess}
        onCancel={handlePinCancel}
      />
      
      <PinSetupModal />
    </>
  );
}
