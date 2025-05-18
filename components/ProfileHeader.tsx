import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Copy } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

type ProfileHeaderProps = {
  name: string;
  accountNumber: string;
  branchNumber: string;
  bankNumber: string;
  copyToClipboard: (text: string) => void;
};

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  accountNumber,
  branchNumber,
  bankNumber,
  copyToClipboard
}) => {
  return (
    <View style={styles.profileHeader}>
      <Text style={styles.profileName}>{name}</Text>
      
      <View style={styles.accountInfoCard}>
        <View style={styles.accountInfoItem}>
          <Text style={styles.accountInfoLabel}>Account Number</Text>
          <View style={styles.accountNumberContainer}>
            <Text style={styles.accountInfoValue}>{accountNumber}</Text>
            <Copy 
              color="#007AFF" 
              size={16} 
              style={styles.copyIcon} 
              onPress={() => copyToClipboard(accountNumber)}
            />
          </View>
        </View>
        
        <View style={styles.accountDetailsRow}>
          <View style={[styles.accountInfoItem, styles.halfWidth]}>
            <Text style={styles.accountInfoLabel}>Branch</Text>
            <Text style={styles.accountInfoValue}>{branchNumber}</Text>
          </View>
          
          <View style={[styles.accountInfoItem, styles.halfWidth]}>
            <Text style={styles.accountInfoLabel}>Bank</Text>
            <Text style={styles.accountInfoValue}>{bankNumber}</Text>
          </View>
          
          <View style={styles.accountQrContainer}>
            <Image 
              source={require('../assets/qr-code-placeholder.png')}
              style={styles.qrIcon}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  profileHeader: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 20,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
  },
  accountInfoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  accountInfoItem: {
    marginBottom: 12,
  },
  accountInfoLabel: {
    fontSize: 14,
    color: '#999999',
    marginBottom: 4,
  },
  accountInfoValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  accountNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  copyIcon: {
    marginLeft: 10,
  },
  accountDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  halfWidth: {
    width: '35%',
  },
  accountQrContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
});

export default ProfileHeader;
