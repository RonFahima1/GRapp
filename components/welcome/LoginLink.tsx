import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from '@/context/I18nContext';
import { router } from 'expo-router';
import styles from './styles';

interface LoginLinkProps {
  isRTL: boolean;
}

export function LoginLink({ isRTL }: LoginLinkProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.loginContainer}>
      <View style={[styles.loginTextContainer, isRTL && styles.loginTextContainerRTL]}>
        {isRTL ? (
          <>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={[styles.loginLink, styles.loginTextRTL]}>
                {t('login_here', 'Login here')}
              </Text>
            </TouchableOpacity>
            <Text style={[styles.loginText, styles.loginTextRTL]}>
              {t('already_member', 'Already a member?')}
            </Text>
          </>
        ) : (
          <>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={styles.loginLink}>
                {t('login_here', 'Login here')}
              </Text>
            </TouchableOpacity>
            <Text style={styles.loginText}>
              {t('already_member', 'Already a member?')}
            </Text>
          </>
        )}
      </View>
    </View>
  );
}
