"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard, CircleDollarSign, Receipt, Users, Package,
  Settings, Menu, X, ChevronDown, Sparkles, FileBarChart,
  Megaphone, PanelLeftClose, PanelLeftOpen, CheckCircle2,
  CreditCard, QrCode, Shield, Clock, Check, User,
  Mail, Phone, MapPin, Globe,
} from "lucide-react";

interface NavItemProps { icon: React.ElementType; title: string; href: string; active?: boolean; collapsed?: boolean; }
type SettingsTab = "profile" | "billing" | "subscriptions";

const TRANSACTION_HISTORY = [
  { date:"Mar 1, 2026",  plan:"Premium Plan", amount:"$7.00", method:"ABA KHQR"  },
  { date:"Feb 1, 2026",  plan:"Premium Plan", amount:"$7.00", method:"ABA KHQR"  },
  { date:"Jan 1, 2026",  plan:"Premium Plan", amount:"$7.00", method:"ACLEDA QR" },
  { date:"Dec 1, 2025",  plan:"Pro Plan",     amount:"$3.00", method:"ACLEDA QR" },
];

function QRCode({ bank }: { bank: "aba" | "acleda" }) {
  const color = bank === "aba" ? "#d32f2f" : "#1565c0";
  const modules: [number,number][] = [
    [52,8],[58,8],[64,8],[70,8],[52,14],[64,14],[52,20],[58,20],[70,20],[52,26],[64,26],[70,26],[58,32],[64,32],[52,38],[70,38],
    [8,52],[14,52],[20,52],[26,52],[8,58],[20,58],[26,58],[8,64],[14,64],[8,70],[26,70],[14,76],[20,76],[8,82],[14,82],[26,82],
    [52,52],[64,52],[70,52],[76,52],[82,52],[94,52],[106,52],[112,52],[118,52],[124,52],[130,52],
    [52,58],[76,58],[94,58],[106,58],[124,58],[52,64],[58,64],[64,64],[76,64],[82,64],[94,64],[100,64],[106,64],[118,64],[124,64],[130,64],
    [52,70],[64,70],[76,70],[100,70],[112,70],[124,70],[52,76],[58,76],[70,76],[82,76],[88,76],[94,76],[106,76],[118,76],[130,76],
    [52,82],[58,82],[64,82],[76,82],[94,82],[100,82],[112,82],[118,82],[124,82],
    [8,94],[20,94],[32,94],[38,94],[52,94],[64,94],[76,94],[88,94],[94,94],[106,94],[112,94],[118,94],[130,94],
    [8,100],[14,100],[32,100],[52,100],[64,100],[82,100],[94,100],[112,100],[118,100],[124,100],
    [8,106],[26,106],[38,106],[52,106],[58,106],[70,106],[82,106],[100,106],[106,106],[124,106],[130,106],
    [14,112],[20,112],[32,112],[52,112],[70,112],[76,112],[88,112],[100,112],[118,112],
    [8,118],[20,118],[38,118],[52,118],[64,118],[82,118],[88,118],[106,118],[112,118],[124,118],[130,118],
    [8,124],[14,124],[20,124],[32,124],[38,124],[58,124],[70,124],[82,124],[94,124],[106,124],[118,124],
    [8,130],[26,130],[38,130],[52,130],[64,130],[76,130],[88,130],[100,130],[112,130],[124,130],[130,130],
  ];
  return (
    <svg width="160" height="160" viewBox="0 0 140 140" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="140" height="140" fill="white"/>
      <rect x="8" y="8" width="38" height="38" rx="3" fill={color}/><rect x="13" y="13" width="28" height="28" rx="2" fill="white"/><rect x="18" y="18" width="18" height="18" rx="1" fill={color}/>
      <rect x="94" y="8" width="38" height="38" rx="3" fill={color}/><rect x="99" y="13" width="28" height="28" rx="2" fill="white"/><rect x="104" y="18" width="18" height="18" rx="1" fill={color}/>
      <rect x="8" y="94" width="38" height="38" rx="3" fill={color}/><rect x="13" y="99" width="28" height="28" rx="2" fill="white"/><rect x="18" y="104" width="18" height="18" rx="1" fill={color}/>
      {modules.map(([x,y],i) => <rect key={i} x={x} y={y} width="5" height="5" fill={color}/>)}
      <rect x="60" y="60" width="20" height="20" rx="3" fill="white"/>
      <text x="70" y="73" textAnchor="middle" fontSize="7" fontWeight="bold" fill={color}>{bank==="aba"?"ABA":"ACL"}</text>
    </svg>
  );
}

