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
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    gap: 10,
  },
  codeInput: {
    width: 45,
    height: 55,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    fontSize: 24,
    textAlign: 'center',
    backgroundColor: colors.inputBackground,
  },
  error: {
    color: colors.error,
    marginBottom: 20,
    fontSize: 14,
  },
  resendButton: {
    padding: 15,
  },
  resendText: {
    color: colors.primary,
    fontSize: 16,
  },
  resendTextDisabled: {
    color: colors.disabled,
  },
});

export default styles;
