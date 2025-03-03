import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useProtectedTransaction } from '../hooks/useProtectedTransaction';
import { PinVerificationModal } from './PinVerificationModal';
import { PinSetupModal } from './PinSetupModal';

export function TopUpCard() {
  const [amount, setAmount] = useState('');
  const {
    executeProtectedTransaction,
    isProcessing,
    isPinModalVisible,
    handlePinSuccess,
    handlePinCancel,
  } = useProtectedTransaction();

  const handleTopUp = () => {
    if (!amount || isNaN(Number(amount))) {
      // Handle validation error
      return;
    }

    executeProtectedTransaction(
      async () => {
        // Your actual top-up API call here
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
        console.log('Top-up successful:', amount);
        setAmount('');
      },
      () => {
        // Success callback
        console.log('Top-up completed');
      },
      (error) => {
        // Error callback
        console.error('Top-up failed:', error);
      }
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        editable={!isProcessing}
      />

      <TouchableOpacity
        style={[styles.button, isProcessing && styles.buttonDisabled]}
        onPress={handleTopUp}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Top Up Card</Text>
        )}
      </TouchableOpacity>

      <PinVerificationModal
        isVisible={isPinModalVisible}
        onSuccess={handlePinSuccess}
        onCancel={handlePinCancel}
      />

      <PinSetupModal />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
