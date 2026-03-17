"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard, CircleDollarSign, Receipt, Users, Package,
  Settings, TrendingUp, TrendingDown, Menu, X, ChevronRight,
  Sparkles, Brain, AlertTriangle, FileBarChart, Plus, Edit2, Trash2,
  Search, Filter, Lightbulb, ShoppingCart, Home, Car, Bolt,
  UserCheck, MoreHorizontal, Target, CloudSun, Megaphone,
  MessageSquare, Send, RefreshCw, Tag, Repeat,
  PanelLeftClose, PanelLeftOpen, FileText, FileSpreadsheet, Bell,
  CheckCircle2,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────
type TabId        = "overview" | "recurring" | "insights" | "forecast" | "history";
type CatColor     = "emerald" | "indigo" | "violet" | "amber" | "red" | "slate";
type AnomalyFlag  = "high" | "medium" | null;
interface NavItemProps { icon: React.ElementType; title: string; href: string; active?: boolean; collapsed?: boolean; }
interface ChatMsg  { role: "assistant" | "user"; text: string; }
interface PushAlert { title: string; message: string; time: string; icon: React.ElementType; }

interface RecurringItem { name: string; khmer: string; amount: string; frequency: string; nextDue: string; color: CatColor; }
interface Category      { name: string; khmer: string; amount: string; pct: number; color: CatColor; icon: React.ElementType; }
interface ExpenseRecord { time: string; category: string; note: string; amount: number; categoryColor: CatColor; recurring: boolean; anomaly: AnomalyFlag; anomalyNote: string | null; }
interface ForecastItem  { category: string; predicted: string; change: string; up: boolean | null; reason: string; }

// ─── Color maps ────────────────────────────────────────────────────
const catColorMap: Record<CatColor, { iconBg: string; iconText: string; badge: string; bar: string; recurBg: string; recurBorder: string }> = {
  emerald: { iconBg:"bg-[rgba(62,207,142,0.12)]",  iconText:"text-[#3ecf8e]", badge:"bg-[rgba(62,207,142,0.1)] text-[#3ecf8e] border border-[rgba(62,207,142,0.25)]",   bar:"#3ecf8e", recurBg:"bg-[rgba(62,207,142,0.05)]",  recurBorder:"border-[rgba(62,207,142,0.2)]"  },
  indigo:  { iconBg:"bg-[rgba(99,102,241,0.1)]",   iconText:"text-[#6366f1]", badge:"bg-[rgba(99,102,241,0.1)] text-[#6366f1] border border-[rgba(99,102,241,0.2)]",    bar:"#6366f1", recurBg:"bg-[rgba(99,102,241,0.05)]",  recurBorder:"border-[rgba(99,102,241,0.15)]" },
  violet:  { iconBg:"bg-[rgba(139,92,246,0.1)]",   iconText:"text-[#8b5cf6]", badge:"bg-[rgba(139,92,246,0.1)] text-[#8b5cf6] border border-[rgba(139,92,246,0.2)]",   bar:"#8b5cf6", recurBg:"bg-[rgba(139,92,246,0.05)]", recurBorder:"border-[rgba(139,92,246,0.15)]" },
  amber:   { iconBg:"bg-[rgba(245,158,11,0.1)]",   iconText:"text-[#f59e0b]", badge:"bg-[rgba(245,158,11,0.1)] text-[#f59e0b] border border-[rgba(245,158,11,0.2)]",   bar:"#f59e0b", recurBg:"bg-[rgba(245,158,11,0.05)]", recurBorder:"border-[rgba(245,158,11,0.15)]" },
  red:     { iconBg:"bg-[rgba(239,68,68,0.1)]",    iconText:"text-[#ef4444]", badge:"bg-[rgba(239,68,68,0.1)] text-[#ef4444] border border-[rgba(239,68,68,0.2)]",     bar:"#ef4444", recurBg:"bg-[rgba(239,68,68,0.05)]",  recurBorder:"border-[rgba(239,68,68,0.15)]"  },
  slate:   { iconBg:"bg-[#f0f2f5]",                iconText:"text-[#6b7280]", badge:"bg-[#f0f2f5] text-[#6b7280] border border-[#e8eaed]",                              bar:"#9ca3af", recurBg:"bg-[#f7f8fa]",               recurBorder:"border-[#e8eaed]"               },
};

// ─── Data ─────────────────────────────────────────────────────────
const pushAlerts: PushAlert[] = [
  { title:"Ingredient Costs Up 30%",      icon:TrendingUp,    message:"Pork & vegetables spending jumped 30% vs last week. Likely linked to market price surge — review supplier pricing.",                    time:"2 hours ago" },
  { title:"Unusual Spending Detected",    icon:AlertTriangle, message:"Transport costs logged twice today ($7.00 total) — AI flagged this as a possible duplicate entry. Please review.",                      time:"45 min ago"  },
  { title:"Budget Tip: Rainy Evening",    icon:CloudSun,      message:"Rainy evening predicted — Hot Latte demand rising. Consider increasing ingredient budget by 15% for tomorrow.",                         time:"30 min ago"  },
];

const recurringItems: RecurringItem[] = [
  { name:"Monthly Stall Rent",  khmer:"ថ្លៃជួល",      amount:"$80.00", frequency:"Monthly", nextDue:"Nov 1",  color:"indigo"  },
  { name:"Weekly Electricity",  khmer:"អគ្គិសនី",     amount:"$15.00", frequency:"Weekly",  nextDue:"Oct 29", color:"amber"   },
  { name:"Assistant Pay",       khmer:"ម្ចាស់ពលកម្ម", amount:"$10.00", frequency:"Weekly",  nextDue:"Oct 30", color:"red"     },
  { name:"Market Fees",         khmer:"ថ្លៃទីផ្សារ",  amount:"$5.00",  frequency:"Monthly", nextDue:"Nov 1",  color:"violet"  },
];

