export const colors = {
  primary: '#0057b8',
  white: '#fff',
  black: '#000',
  textPrimary: '#000',
  textSecondary: '#666',
  border: '#ddd',
  error: '#FF3B30',
  success: '#4CAF50',
  successLight: '#E8F5E9',
  disabled: '#ccc',
  inputBackground: '#f5f5f5',
} as const;

export const spacing = {
  xs: 5,
  sm: 8,
  md: 15,
  lg: 20,
  xl: 30,
  xxl: 40,
} as const;

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 20,
  xl: 50,
} as const;

export const typography = {
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  body: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  small: {
    fontSize: 14,
    color: colors.textSecondary,
  },
} as const;

export default {
  colors,
  spacing,
  borderRadius,
  typography,
};
