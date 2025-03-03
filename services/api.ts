import { PayoutType } from '@/types';

// Simulated API responses
// In a real app, these would be actual API calls

/**
 * Get available payout types for a specific country
 * @param countryCode ISO country code
 * @returns Array of payout types
 */
export const getPayoutTypes = async (countryCode: string): Promise<PayoutType[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock data based on country code
  const payoutTypes: Record<string, PayoutType[]> = {
    'MX': [
      { 
        id: 1, 
        name: 'Bank Deposit', 
        fee: 3.99, 
        deliveryTime: '1-2 business days', 
        discount: 10,
        minAmount: 10,
        maxAmount: 2000,
        requiresId: false,
        fields: ['accountNumber', 'bankName']
      },
      { 
        id: 2, 
        name: 'Cash Pickup', 
        fee: 4.99, 
        deliveryTime: 'Minutes', 
        discount: 0,
        minAmount: 10,
        maxAmount: 1000,
        requiresId: true,
        fields: ['fullName', 'idNumber']
      },
      { 
        id: 3, 
        name: 'Mobile Wallet', 
        fee: 2.99, 
        deliveryTime: 'Instant', 
        discount: 15,
        minAmount: 5,
        maxAmount: 500,
        requiresId: false,
        fields: ['phoneNumber']
      }
    ],
    'PH': [
      { 
        id: 1, 
        name: 'Bank Deposit', 
        fee: 4.99, 
        deliveryTime: '1-2 business days', 
        discount: 0,
        minAmount: 10,
        maxAmount: 2000,
        requiresId: false,
        fields: ['accountNumber', 'bankName']
      },
      { 
        id: 2, 
        name: 'Cash Pickup', 
        fee: 5.99, 
        deliveryTime: 'Same day', 
        discount: 5,
        minAmount: 10,
        maxAmount: 1000,
        requiresId: true,
        fields: ['fullName', 'idNumber']
      },
      { 
        id: 3, 
        name: 'GCash', 
        fee: 2.99, 
        deliveryTime: 'Instant', 
        discount: 20,
        minAmount: 5,
        maxAmount: 500,
        requiresId: false,
        fields: ['phoneNumber']
      }
    ],
    'IN': [
      { 
        id: 1, 
        name: 'Bank Deposit', 
        fee: 3.49, 
        deliveryTime: '1-2 business days', 
        discount: 5,
        minAmount: 10,
        maxAmount: 2000,
        requiresId: false,
        fields: ['accountNumber', 'ifscCode']
      },
      { 
        id: 2, 
        name: 'UPI Transfer', 
        fee: 1.99, 
        deliveryTime: 'Instant', 
        discount: 15,
        minAmount: 5,
        maxAmount: 1000,
        requiresId: false,
        fields: ['upiId']
      }
    ],
    'CO': [
      { 
        id: 1, 
        name: 'Bank Deposit', 
        fee: 4.49, 
        deliveryTime: '1-2 business days', 
        discount: 0,
        minAmount: 10,
        maxAmount: 2000,
        requiresId: false,
        fields: ['accountNumber', 'bankName']
      },
      { 
        id: 2, 
        name: 'Cash Pickup', 
        fee: 5.99, 
        deliveryTime: 'Same day', 
        discount: 10,
        minAmount: 10,
        maxAmount: 1000,
        requiresId: true,
        fields: ['fullName', 'idNumber']
      }
    ]
  };
  
  return payoutTypes[countryCode] || [];
};

/**
 * Get exchange rate between two currencies
 * @param fromCurrency Source currency code
 * @param toCurrency Target currency code
 * @returns Exchange rate information
 */
export const getExchangeRates = async (fromCurrency: string, toCurrency: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock exchange rates
  const rates: Record<string, number> = {
    'MXN': 17.50,
    'PHP': 56.20,
    'INR': 83.15,
    'COP': 3950,
  };
  
  return {
    fromCurrency,
    toCurrency,
    rate: rates[toCurrency] || 1,
    timestamp: new Date().toISOString()
  };
};

/**
 * Get available promotions and campaigns
 * @returns Array of promotions
 */
export const getPromotions = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return [
    {
      id: 1,
      title: 'First Transfer Free',
      description: 'No fee on your first transfer',
      code: 'WELCOME',
      discount: 100, // percentage
      maxDiscount: 10, // dollar amount
      expiryDate: '2023-12-31'
    },
    {
      id: 2,
      title: 'Summer Special',
      description: '20% off fees for transfers to Mexico',
      code: 'SUMMER20',
      discount: 20,
      maxDiscount: 20,
      expiryDate: '2023-08-31',
      countries: ['MX']
    },
    {
      id: 3,
      title: 'Family Discount',
      description: '15% off fees for all transfers',
      code: 'FAMILY15',
      discount: 15,
      maxDiscount: 15,
      expiryDate: '2023-10-31'
    }
  ];
};

/**
 * Send money transfer
 * @param transferData Transfer details
 * @returns Transfer confirmation
 */
export const sendTransfer = async (transferData: any) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock response
  return {
    success: true,
    transferId: 'TRF' + Math.floor(Math.random() * 1000000),
    timestamp: new Date().toISOString(),
    estimatedDelivery: new Date(Date.now() + 86400000).toISOString(), // 24 hours from now
    status: 'processing'
  };
};