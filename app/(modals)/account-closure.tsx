import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image,
  Alert,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';

const AccountClosureScreen = () => {
  const router = useRouter();
  const [confirmReceived, setConfirmReceived] = useState(false);

  // Function to request account closure
  const requestClosure = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert('Closure Request Received', 'Your account closure request has been submitted. The next step is to contact our customer service.', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  // Function to get more info
  const getMoreInfo = () => {
    setConfirmReceived(true);
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
          <ChevronLeft color="#007AFF" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Account Closure</Text>
        <View style={styles.rightPlaceholder} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.iconContainer}>
          <View style={styles.orbitContainer}>
            <View style={styles.orbit} />
            <View style={[styles.orbitBall, styles.orbitBall1]} />
            <View style={[styles.orbitBall, styles.orbitBall2]} />
            <View style={[styles.orbitBall, styles.orbitBall3]} />
          </View>
        </View>

        <Text style={styles.titleText}>
          How can we help you with your account closure?
        </Text>

        <Text style={styles.descriptionText}>
          We are currently processing your request and we'd like to understand why.
        </Text>

        <Text style={styles.infoText}>
          If you would like to close your account, the next step would be to contact us.
        </Text>

        <Text style={styles.noteText}>
          If the account closure is due to a banking issue, we may be able to help resolve it without closing your account.
        </Text>

        <TouchableOpacity style={styles.actionButton} onPress={getMoreInfo}>
          <Text style={styles.actionButtonText}>Get more information about account closure</Text>
        </TouchableOpacity>

        {confirmReceived && (
          <>
            <View style={styles.separator} />
            
            <Text style={styles.confirmationText}>
              To proceed with account closure, please be aware that:
            </Text>
            
            <View style={styles.pointContainer}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.pointText}>All recurring payments and automatic transfers will be canceled</Text>
            </View>
            
            <View style={styles.pointContainer}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.pointText}>Any remaining balance will need to be transferred to another account</Text>
            </View>
            
            <View style={styles.pointContainer}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.pointText}>You'll need to destroy any associated cards</Text>
            </View>
            
            <View style={styles.pointContainer}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.pointText}>The process may take up to 30 days to complete</Text>
            </View>
            
            <TouchableOpacity style={styles.closeAccountButton} onPress={requestClosure}>
              <Text style={styles.closeAccountText}>Request Account Closure</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

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
  },
  backButton: {
    padding: 5,
  },
  rightPlaceholder: {
    width: 30,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    alignItems: 'center',
  },
  iconContainer: {
    height: 120,
    width: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 30,
  },
  orbitContainer: {
    position: 'relative',
    height: 100,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbit: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#CCCCCC',
  },
  orbitBall: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF3B30',
  },
  orbitBall1: {
    top: 0,
    left: 44,
  },
  orbitBall2: {
    right: 5,
    top: 44,
  },
  orbitBall3: {
    bottom: 10,
    left: 25,
  },
  titleText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'System',
  },
  descriptionText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'System',
  },
  infoText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: 'System',
  },
  noteText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: 'System',
  },
  actionButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'System',
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    width: '100%',
    marginVertical: 20,
  },
  confirmationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 20,
    alignSelf: 'flex-start',
    fontFamily: 'System',
  },
  pointContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
    width: '100%',
    paddingRight: 20,
  },
  bulletPoint: {
    fontSize: 18,
    color: '#666666',
    marginRight: 10,
    fontFamily: 'System',
  },
  pointText: {
    fontSize: 14,
    color: '#666666',
    flex: 1,
    fontFamily: 'System',
  },
  closeAccountButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    padding: 16,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  closeAccountText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'System',
  },
});

export default AccountClosureScreen;