const aiInsights = [
  { icon:AlertTriangle, tag:"Warning",  tagColor:"#ef4444", title:"Rent is 60% of expenses",           detail:"Above the healthy 40% threshold for market stalls. Consider renegotiating or finding lower-cost alternatives.",  action:"View alternatives" },
  { icon:Lightbulb,     tag:"Tip",      tagColor:"#f59e0b", title:"Ingredient costs reducible by ~18%", detail:"Vendors near Orussey Market charge 18% less for similar pork cuts on Tuesday mornings.",                           action:"See market tips"   },
  { icon:CheckCircle2,  tag:"Positive", tagColor:"#3ecf8e", title:"Transport costs optimized",          detail:"Your TukTuk usage is 32% below average for similar stalls. Keep minimizing transport!",                            action:"Keep it up"        },
];

const categories: Category[] = [
  { name:"Ingredients", khmer:"គ្រឿងផ្សំ",   amount:"$25.00", pct:19, color:"emerald", icon:ShoppingCart   },
  { name:"Rent",        khmer:"ថ្លៃជួល",      amount:"$80.00", pct:60, color:"indigo",  icon:Home           },
  { name:"Transport",   khmer:"ការដឹកជញ្ជូន", amount:"$3.50",  pct:3,  color:"violet",  icon:Car            },
  { name:"Electricity", khmer:"អគ្គិសនី",     amount:"$15.00", pct:11, color:"amber",   icon:Bolt           },
  { name:"Labor",       khmer:"ម្ចាស់ពលកម្ម", amount:"$10.00", pct:7,  color:"red",     icon:UserCheck      },
  { name:"Others",      khmer:"ផ្សេងៗ",        amount:"$0.00",  pct:0,  color:"slate",   icon:MoreHorizontal },
];

const forecastItems: ForecastItem[] = [
  { category:"Ingredients", predicted:"$28.00", change:"+12%", up:true,  reason:"Weekend market prices higher"   },
  { category:"Rent",        predicted:"$80.00", change:"0%",   up:null,  reason:"Fixed monthly cost"             },
  { category:"Transport",   predicted:"$5.00",  change:"+43%", up:true,  reason:"2 extra market trips predicted" },
  { category:"Electricity", predicted:"$17.00", change:"+13%", up:true,  reason:"Extended evening hours"         },
  { category:"Labor",       predicted:"$10.00", change:"0%",   up:null,  reason:"Regular schedule maintained"    },
];

const expenseHistory: ExpenseRecord[] = [
  { time:"2:15 PM",    category:"Ingredients", note:"Pork and Vegetables", amount:25.00, categoryColor:"emerald", recurring:false, anomaly:"medium", anomalyNote:"30% above weekly average"            },
  { time:"10:00 AM",   category:"Transport",   note:"TukTuk to market",    amount:3.50,  categoryColor:"violet",  recurring:false, anomaly:"high",   anomalyNote:"Possible duplicate — logged twice today" },
  { time:"Yesterday",  category:"Electricity", note:"Weekly stall power",  amount:15.00, categoryColor:"amber",   recurring:true,  anomaly:null,     anomalyNote:null },
  { time:"Yesterday",  category:"Labor",       note:"Assistant pay",       amount:10.00, categoryColor:"red",     recurring:false, anomaly:null,     anomalyNote:null },
  { time:"2 days ago", category:"Rent",        note:"Monthly stall rent",  amount:80.00, categoryColor:"indigo",  recurring:true,  anomaly:null,     anomalyNote:null },
];

const geminiTips = [
  { tip:"Buy ingredients Tuesday 6–8 AM at Orussey Market",    saving:"Save ~$4.50/week", emoji:"🌅" },
  { tip:"Batch electricity usage — turn off fans after 9 PM",  saving:"Save ~$2/week",    emoji:"⚡" },
  { tip:"Share TukTuk with Stall B41 for shared market runs",  saving:"Save ~$1.50/trip", emoji:"🛺" },
];

const TABS: { id: TabId; label: string; khmer: string }[] = [
  { id:"overview",  label:"Overview",            khmer:"ទិដ្ឋភាពទូទៅ"           },
  { id:"recurring", label:"Recurring Detection", khmer:"ចំណាយដដែល"              },
  { id:"insights",  label:"AI Insights",         khmer:"ការវិភាគ AI"             },
  { id:"forecast",  label:"Forecast",            khmer:"ការព្យាករណ៍"             },
  { id:"history",   label:"Expense History",     khmer:"ប្រវត្តិចំណាយ"           },
];

const initChat: ChatMsg[] = [
  { role:"assistant", text:"សួស្តី! I'm your AI Expense Assistant. Ask me anything about your spending patterns or how to cut costs!" },
  { role:"assistant", text:"Try: 'Where am I spending too much?' or 'How can I reduce costs this week?'" },
];

