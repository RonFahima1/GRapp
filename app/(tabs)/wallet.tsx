import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useTranslation } from '@/context/I18nContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, CreditCard, Wallet, ArrowDownLeft, ArrowUpRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function WalletScreen() {
  const { t } = useTranslation();

  const cards = [
    { id: 1, type: 'Visa', last4: '4567', color: ['#4158D0', '#C850C0'], balance: 850.75 },
    { id: 2, type: 'Mastercard', last4: '8901', color: ['#0093E9', '#80D0C7'], balance: 400.25 },
  ];

  const transactions = [
    { id: 1, name: 'Maria Rodriguez', type: 'sent', amount: 250, date: 'May 15, 2023', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80' },
    { id: 2, name: 'Grocery Store', type: 'received', amount: 150, date: 'May 10, 2023', avatar: 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80' },
    { id: 3, name: 'Ana Lopez', type: 'sent', amount: 300, date: 'May 5, 2023', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80' },
    { id: 4, name: 'Salary Deposit', type: 'received', amount: 1200, date: 'May 1, 2023', avatar: 'https://images.unsplash.com/photo-1560472355-536de3962603?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('my_wallet')}</Text>
          <TouchableOpacity style={styles.addButton}>
            <Plus color="#FF6B6B" size={24} />
          </TouchableOpacity>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.cardsContainer}
          contentContainerStyle={styles.cardsContent}
        >
          {cards.map((card, index) => (
            <LinearGradient
              key={card.id}
              colors={card.color}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.card, index === 0 && styles.activeCard]}
            >
              <View style={styles.cardHeader}>
                <CreditCard color="#fff" size={24} />
                <Text style={styles.cardType}>{card.type}</Text>
              </View>
              <Text style={styles.cardNumber}>**** **** **** {card.last4}</Text>
              <View style={styles.cardFooter}>
                <View>
                  <Text style={styles.cardLabel}>{t('balance')}</Text>
                  <Text style={styles.cardBalance}>${card.balance.toFixed(2)}</Text>
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

          <TouchableOpacity style={styles.addCardButton}>
            <View style={styles.addCardIcon}>
              <Plus color="#FF6B6B" size={24} />
            </View>
            <Text style={styles.addCardText}>{t('add_new_card')}</Text>
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <View style={[styles.actionIcon, { backgroundColor: '#FFE0E0' }]}>
              <ArrowUpRight color="#FF6B6B" size={24} />
            </View>
            <Text style={styles.actionText}>{t('send')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <View style={[styles.actionIcon, { backgroundColor: '#E0F7FF' }]}>
              <ArrowDownLeft color="#0093E9" size={24} />
            </View>
            <Text style={styles.actionText}>{t('receive')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <View style={[styles.actionIcon, { backgroundColor: '#E4FFF0' }]}>
              <Wallet color="#00C853" size={24} />
            </View>
            <Text style={styles.actionText}>{t('top_up')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.transactionsContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('transactions')}</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>{t('see_all')}</Text>
            </TouchableOpacity>
          </View>

          {transactions.map((transaction) => (
            <TouchableOpacity key={transaction.id} style={styles.transactionItem}>
              <Image source={{ uri: transaction.avatar }} style={styles.transactionAvatar} />
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionName}>{transaction.name}</Text>
                <Text style={styles.transactionDate}>{transaction.date}</Text>
              </View>
              <Text style={[
                styles.transactionAmount,
                transaction.type === 'sent' ? styles.sentAmount : styles.receivedAmount
              ]}>
                {transaction.type === 'sent' ? '-' : '+'} ${transaction.amount.toFixed(2)}
              </Text>
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
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
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
  cardsContent: {
    paddingLeft: 20,
    paddingRight: 10,
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  cardType: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 10,
  },
  cardNumber: {
    color: '#fff',
    fontSize: 18,
    letterSpacing: 2,
    marginBottom: 30,
  },
  cardFooter: {
    flexDirection: 'row',
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
    flexDirection: 'row',
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
    flexDirection: 'row',
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
    flexDirection: 'row',
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
    marginLeft: 15,
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