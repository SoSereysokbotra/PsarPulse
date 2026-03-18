"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard, CircleDollarSign, Receipt, Users, Package,
  Settings, Menu, X, ChevronRight, Sparkles, Brain,
  AlertTriangle, FileBarChart, Plus, Edit2, Trash2,
  Search, PanelLeftClose, PanelLeftOpen, MessageSquare, Send,
  Zap, RefreshCw, ShoppingCart, Bell, TrendingDown, TrendingUp,
  Check, Filter,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────
type TabId       = "overview" | "restock" | "waste";
type StockStatus = "ok" | "low" | "out";
interface NavItemProps { icon: React.ElementType; title: string; href: string; active?: boolean; collapsed?: boolean; }
interface ChatMsg { role: "assistant" | "user"; text: string; }
interface PushAlert { title: string; message: string; time: string; icon: React.ElementType; }
interface InventoryItem {
  id: string; name: string; khmer: string; category: string;
  stock: number; threshold: number; unit: string; cost: number;
  status: StockStatus; aiRestock: number | null; wastePct: number;
  supplier: string; lastOrdered: string;
}

// ─── Data ─────────────────────────────────────────────────────────
const INVENTORY: InventoryItem[] = [
  { id:"i1", name:"Coffee Beans (Arabica)", khmer:"គ្រាប់កាហ្វេ",    category:"Beverage",   stock:3,  threshold:5,  unit:"bags",    cost:12.00, status:"low", aiRestock:5,    wastePct:4,  supplier:"Central Market",   lastOrdered:"2 days ago" },
  { id:"i2", name:"Pork Cuts",              khmer:"សាច់ជ្រូក",        category:"Ingredient", stock:8,  threshold:6,  unit:"kg",      cost:4.50,  status:"ok",  aiRestock:null, wastePct:12, supplier:"Orussey Market",   lastOrdered:"Today"      },
  { id:"i3", name:"Mango (ripe)",           khmer:"ស្វាយ",             category:"Ingredient", stock:0,  threshold:4,  unit:"kg",      cost:2.00,  status:"out", aiRestock:8,    wastePct:22, supplier:"Orussey Market",   lastOrdered:"4 days ago" },
  { id:"i4", name:"Sticky Rice",            khmer:"អង្ករ",             category:"Ingredient", stock:12, threshold:5,  unit:"kg",      cost:1.20,  status:"ok",  aiRestock:null, wastePct:8,  supplier:"Central Market",   lastOrdered:"3 days ago" },
  { id:"i5", name:"Coconut Milk",           khmer:"ទឹកដោះដូង",        category:"Beverage",   stock:2,  threshold:4,  unit:"cans",    cost:1.80,  status:"low", aiRestock:10,   wastePct:5,  supplier:"Lucky Supermarket",lastOrdered:"Yesterday"  },
  { id:"i6", name:"Lemongrass",             khmer:"គ្រែ",              category:"Spice",      stock:20, threshold:8,  unit:"stalks",  cost:0.10,  status:"ok",  aiRestock:null, wastePct:30, supplier:"Orussey Market",   lastOrdered:"Today"      },
  { id:"i7", name:"Noodles (Thin)",         khmer:"មីស",               category:"Ingredient", stock:4,  threshold:6,  unit:"packs",   cost:0.80,  status:"low", aiRestock:12,   wastePct:6,  supplier:"Central Market",   lastOrdered:"3 days ago" },
  { id:"i8", name:"Chilli Sauce",           khmer:"សាស់ម្ទេស",        category:"Condiment",  stock:6,  threshold:4,  unit:"bottles", cost:2.50,  status:"ok",  aiRestock:null, wastePct:2,  supplier:"Lucky Supermarket",lastOrdered:"1 week ago" },
];

