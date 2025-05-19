import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronRight, Info, Bookmark, FileText, PiggyBank, Shield, Award, HelpCircle, BookOpen } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Platform } from 'react-native';

export default function AboutScreen() {
  const router = useRouter();
  const appVersion = '10.8.0';

  // Handle tap with haptic feedback
  const handleTap = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  // Navigate to specific about pages
  const navigateTo = (path: string) => {
    handleTap();
    router.push(path);
  };

  // About section options
  const aboutOptions = [
    {
      id: 'key-features',
      title: 'Global Remit Key Features',
      icon: <Award color="#007AFF" size={22} />,
      onPress: () => navigateTo('/(modals)/about-features')
    },
    {
      id: 'legal-aspects',
      title: 'Legal Information',
      icon: <FileText color="#007AFF" size={22} />,
      onPress: () => navigateTo('/(modals)/about-legal')
    },
    {
      id: 'fee-schedule',
      title: 'Fee Schedule',
      icon: <Bookmark color="#007AFF" size={22} />,
      onPress: () => navigateTo('/(modals)/about-fees')
    },
    {
      id: 'privacy-policy',
      title: 'Privacy Policy',
      icon: <Shield color="#007AFF" size={22} />,
      onPress: () => navigateTo('/(modals)/about-privacy')
    },
    {
      id: 'security-info',
      title: 'Security Information',
      icon: <Shield color="#007AFF" size={22} />,
      onPress: () => navigateTo('/(modals)/about-security')
    },
    {
      id: 'permissions',
      title: 'App Permissions',
      icon: <BookOpen color="#007AFF" size={22} />,
      onPress: () => navigateTo('/(modals)/about-permissions')
    },
    {
      id: 'green-banking',
      title: 'Green Banking',
      icon: <PiggyBank color="#007AFF" size={22} />,
      onPress: () => navigateTo('/(modals)/about-green-banking')
    },
    {
      id: 'accessibility',
      title: 'Accessibility Features',
      icon: <HelpCircle color="#007AFF" size={22} />,
      onPress: () => navigateTo('/(modals)/about-accessibility')
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
        <Text style={styles.headerTitle}>About</Text>
        <View style={styles.rightPlaceholder} />
      </View>

      <ScrollView style={styles.contentContainer}>
        {/* About options */}
        <View style={styles.aboutOptionsContainer}>
          {aboutOptions.map((option, index) => (
            <TouchableOpacity 
              key={option.id}
              style={[
                styles.optionItem,
                index !== aboutOptions.length - 1 && styles.borderBottom
              ]}
              onPress={option.onPress}
            >
              <View style={styles.optionContent}>
                <View style={styles.optionLeft}>
                  {option.icon}
                  <Text style={styles.optionTitle}>{option.title}</Text>
                </View>
                <ChevronRight color="#CCCCCC" size={20} style={styles.chevronIcon} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Version info */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version: {appVersion}</Text>
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
  contentContainer: {
    flex: 1,
  },
  aboutOptionsContainer: {
    backgroundColor: '#FFFFFF',
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  optionItem: {
    padding: 16,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionTitle: {
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
  versionContainer: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 24,
  },
  versionText: {
    fontSize: 14,
    color: '#999999',
  }
});
