import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Download, FileText } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Platform } from 'react-native';

export default function DepositConfirmationsScreen() {
  const router = useRouter();

  // Handle tap with haptic feedback
  const handleTap = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  // Define the confirmation type
  type DepositConfirmation = {
    id: string;
    title: string;
    amount: string;
    date: string;
    size: string;
  };

  // Sample deposit confirmations
  const depositConfirmations: DepositConfirmation[] = [
    {
      id: 'deposit-1',
      title: 'Deposit Confirmation',
      amount: '$1,500.00',
      date: 'April 15, 2025',
      size: '245 KB'
    },
    {
      id: 'deposit-2',
      title: 'Deposit Confirmation',
      amount: '$2,750.00',
      date: 'March 22, 2025',
      size: '240 KB'
    },
    {
      id: 'deposit-3',
      title: 'Deposit Confirmation',
      amount: '$1,000.00',
      date: 'February 12, 2025',
      size: '238 KB'
    },
    {
      id: 'deposit-4',
      title: 'Deposit Confirmation',
      amount: '$3,200.00',
      date: 'January 5, 2025',
      size: '242 KB'
    },
    {
      id: 'deposit-5',
      title: 'Deposit Confirmation',
      amount: '$1,850.00',
      date: 'December 18, 2024',
      size: '235 KB'
    }
  ];

  const renderItem = ({ item }: { item: DepositConfirmation }) => (
    <TouchableOpacity 
      style={styles.documentItem}
      onPress={() => {
        handleTap();
        // In a real app, this would open the PDF or document viewer
      }}
    >
      <View style={styles.documentIcon}>
        <FileText color="#007AFF" size={22} />
      </View>
      <View style={styles.documentContent}>
        <Text style={styles.documentTitle}>{item.title} - {item.amount}</Text>
        <Text style={styles.documentDescription}>{item.date} • {item.size}</Text>
      </View>
      <TouchableOpacity 
        style={styles.downloadButton}
        onPress={() => {
          handleTap();
          // In a real app, this would download the document
        }}
      >
        <Download color="#007AFF" size={20} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

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
        <Text style={styles.headerTitle}>Deposit Confirmations</Text>
        <View style={styles.rightPlaceholder} />
      </View>

      <View style={styles.contentContainer}>
        {/* Section title */}
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>Deposit Records</Text>
        </View>
        
        {/* List of documents */}
        <FlatList
          data={depositConfirmations}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
        />
      </View>
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
  sectionTitleContainer: {
    padding: 16,
    paddingBottom: 8,
    backgroundColor: '#F8F8F8',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    fontFamily: 'System',
  },
  listContent: {
    paddingBottom: 20,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  documentIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F0F7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  documentContent: {
    flex: 1,
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    fontFamily: 'System',
    marginBottom: 4,
  },
  documentDescription: {
    fontSize: 14,
    color: '#999999',
    fontFamily: 'System',
  },
  downloadButton: {
    padding: 10,
  },
});
