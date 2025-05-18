import { StyleSheet } from 'react-native';
import theme from './theme';
const { colors } = theme;

const styles = StyleSheet.create({
  rtlText: {
    writingDirection: 'rtl',
    textAlign: 'right',
  },
  rtlContainer: {
    direction: 'rtl',
  },

  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 200,
    height: 80,
    marginBottom: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#0066FF',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 32,
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
    direction: 'ltr', // Force LTR layout for phone input
  },
  countryCode: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
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
    textAlign: 'left',
    writingDirection: 'ltr',
    direction: 'ltr',
    paddingHorizontal: 16,
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
    width: '100%',
    marginTop: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButton: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  loginLink: {
    fontSize: 14,
    color: '#0066FF',
    fontWeight: '600',
  },
  error: {
    color: colors.error,
    marginBottom: 20,
    fontSize: 14,
  },

});

export default styles;
