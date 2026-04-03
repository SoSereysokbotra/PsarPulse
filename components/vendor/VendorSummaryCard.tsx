"use client";

import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";

export interface VendorSummaryCardProps {
  title: string;
  khmerTitle: string;
  value: string | number;
  icon?: React.ElementType;
  trend?: string;
  trendDirection?: "up" | "down";
  isPositive?: boolean;
  subtext?: string;
  highlight?: boolean;
  variant?: "light" | "dark" | "green";
}

export default function VendorSummaryCard({
  title,
  khmerTitle,
  value,
  icon: Icon,
  trend,
  trendDirection,
  isPositive,
  subtext,
  highlight = false,
  variant = "light",
}: VendorSummaryCardProps) {
  const { language } = useLanguage();
  const isKhmer = language === "km";
  // Determine effective style: `highlight` overrides variant to "green"
  const effectiveVariant = highlight ? "green" : variant;
  const isGreen = effectiveVariant === "green";
  const explicitDark = effectiveVariant === "dark";

  // Resolve trend positivity: explicit isPositive > trendDirection > default
  const resolvedPositive =
    isPositive !== undefined
      ? isPositive
      : trendDirection !== undefined
        ? trendDirection === "up"
        : true;

  return (
    <div
      className={`px-[26px] py-6 rounded-[14px] shadow-[0_1px_4px_rgba(0,0,0,0.06)] border flex flex-col justify-between min-h-[130px] transition-colors ${
        isGreen
          ? "bg-psar-primary border-psar-primary"
          : explicitDark
            ? "bg-psar-dark border-psar-white/[0.06]"
            : "bg-psar-white border-[#e8eaed] dark:bg-psar-dark dark:border-psar-white/[0.06]"
      }`}
    >
      {/* Header: title + icon */}
      <div className="flex justify-between items-start mb-5">
        <div>
          <div
            className={`text-[11px] font-bold uppercase tracking-[0.07em] ${
              isGreen
                ? "text-psar-white"
                : explicitDark
                  ? "text-[#abb4be]"
                  : "text-[#374151] dark:text-[#abb4be]"
            }`}
          >
            {isKhmer ? khmerTitle : title}
          </div>
        </div>
        {Icon && (
          <div
            className={`w-[34px] h-[34px] rounded-[10px] flex items-center justify-center border transition-colors ${
              isGreen
                ? "bg-psar-white/20 border-transparent"
                : explicitDark
                  ? "bg-psar-white/[0.06] border-psar-white/[0.08]"
                  : "bg-[#f7f8fa] border-[#d1d5db] dark:bg-psar-white/[0.06] dark:border-psar-white/[0.08]"
            }`}
          >
            <Icon
              size={15}
              className={isGreen ? "text-psar-white" : "text-psar-primary"}
            />
          </div>
        )}
      </div>

      {/* Value + trend */}
      <div className="flex flex-col gap-0.5 mt-auto">
        <span
          className={`font-bold text-[24px] md:text-[28px] leading-tight truncate ${
            isGreen
              ? "text-psar-white"
              : explicitDark
                ? "text-[#ffffff]"
                : "text-[#111827] dark:text-[#ffffff]"
          }`}
          title={typeof value === 'string' ? value : undefined}
        >
          {value}
        </span>
        
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 min-w-0 pt-0.5 pb-0.5">
          {trend && (
            <span
              className={`text-[12px] font-extrabold flex items-center gap-1 shrink-0 ${
                isGreen
                  ? "text-psar-white"
                  : resolvedPositive
                    ? "text-[#059669] dark:text-[#34d399]"
                    : "text-[#dc2626] dark:text-[#f87171]"
              }`}
            >
              {trendDirection === "up" && <TrendingUp size={14} />}
              {trendDirection === "down" && <TrendingDown size={14} />}
              {trend}
            </span>
          )}
          {subtext && (
            <span
              className={`text-[11px] font-bold ${
                isGreen
                  ? "text-psar-white/90"
                  : explicitDark
                    ? "text-[#abb4be]"
                    : "text-[#4b5563] dark:text-[#abb4be]"
              }`}
            >
              {subtext}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
