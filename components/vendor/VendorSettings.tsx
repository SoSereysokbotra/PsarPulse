"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  User,
  Bell,
  Shield,
  Paintbrush,
  Save,
  Globe,
  Mail,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Sparkles,
  ChevronDown,
  Moon,
  Sun,
  Camera,
} from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import VendorDashboardLayout from "@/components/vendor/VendorDashboardLayout";

// ─── TYPES ───────────────────────────────────────────────────────────────────

type SettingsTab = "profile" | "billing" | "notifications" | "security" | "appearance" | "system";

interface VendorSettingsProps {
  tier: "free" | "pro" | "premium";
  navLinks: any[];
  currentPath: string;
}

// ─── HELPERS ─────────────────────────────────────────────────────────────

function QRCode({ bank }: { bank: "aba" | "acleda" | "bakong" }) {
  const color = bank === "aba" ? "#d32f2f" : bank === "acleda" ? "#1565c0" : "#e11d48";
  const label = bank === "aba" ? "ABA" : bank === "acleda" ? "ACL" : "BKG";

  const modules: [number, number][] = [[52, 8], [58, 8], [64, 8], [70, 8], [52, 14], [64, 14], [52, 20], [58, 20], [70, 20], [52, 26], [64, 26], [70, 26], [58, 32], [64, 32], [52, 38], [70, 38], [8, 52], [14, 52], [20, 52], [26, 52], [8, 58], [20, 58], [26, 58], [8, 64], [14, 64], [8, 70], [26, 70], [14, 76], [20, 76], [8, 82], [14, 82], [26, 82], [52, 52], [64, 52], [70, 52], [76, 52], [82, 52], [94, 52], [106, 52], [112, 52], [118, 52], [124, 52], [130, 52]];

  return (
    <svg width="140" height="140" viewBox="0 0 140 140" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="140" height="140" fill="white" />
      <rect x="8" y="8" width="38" height="38" rx="3" fill={color} />
      <rect x="13" y="13" width="28" height="28" rx="2" fill="white" />
      <rect x="18" y="18" width="18" height="18" rx="1" fill={color} />
      <rect x="94" y="8" width="38" height="38" rx="3" fill={color} />
      <rect x="99" y="13" width="28" height="28" rx="2" fill="white" />
      <rect x="104" y="18" width="18" height="18" rx="1" fill={color} />
      <rect x="8" y="94" width="38" height="38" rx="3" fill={color} />
      {modules.map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="5" height="5" fill={color} />
      ))}
      <rect x="60" y="60" width="20" height="20" rx="3" fill="white" />
      <text x="70" y="73" textAnchor="middle" fontSize="7" fontWeight="bold" fill={color}>{label}</text>
    </svg>
  );
}

function SuccessView({ plan, onReset }: { plan: string, onReset: () => void }) {
  return (
    <div className="h-full flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in-95 duration-500">
      <div className="w-24 h-24 bg-[#29B28D]/10 rounded-full flex items-center justify-center mb-8 relative">
        <div className="absolute inset-0 bg-[#29B28D] rounded-full animate-ping opacity-20 scale-150" />
        <CheckCircle2 size={48} className="text-[#29B28D]" strokeWidth={2.5} />
      </div>

      <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Subscription Confirmed!</h2>
      <p className="text-slate-500 font-medium mb-10 max-w-md mx-auto leading-relaxed text-sm">
        You have successfully upgraded to the <span className="text-[#29B28D] font-bold uppercase">{plan}</span> plan.
        Your features are now active and ready for use.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-sm">
        <button
          onClick={() => window.location.href = "/vendor"}
          className="flex items-center justify-center gap-2 py-4 bg-slate-900 text-white rounded-2xl text-xs font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
        >
          Go to Dashboard
          <div className="w-3.5 h-3.5 border-t-2 border-r-2 border-white rotate-45 ml-1" />
        </button>
        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 py-4 bg-white border-2 border-slate-100 text-slate-500 rounded-2xl text-xs font-bold hover:bg-slate-50 transition-all"
        >
          View Billing
        </button>
      </div>

      <p className="mt-12 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
        Transactional Receipt sent to your email
      </p>
    </div>
  );
}

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────────

