"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard, CircleDollarSign, Receipt, Users, Package,
  Settings, TrendingUp, TrendingDown, Menu, X, ChevronRight,
  Sparkles, Brain, AlertTriangle, FileBarChart, Plus,
  Target, Zap, Activity, MessageSquare, Send,
  Megaphone, Search, PanelLeftClose, PanelLeftOpen,
  FileText, FileSpreadsheet, Bell, ArrowUpRight, ArrowDownRight,
  CloudRain, ShoppingCart, RefreshCw, Download,
} from "lucide-react";

type TabId = "pl" | "sales" | "weather" | "forecast" | "insights";
interface NavItemProps { icon: React.ElementType; title: string; href: string; active?: boolean; collapsed?: boolean; }
interface ChatMsg { role: "assistant" | "user"; text: string; }
interface PushAlert { title: string; message: string; time: string; icon: React.ElementType; }

const pushAlerts: PushAlert[] = [
  { title: "Revenue Up 30% vs Last Week",     icon: TrendingUp,    message: "Strong weekend foot traffic and repeat VIP visits drove a 30% revenue increase.",             time: "This week"   },
  { title: "Ingredient Costs Up 30%",          icon: AlertTriangle, message: "Pork & vegetables spending jumped 30% vs last week — review supplier pricing.",               time: "2 hours ago" },
  { title: "Break-Even Achieved at 11:30 AM",  icon: Target,        message: "You covered all fixed costs by 11:30 AM today. Every sale after is pure profit.",            time: "Today"       },
  { title: "Sales Drop Alert",                 icon: TrendingDown,  message: "Revenue is 15% below your usual Saturday average — consider a promotional push.",            time: "Just now"    },
];

const plDaily = [
  { day:"Mon", rev:240, exp:90  }, { day:"Tue", rev:310, exp:110 },
  { day:"Wed", rev:280, exp:85  }, { day:"Thu", rev:420, exp:130 },
  { day:"Fri", rev:390, exp:120 }, { day:"Sat", rev:510, exp:150 },
  { day:"Sun", rev:300, exp:105 },
];

const topItems = [
  { name:"Iced Coffee",       khmer:"កាហ្វេទឹកកក",  qty:112, revenue:"$168.00", pct:100 },
  { name:"Noodle Soup",       khmer:"គុយទាវ",        qty:85,  revenue:"$255.00", pct:75  },
  { name:"Hot Latte",         khmer:"ឡាតេក្តៅ",      qty:64,  revenue:"$128.00", pct:57  },
  { name:"Mango Sticky Rice", khmer:"បាយដំណើបស្វាយ", qty:45,  revenue:"$112.50", pct:40  },
  { name:"Matcha Frappe",     khmer:"ម៉ាឆា",         qty:36,  revenue:"$108.00", pct:32  },
];

const weatherInsights = [
  { product:"Hot Latte",         action:"Increase stock +40%", reason:"Hot drinks +52% on rainy evenings",  up:true  },
  { product:"Mango Sticky Rice", action:"Increase stock +20%", reason:"Comfort food demand spikes",          up:true  },
  { product:"Matcha Frappe",     action:"Reduce stock -30%",   reason:"Cold drinks drop 35% when rainy",    up:false },
  { product:"Iced Coffee",       action:"Reduce stock -15%",   reason:"Slight drop in iced beverages",      up:false },
];

const forecastRows = [
  { product:"Iced Coffee",       khmer:"កាហ្វេទឹកកក",  today:112, predicted:128, change:"+14%", up:true,  confidence:91 },
  { product:"Noodle Soup",       khmer:"គុយទាវ",        today:85,  predicted:70,  change:"-18%", up:false, confidence:87 },
  { product:"Hot Latte",         khmer:"ឡាតេក្តៅ",      today:64,  predicted:95,  change:"+48%", up:true,  confidence:94 },
  { product:"Mango Sticky Rice", khmer:"បាយដំណើបស្វាយ", today:45,  predicted:55,  change:"+22%", up:true,  confidence:82 },
  { product:"Matcha Frappe",     khmer:"ម៉ាឆា",         today:36,  predicted:28,  change:"-22%", up:false, confidence:79 },
];

