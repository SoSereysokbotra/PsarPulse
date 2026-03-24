"use client";

import React, { Suspense } from "react";
import {
  LayoutDashboard,
  CircleDollarSign,
  Receipt,
  Users,
  Package,
  FileBarChart,
} from "lucide-react";
import VendorSettings from "@/components/vendor/VendorSettings";

const PREMIUM_NAV = [
  { icon: LayoutDashboard,  title: "Dashboard",  khmerTitle: "ផ្ទាំងគ្រប់គ្រង", href: "/vendor/premium" },
  { icon: CircleDollarSign, title: "Sales",      khmerTitle: "ការលក់",           href: "/vendor/premium/sales" },
  { icon: Receipt,          title: "Expenses",   khmerTitle: "ចំណាយ",            href: "/vendor/premium/expenses" },
  { icon: Users,            title: "Customers",  khmerTitle: "អតិថិជន",          href: "/vendor/premium/customer" },
  { icon: Package,          title: "Inventory",  khmerTitle: "ស្តុក",            href: "/vendor/premium/inventory" },
  { icon: FileBarChart,     title: "Reports",    khmerTitle: "របាយការណ៍",        href: "/vendor/premium/reports" },
];

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen animate-pulse bg-slate-50/30" />}>
      <VendorSettings 
        tier="premium"
        navLinks={PREMIUM_NAV}
        currentPath="/vendor/premium/settings"
      />
    </Suspense>
  );
}