import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Animated } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CheckCircle, ArrowRight } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

export default function SuccessScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const params = useLocalSearchParams();
  
  const { 
    recipientName, 
    amount, 
    currency, 
    transactionId
  } = params;
  
  // Animation values
  const checkmarkScale = new Animated.Value(0);
  const fadeIn = new Animated.Value(0);
  
  useEffect(() => {
    // Animate the checkmark and content
    Animated.sequence([
      Animated.timing(checkmarkScale, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  
  const handleDone = () => {
    // Navigate back to the home screen
    router.push('/(tabs)');
  };
  
  const handleViewReceipt = () => {
    // In a real app, this would navigate to a receipt screen
    // For this demo, we'll just go back to the home screen
    router.push('/(tabs)');
  };
  
  const getCurrencySymbol = (currencyCode: string): string => {
    const currencySymbols: Record<string, string> = {
      'USD': '$',
      'EUR': '€',
      'GBP': '£'
    };
    return currencySymbols[currencyCode] || '$';
  };
  
  // Format the current date
  const formattedDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.successIconContainer}>
          <Animated.View style={[
            styles.checkmarkCircle,
            { transform: [{ scale: checkmarkScale }] }
          ]}>
            <CheckCircle color="#FFFFFF" size={40} />
          </Animated.View>
        </View>
        
        <Animated.View style={[
          styles.successTextContainer,
          { opacity: fadeIn }
        ]}>
          <Text style={styles.successTitle}>{t('Transfer Successful!')}</Text>
          <Text style={styles.successDescription}>
            {t('Your money has been sent successfully to {{name}}', { name: recipientName })}
          </Text>
        </Animated.View>
        
        <Animated.View style={[
          styles.transferDetailsContainer,
          { opacity: fadeIn }
        ]}>
          <View style={styles.transferDetail}>
            <Text style={styles.transferDetailLabel}>{t('Amount')}</Text>
            <Text style={styles.transferDetailValue}>
              {getCurrencySymbol(String(currency))}{parseFloat(String(amount)).toFixed(2)} {String(currency)}
            </Text>
          </View>
          
          <View style={styles.transferDetail}>
            <Text style={styles.transferDetailLabel}>{t('Recipient')}</Text>
            <Text style={styles.transferDetailValue}>{String(recipientName)}</Text>
          </View>
          
          <View style={styles.transferDetail}>
            <Text style={styles.transferDetailLabel}>{t('Date & Time')}</Text>
            <Text style={styles.transferDetailValue}>{formattedDate}</Text>
          </View>
          
          <View style={styles.transferDetail}>
            <Text style={styles.transferDetailLabel}>{t('Transaction ID')}</Text>
            <Text style={styles.transferDetailValue}>{transactionId}</Text>
          </View>
        </Animated.View>
        
        <Animated.View style={[
          styles.actionsContainer,
          { opacity: fadeIn }
        ]}>
          <TouchableOpacity 
            style={styles.viewReceiptButton}
            onPress={handleViewReceipt}
          >
            <Text style={styles.viewReceiptButtonText}>{t('View Receipt')}</Text>
            <ArrowRight color="#007AFF" size={16} />
          </TouchableOpacity>
        </Animated.View>
      </View>
      
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.doneButton}
          onPress={handleDone}
        >
          <Text style={styles.doneButtonText}>{t('Done')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  content: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  successIconContainer: {
    marginTop: 40,
    marginBottom: 24,
    alignItems: 'center',
  },
  checkmarkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#34C759',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTextContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
  },
  successDescription: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  transferDetailsContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  transferDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  transferDetailLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  transferDetailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  actionsContainer: {
    width: '100%',
  },
  viewReceiptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
  },
  viewReceiptButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginRight: 8,
  },
  footer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  doneButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
