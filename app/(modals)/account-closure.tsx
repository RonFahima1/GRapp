import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image,
  Alert,
  ScrollView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useTranslate } from '../../context/TranslationContext';

const AccountClosureScreen = () => {
  const router = useRouter();
  const { t, isRTL } = useTranslate();
  const [confirmReceived, setConfirmReceived] = useState(false);

  // Function to request account closure
  const requestClosure = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    Alert.alert(
      t('accountClosure.alert.title'), 
      t('accountClosure.alert.message'), 
      [{ text: t('common.ok'), onPress: () => router.back() }]
    );
  };

  // Function to get more info
  const getMoreInfo = () => {
    setConfirmReceived(true);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header with title and back button */}
      <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <TouchableOpacity 
          style={[styles.backButton, { left: isRTL ? undefined : 0, right: isRTL ? 0 : undefined }]} 
          onPress={() => router.back()}
          hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
          accessibilityLabel={t('common.back')}
        >
          <ChevronLeft color="#007AFF" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('accountClosure.title')}</Text>
        <View style={styles.rightPlaceholder} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.iconContainer}>
          <View style={styles.orbitContainer}>
            <View style={styles.orbit} />
            <View style={[styles.orbitBall, styles.orbitBall1]} />
            <View style={[styles.orbitBall, styles.orbitBall2]} />
            <View style={[styles.orbitBall, styles.orbitBall3]} />
          </View>
        </View>

        <Text style={[styles.titleText, { textAlign: isRTL ? 'right' : 'left' }]}>
          {t('accountClosure.mainQuestion')}
        </Text>

        <Text style={[styles.descriptionText, { textAlign: isRTL ? 'right' : 'left' }]}>
          {t('accountClosure.processingRequest')}
        </Text>

        <Text style={[styles.infoText, { textAlign: isRTL ? 'right' : 'left' }]}>
          {t('accountClosure.nextStepInfo')}
        </Text>

        <Text style={[styles.noteText, { textAlign: isRTL ? 'right' : 'left' }]}>
          {t('accountClosure.bankingIssueNote')}
        </Text>

        <TouchableOpacity style={styles.actionButton} onPress={getMoreInfo}>
          <Text style={[styles.actionButtonText, { textAlign: isRTL ? 'right' : 'left' }]}>{t('accountClosure.getMoreInfo')}</Text>
        </TouchableOpacity>

        {confirmReceived && (
          <>
            <View style={styles.separator} />
            
            <Text style={[styles.confirmationText, { textAlign: isRTL ? 'right' : 'left' }]}>
              {t('accountClosure.proceedAwareness')}
            </Text>
            
            <View style={[styles.pointContainer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={[styles.pointText, { textAlign: isRTL ? 'right' : 'left' }]}>{t('accountClosure.points.recurringPayments')}</Text>
            </View>
            
            <View style={[styles.pointContainer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={[styles.pointText, { textAlign: isRTL ? 'right' : 'left' }]}>{t('accountClosure.points.remainingBalance')}</Text>
            </View>
            
            <View style={[styles.pointContainer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={[styles.pointText, { textAlign: isRTL ? 'right' : 'left' }]}>{t('accountClosure.points.destroyCards')}</Text>
            </View>
            
            <View style={[styles.pointContainer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={[styles.pointText, { textAlign: isRTL ? 'right' : 'left' }]}>{t('accountClosure.points.processDuration')}</Text>
            </View>
            
            <TouchableOpacity style={styles.closeAccountButton} onPress={requestClosure}>
              <Text style={[styles.closeAccountText, { textAlign: isRTL ? 'right' : 'left' }]}>{t('accountClosure.requestClosure')}</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
    position: 'relative',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    fontFamily: 'System',
  },
  backButton: {
    padding: 5,
    position: 'absolute',
    zIndex: 10,
  },
  rightPlaceholder: {
    width: 30,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    alignItems: 'center',
  },
  iconContainer: {
    height: 120,
    width: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 30,
  },
  orbitContainer: {
    position: 'relative',
    height: 100,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbit: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#CCCCCC',
  },
  orbitBall: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF3B30',
  },
  orbitBall1: {
    top: 0,
    left: 44,
  },
  orbitBall2: {
    right: 5,
    top: 44,
  },
  orbitBall3: {
    bottom: 10,
    left: 25,
  },
  titleText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 20,
    fontFamily: 'System',
  },
  descriptionText: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 20,
    fontFamily: 'System',
  },
  infoText: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 10,
    fontFamily: 'System',
  },
  noteText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 30,
    fontFamily: 'System',
  },
  actionButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'System',
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    width: '100%',
    marginVertical: 20,
  },
  confirmationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 20,
    alignSelf: 'flex-start',
    fontFamily: 'System',
  },
  pointContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
    width: '100%',
    paddingRight: 20,
  },
  bulletPoint: {
    fontSize: 18,
    color: '#666666',
    marginRight: 10,
    fontFamily: 'System',
  },
  pointText: {
    fontSize: 14,
    color: '#666666',
    flex: 1,
    fontFamily: 'System',
  },
  closeAccountButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    padding: 16,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  closeAccountText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'System',
  },
});

export default AccountClosureScreen;
