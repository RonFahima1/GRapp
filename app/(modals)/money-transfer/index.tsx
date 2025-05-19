import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, ArrowRight } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

export default function MoneyTransferScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  // Define recipient type
  type Recipient = {
    id: number;
    name: string;
    avatar: string;
    lastSent: string;
    accountNumber: string;
  };

  // Sample recent recipients data
  const recentRecipients: Recipient[] = [
    { 
      id: 1, 
      name: 'Maria Rodriguez', 
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
      lastSent: '2 days ago',
      accountNumber: '****3456'
    },
    { 
      id: 2, 
      name: 'Juan Perez', 
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
      lastSent: '1 week ago',
      accountNumber: '****7890'
    },
    { 
      id: 3, 
      name: 'Ana Lopez', 
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
      lastSent: '2 weeks ago',
      accountNumber: '****2345'
    },
    { 
      id: 4, 
      name: 'Carlos Gomez', 
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
      lastSent: '1 month ago',
      accountNumber: '****6789'
    },
  ];

  const handleSelectRecipient = (recipient: Recipient) => {
    // Navigate to the next step with the selected recipient
    router.push({
      pathname: './amount',
      params: { 
        recipientId: recipient.id.toString(),
        recipientName: recipient.name,
        recipientAvatar: recipient.avatar,
        accountNumber: recipient.accountNumber
      }
    });
  };

  const handleNewRecipient = () => {
    // Navigate to add new recipient
    router.push('./new-recipient');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={styles.backButton}
          hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
        >
          <ChevronLeft color="#007AFF" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('Send Money')}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('Recent Recipients')}</Text>
          <View style={styles.recipientsList}>
            {recentRecipients.map((recipient) => (
              <TouchableOpacity 
                key={recipient.id} 
                style={styles.recipientCard}
                onPress={() => handleSelectRecipient(recipient)}
              >
                <Image source={{ uri: recipient.avatar }} style={styles.avatar} />
                <View style={styles.recipientInfo}>
                  <Text style={styles.recipientName}>{recipient.name}</Text>
                  <Text style={styles.recipientDetail}>{recipient.lastSent} • {recipient.accountNumber}</Text>
                </View>
                <ArrowRight color="#8E8E93" size={16} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.divider} />

        <TouchableOpacity 
          style={styles.newRecipientButton}
          onPress={handleNewRecipient}
        >
          <View style={styles.newRecipientContent}>
            <View style={styles.plusIconContainer}>
              <Text style={styles.plusIcon}>+</Text>
            </View>
            <Text style={styles.newRecipientText}>{t('New Recipient')}</Text>
          </View>
          <ArrowRight color="#8E8E93" size={16} />
        </TouchableOpacity>

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            {t('Send money to friends, family, or businesses. You can send to recent recipients or add a new one.')}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
  },
  placeholder: {
    width: 24,
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 12,
  },
  recipientsList: {
    marginTop: 8,
  },
  recipientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  recipientInfo: {
    flex: 1,
    marginLeft: 12,
  },
  recipientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  recipientDetail: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  divider: {
    height: 8,
    backgroundColor: '#F2F2F7',
    marginVertical: 16,
  },
  newRecipientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  newRecipientContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  plusIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusIcon: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  newRecipientText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginLeft: 12,
  },
  infoContainer: {
    marginTop: 24,
    marginHorizontal: 16,
    padding: 16,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderRadius: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#007AFF',
    lineHeight: 20,
  },
});
