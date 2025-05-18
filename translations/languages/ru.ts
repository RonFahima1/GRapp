import { Translation } from '../types';

const russian: Translation = {
  common: {
    loading: 'Загрузка...',
    error: 'Произошла ошибка',
    retry: 'Повторить',
    cancel: 'Отмена',
    confirm: 'Подтвердить',
    save: 'Сохранить',
    delete: 'Удалить',
    edit: 'Редактировать',
    done: 'Готово',
    darkModeDescription: 'Использовать темную тему для приложения',
    selectLanguage: 'Выбрать язык',
  },
  
  auth: {
    login: 'Вход',
    register: 'Регистрация',
    forgotPassword: 'Забыли пароль',
    email: 'Электронная почта',
    password: 'Пароль',
    confirmPassword: 'Подтвердите пароль',
    username: 'Имя пользователя',
    loginButton: 'Войти',
    registerButton: 'Создать аккаунт',
    resetPasswordButton: 'Сбросить пароль',
  },
  
  profile: {
    title: 'Профиль',
    myAccount: 'Мой аккаунт',
    documents: 'Документы',
    securityPreferences: 'Безопасность и настройки',
    notificationSettings: 'Настройки уведомлений',
    helpSupport: 'Помощь и поддержка',
    about: 'О приложении',
    accountNumber: 'Номер счета',
    branch: 'Филиал',
    bank: 'Банк',
    darkMode: 'Темный режим',
    language: 'Язык',
    logout: 'Выйти',
  },
  
  account: {
    title: 'Мой аккаунт',
    personalInfo: 'Личная информация',
    name: 'Имя',
    email: 'Электронная почта',
    phone: 'Телефон',
    address: 'Адрес',
    dateOfBirth: 'Дата рождения',
    updateInfo: 'Обновить информацию',
  },
  
  documents: {
    title: 'Документы',
    statements: 'Выписки',
    taxForms: 'Налоговые формы',
    receipts: 'Квитанции',
    contracts: 'Контракты',
    uploadDocument: 'Загрузить документ',
    noDocuments: 'Документы не найдены',
  },
  
  security: {
    title: 'Безопасность и настройки',
    faceID: 'Face ID',
    faceIDDescription: 'Использовать Face ID для входа и авторизации транзакций',
    changePassword: 'Изменить пароль',
    securityQuestions: 'Вопросы безопасности',
    preferences: 'Настройки',
  },
  
  notifications: {
    title: 'Настройки уведомлений',
    pushNotifications: 'Push-уведомления',
    emailNotifications: 'Уведомления по электронной почте',
    smsNotifications: 'SMS-уведомления',
    transactionAlerts: 'Оповещения о транзакциях',
    marketingMessages: 'Маркетинговые сообщения',
  },
  
  support: {
    title: 'Помощь и поддержка',
    faq: 'Часто задаваемые вопросы',
    contactUs: 'Связаться с нами',
    reportIssue: 'Сообщить о проблеме',
    callSupport: 'Позвонить в поддержку',
    emailSupport: 'Написать в поддержку',
    liveChatSupport: 'Живой чат',
  },
  
  about: {
    title: 'О приложении',
    version: 'Версия',
    termsOfService: 'Условия использования',
    privacyPolicy: 'Политика конфиденциальности',
    licenses: 'Лицензии',
    copyright: 'Авторские права © 2025 Remit App. Все права защищены.',
  },
  
  myAccount: {
    accountName: 'Счет на имя',
    accountNumber: 'Номер счета',
    branch: 'Отделение',
    bank: 'Банк',
    ibanNumber: 'Номер IBAN',
    swiftCode: 'Код SWIFT',
    requestAccountClosure: 'Запросить закрытие счета',
  },
};

export default russian;
