import { Translation } from '../types';

const japanese: Translation = {
  common: {
    loading: '読み込み中...',
    error: 'エラーが発生しました',
    retry: '再試行',
    cancel: 'キャンセル',
    confirm: '確認',
    save: '保存',
    delete: '削除',
    edit: '編集',
    done: '完了',
    darkModeDescription: 'アプリのダークテーマを使用する',
  },
  
  auth: {
    login: 'ログイン',
    register: '登録',
    forgotPassword: 'パスワードをお忘れですか',
    email: 'メールアドレス',
    password: 'パスワード',
    confirmPassword: 'パスワードの確認',
    username: 'ユーザー名',
    loginButton: 'ログイン',
    registerButton: 'アカウント作成',
    resetPasswordButton: 'パスワードをリセット',
  },
  
  profile: {
    title: 'プロフィール',
    myAccount: 'マイアカウント',
    documents: '書類',
    securityPreferences: 'セキュリティと設定',
    notificationSettings: '通知設定',
    helpSupport: 'ヘルプとサポート',
    about: 'アプリについて',
    accountNumber: '口座番号',
    branch: '支店',
    bank: '銀行',
    darkMode: 'ダークモード',
    language: '言語',
    logout: 'ログアウト',
  },
  
  account: {
    title: 'マイアカウント',
    personalInfo: '個人情報',
    name: '名前',
    email: 'メールアドレス',
    phone: '電話番号',
    address: '住所',
    dateOfBirth: '生年月日',
    updateInfo: '情報を更新',
  },
  
  documents: {
    title: '書類',
    statements: '明細書',
    taxForms: '税務書類',
    receipts: '領収書',
    contracts: '契約書',
    uploadDocument: '書類をアップロード',
    noDocuments: '書類が見つかりません',
  },
  
  security: {
    title: 'セキュリティと設定',
    faceID: 'Face ID',
    faceIDDescription: 'ログインと取引の認証にFace IDを使用する',
    changePassword: 'パスワードの変更',
    securityQuestions: 'セキュリティの質問',
    preferences: '設定',
  },
  
  notifications: {
    title: '通知設定',
    pushNotifications: 'プッシュ通知',
    emailNotifications: 'メール通知',
    smsNotifications: 'SMS通知',
    transactionAlerts: '取引アラート',
    marketingMessages: 'マーケティングメッセージ',
  },
  
  support: {
    title: 'ヘルプとサポート',
    faq: 'よくある質問',
    contactUs: 'お問い合わせ',
    reportIssue: '問題を報告',
    callSupport: 'サポートに電話',
    emailSupport: 'メールサポート',
    liveChatSupport: 'ライブチャット',
  },
  
  about: {
    title: 'アプリについて',
    version: 'バージョン',
    termsOfService: '利用規約',
    privacyPolicy: 'プライバシーポリシー',
    licenses: 'ライセンス',
    copyright: 'Copyright © 2025 Remit App. All rights reserved.',
  },
};

export default japanese;
