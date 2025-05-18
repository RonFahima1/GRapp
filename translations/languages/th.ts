import { Translation } from '../types';

const thai: Translation = {
  common: {
    loading: 'กำลังโหลด...',
    error: 'เกิดข้อผิดพลาด',
    retry: 'ลองอีกครั้ง',
    cancel: 'ยกเลิก',
    confirm: 'ยืนยัน',
    save: 'บันทึก',
    delete: 'ลบ',
    edit: 'แก้ไข',
    done: 'เสร็จสิ้น',
    darkModeDescription: 'ใช้ธีมมืดสำหรับแอป',
  },
  
  auth: {
    login: 'เข้าสู่ระบบ',
    register: 'ลงทะเบียน',
    forgotPassword: 'ลืมรหัสผ่าน',
    email: 'อีเมล',
    password: 'รหัสผ่าน',
    confirmPassword: 'ยืนยันรหัสผ่าน',
    username: 'ชื่อผู้ใช้',
    loginButton: 'เข้าสู่ระบบ',
    registerButton: 'สร้างบัญชี',
    resetPasswordButton: 'รีเซ็ตรหัสผ่าน',
  },
  
  profile: {
    title: 'โปรไฟล์',
    myAccount: 'บัญชีของฉัน',
    documents: 'เอกสาร',
    securityPreferences: 'ความปลอดภัยและการตั้งค่า',
    notificationSettings: 'การตั้งค่าการแจ้งเตือน',
    helpSupport: 'ช่วยเหลือและสนับสนุน',
    about: 'เกี่ยวกับ',
    accountNumber: 'หมายเลขบัญชี',
    branch: 'สาขา',
    bank: 'ธนาคาร',
    darkMode: 'โหมดมืด',
    language: 'ภาษา',
    logout: 'ออกจากระบบ',
  },
  
  account: {
    title: 'บัญชีของฉัน',
    personalInfo: 'ข้อมูลส่วนตัว',
    name: 'ชื่อ',
    email: 'อีเมล',
    phone: 'โทรศัพท์',
    address: 'ที่อยู่',
    dateOfBirth: 'วันเกิด',
    updateInfo: 'อัปเดตข้อมูล',
  },
  
  documents: {
    title: 'เอกสาร',
    statements: 'รายการเดินบัญชี',
    taxForms: 'แบบฟอร์มภาษี',
    receipts: 'ใบเสร็จ',
    contracts: 'สัญญา',
    uploadDocument: 'อัปโหลดเอกสาร',
    noDocuments: 'ไม่พบเอกสาร',
  },
  
  security: {
    title: 'ความปลอดภัยและการตั้งค่า',
    faceID: 'Face ID',
    faceIDDescription: 'ใช้ Face ID เพื่อเข้าสู่ระบบและอนุมัติธุรกรรม',
    changePassword: 'เปลี่ยนรหัสผ่าน',
    securityQuestions: 'คำถามความปลอดภัย',
    preferences: 'การตั้งค่า',
  },
  
  notifications: {
    title: 'การตั้งค่าการแจ้งเตือน',
    pushNotifications: 'การแจ้งเตือนแบบพุช',
    emailNotifications: 'การแจ้งเตือนทางอีเมล',
    smsNotifications: 'การแจ้งเตือนทาง SMS',
    transactionAlerts: 'การแจ้งเตือนธุรกรรม',
    marketingMessages: 'ข้อความทางการตลาด',
  },
  
  support: {
    title: 'ช่วยเหลือและสนับสนุน',
    faq: 'คำถามที่พบบ่อย',
    contactUs: 'ติดต่อเรา',
    reportIssue: 'รายงานปัญหา',
    callSupport: 'โทรหาฝ่ายสนับสนุน',
    emailSupport: 'อีเมลฝ่ายสนับสนุน',
    liveChatSupport: 'แชทสด',
  },
  
  about: {
    title: 'เกี่ยวกับ',
    version: 'เวอร์ชัน',
    termsOfService: 'ข้อกำหนดการให้บริการ',
    privacyPolicy: 'นโยบายความเป็นส่วนตัว',
    licenses: 'ใบอนุญาต',
    copyright: 'ลิขสิทธิ์ © 2025 Remit App. สงวนลิขสิทธิ์ทั้งหมด',
  },
};

export default thai;
