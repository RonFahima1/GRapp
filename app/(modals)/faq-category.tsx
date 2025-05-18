import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, ChevronDown, ChevronUp } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Platform } from 'react-native';

export default function FAQCategoryScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  // Handle tap with haptic feedback
  const handleTap = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  // Toggle FAQ item expansion
  const toggleItem = (itemId: string) => {
    handleTap();
    setExpandedItem(expandedItem === itemId ? null : itemId);
  };

  // Category titles mapping
  const categoryTitles: Record<string, string> = {
    'accounts': 'Accounts',
    'loans': 'Loans',
    'payments': 'Payments',
    'security': 'Security',
    'transfers': 'Transfers',
    'app': 'App Features',
    'profile': 'Profile Settings',
    'fees': 'Fees & Charges',
    'savings': 'Savings'
  };

  // Placeholder FAQ items
  const faqItems = [
    {
      id: 'faq1',
      question: 'How do I update my personal information?',
      answer: 'You can update your personal information by going to Profile > My Account. From there, select the specific information you want to update (phone, email, address) and follow the on-screen instructions.'
    },
    {
      id: 'faq2',
      question: 'What security features does Global Remit offer?',
      answer: 'Global Remit offers several security features including Face ID/Touch ID login, two-factor authentication, real-time transaction alerts, and the ability to freeze your account instantly if you suspect fraud.'
    },
    {
      id: 'faq3',
      question: 'How do I reset my password?',
      answer: 'If you\'ve forgotten your password, tap on "Forgot Password" on the login screen. You\'ll receive a verification code to your registered email or phone number. Follow the instructions to create a new password.'
    },
    {
      id: 'faq4',
      question: 'Are my funds insured?',
      answer: 'Yes, Global Remit is a registered financial institution and all deposits are insured up to the maximum allowed by law through our partnership with FDIC-insured banks.'
    },
    {
      id: 'faq5',
      question: 'How do I contact customer support?',
      answer: 'You can contact our customer support team through the Help & Support section in the app. We offer live chat, phone support, and the ability to schedule callbacks at your convenience.'
    },
    {
      id: 'faq6',
      question: 'What are the fees for international transfers?',
      answer: 'Fees for international transfers vary depending on the destination country, amount, and transfer method. You can view the exact fees before confirming any transfer in the app.'
    },
    {
      id: 'faq7',
      question: 'How long do transfers take?',
      answer: 'Domestic transfers typically process within 1-2 business days. International transfers may take 3-5 business days depending on the destination country and local banking systems.'
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
        <Text style={styles.headerTitle}>{categoryTitles[id as string] || 'FAQs'}</Text>
        <View style={styles.rightPlaceholder} />
      </View>

      <ScrollView style={styles.contentContainer}>
        {/* FAQ items */}
        <View style={styles.faqContainer}>
          {faqItems.map((item) => (
            <View key={item.id} style={styles.faqItem}>
              <TouchableOpacity
                style={styles.questionContainer}
                onPress={() => toggleItem(item.id)}
              >
                <Text style={styles.questionText}>{item.question}</Text>
                {expandedItem === item.id ? 
                  <ChevronUp color="#007AFF" size={20} /> : 
                  <ChevronDown color="#007AFF" size={20} />
                }
              </TouchableOpacity>
              
              {expandedItem === item.id && (
                <View style={styles.answerContainer}>
                  <Text style={styles.answerText}>{item.answer}</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Still need help section */}
        <View style={styles.helpSection}>
          <Text style={styles.helpSectionTitle}>Still need help?</Text>
          <TouchableOpacity 
            style={styles.contactButton}
            onPress={() => {
              handleTap();
              router.push('/(modals)/support-chat');
            }}
          >
            <Text style={styles.contactButtonText}>Contact Support</Text>
          </TouchableOpacity>
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
    padding: 16,
  },
  faqContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    marginBottom: 20,
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  questionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  questionText: {
    fontSize: 16,
    color: '#333333',
    flex: 1,
    marginRight: 8,
  },
  answerContainer: {
    padding: 16,
    paddingTop: 0,
    backgroundColor: '#F9F9F9',
  },
  answerText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666666',
  },
  helpSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    alignItems: 'center',
  },
  helpSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 16,
  },
  contactButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  contactButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
