import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import enTranslations from '@/data/i18n/en.json';
import localeConfig from '@/data/locale.config.json';
import fxCache from '@/data/fx.cache.json';

type Translations = typeof enTranslations;
type LocaleCode = 'en' | 'es' | 'fr' | 'de' | 'ar' | 'hi' | 'pt';
type CurrencyCode = keyof typeof fxCache.rates;

interface LocaleContextType {
  locale: LocaleCode;
  setLocale: (locale: LocaleCode) => void;
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  t: Translations;
  isRtl: boolean;
  formatPrice: (usdPrice: number) => string;
  formatNumber: (num: number) => string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

const translationsCache: Partial<Record<LocaleCode, Translations>> = {
  en: enTranslations,
};

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<LocaleCode>('en');
  const [currency, setCurrencyState] = useState<CurrencyCode>('USD');
  const [translations, setTranslations] = useState<Translations>(enTranslations);

  const localeInfo = localeConfig.supportedLocales.find(l => l.code === locale);
  const isRtl = localeInfo?.rtl ?? false;

  useEffect(() => {
    // Detect browser locale
    const browserLocale = navigator.language.split('-')[0] as LocaleCode;
    const savedLocale = localStorage.getItem('locale') as LocaleCode;
    const savedCurrency = localStorage.getItem('currency') as CurrencyCode;

    if (savedLocale && localeConfig.supportedLocales.some(l => l.code === savedLocale)) {
      setLocaleState(savedLocale);
    } else if (localeConfig.supportedLocales.some(l => l.code === browserLocale)) {
      setLocaleState(browserLocale);
    }

    if (savedCurrency && fxCache.rates[savedCurrency]) {
      setCurrencyState(savedCurrency);
    } else if (localeInfo?.currency) {
      setCurrencyState(localeInfo.currency as CurrencyCode);
    }
  }, []);

  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = locale;
  }, [locale, isRtl]);

  const setLocale = (newLocale: LocaleCode) => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
    
    const newLocaleInfo = localeConfig.supportedLocales.find(l => l.code === newLocale);
    if (newLocaleInfo?.currency) {
      setCurrency(newLocaleInfo.currency as CurrencyCode);
    }
  };

  const setCurrency = (newCurrency: CurrencyCode) => {
    setCurrencyState(newCurrency);
    localStorage.setItem('currency', newCurrency);
  };

  const formatPrice = (usdPrice: number): string => {
    const rate = fxCache.rates[currency] || 1;
    const convertedPrice = usdPrice * rate;
    
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(convertedPrice);
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat(locale).format(num);
  };

  return (
    <LocaleContext.Provider
      value={{
        locale,
        setLocale,
        currency,
        setCurrency,
        t: translations,
        isRtl,
        formatPrice,
        formatNumber,
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}
