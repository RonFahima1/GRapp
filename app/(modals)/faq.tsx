import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronRight, ChevronDown, Search, Wallet, CreditCard, Lock, RefreshCw, User, HelpCircle, DollarSign, PiggyBank, Building } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Platform } from 'react-native';

export default function FAQScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  // Handle tap with haptic feedback
  const handleTap = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  // Navigation to specific category
  const navigateToCategory = (categoryId: string) => {
    handleTap();
    router.push(`/(modals)/faq-category?id=${categoryId}`);
  };

  // FAQ categories
  const categories = [
    {
      id: 'accounts',
      title: 'Accounts',
      icon: <Wallet color="#007AFF" size={22} />
    },
    {
      id: 'loans',
      title: 'Loans',
      icon: <Building color="#007AFF" size={22} />
    },
    {
      id: 'payments',
      title: 'Payments',
      icon: <CreditCard color="#007AFF" size={22} />
    },
    {
      id: 'security',
      title: 'Security',
      icon: <Lock color="#007AFF" size={22} />
    },
    {
      id: 'transfers',
      title: 'Transfers',
      icon: <RefreshCw color="#007AFF" size={22} />
    },
    {
      id: 'app',
      title: 'App Features',
      icon: <HelpCircle color="#007AFF" size={22} />
    },
    {
      id: 'profile',
      title: 'Profile Settings',
      icon: <User color="#007AFF" size={22} />
    },
    {
      id: 'fees',
      title: 'Fees & Charges',
      icon: <DollarSign color="#007AFF" size={22} />
    },
    {
      id: 'savings',
      title: 'Savings',
      icon: <PiggyBank color="#007AFF" size={22} />
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
          <ChevronLeft color="#007AFF" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Common Questions</Text>
        <View style={styles.rightPlaceholder} />
      </View>

      {/* Search bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search color="#999" size={20} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search questions"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView style={styles.contentContainer}>
        {/* FAQ categories */}
        <View style={styles.categoriesContainer}>
          {categories.map((category, index) => (
            <TouchableOpacity 
              key={category.id}
              style={[
                styles.categoryItem,
                index !== categories.length - 1 && styles.borderBottom
              ]}
              onPress={() => navigateToCategory(category.id)}
            >
              <View style={styles.categoryContent}>
                <View style={styles.categoryLeft}>
                  {category.icon}
                  <Text style={styles.categoryTitle}>{category.title}</Text>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  rightPlaceholder: {
    width: 40,
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#F8F8F8',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEEEEE',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
    padding: 0,
  },
  contentContainer: {
    flex: 1,
  },
  categoriesContainer: {
    backgroundColor: '#FFFFFF',
    marginTop: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  categoryItem: {
    padding: 16,
  },
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryTitle: {
    fontSize: 16,
    color: '#333333',
    marginLeft: 12,
  },
  chevronIcon: {
    marginLeft: 8,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
});
