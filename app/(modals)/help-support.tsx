import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, MessageSquare, Phone, HelpCircle } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { ROUTES } from '../../constants/routes';

export default function HelpSupportScreen() {
  const router = useRouter();

  // Handle tap with haptic feedback
  const handleTap = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  // Navigate to different support screens
  const navigateTo = (path: any) => {
    handleTap();
    router.push(path);
  };

  // Support service options
  const supportOptions = [
    {
      id: 'chat',
      title: 'Chat',
      icon: <MessageSquare color="#007AFF" size={22} />,
      onPress: () => navigateTo(ROUTES.SUPPORT_CHAT)
    },
    {
      id: 'talk-to-banker',
      title: 'Talk with a banker',
      icon: <Phone color="#007AFF" size={22} />,
      onPress: () => navigateTo(ROUTES.CALL_SUPPORT)
    },
    {
      id: 'faq',
      title: 'Common questions',
      icon: <HelpCircle color="#007AFF" size={22} />,
      onPress: () => navigateTo(ROUTES.FAQ)
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
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={styles.rightPlaceholder} />
      </View>

      <ScrollView style={styles.contentContainer}>
        {/* Support options */}
        <View style={styles.supportOptionsContainer}>
          {supportOptions.map((option, index) => (
            <TouchableOpacity 
              key={option.id}
              style={[
                styles.optionItem,
                index !== supportOptions.length - 1 && styles.borderBottom
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
  },
  supportOptionsContainer: {
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
});
