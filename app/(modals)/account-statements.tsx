import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Download, FileText } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Platform } from 'react-native';

export default function AccountStatementsScreen() {
  const router = useRouter();

  // Handle tap with haptic feedback
  const handleTap = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  // Define the statement type
  type Statement = {
    id: string;
    month: string;
    year: number;
    size: string;
    date: string;
  };

  // Generate sample statements for the last 12 months
  const generateStatements = (): Statement[] => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June', 
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const statements = [];
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    for (let i = 0; i < 12; i++) {
      let month = currentMonth - i;
      let year = currentYear;
      
      if (month < 0) {
        month = 12 + month;
        year = year - 1;
      }
      
      statements.push({
        id: `statement-${year}-${month}`,
        month: months[month],
        year: year,
        size: '1.2 MB',
        date: `${months[month]} ${year}`
      });
    }
    
    return statements;
  };

  const statements = generateStatements();

  const renderItem = ({ item }: { item: Statement }) => (
    <TouchableOpacity 
      style={styles.statementItem}
      onPress={() => {
        handleTap();
        // In a real app, this would open the PDF or document viewer
      }}
    >
      <View style={styles.statementIcon}>
        <FileText color="#007AFF" size={22} />
      </View>
      <View style={styles.statementContent}>
        <Text style={styles.statementTitle}>{item.month} {item.year} Statement</Text>
        <Text style={styles.statementSize}>{item.size}</Text>
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
        <Text style={styles.headerTitle}>Account Statements</Text>
        <View style={styles.rightPlaceholder} />
      </View>

      <View style={styles.contentContainer}>
        {/* Section title */}
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>Monthly Statements</Text>
        </View>
        
        {/* List of statements */}
        <FlatList
          data={statements}
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
  statementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  statementIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F0F7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  statementContent: {
    flex: 1,
  },
  statementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    fontFamily: 'System',
    marginBottom: 4,
  },
  statementSize: {
    fontSize: 14,
    color: '#999999',
    fontFamily: 'System',
  },
  downloadButton: {
    padding: 10,
  },
});
