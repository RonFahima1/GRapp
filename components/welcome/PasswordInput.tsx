import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type PasswordInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  placeholder?: string;
  isRTL?: boolean;
  style?: any;
};

export function PasswordInput({ value, onChangeText, error, placeholder, isRTL, style }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const containerStyle = isRTL ? { flexDirection: 'row-reverse' } : { flexDirection: 'row' };

  return (
    <View style={[styles.container, containerStyle, error && styles.containerError, style]}>
      <TouchableOpacity 
        onPress={() => setShowPassword(!showPassword)}
        style={styles.eyeIcon}
      >
        <Ionicons 
          name={showPassword ? 'eye-off' : 'eye'} 
          size={24} 
          color="#666666"
        />
      </TouchableOpacity>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#999999"
        style={[
          styles.input,
          isRTL ? styles.rtlInput : styles.ltrInput
        ]}
        secureTextEntry={!showPassword}
        textAlign={isRTL ? 'right' : 'left'}
        writingDirection={isRTL ? 'rtl' : 'ltr'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 20,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 100,
    height: 56,
  },
  containerError: {
    borderWidth: 1,
    borderColor: '#FF0000',
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 18,
    color: '#333333',
    backgroundColor: 'transparent',
  },
  ltrInput: {
    textAlign: 'left',
    paddingLeft: 16,
    paddingRight: 16,
  },
  rtlInput: {
    textAlign: 'right',
    paddingLeft: 16,
    paddingRight: 16,
  },
  eyeIcon: {
    height: '100%',
    width: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