const RESTOCK_PLAN = [
  { item:"Coffee Beans",  khmer:"គ្រាប់កាហ្វេ",  qty:"5 bags",   supplier:"Central Market",   cost:"$60.00", priority:"high",   reason:"94% sellout tonight — rainy forecast",  time:"6 AM tomorrow" },
  { item:"Mango (ripe)",  khmer:"ស្វាយ",          qty:"8 kg",     supplier:"Orussey Market",    cost:"$16.00", priority:"high",   reason:"Out of stock, comfort food demand up",  time:"6 AM tomorrow" },
  { item:"Coconut Milk",  khmer:"ទឹកដោះដូង",      qty:"10 cans",  supplier:"Lucky Supermarket", cost:"$18.00", priority:"medium", reason:"Hot drink demand spike expected",       time:"This morning"  },
  { item:"Noodles (Thin)",khmer:"មីស",             qty:"12 packs", supplier:"Orussey Market",    cost:"$9.60",  priority:"medium", reason:"Low stock, popular for lunch rush",     time:"This morning"  },
];

const WASTE_DATA = [
  { item:"Mango (ripe)",  khmer:"ស្វាយ",    wastePct:22, suggestion:"Sell as mango smoothie by 6PM — cuts waste by 40%",       urgent:true  },
  { item:"Lemongrass",    khmer:"គ្រែ",     wastePct:30, suggestion:"Freeze excess stalks — extends life from 2 to 14 days",  urgent:true  },
  { item:"Pork Cuts",     khmer:"សាច់ជ្រូក",wastePct:12, suggestion:"Marinate leftovers before closing to use next morning",  urgent:false },
];

const pushAlerts: PushAlert[] = [
  { title:"Mango Out of Stock",        icon:AlertTriangle, message:"Mango is out of stock. Rainy evening comfort food demand is expected to spike tonight.",          time:"Just now"    },
  { title:"Coffee Beans Running Low",  icon:TrendingDown,  message:"Only 3 bags left. With tonight's rainy forecast, Hot Latte is 94% likely to sell out by 7PM.",    time:"1 hour ago"  },
  { title:"Lemongrass Waste: 30%",     icon:AlertTriangle, message:"Lemongrass has a 30% waste rate. Consider freezing excess stalks to extend shelf life.",          time:"This morning" },
  { title:"Restock Order Ready",       icon:ShoppingCart,  message:"AI generated a purchase order for 4 items. Total estimated cost: $103.60 at Orussey Market.",     time:"Updated"     },
];

const TABS: { id: TabId; label: string; khmer: string }[] = [
  { id:"overview", label:"Stock Overview",   khmer:"ទិដ្ឋភាពស្តុក"    },
  { id:"restock",  label:"AI Restock Plan",  khmer:"ផែនការបញ្ចូលស្តុក"  },
  { id:"waste",    label:"Waste Prediction", khmer:"ការព្យាករណ៍ខាតបង់"  },
];

const CATEGORIES = ["All", "Beverage", "Ingredient", "Spice", "Condiment"];

const initChat: ChatMsg[] = [
  { role:"assistant", text:"Hello! I'm your Gemini Inventory Assistant. I can predict what to buy, minimize waste, and optimize your stock." },
  { role:"assistant", text:"Mango is out of stock and it's a rainy evening — comfort food demand will be high. Want me to generate a purchase order for morning market?" },
];

const statusStyle: Record<StockStatus, { badge: string }> = {
  ok:  { badge:"bg-[rgba(62,207,142,0.1)] text-[#3ecf8e] border border-[rgba(62,207,142,0.25)]"  },
  low: { badge:"bg-[rgba(245,158,11,0.1)] text-[#f59e0b] border border-[rgba(245,158,11,0.25)]" },
  out: { badge:"bg-[rgba(239,68,68,0.1)] text-[#ef4444] border border-[rgba(239,68,68,0.25)]"   },
};

