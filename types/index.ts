// Country type definition
export interface Country {
  id: number;
  name: string;
  code: string;
  flag: string;
  currency: string;
}

// Recipient type definition
export interface Recipient {
  id: number;
  name: string;
  phone: string;
  email: string;
  accountNumber: string;
  country: Country;
  avatar: string;
  recent?: boolean;
}

// Payout type definition
export interface PayoutType {
  id: number;
  name: string;
  fee: number;
  deliveryTime: string;
  discount: number;
  minAmount: number;
  maxAmount: number;
  requiresId: boolean;
  fields: string[];
}

// Transfer type definition
export interface Transfer {
  id: string;
  senderId: number;
  recipientId: number;
  amount: number;
  fee: number;
  exchangeRate: number;
  fromCurrency: string;
  toCurrency: string;
  payoutTypeId: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
}

// Promotion type definition
export interface Promotion {
  id: number;
  title: string;
  description: string;
  code: string;
  discount: number;
  maxDiscount: number;
  expiryDate: string;
  countries?: string[];
}