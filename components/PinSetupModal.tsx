import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { useBiometrics } from '../hooks/useBiometrics';
import { useTransactionAuth } from '../context/TransactionAuthContext';

export function PinSetupModal() {
  const { isAvailable, biometricType } = useBiometrics();
  const { isPinSetupVisible, hidePinSetup, configureAuth } = useTransactionAuth();
  
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [useBiometrics, setUseBiometrics] = useState(false);
  const [error, setError] = useState('');
  const [isConfiguring, setIsConfiguring] = useState(false);

  const handleSave = async () => {
    setError('');
    
    if (!useBiometrics && !pin) {
      setError('Please set up at least one authentication method');
      return;
    }

    if (pin) {
      if (pin.length !== 6) {
        setError('PIN must be 6 digits');
        return;
      }

      if (pin !== confirmPin) {
        setError('PINs do not match');
        return;
      }

      if (!/^\d+$/.test(pin)) {
        setError('PIN must contain only numbers');
        return;
      }
    }

    setIsConfiguring(true);
    try {
      await configureAuth(useBiometrics, pin || undefined);
      hidePinSetup();
    } catch (error) {
      console.error('Error configuring auth:', error);
      setError('Failed to save settings');
    }
    setIsConfiguring(false);
  };

  return (
    <Modal
      visible={isPinSetupVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={hidePinSetup}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.title}>Transaction Security Setup</Text>
          
          {isAvailable && (
            <View style={styles.optionRow}>
              <Text style={styles.optionText}>Use {biometricType}</Text>
              <Switch value={useBiometrics} onValueChange={setUseBiometrics} />
            </View>
          )}

          <Text style={styles.subtitle}>Set up 6-digit PIN (Optional)</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Enter 6-digit PIN"
            value={pin}
            onChangeText={setPin}
            keyboardType="numeric"
            secureTextEntry
            maxLength={6}
          />

          <TextInput
            style={styles.input}
            placeholder="Confirm PIN"
            value={confirmPin}
            onChangeText={setConfirmPin}
            keyboardType="numeric"
            secureTextEntry
            maxLength={6}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={hidePinSetup}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
              disabled={isConfiguring}
            >
              <Text style={styles.buttonText}>
                {isConfiguring ? 'Saving...' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 20,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 10,
  },
  optionText: {
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  button: {
    flex: 1,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});
