import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Download, FileText, FileLock2 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Platform } from 'react-native';

export default function AgreementsScreen() {
  const router = useRouter();

  // Handle tap with haptic feedback
  const handleTap = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  // Define the agreement type
  type Agreement = {
    id: string;
    title: string;
    description: string;
    date: string;
    size: string;
  };

  // Sample agreements
  const agreements: Agreement[] = [
    {
      id: 'agreement-1',
      title: 'Terms of Service',
      description: 'General account terms and conditions',
      date: 'Updated January 15, 2025',
      size: '450 KB'
    },
    {
      id: 'agreement-2',
      title: 'Privacy Policy',
      description: 'How we handle your personal information',
      date: 'Updated March 1, 2025',
      size: '380 KB'
    },
    {
      id: 'agreement-3',
      title: 'Electronic Banking Agreement',
      description: 'Terms for online and mobile banking',
      date: 'Updated February 10, 2025',
      size: '525 KB'
    },
    {
      id: 'agreement-4',
      title: 'Fee Schedule',
      description: 'Detailed list of all account fees',
      date: 'Updated January 1, 2025',
      size: '290 KB'
    },
    {
      id: 'agreement-5',
      title: 'Data Security Policy',
      description: 'How we protect your information',
      date: 'Updated April 5, 2025',
      size: '410 KB'
    }
  ];

  const renderItem = ({ item }: { item: Agreement }) => (
    <TouchableOpacity 
      style={styles.documentItem}
      onPress={() => {
        handleTap();
        // In a real app, this would open the PDF or document viewer
      }}
    >
      <View style={styles.documentIcon}>
        <FileLock2 color="#007AFF" size={22} />
      </View>
      <View style={styles.documentContent}>
        <Text style={styles.documentTitle}>{item.title}</Text>
        <Text style={styles.documentDescription}>{item.description} • {item.date}</Text>
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
        <Text style={styles.headerTitle}>Agreements & Policies</Text>
        <View style={styles.rightPlaceholder} />
      </View>

      <View style={styles.contentContainer}>
        {/* Section title */}
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>Legal Documents</Text>
        </View>
        
        {/* List of documents */}
        <FlatList
          data={agreements}
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
