// Translation types for the app

// Define all translatable keys in the app
export type TranslationKeys = {
  // Common UI elements
  common: {
    loading: string;
    error: string;
    retry: string;
    cancel: string;
    confirm: string;
    save: string;
    delete: string;
    edit: string;
    done: string;
    darkModeDescription: string;
    selectLanguage: string;
  };
  
  // Auth screens
  auth: {
    login: string;
    register: string;
    forgotPassword: string;
    email: string;
    password: string;
    confirmPassword: string;
    username: string;
    loginButton: string;
    registerButton: string;
    resetPasswordButton: string;
  };
  
  // Profile screen
  profile: {
    title: string;
    myAccount: string;
    documents: string;
    securityPreferences: string;
    notificationSettings: string;
    helpSupport: string;
    about: string;
    accountNumber: string;
    branch: string;
    bank: string;
    darkMode: string;
    language: string;
    logout: string;
  };
  
  // Account screen
  account: {
    title: string;
    personalInfo: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    dateOfBirth: string;
    updateInfo: string;
  };
  
  // Documents screen
  documents: {
    title: string;
    statements: string;
    taxForms: string;
    receipts: string;
    contracts: string;
    uploadDocument: string;
    noDocuments: string;
  };
  
  // Security screen
  security: {
    title: string;
    faceID: string;
    faceIDDescription: string;
    changePassword: string;
    securityQuestions: string;
    preferences: string;
  };
  
  // Notifications screen
  notifications: {
    title: string;
    pushNotifications: string;
    emailNotifications: string;
    smsNotifications: string;
    transactionAlerts: string;
    marketingMessages: string;
  };
  
  // Help & Support screen
  support: {
    title: string;
    faq: string;
    contactUs: string;
    reportIssue: string;
    callSupport: string;
    emailSupport: string;
    liveChatSupport: string;
  };
  
  // About screen
  about: {
    title: string;
    version: string;
    termsOfService: string;
    privacyPolicy: string;
    licenses: string;
    copyright: string;
  };
};

// My Account screen
export type MyAccountTranslation = {
  accountName: string;
  accountNumber: string;
  branch: string;
  bank: string;
  ibanNumber: string;
  swiftCode: string;
  requestAccountClosure: string;
};

// Define the translation type for a complete language
export type Translation = TranslationKeys & {
  myAccount: MyAccountTranslation;
};
