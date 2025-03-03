import { useState, useEffect } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity, Text, Image, Switch } from 'react-native';
import { Link, router } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { useBiometrics } from '../hooks/useBiometrics';
import { secureStorage } from '../utils/secureStorage';

export default function Login() {
  const { isAvailable, biometricType, authenticate } = useBiometrics();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [enableBiometric, setEnableBiometric] = useState(false);

  useEffect(() => {
    checkAutoLogin();
  }, []);

  const checkAutoLogin = async () => {
    const biometricEnabled = await secureStorage.getBiometricEnabled();
    if (biometricEnabled && isAvailable) {
      const success = await authenticate();
      if (success) {
        const userData = await secureStorage.getUserData();
        if (userData) {
          // TODO: Implement your login logic here with userData
          router.push('/');
        }
      }
    }
  };

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return;
    }

    // Login using auth context
    await login(formData);
    
    // Save biometric preferences if enabled
    if (enableBiometric && isAvailable) {
      await secureStorage.setBiometricEnabled(true);
    }
    
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={formData.email}
        onChangeText={(text) => setFormData({ ...formData, email: text })}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={formData.password}
        onChangeText={(text) => setFormData({ ...formData, password: text })}
        secureTextEntry
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      {isAvailable && (
        <View style={styles.biometricContainer}>
          <View style={styles.biometricRow}>
            <Text style={styles.biometricText}>Enable {biometricType} login</Text>
            <Switch
              value={enableBiometric}
              onValueChange={setEnableBiometric}
            />
          </View>
        </View>
      )}

      {isAvailable && (
        <TouchableOpacity 
          style={styles.biometricButton} 
          onPress={async () => {
            const success = await authenticate();
            if (success) {
              // TODO: Implement biometric login logic
              router.push('/');
            }
          }}
        >
          <Text style={styles.biometricButtonText}>
            Sign in with {biometricType}
          </Text>
        </TouchableOpacity>
      )}

      <View style={styles.linkContainer}>
        <Text>Don't have an account? </Text>
        <Link href="/register" style={styles.link}>Register</Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  biometricContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  biometricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  biometricText: {
    fontSize: 16,
    color: '#333',
  },
  biometricButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  biometricButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
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
    marginTop: 10,
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
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  link: {
    color: '#007AFF',
  },
});
