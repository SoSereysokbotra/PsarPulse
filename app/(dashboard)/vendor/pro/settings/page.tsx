"use client";

import React from "react";
import {
  LayoutDashboard,
  CircleDollarSign,
  Receipt,
  Users,
  Package,
  FileBarChart,
} from "lucide-react";
import VendorSettings from "@/components/vendor/VendorSettings";

const PRO_NAV = [
  {
    icon: LayoutDashboard,
    title: "Dashboard",
    khmerTitle: "ផ្ទាំងគ្រប់គ្រង",
    href: "/vendor/pro",
  },
  {
    icon: CircleDollarSign,
    title: "Sales",
    khmerTitle: "ការលក់",
    href: "/vendor/pro/sales",
  },
  {
    icon: Receipt,
    title: "Expenses",
    khmerTitle: "ចំណាយ",
    href: "/vendor/pro/expenses",
  },
  {
    icon: Users,
    title: "Customers",
    khmerTitle: "អតិថិជន",
    href: "/vendor/pro/customer",
  },
  {
    icon: Package,
    title: "Inventory",
    khmerTitle: "ស្តុក",
    href: "/vendor/pro/inventory",
  },
  {
    icon: FileBarChart,
    title: "Reports",
    khmerTitle: "របាយការណ៍",
    href: "/vendor/pro/reports",
  },
];

export default function SettingsPage() {
  return (
    <VendorSettings 
      tier="pro"
      navLinks={PRO_NAV}
      currentPath="/vendor/pro/settings"
    />
  );
}
