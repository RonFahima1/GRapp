import { StyleSheet } from 'react-native';
import theme from '@/app/styles/theme';
const { colors } = theme;

export default StyleSheet.create({
  inputWrapper: {
    position: 'relative',
    width: '100%',
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 100,
    height: 56,
    direction: 'ltr',
  },
  countryCode: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingLeft: 16,
    paddingRight: 12,
    height: '100%',
    borderRightWidth: 1,
    borderRightColor: '#E0E0E0',
    marginRight: 12,
    minWidth: 100,
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
    paddingHorizontal: 24,
  },
  loginTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minWidth: 200,
    justifyContent: 'center',
  },
  loginTextContainerRTL: {
    flexDirection: 'row-reverse',
  },
  loginText: {
    fontSize: 14,
    color: '#666666',
  },
  loginTextRTL: {
    textAlign: 'right',
  },
  loginLink: {
    fontSize: 14,
    color: '#0066FF',
    fontWeight: '600',
  },
});
