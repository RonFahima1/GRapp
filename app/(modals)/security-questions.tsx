import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, ShieldQuestion } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Platform } from 'react-native';

export default function SecurityQuestions() {
  const router = useRouter();

  // Handle tap with haptic feedback
  const handleTap = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  // Handle understanding button press
  const handleUnderstand = () => {
    handleTap();
    // In a real app, this would navigate to the next step or mark as acknowledged
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header with close button */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.closeButton} 
          onPress={() => router.back()}
          hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
        >
          <X color="#000000" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.contentContainer} contentContainerStyle={styles.contentContainerStyle}>
        {/* Security Questions Illustration */}
        <View style={styles.illustrationContainer}>
          <View style={styles.iconCircle}>
            <ShieldQuestion color="#FF3B78" size={48} />
          </View>
        </View>

        {/* Title and Description */}
        <Text style={styles.title}>Your Security Questions</Text>
        <Text style={styles.description}>
          Sometimes passwords are forgotten. Security questions will help us verify your identity and 
          allow you to reconnect. It's important to provide answers that you'll easily remember when needed.
        </Text>

        {/* Privacy Policy Reference */}
        <Text style={styles.privacyText}>
          I understand that the protection of my details is in accordance with the{' '}
          <Text style={styles.linkText}>privacy policy</Text> and{' '}
          <Text style={styles.linkText}>legal terms</Text> of Global Remit.
        </Text>

        {/* Additional Info */}
        <Text style={styles.additionalInfo}>
          Security questions will be used across your Global Remit account, for service only and not for marketing purposes.
        </Text>

        {/* Understand Button */}
        <TouchableOpacity style={styles.understandButton} onPress={handleUnderstand}>
          <Text style={styles.understandButtonText}>I Understand</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F3', // Light beige background like in the screenshot
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  closeButton: {
    padding: 5,
  },
  contentContainer: {
    flex: 1,
  },
  contentContainerStyle: {
    padding: 20,
    alignItems: 'center',
  },
  illustrationContainer: {
    marginVertical: 30,
    alignItems: 'center',
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFF0F5', // Light pink background
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  privacyText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 16,
  },
  linkText: {
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  additionalInfo: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 30,
  },
  understandButton: {
    backgroundColor: '#000000',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  understandButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
