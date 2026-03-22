"use client";

import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

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
            className={`text-[10.5px] font-bold uppercase tracking-[0.07em] ${
              isGreen
                ? "text-psar-white/80"
                : explicitDark
                  ? "text-[#7d8590]"
                  : "text-[#6b7280] dark:text-[#7d8590]"
            }`}
          >
            {title}
          </div>
          <div
            className={`text-[10px] mt-0.5 ${
              isGreen
                ? "text-psar-white/60"
                : explicitDark
                  ? "text-[#7d8590]"
                  : "text-[#9ca3af] dark:text-[#7d8590]" // FIXED: Better dark mode contrast
            }`}
          >
            {khmerTitle}
          </div>
        </div>
        {Icon && (
          <div
            className={`w-[34px] h-[34px] rounded-[10px] flex items-center justify-center border transition-colors ${
              isGreen
                ? "bg-psar-white/20 border-transparent"
                : explicitDark
                  ? "bg-psar-white/[0.06] border-psar-white/[0.08]"
                  : "bg-[#f7f8fa] border-[#e8eaed] dark:bg-psar-white/[0.06] dark:border-psar-white/[0.08]"
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
      <div className="flex items-end justify-between">
        <span
          className={`font-bold text-[30px] leading-none ${
            isGreen
              ? "text-psar-white"
              : explicitDark
                ? "text-[#e6edf3]"
                : "text-psar-dark dark:text-[#e6edf3]"
          }`}
        >
          {value}
        </span>
        {trend && (
          <span
            className={`text-[12.5px] font-bold mb-0.5 flex items-center gap-1 ${
              isGreen
                ? "text-psar-white"
                : resolvedPositive
                  ? "text-psar-primary"
                  : "text-[#ef4444] dark:text-red-400"
            }`}
          >
            {trendDirection === "up" && <TrendingUp size={14} />}
            {trendDirection === "down" && <TrendingDown size={14} />}
            {trend}
          </span>
        )}
        {subtext && (
          <span
            className={`text-[12.5px] font-medium mb-0.5 ${
              isGreen
                ? "text-psar-white/80"
                : explicitDark
                  ? "text-[#7d8590]"
                  : "text-[#6b7280] dark:text-[#7d8590]"
            }`}
          >
            {subtext}
          </span>
        )}
      </div>
    </div>
  );
}
