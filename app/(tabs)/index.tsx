import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useTranslation } from '@/context/I18nContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowUpRight, TrendingUp, Bell, Search } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  const { t } = useTranslation();

  const recentTransactions = [
    { id: 1, name: 'Maria Rodriguez', amount: 250, currency: 'USD', date: '2023-05-15', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80' },
    { id: 2, name: 'Juan Perez', amount: 150, currency: 'USD', date: '2023-05-10', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80' },
    { id: 3, name: 'Ana Lopez', amount: 300, currency: 'USD', date: '2023-05-05', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80' },
  ];

  const countries = [
    { id: 1, name: 'Mexico', flag: '🇲🇽', rate: '17.50 MXN = 1 USD' },
    { id: 2, name: 'Philippines', flag: '🇵🇭', rate: '56.20 PHP = 1 USD' },
    { id: 3, name: 'India', flag: '🇮🇳', rate: '83.15 INR = 1 USD' },
    { id: 4, name: 'Colombia', flag: '🇨🇴', rate: '3,950 COP = 1 USD' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{t('hello')}, Alex! 👋</Text>
            <Text style={styles.subGreeting}>{t('welcome_back')}</Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton}>
              <Search color="#333" size={24} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Bell color="#333" size={24} />
            </TouchableOpacity>
          </View>
        </View>

        <LinearGradient
          colors={['#FF6B6B', '#FF8E53']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.balanceCard}>
          <View style={styles.balanceCardContent}>
            <Text style={styles.balanceLabel}>{t('total_balance')}</Text>
            <Text style={styles.balanceAmount}>$1,250.00</Text>
            <View style={styles.balanceChange}>
              <TrendingUp color="#fff" size={16} />
              <Text style={styles.balanceChangeText}>+2.5% {t('this_week')}</Text>
            </View>
          </View>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80' }}
            style={styles.balanceCardImage}
          />
        </LinearGradient>

        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <View style={[styles.actionIcon, { backgroundColor: '#FFE0E0' }]}>
              <ArrowUpRight color="#FF6B6B" size={24} />
            </View>
            <Text style={styles.actionText}>{t('send_money')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <View style={[styles.actionIcon, { backgroundColor: '#E0F7FF' }]}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1589758438368-0ad531db3366?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80' }}
                style={styles.actionIconImage}
              />
            </View>
            <Text style={styles.actionText}>{t('request')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <View style={[styles.actionIcon, { backgroundColor: '#E4FFF0' }]}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1533421644343-45b606745fb1?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80' }}
                style={styles.actionIconImage}
              />
            </View>
            <Text style={styles.actionText}>{t('top_up')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('recent_transactions')}</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>{t('see_all')}</Text>
            </TouchableOpacity>
          </View>

          {recentTransactions.map((transaction) => (
            <TouchableOpacity key={transaction.id} style={styles.transactionItem}>
              <Image source={{ uri: transaction.avatar }} style={styles.transactionAvatar} />
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionName}>{transaction.name}</Text>
                <Text style={styles.transactionDate}>{transaction.date}</Text>
              </View>
              <Text style={styles.transactionAmount}>
                ${transaction.amount.toFixed(2)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('exchange_rates')}</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>{t('see_all')}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.ratesContainer}>
            {countries.map((country) => (
              <TouchableOpacity key={country.id} style={styles.rateItem}>
                <Text style={styles.rateFlag}>{country.flag}</Text>
                <View style={styles.rateInfo}>
                  <Text style={styles.rateCountry}>{country.name}</Text>
                  <Text style={styles.rateValue}>{country.rate}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
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
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  subGreeting: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  balanceCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 5,
  },
  balanceCardContent: {
    flex: 1,
  },
  balanceLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  balanceChange: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  balanceChangeText: {
    color: '#fff',
    marginLeft: 5,
    fontSize: 12,
    fontWeight: '600',
  },
  balanceCardImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 25,
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
  actionIconImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  sectionContainer: {
    marginTop: 30,
    paddingHorizontal: 20,
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
    color: '#333',
  },
  ratesContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  rateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  rateFlag: {
    fontSize: 24,
    marginRight: 15,
  },
  rateInfo: {
    flex: 1,
  },
  rateCountry: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  rateValue: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
});