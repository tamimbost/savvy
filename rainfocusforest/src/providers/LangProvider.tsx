import '../lib/i18n';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { readLS, writeLS } from '../lib/storage';

export function LangProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();
  useEffect(() => {
    const saved = readLS('settings_language', i18n.language || 'en');
    if (saved && saved !== i18n.language) i18n.changeLanguage(saved as any);
  }, [i18n]);

  useEffect(() => {
    const isRtl = i18n.language.startsWith('ar');
    const dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
  }, [i18n.language]);

  return children as any;
}

export function setLanguage(lang: 'en' | 'bn' | 'ar') {
  writeLS('settings_language', lang);
}

