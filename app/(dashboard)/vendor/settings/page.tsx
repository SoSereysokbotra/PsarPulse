"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  Sparkles,
  CheckCircle2,
  CreditCard,
  QrCode,
  Shield,
  Clock,
  Check,
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  ArrowRight,
} from "lucide-react";

// Import unified reusable components
import VendorSidebar from "@/components/vendor/VendorSidebar";
import VendorTopbar from "@/components/vendor/VendorTopbar";

type SettingsTab = "profile" | "billing" | "subscriptions";

const TRANSACTION_HISTORY = [
  {
    date: "Mar 1, 2026",
    plan: "Premium Plan",
    amount: "$7.00",
    method: "ABA KHQR",
  },
  {
    date: "Feb 1, 2026",
    plan: "Premium Plan",
    amount: "$7.00",
    method: "ABA KHQR",
  },
  {
    date: "Jan 1, 2026",
    plan: "Premium Plan",
    amount: "$7.00",
    method: "ACLEDA QR",
  },
  {
    date: "Dec 1, 2025",
    plan: "Pro Plan",
    amount: "$3.00",
    method: "ACLEDA QR",
  },
];

// Reused your original QR Code SVG generator
function QRCode({ bank }: { bank: "aba" | "acleda" }) {
  const color = bank === "aba" ? "#d32f2f" : "#1565c0";
  const modules: [number, number][] = [
    [52, 8],
    [58, 8],
    [64, 8],
    [70, 8],
    [52, 14],
    [64, 14],
    [52, 20],
    [58, 20],
    [70, 20],
    [52, 26],
    [64, 26],
    [70, 26],
    [58, 32],
    [64, 32],
    [52, 38],
    [70, 38],
    [8, 52],
    [14, 52],
    [20, 52],
    [26, 52],
    [8, 58],
    [20, 58],
    [26, 58],
    [8, 64],
    [14, 64],
    [8, 70],
    [26, 70],
    [14, 76],
    [20, 76],
    [8, 82],
    [14, 82],
    [26, 82],
    [52, 52],
    [64, 52],
    [70, 52],
    [76, 52],
    [82, 52],
    [94, 52],
    [106, 52],
    [112, 52],
    [118, 52],
    [124, 52],
    [130, 52],
    [52, 58],
    [76, 58],
    [94, 58],
    [106, 58],
    [124, 58],
    [52, 64],
    [58, 64],
    [64, 64],
    [76, 64],
    [82, 64],
    [94, 64],
    [100, 64],
    [106, 64],
    [118, 64],
    [124, 64],
    [130, 64],
    [52, 70],
    [64, 70],
    [76, 70],
    [100, 70],
    [112, 70],
    [124, 70],
    [52, 76],
    [58, 76],
    [70, 76],
    [82, 76],
    [88, 76],
    [94, 76],
    [106, 76],
    [118, 76],
    [130, 76],
    [52, 82],
    [58, 82],
    [64, 82],
    [76, 82],
    [94, 82],
    [100, 82],
    [112, 82],
    [118, 82],
    [124, 82],
    [8, 94],
    [20, 94],
    [32, 94],
    [38, 94],
    [52, 94],
    [64, 94],
    [76, 94],
    [88, 94],
    [94, 94],
    [106, 94],
    [112, 94],
    [118, 94],
    [130, 94],
    [8, 100],
    [14, 100],
    [32, 100],
    [52, 100],
    [64, 100],
    [82, 100],
    [94, 100],
    [112, 100],
    [118, 100],
    [124, 100],
    [8, 106],
    [26, 106],
    [38, 106],
    [52, 106],
    [58, 106],
    [70, 106],
    [82, 106],
    [100, 106],
    [106, 106],
    [124, 106],
    [130, 106],
    [14, 112],
    [20, 112],
    [32, 112],
    [52, 112],
    [70, 112],
    [76, 112],
    [88, 112],
    [100, 112],
    [118, 112],
    [8, 118],
    [20, 118],
    [38, 118],
    [52, 118],
    [64, 118],
    [82, 118],
    [88, 118],
    [106, 118],
    [112, 118],
    [124, 118],
    [130, 118],
    [8, 124],
    [14, 124],
    [20, 124],
    [32, 124],
    [38, 124],
    [58, 124],
    [70, 124],
    [82, 124],
    [94, 124],
    [106, 124],
    [118, 124],
    [8, 130],
    [26, 130],
    [38, 130],
    [52, 130],
    [64, 130],
    [76, 130],
    [88, 130],
    [100, 130],
    [112, 130],
    [124, 130],
    [130, 130],
  ];
  return (
    <svg
      width="160"
      height="160"
      viewBox="0 0 140 140"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="0" y="0" width="140" height="140" fill="white" />
      <rect x="8" y="8" width="38" height="38" rx="3" fill={color} />
      <rect x="13" y="13" width="28" height="28" rx="2" fill="white" />
      <rect x="18" y="18" width="18" height="18" rx="1" fill={color} />
      <rect x="94" y="8" width="38" height="38" rx="3" fill={color} />
      <rect x="99" y="13" width="28" height="28" rx="2" fill="white" />
      <rect x="104" y="18" width="18" height="18" rx="1" fill={color} />
      <rect x="8" y="94" width="38" height="38" rx="3" fill={color} />
      <rect x="13" y="99" width="28" height="28" rx="2" fill="white" />
      <rect x="18" y="104" width="18" height="18" rx="1" fill={color} />
      {modules.map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="5" height="5" fill={color} />
      ))}
      <rect x="60" y="60" width="20" height="20" rx="3" fill="white" />
      <text
        x="70"
        y="73"
        textAnchor="middle"
        fontSize="7"
        fontWeight="bold"
        fill={color}
      >
        {bank === "aba" ? "ABA" : "ACL"}
      </text>
    </svg>
  );
}

