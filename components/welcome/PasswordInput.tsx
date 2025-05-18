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

  return (
    <View style={[styles.container, error && styles.containerError, style]}>
      {/* Input field */}
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
        textAlign={isRTL ? 'left' : 'left'}
        writingDirection={isRTL ? 'rtl' : 'ltr'}
      />
      
      {/* Eye icon */}
      <TouchableOpacity 
        onPress={() => setShowPassword(!showPassword)}
        style={[styles.eyeIcon, isRTL ? styles.eyeIconRTL : styles.eyeIconLTR]}
      >
        <Ionicons 
          name={showPassword ? 'eye-off' : 'eye'} 
          size={24} 
          color="#666666"
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 100,
    height: 56,
    position: 'relative',
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
    paddingLeft: 16,
    paddingRight: 56, // Space for the eye icon on the right
  },
  rtlInput: {
    paddingLeft: 56, // Space for the eye icon on the left
    paddingRight: 16,
  },
  eyeIcon: {
    position: 'absolute',
    height: '100%',
    width: 56,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  eyeIconLTR: {
    right: 0,
  },
  eyeIconRTL: {
    left: 0,
  },
});
