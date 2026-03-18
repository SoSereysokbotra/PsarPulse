"use client";

import React from "react";

interface VendorSummaryCardProps {
  title: string;
  khmerTitle: string;
  value: string;
  icon: React.ElementType;
  trend?: string;
  isPositive?: boolean;
  subtext?: string;
  highlight?: boolean;
}

export default function VendorSummaryCard({
  title,
  khmerTitle,
  value,
  icon: Icon,
  trend,
  isPositive,
  subtext,
  highlight = false,
}: VendorSummaryCardProps) {
  return (
    <div
      className={`px-[26px] py-6 rounded-[14px] shadow-[0_1px_4px_rgba(0,0,0,0.06)] border ${
        highlight
          ? "bg-[#29B28D] border-[#29B28D]"
          : "bg-white border-[#e8eaed]"
      }`}
    >
      <div className="flex justify-between items-start mb-5">
        <div>
          <div
            className={`text-[10.5px] font-bold uppercase tracking-[0.07em] ${
              highlight ? "text-white/80" : "text-[#6b7280]"
            }`}
          >
            {title}
          </div>
          <div
            className={`text-[10px] mt-0.5 ${
              highlight ? "text-white/60" : "text-[#9ca3af]"
            }`}
          >
            {khmerTitle}
          </div>
        </div>
        <div
          className={`w-[34px] h-[34px] rounded-[10px] flex items-center justify-center border ${
            highlight
              ? "bg-white/20 border-transparent"
              : "bg-[#f7f8fa] border-[#e8eaed]"
          }`}
        >
          <Icon
            size={15}
            className={highlight ? "text-white" : "text-[#29B28D]"}
          />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <span
          className={`font-bold text-[30px] leading-none ${
            highlight ? "text-white" : "text-[#111827]"
          }`}
        >
          {value}
        </span>
        {trend && (
          <span
            className={`text-[12.5px] font-bold mb-0.5 ${
              highlight
                ? "text-white"
                : isPositive
                ? "text-[#29B28D]"
                : "text-[#ef4444]"
            }`}
          >
            {trend}
          </span>
        )}
        {subtext && (
          <span
            className={`text-[12.5px] font-medium mb-0.5 ${
              highlight ? "text-white/80" : "text-[#6b7280]"
            }`}
          >
            {subtext}
          </span>
        )}
      </div>
    </div>
  );
}