const aiInsightsList = [
  { icon:TrendingUp,    tag:"Positive",  tagColor:"#3ecf8e", title:"Revenue up 22% vs last week",        detail:"Saturday peak hit $510 — your best day. Rainy weather correlated with +18% hot drink sales."         },
  { icon:AlertTriangle, tag:"Action",    tagColor:"#f59e0b", title:"Ingredient costs jumped 30%",         detail:"Orussey Market on Tuesday 6AM is 18% cheaper. Switch supplier this week to save ~$4.50/week."        },
  { icon:Brain,         tag:"Forecast",  tagColor:"#3b82f6", title:"Predicted busiest day: Saturday",    detail:"Based on 8 weeks of data, Saturday 12–2PM consistently generates 35% of weekly revenue."             },
  { icon:Target,        tag:"Milestone", tagColor:"#8b5cf6", title:"Break-even achieved at 11:30 AM",    detail:"You covered all fixed costs by 11:30 AM today. Every sale after that is pure profit."                 },
  { icon:Zap,           tag:"Urgent",    tagColor:"#ef4444", title:"Smart restock: Buy more Hot Latte",  detail:"Rainy evening forecast + Friday demand = 94% confidence Hot Latte will sell out by 7PM tonight."      },
];

const TABS: { id: TabId; label: string; khmer: string }[] = [
  { id:"pl",       label:"Profit & Loss",  khmer:"ចំណេញ និង ខាត"   },
  { id:"sales",    label:"Sales Report",   khmer:"របាយការណ៍ការលក់"  },
  { id:"weather",  label:"Weather Intel",  khmer:"អាកាសធាតុ"        },
  { id:"forecast", label:"AI Forecast",    khmer:"ការព្យាករណ៍"      },
  { id:"insights", label:"AI Insights",    khmer:"ការវិភាគ AI"      },
];

const initChat: ChatMsg[] = [
  { role:"assistant", text:"សួស្តី! I'm your Gemini Business Assistant. Ask me anything about your reports, forecasts, or how to boost revenue!" },
  { role:"assistant", text:"Try: 'What will be my busiest day this week?' or 'How can I increase profit margin?'" },
];

