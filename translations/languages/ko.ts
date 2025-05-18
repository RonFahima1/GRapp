import { Translation } from '../types';

const korean: Translation = {
  common: {
    loading: '로딩 중...',
    error: '오류가 발생했습니다',
    retry: '다시 시도',
    cancel: '취소',
    confirm: '확인',
    save: '저장',
    delete: '삭제',
    edit: '편집',
    done: '완료',
    darkModeDescription: '앱에 어두운 테마 사용',
  },
  
  auth: {
    login: '로그인',
    register: '회원가입',
    forgotPassword: '비밀번호 찾기',
    email: '이메일',
    password: '비밀번호',
    confirmPassword: '비밀번호 확인',
    username: '사용자 이름',
    loginButton: '로그인',
    registerButton: '계정 만들기',
    resetPasswordButton: '비밀번호 재설정',
  },
  
  profile: {
    title: '프로필',
    myAccount: '내 계정',
    documents: '문서',
    securityPreferences: '보안 및 환경설정',
    notificationSettings: '알림 설정',
    helpSupport: '도움말 및 지원',
    about: '정보',
    accountNumber: '계좌번호',
    branch: '지점',
    bank: '은행',
    darkMode: '다크 모드',
    language: '언어',
    logout: '로그아웃',
  },
  
  account: {
    title: '내 계정',
    personalInfo: '개인 정보',
    name: '이름',
    email: '이메일',
    phone: '전화번호',
    address: '주소',
    dateOfBirth: '생년월일',
    updateInfo: '정보 업데이트',
  },
  
  documents: {
    title: '문서',
    statements: '명세서',
    taxForms: '세금 양식',
    receipts: '영수증',
    contracts: '계약서',
    uploadDocument: '문서 업로드',
    noDocuments: '문서를 찾을 수 없습니다',
  },
  
  security: {
    title: '보안 및 환경설정',
    faceID: '페이스 ID',
    faceIDDescription: '로그인 및 거래 승인에 페이스 ID 사용',
    changePassword: '비밀번호 변경',
    securityQuestions: '보안 질문',
    preferences: '환경설정',
  },
  
  notifications: {
    title: '알림 설정',
    pushNotifications: '푸시 알림',
    emailNotifications: '이메일 알림',
    smsNotifications: 'SMS 알림',
    transactionAlerts: '거래 알림',
    marketingMessages: '마케팅 메시지',
  },
  
  support: {
    title: '도움말 및 지원',
    faq: '자주 묻는 질문',
    contactUs: '문의하기',
    reportIssue: '문제 신고',
    callSupport: '전화 지원',
    emailSupport: '이메일 지원',
    liveChatSupport: '실시간 채팅',
  },
  
  about: {
    title: '정보',
    version: '버전',
    termsOfService: '서비스 약관',
    privacyPolicy: '개인정보 처리방침',
    licenses: '라이선스',
    copyright: '저작권 © 2025 Remit App. 모든 권리 보유.',
  },
};

export default korean;