function SpinIcon({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/>
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>
    </svg>
  );
}

export default function SettingsPage() {
  const [isSidebarOpen,      setIsSidebarOpen]      = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [userMenuOpen,       setUserMenuOpen]       = useState(false);
  const [activeTab,          setActiveTab]          = useState<SettingsTab>("profile");

  // Profile
  const [fullName,  setFullName]  = useState("Sok Maly");
  const [email,     setEmail]     = useState("sokmaly@gmail.com");
  const [phone,     setPhone]     = useState("012 345 678");
  const [location,  setLocation]  = useState("Phnom Penh Market");
  const [saved,     setSaved]     = useState(false);

  // Billing
  const [selectedMethod, setSelectedMethod] = useState<"aba"|"acleda">("aba");
  const [showQR,    setShowQR]    = useState(false);
  const [paying,    setPaying]    = useState(false);
  const [paid,      setPaid]      = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };
  const handlePay  = () => { setPaying(true); setTimeout(() => { setPaying(false); setPaid(true); }, 2200); };
  const changeMethod = (m: "aba"|"acleda") => { setSelectedMethod(m); setShowQR(false); setPaid(false); };

  const SUBNAV: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
    { id:"profile",       label:"My Profile",     icon:User       },
    { id:"billing",       label:"Payment Method", icon:CreditCard },
    { id:"subscriptions", label:"Subscriptions",  icon:Sparkles   },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#f0f2f5] text-[#111827]" style={{ fontFamily:"inherit" }}>
      {isSidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}

      {/* ══ SIDEBAR ══ */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 flex flex-col h-screen shrink-0 bg-[#0d1117] transition-all duration-300 ease-in-out ${isSidebarCollapsed ? "w-[68px]" : "w-[220px]"} ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        {/* Logo */}
        <div className={`flex items-center border-b border-white/[0.07] h-[70px] shrink-0 ${isSidebarCollapsed ? "justify-center" : "gap-3 px-5"}`}>
          <div className="w-9 h-9 rounded-[9px] bg-[#3ecf8e] flex items-center justify-center font-extrabold text-[#0d1117] text-[16px] shrink-0">P</div>
          {!isSidebarCollapsed && <span className="font-extrabold text-[15px] text-[#e6edf3] tracking-[0.02em] whitespace-nowrap">PsarPulse KH</span>}
          <button className="lg:hidden ml-auto bg-transparent border-0 text-[#7d8590] cursor-pointer" onClick={() => setIsSidebarOpen(false)}><X size={16} /></button>
        </div>

        {/* Nav */}
        <nav className={`flex-1 pt-3 overflow-y-auto ${isSidebarCollapsed ? "px-2" : "px-3"}`}>
          <NavItem icon={LayoutDashboard}  title="Dashboard"  href="/vendor"                   collapsed={isSidebarCollapsed} />
          <NavItem icon={CircleDollarSign} title="Sales"      href="/vendor/sales"             collapsed={isSidebarCollapsed} />
          <NavItem icon={Receipt}          title="Expenses"   href="/vendor/expenses"          collapsed={isSidebarCollapsed} />
          <NavItem icon={Users}            title="Customers"  href="/vendor/customer"          collapsed={isSidebarCollapsed} />
          <NavItem icon={Package}          title="Inventory"  href="/vendor/premium/inventory" collapsed={isSidebarCollapsed} />
          <NavItem icon={FileBarChart}     title="Reports"    href="/vendor/premium/reports"   collapsed={isSidebarCollapsed} />
          <NavItem icon={Megaphone}        title="Marketing"  href="/vendor/marketing"         collapsed={isSidebarCollapsed} />
        </nav>

        {/* Footer */}
        <div className={`pb-3 pt-2 border-t border-white/[0.07] ${isSidebarCollapsed ? "px-2" : "px-3"}`}>
          {!isSidebarCollapsed && (
            <Link href="/vendor/pricing" className="flex items-center gap-2 px-3 py-2.5 rounded-[10px] bg-[#3ecf8e] hover:bg-[#4dd49a] transition-colors no-underline mb-2">
              <Sparkles size={15} className="text-[#0d1117] shrink-0" />
              <div>
                <div className="text-[12.5px] font-bold text-[#0d1117] leading-tight">Premium Plan</div>
                <div className="text-[10px] text-[#0d1117]/70">AI Assistant Active</div>
              </div>
            </Link>
          )}

          {/* User row with dropdown */}
          <div className="relative">
            <button onClick={() => setUserMenuOpen(o => !o)}
              className={`w-full flex items-center bg-transparent border-0 cursor-pointer transition-colors rounded-[10px] hover:bg-white/[0.05] ${isSidebarCollapsed ? "justify-center h-11" : "gap-2.5 px-3 py-2.5"}`}>
              <div className="w-8 h-8 rounded-full bg-[#3ecf8e]/20 border border-[#3ecf8e]/40 flex items-center justify-center text-[12px] font-bold text-[#3ecf8e] shrink-0">
                {fullName.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase()}
              </div>
              {!isSidebarCollapsed && (
                <>
                  <span className="text-[13.5px] font-medium text-[#e6edf3] flex-1 text-left truncate">{fullName}</span>
                  <ChevronDown size={14} className={`text-[#7d8590] transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
                </>
              )}
            </button>

            {userMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                <div className="absolute bottom-[calc(100%+8px)] left-0 right-0 z-50 bg-white rounded-[16px] shadow-[0_-8px_40px_rgba(0,0,0,0.18)] border border-[#e8eaed] overflow-hidden">
                  {/* User info */}
                  <div className="flex items-center gap-3 px-4 py-4">
                    <div className="w-10 h-10 rounded-full border-2 border-[#e8eaed] flex items-center justify-center shrink-0">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                    </div>
                    <div>
                      <div className="text-[14px] font-semibold text-[#111827] leading-tight">{fullName}</div>
                      <div className="text-[12px] text-[#6b7280]">{email}</div>
                    </div>
                  </div>
                  <div className="border-t border-[#f0f2f5]" />
                  <div className="py-1.5">
                    {/* Account */}
                    <button onClick={() => { setUserMenuOpen(false); setActiveTab("profile"); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-[14px] text-[#111827] bg-transparent border-0 cursor-pointer hover:bg-[#f7f8fa] text-left transition-colors">
                      <div className="w-6 h-6 rounded-full border border-[#d1d5db] flex items-center justify-center shrink-0">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                      </div>
                      Account
                    </button>
                    {/* Premium Plan */}
                    <Link href="/vendor/pricing" onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-[14px] text-[#111827] no-underline hover:bg-[#f7f8fa] transition-colors">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>
                      Premium Plan
                    </Link>
                    {/* Settings */}
                    <button onClick={() => setUserMenuOpen(false)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-[14px] text-[#111827] bg-transparent border-0 cursor-pointer hover:bg-[#f7f8fa] text-left transition-colors">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                      Settings
                    </button>
                    <div className="mx-4 my-1 border-t border-[#f0f2f5]" />
                    {/* Log out */}
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-[14px] text-[#111827] bg-transparent border-0 cursor-pointer hover:bg-[#f7f8fa] text-left transition-colors">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                      log out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* ══ MAIN ══ */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-white">

        {/* Topbar */}
        <header className="bg-white border-b border-[#e8eaed] px-6 lg:px-8 h-[70px] flex items-center justify-between shrink-0 z-30">
          <div className="flex items-center gap-3">
            <button className="flex lg:hidden items-center justify-center w-10 h-10 rounded-[10px] bg-transparent border-0 cursor-pointer text-[#6b7280] hover:bg-[#f0f2f5]" onClick={() => setIsSidebarOpen(true)}><Menu size={22} /></button>
            <button className="hidden lg:flex items-center justify-center w-10 h-10 rounded-[10px] bg-transparent border-0 cursor-pointer text-[#6b7280] hover:bg-[#f0f2f5]" onClick={() => setIsSidebarCollapsed(c => !c)}>
              {isSidebarCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
            </button>
            <h1 className="font-semibold text-[16px] text-[#111827]">Settings</h1>
          </div>
          {/* SM avatar top-right — matches Image 3 */}
          <div className="w-9 h-9 rounded-full bg-[#3ecf8e] flex items-center justify-center text-[13px] font-bold text-[#0d1117]">
            {fullName.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase()}
          </div>
        </header>

        {/* Settings body */}
        <div className="flex-1 overflow-y-auto">

          {/* Page heading */}
          <div className="px-10 pt-8 pb-5">
            <h2 className="text-[28px] font-extrabold text-[#111827]">Settings</h2>
            <p className="text-[14px] text-[#6b7280] mt-1">Manage your account and app preferences</p>
          </div>
          <div className="border-b border-[#f0f2f5]" />

          {/* Two-column */}
          <div className="flex min-h-full">
            {/* Sub-nav */}
            <div className="w-[170px] shrink-0 border-r border-[#f0f2f5] px-3 py-6 flex flex-col gap-0.5">
              {SUBNAV.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button key={item.id} onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] text-[13.5px] border-0 cursor-pointer text-left w-full transition-all ${isActive ? "bg-[#3ecf8e] text-white font-semibold shadow-sm" : "bg-transparent text-[#374151] hover:bg-[#f0f2f5] font-medium"}`}>
                    <Icon size={14} className={isActive ? "text-white" : "text-[#9ca3af]"} />
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* Content — fills all remaining space */}
            <div className="flex-1 min-w-0 px-10 py-7">

              {/* ══ MY PROFILE ══ */}
              {activeTab === "profile" && (
                <div className="flex flex-col gap-5">
                  {/* Profile info card */}
                  <div className="border border-[#e8eaed] rounded-[14px] overflow-hidden">
                    <div className="px-6 py-4 flex items-center gap-2">
                      <User size={14} className="text-[#6b7280]" />
                      <span className="text-[14px] font-semibold text-[#111827]">Profile Information</span>
                      <span className="text-[12px] text-[#9ca3af]">ព័ត៌មានអ្នកប្រើ</span>
                    </div>

                    <div className="px-6 pb-6">
                      {/* Avatar row */}
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-[56px] h-[56px] rounded-full bg-[#3ecf8e] flex items-center justify-center text-[18px] font-extrabold text-[#0d1117] shrink-0">
                          {fullName.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-[15px] font-bold text-[#111827]">{fullName}</div>
                          <div className="text-[13px] text-[#6b7280]">{email}</div>
                        </div>
                      </div>

                      {/* Fields grid */}
                      <div className="grid grid-cols-2 gap-4 mb-5">
                        <div>
                          <label className="block text-[12px] font-semibold text-[#6b7280] mb-1.5">Full Name</label>
                          <div className="flex items-center gap-2 px-3 py-2.5 border border-[#e8eaed] rounded-[9px] bg-white focus-within:border-[#3ecf8e] transition-colors">
                            <User size={13} className="text-[#9ca3af] shrink-0" />
                            <input value={fullName} onChange={e => setFullName(e.target.value)}
                              className="flex-1 bg-transparent border-0 outline-none text-[13.5px] text-[#111827]" style={{ fontFamily:"inherit" }} />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[12px] font-semibold text-[#6b7280] mb-1.5">Email</label>
                          <div className="flex items-center gap-2 px-3 py-2.5 border border-[#e8eaed] rounded-[9px] bg-white focus-within:border-[#3ecf8e] transition-colors">
                            <Mail size={13} className="text-[#9ca3af] shrink-0" />
                            <input value={email} onChange={e => setEmail(e.target.value)}
                              className="flex-1 bg-transparent border-0 outline-none text-[13.5px] text-[#111827]" style={{ fontFamily:"inherit" }} />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[12px] font-semibold text-[#6b7280] mb-1.5">Phone</label>
                          <div className="flex items-center gap-2 px-3 py-2.5 border border-[#e8eaed] rounded-[9px] bg-white focus-within:border-[#3ecf8e] transition-colors">
                            <Phone size={13} className="text-[#9ca3af] shrink-0" />
                            <input value={phone} onChange={e => setPhone(e.target.value)}
                              className="flex-1 bg-transparent border-0 outline-none text-[13.5px] text-[#111827]" style={{ fontFamily:"inherit" }} />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[12px] font-semibold text-[#6b7280] mb-1.5">Stall Location</label>
                          <div className="flex items-center gap-2 px-3 py-2.5 border border-[#e8eaed] rounded-[9px] bg-white focus-within:border-[#3ecf8e] transition-colors">
                            <MapPin size={13} className="text-[#9ca3af] shrink-0" />
                            <input value={location} onChange={e => setLocation(e.target.value)}
                              className="flex-1 bg-transparent border-0 outline-none text-[13.5px] text-[#111827]" style={{ fontFamily:"inherit" }} />
                          </div>
                        </div>
                      </div>

                      <button onClick={handleSave}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-[9px] font-bold text-[13.5px] border-0 cursor-pointer transition-all ${saved ? "bg-[rgba(62,207,142,0.12)] text-[#3ecf8e]" : "bg-[#111827] text-white hover:bg-[#1f2937]"}`}>
                        {saved ? <><CheckCircle2 size={14} /> Saved!</> : "Save Changes"}
                      </button>
                    </div>
                  </div>

                  {/* Language card */}
                  <div className="border border-[#e8eaed] rounded-[14px] overflow-hidden">
                    <div className="px-6 py-4 flex items-center gap-2">
                      <Globe size={14} className="text-[#6b7280]" />
                      <span className="text-[14px] font-semibold text-[#111827]">Language (ភាសា)</span>
                    </div>
                    <div className="px-6 pb-5 flex flex-col gap-2">
                      {[{ label:"English (Default)", val:"en" }, { label:"ភាសាខ្មែរ", val:"km" }].map(lang => (
                        <label key={lang.val} className="flex items-center justify-between px-4 py-3 border border-[#e8eaed] rounded-[10px] cursor-pointer hover:bg-[#fafafa] transition-colors">
                          <span className="text-[13.5px] text-[#111827]">{lang.label}</span>
                          <div className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center ${lang.val==="en" ? "border-[#3ecf8e]" : "border-[#d1d5db]"}`}>
                            {lang.val==="en" && <div className="w-2.5 h-2.5 rounded-full bg-[#3ecf8e]" />}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ══ PAYMENT METHOD ══ */}
              {activeTab === "billing" && (
                <div className="flex flex-col gap-5">

                  {/* Method picker */}
                  <div>
                    <p className="text-[12px] font-bold text-[#9ca3af] uppercase tracking-[0.07em] mb-3">Select QR Method</p>
                    <div className="grid grid-cols-2 gap-3">
                      {(["aba","acleda"] as const).map(bank => (
                        <button key={bank} onClick={() => changeMethod(bank)}
                          className={`relative flex items-center gap-4 px-5 py-4 rounded-[12px] border-2 cursor-pointer bg-white text-left transition-all ${selectedMethod===bank ? "border-[#3ecf8e]" : "border-[#e8eaed] hover:border-[#d1d5db]"}`}>
                          {selectedMethod===bank && (
                            <div className="absolute top-3 right-3 w-[18px] h-[18px] rounded-full bg-[#3ecf8e] flex items-center justify-center">
                              <Check size={10} className="text-white" strokeWidth={3} />
                            </div>
                          )}
                          <div className={`w-12 h-12 rounded-[10px] flex flex-col items-center justify-center shrink-0 ${bank==="aba" ? "bg-[#d32f2f]" : "bg-[#1565c0]"}`}>
                            <span className="text-white font-extrabold text-[13px] leading-tight">{bank==="aba" ? "ABA" : "ACLEDA"}</span>
                            {bank==="acleda" && <span className="text-white/70 text-[8px]">BANK</span>}
                          </div>
                          <div>
                            <div className="text-[14px] font-bold text-[#111827]">{bank==="aba" ? "ABA KHQR" : "ACLEDA QR"}</div>
                            <div className="text-[11.5px] text-[#9ca3af]">{bank==="aba" ? "Advanced Bank of Asia" : "ACLEDA Bank Plc."}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* QR card */}
                  <div className="border border-[#e8eaed] rounded-[14px] overflow-hidden">
                    <div className="px-6 py-4 border-b border-[#f0f2f5] flex items-center justify-between">
                      <div>
                        <div className="text-[14px] font-semibold text-[#111827]">{selectedMethod==="aba" ? "ABA KHQR" : "ACLEDA QR"} — $7.00 / month</div>
                        <div className="text-[12px] text-[#9ca3af] mt-0.5">Scan with {selectedMethod==="aba" ? "ABA Mobile" : "ACLEDA Mobile"} app to pay</div>
                      </div>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[rgba(62,207,142,0.08)] border border-[rgba(62,207,142,0.2)] rounded-[8px]">
                        <Shield size={11} className="text-[#3ecf8e]" />
                        <span className="text-[11px] font-bold text-[#3ecf8e]">Secure</span>
                      </div>
                    </div>

                    <div className="p-6">
                      {/* Pre-generate */}
                      {!showQR && !paid && (
                        <div className="flex flex-col items-center py-4">
                          <div className="w-[68px] h-[68px] rounded-[14px] bg-[#f7f8fa] border-2 border-dashed border-[#e8eaed] flex items-center justify-center mb-4">
                            <QrCode size={28} className="text-[#d1d5db]" />
                          </div>
                          <p className="text-[13.5px] text-[#6b7280] mb-5 text-center">Generate your {selectedMethod==="aba" ? "ABA KHQR" : "ACLEDA QR"} code to complete payment</p>
                          <button onClick={() => setShowQR(true)}
                            className="flex items-center gap-2 bg-[#3ecf8e] text-[#0d1117] border-0 rounded-[10px] px-7 py-3 font-bold text-[14px] cursor-pointer shadow-[0_3px_14px_rgba(62,207,142,0.28)] hover:bg-[#4dd49a] transition-colors">
                            <QrCode size={15} /> Generate QR Code
                          </button>
                        </div>
                      )}

                      {/* QR displayed */}
                      {showQR && !paid && (
                        <div className="flex gap-7 items-start">
                          <div className="shrink-0 flex flex-col items-center">
                            <div className={`rounded-[12px] border-[3px] p-2.5 ${selectedMethod==="aba" ? "border-[#d32f2f]" : "border-[#1565c0]"}`}>
                              <QRCode bank={selectedMethod} />
                            </div>
                            <span className={`text-[12px] font-bold mt-2 ${selectedMethod==="aba" ? "text-[#d32f2f]" : "text-[#1565c0]"}`}>
                              {selectedMethod==="aba" ? "ABA KHQR" : "ACLEDA QR"}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0 pt-1">
                            <div className="text-[14px] font-bold text-[#111827] mb-3">How to pay</div>
                            <div className="flex flex-col gap-2.5 mb-4">
                              {[
                                `Open ${selectedMethod==="aba" ? "ABA Mobile" : "ACLEDA Mobile"} app`,
                                "Tap the QR scan icon",
                                "Point camera at QR code",
                                "Confirm $7.00 payment",
                              ].map((step, i) => (
                                <div key={i} className="flex items-center gap-3">
                                  <div className="w-[22px] h-[22px] rounded-full bg-[rgba(62,207,142,0.12)] border border-[rgba(62,207,142,0.25)] flex items-center justify-center shrink-0">
                                    <span className="text-[11px] font-bold text-[#3ecf8e]">{i+1}</span>
                                  </div>
                                  <span className="text-[13px] text-[#374151]">{step}</span>
                                </div>
                              ))}
                            </div>
                            <div className="flex items-center gap-2 px-3 py-2 bg-[rgba(245,158,11,0.06)] border border-[rgba(245,158,11,0.2)] rounded-[9px] mb-4">
                              <Clock size={12} className="text-[#f59e0b] shrink-0" />
                              <span className="text-[12px] text-[#92400e]">QR expires in <strong>15 minutes</strong></span>
                            </div>
                            <button onClick={handlePay} disabled={paying}
                              className={`w-full flex items-center justify-center gap-2 rounded-[10px] py-3 font-bold text-[13.5px] border-0 cursor-pointer transition-all ${paying ? "bg-[rgba(62,207,142,0.1)] text-[#3ecf8e]" : "bg-[#111827] text-white hover:bg-[#1f2937]"}`}>
                              {paying ? <><SpinIcon size={14} className="animate-spin" /> Confirming...</> : <><CheckCircle2 size={15} /> I've Paid</>}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Paid */}
                      {paid && (
                        <div className="flex flex-col items-center py-6">
                          <div className="w-14 h-14 rounded-full bg-[rgba(62,207,142,0.12)] border-2 border-[#3ecf8e] flex items-center justify-center mb-3">
                            <CheckCircle2 size={26} className="text-[#3ecf8e]" />
                          </div>
                          <div className="text-[18px] font-extrabold text-[#111827] mb-1">Payment Confirmed!</div>
                          <div className="text-[13px] text-[#6b7280] mb-1">$7.00 received via {selectedMethod==="aba" ? "ABA KHQR" : "ACLEDA QR"}</div>
                          <div className="text-[12px] text-[#9ca3af]">Premium Plan renewed until May 1, 2026</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Security */}
                  <div className="flex items-start gap-2.5 px-4 py-3 bg-[rgba(59,130,246,0.04)] border border-[rgba(59,130,246,0.12)] rounded-[10px]">
                    <Shield size={13} className="text-[#3b82f6] shrink-0 mt-0.5" />
                    <p className="text-[12px] text-[#374151]">Payments processed securely via ABA PayWay & KHQR. PsarPulse KH never stores your banking credentials.</p>
                  </div>

                  {/* History toggle */}
                  <div>
                    <button onClick={() => setShowHistory(h => !h)}
                      className="flex items-center gap-1.5 text-[13px] font-semibold text-[#6b7280] hover:text-[#111827] bg-transparent border-0 cursor-pointer mb-3 transition-colors">
                      <ChevronDown size={14} className={`transition-transform ${showHistory ? "rotate-180" : ""}`} />
                      {showHistory ? "Hide" : "View"} Payment History
                    </button>
                    {showHistory && (
                      <div className="border border-[#e8eaed] rounded-[12px] overflow-hidden">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="border-b border-[#f0f2f5] bg-[#fafafa]">
                              {["Date","Plan","Amount","Method"].map(h => (
                                <th key={h} className="px-4 py-3 text-[10.5px] font-bold text-[#9ca3af] uppercase tracking-[0.07em]">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {TRANSACTION_HISTORY.map((tx, i) => (
                              <tr key={i} className={`hover:bg-[#f7f8fa] ${i<TRANSACTION_HISTORY.length-1?"border-b border-[#f0f2f5]":""}`}>
                                <td className="px-4 py-3 text-[12.5px] text-[#6b7280]">{tx.date}</td>
                                <td className="px-4 py-3 text-[12.5px] font-medium text-[#111827]">{tx.plan}</td>
                                <td className="px-4 py-3 text-[13px] font-bold text-[#111827]">{tx.amount}</td>
                                <td className="px-4 py-3">
                                  <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-[3px] rounded-full border ${tx.method==="ABA KHQR" ? "bg-[rgba(211,47,47,0.07)] text-[#d32f2f] border-[rgba(211,47,47,0.2)]" : "bg-[rgba(21,101,192,0.07)] text-[#1565c0] border-[rgba(21,101,192,0.2)]"}`}>
                                    <QrCode size={9} />{tx.method}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ══ SUBSCRIPTIONS ══ */}
              {activeTab === "subscriptions" && (
                <div className="flex flex-col gap-5">
                  <div className="flex items-center gap-2 mb-1">
                    <CreditCard size={14} className="text-[#6b7280]" />
                    <span className="text-[14px] font-semibold text-[#111827]">Subscription &amp; Billing</span>
                    <span className="text-[12px] text-[#9ca3af]">ការជាវ</span>
                  </div>

                  {/* Current plan */}
                  <div className="border border-[rgba(62,207,142,0.3)] rounded-[14px] bg-[rgba(62,207,142,0.03)] px-5 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-[9px] bg-gradient-to-br from-[#8b5cf6] to-[#3ecf8e] flex items-center justify-center shrink-0">
                        <Sparkles size={15} className="text-white" />
                      </div>
                      <div>
                        <div className="text-[14px] font-bold text-[#111827]">Premium Plan</div>
                        <div className="text-[12px] text-[#6b7280] mt-0.5">Access to AI · Accounting · Inventory · Advanced Analytics</div>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <div className="text-[10.5px] font-semibold text-[#9ca3af] whitespace-nowrap">Next Billing Date</div>
                      <div className="text-[13px] font-bold text-[#111827]">April 25, 2026</div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => setActiveTab("billing")}
                      className="flex-1 py-3 rounded-[10px] bg-[#3ecf8e] text-[#0d1117] font-bold text-[13.5px] border-0 cursor-pointer shadow-[0_2px_12px_rgba(62,207,142,0.25)] hover:bg-[#4dd49a] transition-colors">
                      Manage Subscription
                    </button>
                    <button onClick={() => { setActiveTab("billing"); setShowHistory(true); }}
                      className="flex-1 py-3 rounded-[10px] bg-white text-[#111827] font-semibold text-[13.5px] border border-[#e8eaed] cursor-pointer hover:bg-[#f7f8fa] transition-colors">
                      View Payment History
                    </button>
                  </div>

                  <div className="text-[12px] text-[#9ca3af] flex items-center gap-1.5">
                    <Shield size={11} className="text-[#9ca3af]" />
                    Payments securely processed via ABA PayWay &amp; KHQR
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon: Icon, title, href, active = false, collapsed = false }: NavItemProps) {
  return (
    <Link href={href} title={collapsed ? title : undefined}
      className={`flex items-center rounded-[10px] mb-0.5 no-underline transition-all duration-[120ms] ${collapsed ? "justify-center w-full h-11" : "gap-3 px-4 py-2.5"} ${active ? "bg-[rgba(62,207,142,0.12)] text-[#3ecf8e]" : "bg-transparent text-[#7d8590] hover:bg-white/[0.05] hover:text-[#e6edf3]"}`}>
      <Icon size={18} />
      {!collapsed && <span className={`text-[14px] ${active ? "font-semibold" : "font-normal"}`}>{title}</span>}
    </Link>
  );
}