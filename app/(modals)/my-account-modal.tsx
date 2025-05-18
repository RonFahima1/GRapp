import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Copy, ChevronLeft } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import { Platform } from 'react-native';

export default function MyAccountModal() {
  const router = useRouter();

  // Handle copy to clipboard
  const copyToClipboard = async (text: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    await Clipboard.setStringAsync(text);
    Alert.alert('Copied', 'Information copied to clipboard');
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
        <Text style={styles.headerTitle}>My Account</Text>
        <View style={styles.rightPlaceholder} />
      </View>

      <ScrollView style={styles.contentContainer}>
        {/* Account Name */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Account on Name</Text>
          <Text style={styles.nameValue}>John Smith</Text>
        </View>

        {/* Account Details Section */}
        <View style={styles.detailsSection}>
          <View style={styles.detailsHeader}>
            <Text style={styles.detailsLabel}>Account Number</Text>
            <Text style={styles.detailsLabel}>Branch</Text>
            <Text style={styles.detailsLabel}>Bank</Text>
          </View>
          <View style={styles.detailsRow}>
            <TouchableOpacity 
              style={styles.copyButton} 
              onPress={() => copyToClipboard("25365625")}
            >
              <Copy color="#CCCCCC" size={18} />
            </TouchableOpacity>
            <Text style={styles.detailsValue}>25365625</Text>
            <Text style={styles.detailsValue}>998</Text>
            <Text style={styles.detailsValue}>10</Text>
          </View>
        </View>

        {/* IBAN Section */}
        <View style={styles.itemSection}>
          <TouchableOpacity 
            style={styles.accountItem}
            onPress={() => copyToClipboard("IL40010998000002536565")}
          >
            <View style={styles.copyIcon}>
              <Copy color="#CCCCCC" size={18} />
            </View>
            <View style={styles.accountItemContent}>
              <Text style={styles.itemLabel}>IBAN Number</Text>
              <Text style={styles.itemValue}>IL40010998000002536565</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* SWIFT Code Section */}
        <View style={styles.itemSection}>
          <TouchableOpacity 
            style={styles.accountItem}
            onPress={() => copyToClipboard("LUMILITXXX")}
          >
            <View style={styles.copyIcon}>
              <Copy color="#CCCCCC" size={18} />
            </View>
            <View style={styles.accountItemContent}>
              <Text style={styles.itemLabel}>SWIFT Code</Text>
              <Text style={styles.itemValue}>LUMILITXXX</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Communication Ways Section Header */}
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>Ways of Communication</Text>
        </View>

        {/* Email Address */}
        <View style={styles.contactSection}>
          <TouchableOpacity 
            style={styles.contactItem}
            onPress={() => router.push('/(modals)/edit-email')}
          >
            <View style={styles.contactItemContent}>
              <Text style={styles.contactItemLabel}>Email</Text>
              <Text style={styles.contactItemValue}>john.smith@example.com</Text>
            </View>
            <ChevronLeft color="#CCCCCC" size={18} />
          </TouchableOpacity>
        </View>

        {/* Home Address */}
        <View style={styles.contactSection}>
          <TouchableOpacity 
            style={styles.contactItem}
            onPress={() => router.push('/(modals)/edit-home-address')}
          >
            <View style={styles.contactItemContent}>
              <Text style={styles.contactItemLabel}>Home Address</Text>
              <Text style={styles.contactItemValue}>123 Main St, Anytown, CA 12345</Text>
            </View>
            <ChevronLeft color="#CCCCCC" size={18} />
          </TouchableOpacity>
        </View>

        {/* Mailing Address */}
        <View style={styles.contactSection}>
          <TouchableOpacity 
            style={styles.contactItem}
            onPress={() => router.push('/(modals)/edit-mailing-address')}
          >
            <View style={styles.contactItemContent}>
              <Text style={styles.contactItemLabel}>Mailing Address</Text>
              <Text style={styles.contactItemValue}>123 Main St, Anytown, CA 12345</Text>
            </View>
            <ChevronLeft color="#CCCCCC" size={18} />
          </TouchableOpacity>
        </View>

        {/* Phone */}
        <View style={styles.contactSection}>
          <TouchableOpacity 
            style={styles.contactItem}
            onPress={() => router.push('/(modals)/edit-phone')}
          >
            <View style={styles.contactItemContent}>
              <Text style={styles.contactItemLabel}>Phone</Text>
              <Text style={styles.contactItemValue}>555-123-4567</Text>
            </View>
            <ChevronLeft color="#CCCCCC" size={18} />
          </TouchableOpacity>
        </View>

        {/* Close Account Button */}
        <TouchableOpacity 
          style={styles.closeAccountButton}
          onPress={() => router.push('/(modals)/account-closure')}
        >
          <Text style={styles.closeAccountText}>Request Account Closure</Text>
        </TouchableOpacity>

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
  section: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  sectionLabel: {
    fontSize: 13,
    color: '#999999',
    marginBottom: 5,
    fontFamily: 'System',
  },
  nameValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    fontFamily: 'System',
  },
  detailsSection: {
    padding: 16,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 50, // Space for copy button
  },
  detailsLabel: {
    fontSize: 13,
    color: '#999999',
    flex: 1,
    textAlign: 'center',
    fontFamily: 'System',
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    position: 'relative',
  },
  detailsValue: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
    color: '#333333',
    fontFamily: 'System',
  },
  copyButton: {
    position: 'absolute',
    right: 0,
    padding: 10,
  },
  itemSection: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  accountItem: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  copyIcon: {
    marginRight: 10,
  },
  accountItemContent: {
    flex: 1,
  },
  itemLabel: {
    fontSize: 13,
    color: '#999999',
    marginBottom: 5,
    fontFamily: 'System',
  },
  itemValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333333',
    fontFamily: 'System',
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
  contactSection: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  contactItem: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contactItemContent: {
    flex: 1,
  },
  contactItemLabel: {
    fontSize: 13,
    color: '#999999',
    marginBottom: 5,
    fontFamily: 'System',
  },
  contactItemValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    fontFamily: 'System',
  },
  closeAccountButton: {
    margin: 16,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  closeAccountText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
    fontFamily: 'System',
  },
  bottomPadding: {
    height: 40,
  },
});
