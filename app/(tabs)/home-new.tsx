import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { useTranslate } from '../../context/TranslationContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, CreditCard, Wallet, ArrowDownLeft, ArrowUpRight, ChevronLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

export default function HomeScreen() {
  const { t, isRTL, currentLanguage } = useTranslate();
  const router = useRouter();

  // Sample data for cards
  const cards = [
    { id: 1, type: 'Visa', last4: '4567', color: ['#4158D0', '#C850C0'] as const, balance: 850.75 },
    { id: 2, type: 'Mastercard', last4: '8901', color: ['#0093E9', '#80D0C7'] as const, balance: 400.25 },
  ];

  // Sample data for transactions
  const transactions = [
    { id: 1, name: 'Maria Rodriguez', type: 'sent', amount: 250, date: 'May 15, 2023', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80' },
    { id: 2, name: 'Grocery Store', type: 'received', amount: 150, date: 'May 10, 2023', avatar: 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80' },
    { id: 3, name: 'Ana Lopez', type: 'sent', amount: 300, date: 'May 5, 2023', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80' },
    { id: 4, name: 'Salary Deposit', type: 'received', amount: 1200, date: 'May 1, 2023', avatar: 'https://images.unsplash.com/photo-1560472355-536de3962603?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80' },
  ];

  // Function to provide haptic feedback for consistent interaction
  const handleTap = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Language selector removed - only in Security & Preferences */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{
          ...styles.header,
          flexDirection: isRTL ? 'row-reverse' : 'row',
        }}>
          <Text style={{
            ...styles.title,
            textAlign: isRTL ? 'right' : 'left',
          }}>
            {t('dashboard.my_wallet')}
          </Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => {
              handleTap();
              // Navigate to add new card or account
            }}
            accessibilityLabel={t('dashboard.add_new_card')}
          >
            <Plus color="#FF6B6B" size={24} />
          </TouchableOpacity>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.cardsContainer}
          contentContainerStyle={{
            paddingLeft: isRTL ? 10 : 20,
            paddingRight: isRTL ? 20 : 10,
            paddingBottom: 10,
          }}
          accessibilityLabel={t('dashboard.cards')}
        >
          {cards.map((card, index) => (
            <LinearGradient
              key={card.id}
              colors={card.color}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.card, index === 0 && styles.activeCard]}
            >
              <View style={{
                ...styles.cardHeader,
                flexDirection: isRTL ? 'row-reverse' : 'row',
              }}>
                <CreditCard color="#fff" size={24} />
                <Text style={styles.cardType}>{t(`payment.${card.type.toLowerCase()}`)}</Text>
              </View>
              <Text style={styles.cardNumber}>{t('payment.card_ending', {last4: card.last4})}</Text>
              <View style={{
                ...styles.cardFooter,
                flexDirection: isRTL ? 'row-reverse' : 'row',
              }}>
                <View>
                  <Text style={styles.cardLabel}>{t('dashboard.balance')}</Text>
                  <Text style={styles.cardBalance}>
                    {/* Use proper number formatting based on locale */}
                    {new Intl.NumberFormat(currentLanguage, { style: 'currency', currency: 'USD' }).format(card.balance)}
                  </Text>
                </View>
                <Image 
                  source={{ uri: card.type === 'Visa' 
                    ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/200px-Visa_Inc._logo.svg.png'
                    : 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/200px-Mastercard-logo.svg.png' 
                  }}
                  style={styles.cardLogo}
                  resizeMode="contain"
                />
              </View>
            </LinearGradient>
          ))}

          <TouchableOpacity 
            style={styles.addCardButton}
            onPress={() => router.push('/(modals)/add-card')}
          >
            <View style={styles.addCardIcon}>
              <Plus color="#FF6B6B" size={24} />
            </View>
            <Text style={styles.addCardText}>{t('dashboard.add_new_card')}</Text>
          </TouchableOpacity>
        </ScrollView>

        <View style={{
          ...styles.actionsContainer,
          flexDirection: isRTL ? 'row-reverse' : 'row',
        }}>
          <TouchableOpacity style={[styles.actionButton, { marginRight: 15 }]} onPress={() => {
            handleTap();
            router.push('/send-money');
          }}>
            <View style={[styles.actionIcon, { backgroundColor: 'rgba(255, 193, 7, 0.1)' }]}>
              <CreditCard color="#FFC107" size={24} />
            </View>
            <Text style={styles.actionText}>{t('dashboard.top_up')}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionButton, { marginHorizontal: 15 }]} onPress={() => {
            handleTap();
            // Use available routes in the app
            router.push({ pathname: '/' });
          }}>
            <View style={[styles.actionIcon, { backgroundColor: 'rgba(0, 122, 255, 0.1)' }]}>
              <ArrowDownLeft color="#007AFF" size={24} />
            </View>
            <Text style={styles.actionText}>{t('dashboard.request')}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionButton, { marginLeft: 15 }]} onPress={() => {
            handleTap();
            // No navigation needed for wallet since we're already on the wallet screen
          }}>
            <View style={[styles.actionIcon, { backgroundColor: 'rgba(0, 200, 83, 0.1)' }]}>
              <Wallet color="#00C853" size={24} />
            </View>
            <Text style={styles.actionText}>{t('dashboard.exchange')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.transactionsContainer}>
          <View style={{
            ...styles.sectionHeader,
            flexDirection: isRTL ? 'row-reverse' : 'row',
          }}>
            <Text style={{
              ...styles.sectionTitle,
              textAlign: isRTL ? 'right' : 'left',
            }}>
              {t('dashboard.recent_transactions')}
            </Text>
            <TouchableOpacity onPress={() => router.push('/transactions')}>
              <Text style={{
                ...styles.seeAllText,
                textAlign: isRTL ? 'left' : 'right',
              }}>
                {t('dashboard.see_all')}
              </Text>
            </TouchableOpacity>
          </View>
          
          {transactions.map(transaction => (
            <TouchableOpacity key={transaction.id} style={{
              ...styles.transactionItem,
              flexDirection: isRTL ? 'row-reverse' : 'row',
            }} onPress={() => {
              handleTap();
              // Use available routes in the app
              router.push('/');
            }}>
              <Image 
                source={{ uri: transaction.avatar }} 
                style={styles.transactionAvatar} 
              />
              <View style={{
                ...styles.transactionInfo,
                marginLeft: isRTL ? 0 : 15,
                marginRight: isRTL ? 15 : 0,
              }}>
                <Text style={{
                  ...styles.transactionName,
                  textAlign: isRTL ? 'right' : 'left',
                }}>
                  {transaction.name}
                </Text>
                <Text style={{
                  ...styles.transactionDate,
                  textAlign: isRTL ? 'right' : 'left',
                }}>
                  {transaction.date}
                </Text>
              </View>
              <Text style={[styles.transactionAmount, transaction.type === 'sent' ? styles.sentAmount : styles.receivedAmount, {textAlign: isRTL ? 'left' : 'right'}]}>
                {transaction.type === 'sent' 
                  ? t('transactions.amount_negative', {amount: new Intl.NumberFormat(currentLanguage, { style: 'currency', currency: 'USD' }).format(transaction.amount)}) 
                  : t('transactions.amount_positive', {amount: new Intl.NumberFormat(currentLanguage, { style: 'currency', currency: 'USD' }).format(transaction.amount)})}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Styles as a StyleSheet object with proper typing
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  header: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    padding: 5,
  },
  backIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardsContainer: {
    marginBottom: 25,
  },
  card: {
    width: 300,
    height: 180,
    borderRadius: 20,
    padding: 20,
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 5,
  },
  activeCard: {
    transform: [{ scale: 1.05 }],
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  cardType: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 10,
    marginRight: 10,
  },
  cardNumber: {
    color: '#fff',
    fontSize: 18,
    letterSpacing: 2,
    marginBottom: 30,
  },
  cardFooter: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    marginBottom: 4,
  },
  cardBalance: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  cardLogo: {
    width: 60,
    height: 30,
  },
  addCardButton: {
    width: 300,
    height: 180,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 3,
  },
  addCardIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  addCardText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  actionsContainer: {
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 30,
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  transactionsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  sectionHeader: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  seeAllText: {
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: '600',
  },
  transactionItem: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  transactionAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  transactionDate: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '700',
  },
  sentAmount: {
    color: '#FF6B6B',
  },
  receivedAmount: {
    color: '#00C853',
  },
});
