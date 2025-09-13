import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { readLS, writeLS } from '../lib/storage';

export type ThemeName = 'rainforest' | 'light' | 'night' | 'dark' | 'ocean';

type ThemeContextValue = {
  theme: ThemeName;
  setTheme: (t: ThemeName) => void;
  accentRgb: string;
  setAccentRgb: (rgb: string) => void;
};

import { create } from 'zustand';

const useThemeStore = create<ThemeContextValue>((set) => ({
  theme: (readLS('settings_theme', 'rainforest') as ThemeName) ?? 'rainforest',
  setTheme: (t) => set(() => { writeLS('settings_theme', t); return { theme: t }; }),
  accentRgb: readLS('settings_accent', '255 213 79'),
  setAccentRgb: (rgb) => set(() => { writeLS('settings_accent', rgb); return { accentRgb: rgb }; }),
}));

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { theme, accentRgb } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-rainforest','theme-light','theme-night','theme-dark','theme-ocean');
    root.classList.add(`theme-${theme}`);
    root.style.setProperty('--accent', accentRgb);
    document.body.classList.add('bg-app');
  }, [theme, accentRgb]);

  if (!mounted) return null;
  return children as any;
}

export const useTheme = () => useThemeStore();

