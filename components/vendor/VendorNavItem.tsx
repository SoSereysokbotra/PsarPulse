"use client";

import Link from "next/link";
import React from "react";

interface VendorNavItemProps {
  icon: React.ElementType;
  title: string;
  khmerTitle: string;
  href: string;
  active?: boolean;
  collapsed?: boolean;
}

export default function VendorNavItem({
  icon: Icon,
  title,
  khmerTitle,
  href,
  active = false,
  collapsed = false,
}: VendorNavItemProps) {
  return (
    <Link
      href={href}
      title={collapsed ? title : undefined}
      className={`flex items-center rounded-[10px] mb-0.5 no-underline transition-all duration-[120ms] ${
        collapsed
          ? "justify-center w-full h-11"
          : "justify-between px-4 py-3"
      } ${
        active
          ? "bg-[rgba(41,178,141,0.12)] text-[#29B28D]"
          : "bg-transparent text-[#7d8590] hover:bg-white/[0.05] hover:text-[#e6edf3]"
      }`}
    >
      <div className={`flex items-center ${collapsed ? "" : "gap-3"}`}>
        <Icon size={20} />
        {!collapsed && (
          <span className={`text-[15px] ${active ? "font-semibold" : "font-normal"}`}>
            {title}
          </span>
        )}
      </div>
      {!collapsed && (
        <span className="text-[11px] opacity-65">{khmerTitle}</span>
      )}
    </Link>
  );
}
