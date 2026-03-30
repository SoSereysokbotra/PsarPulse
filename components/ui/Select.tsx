"use client";

import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Check, LucideIcon } from "lucide-react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  isDark?: boolean;
  icon?: LucideIcon;
}

export function Select({ 
  options, 
  value, 
  onChange, 
  placeholder = "Select...", 
  className = "", 
  isDark = false,
  icon: Icon
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const handleClickOutside = (event: MouseEvent) => {
      // Check if click is outside trigger AND outside portal menu
      if (
        triggerRef.current && !triggerRef.current.contains(event.target as Node) &&
        dropdownRef.current && !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const updateCoords = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom,
        left: rect.left,
        width: rect.width
      });
    }
  };

  useLayoutEffect(() => {
    if (isOpen) {
      updateCoords();
      // Listen to scroll and resize to keep position pinned
      window.addEventListener("scroll", updateCoords, true);
      window.addEventListener("resize", updateCoords);
    }
    return () => {
      window.removeEventListener("scroll", updateCoords, true);
      window.removeEventListener("resize", updateCoords);
    };
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === value);

  const menu = (
    <div 
      ref={dropdownRef}
      className={`fixed rounded-xl border shadow-2xl overflow-hidden z-[9999] animate-in fade-in zoom-in-95 duration-200 mt-2 ${
        isDark 
          ? "bg-[#0d1117] border-white/10" 
          : "bg-white border-slate-200"
      }`}
      style={{
        top: coords.top,
        left: coords.left,
        width: Math.max(coords.width, 200)
      }}
    >
      <div className="p-1.5 max-h-60 overflow-y-auto custom-scrollbar">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => {
              onChange(option.value);
              setIsOpen(false);
            }}
            className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm transition-all group ${
              value === option.value
                ? (isDark ? "bg-emerald-500/10 text-emerald-400 font-semibold" : "bg-emerald-50 text-emerald-700 font-semibold")
                : (isDark ? "text-slate-400 hover:bg-white/5 hover:text-slate-200" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900")
            }`}
          >
            <span className="truncate">{option.label}</span>
            {value === option.value && (
              <Check size={16} className={isDark ? "text-emerald-400" : "text-emerald-600"} />
            )}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className={`relative ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all text-sm font-medium shadow-sm outline-none w-full justify-between sm:w-auto min-w-[140px] group ${
          isDark 
            ? "bg-[#161b22] border-white/10 text-slate-200 hover:bg-white/5 focus:ring-2 focus:ring-emerald-500/50" 
            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 focus:ring-2 focus:ring-emerald-500/30"
        } ${isOpen ? (isDark ? "border-emerald-500/50 ring-2 ring-emerald-500/20" : "border-emerald-500/30 ring-2 ring-emerald-500/10") : ""}`}
      >
        <div className="flex items-center gap-2 truncate">
          {Icon && <Icon size={16} className={isDark ? "text-slate-400 group-hover:text-emerald-400" : "text-slate-400 group-hover:text-emerald-600"} />}
          <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        </div>
        <ChevronDown
          size={14}
          className={`text-slate-400 transition-transform flex-shrink-0 group-hover:text-slate-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && mounted && typeof document !== "undefined" && createPortal(menu, document.body)}
    </div>
  );
}
