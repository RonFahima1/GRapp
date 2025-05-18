import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, FileText } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Platform } from 'react-native';

// Define letter item type for type safety
interface LetterItem {
  id: string;
  title: string;
  date: string;
  isNew?: boolean;
  onPress: () => void;
}

export default function RegularLettersScreen() {
  const router = useRouter();

  // Handle tap with haptic feedback
  const handleTap = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  // Navigate to document page
  const navigateToDocument = (documentId: string) => {
    handleTap();
    // In a real app, this would navigate to the specific document
    console.log(`Viewing document: ${documentId}`);
  };

  // List of regular letters
  const letterItems: LetterItem[] = [
    {
      id: 'letter-1',
      title: 'Important update about deposits',
      date: 'Received on 01.10.2022',
      isNew: true,
      onPress: () => navigateToDocument('letter-1')
    },
    {
      id: 'letter-2',
      title: 'Fee schedule update',
      date: 'Received on 15.09.2022',
      isNew: true,
      onPress: () => navigateToDocument('letter-2')
    },
    {
      id: 'letter-3',
      title: 'Preparation for 2022 tax year end',
      date: 'Received on 01.09.2022',
      onPress: () => navigateToDocument('letter-3')
    },
    {
      id: 'letter-4',
      title: 'App terms of use update',
      date: 'Received on 15.08.2022',
      onPress: () => navigateToDocument('letter-4')
    }
  ];

  // 5 different document types for navigation
  const documentTypes = [
    {
      id: 'account-statements',
      title: 'Account Statements',
      onPress: () => {
        handleTap();
        router.push('/(modals)/account-statements');
      }
    },
    {
      id: 'tax-documents',
      title: 'Tax Documents',
      onPress: () => {
        handleTap();
        router.push('/(modals)/tax-documents');
      }
    },
    {
      id: 'deposit-confirmations',
      title: 'Deposit Confirmations',
      onPress: () => {
        handleTap();
        router.push('/(modals)/deposit-confirmations');
      }
    },
    {
      id: 'bank-correspondence',
      title: 'Bank Correspondence',
      onPress: () => {
        handleTap();
        router.push('/(modals)/bank-correspondence');
      }
    },
    {
      id: 'agreements',
      title: 'Agreements',
      onPress: () => {
        handleTap();
        router.push('/(modals)/agreements');
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
        <Text style={styles.headerTitle}>Regular Letters</Text>
        <View style={styles.rightPlaceholder} />
      </View>

      <ScrollView style={styles.contentContainer}>
        {/* Recent letters section */}
        <Text style={styles.sectionHeader}>Recent Letters</Text>
        <View style={styles.lettersContainer}>
          {letterItems.map((item, index) => (
            <TouchableOpacity 
              key={item.id}
              style={[
                styles.letterItem,
                index < letterItems.length - 1 ? styles.letterItemWithBorder : null
              ]}
              onPress={item.onPress}
            >
              <View style={styles.letterContent}>
                <View style={styles.documentIcon}>
                  <FileText color="#007AFF" size={20} />
                </View>
                <View style={styles.textContainer}>
                  <View style={styles.titleRow}>
                    <Text style={styles.letterTitle}>{item.title}</Text>
                    {item.isNew && <View style={styles.newDot} />}
                  </View>
                  <Text style={styles.letterDate}>{item.date}</Text>
                </View>
                <ChevronRight color="#CCCCCC" size={20} style={styles.chevronIcon} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Document categories section */}
        <Text style={styles.sectionHeader}>Document Types</Text>
        <View style={styles.documentTypesContainer}>
          {documentTypes.map((type, index) => (
            <TouchableOpacity 
              key={type.id}
              style={[
                styles.documentTypeItem,
                index < documentTypes.length - 1 ? styles.documentTypeWithBorder : null
              ]}
              onPress={type.onPress}
            >
              <View style={styles.documentTypeContent}>
                <Text style={styles.documentTypeTitle}>{type.title}</Text>
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
  lettersContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  letterItem: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  letterItemWithBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  letterContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  textContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  letterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    fontFamily: 'System',
    textAlign: 'left',
  },
  newDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30',
    marginLeft: 8,
  },
  letterDate: {
    fontSize: 14,
    color: '#999999',
    fontFamily: 'System',
    textAlign: 'left',
    marginTop: 4,
  },
  chevronIcon: {
    marginLeft: 10,
  },
  documentTypesContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 20,
  },
  documentTypeItem: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  documentTypeWithBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  documentTypeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  documentTypeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    fontFamily: 'System',
    textAlign: 'left',
  },
  bottomPadding: {
    height: 40,
  },
});
