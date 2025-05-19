import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronRight, Shield } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Platform } from 'react-native';
import { useTranslate } from '../../context/TranslationContext';

export default function AboutPrivacyScreen() {
  const router = useRouter();
  const { t, isRTL } = useTranslate();
  // Get localized date format
  const formattedDate = new Date(2025, 4, 10).toLocaleDateString(isRTL ? 'th-TH' : 'en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  const lastUpdated = t('privacy.lastUpdated', { date: formattedDate });

  // Handle tap with haptic feedback
  const handleTap = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
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
          accessibilityRole="button"
        >
          <ChevronLeft color="#007AFF" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} accessibilityRole="header">{t('privacy.title')}</Text>
        <View style={styles.rightPlaceholder} />
      </View>

      <ScrollView 
        style={styles.contentContainer} 
        contentContainerStyle={{ paddingBottom: 20 }}
        accessibilityLabel={t('privacy.title')}
      >
        {/* Banner */}
        <View style={styles.bannerContainer}>
          <Shield color="#007AFF" size={36} accessibilityLabel={t('privacy.securityIcon')} />
          <Text style={[styles.lastUpdated, { textAlign: isRTL ? 'right' : 'left' }]}>
            {t('privacy.lastUpdatedPrefix')}: {lastUpdated}
          </Text>
        </View>

        {/* Privacy Policy content */}
        <View style={styles.policyContainer}>
          <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>{t('privacy.sections.introduction.title')}</Text>
          <Text style={[styles.paragraph, { textAlign: isRTL ? 'right' : 'left' }]}>
            {t('privacy.sections.introduction.paragraph1')}
          </Text>
          <Text style={[styles.paragraph, { textAlign: isRTL ? 'right' : 'left' }]}>
            {t('privacy.sections.introduction.paragraph2')}
          </Text>

          <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>{t('privacy.sections.informationCollected.title')}</Text>
          <Text style={[styles.paragraph, { textAlign: isRTL ? 'right' : 'left' }]}>
            <Text style={styles.bold}>{t('privacy.sections.informationCollected.personalInfoTitle')}:</Text> {t('privacy.sections.informationCollected.personalInfoContent')}
          </Text>
          <Text style={[styles.paragraph, { textAlign: isRTL ? 'right' : 'left' }]}>
            <Text style={styles.bold}>{t('privacy.sections.informationCollected.financialInfoTitle')}:</Text> {t('privacy.sections.informationCollected.financialInfoContent')}
          </Text>
          <Text style={[styles.paragraph, { textAlign: isRTL ? 'right' : 'left' }]}>
            <Text style={styles.bold}>{t('privacy.sections.informationCollected.deviceInfoTitle')}:</Text> {t('privacy.sections.informationCollected.deviceInfoContent')}
          </Text>

          <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>{t('privacy.sections.informationUsage.title')}</Text>
          <Text style={[styles.paragraph, { textAlign: isRTL ? 'right' : 'left' }]}>
            {t('privacy.sections.informationUsage.intro')}:
          </Text>
          <Text style={[styles.bulletPoint, { textAlign: isRTL ? 'right' : 'left', marginRight: isRTL ? 8 : 0, marginLeft: isRTL ? 0 : 8 }]}>• {t('privacy.sections.informationUsage.bulletPoints.improve')}</Text>
          <Text style={[styles.bulletPoint, { textAlign: isRTL ? 'right' : 'left', marginRight: isRTL ? 8 : 0, marginLeft: isRTL ? 0 : 8 }]}>• {t('privacy.sections.informationUsage.bulletPoints.process')}</Text>
          <Text style={[styles.bulletPoint, { textAlign: isRTL ? 'right' : 'left', marginRight: isRTL ? 8 : 0, marginLeft: isRTL ? 0 : 8 }]}>• {t('privacy.sections.informationUsage.bulletPoints.verify')}</Text>
          <Text style={[styles.bulletPoint, { textAlign: isRTL ? 'right' : 'left', marginRight: isRTL ? 8 : 0, marginLeft: isRTL ? 0 : 8 }]}>• {t('privacy.sections.informationUsage.bulletPoints.personalize')}</Text>
          <Text style={[styles.bulletPoint, { textAlign: isRTL ? 'right' : 'left', marginRight: isRTL ? 8 : 0, marginLeft: isRTL ? 0 : 8 }]}>• {t('privacy.sections.informationUsage.bulletPoints.communicate')}</Text>
          <Text style={[styles.bulletPoint, { textAlign: isRTL ? 'right' : 'left', marginRight: isRTL ? 8 : 0, marginLeft: isRTL ? 0 : 8 }]}>• {t('privacy.sections.informationUsage.bulletPoints.comply')}</Text>

          <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>{t('privacy.sections.informationSharing.title')}</Text>
          <Text style={[styles.paragraph, { textAlign: isRTL ? 'right' : 'left' }]}>
            {t('privacy.sections.informationSharing.intro')}:
          </Text>
          <Text style={[styles.bulletPoint, { textAlign: isRTL ? 'right' : 'left', marginRight: isRTL ? 8 : 0, marginLeft: isRTL ? 0 : 8 }]}>• {t('privacy.sections.informationSharing.bulletPoints.providers')}</Text>
          <Text style={[styles.bulletPoint, { textAlign: isRTL ? 'right' : 'left', marginRight: isRTL ? 8 : 0, marginLeft: isRTL ? 0 : 8 }]}>• {t('privacy.sections.informationSharing.bulletPoints.financial')}</Text>
          <Text style={[styles.bulletPoint, { textAlign: isRTL ? 'right' : 'left', marginRight: isRTL ? 8 : 0, marginLeft: isRTL ? 0 : 8 }]}>• {t('privacy.sections.informationSharing.bulletPoints.legal')}</Text>
          <Text style={[styles.bulletPoint, { textAlign: isRTL ? 'right' : 'left', marginRight: isRTL ? 8 : 0, marginLeft: isRTL ? 0 : 8 }]}>• {t('privacy.sections.informationSharing.bulletPoints.partners')}</Text>

          <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>{t('privacy.sections.dataSecurity.title')}</Text>
          <Text style={[styles.paragraph, { textAlign: isRTL ? 'right' : 'left' }]}>
            {t('privacy.sections.dataSecurity.content')}
          </Text>

          <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>{t('privacy.sections.yourRights.title')}</Text>
          <Text style={[styles.paragraph, { textAlign: isRTL ? 'right' : 'left' }]}>
            {t('privacy.sections.yourRights.intro')}:
          </Text>
          <Text style={[styles.bulletPoint, { textAlign: isRTL ? 'right' : 'left', marginRight: isRTL ? 8 : 0, marginLeft: isRTL ? 0 : 8 }]}>• {t('privacy.sections.yourRights.bulletPoints.access')}</Text>
          <Text style={[styles.bulletPoint, { textAlign: isRTL ? 'right' : 'left', marginRight: isRTL ? 8 : 0, marginLeft: isRTL ? 0 : 8 }]}>• {t('privacy.sections.yourRights.bulletPoints.correct')}</Text>
          <Text style={[styles.bulletPoint, { textAlign: isRTL ? 'right' : 'left', marginRight: isRTL ? 8 : 0, marginLeft: isRTL ? 0 : 8 }]}>• {t('privacy.sections.yourRights.bulletPoints.delete')}</Text>
          <Text style={[styles.bulletPoint, { textAlign: isRTL ? 'right' : 'left', marginRight: isRTL ? 8 : 0, marginLeft: isRTL ? 0 : 8 }]}>• {t('privacy.sections.yourRights.bulletPoints.object')}</Text>
          <Text style={[styles.bulletPoint, { textAlign: isRTL ? 'right' : 'left', marginRight: isRTL ? 8 : 0, marginLeft: isRTL ? 0 : 8 }]}>• {t('privacy.sections.yourRights.bulletPoints.withdraw')}</Text>

          <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>{t('privacy.sections.contactUs.title')}</Text>
          <Text style={[styles.paragraph, { textAlign: isRTL ? 'right' : 'left' }]}>
            {t('privacy.sections.contactUs.intro')}:
          </Text>
          <Text style={[styles.contactInfo, { textAlign: isRTL ? 'right' : 'left', marginRight: isRTL ? 8 : 0, marginLeft: isRTL ? 0 : 8 }]}>{t('privacy.sections.contactUs.email')}</Text>
          <Text style={[styles.contactInfo, { textAlign: isRTL ? 'right' : 'left', marginRight: isRTL ? 8 : 0, marginLeft: isRTL ? 0 : 8 }]}>{t('privacy.sections.contactUs.phone')}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    backgroundColor: '#FFFFFF',
    position: 'relative',
  },
  backButton: {
    padding: 5,
    position: 'absolute',
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  rightPlaceholder: {
    width: 40,
  },
  contentContainer: {
    flex: 1,
  },
  bannerContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 24,
    paddingHorizontal: 16,
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  lastUpdated: {
    fontSize: 14,
    color: '#666666',
    marginTop: 12,
  },
  policyContainer: {
    backgroundColor: '#FFFFFF',
    marginTop: 16,
    marginHorizontal: 16,
    marginBottom: 32,
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginTop: 16,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
    marginBottom: 12,
  },
  bold: {
    fontWeight: '600',
  },
  bulletPoint: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
    marginLeft: 8,
    marginBottom: 4,
  },
  contactInfo: {
    fontSize: 14,
    color: '#007AFF',
    marginBottom: 4,
    marginLeft: 8,
  }
});
