import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTransactionVerification } from '../hooks/useTransactionVerification';
import { PinVerificationModal } from './PinVerificationModal';
import { PinSetupModal } from './PinSetupModal';

export function TransactionExample() {
  const {
    verifyAndExecute,
    isPinModalVisible,
    handlePinSuccess,
    handlePinCancel,
  } = useTransactionVerification();

  const handleTransaction = () => {
    verifyAndExecute(() => {
      // This code will only run after successful authentication
      console.log('Transaction executed!');
      // Implement your transaction logic here
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleTransaction}>
        <Text style={styles.buttonText}>Send Money</Text>
      </TouchableOpacity>

      {/* This will show up when PIN verification is needed */}
      <PinVerificationModal
        isVisible={isPinModalVisible}
        onSuccess={handlePinSuccess}
        onCancel={handlePinCancel}
      />

      {/* This will show up when initial setup is needed */}
      <PinSetupModal />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
