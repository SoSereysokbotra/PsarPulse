"use client";

import React from "react";
import { LayoutDashboard, CircleDollarSign, Receipt, Users } from "lucide-react";
import VendorSettings from "@/components/vendor/VendorSettings";

const NAV_LINKS = [
  { icon: LayoutDashboard, title: "Dashboard", khmerTitle: "ផ្ទាំងគ្រប់គ្រង", href: "/vendor" },
  { icon: CircleDollarSign, title: "Sales", khmerTitle: "ការលក់", href: "/vendor/sales" },
  { icon: Receipt, title: "Expenses", khmerTitle: "ចំណាយ", href: "/vendor/expenses" },
  { icon: Users, title: "Customers", khmerTitle: "អតិថិជន", href: "/vendor/customer" },
];

export default function SettingsPage() {
  return (
    <VendorSettings 
      tier="free"
      navLinks={NAV_LINKS}
      currentPath="/vendor/settings"
    />
  );
}