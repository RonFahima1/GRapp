import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  ScrollView,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Copy, ChevronRight, ChevronLeft, X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import * as Clipboard from 'expo-clipboard';
import { useTranslate } from '../context/TranslationContext';

type MyAccountModalProps = {
  visible: boolean;
  onClose: () => void;
};

const MyAccountModal = ({ visible, onClose }: MyAccountModalProps) => {
  const { t, isRTL } = useTranslate();
  
  // Handle copy to clipboard
  const copyToClipboard = async (text: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await Clipboard.setStringAsync(text);
    Alert.alert(t('common.copied_title'), t('myAccount.informationCopied'));
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* Header with title and close button */}
        <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <View style={styles.closePlaceholder} />
          <Text style={styles.headerTitle}>{t('myAccount.title')}</Text>
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={onClose}
            hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
            accessibilityLabel={t('common.close')}
          >
            <X color="#007AFF" size={24} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.contentContainer}>
          {/* Account Name */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { textAlign: isRTL ? 'right' : 'left' }]}>{t('myAccount.accountOnName')}</Text>
            <Text style={[styles.nameValue, { textAlign: isRTL ? 'right' : 'left' }]}>{t('myAccount.userName')}</Text>
          </View>

          {/* Account Details Section */}
          <View style={styles.detailsSection}>
            <View style={[styles.detailsHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Text style={styles.detailsLabel}>{t('myAccount.accountNumber')}</Text>
              <Text style={styles.detailsLabel}>{t('myAccount.branch')}</Text>
              <Text style={styles.detailsLabel}>{t('myAccount.bank')}</Text>
            </View>
            <View style={[styles.detailsRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <TouchableOpacity 
                style={[styles.copyButton, { left: isRTL ? 0 : undefined, right: isRTL ? undefined : 0 }]} 
                onPress={() => copyToClipboard("25365625")}
                accessibilityLabel={t('common.copy')}
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
              style={[styles.accountItem, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
              onPress={() => copyToClipboard("IL40010998000002536565")}
              accessibilityLabel={t('common.copy') + ' ' + t('myAccount.ibanNumber')}
            >
              <View style={[styles.copyIcon, { marginRight: isRTL ? 0 : 10, marginLeft: isRTL ? 10 : 0 }]}>
                <Copy color="#CCCCCC" size={18} />
              </View>
              <View style={styles.accountItemContent}>
                <Text style={[styles.itemLabel, { textAlign: isRTL ? 'right' : 'left' }]}>{t('myAccount.ibanNumber')}</Text>
                <Text style={[styles.itemValue, { textAlign: isRTL ? 'right' : 'left' }]}>IL40010998000002536565</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* SWIFT Code Section */}
          <View style={styles.itemSection}>
            <TouchableOpacity 
              style={[styles.accountItem, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
              onPress={() => copyToClipboard("LUMILITXXX")}
              accessibilityLabel={t('common.copy') + ' ' + t('myAccount.swiftCode')}
            >
              <View style={[styles.copyIcon, { marginRight: isRTL ? 0 : 10, marginLeft: isRTL ? 10 : 0 }]}>
                <Copy color="#CCCCCC" size={18} />
              </View>
              <View style={styles.accountItemContent}>
                <Text style={[styles.itemLabel, { textAlign: isRTL ? 'right' : 'left' }]}>{t('myAccount.swiftCode')}</Text>
                <Text style={[styles.itemValue, { textAlign: isRTL ? 'right' : 'left' }]}>LUMILITXXX</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Communication Ways Section Header */}
          <View style={styles.sectionTitleContainer}>
            <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>{t('myAccount.yourContactInformation')}</Text>
          </View>

          {/* Email Address */}
          <View style={styles.contactSection}>
            <TouchableOpacity 
              style={[styles.contactItem, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
              accessibilityLabel={t('myAccount.editEmail')}
            >
              <View style={styles.contactItemContent}>
                <Text style={[styles.contactItemLabel, { textAlign: isRTL ? 'right' : 'left' }]}>{t('myAccount.emailAddress')}</Text>
                <Text style={[styles.contactItemValue, { textAlign: isRTL ? 'right' : 'left' }]}>alex.johnson@example.com</Text>
              </View>
              {isRTL ? <ChevronLeft color="#CCCCCC" size={18} /> : <ChevronRight color="#CCCCCC" size={18} />}
            </TouchableOpacity>
          </View>

          {/* Home Address */}
          <View style={styles.contactSection}>
            <TouchableOpacity 
              style={[styles.contactItem, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
              accessibilityLabel={t('myAccount.editHomeAddress')}
            >
              <View style={styles.contactItemContent}>
                <Text style={[styles.contactItemLabel, { textAlign: isRTL ? 'right' : 'left' }]}>{t('myAccount.homeAddress')}</Text>
                <Text style={[styles.contactItemValue, { textAlign: isRTL ? 'right' : 'left' }]}>123 Main St., Springfield, 12345</Text>
              </View>
              {isRTL ? <ChevronLeft color="#CCCCCC" size={18} /> : <ChevronRight color="#CCCCCC" size={18} />}
            </TouchableOpacity>
          </View>

          {/* Mailing Address */}
          <View style={styles.contactSection}>
            <TouchableOpacity 
              style={[styles.contactItem, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
              accessibilityLabel={t('myAccount.editMailingAddress')}
            >
              <View style={styles.contactItemContent}>
                <Text style={[styles.contactItemLabel, { textAlign: isRTL ? 'right' : 'left' }]}>{t('myAccount.mailingAddress')}</Text>
                <Text style={[styles.contactItemValue, { textAlign: isRTL ? 'right' : 'left' }]}>123 Main St., Springfield, 12345</Text>
              </View>
              {isRTL ? <ChevronLeft color="#CCCCCC" size={18} /> : <ChevronRight color="#CCCCCC" size={18} />}
            </TouchableOpacity>
          </View>

          {/* Phone Number */}
          <View style={styles.contactSection}>
            <TouchableOpacity 
              style={[styles.contactItem, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
              accessibilityLabel={t('myAccount.editPhone')}
            >
              <View style={styles.contactItemContent}>
                <Text style={[styles.contactItemLabel, { textAlign: isRTL ? 'right' : 'left' }]}>{t('myAccount.phone')}</Text>
                <Text style={[styles.contactItemValue, { textAlign: isRTL ? 'right' : 'left' }]}>0522625185</Text>
              </View>
              {isRTL ? <ChevronLeft color="#CCCCCC" size={18} /> : <ChevronRight color="#CCCCCC" size={18} />}
            </TouchableOpacity>
          </View>

          {/* Close Account Button */}
          <TouchableOpacity 
            style={styles.closeAccountButton}
            accessibilityLabel={t('myAccount.requestAccountClosure')}
          >
            <Text style={styles.closeAccountText}>{t('myAccount.requestAccountClosure')}</Text>
          </TouchableOpacity>

          {/* Bottom padding */}
          <View style={styles.bottomPadding} />
        </ScrollView>
      </SafeAreaView>
    </Modal>
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
    textAlign: 'center',
  },
  closeButton: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closePlaceholder: {
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

export default MyAccountModal;