// ═══════════════════════════════════════════════════════
export default function PremiumExpensesPage() {
  const [isSidebarOpen,      setIsSidebarOpen]      = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [userMenuOpen,       setUserMenuOpen]       = useState(false);
  const [isNotifOpen,        setIsNotifOpen]        = useState(false);
  const [activeTab,          setActiveTab]          = useState<TabId>("overview");
  const [searchQuery,        setSearchQuery]        = useState("");
  const [isChatOpen,         setIsChatOpen]         = useState(false);
  const [chatMsg,            setChatMsg]            = useState("");
  const [chatMessages,       setChatMessages]       = useState<ChatMsg[]>(initChat);
  const [dismissed,          setDismissed]          = useState<number[]>([]);

  const visibleAlerts = pushAlerts.filter((_,i) => !dismissed.includes(i));

  const handleSend = () => {
    if (!chatMsg.trim()) return;
    setChatMessages(p => [...p, { role:"user", text:chatMsg }]);
    setChatMsg("");
    setTimeout(() => setChatMessages(p => [...p, { role:"assistant", text:"Based on your data, Rent at 60% is your biggest concern. I'd suggest approaching your landlord about a 10% reduction — similar stalls in the same market pay $72/month on average. Want me to draft a negotiation note?" }]), 900);
  };

  const filteredHistory = expenseHistory.filter(e =>
    e.note.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[#f0f2f5] text-[#111827]" style={{ fontFamily:"inherit" }}>
      {isSidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}

      {/* ══ SIDEBAR ══ */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 flex flex-col h-screen shrink-0 bg-[#0d1117] transition-all duration-300 ease-in-out ${isSidebarCollapsed ? "w-[68px]" : "w-72"} ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className={`flex items-center border-b border-white/[0.07] h-[70px] shrink-0 ${isSidebarCollapsed ? "justify-center" : "justify-between px-6"}`}>
          {!isSidebarCollapsed ? (
            <Link href="/vendor" className="flex items-center gap-3 no-underline">
              <div className="w-10 h-10 rounded-[10px] bg-[#3ecf8e] flex items-center justify-center font-extrabold text-[#0d1117] text-[17px] shrink-0">P</div>
              <span className="font-extrabold text-[16px] text-[#e6edf3] tracking-[0.02em] whitespace-nowrap">PsarPulse KH</span>
            </Link>
          ) : (
            <Link href="/vendor" className="no-underline"><div className="w-10 h-10 rounded-[10px] bg-[#3ecf8e] flex items-center justify-center font-extrabold text-[#0d1117] text-[17px]">P</div></Link>
          )}
          <button className="lg:hidden bg-transparent border-0 text-[#7d8590] cursor-pointer p-0 shrink-0" onClick={() => setIsSidebarOpen(false)}><X size={18} /></button>
        </div>

        <nav className={`flex-1 pt-3 overflow-y-auto ${isSidebarCollapsed ? "px-2" : "px-3"}`}>
          <NavItem icon={LayoutDashboard}  title="Dashboard"  href="/vendor"                   collapsed={isSidebarCollapsed} />
          <NavItem icon={CircleDollarSign} title="Sales"      href="/vendor/sales"             collapsed={isSidebarCollapsed} />
          <NavItem icon={Receipt}          title="Expenses"   href="/vendor/expenses"          collapsed={isSidebarCollapsed} active />
          <NavItem icon={Users}            title="Customers"  href="/vendor/customer"          collapsed={isSidebarCollapsed} />
          <NavItem icon={Package}          title="Inventory"  href="/vendor/premium/inventory" collapsed={isSidebarCollapsed} />
          <NavItem icon={FileBarChart}     title="Reports"    href="/vendor/premium/reports"   collapsed={isSidebarCollapsed} />
          <NavItem icon={Megaphone}        title="Marketing"  href="/vendor/marketing"         collapsed={isSidebarCollapsed} />
        </nav>

        <div className={`pb-3 pt-2 border-t border-white/[0.07] ${isSidebarCollapsed ? "px-2" : "px-3"}`}>
          <NavItem icon={Settings} title="Settings" href="/vendor/settings" collapsed={isSidebarCollapsed} />
          {!isSidebarCollapsed && (
            <>
              <div className="mt-2 px-4 py-3.5 rounded-[11px] bg-gradient-to-r from-[rgba(139,92,246,0.15)] to-[rgba(62,207,142,0.1)] border border-[rgba(139,92,246,0.25)]">
                <div className="flex items-center gap-2 mb-1"><Sparkles size={13} className="text-[#8b5cf6]" /><span className="text-[13px] font-semibold text-[#e6edf3]">Premium Plan</span></div>
                <p className="text-[11px] text-[#7d8590] mb-2.5">$7/month · Gemini AI Active</p>
                <Link href="/vendor/pricing" className="block text-center text-[12px] font-bold text-[#8b5cf6] bg-[rgba(139,92,246,0.12)] py-2 rounded-[8px] no-underline hover:bg-[rgba(139,92,246,0.2)] transition-colors">Manage Plan</Link>
              </div>
              <div className="relative mt-1">
                <button onClick={() => setUserMenuOpen(o => !o)} className="w-full flex items-center gap-3 px-3 pt-4 pb-2 cursor-pointer bg-transparent border-0 text-left">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#3ecf8e] to-[#1a9c65] flex items-center justify-center text-[13px] font-bold text-white shrink-0">SM</div>
                  <span className="text-[14px] font-medium text-[#e6edf3] flex-1">Sok Maly</span>
                  <ChevronRight size={15} className={`text-[#7d8590] transition-transform duration-200 ${userMenuOpen ? "-rotate-90" : ""}`} />
                </button>
                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute bottom-[calc(100%-8px)] left-3 right-3 z-50 bg-white rounded-[16px] shadow-[0_4px_32px_rgba(0,0,0,0.14)] border border-[#e8eaed] overflow-hidden">
                      <div className="flex items-center gap-3 px-5 py-4 border-b border-[#f0f2f5]">
                        <div className="w-10 h-10 rounded-full border-2 border-[#e8eaed] flex items-center justify-center shrink-0"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg></div>
                        <div><div className="text-[14px] font-semibold text-[#111827]">Sok Maly</div><div className="text-[12px] text-[#6b7280]">sokmaly@gmail.com</div></div>
                      </div>
                      <div className="py-1">
                        <Link href="/vendor/settings" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3.5 px-5 py-3 text-[14px] text-[#111827] no-underline hover:bg-[#f7f8fa]"><div className="w-5 h-5 rounded-full border border-[#d1d5db] flex items-center justify-center"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg></div>account</Link>
                        <Link href="/vendor/pricing" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3.5 px-5 py-3 text-[14px] text-[#111827] no-underline hover:bg-[#f7f8fa]"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>Premium Plan</Link>
                        <div className="my-1 border-t border-[#f0f2f5]" />
                        <button className="w-full flex items-center gap-3.5 px-5 py-3 text-[14px] text-[#111827] bg-transparent border-0 cursor-pointer hover:bg-[#f7f8fa] text-left"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>log out</button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
          {isSidebarCollapsed && <div className="flex justify-center pt-3 pb-1"><div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#3ecf8e] to-[#1a9c65] flex items-center justify-center text-[13px] font-bold text-white">SM</div></div>}
        </div>
      </aside>

      {/* ══ MAIN ══ */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">

        {/* Topbar */}
        <header className="bg-white border-b border-[#e8eaed] px-5 lg:px-7 h-[70px] flex items-center justify-between shrink-0 z-30">
          <div className="flex items-center gap-3">
            <button className="flex lg:hidden items-center justify-center w-10 h-10 rounded-[10px] bg-transparent border-0 cursor-pointer text-[#6b7280] hover:bg-[#f0f2f5]" onClick={() => setIsSidebarOpen(true)}><Menu size={22} /></button>
            <button className="hidden lg:flex items-center justify-center w-10 h-10 rounded-[10px] bg-transparent border-0 cursor-pointer text-[#6b7280] hover:bg-[#f0f2f5]" onClick={() => setIsSidebarCollapsed(c => !c)}>
              {isSidebarCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
            </button>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-[20px] text-[#111827]">Expenses</h1>
              <span className="text-[13px] text-[#6b7280] hidden sm:block">ការគ្រប់គ្រងចំណាយ</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[rgba(139,92,246,0.1)] text-[#8b5cf6] text-[11px] font-bold rounded-full border border-[rgba(139,92,246,0.2)]"><Sparkles size={10} /> PREMIUM</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="hidden sm:flex items-center gap-1.5 bg-[#0d1117] text-white border-0 rounded-[10px] px-3.5 py-[9px] font-semibold text-[13px] cursor-pointer hover:bg-[#1a2332] transition-colors"><FileText size={14} /> PDF</button>
            <button className="hidden sm:flex items-center gap-1.5 bg-white border border-[#e8eaed] text-[#111827] rounded-[10px] px-3.5 py-[9px] font-semibold text-[13px] cursor-pointer hover:bg-[#f0f2f5] transition-colors"><FileSpreadsheet size={14} /> Excel</button>
            <button onClick={() => setIsChatOpen(o => !o)} className="flex items-center gap-1.5 bg-gradient-to-r from-[#8b5cf6] to-[#3ecf8e] text-white border-0 rounded-[10px] px-3.5 py-[9px] font-bold text-[13px] cursor-pointer hover:opacity-90"><Brain size={14} /> Gemini AI</button>
            <button className="flex items-center gap-1.5 bg-[#3ecf8e] text-[#0d1117] border-0 rounded-[10px] px-4 py-[9px] font-bold text-[13px] cursor-pointer shadow-[0_2px_14px_rgba(62,207,142,0.28)] hover:bg-[#4dd49a] transition-colors"><Plus size={14} /> Add Expense</button>
            {/* Bell */}
            <div className="relative">
              <button onClick={() => setIsNotifOpen(o => !o)} className="relative w-10 h-10 flex items-center justify-center rounded-[10px] bg-transparent border-0 cursor-pointer text-[#6b7280] hover:bg-[#f0f2f5]">
                <Bell size={18} />
                {visibleAlerts.length > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-[#ef4444] rounded-full border-2 border-white" />}
              </button>
              {isNotifOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsNotifOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-[380px] bg-white rounded-[16px] shadow-[0_16px_48px_rgba(0,0,0,0.16)] border border-[#e8eaed] z-50 overflow-hidden">
                    <div className="px-5 py-4 border-b border-[#f0f2f5] flex items-center justify-between">
                      <div><p className="font-bold text-[14px] text-[#111827]">Notifications</p><p className="text-[11px] text-[#9ca3af] mt-0.5">{visibleAlerts.length} unread</p></div>
                      <button onClick={() => setIsNotifOpen(false)} className="text-[#9ca3af] hover:text-[#111827] bg-transparent border-0 cursor-pointer p-1 rounded-[8px] hover:bg-[#f0f2f5]"><X size={15} /></button>
                    </div>
                    <div className="max-h-[340px] overflow-y-auto divide-y divide-[#f0f2f5]">
                      {visibleAlerts.length === 0 ? (
                        <div className="px-5 py-10 text-center"><Bell size={28} className="text-[#e8eaed] mx-auto mb-2" /><p className="text-[13px] text-[#9ca3af]">No new notifications</p></div>
                      ) : visibleAlerts.map((alert, i) => {
                        const Icon = alert.icon;
                        const orig = pushAlerts.indexOf(alert);
                        return (
                          <div key={i} className="flex items-start gap-3 px-5 py-4 hover:bg-[#f7f8fa]">
                            <div className="w-8 h-8 rounded-[9px] bg-[#f0f2f5] flex items-center justify-center shrink-0 mt-0.5"><Icon size={14} className="text-[#6b7280]" /></div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[13px] font-bold text-[#111827]">{alert.title}</p>
                              <p className="text-[12px] text-[#6b7280] mt-0.5 leading-relaxed">{alert.message}</p>
                              <p className="text-[11px] text-[#9ca3af] mt-1">{alert.time}</p>
                            </div>
                            <button onClick={() => setDismissed(d => [...d, orig])} className="text-[11px] font-semibold text-[#9ca3af] hover:text-[#6b7280] bg-transparent border-0 cursor-pointer px-2 py-1 rounded-[7px] hover:bg-[#f0f2f5] shrink-0 mt-0.5">Dismiss</button>
                          </div>
                        );
                      })}
                    </div>
                    {visibleAlerts.length > 0 && <div className="px-5 py-3 border-t border-[#f0f2f5]"><button onClick={() => { setDismissed(pushAlerts.map((_,i)=>i)); setIsNotifOpen(false); }} className="text-[12px] font-semibold text-[#6b7280] hover:text-[#111827] bg-transparent border-0 cursor-pointer">Dismiss all</button></div>}
                  </div>
                </>
              )}
            </div>
            <div className="w-[34px] h-[34px] rounded-full bg-[rgba(62,207,142,0.12)] border-[1.5px] border-[#3ecf8e] flex items-center justify-center text-[11px] font-bold text-[#3ecf8e]">SM</div>
          </div>
        </header>

        {/* Sticky sub-header */}
        <div className="bg-[#f0f2f5] sticky top-0 z-20 px-5 lg:px-9 pt-6 pb-0 shrink-0">
          <div className="max-w-[1400px] mx-auto">
            <div className="flex items-start justify-between gap-4 flex-wrap mb-5">
              <div>
                <h2 className="text-[32px] font-extrabold text-[#111827] leading-tight">My Expenses</h2>
                <p className="text-[14px] text-[#6b7280] mt-1">Track and manage your spending · <span className="text-[#9ca3af]">តាមដាន និងគ្រប់គ្រងចំណាយ</span></p>
              </div>
              <div className="relative mt-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280] pointer-events-none" />
                <input type="text" placeholder="Search expenses..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  className="pl-[34px] pr-4 py-[9px] bg-white border border-[#e8eaed] rounded-[10px] text-[13px] outline-none text-[#111827] focus:border-[#3ecf8e] w-[200px] shadow-sm"
                  style={{ fontFamily:"inherit" }} />
              </div>
            </div>
            {/* Underline tabs */}
            <div className="flex items-end gap-0 border-b border-[#e8eaed]">
              {TABS.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-3 text-[13.5px] font-medium border-b-2 -mb-px flex flex-col items-start gap-0.5 bg-transparent border-x-0 border-t-0 cursor-pointer transition-colors whitespace-nowrap ${activeTab === tab.id ? "border-b-[#111827] text-[#111827] font-semibold" : "border-b-transparent text-[#6b7280] hover:text-[#111827]"}`}>
                  <span>{tab.label}</span>
                  <span className="text-[10px] text-[#9ca3af]">{tab.khmer}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 lg:px-9 py-6">
          <div className="max-w-[1400px] mx-auto flex flex-col gap-5">

            {/* ══ OVERVIEW ══ */}
            {activeTab === "overview" && (
              <>
                {/* AI banner */}
                <div className="bg-[#0d1117] border border-white/[0.06] rounded-[14px] px-[26px] py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-[rgba(62,207,142,0.12)] rounded-[11px]"><Brain size={22} className="text-[#3ecf8e]" /></div>
                    <div>
                      <div className="text-[16px] font-bold text-[#e6edf3]">AI Expense Intelligence Active</div>
                      <div className="text-[12px] text-[#7d8590] mt-0.5">Anomaly detection · Recurring patterns · Cost optimization · Gemini insights</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-[rgba(62,207,142,0.1)] border border-[rgba(62,207,142,0.2)] px-4 py-2 rounded-[10px] text-[#3ecf8e] shrink-0">
                    <CheckCircle2 size={14} /><span className="text-[13px] font-semibold">Premium Active</span>
                  </div>
                </div>

                {/* 5 metric cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                  <div className="bg-[#0d1117] rounded-[14px] border border-white/[0.06] px-[22px] py-5">
                    <div className="text-[10.5px] font-bold text-[#7d8590] uppercase tracking-[0.07em]">Today's Expenses</div>
                    <div className="text-[10px] text-[#4d5562] mt-0.5 mb-3">ចំណាយថ្ងៃនេះ</div>
                    <div className="text-[30px] font-extrabold text-[#3ecf8e] leading-none">$133.50</div>
                    <div className="text-[11.5px] text-[#7d8590] mt-1.5">5 transactions</div>
                  </div>
                  <div className="bg-white border border-[#e8eaed] rounded-[14px] px-[22px] py-5 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                    <div className="text-[10.5px] font-bold text-[#6b7280] uppercase tracking-[0.07em]">Top Category</div>
                    <div className="text-[10px] text-[#9ca3af] mt-0.5 mb-3">ប្រភេទទូទៅ</div>
                    <div className="text-[20px] font-bold text-[#111827] leading-none">Ingredients</div>
                    <div className="text-[11.5px] text-[#6b7280] mt-1.5">🏷️ គ្រឿងផ្សំ</div>
                  </div>
                  <div className="bg-[#3ecf8e] rounded-[14px] px-[22px] py-5">
                    <div className="text-[10.5px] font-bold text-white/80 uppercase tracking-[0.07em]">Weekly Expenses</div>
                    <div className="text-[10px] text-white/60 mt-0.5 mb-3">ចំណាយប្រចាំសប្តាហ៍</div>
                    <div className="text-[30px] font-extrabold text-white leading-none">$180.50</div>
                    <div className="text-[11.5px] text-white/70 mt-1.5">+5% vs last week</div>
                  </div>
                  <div className="bg-white border border-[#e8eaed] rounded-[14px] px-[22px] py-5 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                    <div className="text-[10.5px] font-bold text-[#6b7280] uppercase tracking-[0.07em]">Monthly Total</div>
                    <div className="text-[10px] text-[#9ca3af] mt-0.5 mb-3">សរុបប្រចាំខែ</div>
                    <div className="text-[30px] font-bold text-[#111827] leading-none">$650.00</div>
                    <div className="text-[11.5px] text-[#6b7280] mt-1.5">this month</div>
                  </div>
                  <div className="bg-white border border-[#e8eaed] rounded-[14px] px-[22px] py-5 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                    <div className="flex items-center gap-1 mb-1"><Brain size={12} className="text-[#8b5cf6]" /><span className="text-[10.5px] font-bold text-[#8b5cf6] uppercase tracking-[0.07em]">AI Savings</span></div>
                    <div className="text-[10px] text-[#9ca3af] mt-0.5 mb-3">ការសន្សំ</div>
                    <div className="text-[30px] font-bold text-[#8b5cf6] leading-none">$8.00</div>
                    <div className="text-[11.5px] text-[#6b7280] mt-1.5">potential/week</div>
                  </div>
                </div>

                {/* Category breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <div className="bg-white border border-[#e8eaed] rounded-[14px] px-[26px] py-[22px] shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                    <div className="flex items-center justify-between mb-5">
                      <div><div className="text-[14px] font-semibold text-[#111827]">Breakdown by Category</div><div className="text-[11px] text-[#6b7280] mt-0.5">ចំណាយតាមប្រភេទ</div></div>
                      <button className="text-[12px] font-semibold text-[#6b7280] flex items-center gap-1 hover:text-[#111827] bg-transparent border-0 cursor-pointer"><Filter size={13} /> Filter</button>
                    </div>
                    <div className="flex flex-col gap-3.5">
                      {categories.map((cat, i) => {
                        const Icon = cat.icon;
                        const c = catColorMap[cat.color];
                        return (
                          <div key={i} className="flex items-center gap-3">
                            <div className={`p-1.5 rounded-[8px] shrink-0 ${c.iconBg}`}><Icon size={14} className={c.iconText} /></div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-1.5"><span className="text-[13px] font-semibold text-[#111827]">{cat.name}</span><span className="text-[10px] text-[#9ca3af]">{cat.khmer}</span></div>
                                <div className="flex items-center gap-2"><span className="text-[12.5px] font-bold text-[#111827]">{cat.amount}</span><span className="text-[11px] text-[#9ca3af]">{cat.pct}%</span></div>
                              </div>
                              <div className="w-full h-[6px] bg-[#f0f2f5] rounded-full overflow-hidden">
                                <div className="h-full rounded-full transition-all duration-700" style={{ width:`${cat.pct}%`, background:c.bar }} />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Gemini cost optimization */}
                  <div className="bg-[#0d1117] border border-white/[0.06] rounded-[14px] px-[26px] py-[22px]">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="p-2 bg-[rgba(139,92,246,0.15)] rounded-[9px]"><Sparkles size={16} className="text-[#8b5cf6]" /></div>
                      <div><div className="text-[14px] font-bold text-[#e6edf3]">Gemini Cost Optimization</div><div className="text-[11px] text-[#7d8590] mt-0.5">គន្លឹះកាត់បន្ថយថ្លៃដើម · Powered by Gemini AI</div></div>
                    </div>
                    <div className="flex flex-col gap-3">
                      {geminiTips.map((tip, i) => (
                        <div key={i} className="flex items-start gap-3 p-4 bg-white/[0.04] border border-white/[0.07] rounded-[11px] hover:bg-white/[0.07] transition-colors">
                          <span className="text-2xl shrink-0">{tip.emoji}</span>
                          <div>
                            <p className="text-[13px] font-semibold text-[#e6edf3] leading-snug">{tip.tip}</p>
                            <p className="text-[12px] font-bold text-[#3ecf8e] mt-1.5">{tip.saving}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 p-3 bg-white/[0.04] border border-white/[0.07] rounded-[10px]">
                      <p className="text-[12px] text-[#7d8590]"><strong className="text-[#e6edf3]">Total potential savings:</strong> ~$8.00/week · $32/month · $384/year</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ══ RECURRING ══ */}
            {activeTab === "recurring" && (
              <>
                <div className="bg-[rgba(62,207,142,0.06)] border border-[rgba(62,207,142,0.18)] rounded-[14px] px-[22px] py-4 flex items-center gap-3">
                  <RefreshCw size={15} className="text-[#3ecf8e] shrink-0" />
                  <span className="text-[13px] text-[#111827]">AI detected <strong>4 recurring expenses</strong> from your history. Total committed: <strong className="text-[#3ecf8e]">$110.00/month</strong></span>
                  <span className="ml-auto inline-flex items-center gap-1 px-2 py-0.5 bg-[rgba(62,207,142,0.1)] text-[#3ecf8e] text-[10px] font-bold rounded-full border border-[rgba(62,207,142,0.2)] shrink-0"><Brain size={9} /> AI</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {recurringItems.map((item, i) => {
                    const c = catColorMap[item.color];
                    return (
                      <div key={i} className={`p-5 rounded-[14px] border ${c.recurBg} ${c.recurBorder}`}>
                        <div className="flex items-center justify-between mb-3">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${c.iconBg} ${c.iconText}`}>{item.frequency}</span>
                          <Repeat size={14} className={c.iconText} />
                        </div>
                        <div className="text-[14px] font-bold text-[#111827]">{item.name}</div>
                        <div className="text-[11px] text-[#9ca3af] mt-0.5 mb-3">{item.khmer}</div>
                        <div className={`text-[26px] font-extrabold leading-none ${c.iconText}`}>{item.amount}</div>
                        <div className="text-[11.5px] text-[#9ca3af] mt-1.5">Next due: {item.nextDue}</div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* ══ AI INSIGHTS ══ */}
            {activeTab === "insights" && (
              <div className="flex flex-col gap-4">
                {aiInsights.map((ins, i) => {
                  const Icon = ins.icon;
                  return (
                    <div key={i} className="bg-white border border-[#e8eaed] rounded-[14px] px-[22px] py-5 flex items-start gap-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                      <div className="w-10 h-10 rounded-[10px] bg-[#f0f2f5] flex items-center justify-center shrink-0"><Icon size={18} className="text-[#6b7280]" /></div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-[14px] font-bold text-[#111827]">{ins.title}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background:`${ins.tagColor}18`, color:ins.tagColor }}>{ins.tag}</span>
                        </div>
                        <p className="text-[13px] text-[#6b7280] leading-relaxed">{ins.detail}</p>
                        <button className="mt-2 text-[12px] font-semibold px-3 py-1.5 rounded-[8px] bg-[#f0f2f5] text-[#6b7280] hover:bg-[#e8eaed] border-0 cursor-pointer transition-colors">{ins.action} →</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ══ FORECAST ══ */}
            {activeTab === "forecast" && (
              <>
                <div className="bg-white border border-[#e8eaed] rounded-[14px] overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                  <div className="px-[26px] py-[18px] border-b border-[#f0f2f5] flex items-center justify-between">
                    <div><div className="text-[14px] font-semibold text-[#111827]">AI Expense Forecast — Next 7 Days</div><div className="text-[11px] text-[#6b7280] mt-0.5">ការព្យាករណ៍ចំណាយ · Predicted total: <strong className="text-[#3ecf8e]">$175.00</strong> · 89% confident</div></div>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[rgba(62,207,142,0.1)] text-[#3ecf8e] text-[10px] font-bold rounded-full border border-[rgba(62,207,142,0.2)]"><Brain size={9} /> AI</span>
                  </div>
                  <div className="p-[22px]">
                    {/* Bar chart */}
                    <div className="flex items-end gap-2 h-28 mb-4">
                      {[20,28,16,36,24,112,20].map((h, i) => {
                        const max = 112;
                        const isSat = i === 5;
                        return (
                          <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                            <div className="w-full relative rounded-t-[6px]" style={{ height:"96px", background:isSat ? "rgba(62,207,142,0.1)" : "#f0f2f5" }}>
                              <div className="absolute bottom-0 w-full rounded-t-[6px]" style={{ height:`${(h/max)*100}%`, background:isSat ? "#3ecf8e" : "#d1d5db" }} />
                            </div>
                            <span className="text-[10px] text-[#9ca3af]">{["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][i]}</span>
                          </div>
                        );
                      })}
                    </div>
                    {/* Forecast cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {forecastItems.map((item, i) => (
                        <div key={i} className="p-3.5 bg-[#f7f8fa] rounded-[11px] border border-[#e8eaed]">
                          <div className="text-[11px] font-bold text-[#6b7280] mb-0.5">{item.category}</div>
                          <div className="text-[16px] font-bold text-[#111827]">{item.predicted}</div>
                          <span className={`text-[12px] font-semibold ${item.up === null ? "text-[#9ca3af]" : item.up ? "text-[#ef4444]" : "text-[#3ecf8e]"}`}>{item.change}</span>
                          <div className="text-[10.5px] text-[#9ca3af] mt-1 leading-snug">{item.reason}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ══ HISTORY ══ */}
            {activeTab === "history" && (
              <div className="bg-white border border-[#e8eaed] rounded-[14px] overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                <div className="px-[22px] py-4 border-b border-[#f0f2f5] flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <div className="text-[14px] font-semibold text-[#111827]">Expense History</div>
                    <div className="text-[11px] text-[#6b7280] mt-0.5">{filteredHistory.length} records · AI anomaly flags shown inline</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search size={13} className="absolute left-[11px] top-1/2 -translate-y-1/2 text-[#6b7280] pointer-events-none" />
                      <input type="text" placeholder="Search history..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                        className="pl-[33px] pr-4 py-[9px] bg-[#f7f8fa] border border-[#e8eaed] rounded-[9px] text-[13px] outline-none text-[#111827] focus:border-[#3ecf8e] w-[180px]"
                        style={{ fontFamily:"inherit" }} />
                    </div>
                    <button className="w-[38px] h-[38px] flex items-center justify-center border border-[#e8eaed] rounded-[9px] bg-[#f7f8fa] text-[#6b7280] hover:bg-[#eff0f2] cursor-pointer"><Filter size={14} /></button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-[#f0f2f5]">
                        {["Time","Category","Note","AI Flag","Amount","Actions"].map(h => (
                          <th key={h} className="px-[20px] py-[11px] text-[10.5px] font-bold text-[#9ca3af] uppercase tracking-[0.07em]">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredHistory.map((exp, i) => {
                        const c = catColorMap[exp.categoryColor];
                        return (
                          <tr key={i} className={`group transition-colors hover:bg-[#f7f8fa] cursor-pointer ${i < filteredHistory.length-1 ? "border-b border-[#f0f2f5]" : ""}`}>
                            <td className="px-[20px] py-[14px]">
                              <div className="flex items-center gap-1.5 text-[13px] text-[#6b7280]">
                                {exp.time}
                                {exp.recurring && <span className="text-[10px] px-1.5 py-0.5 bg-[#f0f2f5] text-[#6b7280] rounded-full font-semibold border border-[#e8eaed]">Recurring</span>}
                              </div>
                            </td>
                            <td className="px-[20px] py-[14px]">
                              <span className={`inline-flex px-2.5 py-[3px] rounded-full text-[11.5px] font-semibold ${c.badge}`}>{exp.category}</span>
                            </td>
                            <td className="px-[20px] py-[14px] text-[13px] font-medium text-[#111827]">{exp.note}</td>
                            <td className="px-[20px] py-[14px]">
                              {exp.anomaly === "high" ? (
                                <div className="flex items-center gap-1.5">
                                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 bg-[rgba(239,68,68,0.08)] text-[#ef4444] border border-[rgba(239,68,68,0.2)] rounded-[7px]"><AlertTriangle size={11} /> Anomaly</span>
                                  {exp.anomalyNote && <span className="text-[10px] text-[#ef4444] hidden lg:block">{exp.anomalyNote}</span>}
                                </div>
                              ) : exp.anomaly === "medium" ? (
                                <div className="flex items-center gap-1.5">
                                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 bg-[rgba(245,158,11,0.08)] text-[#f59e0b] border border-[rgba(245,158,11,0.2)] rounded-[7px]"><Tag size={11} /> Unusual</span>
                                  {exp.anomalyNote && <span className="text-[10px] text-[#f59e0b] hidden lg:block">{exp.anomalyNote}</span>}
                                </div>
                              ) : (
                                <span className="text-[12px] text-[#d1d5db]">—</span>
                              )}
                            </td>
                            <td className="px-[20px] py-[14px]">
                              <span className="text-[13.5px] font-bold text-[#ef4444]">-${exp.amount.toFixed(2)}</span>
                            </td>
                            <td className="px-[20px] py-[14px]">
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="w-8 h-8 rounded-[8px] bg-transparent hover:bg-[#f0f2f5] border-0 flex items-center justify-center cursor-pointer text-[#6b7280] hover:text-[#111827]"><Edit2 size={13} /></button>
                                <button className="w-8 h-8 rounded-[8px] bg-transparent hover:bg-[rgba(239,68,68,0.08)] border-0 flex items-center justify-center cursor-pointer text-[#6b7280] hover:text-[#ef4444]"><Trash2 size={13} /></button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="border-t border-[#e8eaed] bg-[#f7f8fa]">
                        <td colSpan={4} className="px-[20px] py-3 text-[12px] text-[#9ca3af]">{filteredHistory.length} of {expenseHistory.length} records · AI flags unusual spending automatically</td>
                        <td className="px-[20px] py-3 text-[13px] font-bold text-[#ef4444]">Total: ${filteredHistory.reduce((s,e)=>s+e.amount,0).toFixed(2)}</td>
                        <td />
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}

            <div className="h-4" />
          </div>
        </div>
      </main>

      {/* Gemini FAB */}
      {!isChatOpen && (
        <button onClick={() => setIsChatOpen(true)} className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-[#8b5cf6] to-[#3ecf8e] rounded-full shadow-[0_8px_32px_rgba(139,92,246,0.4)] flex items-center justify-center text-white hover:scale-110 transition-transform cursor-pointer border-0">
          <MessageSquare size={22} />
        </button>
      )}
      {isChatOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 bg-white rounded-[20px] shadow-[0_24px_64px_rgba(0,0,0,0.2)] border border-[#e8eaed] flex flex-col overflow-hidden" style={{ maxHeight:"520px" }}>
          <div className="px-5 py-4 bg-[#0d1117] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-[#8b5cf6] to-[#3ecf8e] rounded-full flex items-center justify-center"><Brain size={18} className="text-white" /></div>
              <div><p className="font-bold text-[13.5px] text-[#e6edf3]">AI Expense Assistant</p><p className="text-[11px] text-[#4d5562]">Powered by Gemini</p></div>
            </div>
            <button onClick={() => setIsChatOpen(false)} className="text-[#7d8590] hover:text-[#e6edf3] bg-transparent border-0 cursor-pointer p-1"><X size={16} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-[#f7f8fa]" style={{ minHeight:"260px" }}>
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] px-4 py-3 rounded-[14px] text-[13px] leading-relaxed ${msg.role === "user" ? "bg-[#0d1117] text-[#e6edf3] rounded-br-[4px]" : "bg-white border border-[#e8eaed] text-[#374151] rounded-bl-[4px] shadow-sm"}`}>{msg.text}</div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-[#e8eaed] bg-white">
            <div className="flex items-center gap-2">
              <input type="text" placeholder="Ask about your expenses..." value={chatMsg} onChange={e => setChatMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSend()}
                className="flex-1 px-4 py-2.5 bg-[#f7f8fa] border border-[#e8eaed] rounded-[10px] text-[13px] outline-none text-[#111827] focus:border-[#3ecf8e]" style={{ fontFamily:"inherit" }} />
              <button onClick={handleSend} className="p-2.5 bg-gradient-to-br from-[#8b5cf6] to-[#3ecf8e] text-white rounded-[10px] border-0 cursor-pointer hover:opacity-90"><Send size={15} /></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function NavItem({ icon: Icon, title, href, active = false, collapsed = false }: NavItemProps) {
  return (
    <Link href={href} title={collapsed ? title : undefined}
      className={`flex items-center rounded-[10px] mb-0.5 no-underline transition-all duration-[120ms] ${collapsed ? "justify-center w-full h-11" : "gap-3 px-4 py-3"} ${active ? "bg-[rgba(62,207,142,0.12)] text-[#3ecf8e]" : "bg-transparent text-[#7d8590] hover:bg-white/[0.05] hover:text-[#e6edf3]"}`}>
      <Icon size={20} />
      {!collapsed && <span className={`text-[15px] ${active ? "font-semibold" : "font-normal"}`}>{title}</span>}
    </Link>
  );
}