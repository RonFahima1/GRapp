import { StyleSheet } from 'react-native';
import theme from '../../styles/theme';
const { colors } = theme;

export default StyleSheet.create({
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
  error: {
    color: colors.error,
    marginBottom: 20,
    fontSize: 14,
  },
});
