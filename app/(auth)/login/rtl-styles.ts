import { StyleSheet } from 'react-native';
import theme from '../../styles/theme';
const { colors } = theme;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
  },
  logo: {
    width: 180,
    height: 60,
    alignSelf: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666666',
    marginBottom: 30,
  },
  form: {
    width: '100%',
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
    position: 'relative',
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
    writingDirection: 'rtl',
    textAlignVertical: 'center',
  },
  rtlEyeIconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 16,
    top: 8,
  },
  rtlText: {
    writingDirection: 'rtl',
    textAlign: 'right',
  },
  error: {
    color: '#FF3B30',
    fontSize: 14,
    marginBottom: 16,
  },
  inputError: {
    color: '#FF3B30',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#666666',
  },
  footerLink: {
    fontSize: 14,
    color: '#0066FF',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  colorGlobal: {
    color: '#0066FF',
  },
  color47: {
    color: '#FFD700',
  },
  colorRemit: {
    color: '#0066FF',
  },
  rtlPasswordContainer: {
    writingDirection: 'rtl',
  },
  rtlEyeIconContainer: {
    writingDirection: 'rtl',
  },
});
