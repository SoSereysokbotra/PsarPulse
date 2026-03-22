"use client";

import Link from "next/link";
import React from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface VendorNavItemProps {
  icon: React.ElementType;
  title: string;
  khmerTitle: string;
  href: string;
  active?: boolean;
  collapsed?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

export default function VendorNavItem({
  icon: Icon,
  title,
  khmerTitle,
  href,
  active = false,
  collapsed = false,
  onClick,
}: VendorNavItemProps) {
  const { language } = useLanguage();
  const displayTitle = language === "km" ? khmerTitle : title;

  return (
    <Link
      href={href}
      title={collapsed ? displayTitle : undefined}
      onClick={(e) => {
        if (onClick) {
          e.preventDefault();
          onClick(e);
        }
      }}
      className={`flex items-center rounded-[10px] mb-0.5 no-underline transition-all duration-[120ms] ${
        collapsed
          ? "justify-center w-full h-11"
          : "justify-between px-4 py-3"
      } ${
        active
          ? "bg-[rgba(41,178,141,0.12)] text-[#29B28D] dark:bg-[#3ecf8e]/10 dark:text-[#3ecf8e]"
          : "bg-transparent text-[#7d8590] hover:bg-white/[0.05] hover:text-[#e6edf3] dark:hover:text-white"
      }`}
    >
      <div className={`flex items-center ${collapsed ? "" : "gap-3"}`}>
        <Icon size={20} />
        {!collapsed && (
          <span className={`text-[15px] ${active ? "font-semibold" : "font-normal"}`}>
            {displayTitle}
          </span>
        )}
      </div>
    </Link>
  );
}