// ═══════════════════════════════════════════════════════════════════
export default function PremiumInventoryPage() {
  const [isSidebarOpen,      setIsSidebarOpen]      = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [userMenuOpen,       setUserMenuOpen]       = useState(false);
  const [isNotifOpen,        setIsNotifOpen]        = useState(false);
  const [activeTab,          setActiveTab]          = useState<TabId>("overview");
  const [search,             setSearch]             = useState("");
  const [filterStatus,       setFilterStatus]       = useState<"all"|"low"|"out">("all");
  const [filterCategory,     setFilterCategory]     = useState("All");
  const [isChatOpen,         setIsChatOpen]         = useState(false);
  const [chatMsg,            setChatMsg]            = useState("");
  const [chatMessages,       setChatMessages]       = useState<ChatMsg[]>(initChat);
  const [dismissed,          setDismissed]          = useState<number[]>([]);

  useEffect(() => {
    const fn = () => { if (window.innerWidth >= 1024) setIsSidebarOpen(false); };
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  const visibleAlerts = pushAlerts.filter((_,i) => !dismissed.includes(i));

  const handleSend = () => {
    if (!chatMsg.trim()) return;
    setChatMessages(p => [...p, { role:"user", text:chatMsg }]);
    setChatMsg("");
    setTimeout(() => setChatMessages(p => [...p, { role:"assistant", text:"Based on tonight's rainy forecast + your data, buy 8kg Mango and 5 bags Coffee Beans at Orussey Market tomorrow 6AM. Total ~$76. Generate the purchase order?" }]), 900);
  };

  const filtered = INVENTORY.filter(item => {
    const matchSearch   = item.name.toLowerCase().includes(search.toLowerCase()) || item.khmer.includes(search);
    const matchStatus   = filterStatus === "all" || item.status === filterStatus;
    const matchCategory = filterCategory === "All" || item.category === filterCategory;
    return matchSearch && matchStatus && matchCategory;
  });

  const totalValue = INVENTORY.reduce((s,i) => s + i.stock * i.cost, 0);
  const lowCount   = INVENTORY.filter(i => i.status === "low").length;
  const outCount   = INVENTORY.filter(i => i.status === "out").length;
  const wasteCount = INVENTORY.filter(i => i.wastePct >= 15).length;

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
          <NavItem icon={Package}          title="Inventory"  href="/vendor/premium/inventory" collapsed={isSidebarCollapsed} active />
          <NavItem icon={FileBarChart}     title="Reports"    href="/vendor/premium/reports"   collapsed={isSidebarCollapsed} />
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
                        <Link href="/vendor/settings" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3.5 px-5 py-3 text-[14px] text-[#111827] no-underline hover:bg-[#f7f8fa]"><div className="w-5 h-5 rounded-full border border-[#d1d5db] flex items-center justify-center shrink-0"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg></div>account</Link>
                        <Link href="/vendor/pricing" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3.5 px-5 py-3 text-[14px] text-[#111827] no-underline hover:bg-[#f7f8fa]"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>Premium Plan</Link>
                        <button onClick={() => setUserMenuOpen(false)} className="w-full flex items-center gap-3.5 px-5 py-3 text-[14px] text-[#111827] bg-transparent border-0 cursor-pointer hover:bg-[#f7f8fa] text-left"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>Settings</button>
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
              <h1 className="font-bold text-[20px] text-[#111827]">Inventory</h1>
              <span className="text-[13px] text-[#6b7280] hidden sm:block">ការគ្រប់គ្រងស្តុក</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[rgba(139,92,246,0.1)] text-[#8b5cf6] text-[11px] font-bold rounded-full border border-[rgba(139,92,246,0.2)]"><Sparkles size={10} /> PREMIUM</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
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
            <div className="mb-5">
              <h2 className="text-[32px] font-extrabold text-[#111827] leading-tight">My Inventory</h2>
              <p className="text-[14px] text-[#6b7280] mt-1">AI-powered stock management · <span className="text-[#9ca3af]">ការគ្រប់គ្រងស្តុក AI</span></p>
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
                {/* Stat cards — 5 like pro but with premium extras */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                  <div className="bg-[#0d1117] rounded-[14px] border border-white/[0.06] px-[22px] py-5">
                    <div className="text-[10.5px] font-bold text-[#7d8590] uppercase tracking-[0.07em]">Stock Value</div>
                    <div className="text-[10px] text-[#4d5562] mt-0.5 mb-3">តម្លៃស្តុក</div>
                    <div className="text-[30px] font-extrabold text-[#3ecf8e] leading-none">${totalValue.toFixed(2)}</div>
                    <div className="text-[11.5px] text-[#7d8590] mt-1.5">{INVENTORY.length} products</div>
                  </div>
                  <div className="bg-white border border-[#e8eaed] rounded-[14px] px-[22px] py-5 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                    <div className="text-[10.5px] font-bold text-[#6b7280] uppercase tracking-[0.07em]">Low Stock</div>
                    <div className="text-[10px] text-[#9ca3af] mt-0.5 mb-3">ស្តុកជិតអស់</div>
                    <div className="text-[30px] font-bold text-[#f59e0b] leading-none">{lowCount}</div>
                    <div className="text-[11.5px] text-[#6b7280] mt-1.5">items need restock</div>
                  </div>
                  <div className="bg-[#ef4444] rounded-[14px] px-[22px] py-5">
                    <div className="text-[10.5px] font-bold text-white/80 uppercase tracking-[0.07em]">Out of Stock</div>
                    <div className="text-[10px] text-white/60 mt-0.5 mb-3">ស្តុកអស់</div>
                    <div className="text-[30px] font-bold text-white leading-none">{outCount}</div>
                    <div className="text-[11.5px] text-white/70 mt-1.5">items unavailable</div>
                  </div>
                  <div className="bg-[#3ecf8e] rounded-[14px] px-[22px] py-5">
                    <div className="text-[10.5px] font-bold text-white/80 uppercase tracking-[0.07em]">Waste Alerts</div>
                    <div className="text-[10px] text-white/60 mt-0.5 mb-3">ការព្រមានខាតបង់</div>
                    <div className="text-[30px] font-bold text-white leading-none">{wasteCount}</div>
                    <div className="text-[11.5px] text-white/70 mt-1.5">high-waste items</div>
                  </div>
                  {/* 5th card — AI-exclusive, matches pro's Turnover Rate */}
                  <div className="bg-white border border-[#e8eaed] rounded-[14px] px-[22px] py-5 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                    <div className="flex items-center gap-1 mb-0.5"><Brain size={11} className="text-[#8b5cf6]" /><div className="text-[10.5px] font-bold text-[#8b5cf6] uppercase tracking-[0.07em]">Turnover Rate</div></div>
                    <div className="text-[10px] text-[#9ca3af] mt-0.5 mb-3">អត្រាលក់ចេញ</div>
                    <div className="text-[30px] font-bold text-[#111827] leading-none">4.2x</div>
                    <div className="text-[11.5px] text-[#3ecf8e] mt-1.5">Fast moving</div>
                  </div>
                </div>

                {/* Table card — search + Add Item inside header, same as pro */}
                <div className="bg-white border border-[#e8eaed] rounded-[14px] overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                  <div className="px-6 py-5 border-b border-[#f0f2f5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="text-[17px] font-bold text-[#111827]">Master Product List</div>
                      <div className="text-[12px] text-[#6b7280] mt-0.5">បញ្ជីផលិតផលមេ · {filtered.length} of {INVENTORY.length} items</div>
                    </div>
                    <div className="flex items-center gap-3">
                      {/* Status filter pills */}
                      <div className="hidden sm:flex gap-1.5">
                        {(["all","low","out"] as const).map(f => (
                          <button key={f} onClick={() => setFilterStatus(f)}
                            className={`px-3 py-1.5 rounded-[8px] text-[12px] font-semibold border-0 cursor-pointer transition-all ${filterStatus === f ? "bg-[#0d1117] text-[#3ecf8e]" : "bg-[#f0f2f5] text-[#6b7280] hover:bg-[#e8eaed]"}`}>
                            {f === "all" ? "All" : f === "low" ? "⚠️ Low" : "🔴 Out"}
                          </button>
                        ))}
                      </div>
                      {/* Category select */}
                      <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
                        className="hidden sm:block px-3 py-[9px] rounded-[10px] text-[13px] font-medium bg-[#f7f8fa] border border-[#e8eaed] text-[#6b7280] cursor-pointer outline-none"
                        style={{ fontFamily:"inherit" }}>
                        {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                      </select>
                      {/* Search — inside table header like pro */}
                      <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280] pointer-events-none" />
                        <input type="text" placeholder="Search items..." value={search} onChange={e => setSearch(e.target.value)}
                          className="pl-[34px] pr-4 py-[9px] bg-[#f7f8fa] border border-[#e8eaed] rounded-[10px] text-[13px] outline-none text-[#111827] focus:border-[#3ecf8e] w-[180px]"
                          style={{ fontFamily:"inherit" }} />
                      </div>
                      {/* Add Item — inside table header like pro */}
                      <button className="flex items-center gap-2 bg-[#3ecf8e] text-[#0d1117] border-0 rounded-[10px] px-4 py-[9px] font-bold text-[13px] cursor-pointer shadow-[0_2px_12px_rgba(62,207,142,0.25)] hover:bg-[#4dd49a] transition-colors whitespace-nowrap">
                        <Plus size={15} /> Add Item
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-[#f0f2f5]">
                          {["Item","Category","Stock","Min","Supplier","Last Order","Status","AI Restock","Waste Risk","Actions"].map(h => (
                            <th key={h} className="px-[18px] py-[11px] text-[10.5px] font-bold text-[#9ca3af] uppercase tracking-[0.07em] whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map((item, i) => (
                          <tr key={item.id} className={`group transition-colors hover:bg-[#f7f8fa] ${i < filtered.length-1 ? "border-b border-[#f0f2f5]" : ""} ${item.status === "out" ? "bg-[rgba(239,68,68,0.02)]" : ""}`}>
                            <td className="px-[18px] py-[14px]">
                              <div className="text-[13.5px] font-medium text-[#111827]">{item.name}</div>
                              <div className="text-[11px] text-[#9ca3af]">{item.khmer}</div>
                            </td>
                            <td className="px-[18px] py-[14px]">
                              <span className="inline-flex px-2.5 py-[3px] rounded-full text-[11.5px] font-semibold bg-[#f0f2f5] text-[#6b7280] border border-[#e8eaed]">{item.category}</span>
                            </td>
                            <td className="px-[18px] py-[14px]">
                              <div className="flex items-baseline gap-1">
                                <span className="text-[15px] font-bold text-[#111827]">{item.stock}</span>
                                <span className="text-[11px] text-[#9ca3af]">{item.unit}</span>
                              </div>
                            </td>
                            <td className="px-[18px] py-[14px] text-[12.5px] text-[#9ca3af]">{item.threshold} {item.unit}</td>
                            <td className="px-[18px] py-[14px] text-[12.5px] text-[#6b7280] whitespace-nowrap">{item.supplier}</td>
                            <td className="px-[18px] py-[14px] text-[12px] text-[#9ca3af] whitespace-nowrap">{item.lastOrdered}</td>
                            <td className="px-[18px] py-[14px]">
                              <span className={`inline-flex items-center px-2.5 py-[3px] rounded-full text-[11.5px] font-bold ${statusStyle[item.status].badge}`}>
                                {item.status === "ok" ? "✓ In Stock" : item.status === "low" ? "⚠ Low" : "✗ Out"}
                              </span>
                            </td>
                            <td className="px-[18px] py-[14px]">
                              {item.aiRestock
                                ? <div className="flex items-center gap-1.5"><Brain size={12} className="text-[#8b5cf6]" /><span className="text-[12.5px] font-semibold text-[#8b5cf6]">Buy {item.aiRestock} {item.unit}</span></div>
                                : <span className="text-[12px] text-[#d1d5db]">—</span>
                              }
                            </td>
                            <td className="px-[18px] py-[14px]">
                              <div className="flex items-center gap-1.5">
                                <div className="w-[48px] h-1.5 bg-[#f0f2f5] rounded-full overflow-hidden">
                                  <div className="h-full rounded-full transition-all" style={{ width:`${Math.min(item.wastePct*3,100)}%`, background: item.wastePct >= 20 ? "#ef4444" : item.wastePct >= 10 ? "#f59e0b" : "#3ecf8e" }} />
                                </div>
                                <span className={`text-[12px] font-bold ${item.wastePct >= 20 ? "text-[#ef4444]" : item.wastePct >= 10 ? "text-[#f59e0b]" : "text-[#3ecf8e]"}`}>{item.wastePct}%</span>
                              </div>
                            </td>
                            <td className="px-[18px] py-[14px]">
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="w-8 h-8 rounded-[8px] bg-transparent hover:bg-[#f0f2f5] border-0 flex items-center justify-center cursor-pointer text-[#6b7280] hover:text-[#111827]"><Edit2 size={13} /></button>
                                <button className="w-8 h-8 rounded-[8px] bg-transparent hover:bg-[rgba(239,68,68,0.08)] border-0 flex items-center justify-center cursor-pointer text-[#6b7280] hover:text-[#ef4444]"><Trash2 size={13} /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="px-[22px] py-3 border-t border-[#f0f2f5] flex items-center justify-between">
                    <span className="text-[11.5px] text-[#9ca3af]">{filtered.length} items · AI restock & waste powered by Gemini</span>
                    <span className="text-[13px] font-bold text-[#111827]">Total value: <span className="text-[#3ecf8e]">${totalValue.toFixed(2)}</span></span>
                  </div>
                </div>
              </>
            )}

            {/* ══ AI RESTOCK ══ */}
            {activeTab === "restock" && (
              <>
                <div className="bg-[rgba(62,207,142,0.06)] border border-[rgba(62,207,142,0.18)] rounded-[14px] px-[22px] py-4 flex items-center gap-3">
                  <Brain size={15} className="text-[#3ecf8e] shrink-0" />
                  <span className="text-[13px] text-[#111827]">AI generated this restock plan based on tonight's rainy forecast + low stock data. Total: <strong className="text-[#3ecf8e]">$103.60</strong> · Best time: Orussey Market 6–8 AM tomorrow</span>
                  <button className="ml-auto flex items-center gap-1.5 bg-[#3ecf8e] text-[#0d1117] border-0 rounded-[9px] px-3.5 py-2 font-bold text-[12px] cursor-pointer hover:bg-[#4dd49a] whitespace-nowrap shrink-0 transition-colors">
                    <RefreshCw size={12} /> Generate PO
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {RESTOCK_PLAN.map((r, i) => (
                    <div key={i} className={`bg-white border rounded-[14px] px-[22px] py-5 shadow-[0_1px_4px_rgba(0,0,0,0.06)] ${r.priority === "high" ? "border-[rgba(239,68,68,0.2)]" : "border-[#e8eaed]"}`}>
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${r.priority === "high" ? "bg-[rgba(239,68,68,0.1)] text-[#ef4444]" : "bg-[rgba(245,158,11,0.1)] text-[#f59e0b]"}`}>
                          {r.priority.toUpperCase()} PRIORITY
                        </span>
                        <span className="text-[15px] font-bold text-[#3ecf8e]">{r.cost}</span>
                      </div>
                      <div className="text-[15px] font-bold text-[#111827]">{r.item}</div>
                      <div className="text-[11px] text-[#9ca3af] mb-2">{r.khmer}</div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <ShoppingCart size={13} className="text-[#6b7280]" />
                        <span className="text-[13.5px] font-semibold text-[#111827]">{r.qty}</span>
                      </div>
                      <div className="text-[12px] text-[#6b7280]">📍 {r.supplier}</div>
                      <div className="text-[12px] text-[#9ca3af] mt-0.5">🕐 {r.time}</div>
                      <div className="text-[11.5px] text-[#9ca3af] mt-2 leading-tight">{r.reason}</div>
                    </div>
                  ))}
                </div>

                {/* AI Morning Market summary */}
                <div className="bg-[#0d1117] border border-white/[0.06] rounded-[14px] px-[26px] py-[22px]">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-[rgba(62,207,142,0.12)] rounded-[9px]"><Zap size={16} className="text-[#3ecf8e]" /></div>
                    <div>
                      <div className="text-[15px] font-bold text-[#e6edf3]">Tomorrow Morning Market Route</div>
                      <div className="text-[12px] text-[#7d8590] mt-0.5">AI-optimized shopping route · ផ្លូវវិញ្ញាបនប័ត្រទីផ្សារ</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { market:"Orussey Market",    time:"6:00–7:00 AM", items:"Mango (8kg) + Noodles (12 packs)", saving:"18% cheaper than avg" },
                      { market:"Central Market",    time:"7:00–7:30 AM", items:"Coffee Beans (5 bags)",            saving:"Freshest morning stock" },
                      { market:"Lucky Supermarket", time:"7:30–8:00 AM", items:"Coconut Milk (10 cans)",          saving:"Best price for canned" },
                    ].map((stop, i) => (
                      <div key={i} className="p-4 rounded-[11px] bg-white/[0.04] border border-white/[0.07]">
                        <div className="text-[12px] font-bold text-[#3ecf8e] mb-1">Stop {i+1}</div>
                        <div className="text-[13px] font-bold text-[#e6edf3]">{stop.market}</div>
                        <div className="text-[11.5px] text-[#7d8590] mt-0.5">🕐 {stop.time}</div>
                        <div className="text-[11.5px] text-[#4d5562] mt-1.5">{stop.items}</div>
                        <div className="text-[11.5px] text-[#3ecf8e] font-semibold mt-1">💡 {stop.saving}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ══ WASTE PREDICTION ══ */}
            {activeTab === "waste" && (
              <>
                <div className="bg-[rgba(239,68,68,0.04)] border border-[rgba(239,68,68,0.15)] rounded-[14px] px-[22px] py-4 flex items-center gap-3">
                  <AlertTriangle size={15} className="text-[#ef4444] shrink-0" />
                  <span className="text-[13px] text-[#111827]"><strong>{WASTE_DATA.length} high-waste items</strong> detected. Potential weekly savings: <strong className="text-[#3ecf8e]">~$6.80</strong> if all tips applied.</span>
                </div>

                <div className="flex flex-col gap-4">
                  {WASTE_DATA.map((w, i) => (
                    <div key={i} className="bg-white border border-[#e8eaed] rounded-[14px] px-[22px] py-5 flex items-start gap-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                      <div className={`w-14 h-14 rounded-[12px] flex flex-col items-center justify-center shrink-0 font-bold ${w.wastePct >= 20 ? "bg-[rgba(239,68,68,0.1)] text-[#ef4444]" : "bg-[rgba(245,158,11,0.1)] text-[#f59e0b]"}`}>
                        <span className="text-[20px] leading-none">{w.wastePct}%</span>
                        <span className="text-[9px] mt-0.5">waste</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[15px] font-bold text-[#111827]">{w.item}</span>
                          <span className="text-[11px] text-[#9ca3af]">{w.khmer}</span>
                          {w.urgent && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[rgba(239,68,68,0.1)] text-[#ef4444]">Urgent</span>}
                        </div>
                        <div className="flex items-start gap-2">
                          <Brain size={13} className="text-[#3ecf8e] mt-0.5 shrink-0" />
                          <span className="text-[13px] text-[#3ecf8e] font-semibold">{w.suggestion}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-3">
                          <div className="flex-1 h-2 bg-[#f0f2f5] rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all" style={{ width:`${Math.min(w.wastePct*3,100)}%`, background: w.wastePct >= 20 ? "#ef4444" : "#f59e0b" }} />
                          </div>
                          <span className="text-[11.5px] text-[#9ca3af]">{w.wastePct}% of stock wasted</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Full waste overview sorted */}
                <div className="bg-white border border-[#e8eaed] rounded-[14px] overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                  <div className="px-[26px] py-[18px] border-b border-[#f0f2f5]">
                    <div className="text-[14px] font-semibold text-[#111827]">All Items — Waste Overview</div>
                    <div className="text-[11px] text-[#6b7280] mt-0.5">Sorted by waste rate, highest first</div>
                  </div>
                  <div className="p-[22px] flex flex-col gap-3">
                    {[...INVENTORY].sort((a,b) => b.wastePct - a.wastePct).map((item, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="w-[160px] shrink-0">
                          <div className="text-[12.5px] font-medium text-[#111827]">{item.name}</div>
                          <div className="text-[10.5px] text-[#9ca3af]">{item.khmer}</div>
                        </div>
                        <div className="flex-1 h-[7px] bg-[#f0f2f5] rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-700" style={{ width:`${Math.min(item.wastePct*3,100)}%`, background: item.wastePct >= 20 ? "#ef4444" : item.wastePct >= 10 ? "#f59e0b" : "#3ecf8e" }} />
                        </div>
                        <span className={`text-[12.5px] font-bold w-[38px] text-right shrink-0 ${item.wastePct >= 20 ? "text-[#ef4444]" : item.wastePct >= 10 ? "text-[#f59e0b]" : "text-[#3ecf8e]"}`}>{item.wastePct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
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
              <div><p className="font-bold text-[13.5px] text-[#e6edf3]">Gemini Inventory Assistant</p><p className="text-[11px] text-[#4d5562]">Stock · Waste · Restock</p></div>
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
              <input type="text" placeholder="Ask about your inventory..." value={chatMsg} onChange={e => setChatMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSend()}
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