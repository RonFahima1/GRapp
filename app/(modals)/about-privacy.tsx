import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, Shield } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Platform } from 'react-native';

export default function AboutPrivacyScreen() {
  const router = useRouter();
  const lastUpdated = 'May 10, 2025';

  // Handle tap with haptic feedback
  const handleTap = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header with title and back button */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <ChevronRight color="#007AFF" size={24} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={styles.rightPlaceholder} />
      </View>

      <ScrollView style={styles.contentContainer}>
        {/* Banner */}
        <View style={styles.bannerContainer}>
          <Shield color="#007AFF" size={36} />
          <Text style={styles.lastUpdated}>Last updated: {lastUpdated}</Text>
        </View>

        {/* Privacy Policy content */}
        <View style={styles.policyContainer}>
          <Text style={styles.sectionTitle}>Introduction</Text>
          <Text style={styles.paragraph}>
            Global Remit ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application or website (collectively, "Services").
          </Text>
          <Text style={styles.paragraph}>
            Please read this Privacy Policy carefully. By accessing or using our Services, you acknowledge that you have read, understood, and agree to be bound by all the terms of this Privacy Policy.
          </Text>

          <Text style={styles.sectionTitle}>Information We Collect</Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>Personal Information:</Text> We may collect personally identifiable information, such as your name, email address, telephone number, date of birth, social security number, and government-issued identification when you register for an account or use our Services.
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>Financial Information:</Text> To provide our banking and money transfer services, we collect banking details, account numbers, transaction history, and payment information.
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>Device Information:</Text> When you access our Services, we automatically collect device information such as your mobile device ID, model, manufacturer, operating system, IP address, and browsing behavior.
          </Text>

          <Text style={styles.sectionTitle}>How We Use Your Information</Text>
          <Text style={styles.paragraph}>
            We use the information we collect to:
          </Text>
          <Text style={styles.bulletPoint}>• Provide, maintain, and improve our Services</Text>
          <Text style={styles.bulletPoint}>• Process transactions and send related information</Text>
          <Text style={styles.bulletPoint}>• Verify your identity and prevent fraud</Text>
          <Text style={styles.bulletPoint}>• Personalize your experience</Text>
          <Text style={styles.bulletPoint}>• Communicate with you about our Services</Text>
          <Text style={styles.bulletPoint}>• Comply with legal obligations</Text>

          <Text style={styles.sectionTitle}>Information Sharing</Text>
          <Text style={styles.paragraph}>
            We may share your information with:
          </Text>
          <Text style={styles.bulletPoint}>• Service providers who perform services on our behalf</Text>
          <Text style={styles.bulletPoint}>• Financial institutions to complete transactions</Text>
          <Text style={styles.bulletPoint}>• Legal authorities when required by law</Text>
          <Text style={styles.bulletPoint}>• Business partners with your consent</Text>

          <Text style={styles.sectionTitle}>Data Security</Text>
          <Text style={styles.paragraph}>
            We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, so we cannot guarantee absolute security.
          </Text>

          <Text style={styles.sectionTitle}>Your Rights</Text>
          <Text style={styles.paragraph}>
            Depending on your location, you may have certain rights regarding your personal information, including the right to:
          </Text>
          <Text style={styles.bulletPoint}>• Access your personal information</Text>
          <Text style={styles.bulletPoint}>• Correct inaccurate information</Text>
          <Text style={styles.bulletPoint}>• Delete your personal information</Text>
          <Text style={styles.bulletPoint}>• Object to processing of your information</Text>
          <Text style={styles.bulletPoint}>• Withdraw consent</Text>

          <Text style={styles.sectionTitle}>Contact Us</Text>
          <Text style={styles.paragraph}>
            If you have any questions about this Privacy Policy, please contact us at:
          </Text>
          <Text style={styles.contactInfo}>privacy@globalremit.com</Text>
          <Text style={styles.contactInfo}>1-800-GLOBAL-REMIT</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    transform: [{ scaleX: -1 }],
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
