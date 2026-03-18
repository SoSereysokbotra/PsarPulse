import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

export interface FreeStatCardProps {
  title: string;
  khmerTitle: string;
  value: string | number;
  subtext?: string;
  variant?: "dark" | "light" | "green";
  trend?: string;
  trendDirection?: "up" | "down";
}

export default function FreeStatCard({
  title,
  khmerTitle,
  value,
  subtext,
  variant = "light",
  trend,
  trendDirection,
}: FreeStatCardProps) {
  const isDark = variant === "dark";
  const isGreen = variant === "green";
  const isPositiveTrend = trendDirection === "up";

  let containerClass = "rounded-2xl p-5 flex flex-col justify-between min-h-30 ";
  if (isDark) {
    containerClass += "bg-slate-900 text-white";
  } else if (isGreen) {
    containerClass += "bg-[#29B28D] text-white";
  } else {
    containerClass += "bg-white border border-slate-200";
  }

  return (
    <div className={containerClass}>
      <div>
        <p className={`text-xs font-semibold ${isDark ? "text-slate-400" : isGreen ? "text-white/80" : "text-slate-500"} leading-tight`}>{title}</p>
        <p className={`text-[10px] font-khmer mt-0.5 ${isDark ? "text-slate-500" : isGreen ? "text-white/60" : "text-slate-400"}`}>{khmerTitle}</p>
      </div>
      <div>
        <div className="flex items-end justify-between mt-3">
          <div className={`text-[32px] font-bold leading-none ${isDark ? "text-white" : isGreen ? "text-white" : "text-slate-900"}`}>{value}</div>
          {trend && (
            <div className={`flex items-center gap-1 text-xs font-bold ${isPositiveTrend ? "text-[#3ecf8e]" : "text-[#ef4444]"}`}>
              {isPositiveTrend ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              <span>{trend}</span>
            </div>
          )}
        </div>
        {subtext && <p className={`text-xs mt-1 ${isDark ? "text-slate-400" : isGreen ? "text-white/70" : "text-slate-400"}`}>{subtext}</p>}
      </div>
    </div>
  );
}
