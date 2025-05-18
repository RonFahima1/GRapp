import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, Award, Check } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Platform } from 'react-native';

export default function AboutFeaturesScreen() {
  const router = useRouter();

  // Handle tap with haptic feedback
  const handleTap = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  // Key features list
  const keyFeatures = [
    {
      id: 'feature1',
      title: 'Global Money Transfers',
      description: 'Send money to over 100 countries with competitive exchange rates and low fees.'
    },
    {
      id: 'feature2',
      title: 'Secure Banking',
      description: 'Bank-level security with biometric authentication and advanced encryption.'
    },
    {
      id: 'feature3',
      title: 'Mobile Payments',
      description: 'Make payments on the go using Apple Pay, Google Pay, and other digital wallets.'
    },
    {
      id: 'feature4',
      title: 'Multi-Currency Accounts',
      description: 'Hold and manage multiple currencies in one place with real-time conversion.'
    },
    {
      id: 'feature5',
      title: 'Expense Tracking',
      description: 'Track your spending with categorized transactions and insightful reports.'
    },
    {
      id: 'feature6',
      title: 'Bill Payments',
      description: 'Pay bills directly from the app with scheduled payments and reminders.'
    },
    {
      id: 'feature7',
      title: '24/7 Support',
      description: 'Access customer support anytime through in-app chat, phone, or email.'
    },
    {
      id: 'feature8',
      title: 'Financial Insights',
      description: 'Get personalized financial insights and recommendations.'
    }
  ];

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
        <Text style={styles.headerTitle}>Key Features</Text>
        <View style={styles.rightPlaceholder} />
      </View>

      <ScrollView style={styles.contentContainer}>
        {/* Banner */}
        <View style={styles.bannerContainer}>
          <Award color="#007AFF" size={40} />
          <Text style={styles.bannerTitle}>Global Remit Features</Text>
          <Text style={styles.bannerSubtitle}>
            Discover what makes Global Remit the leading choice for international banking
          </Text>
        </View>

        {/* Features list */}
        <View style={styles.featuresContainer}>
          {keyFeatures.map((feature) => (
            <View key={feature.id} style={styles.featureItem}>
              <View style={styles.checkContainer}>
                <Check color="#007AFF" size={18} />
              </View>
              <View style={styles.featureTextContainer}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Bottom note */}
        <View style={styles.noteContainer}>
          <Text style={styles.noteText}>
            Features may vary depending on your region and account type. For more details, please contact customer support.
          </Text>
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
  bannerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333333',
    marginTop: 12,
    marginBottom: 4,
    textAlign: 'center',
  },
  bannerSubtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
  },
  featuresContainer: {
    backgroundColor: '#FFFFFF',
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  featureItem: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  checkContainer: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  noteContainer: {
    marginTop: 16,
    marginHorizontal: 16,
    marginBottom: 32,
    padding: 16,
    backgroundColor: 'rgba(0, 122, 255, 0.05)',
    borderRadius: 8,
  },
  noteText: {
    fontSize: 13,
    color: '#666666',
    lineHeight: 18,
    textAlign: 'center',
  },
});
