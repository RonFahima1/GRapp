import { StyleSheet } from 'react-native';
import theme from './theme';
const { colors } = theme;

const styles = StyleSheet.create({
  rtlText: {
    writingDirection: 'rtl',
    textAlign: 'right',
  },

  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 100,
  },
  logo: {
    width: 240,
    height: 100,
    marginBottom: 40,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#0066FF',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    color: '#666666',
    marginBottom: 40,
    textAlign: 'center',
  },
  inputWrapper: {
    position: 'relative',
    width: '100%',
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 100,
    height: 56,
  },
  countryCodeRTL: {
    flexDirection: 'row-reverse',
  },
  countryCode: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingLeft: 16,
    height: '100%',
    borderRightWidth: 1,
    borderRightColor: '#E0E0E0',
    marginRight: 12,
    minWidth: 100, // Ensure consistent width for the country code section
  },
  flag: {
    fontSize: 20,
  },
  countryCodeText: {
    fontSize: 18,
    color: '#333333',
    fontWeight: '500',
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 18,
    color: '#333333',
    textAlign: 'left', // Always LTR for numbers
    paddingRight: 16,
  },
  continueButton: {
    width: '100%',
    height: 56,
    backgroundColor: '#0066FF',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  continueButtonDisabled: {
    backgroundColor: '#E8E8E8',
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  continueButtonTextDisabled: {
    color: '#999999',
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    gap: 8,
  },
  loginContainerRTL: {
    flexDirection: 'row-reverse',
  },
  loginText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'left',
  },
  loginTextRTL: {
    textAlign: 'right',
  },
  loginLink: {
    fontSize: 16,
    color: '#0066FF',
    fontWeight: '500',
  },
  error: {
    color: colors.error,
    marginBottom: 20,
    fontSize: 14,
  },

  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    gap: 8,
  },
  loginText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  loginLink: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
});

export default styles;
