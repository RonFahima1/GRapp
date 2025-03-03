import { StyleSheet } from 'react-native';
import theme from './theme';
const { colors } = theme;

const styles = StyleSheet.create({
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
    width: 240,
    height: 100,
    marginBottom: 40,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.primary,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 30,
    textAlign: 'center',
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  countryCode: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 50,
    marginRight: 10,
  },
  flag: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  countryCodeText: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  input: {
    flex: 1,
    height: 48,
    backgroundColor: colors.inputBackground,
    borderRadius: 50,
    paddingHorizontal: 20,
    fontSize: 16,
  },
  error: {
    color: colors.error,
    marginBottom: 20,
    fontSize: 14,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 50,
    width: '100%',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: colors.disabled,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default styles;