export default function VendorSettings({ tier, navLinks, currentPath }: VendorSettingsProps) {
  const { language, setLanguage, t } = useLanguage();
  const { resolvedTheme, setTheme } = useTheme();
  const isKhmer = language === "km";
  const isDark = resolvedTheme === "dark";

  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as SettingsTab;

  const [activeTab, setActiveTab] = useState<SettingsTab>(tabParam || "profile");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync tab with URL
  useEffect(() => {
    if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [tabParam, activeTab]);

  const handleTabChange = (tab: SettingsTab) => {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.replace(`${currentPath}?${params.toString()}`);
  };

  // Form states
  const [personalInfo, setPersonalInfo] = useState({
    fullName: "Sok Maly",
    email: "sokmaly@gmail.com",
    phoneNumber: "012 345 678",
    stallLocation: "Phnom Penh Market",
    role: "Merchant Administrator",
    language: "English",
    timezone: "(UTC+07:00) Indochina Time"
  });

  // Billing states
  const [selectedMethod, setSelectedMethod] = useState<"aba" | "acleda" | "bakong">("bakong");
  const [checkoutPlan, setCheckoutPlan] = useState<"pro" | "premium">("pro");
  const [tosAccepted, setTosAccepted] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success">("idle");

  const handleSave = () => {
    setIsSaving(true);
    setSaveSuccess(false);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 800);
  };

  const tabs = [
    { id: "profile", label: t("settings.profile"), icon: User },
    { id: "billing", label: t("settings.billing"), icon: CreditCard },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security & Access", icon: Shield },
    { id: "appearance", label: "Appearance", icon: Paintbrush },
    { id: "system", label: "System Preferences", icon: Globe },
  ] as const;

  return (
    <VendorDashboardLayout
      plan={tier}
      navLinks={navLinks}
      currentPath={currentPath}
      settingsHref={tier === "free" ? "/vendor/settings" : `/vendor/${tier}/settings`}
      title={t("settings.title")}
    >
      <div className={`flex-1 overflow-y-auto min-h-screen transition-colors ${isDark ? "bg-dark-bg" : "bg-slate-50/30"}`}>
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className={`text-2xl font-bold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>{t("settings.title")}</h1>
              <p className={`text-sm mt-1 ${isDark ? "text-[#7d8590]" : "text-slate-500"}`}>Manage your account settings and administrative preferences.</p>
            </div>

            <div className="flex items-center gap-4">
              {saveSuccess && (
                <div className="flex items-center gap-2 text-sm font-bold text-[#29B28D] bg-[#29B28D]/5 px-4 py-2 rounded-xl animate-in fade-in zoom-in slide-in-from-right-4 duration-300">
                  <CheckCircle2 className="w-4 h-4" />
                  Changes Saved
                </div>
              )}
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#29B28D] hover:bg-slate-900 disabled:opacity-70 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl shadow-xl shadow-[#29B28D]/10 transition-all active:scale-95"
              >
                {isSaving ? (
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Navigation Sidebar */}
            <div className="w-full md:w-64 shrink-0">
              <nav className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-none">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id as SettingsTab)}
                      className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-bold transition-all whitespace-nowrap border-2 ${isActive
                          ? (isDark ? "bg-[#1C2128] text-[#3ecf8e] border-[#3ecf8e]/30 shadow-none" : "bg-white text-[#29B28D] shadow-xl shadow-slate-200 border-white ring-1 ring-slate-200/40")
                          : (isDark ? "text-[#7d8590] hover:text-white hover:bg-white/5 border-transparent" : "text-slate-500 hover:text-slate-900 hover:bg-white/60 border-transparent hover:border-slate-100")
                        }`}
                    >
                      <Icon size={16} className={`${isActive ? "text-[#29B28D]" : "text-slate-400"}`} strokeWidth={isActive ? 2.5 : 2} />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Content Area */}
            <div className={`flex-1 rounded-[32px] border overflow-hidden min-h-[650px] transition-colors ${
              isDark ? "bg-dark-surface border-white/5 shadow-none" : "bg-white border-slate-100 shadow-2xl shadow-slate-200/50"
            }`}>

              {/* Profile Section */}
              {activeTab === "profile" && (
                <div className={`divide-y transition-colors ${isDark ? "divide-white/5" : "divide-slate-100"} animate-in fade-in duration-300 backdrop-blur-sm`}>
                  <div className="p-8 sm:p-10">
                    <div className="flex flex-col mb-10">
                      <h2 className={`text-xl font-bold tracking-tight ${isDark ? "text-white" : "text-slate-800"}`}>{t("settings.profile")}</h2>
                      <p className={`text-sm mt-1 ${isDark ? "text-[#7d8590]" : "text-slate-500"}`}>Update your personal details and how we can reach you.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-10">
                      <div className="shrink-0">
                        <div className="relative group">
                          <div className={`w-28 h-28 rounded-full border-4 shadow-xl flex items-center justify-center text-3xl font-bold overflow-hidden transition-transform group-hover:scale-105 ${
                            isDark ? "bg-[#1C2128] border-[#3ecf8e]/20 text-[#3ecf8e]" : "bg-[#f0f4ff] border-white text-[#4f46e5]/40"
                          }`}>
                            SM
                          </div>
                          <button className="absolute bottom-0 right-0 w-9 h-9 bg-slate-900 rounded-full flex items-center justify-center border-4 border-white text-white text-xs hover:bg-[#29B28D] transition-all shadow-lg shadow-slate-200">
                            <Camera size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                          <label className={`text-sm font-semibold ml-1 ${isDark ? "text-[#7d8590]" : "text-slate-600"}`}>Full Name</label>
                          <input
                            type="text"
                            value={personalInfo.fullName}
                            onChange={(e) => setPersonalInfo({ ...personalInfo, fullName: e.target.value })}
                            className={`w-full px-5 py-3 rounded-xl text-sm outline-none transition-all ${
                              isDark ? "bg-[#0d1117] border-white/5 text-white focus:border-[#3ecf8e]/30" : "bg-slate-50 border-slate-100 text-slate-800 focus:bg-white focus:border-[#29B28D]/30"
                            }`}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className={`text-sm font-semibold ml-1 ${isDark ? "text-[#7d8590]" : "text-slate-600"}`}>Email Address</label>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                              type="email"
                              value={personalInfo.email}
                              onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                              className={`w-full pl-11 pr-5 py-3 rounded-xl text-sm outline-none transition-all ${
                                isDark ? "bg-[#0d1117] border-white/5 text-white focus:border-[#3ecf8e]/30" : "bg-slate-50 border-slate-100 text-slate-800 focus:bg-white focus:border-[#29B28D]/30"
                              }`}
                            />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className={`text-sm font-semibold ml-1 ${isDark ? "text-[#7d8590]" : "text-slate-600"}`}>Phone Number</label>
                          <input
                            type="text"
                            value={personalInfo.phoneNumber}
                            onChange={(e) => setPersonalInfo({ ...personalInfo, phoneNumber: e.target.value })}
                            className={`w-full px-5 py-3 rounded-xl text-sm outline-none transition-all ${
                              isDark ? "bg-[#0d1117] border-white/5 text-white focus:border-[#3ecf8e]/30" : "bg-slate-50 border-slate-100 text-slate-800 focus:bg-white focus:border-[#29B28D]/30"
                            }`}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className={`text-sm font-semibold ml-1 ${isDark ? "text-[#7d8590]" : "text-slate-600"}`}>Stall Location</label>
                          <input
                            type="text"
                            value={personalInfo.stallLocation}
                            onChange={(e) => setPersonalInfo({ ...personalInfo, stallLocation: e.target.value })}
                            className={`w-full px-5 py-3 rounded-xl text-sm outline-none transition-all ${
                              isDark ? "bg-[#0d1117] border-white/5 text-white focus:border-[#3ecf8e]/30" : "bg-slate-50 border-slate-100 text-slate-800 focus:bg-white focus:border-[#29B28D]/30"
                            }`}
                          />
                        </div>
                        <div className="space-y-1.5 sm:col-span-2">
                          <label className={`text-sm font-semibold ml-1 ${isDark ? "text-[#7d8590]" : "text-slate-600"}`}>Your Role</label>
                          <div className={`w-full px-5 py-3.5 border rounded-xl text-sm cursor-default ${
                            isDark ? "bg-[#1C2128] border-white/5 text-[#7d8590]" : "bg-[#f1f3f9] border-slate-100 text-slate-600"
                          }`}>
                            {personalInfo.role}
                          </div>
                          <p className="text-[11px] text-slate-400 ml-1 mt-1 font-medium">Contact your organization administrator to change your role.</p>
                        </div>
                      </div>
                    </div>

                    <div className={`mt-16 pt-12 border-t ${isDark ? "border-white/5" : "border-slate-50"}`}>
                      <div className="flex flex-col mb-8">
                        <h2 className={`text-xl font-bold tracking-tight ${isDark ? "text-white" : "text-slate-800"}`}>
                          {t("settings.interfaceTheme") || "Appearance"}
                        </h2>
                        <p className={`text-sm mt-1 ${isDark ? "text-[#7d8590]" : "text-slate-500"}`}>
                          {t("settings.interfaceThemeDesc") || "Choose how PsarPulse looks for you."}
                        </p>
                      </div>

                      <div className="flex flex-row gap-3">
                        {[
                          { id: "light", label: "Light", icon: Sun, color: "#facc15" },
                          { id: "dark", label: "Dark", icon: Moon, color: "#3ecf8e" }
                        ].map((mode) => {
                          const Icon = mode.icon;
                          const isSelected = resolvedTheme === mode.id;
                          
                          return (
                            <button
                              key={mode.id}
                              onClick={() => setTheme(mode.id as any)}
                              className={`group relative flex items-center gap-3 px-6 py-3 rounded-2xl border-2 transition-all duration-300 ${
                                isSelected 
                                  ? (isDark ? "bg-[#3ecf8e]/10 border-[#3ecf8e] shadow-[0_0_15px_rgba(62,207,142,0.1)]" : "bg-white border-[#29B28D] shadow-lg shadow-[#29B28D]/5")
                                  : (isDark ? "bg-[#0d1117] border-white/5 hover:border-white/10" : "bg-slate-50 border-slate-100 hover:border-slate-200")
                              }`}
                            >
                              <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-transform duration-300 ${
                                isSelected ? "bg-white" : (isDark ? "bg-white/5" : "bg-white")
                              }`}>
                                <Icon size={18} style={{ color: isSelected ? mode.color : "#94a3b8" }} />
                              </div>
                              <span className={`text-sm font-bold ${isSelected ? (isDark ? "text-[#3ecf8e]" : "text-[#29B28D]") : (isDark ? "text-[#7d8590]" : "text-slate-500")}`}>
                                {mode.label}
                              </span>
                              {isSelected && (
                                <div className="ml-1 w-1.5 h-1.5 rounded-full bg-current" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className={`mt-16 pt-12 border-t ${isDark ? "border-white/5" : "border-slate-50"}`}>
                      <div className="flex flex-col mb-8">
                        <h2 className={`text-xl font-bold tracking-tight ${isDark ? "text-white" : "text-slate-800"}`}>
                          {t("settings.language") || "Language & Regional"}
                        </h2>
                        <p className={`text-sm mt-1 ${isDark ? "text-[#7d8590]" : "text-slate-500"}`}>
                          Customize your language and regional formatting.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm font-semibold text-slate-600 ml-1">
                            <Globe size={16} className="text-slate-400" />
                            <span>Language</span>
                          </div>
                          <div className="relative">
                            <select
                              value={language === "km" ? "Khmer" : "English"}
                              onChange={(e) => {
                                const newLang = e.target.value === "Khmer" ? "km" : "en";
                                setLanguage(newLang);
                              }}
                              className={`w-full pl-5 pr-10 py-3 rounded-xl text-sm outline-none appearance-none cursor-pointer transition-all ${
                                isDark ? "bg-[#0d1117] border-white/5 text-white focus:border-[#3ecf8e]/30" : "bg-white border-slate-100 text-slate-800 focus:border-[#29B28D]/30 shadow-sm"
                              }`}
                            >
                              <option value="English">English</option>
                              <option value="Khmer">Khmer</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm font-semibold text-slate-600 ml-1">
                            <Globe size={16} className="text-slate-400" />
                            <span>Timezone</span>
                          </div>
                          <input
                            type="text"
                            value={personalInfo.timezone}
                            onChange={(e) => setPersonalInfo({ ...personalInfo, timezone: e.target.value })}
                            className={`w-full px-5 py-3 rounded-xl text-sm outline-none transition-all ${
                                isDark ? "bg-[#0d1117] border-white/5 text-white focus:border-[#3ecf8e]/30" : "bg-slate-50 border-slate-100 text-slate-800 focus:bg-white focus:border-[#29B28D]/30"
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ══ BILLING SECTION ══ */}
              {activeTab === "billing" && (
                <div className="h-full">
                  {paymentStatus === "success" ? (
                    <SuccessView plan={checkoutPlan} onReset={() => setPaymentStatus("idle")} />
                  ) : (
                    <div className="flex flex-col lg:flex-row h-full animate-in fade-in zoom-in-95 duration-500">
                      {/* Left: Panel */}
                      <div className="w-full lg:w-[360px] bg-[#141618] text-white p-10 flex flex-col justify-between shrink-0">
                        <div>
                          <div className="flex items-center gap-2 mb-12">
                            <div className="w-8 h-8 bg-[#29B28D] rounded-lg flex items-center justify-center shadow-lg shadow-[#29B28D]/20">
                              <Sparkles size={18} className="text-white" />
                            </div>
                            <span className="text-lg font-bold tracking-tight">PsarPulse</span>
                          </div>

                          <div className="mb-10">
                            <p className="text-xs font-bold text-[#29B28D] mb-2">Upgrade Plan</p>
                            <h2 className="text-3xl font-bold mb-4 leading-none tracking-tight">{checkoutPlan}</h2>
                            <div className="flex items-baseline gap-2">
                              <span className="text-4xl font-bold tracking-tight">${checkoutPlan === "pro" ? "3.00" : "7.00"}</span>
                              <span className="text-slate-500 font-bold text-[10px]">/ month</span>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <p className="text-xs font-bold text-slate-500 ml-1">Select Tier</p>
                            <div className="bg-[#0c0e0f] p-1 rounded-2xl flex gap-1 border border-white/5">
                              <button
                                onClick={() => setCheckoutPlan("pro")}
                                className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all ${checkoutPlan === "pro" ? "bg-white text-slate-900 shadow-xl" : "text-slate-500 hover:text-white"}`}
                              >
                                Pro
                              </button>
                              <button
                                onClick={() => setCheckoutPlan("premium")}
                                className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all ${checkoutPlan === "premium" ? "bg-white text-slate-900 shadow-xl" : "text-slate-500 hover:text-white"}`}
                              >
                                Premium
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                            <Shield size={12} className="text-[#29B28D]" />
                            <span>Secure Process</span>
                          </div>
                          <span className="text-[10px] font-bold text-slate-700">v1.2</span>
                        </div>
                      </div>

                      {/* Right Panel */}
                      <div className="flex-1 p-10 flex flex-col justify-between">
                        <div>
                          <h3 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2">
                            Select Payment Method
                            <div className="h-px bg-slate-100 flex-1" />
                          </h3>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                            {(["aba", "acleda", "bakong"] as const).map(bank => (
                              <button
                                key={bank}
                                onClick={() => setSelectedMethod(bank)}
                                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 group relative ${selectedMethod === bank ? "border-[#29B28D] bg-[#29B28D]/5 shadow-lg shadow-[#29B28D]/5" : "border-slate-50 hover:border-slate-100"}`}
                              >
                                <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${selectedMethod === bank ? "border-[#29B28D] bg-[#29B28D] text-white" : "border-slate-100 text-slate-200"}`}>
                                  {selectedMethod === bank ? <CheckCircle2 size={16} /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-100" />}
                                </div>
                                <span className={`text-xs font-bold ${selectedMethod === bank ? "text-[#29B28D]" : "text-slate-400"}`}>
                                  {bank}
                                </span>
                              </button>
                            ))}
                          </div>

                          <div className="mb-8 p-1 bg-slate-50/50 rounded-[32px] border border-slate-50 shadow-inner">
                            <div className="bg-white rounded-[28px] border border-slate-50 p-6 flex flex-col items-center">
                              <p className="text-[10px] font-bold text-slate-400 mb-6">
                                Scan using <span className="text-slate-900">{selectedMethod.toUpperCase()} App</span>
                              </p>
                              <div className="relative group p-4 bg-white border border-slate-100 rounded-3xl shadow-2xl">
                                <QRCode bank={selectedMethod} />
                                <div className="absolute inset-0 bg-[#29B28D]/5 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            </div>
                          </div>

                          <div className="mb-8">
                            <label className="flex items-start gap-3 cursor-pointer group px-2">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={tosAccepted}
                                onChange={(e) => setTosAccepted(e.target.checked)}
                              />
                              <div className="w-5 h-5 rounded-lg border-2 border-slate-100 mt-0.5 flex items-center justify-center peer-checked:bg-[#29B28D] peer-checked:border-[#29B28D] transition-all shrink-0">
                                <CheckCircle2 size={12} className="text-white opacity-0 peer-checked:opacity-100" />
                              </div>
                              <span className="text-xs leading-tight text-slate-400 font-medium tracking-tight">
                                I agree to the <span className="text-[#29B28D] border-b border-[#29B28D]/20">Terms of License</span>.
                                PsarPulse will charge the total shown monthly. Cancel anytime.
                              </span>
                            </label>
                          </div>
                        </div>

                        <div>
                          <button
                            onClick={() => {
                              if (!tosAccepted) return;
                              setPaymentStatus("processing");
                              setTimeout(() => setPaymentStatus("success"), 2000);
                            }}
                            disabled={!tosAccepted || paymentStatus === "processing"}
                            className={`w-full py-5 rounded-2xl font-bold text-sm transition-all shadow-xl active:scale-95 ${!tosAccepted ? "bg-slate-50 text-slate-300 cursor-not-allowed" : "bg-slate-900 text-white hover:bg-[#29B28D] shadow-slate-100 hover:shadow-[#29B28D]/20"}`}
                          >
                            {paymentStatus === "processing" ? (
                              <div className="flex items-center justify-center gap-3">
                                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                <span>Processing...</span>
                              </div>
                            ) : "Subscribe Now"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* End View placeholders */}
              {["notifications", "security", "appearance", "system"].includes(activeTab) && (
                <div className="p-16 text-center animate-in fade-in duration-300 flex items-center justify-center flex-col min-h-[500px]">
                  <div className="w-20 h-20 bg-slate-50 rounded-[1.5rem] flex items-center justify-center mb-6 text-slate-200 border-2 border-dashed border-slate-100">
                    <AlertCircle size={32} />
                  </div>
                  <h2 className="text-lg font-bold text-slate-800 mb-2 capitalize">{activeTab} Settings</h2>
                  <p className="text-xs text-slate-400 font-semibold max-w-xs mx-auto leading-loose">Section under development. Coming soon in v1.3</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </VendorDashboardLayout>
  );
}
