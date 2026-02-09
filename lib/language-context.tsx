'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language } from './translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// RTL languages
const RTL_LANGUAGES: Language[] = ['ar'];

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    // Load language from localStorage
    const saved = localStorage.getItem('med8d_language') as Language;
    if (saved) {
      setLanguageState(saved);
      setIsRTL(RTL_LANGUAGES.includes(saved));
    } else {
      // Detect browser language
      const browserLang = navigator.language.split('-')[0] as Language;
      const supportedLangs: Language[] = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ar', 'zh', 'ja', 'hi'];
      if (supportedLangs.includes(browserLang)) {
        setLanguageState(browserLang);
        setIsRTL(RTL_LANGUAGES.includes(browserLang));
      }
    }
  }, []);

  // Update document direction when language changes
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
      document.documentElement.lang = language;
    }
  }, [isRTL, language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    setIsRTL(RTL_LANGUAGES.includes(lang));
    localStorage.setItem('med8d_language', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
