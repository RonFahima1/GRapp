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

export default function DocumentsModal() {
  const router = useRouter();

  // Handle tap with haptic feedback
  const handleTap = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  // Navigate with correct paths and disable type checking for custom routes
  const navigateTo = (path: string) => {
    handleTap();
    // @ts-ignore: This path may not be recognized by TypeScript but is valid for the router
    router.push(path);
  };

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
        <Text style={styles.headerTitle}>Documents</Text>
        <View style={styles.rightPlaceholder} />
      </View>

      <ScrollView style={styles.contentContainer}>
        {/* Main sections list */}
        <View style={styles.sectionsContainer}>
          {/* Approvals section */}
          <TouchableOpacity 
            style={styles.sectionItem}
            onPress={() => navigateTo('/(modals)/approvals')}
          >
            <View style={styles.sectionContent}>
              <Text style={styles.sectionTitle}>Approvals</Text>
              <ChevronRight color="#CCCCCC" size={20} style={styles.chevronIcon} />
            </View>
          </TouchableOpacity>
          
          {/* Regular Letters section */}
          <TouchableOpacity 
            style={[styles.sectionItem, styles.sectionItemWithBorder]}
            onPress={() => navigateTo('/(modals)/regular-letters')}
          >
            <View style={styles.sectionContent}>
              <View style={styles.notificationDot} />
              <Text style={styles.sectionTitle}>Regular Letters</Text>
              <ChevronRight color="#CCCCCC" size={20} style={styles.chevronIcon} />
            </View>
          </TouchableOpacity>
          
          {/* Fees and Interest section */}
          <TouchableOpacity 
            style={[styles.sectionItem, styles.sectionItemWithBorder]}
            onPress={() => navigateTo('/(modals)/fees-interest')}
          >
            <View style={styles.sectionContent}>
              <View style={styles.notificationDot} />
              <Text style={styles.sectionTitle}>Fees & Interest</Text>
              <ChevronRight color="#CCCCCC" size={20} style={styles.chevronIcon} />
            </View>
          </TouchableOpacity>
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
  },
  sectionsContainer: {
    backgroundColor: '#FFFFFF',
    marginTop: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
  },
  sectionItem: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  sectionItemWithBorder: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  sectionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // LTR layout
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    fontFamily: 'System',
    flex: 1,
    textAlign: 'left',
  },
  chevronIcon: {
    marginLeft: 5,
  },
  notificationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30',
    marginRight: 10,
  },
  bottomPadding: {
    height: 40,
  },
});
