import { StyleSheet } from 'react-native';
import theme from './theme';
const { colors } = theme;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  rtlContainer: {
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0066FF',
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
  input: {
    flex: 1,
    height: '100%',
    fontSize: 18,
    color: '#333333',
    paddingHorizontal: 24,
    textAlign: 'left',
  },
  inputRTL: {
    textAlign: 'right',
  },
  button: {
    width: '100%',
    height: 56,
    backgroundColor: '#0066FF',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: {
    backgroundColor: '#E8E8E8',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  buttonTextDisabled: {
    color: '#999999',
  },
  error: {
    color: colors.error,
    marginBottom: 20,
    fontSize: 14,
    textAlign: 'center',
  },
  biometricContainer: {
    marginTop: 32,
    width: '100%',
  },
  biometricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  biometricRowRTL: {
    flexDirection: 'row-reverse',
  },
  biometricText: {
    fontSize: 16,
    color: '#333333',
  },
  biometricTextRTL: {
    textAlign: 'right',
  },
  biometricButton: {
    width: '100%',
    height: 56,
    backgroundColor: '#F5F5F5',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  biometricButtonText: {
    fontSize: 16,
    color: '#333333',
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    gap: 8,
  },
  linkContainerRTL: {
    flexDirection: 'row-reverse',
  },
  link: {
    color: '#0066FF',
    textDecorationLine: 'underline',
  },
});
