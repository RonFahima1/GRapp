/**
 * App route constants 
 * Use these constants for navigation to ensure consistency across the app
 */

export const ROUTES = {
  // Tab Routes
  HOME: '/(tabs)',
  PROFILE: '/(tabs)/profile',
  
  // Modal Routes - use these consistent formats for all modal navigation
  MY_ACCOUNT: '/my-account-modal',
  DOCUMENTS: '/documents-modal',
  SECURITY_SETTINGS: '/security-settings-modal',
  NOTIFICATIONS: '/notifications-settings',
  HELP_SUPPORT: '/help-support',
  ABOUT: '/about',
  
  // Modal sub-routes
  CHANGE_PASSWORD: '/(modals)/change-password',
  SECURITY_QUESTIONS: '/(modals)/security-questions',
  EDIT_EMAIL: '/(modals)/edit-email',
  EDIT_PHONE: '/(modals)/edit-phone',
  EDIT_HOME_ADDRESS: '/(modals)/edit-home-address',
  EDIT_MAILING_ADDRESS: '/(modals)/edit-mailing-address',
  
  // About routes
  ABOUT_FEATURES: '/(modals)/about-features',
  ABOUT_LEGAL: '/(modals)/about-legal',
  ABOUT_PRIVACY: '/(modals)/about-privacy',
  
  // Help & Support routes
  FAQ: '/(modals)/faq',
  SUPPORT_CHAT: '/(modals)/support-chat',
  CALL_SUPPORT: '/(modals)/call-support',
};
