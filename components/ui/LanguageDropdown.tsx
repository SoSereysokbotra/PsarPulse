"use client";

import { useLanguage } from "@/components/providers/LanguageProvider";
import { ChevronDown, Globe, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const languages = [
  { code: "en", name: "English (United States)", shortName: "English" },
  { code: "km", name: "Khmer (Cambodia)", shortName: "ភាសាខ្មែរ" },
];

export function LanguageDropdown({ variant = "light" }: { variant?: "light" | "dark" | "transparent" }) {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLang = languages.find((l) => l.code === language) || languages[0];

  const triggerClasses = variant === "transparent"
    ? "hover:bg-slate-800 text-slate-300 border-transparent shadow-none"
    : variant === "dark"
    ? "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
    : "border border-slate-200 bg-white hover:bg-slate-50 text-slate-700";

  const dropdownClasses = variant === "dark" || variant === "transparent"
    ? "bg-slate-800 border-slate-700"
    : "bg-white border-slate-200";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors text-sm font-medium shadow-sm outline-none focus:ring-2 focus:ring-violet-500 ${triggerClasses}`}
      >
        <Globe size={16} className={variant === "light" ? "text-slate-400" : "text-slate-400"} />
        <span className="hidden sm:inline-block">{currentLang.shortName}</span>
        <ChevronDown
          size={14}
          className={`transition-transform ${isOpen ? "rotate-180" : ""} ${variant === "light" ? "text-slate-400" : "text-slate-400"}`}
        />
      </button>

      {isOpen && (
        <div className={`absolute right-0 mt-2 w-56 rounded-xl border shadow-lg overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 ${dropdownClasses}`}>
          <div className="p-1.5 space-y-0.5">
            {languages.map((lang) => {
              const isActive = language === lang.code;
              let itemClass = "";
              if (variant === "dark" || variant === "transparent") {
                itemClass = isActive 
                  ? "bg-violet-500/10 text-violet-400" 
                  : "text-slate-300 hover:bg-slate-700 hover:text-white";
              } else {
                itemClass = isActive
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900";
              }

              return (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code as "en" | "km");
                    setIsOpen(false);
                  }}
                  className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm transition-colors ${itemClass}`}
                >
                  <div className="flex flex-col items-start">
                    <span className="font-semibold">{lang.name}</span>
                  </div>
                  {isActive && <Check size={16} className={variant === "dark" || variant === "transparent" ? "text-violet-400" : "text-emerald-600"} />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
