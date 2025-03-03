import { StyleSheet, Dimensions } from 'react-native';
import { colors, spacing, borderRadius, typography } from './theme';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  // Layout
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  backgroundShape: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#5B4CDF',
    opacity: 0.9,
  },
  content: {
    flex: 1,
    padding: 30,
  },

  // Form Container
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 30,
  },

  // Logo
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 80,
    height: 40,
    marginBottom: 15,
    resizeMode: 'contain',
  },

  // Typography
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 30,
  },

  // Input Fields
  inputContainer: {
    marginBottom: 15,
    position: 'relative',
  },
  input: {
    height: 50,
    backgroundColor: '#F8F9FE',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingLeft: 48, // Space for icon
    fontSize: 16,
    color: colors.textPrimary,
    width: '100%',
  },
  inputIcon: {
    position: 'absolute',
    left: spacing.md,
    top: 15,
    color: '#A0A0A0',
    zIndex: 1,
  },
  inputError: {
    borderColor: colors.error,
  },

  // Button
  button: {
    height: 50,
    borderRadius: 25,
    backgroundColor: '#5B4CDF', // Yellow button color
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  buttonText: {
    color: colors.white, // White text for contrast on blue
    fontSize: 16,
    fontWeight: '600',
  },

  // Links and Additional Elements
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  link: {
    color: '#6B3FA0',
    fontSize: 14,
    marginLeft: 4,
  },
  linkText: {
    color: colors.textSecondary,
    fontSize: 14,
  },

  // Social Login
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
    gap: 15,
  },
  socialButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  // Divider
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E8E8E8',
  },
  dividerText: {
    color: colors.textSecondary,
    marginHorizontal: spacing.md,
    fontSize: 14,
  },

  // Dropdown styling
  dropdown: {
    height: 50,
    backgroundColor: '#F8F9FE',
    borderRadius: 25,
    borderWidth: 0,
    paddingHorizontal: 20,
    paddingLeft: 48,
  },
  dropdownContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    borderColor: '#E8E8E8',
    borderWidth: 1,
    marginTop: 4,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dropdownLabel: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  dropdownItem: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  dropdownItemLabel: {
    fontSize: 16,
    color: colors.textPrimary,
  },

  // Date Picker
  datePickerContainer: {
    backgroundColor: '#F8F9FE',
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    paddingLeft: 48,
  },

  // Error Messages
  error: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 8,
  },
  inputError: {
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
});

export default styles;