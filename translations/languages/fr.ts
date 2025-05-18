import { Translation } from '../types';

const french: Translation = {
  common: {
    loading: 'Chargement...',
    error: 'Une erreur est survenue',
    retry: 'Réessayer',
    cancel: 'Annuler',
    confirm: 'Confirmer',
    save: 'Enregistrer',
    delete: 'Supprimer',
    edit: 'Modifier',
    done: 'Terminé',
    darkModeDescription: 'Utiliser le thème sombre pour l\'application',
  },
  
  auth: {
    login: 'Connexion',
    register: 'Inscription',
    forgotPassword: 'Mot de passe oublié',
    email: 'Email',
    password: 'Mot de passe',
    confirmPassword: 'Confirmer le mot de passe',
    username: "Nom d'utilisateur",
    loginButton: 'Se connecter',
    registerButton: 'Créer un compte',
    resetPasswordButton: 'Réinitialiser le mot de passe',
  },
  
  profile: {
    title: 'Profil',
    myAccount: 'Mon compte',
    documents: 'Documents',
    securityPreferences: 'Sécurité et préférences',
    notificationSettings: 'Paramètres de notification',
    helpSupport: 'Aide et support',
    about: 'À propos',
    accountNumber: 'Numéro de compte',
    branch: 'Succursale',
    bank: 'Banque',
    darkMode: 'Mode sombre',
    language: 'Langue',
    logout: 'Déconnexion',
  },
  
  account: {
    title: 'Mon compte',
    personalInfo: 'Informations personnelles',
    name: 'Nom',
    email: 'Email',
    phone: 'Téléphone',
    address: 'Adresse',
    dateOfBirth: 'Date de naissance',
    updateInfo: 'Mettre à jour les informations',
  },
  
  documents: {
    title: 'Documents',
    statements: 'Relevés',
    taxForms: 'Formulaires fiscaux',
    receipts: 'Reçus',
    contracts: 'Contrats',
    uploadDocument: 'Télécharger un document',
    noDocuments: 'Aucun document trouvé',
  },
  
  security: {
    title: 'Sécurité et préférences',
    faceID: 'Face ID',
    faceIDDescription: 'Utiliser Face ID pour se connecter et autoriser les transactions',
    changePassword: 'Changer le mot de passe',
    securityQuestions: 'Questions de sécurité',
    preferences: 'Préférences',
  },
  
  notifications: {
    title: 'Paramètres de notification',
    pushNotifications: 'Notifications push',
    emailNotifications: 'Notifications par email',
    smsNotifications: 'Notifications par SMS',
    transactionAlerts: 'Alertes de transaction',
    marketingMessages: 'Messages marketing',
  },
  
  support: {
    title: 'Aide et support',
    faq: 'Foire aux questions',
    contactUs: 'Nous contacter',
    reportIssue: 'Signaler un problème',
    callSupport: 'Appeler le support',
    emailSupport: 'Email au support',
    liveChatSupport: 'Chat en direct',
  },
  
  about: {
    title: 'À propos',
    version: 'Version',
    termsOfService: "Conditions d'utilisation",
    privacyPolicy: 'Politique de confidentialité',
    licenses: 'Licences',
    copyright: 'Copyright © 2025 Remit App. Tous droits réservés.',
  },
};

export default french;
