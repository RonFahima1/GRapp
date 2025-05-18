import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Linking,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, Phone, Clock, Calendar } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Platform } from 'react-native';

export default function CallSupportScreen() {
  const router = useRouter();

  // Handle tap with haptic feedback
  const handleTap = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  // Handle phone call
  const handleCall = (phoneNumber: string) => {
    handleTap();
    
    if (Platform.OS === 'web') {
      Alert.alert('Phone Call', `In a real app, this would call: ${phoneNumber}`);
      return;
    }
    
    Linking.openURL(`tel:${phoneNumber}`)
      .catch(err => {
        Alert.alert('Error', 'Could not open phone dialer');
        console.error('Error opening phone dialer:', err);
      });
  };

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
        <Text style={styles.headerTitle}>Talk with a banker</Text>
        <View style={styles.rightPlaceholder} />
      </View>

      <ScrollView style={styles.contentContainer}>
        {/* Information about calling hours */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Our support team is ready to help</Text>
          <Text style={styles.infoDescription}>
            You can call our support team during business hours for assistance with your account, 
            transfers, or any other questions about Global Remit services.
          </Text>
          
          <View style={styles.hoursContainer}>
            <View style={styles.hourItem}>
              <Clock color="#007AFF" size={20} />
              <Text style={styles.hourText}>Monday - Friday: 8:00 AM - 8:00 PM</Text>
            </View>
            <View style={styles.hourItem}>
              <Clock color="#007AFF" size={20} />
              <Text style={styles.hourText}>Saturday: 9:00 AM - 5:00 PM</Text>
            </View>
            <View style={styles.hourItem}>
              <Clock color="#007AFF" size={20} />
              <Text style={styles.hourText}>Sunday: Closed</Text>
            </View>
          </View>
        </View>

        {/* Call buttons */}
        <View style={styles.callOptionsContainer}>
          <TouchableOpacity 
            style={styles.callButton}
            onPress={() => handleCall('1-800-888-8888')}
          >
            <Phone color="#FFFFFF" size={22} />
            <Text style={styles.callButtonText}>Call General Support</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.callButton, styles.secondaryCallButton]}
            onPress={() => handleCall('1-800-999-9999')}
          >
            <Phone color="#007AFF" size={22} />
            <Text style={styles.secondaryCallButtonText}>Call Technical Support</Text>
          </TouchableOpacity>
        </View>

        {/* Schedule a call option */}
        <View style={styles.scheduleContainer}>
          <Text style={styles.scheduleTitle}>Can't call now?</Text>
          <TouchableOpacity 
            style={styles.scheduleButton}
            onPress={() => {
              handleTap();
              router.push('/(modals)/schedule-call');
            }}
          >
            <Calendar color="#007AFF" size={20} />
            <Text style={styles.scheduleButtonText}>Schedule a callback</Text>
          </TouchableOpacity>
        </View>

        {/* Note about international calling */}
        <View style={styles.noteContainer}>
          <Text style={styles.noteText}>
            Note: Standard calling rates may apply. If you're calling from outside the United States, 
            please use our international number: +1-212-555-0123.
          </Text>
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
    padding: 16,
  },
  infoContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333333',
  },
  infoDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666666',
    marginBottom: 16,
  },
  hoursContainer: {
    marginTop: 8,
  },
  hourItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  hourText: {
    fontSize: 14,
    color: '#333333',
    marginLeft: 10,
  },
  callOptionsContainer: {
    marginBottom: 16,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 16,
    marginBottom: 12,
  },
  callButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  secondaryCallButton: {
    backgroundColor: '#F2F2F7',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  secondaryCallButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginLeft: 8,
  },
  scheduleContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333333',
  },
  scheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  scheduleButtonText: {
    fontSize: 16,
    color: '#007AFF',
    marginLeft: 10,
  },
  noteContainer: {
    padding: 16,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    marginBottom: 32,
  },
  noteText: {
    fontSize: 13,
    lineHeight: 18,
    color: '#666666',
  },
});
