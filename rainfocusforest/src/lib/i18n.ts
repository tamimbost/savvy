import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      appName: 'RainFocusForest',
      login: {
        title: 'Welcome back',
        email: 'Email',
        password: 'Password',
        submit: 'Sign in',
        error: 'Invalid credentials',
      },
      nav: {
        dashboard: 'Dashboard',
        tasks: 'Task Manager',
        prayer: 'Prayer',
        media: 'Media Player',
        reports: 'Reports',
        habit: 'Regular Habit',
        timer: 'Timer',
        profile: 'Profile',
        settings: 'Settings',
        notifications: 'Notifications',
      },
    },
  },
  bn: {
    translation: {
      appName: 'রেইনফোকাসফরেস্ট',
      login: {
        title: 'ফিরে আসার জন্য ধন্যবাদ',
        email: 'ইমেইল',
        password: 'পাসওয়ার্ড',
        submit: 'সাইন ইন',
        error: 'ভুল তথ্য',
      },
      nav: {
        dashboard: 'ড্যাশবোর্ড',
        tasks: 'টাস্ক ম্যানেজার',
        prayer: 'নামাজ',
        media: 'মিডিয়া প্লেয়ার',
        reports: 'রিপোর্টস',
        habit: 'নিয়মিত অভ্যাস',
        timer: 'টাইমার',
        profile: 'প্রোফাইল',
        settings: 'সেটিংস',
        notifications: 'নোটিফিকেশন',
      },
    },
  },
  ar: {
    translation: {
      appName: 'غابة التركيز',
      login: {
        title: 'مرحبا بعودتك',
        email: 'البريد الإلكتروني',
        password: 'كلمة المرور',
        submit: 'تسجيل الدخول',
        error: 'بيانات غير صحيحة',
      },
      nav: {
        dashboard: 'لوحة التحكم',
        tasks: 'المهام',
        prayer: 'الصلاة',
        media: 'الوسائط',
        reports: 'التقارير',
        habit: 'العادة',
        timer: 'المنبه',
        profile: 'الملف الشخصي',
        settings: 'الإعدادات',
        notifications: 'الإشعارات',
      },
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;

