import React, { ReactNode } from 'react';
import { StyleSheet, View, I18nManager, Text, TextStyle, ViewStyle } from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';

// Define types for RTL-aware styles
type RTLStyles = {
  container: ViewStyle;
  text: TextStyle;
  // Add more styles as needed
};

// Create RTL-aware styles
const createRTLStyles = (isRTL: boolean): RTLStyles => {
  return StyleSheet.create({
    container: {
      flex: 1,
      // Use column layout for the main container to preserve the app's structure
      flexDirection: 'column',
      alignItems: 'stretch',
      justifyContent: 'flex-start',
      direction: isRTL ? 'rtl' : 'ltr',
    },
    text: {
      textAlign: isRTL ? 'right' : 'left',
      writingDirection: isRTL ? 'rtl' : 'ltr',
    },
    // Add more styles as needed
  });
};

// Override Text component to apply RTL text styles
const RTLText = ({ style, ...props }: React.ComponentProps<typeof Text>) => {
  const { currentLanguage } = useLanguage();
  const isRTL = currentLanguage.isRTL;
  const rtlStyles = createRTLStyles(isRTL);
  
  return (
    <Text 
      {...props} 
      style={[rtlStyles.text, style]}
    />
  );
};

// RTL Provider component
interface RTLProviderProps {
  children: ReactNode;
}

export const RTLProvider: React.FC<RTLProviderProps> = ({ children }) => {
  const { currentLanguage } = useLanguage();
  const isRTL = currentLanguage.isRTL;
  const rtlStyles = createRTLStyles(isRTL);

  return (
    <View style={rtlStyles.container}>
      {children}
    </View>
  );
};

// Export components and utilities
export { RTLText, createRTLStyles };
export default RTLProvider;