export default function PremiumReportsPage() {
  const [isSidebarOpen,      setIsSidebarOpen]      = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [userMenuOpen,       setUserMenuOpen]       = useState(false);
  const [isNotifOpen,        setIsNotifOpen]        = useState(false);
  const [activeTab,          setActiveTab]          = useState<TabId>("pl");
  const [period,             setPeriod]             = useState("This Week");
  const [isChatOpen,         setIsChatOpen]         = useState(false);
  const [chatMsg,            setChatMsg]            = useState("");
  const [chatMessages,       setChatMessages]       = useState<ChatMsg[]>(initChat);
  const [dismissed,          setDismissed]          = useState<number[]>([]);
  const [searchQuery,        setSearchQuery]        = useState("");

  const visibleAlerts = pushAlerts.filter((_,i) => !dismissed.includes(i));

  const handleSend = () => {
    if (!chatMsg.trim()) return;
    setChatMessages(p => [...p, { role:"user", text:chatMsg }]);
    setChatMsg("");
    setTimeout(() => setChatMessages(p => [...p, { role:"assistant", text:"Based on your data, Saturday 12–2PM is your peak window with 35% of weekly revenue. I recommend stocking up Hot Latte ingredients tonight — 94% chance of sellout given tonight's rainy forecast." }]), 900);
  };

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
          <NavItem icon={Receipt}          title="Expenses"   href="/vendor/expenses"          collapsed={isSidebarCollapsed} />
          <NavItem icon={Users}            title="Customers"  href="/vendor/customer"          collapsed={isSidebarCollapsed} />
          <NavItem icon={Package}          title="Inventory"  href="/vendor/premium/inventory" collapsed={isSidebarCollapsed} />
          <NavItem icon={FileBarChart}     title="Reports"    href="/vendor/premium/reports"   collapsed={isSidebarCollapsed} active />
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
              <h1 className="font-bold text-[20px] text-[#111827]">Reports</h1>
              <span className="text-[13px] text-[#6b7280] hidden sm:block">របាយការណ៍</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[rgba(139,92,246,0.1)] text-[#8b5cf6] text-[11px] font-bold rounded-full border border-[rgba(139,92,246,0.2)]"><Sparkles size={10} /> PREMIUM</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select value={period} onChange={e => setPeriod(e.target.value)} className="hidden sm:block bg-[#f7f8fa] border border-[#e8eaed] text-[13px] font-medium rounded-[10px] px-3 py-2 outline-none focus:border-[#3ecf8e] cursor-pointer" style={{ fontFamily:"inherit" }}>
              <option>Today</option><option>This Week</option><option>This Month</option><option>Last 3 Months</option>
            </select>
            <button className="hidden sm:flex items-center gap-1.5 bg-[#0d1117] text-white border-0 rounded-[10px] px-3.5 py-[9px] font-semibold text-[13px] cursor-pointer hover:bg-[#1a2332] transition-colors"><FileText size={14} /> PDF</button>
            <button className="hidden sm:flex items-center gap-1.5 bg-white border border-[#e8eaed] text-[#111827] rounded-[10px] px-3.5 py-[9px] font-semibold text-[13px] cursor-pointer hover:bg-[#f0f2f5] transition-colors"><FileSpreadsheet size={14} /> Excel</button>
            <button onClick={() => setIsChatOpen(o => !o)} className="flex items-center gap-1.5 bg-gradient-to-r from-[#8b5cf6] to-[#3ecf8e] text-white border-0 rounded-[10px] px-3.5 py-[9px] font-bold text-[13px] cursor-pointer hover:opacity-90"><Brain size={14} /> Gemini AI</button>
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
                      {visibleAlerts.map((alert, i) => {
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
                    {visibleAlerts.length > 0 && <div className="px-5 py-3 border-t border-[#f0f2f5]"><button onClick={() => { setDismissed(pushAlerts.map((_,i) => i)); setIsNotifOpen(false); }} className="text-[12px] font-semibold text-[#6b7280] hover:text-[#111827] bg-transparent border-0 cursor-pointer">Dismiss all</button></div>}
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
                <h2 className="text-[32px] font-extrabold text-[#111827] leading-tight">My Reports</h2>
                <p className="text-[14px] text-[#6b7280] mt-1">AI-powered business intelligence · <span className="text-[#9ca3af]">ការវិភាគអាជីវកម្ម AI</span></p>
              </div>
              <div className="relative mt-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280] pointer-events-none" />
                <input type="text" placeholder="Search reports..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
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

            {/* ══ P&L ══ */}
            {activeTab === "pl" && (
              <>
                {/* Break-even tracker */}
                <div className="bg-[#0d1117] rounded-[14px] border border-white/[0.06] px-[26px] py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[rgba(62,207,142,0.15)] border-2 border-[#3ecf8e] flex items-center justify-center shrink-0"><Target size={20} className="text-[#3ecf8e]" /></div>
                    <div>
                      <div className="text-[11px] font-bold text-[#7d8590] uppercase tracking-[0.06em] mb-0.5">Live Break-Even Tracker</div>
                      <div className="text-[18px] font-extrabold text-[#e6edf3]">✅ Break-even achieved at 11:30 AM!</div>
                      <div className="text-[12px] text-[#7d8590] mt-0.5">Fixed costs $130 ÷ avg $4.50/sale = 29 customers · You have 42 today (+13 surplus)</div>
                    </div>
                  </div>
                  <div className="sm:w-[200px] shrink-0">
                    <div className="flex justify-between text-[11px] text-[#7d8590] mb-1.5"><span>Progress</span><span className="text-[#3ecf8e] font-bold">100%</span></div>
                    <div className="h-2.5 bg-white/[0.06] rounded-full overflow-hidden"><div className="h-full bg-[#3ecf8e] rounded-full w-full" /></div>
                    <div className="text-[10px] text-[#4d5562] mt-1.5">Every sale now = pure profit 💰</div>
                  </div>
                </div>

                {/* Metric cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[
                    { label:"Total Revenue",  khmer:"ចំណូលសរុប",        value:"$2,450.00", trend:"+22%", up:true,  dark:false, green:false },
                    { label:"Total Expenses", khmer:"ចំណាយសរុប",        value:"$890.50",   trend:"-2%",  up:true,  dark:false, green:false },
                    { label:"Net Profit",     khmer:"ប្រាក់ចំណេញសុទ្ធ", value:"$1,559.50", trend:"+28%", up:true,  dark:false, green:true  },
                    { label:"Profit Margin",  khmer:"អត្រាប្រាក់ចំណេញ", value:"63.6%",     trend:"Excellent", up:true, dark:true, green:false },
                  ].map((c, i) => (
                    <div key={i} className={`rounded-[14px] px-[22px] py-5 ${c.green ? "bg-[#3ecf8e]" : c.dark ? "bg-[#0d1117] border border-white/[0.06]" : "bg-white border border-[#e8eaed] shadow-[0_1px_4px_rgba(0,0,0,0.06)]"}`}>
                      <div className={`text-[10.5px] font-bold uppercase tracking-[0.07em] mb-0.5 ${c.green ? "text-white/80" : c.dark ? "text-[#7d8590]" : "text-[#6b7280]"}`}>{c.label}</div>
                      <div className={`text-[10px] mb-4 ${c.green ? "text-white/60" : c.dark ? "text-[#4d5562]" : "text-[#9ca3af]"}`}>{c.khmer}</div>
                      <div className="flex items-end justify-between">
                        <span className={`font-bold text-[26px] leading-none ${c.green ? "text-white" : c.dark ? "text-[#e6edf3]" : "text-[#111827]"}`}>{c.value}</span>
                        <span className={`text-[12.5px] font-bold mb-0.5 ${c.green ? "text-white" : c.dark ? "text-[#3ecf8e]" : "text-[#3ecf8e]"}`}>{c.trend}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bar chart */}
                <div className="bg-white border border-[#e8eaed] rounded-[14px] px-[26px] py-[22px] shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                  <div className="text-[14px] font-semibold text-[#111827] mb-0.5">Revenue vs Expenses</div>
                  <div className="text-[11px] text-[#6b7280] mb-5">ចំណូល vs ចំណាយ · {period}</div>
                  <div className="h-52 flex items-end gap-3">
                    {plDaily.map((d, i) => {
                      const max = 550;
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <div className="w-full flex items-end gap-0.5 h-44">
                            <div className="w-[48%] relative bg-[rgba(62,207,142,0.08)] rounded-t-[6px] h-full">
                              <div className="absolute bottom-0 w-full bg-[#3ecf8e] rounded-t-[6px]" style={{ height:`${(d.rev/max)*100}%` }} />
                            </div>
                            <div className="w-[48%] relative bg-[#f0f2f5] rounded-t-[6px] h-full">
                              <div className="absolute bottom-0 w-full bg-[#9ca3af] rounded-t-[6px]" style={{ height:`${(d.exp/max)*100}%` }} />
                            </div>
                          </div>
                          <span className="text-[10px] text-[#6b7280]">{d.day}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex items-center gap-6 mt-4 pt-4 border-t border-[#f0f2f5]">
                    <div className="flex items-center gap-2 text-[12.5px] text-[#6b7280]"><div className="w-3 h-3 rounded-sm bg-[#3ecf8e]" />Revenue</div>
                    <div className="flex items-center gap-2 text-[12.5px] text-[#6b7280]"><div className="w-3 h-3 rounded-sm bg-[#9ca3af]" />Expenses</div>
                  </div>
                </div>
              </>
            )}

            {/* ══ SALES ══ */}
            {activeTab === "sales" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-2 bg-white border border-[#e8eaed] rounded-[14px] overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                  <div className="px-[26px] py-[18px] border-b border-[#f0f2f5]">
                    <div className="text-[14px] font-semibold text-[#111827]">Top Selling Items</div>
                    <div className="text-[11px] text-[#6b7280] mt-0.5">ទំនិញលក់ដាច់ជាងគេ · {period}</div>
                  </div>
                  <div className="p-[22px] flex flex-col gap-4">
                    {topItems.map((item, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <span className="w-6 h-6 rounded-full bg-[#f0f2f5] text-[#6b7280] text-[12px] font-bold flex items-center justify-center shrink-0">{i+1}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1.5">
                            <div><span className="text-[13.5px] font-semibold text-[#111827]">{item.name}</span><span className="text-[11px] text-[#9ca3af] ml-2">{item.khmer}</span></div>
                            <div><span className="text-[13.5px] font-bold text-[#3ecf8e]">{item.revenue}</span><span className="text-[12px] text-[#9ca3af] ml-1.5">({item.qty} sold)</span></div>
                          </div>
                          <div className="w-full h-1.5 bg-[#f0f2f5] rounded-full overflow-hidden"><div className="h-full bg-[#3ecf8e] rounded-full" style={{ width:`${item.pct}%` }} /></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-5">
                  <div className="bg-[#0d1117] border border-white/[0.06] rounded-[14px] px-[26px] py-6">
                    <div className="text-[10.5px] font-bold text-[#7d8590] uppercase tracking-[0.07em] mb-0.5">Total Sales</div>
                    <div className="text-[10px] text-[#4d5562] mb-4">ការលក់សរុប</div>
                    <div className="text-[30px] font-bold text-[#3ecf8e]">$2,450</div>
                    <div className="flex items-center gap-1 mt-2 text-[12.5px] font-bold text-[#3ecf8e]"><ArrowUpRight size={14} />+22.1% vs last week</div>
                  </div>
                  <div className="bg-white border border-[#e8eaed] rounded-[14px] px-[26px] py-6 shadow-[0_1px_4px_rgba(0,0,0,0.06)] flex-1">
                    <div className="text-[13.5px] font-semibold text-[#111827] mb-4">Sales Trend</div>
                    <div className="h-24 flex items-end gap-1.5">
                      {[45,60,50,85,75,100,65].map((h, i) => (
                        <div key={i} className="flex-1 bg-[rgba(62,207,142,0.1)] rounded-t-[5px] relative">
                          <div className="absolute bottom-0 w-full bg-[#3ecf8e] rounded-t-[5px]" style={{ height:`${h}%` }} />
                        </div>
                      ))}
                    </div>
                    <div className="text-[11.5px] text-[#6b7280] mt-3">342 total sales · $7.16 avg/order</div>
                  </div>
                </div>
              </div>
            )}

            {/* ══ WEATHER ══ */}
            {activeTab === "weather" && (
              <>
                <div className="bg-[#0d1117] rounded-[14px] border border-white/[0.06] px-[26px] py-5 flex flex-col sm:flex-row sm:items-center gap-5">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-[14px] bg-[rgba(59,130,246,0.15)] border border-[rgba(59,130,246,0.2)] flex items-center justify-center shrink-0"><CloudRain size={28} className="text-[#3b82f6]" /></div>
                    <div>
                      <div className="text-[11px] font-bold text-[#7d8590] uppercase tracking-[0.06em]">Today's Forecast</div>
                      <div className="text-[22px] font-extrabold text-[#e6edf3] mt-0.5">Rainy Evening</div>
                      <div className="flex items-center gap-3 mt-1"><span className="text-[12.5px] text-[#7d8590]">🌡️ 28°C</span><span className="text-[12.5px] text-[#7d8590]">💧 82%</span><span className="text-[12.5px] text-[#7d8590]">💨 14 km/h</span></div>
                    </div>
                  </div>
                  <div className="sm:ml-auto px-4 py-3 bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)] rounded-[10px]">
                    <div className="text-[11px] font-bold text-[#ef4444] uppercase tracking-[0.06em]">Demand Impact</div>
                    <div className="text-[17px] font-extrabold text-[#ef4444] mt-0.5">HIGH</div>
                  </div>
                </div>
                <div className="bg-[rgba(62,207,142,0.06)] border border-[rgba(62,207,142,0.18)] rounded-[14px] px-[22px] py-4 flex items-center gap-3">
                  <Brain size={16} className="text-[#3ecf8e] shrink-0" />
                  <span className="text-[13px] text-[#111827]"><strong>AI Historical Pattern:</strong> Last 12 rainy evenings averaged +18% revenue vs dry days. Expect higher hot drink demand.</span>
                </div>
                <div className="bg-white border border-[#e8eaed] rounded-[14px] overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                  <div className="px-[26px] py-[18px] border-b border-[#f0f2f5] flex items-center justify-between">
                    <div><div className="text-[14px] font-semibold text-[#111827]">Smart Product Suggestions</div><div className="text-[11px] text-[#6b7280] mt-0.5">ការណែនាំផលិតផល · Based on weather + sales history</div></div>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[rgba(139,92,246,0.1)] text-[#8b5cf6] text-[10px] font-bold rounded-full border border-[rgba(139,92,246,0.2)]"><Brain size={9} /> AI</span>
                  </div>
                  <div className="p-[22px] grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {weatherInsights.map((ins, i) => (
                      <div key={i} className={`flex items-start gap-4 p-4 rounded-[12px] border ${ins.up ? "bg-[rgba(62,207,142,0.05)] border-[rgba(62,207,142,0.2)]" : "bg-[rgba(239,68,68,0.04)] border-[rgba(239,68,68,0.15)]"}`}>
                        <div className={`w-9 h-9 rounded-[9px] flex items-center justify-center shrink-0 ${ins.up ? "bg-[rgba(62,207,142,0.12)]" : "bg-[rgba(239,68,68,0.1)]"}`}>
                          {ins.up ? <ArrowUpRight size={16} className="text-[#3ecf8e]" /> : <ArrowDownRight size={16} className="text-[#ef4444]" />}
                        </div>
                        <div>
                          <div className="text-[13.5px] font-bold text-[#111827]">{ins.product}</div>
                          <div className={`text-[13px] font-semibold mt-0.5 ${ins.up ? "text-[#3ecf8e]" : "text-[#ef4444]"}`}>{ins.action}</div>
                          <div className="text-[11.5px] text-[#6b7280] mt-0.5">{ins.reason}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ══ FORECAST ══ */}
            {activeTab === "forecast" && (
              <>
                <div className="bg-white border border-[#e8eaed] rounded-[14px] overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                  <div className="px-[26px] py-[18px] border-b border-[#f0f2f5] flex items-center justify-between">
                    <div><div className="text-[14px] font-semibold text-[#111827]">AI Sales Forecaster — Next 7 Days</div><div className="text-[11px] text-[#6b7280] mt-0.5">ការព្យាករណ៍ · Powered by Gemini AI</div></div>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[rgba(62,207,142,0.1)] text-[#3ecf8e] text-[10px] font-bold rounded-full border border-[rgba(62,207,142,0.2)]"><Brain size={9} /> 89% avg confidence</span>
                  </div>
                  <div className="p-[22px] overflow-x-auto">
                    <table className="w-full text-left">
                      <thead><tr className="border-b border-[#f0f2f5]">{["Product","Today","Predicted","Change","Confidence"].map(h => <th key={h} className="pb-3 text-[10.5px] font-bold text-[#9ca3af] uppercase tracking-[0.07em] pr-6">{h}</th>)}</tr></thead>
                      <tbody>
                        {forecastRows.map((row, i) => (
                          <tr key={i} className={`${i < forecastRows.length-1 ? "border-b border-[#f0f2f5]" : ""}`}>
                            <td className="py-3.5 pr-6"><div className="text-[13.5px] font-medium text-[#111827]">{row.product}</div><div className="text-[11px] text-[#9ca3af]">{row.khmer}</div></td>
                            <td className="py-3.5 pr-6 text-[13.5px] text-[#6b7280] font-medium">{row.today}</td>
                            <td className="py-3.5 pr-6 text-[13.5px] font-bold text-[#111827]">{row.predicted}</td>
                            <td className="py-3.5 pr-6"><span className={`inline-flex items-center gap-1 text-[13px] font-bold ${row.up ? "text-[#3ecf8e]" : "text-[#ef4444]"}`}>{row.up ? <ArrowUpRight size={13}/> : <ArrowDownRight size={13}/>}{row.change}</span></td>
                            <td className="py-3.5"><div className="flex items-center gap-2"><div className="w-[80px] h-1.5 bg-[#f0f2f5] rounded-full overflow-hidden"><div className="h-full bg-[#3ecf8e] rounded-full" style={{ width:`${row.confidence}%` }} /></div><span className="text-[12px] text-[#6b7280] font-medium">{row.confidence}%</span></div></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-[#0d1117] border border-white/[0.06] rounded-[14px] px-[26px] py-[22px]">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="p-2 bg-[rgba(62,207,142,0.12)] rounded-[9px]"><ShoppingCart size={16} className="text-[#3ecf8e]" /></div>
                    <div><div className="text-[15px] font-bold text-[#e6edf3]">Smart Restock Forecaster</div><div className="text-[12px] text-[#7d8590] mt-0.5">ការព្យាករណ៍ការបញ្ចូលស្តុក · What to buy at morning market</div></div>
                    <span className="ml-auto inline-flex items-center gap-1 px-2.5 py-1 bg-[rgba(62,207,142,0.1)] text-[#3ecf8e] text-[11px] font-bold rounded-[7px] border border-[rgba(62,207,142,0.2)]"><Zap size={10} /> Urgent</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { item:"Hot Latte beans",    khmer:"គ្រាប់ក្រហមឡាតេ", buy:"Buy 2 extra bags",    reason:"Rainy forecast + 94% sellout probability", urgent:true  },
                      { item:"Pork cuts",           khmer:"សាច់ជ្រូក",        buy:"Buy at Orussey Tue", reason:"18% cheaper than current supplier",         urgent:false },
                      { item:"Mango + sticky rice", khmer:"ស្វាយ + អង្ករ",    buy:"Increase by 20%",    reason:"Comfort food spike in rainy weather",        urgent:true  },
                    ].map((r, i) => (
                      <div key={i} className={`p-4 rounded-[11px] border ${r.urgent ? "bg-[rgba(62,207,142,0.08)] border-[rgba(62,207,142,0.2)]" : "bg-white/[0.04] border-white/[0.07]"}`}>
                        <div className="text-[13px] font-bold text-[#e6edf3]">{r.item}</div>
                        <div className="text-[11px] text-[#7d8590] mb-2">{r.khmer}</div>
                        <div className={`text-[13px] font-semibold ${r.urgent ? "text-[#3ecf8e]" : "text-[#e6edf3]"}`}>{r.buy}</div>
                        <div className="text-[11.5px] text-[#4d5562] mt-1">{r.reason}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ══ AI INSIGHTS ══ */}
            {activeTab === "insights" && (
              <div className="flex flex-col gap-4">
                {aiInsightsList.map((ins, i) => {
                  const Icon = ins.icon;
                  return (
                    <div key={i} className="bg-white border border-[#e8eaed] rounded-[14px] px-[22px] py-5 flex items-start gap-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                      <div className="w-10 h-10 rounded-[10px] bg-[#f0f2f5] flex items-center justify-center shrink-0"><Icon size={18} className="text-[#6b7280]" /></div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[14px] font-bold text-[#111827]">{ins.title}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background:`${ins.tagColor}18`, color:ins.tagColor }}>{ins.tag}</span>
                        </div>
                        <p className="text-[13px] text-[#6b7280] leading-relaxed">{ins.detail}</p>
                      </div>
                    </div>
                  );
                })}
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
              <div><p className="font-bold text-[13.5px] text-[#e6edf3]">Gemini Business Assistant</p><p className="text-[11px] text-[#4d5562]">AI-powered · Premium</p></div>
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
              <input type="text" placeholder="Ask about your business..." value={chatMsg} onChange={e => setChatMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSend()}
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