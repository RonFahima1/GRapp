import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Switch
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, Bell, MessageSquare, Mail } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Platform } from 'react-native';

export default function NotificationsSettings() {
  const router = useRouter();
  const [pushEnabled, setPushEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);

  // Handle tap with haptic feedback
  const handleTap = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  // Toggle switch with haptic feedback
  const handleToggle = (setter: React.Dispatch<React.SetStateAction<boolean>>) => (value: boolean) => {
    handleTap();
    setter(value);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header with title and back button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronRight color="#007AFF" size={24} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.rightPlaceholder} />
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Top explanatory text */}
        <View style={styles.explanationContainer}>
          <Text style={styles.explanationText}>
            We can send you notifications to keep you informed about account activity, 
            special offers, and more. You can manage your notification preferences 
            through the options below.
          </Text>
        </View>

        {/* Notification settings */}
        <View style={styles.settingsContainer}>
          {/* Push Notifications */}
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Bell color="#007AFF" size={22} style={styles.settingIcon} />
              <Text style={styles.settingText}>Push Notifications</Text>
            </View>
            <Switch
              value={pushEnabled}
              onValueChange={handleToggle(setPushEnabled)}
              trackColor={{ false: '#E0E0E0', true: '#007AFF' }}
              thumbColor={'#FFFFFF'}
              ios_backgroundColor="#E0E0E0"
            />
          </View>

          {/* SMS Notifications */}
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <MessageSquare color="#007AFF" size={22} style={styles.settingIcon} />
              <Text style={styles.settingText}>SMS Notifications</Text>
            </View>
            <Switch
              value={smsEnabled}
              onValueChange={handleToggle(setSmsEnabled)}
              trackColor={{ false: '#E0E0E0', true: '#007AFF' }}
              thumbColor={'#FFFFFF'}
              ios_backgroundColor="#E0E0E0"
            />
          </View>

          {/* Email Notifications */}
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Mail color="#007AFF" size={22} style={styles.settingIcon} />
              <Text style={styles.settingText}>Email Notifications</Text>
            </View>
            <Switch
              value={emailEnabled}
              onValueChange={handleToggle(setEmailEnabled)}
              trackColor={{ false: '#E0E0E0', true: '#007AFF' }}
              thumbColor={'#FFFFFF'}
              ios_backgroundColor="#E0E0E0"
            />
          </View>
        </View>

        {/* Bottom explanatory text */}
        <View style={styles.bottomExplanationContainer}>
          <Text style={styles.bottomExplanationText}>
            By enabling notification consent, I agree to receive marketing messages via 
            the selected channels. These messages may be sent by our systems or by 
            third-party partners for promotional purposes.
          </Text>
          <Text style={styles.bottomExplanationText}>
            You can customize your notification preferences at any time through this 
            screen. Push notifications, SMS, and email alerts help keep you informed 
            about important account activity. Marketing notifications can be disabled 
            at any time.
          </Text>
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
  scrollView: {
    flex: 1,
  },
  explanationContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    marginTop: 16,
  },
  explanationText: {
    fontSize: 14,
    color: '#555555',
    lineHeight: 20,
  },
  settingsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    marginRight: 12,
  },
  settingText: {
    fontSize: 16,
    color: '#333333',
  },
  bottomExplanationContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  bottomExplanationText: {
    fontSize: 12,
    color: '#777777',
    marginBottom: 12,
    lineHeight: 18,
  },
  bottomPadding: {
    height: 40,
  },
});
