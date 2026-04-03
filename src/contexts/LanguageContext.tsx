import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'mm';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (en: string, mm?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('app-language');
    return (saved as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('app-language', language);
    document.documentElement.lang = language;
  }, [language]);

  const t = (en: string, mm?: string) => {
    if (language === 'mm' && mm) return mm;
    return en;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
