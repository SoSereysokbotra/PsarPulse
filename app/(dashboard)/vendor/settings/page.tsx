"use client";

import React, { Suspense } from "react";
import { LayoutDashboard, CircleDollarSign, Receipt, Users, Package } from "lucide-react";
import VendorSettings from "@/components/vendor/VendorSettings";

const NAV_LINKS = [
  { icon: LayoutDashboard, title: "Dashboard", khmerTitle: "ផ្ទាំងគ្រប់គ្រប់", href: "/vendor" },
  { icon: CircleDollarSign, title: "Sales", khmerTitle: "ការលក់", href: "/vendor/sales" },
  { icon: Receipt, title: "Expenses", khmerTitle: "ចំណាយ", href: "/vendor/expenses" },
  { icon: Users, title: "Customers", khmerTitle: "អតិថិជន", href: "/vendor/customer" },
  { icon: Package, title: "Inventory", khmerTitle: "ស្តុក", href: "/vendor/inventory" },
];

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen animate-pulse bg-slate-50/30" />}>
      <VendorSettings 
        tier="free"
        navLinks={NAV_LINKS}
        currentPath="/vendor/settings"
      />
    </Suspense>
  );
}