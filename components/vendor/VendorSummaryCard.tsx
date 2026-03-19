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
  const isDark = effectiveVariant === "dark";
  const isGreen = effectiveVariant === "green";

  // Resolve trend positivity: explicit isPositive > trendDirection > default
  const resolvedPositive =
    isPositive !== undefined
      ? isPositive
      : trendDirection !== undefined
        ? trendDirection === "up"
        : true;

  return (
    <div
      className={`px-[26px] py-6 rounded-[14px] shadow-[0_1px_4px_rgba(0,0,0,0.06)] border flex flex-col justify-between min-h-[130px] ${
        isGreen
          ? "bg-psar-primary border-psar-primary"
          : isDark
            ? "bg-psar-dark border-psar-white/[0.06]"
            : "bg-psar-white border-[#e8eaed]"
      }`}
    >
      {/* Header: title + icon */}
      <div className="flex justify-between items-start mb-5">
        <div>
          <div
            className={`text-[10.5px] font-bold uppercase tracking-[0.07em] ${
              isGreen
                ? "text-psar-white/80"
                : isDark
                  ? "text-[#7d8590]"
                  : "text-[#6b7280]"
            }`}
          >
            {title}
          </div>
          <div
            className={`text-[10px] mt-0.5 ${
              isGreen
                ? "text-psar-white/60"
                : isDark
                  ? "text-[#4d5562]"
                  : "text-[#9ca3af]"
            }`}
          >
            {khmerTitle}
          </div>
        </div>
        {Icon && (
          <div
            className={`w-[34px] h-[34px] rounded-[10px] flex items-center justify-center border ${
              isGreen
                ? "bg-psar-white/20 border-transparent"
                : isDark
                  ? "bg-psar-white/[0.06] border-psar-white/[0.08]"
                  : "bg-[#f7f8fa] border-[#e8eaed]"
            }`}
          >
            <Icon
              size={15}
              className={
                isGreen
                  ? "text-psar-white"
                  : isDark
                    ? "text-psar-primary"
                    : "text-psar-primary"
              }
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
              : isDark
                ? "text-[#e6edf3]"
                : "text-psar-dark"
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
                  : "text-[#ef4444]"
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
                : isDark
                  ? "text-[#7d8590]"
                  : "text-[#6b7280]"
            }`}
          >
            {subtext}
          </span>
        )}
      </div>
    </div>
  );
}
