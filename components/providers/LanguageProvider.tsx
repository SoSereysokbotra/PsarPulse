"use client";

import { createContext, useContext, useEffect, useState } from "react";
import en from "@/locales/en.json";
import km from "@/locales/kh.json";

type Language = "en" | "km";
const locales = { en, km };

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (keyPath: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({
  children,
  defaultLanguage = "en",
  storageKey = "psarpulse-lang",
}: {
  children: React.ReactNode;
  defaultLanguage?: Language;
  storageKey?: string;
}) {
  const [language, setLanguageState] = useState<Language>(defaultLanguage);

  useEffect(() => {
    const savedLang = localStorage.getItem(storageKey) as Language | null;
    if (savedLang) {
      setLanguageState(savedLang);
    }
  }, [storageKey]);

  const setLanguage = (lang: Language) => {
    localStorage.setItem(storageKey, lang);
    setLanguageState(lang);
  };

  const t = (keyPath: string): string => {
    const keys = keyPath.split(".");
    let current: any = locales[language];

    for (const key of keys) {
      if (current[key] === undefined) return keyPath;
      current = current[key];
    }

    return current as string;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
