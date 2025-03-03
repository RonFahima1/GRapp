import { StyleSheet } from 'react-native';
import theme from '../../styles/theme';
const { colors } = theme;

export default StyleSheet.create({
  ltrPasswordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 100,
    height: 56,
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  ltrPasswordInput: {
    flex: 1,
    height: '100%',
    fontSize: 18,
    color: '#333333',
    paddingLeft: 40,
    paddingRight: 8,
    textAlign: 'right',
    backgroundColor: 'transparent',
  },
  rtlPasswordContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 100,
    height: 56,
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  rtlPasswordInput: {
    flex: 1,
    height: '100%',
    fontSize: 18,
    color: '#333333',
    paddingRight: 8,
    paddingLeft: 40,
    textAlign: 'right',
    backgroundColor: 'transparent',
  },
  eyeIconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 16,
    top: 8,
  },
  rtlEyeIconContainer: {
    left: undefined,
    right: 16,
  },
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
    width: '100%',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 32,
    textAlign: 'center',
    width: '100%',
  },
  error: {
    color: colors.error,
    marginBottom: 20,
    fontSize: 14,
    width: '100%',
  },
  form: {
    width: '100%',
    gap: 32,
  },
});
