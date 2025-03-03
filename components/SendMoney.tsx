import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useProtectedTransaction } from '../hooks/useProtectedTransaction';
import { PinVerificationModal } from './PinVerificationModal';
import { PinSetupModal } from './PinSetupModal';

export function SendMoney() {
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const {
    executeProtectedTransaction,
    isProcessing,
    isPinModalVisible,
    handlePinSuccess,
    handlePinCancel,
  } = useProtectedTransaction();

  const handleSend = () => {
    if (!amount || isNaN(Number(amount)) || !recipient) {
      // Handle validation error
      return;
    }

    executeProtectedTransaction(
      async () => {
        // Your actual send money API call here
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
        console.log('Money sent successfully:', { amount, recipient });
        setAmount('');
        setRecipient('');
      },
      () => {
        // Success callback
        console.log('Transfer completed');
      },
      (error) => {
        // Error callback
        console.error('Transfer failed:', error);
      }
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Recipient"
        value={recipient}
        onChangeText={setRecipient}
        editable={!isProcessing}
      />

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
        onPress={handleSend}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Send Money</Text>
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
