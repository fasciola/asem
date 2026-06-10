import { useState, useEffect, useCallback } from 'react';
import type { Language } from '../config';

const STORAGE_KEY = 'asem-vision-language';

export function useLanguage() {
  const [lang, setLang] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'ar' || stored === 'en') return stored;
    }
    return 'en';
  });

  const [isRTL, setIsRTL] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored === 'ar';
    }
    return false;
  });

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    if (lang === 'ar') {
      html.setAttribute('dir', 'rtl');
      html.setAttribute('lang', 'ar');
      body.classList.add('rtl');
      setIsRTL(true);
    } else {
      html.setAttribute('dir', 'ltr');
      html.setAttribute('lang', 'en');
      body.classList.remove('rtl');
      setIsRTL(false);
    }

    localStorage.setItem(STORAGE_KEY, lang);
  }, [lang]);

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === 'en' ? 'ar' : 'en'));
  }, []);

  const t = useCallback(
    (en: string, ar: string) => {
      return lang === 'ar' ? ar : en;
    },
    [lang]
  );

  return { lang, isRTL, toggleLang, t };
}

export type UseLanguageReturn = ReturnType<typeof useLanguage>;
