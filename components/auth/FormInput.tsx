import React from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useTheme } from "@/components/providers/ThemeProvider";

interface FormInputProps extends React.InputHTMLAttributes<
  HTMLInputElement | HTMLTextAreaElement
> {
  label: string;
  khmerLabel?: string;
  icon: React.ElementType;
  multiline?: boolean;
  rows?: number;
  rightLabelElement?: React.ReactNode; // Added this prop
}

export const FormInput = ({
  label,
  khmerLabel,
  icon: Icon,
  id,
  multiline,
  rows,
  className = "",
  rightLabelElement,
  ...props
}: FormInputProps) => {
  const { language } = useLanguage();
  const { resolvedTheme } = useTheme();
  const isKhmer = language === "km";
  const isDark = resolvedTheme === "dark";

  const sharedClasses = `block w-full pl-11 pr-4 py-3 border transition-all duration-200 ${
    isDark
      ? "bg-dark-surface border-dark-border text-white placeholder-slate-500 focus:border-psar-primary focus:ring-psar-primary/20"
      : "bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white hover:border-slate-300 focus:border-psar-primary focus:ring-psar-primary/20"
  } shadow-sm rounded-xl outline-none ${isKhmer ? "font-suwannaphum" : ""} ${
    props.disabled
      ? isDark
        ? "opacity-60 cursor-not-allowed bg-dark-bg"
        : "opacity-70 cursor-not-allowed bg-slate-100"
      : ""
  }`;

  return (
    <div>
      {/* Wrapped label and right element in a flex container */}
      <div className="flex items-center justify-between mb-2">
        <label
          htmlFor={id}
          className={`block text-sm font-bold ${isDark ? "text-[#8A8F98]" : "text-slate-900"} ${isKhmer ? "font-suwannaphum" : ""}`}
        >
          {label}
        </label>

        {/* Render the right element if it exists */}
        {rightLabelElement && (
          <div className={isKhmer ? "font-suwannaphum" : ""}>
            {rightLabelElement}
          </div>
        )}
      </div>

      <div className="relative group">
        <div
          className={`absolute left-0 pl-4 flex items-center pointer-events-none ${multiline ? "top-4" : "inset-y-0"}`}
        >
          <Icon className={`h-5 w-5 ${isDark ? "text-slate-500" : "text-slate-400"} group-focus-within:text-psar-primary transition-colors duration-200`} />
        </div>
        {multiline ? (
          <textarea
            id={id}
            rows={rows}
            className={sharedClasses}
            {...(props as any)}
          />
        ) : (
          <input id={id} className={sharedClasses} {...(props as any)} />
        )}
      </div>
    </div>
  );
};
