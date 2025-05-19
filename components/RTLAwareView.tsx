/**
 * RTLAwareView.tsx - A component wrapper that applies correct RTL styles
 * 
 * This component can wrap any view to make it RTL-aware, handling
 * text alignment, flexDirection, and other RTL considerations automatically
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { isRTL, getTextAlign, getRowDirection } from '../utils/rtlUtils';

interface RTLAwareViewProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle;
  useFlex?: boolean;
  useRow?: boolean;
  reverseRow?: boolean; // If true, row direction is reversed from the RTL default
  testID?: string;
}

const RTLAwareView: React.FC<RTLAwareViewProps> = ({
  children,
  style,
  textStyle,
  useFlex = false,
  useRow = false,
  reverseRow = false,
  testID,
}) => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const rtl = isRTL(currentLanguage);
  
  // Build style based on RTL status
  const rtlStyle: ViewStyle = {
    ...(useFlex ? { flex: 1 } : {}),
    ...(useRow ? { 
      flexDirection: reverseRow ? 
        (rtl ? 'row' : 'row-reverse') : 
        (rtl ? 'row-reverse' : 'row') 
    } : {}),
  };
  
  // Apply text alignment based on RTL
  const rtlTextStyle: TextStyle = {
    textAlign: getTextAlign(currentLanguage),
    writingDirection: rtl ? 'rtl' : 'ltr',
  };
  
  return (
    <View 
      style={[rtlStyle, style]} 
      testID={testID}
    >
      {React.Children.map(children, child => {
        // If the child is a Text component, apply RTL text styling
        if (React.isValidElement(child) && child.type === Text) {
          return React.cloneElement(child, {
            style: [rtlTextStyle, textStyle, child.props.style],
          });
        }
        return child;
      })}
    </View>
  );
};

export default RTLAwareView;
