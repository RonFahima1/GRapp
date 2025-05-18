import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Platform } from 'react-native';

export default function ApprovalsScreen() {
  const router = useRouter();

  // Handle tap with haptic feedback
  const handleTap = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  // List of approval-related items
  const approvalItems = [
    {
      id: 'account-ownership',
      title: 'Account Ownership Confirmation',
      subtitle: 'Confirmation of account management at Global Remit',
      onPress: () => {
        handleTap();
      }
    },
    {
      id: 'yearly-approval',
      title: 'Year-End Balance Confirmation',
      subtitle: 'Summary of annual balances in your account',
      onPress: () => {
        handleTap();
      }
    },
    {
      id: 'tax-approval',
      title: 'Tax Withholding Certificate (867)',
      subtitle: 'Annual certification of capital gains tax payment',
      onPress: () => {
        handleTap();
      }
    },
    {
      id: 'banking-approval',
      title: 'Banking ID',
      subtitle: 'Summary of your financial activity in the bank',
      onPress: () => {
        handleTap();
      }
    }
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header with title and back button */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
          hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
        >
          <ChevronRight color="#007AFF" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Approvals</Text>
        <View style={styles.rightPlaceholder} />
      </View>

      <ScrollView style={styles.contentContainer}>
        {/* Approvals list */}
        <View style={styles.approvalsContainer}>
          {approvalItems.map((item, index) => (
            <TouchableOpacity 
              key={item.id}
              style={[
                styles.approvalItem,
                index < approvalItems.length - 1 ? styles.approvalItemWithBorder : null
              ]}
              onPress={item.onPress}
            >
              <View style={styles.approvalContent}>
                <View style={styles.textContainer}>
                  <Text style={styles.approvalTitle}>{item.title}</Text>
                  <Text style={styles.approvalSubtitle}>{item.subtitle}</Text>
                </View>
                <ChevronRight color="#CCCCCC" size={20} style={styles.chevronIcon} />
              </View>
            </TouchableOpacity>
          ))}
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
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    fontFamily: 'System',
    textAlign: 'center',
  },
  backButton: {
    padding: 5,
  },
  rightPlaceholder: {
    width: 30,
  },
  contentContainer: {
    flex: 1,
  },
  approvalsContainer: {
    backgroundColor: '#FFFFFF',
    marginTop: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
  },
  approvalItem: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  approvalItemWithBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  approvalContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
  },
  approvalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    fontFamily: 'System',
    textAlign: 'left',
  },
  approvalSubtitle: {
    fontSize: 14,
    color: '#999999',
    fontFamily: 'System',
    textAlign: 'left',
    marginTop: 4,
  },
  chevronIcon: {
    marginLeft: 10,
  },
});
