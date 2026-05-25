'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations, Language, TranslationKeys } from './translations';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationKeys;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const STORAGE_KEY = 'orangeurl-language';

// Detect browser language
function detectBrowserLanguage(): Language {
  if (typeof window === 'undefined') return 'en';
  
  const browserLang = navigator.language || (navigator as any).userLanguage;
  if (browserLang?.startsWith('de')) return 'de';
  return 'en';
}

// Get stored language or detect from browser
function getInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'en';
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'en' || stored === 'de') return stored;
  
  return detectBrowserLanguage();
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [isHydrated, setIsHydrated] = useState(false);

  // Initialize language on client side
  useEffect(() => {
    setLanguageState(getInitialLanguage());
    setIsHydrated(true);
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
    // Update html lang attribute
    document.documentElement.lang = lang;
  }, []);

  const t = translations[language];

  // Prevent hydration mismatch by using default language until hydrated
  const value: I18nContextType = {
    language: isHydrated ? language : 'en',
    setLanguage,
    t: (isHydrated ? t : translations.en) as TranslationKeys,
  };

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

// Helper hook for just translations
export function useTranslation() {
  const { t, language } = useI18n();
  return { t, language };
}