function SpinIcon({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M8 16H3v5" />
    </svg>
  );
}

export default function SettingsPage() {
  // Layout State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Settings State
  const [activeTab, setActiveTab] = useState<SettingsTab>("billing");

  // Profile
  const [fullName, setFullName] = useState("Sok Maly");
  const [email, setEmail] = useState("sokmaly@gmail.com");
  const [phone, setPhone] = useState("012 345 678");
  const [location, setLocation] = useState("Phnom Penh Market");
  const [saved, setSaved] = useState(false);

  // Billing & Roblox-style Checkout State
  const [selectedMethod, setSelectedMethod] = useState<"aba" | "acleda" | "bakong">("aba");
  const [checkoutPlan, setCheckoutPlan] = useState<"pro" | "premium">("premium");
  const [tosAccepted, setTosAccepted] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success">("idle");
  const [showHistory, setShowHistory] = useState(false);
  
  const router = useRouter();

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const SUBNAV: { id: SettingsTab; label: string; icon: React.ElementType }[] =
    [
      { id: "profile", label: "My Profile", icon: User },
      { id: "billing", label: "Payment Method", icon: CreditCard },
      { id: "subscriptions", label: "Subscriptions", icon: Sparkles },
    ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-900">
      {/* ══ REUSABLE SIDEBAR ══ */}
      <VendorSidebar
        plan="free"
        navLinks={[
          { icon: User, title: "Dashboard", khmerTitle: "ផ្ទាំងគ្រប់គ្រង", href: "/vendor" },
        ]}
        currentPath="/vendor/settings"
        collapsed={isSidebarCollapsed}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* ══ MAIN ══ */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-white">
        {/* ══ REUSABLE TOPBAR ══ */}
        <VendorTopbar
          setIsMobileSidebarOpen={setIsSidebarOpen}
          isSidebarCollapsed={isSidebarCollapsed}
          setIsSidebarCollapsed={setIsSidebarCollapsed}
          title="Settings"
        />

        {/* Settings body */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto w-full h-full flex flex-col">
            {/* Page heading */}
            <div className="px-8 pt-10 pb-6 border-b border-slate-200">
              <h2 className="text-3xl font-bold text-slate-900">Settings</h2>
              <p className="text-sm text-slate-500 mt-2">
                Manage your account settings and preferences.
              </p>
            </div>

            {/* Layout Wrapper */}
            <div className="flex flex-1 flex-col md:flex-row">
              {/* Sub-nav Sidebar */}
              <div className="w-full md:w-64 shrink-0 md:border-r border-slate-200 p-6 flex flex-col gap-1">
                {SUBNAV.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors w-full text-left ${
                        isActive
                          ? "bg-emerald-50 text-emerald-700"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      <Icon
                        size={18}
                        className={
                          isActive ? "text-emerald-600" : "text-slate-400"
                        }
                      />
                      {item.label}
                    </button>
                  );
                })}
              </div>

              {/* Main Content Area */}
              <div className="flex-1 min-w-0 p-6 md:p-10 max-w-4xl">
                {/* ══ MY PROFILE ══ */}
                {activeTab === "profile" && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {/* Profile Information Section */}
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                      <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <User size={18} className="text-slate-400" />
                          <h3 className="text-base font-semibold text-slate-900">
                            Profile Information
                          </h3>
                        </div>
                      </div>

                      <div className="p-6">
                        {/* Avatar */}
                        <div className="flex items-center gap-5 mb-8">
                          <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-xl font-bold text-emerald-700 shrink-0 shadow-sm">
                            {fullName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>
                          <div>
                            <div className="text-lg font-semibold text-slate-900">
                              {fullName}
                            </div>
                            <div className="text-sm text-slate-500">
                              {email}
                            </div>
                          </div>
                        </div>

                        {/* Form Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 block">
                              Full Name
                            </label>
                            <div className="relative">
                              <User
                                size={16}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                              />
                              <input
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 block">
                              Email Address
                            </label>
                            <div className="relative">
                              <Mail
                                size={16}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                              />
                              <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 block">
                              Phone Number
                            </label>
                            <div className="relative">
                              <Phone
                                size={16}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                              />
                              <input
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 block">
                              Stall Location
                            </label>
                            <div className="relative">
                              <MapPin
                                size={16}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                              />
                              <input
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-slate-100">
                          <button
                            onClick={handleSave}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm ${
                              saved
                                ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                                : "bg-slate-900 text-white hover:bg-slate-800"
                            }`}
                          >
                            {saved ? (
                              <>
                                <CheckCircle2 size={16} /> Saved Successfully
                              </>
                            ) : (
                              "Save Changes"
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Preferences / Language Section */}
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                      <div className="px-6 py-5 border-b border-slate-200 flex items-center gap-2">
                        <Globe size={18} className="text-slate-400" />
                        <h3 className="text-base font-semibold text-slate-900">
                          Language Preferences
                        </h3>
                      </div>
                      <div className="p-6 space-y-3">
                        {[
                          { label: "English (Default)", val: "en" },
                          { label: "ភាសាខ្មែរ (Khmer)", val: "km" },
                        ].map((lang) => (
                          <label
                            key={lang.val}
                            className="flex items-center justify-between p-4 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors"
                          >
                            <span className="text-sm font-medium text-slate-700">
                              {lang.label}
                            </span>
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${lang.val === "en" ? "border-emerald-500" : "border-slate-300"}`}
                            >
                              {lang.val === "en" && (
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                              )}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ══ PAYMENT METHOD ══ */}
                {activeTab === "billing" && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    
                    {paymentStatus !== "success" ? (
                      <>
                        {/* Method Selection */}
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-slate-900">
                              Select Payment Method
                            </h3>
                            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
                              <button onClick={() => setCheckoutPlan("pro")} className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${checkoutPlan === "pro" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>Pro ($3)</button>
                              <button onClick={() => setCheckoutPlan("premium")} className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${checkoutPlan === "premium" ? "bg-emerald-500 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>Premium ($7)</button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {(["aba", "acleda", "bakong"] as const).map((bank) => (
                              <button
                                key={bank}
                                onClick={() => setSelectedMethod(bank)}
                                className={`relative flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                                  selectedMethod === bank
                                    ? "border-emerald-500 bg-emerald-50/40"
                                    : "border-slate-200 hover:border-slate-300 bg-white"
                                }`}
                              >
                                {selectedMethod === bank && (
                                  <div className="absolute top-4 right-4 text-emerald-500">
                                    <CheckCircle2 size={20} />
                                  </div>
                                )}
                                <div
                                  className={`w-14 h-14 rounded-lg flex flex-col items-center justify-center shrink-0 shadow-sm ${bank === "aba" ? "bg-[#d32f2f]" : bank === "acleda" ? "bg-[#1565c0]" : "bg-[#e11d48]"}`}
                                >
                                  <span className="text-white font-bold text-sm">
                                    {bank === "aba" ? "ABA" : bank === "acleda" ? "ACL" : "BKG"}
                                  </span>
                                </div>
                                <div>
                                  <div className="text-sm font-semibold text-slate-900">
                                    {bank === "aba" ? "ABA KHQR" : bank === "acleda" ? "ACLEDA QR" : "BAKONG QR"}
                                  </div>
                                  <div className="text-xs text-slate-500 mt-0.5">
                                    {bank === "aba"
                                      ? "Advanced Bank of Asia"
                                      : bank === "acleda" ? "ACLEDA Bank Plc." : "National Bank"}
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Interactive QR Card */}
                        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                          <div className="px-6 py-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                              <h4 className="text-base font-semibold text-slate-900">
                                {selectedMethod === "aba"
                                  ? "ABA KHQR"
                                  : selectedMethod === "acleda" ? "ACLEDA QR" : "BAKONG QR"}{" "}
                                <span className="text-slate-400 font-normal">
                                  — {checkoutPlan === "premium" ? "$7.00" : "$3.00"} / month
                                </span>
                              </h4>
                              <p className="text-sm text-slate-500 mt-1">
                                Scan using your mobile banking app to process
                                payment.
                              </p>
                            </div>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-md shrink-0">
                              <Shield size={14} className="text-emerald-600" />
                              <span className="text-xs font-medium text-emerald-700">
                                Secure Payment
                              </span>
                            </div>
                          </div>

                          <div className="p-8">
                            <div className="flex flex-col md:flex-row gap-8 items-start">
                              <div className="w-full md:w-auto flex flex-col items-center">
                                <div
                                  className={`p-3 bg-white rounded-xl shadow-sm border ${selectedMethod === "aba" ? "border-[#d32f2f]/20" : selectedMethod === "acleda" ? "border-[#1565c0]/20" : "border-[#e11d48]/20"}`}
                                >
                                  <QRCode bank={selectedMethod === "acleda" ? "acleda" : "aba"} />
                                </div>
                                <span className="text-sm font-medium text-slate-500 mt-4">
                                  Scan to pay {checkoutPlan === "premium" ? "$7.00" : "$3.00"}
                                </span>
                              </div>

                              <div className="flex-1 w-full space-y-6">
                                <div>
                                  <h5 className="text-sm font-semibold text-slate-900 mb-4">
                                    Payment Instructions
                                  </h5>
                                  <div className="space-y-3">
                                    {[
                                      `Open ${selectedMethod === "aba" ? "ABA Mobile" : selectedMethod === "acleda" ? "ACLEDA Mobile" : "Bakong"} app`,
                                      "Tap the QR scan icon",
                                      "Point camera at QR code",
                                      `Confirm ${checkoutPlan === "premium" ? "$7.00" : "$3.00"} payment`,
                                    ].map((step, i) => (
                                      <div
                                        key={i}
                                        className="flex items-center gap-3"
                                      >
                                        <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-medium shrink-0">
                                          {i + 1}
                                        </div>
                                        <span className="text-sm text-slate-600">
                                          {step}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <label className="flex items-start gap-3 cursor-pointer mt-6 mb-2 group">
                                  <div className="relative flex items-start pt-0.5 mt-0.5 shrink-0">
                                    <input 
                                      type="checkbox" 
                                      className="peer sr-only" 
                                      checked={tosAccepted}
                                      onChange={(e) => setTosAccepted(e.target.checked)}
                                    />
                                    <div className="w-4 h-4 border border-slate-300 rounded peer-checked:bg-[#2563eb] peer-checked:border-[#2563eb] transition-colors flex items-center justify-center bg-white shadow-sm">
                                      <Check className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" strokeWidth={3} />
                                    </div>
                                  </div>
                                  <span className="text-[12px] text-slate-500 leading-relaxed font-medium">
                                    I agree that I am purchasing a limited license to access the product governed by the <span className="underline hover:text-slate-800">Terms of License</span>. I am at least 18 years old. I allow PsarPulse to charge the total amount shown monthly. I can cancel anytime.
                                  </span>
                                </label>

                                <button
                                  onClick={() => {
                                    if (!tosAccepted || paymentStatus !== "idle") return;
                                    setPaymentStatus("processing");
                                    setTimeout(() => setPaymentStatus("success"), 2000); // Wait 2s
                                  }}
                                  disabled={!tosAccepted || paymentStatus !== "idle"}
                                  className={`w-full flex items-center justify-center gap-2 rounded-xl py-3.5 font-bold text-[15px] transition-all duration-300 shadow-sm ${
                                    !tosAccepted
                                      ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                                      : paymentStatus === "processing"
                                      ? "bg-[#2563eb] text-white cursor-wait opacity-80"
                                      : paymentStatus === "success"
                                      ? "bg-[#10b981] text-white shadow-lg shadow-emerald-200/50"
                                      : "bg-[#2563eb] text-white hover:bg-[#1d4ed8] hover:shadow-md active:scale-[0.98]"
                                  }`}
                                >
                                  {paymentStatus === "processing" && (
                                    <>
                                      <SpinIcon size={18} className="animate-spin mr-1" />
                                      Processing Payment...
                                    </>
                                  )}
                                  {paymentStatus === "success" && (
                                    <>
                                      <Check className="w-5 h-5 mr-1 animate-in zoom-in" strokeWidth={3} />
                                      Subscribed
                                    </>
                                  )}
                                  {paymentStatus === "idle" && "Subscribe"}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* History Section */}
                        <div>
                          <button
                            onClick={() => setShowHistory((h) => !h)}
                            className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors mb-4"
                          >
                            <ChevronDown
                              size={16}
                              className={`transition-transform duration-200 ${showHistory ? "rotate-180" : ""}`}
                            />
                            {showHistory ? "Hide Payment History" : "View Payment History"}
                          </button>

                          {showHistory && (
                            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-2">
                              {/* Table */}
                              <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                  <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200">
                                      {["Date", "Plan", "Amount", "Method"].map(
                                        (h) => (
                                          <th
                                            key={h}
                                            className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider"
                                          >
                                            {h}
                                          </th>
                                        ),
                                      )}
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100">
                                    {TRANSACTION_HISTORY.map((tx, i) => (
                                      <tr
                                        key={i}
                                        className="hover:bg-slate-50 transition-colors"
                                      >
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                          {tx.date}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-slate-900">
                                          {tx.plan}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                                          {tx.amount}
                                        </td>
                                        <td className="px-6 py-4">
                                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                                            <QrCode size={12} />
                                            {tx.method}
                                          </span>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      // ══ SUCCESS PAGE (Inline layout match) ══
                      <div className="bg-white border border-slate-200 rounded-xl shadow-md min-h-[500px] flex flex-col items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(52,211,153,0.03)_0%,transparent_100%)] pointer-events-none" />
                        
                        <div className="animate-in fade-in zoom-in slide-in-from-bottom-6 duration-700 flex flex-col items-center text-center p-8 max-w-lg z-10 w-full">
                          <div className="w-20 h-20 bg-emerald-100/60 rounded-full flex items-center justify-center mb-6 relative shadow-in">
                             <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-20 duration-1000 delay-300"></div>
                             <CheckCircle2 className="w-10 h-10 text-[#10b981]" />
                          </div>
                          <h2 className="text-[32px] font-extrabold text-slate-900 mb-2 tracking-tight">Payment Successful!</h2>
                          <div className="bg-slate-50 border border-slate-100 rounded-lg px-6 py-4 mb-8 w-full">
                             <p className="text-slate-500 text-[14px] leading-relaxed font-medium">
                               Thank you for subscribing to PsarPulse. You now have full access to all <strong className="text-slate-800">{checkoutPlan === "premium" ? "Premium" : "Pro"}</strong> Plan features and tools.
                             </p>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
                            <button 
                              onClick={() => router.push(`/vendor/${checkoutPlan}`)}
                              className="py-3.5 px-6 rounded-lg font-bold text-sm text-white bg-slate-900 hover:bg-black transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                            >
                               Return to Dashboard
                               <ArrowRight className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => {
                                setPaymentStatus("idle");
                                setTosAccepted(false);
                              }}
                              className="py-3.5 px-6 rounded-lg font-bold text-sm text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors flex items-center justify-center"
                            >
                               View Receipt
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ══ SUBSCRIPTIONS ══ */}
                {activeTab === "subscriptions" && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="flex items-center gap-2">
                      <CreditCard size={20} className="text-slate-400" />
                      <h3 className="text-lg font-semibold text-slate-900">
                        Current Subscription
                      </h3>
                    </div>

                    {/* Plan Card */}
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -z-10" />
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shrink-0 shadow-md">
                          <Sparkles size={24} className="text-white" />
                        </div>
                        <div>
                          <div className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            Premium Plan
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700">
                              Active
                            </span>
                          </div>
                          <p className="text-sm text-slate-500 mt-1 max-w-sm leading-relaxed">
                            Full access to AI features, automated accounting,
                            inventory management, and advanced analytics.
                          </p>
                        </div>
                      </div>
                      <div className="sm:text-right border-t sm:border-t-0 border-slate-100 pt-4 sm:pt-0">
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                          Next Billing Date
                        </p>
                        <p className="text-base font-semibold text-slate-900">
                          April 25, 2026
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button
                        onClick={() => setActiveTab("billing")}
                        className="flex-1 py-3 px-4 rounded-lg bg-slate-900 text-white font-medium text-sm hover:bg-slate-800 transition-all shadow-sm text-center"
                      >
                        Manage Payment Method
                      </button>
                      <button
                        onClick={() => {
                          setActiveTab("billing");
                          setShowHistory(true);
                        }}
                        className="flex-1 py-3 px-4 rounded-lg bg-white text-slate-700 font-medium text-sm border border-slate-300 hover:bg-slate-50 transition-all shadow-sm text-center"
                      >
                        View Billing History
                      </button>
                    </div>

                    <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start gap-1.5 mt-4">
                      <Shield size={14} className="text-slate-400" />
                      All payments are securely processed via ABA PayWay & KHQR.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
