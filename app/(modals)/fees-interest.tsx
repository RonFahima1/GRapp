import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, FileText, DollarSign } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Platform } from 'react-native';

// Define item type for type safety
interface FeeItem {
  id: string;
  title: string;
  subtitle: string;
  amount?: string;
  date?: string;
  isNew?: boolean;
  onPress: () => void;
}

export default function FeesInterestScreen() {
  const router = useRouter();

  // Handle tap with haptic feedback
  const handleTap = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  // Navigate to fee details
  const navigateToFeeDetails = (feeId: string) => {
    handleTap();
    // In a real app, this would navigate to the specific fee details
    console.log(`Viewing fee details: ${feeId}`);
  };

  // List of fees and interest items
  const feeItems: FeeItem[] = [
    {
      id: 'monthly-fee-sep',
      title: 'Account Management Fee',
      subtitle: 'September 2022',
      amount: '$12.90',
      date: '30.09.2022',
      isNew: true,
      onPress: () => navigateToFeeDetails('monthly-fee-sep')
    },
    {
      id: 'interest-sep',
      title: 'Credit Interest',
      subtitle: 'September 2022',
      amount: '$3.25',
      date: '30.09.2022',
      isNew: true,
      onPress: () => navigateToFeeDetails('interest-sep')
    },
    {
      id: 'monthly-fee-aug',
      title: 'Account Management Fee',
      subtitle: 'August 2022',
      amount: '$12.90',
      date: '31.08.2022',
      onPress: () => navigateToFeeDetails('monthly-fee-aug')
    },
    {
      id: 'interest-aug',
      title: 'Credit Interest',
      subtitle: 'August 2022',
      amount: '$2.80',
      date: '31.08.2022',
      onPress: () => navigateToFeeDetails('interest-aug')
    },
    {
      id: 'monthly-fee-jul',
      title: 'Account Management Fee',
      subtitle: 'July 2022',
      amount: '$12.90',
      date: '31.07.2022',
      onPress: () => navigateToFeeDetails('monthly-fee-jul')
    }
  ];

  // Fee information categories
  const feeCategories = [
    {
      id: 'fee-schedule',
      title: 'Fee Schedule',
      subtitle: 'Complete details of service charges',
      onPress: () => {
        handleTap();
        // Would navigate to fee schedule in a real app
      }
    },
    {
      id: 'interest-rates',
      title: 'Interest Rates',
      subtitle: 'Information on interest rates in your account',
      onPress: () => {
        handleTap();
        // Would navigate to interest rates in a real app
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
        <Text style={styles.headerTitle}>Fees & Interest</Text>
        <View style={styles.rightPlaceholder} />
      </View>

      <ScrollView style={styles.contentContainer}>
        {/* Recent fees and interest section */}
        <Text style={styles.sectionHeader}>Recent Fees & Interest</Text>
        <View style={styles.feesContainer}>
          {feeItems.map((item, index) => (
            <TouchableOpacity 
              key={item.id}
              style={[
                styles.feeItem,
                index < feeItems.length - 1 ? styles.feeItemWithBorder : null
              ]}
              onPress={item.onPress}
            >
              <View style={styles.feeContent}>
                <View style={styles.feeIcon}>
                  <DollarSign color="#007AFF" size={20} />
                </View>
                <View style={styles.textContainer}>
                  <View style={styles.titleRow}>
                    <Text style={styles.feeTitle}>{item.title}</Text>
                    {item.isNew && <View style={styles.newDot} />}
                  </View>
                  <Text style={styles.feeSubtitle}>{item.subtitle}</Text>
                </View>
                <View style={styles.amountContainer}>
                  <Text style={styles.feeAmount}>{item.amount}</Text>
                  <Text style={styles.feeDate}>{item.date}</Text>
                </View>
                <ChevronRight color="#CCCCCC" size={20} style={styles.chevronIcon} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Fee information section */}
        <Text style={styles.sectionHeader}>Fee & Interest Information</Text>
        <View style={styles.categoriesContainer}>
          {feeCategories.map((category, index) => (
            <TouchableOpacity 
              key={category.id}
              style={[
                styles.categoryItem,
                index < feeCategories.length - 1 ? styles.categoryWithBorder : null
              ]}
              onPress={category.onPress}
            >
              <View style={styles.categoryContent}>
                <View style={styles.documentIcon}>
                  <FileText color="#007AFF" size={20} />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.categoryTitle}>{category.title}</Text>
                  <Text style={styles.categorySubtitle}>{category.subtitle}</Text>
                </View>
                <ChevronRight color="#CCCCCC" size={20} style={styles.chevronIcon} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Bottom padding */}
        <View style={styles.bottomPadding} />
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
    paddingHorizontal: 16,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'left',
  },
  feesContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  feeItem: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  feeItemWithBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  feeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  feeIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F0F7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  feeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    fontFamily: 'System',
    textAlign: 'left',
  },
  feeSubtitle: {
    fontSize: 14,
    color: '#999999',
    fontFamily: 'System',
    textAlign: 'left',
    marginTop: 4,
  },
  amountContainer: {
    marginHorizontal: 12,
    alignItems: 'flex-end',
  },
  feeAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    fontFamily: 'System',
    textAlign: 'right',
  },
  feeDate: {
    fontSize: 12,
    color: '#999999',
    fontFamily: 'System',
    textAlign: 'right',
    marginTop: 4,
  },
  newDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30',
    marginLeft: 8,
  },
  chevronIcon: {
    marginLeft: 10,
  },
  categoriesContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 20,
  },
  categoryItem: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  categoryWithBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    fontFamily: 'System',
    textAlign: 'left',
  },
  categorySubtitle: {
    fontSize: 14,
    color: '#999999',
    fontFamily: 'System',
    textAlign: 'left',
    marginTop: 4,
  },
  documentIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F0F7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  bottomPadding: {
    height: 40,
  },
});
