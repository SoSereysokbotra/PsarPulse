"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import en from "@/locales/en.json";
import km from "@/locales/kh.json";

type Language = "en" | "km";
const locales = { en, km };

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (
    keyPath: string,
    replacements?: Record<string, string | number>,
  ) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

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

  const setLanguage = useCallback(
    (lang: Language) => {
      localStorage.setItem(storageKey, lang);
      setLanguageState(lang);
    },
    [storageKey],
  );

  const t = useCallback(
    (
      keyPath: string,
      replacements?: Record<string, string | number>,
    ): string => {
      const keys = keyPath.split(".");
      let current: any = locales[language];

      for (const key of keys) {
        if (!current || current[key] === undefined) return keyPath;
        current = current[key];
      }

      let result = current as string;
      if (replacements) {
        Object.entries(replacements).forEach(([key, value]) => {
          result = result.replace(new RegExp(`{{${key}}}`, "g"), String(value));
        });
      }

      return result;
    },
    [language],
  );

  const value = useMemo(
    () => ({ language, setLanguage, t }),
    [language, setLanguage, t],
  );

  return (
    <LanguageContext.Provider value={value}>
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
