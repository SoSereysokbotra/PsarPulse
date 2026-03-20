"use client";

import React, { useState } from "react";
import {
  LayoutDashboard, CircleDollarSign, Receipt, Users, Package,
  AlertTriangle, FileBarChart, Plus, Edit2, Trash2,
  Search, MessageSquare, Send, Brain,
  Zap, RefreshCw, ShoppingCart, TrendingDown, Sparkles,
  X, ArrowUpRight, FileText, PlusCircle,
} from "lucide-react";

import VendorDashboardLayout from "@/components/vendor/VendorDashboardLayout";
import VendorSummaryCard from "@/components/vendor/VendorSummaryCard";

// ─── Types ────────────────────────────────────────────────────────
type TabId       = "overview" | "restock" | "waste";
type StockStatus = "ok" | "low" | "out";
interface ChatMsg { role: "assistant" | "user"; text: string; }
interface InventoryItem {
  id: string; name: string; khmer: string; category: string;
  stock: number; threshold: number; unit: string; cost: number;
  status: StockStatus; aiRestock: number | null; wastePct: number;
  supplier: string; lastOrdered: string;
}

// ─── Navigation ────────────────────────────────────────────────────
const PREMIUM_NAV = [
  { icon: LayoutDashboard,  title: "Dashboard",  khmerTitle: "ផ្ទាំងគ្រប់គ្រង",  href: "/vendor/premium" },
  { icon: CircleDollarSign, title: "Sales",       khmerTitle: "ការលក់",            href: "/vendor/premium/sales" },
  { icon: Receipt,          title: "Expenses",    khmerTitle: "ចំណាយ",            href: "/vendor/premium/expenses" },
  { icon: Users,            title: "Customers",   khmerTitle: "អតិថិជន",          href: "/vendor/premium/customer" },
  { icon: Package,          title: "Inventory",   khmerTitle: "ស្តុក",             href: "/vendor/premium/inventory", active: true },
  { icon: FileBarChart,     title: "Reports",     khmerTitle: "របាយការណ៍",        href: "/vendor/premium/reports" },
];

// ─── Data ──────────────────────────────────────────────────────────
const INVENTORY: InventoryItem[] = [
  { id:"i1", name:"Coffee Beans (Arabica)", khmer:"គ្រាប់កាហ្វេ",    category:"Beverage",   stock:3,  threshold:5,  unit:"bags",    cost:12.00, status:"low", aiRestock:5,    wastePct:4,  supplier:"Central Market",    lastOrdered:"2 days ago" },
  { id:"i2", name:"Pork Cuts",              khmer:"សាច់ជ្រូក",        category:"Ingredient", stock:8,  threshold:6,  unit:"kg",      cost:4.50,  status:"ok",  aiRestock:null, wastePct:12, supplier:"Orussey Market",    lastOrdered:"Today"      },
  { id:"i3", name:"Mango (ripe)",           khmer:"ស្វាយ",             category:"Ingredient", stock:0,  threshold:4,  unit:"kg",      cost:2.00,  status:"out", aiRestock:8,    wastePct:22, supplier:"Orussey Market",    lastOrdered:"4 days ago" },
  { id:"i4", name:"Sticky Rice",            khmer:"អង្ករ",             category:"Ingredient", stock:12, threshold:5,  unit:"kg",      cost:1.20,  status:"ok",  aiRestock:null, wastePct:8,  supplier:"Central Market",    lastOrdered:"3 days ago" },
  { id:"i5", name:"Coconut Milk",           khmer:"ទឹកដោះដូង",        category:"Beverage",   stock:2,  threshold:4,  unit:"cans",    cost:1.80,  status:"low", aiRestock:10,   wastePct:5,  supplier:"Lucky Supermarket", lastOrdered:"Yesterday"  },
  { id:"i6", name:"Lemongrass",             khmer:"គ្រែ",              category:"Spice",      stock:20, threshold:8,  unit:"stalks",  cost:0.10,  status:"ok",  aiRestock:null, wastePct:30, supplier:"Orussey Market",    lastOrdered:"Today"      },
  { id:"i7", name:"Noodles (Thin)",         khmer:"មីស",               category:"Ingredient", stock:4,  threshold:6,  unit:"packs",   cost:0.80,  status:"low", aiRestock:12,   wastePct:6,  supplier:"Central Market",    lastOrdered:"3 days ago" },
  { id:"i8", name:"Chilli Sauce",           khmer:"សាស់ម្ទេស",        category:"Condiment",  stock:6,  threshold:4,  unit:"bottles", cost:2.50,  status:"ok",  aiRestock:null, wastePct:2,  supplier:"Lucky Supermarket", lastOrdered:"1 week ago" },
];

const RESTOCK_PLAN = [
  { item:"Coffee Beans",  khmer:"គ្រាប់កាហ្វេ",  qty:"5 bags",   supplier:"Central Market",    cost:"$60.00", priority:"high",   reason:"94% sellout tonight — rainy forecast",  time:"6 AM tomorrow" },
  { item:"Mango (ripe)",  khmer:"ស្វាយ",          qty:"8 kg",     supplier:"Orussey Market",    cost:"$16.00", priority:"high",   reason:"Out of stock, comfort food demand up",  time:"6 AM tomorrow" },
  { item:"Coconut Milk",  khmer:"ទឹកដោះដូង",      qty:"10 cans",  supplier:"Lucky Supermarket", cost:"$18.00", priority:"medium", reason:"Hot drink demand spike expected",       time:"This morning"  },
  { item:"Noodles (Thin)",khmer:"មីស",             qty:"12 packs", supplier:"Orussey Market",    cost:"$9.60",  priority:"medium", reason:"Low stock, popular for lunch rush",     time:"This morning"  },
];

const WASTE_DATA = [
  { item:"Mango (ripe)",  khmer:"ស្វាយ",    wastePct:22, suggestion:"Sell as mango smoothie by 6PM — cuts waste by 40%",       urgent:true  },
  { item:"Lemongrass",    khmer:"គ្រែ",     wastePct:30, suggestion:"Freeze excess stalks — extends life from 2 to 14 days",  urgent:true  },
  { item:"Pork Cuts",     khmer:"សាច់ជ្រូក",wastePct:12, suggestion:"Marinate leftovers before closing to use next morning",  urgent:false },
];

const TABS: { id: TabId; label: string; khmer: string }[] = [
  { id:"overview", label:"Stock Overview",   khmer:"ទិដ្ឋភាពស្តុក"     },
  { id:"restock",  label:"AI Restock Plan",  khmer:"ផែនការបញ្ចូលស្តុក" },
  { id:"waste",    label:"Waste Prediction", khmer:"ការព្យាករណ៍ខាតបង់" },
];

const CATEGORIES = ["All", "Beverage", "Ingredient", "Spice", "Condiment"];

const initChat: ChatMsg[] = [
  { role:"assistant", text:"Hello! I'm your Gemini Inventory Assistant. I can predict what to buy, minimize waste, and optimize your stock." },
  { role:"assistant", text:"Mango is out of stock and it's a rainy evening — comfort food demand will be high. Want me to generate a purchase order for morning market?" },
];



// ═══════════════════════════════════════════════════════════════════
export default function PremiumInventoryPage() {
  const [activeTab,      setActiveTab]      = useState<TabId>("overview");
  const [search,         setSearch]         = useState("");
  const [filterStatus,   setFilterStatus]   = useState<"all"|"low"|"out">("all");
  const [filterCategory, setFilterCategory] = useState("All");
  const [isChatOpen,     setIsChatOpen]     = useState(false);
  const [chatMsg,        setChatMsg]        = useState("");
  const [chatMessages,   setChatMessages]   = useState<ChatMsg[]>(initChat);

  const totalValue = INVENTORY.reduce((s, i) => s + i.stock * i.cost, 0);
  const lowCount   = INVENTORY.filter(i => i.status === "low").length;
  const outCount   = INVENTORY.filter(i => i.status === "out").length;
  const wasteCount = INVENTORY.filter(i => i.wastePct >= 15).length;

  const filtered = INVENTORY.filter(item => {
    const matchSearch   = item.name.toLowerCase().includes(search.toLowerCase()) || item.khmer.includes(search);
    const matchStatus   = filterStatus === "all" || item.status === filterStatus;
    const matchCategory = filterCategory === "All" || item.category === filterCategory;
    return matchSearch && matchStatus && matchCategory;
  });

  const handleSend = () => {
    if (!chatMsg.trim()) return;
    setChatMessages(p => [...p, { role: "user", text: chatMsg }]);
    setChatMsg("");
    setTimeout(() =>
      setChatMessages(p => [...p, { role: "assistant", text: "Based on tonight's rainy forecast + your data, buy 8kg Mango and 5 bags Coffee Beans at Orussey Market tomorrow 6AM. Total ~$76. Generate the purchase order?" }])
    , 900);
  };

  return (
    <VendorDashboardLayout
      plan="premium"
      navLinks={PREMIUM_NAV}
      currentPath="/vendor/premium/inventory"
      title="Inventory"
      planBadge={{ label: "PREMIUM", icon: Sparkles }}
      rightActions={
        <button
          onClick={() => setIsChatOpen(o => !o)}
          className="flex items-center gap-1.5 bg-gradient-to-r from-[#8b5cf6] to-[#3ecf8e] text-white border-0 rounded-[10px] px-3.5 py-[9px] font-bold text-[13px] cursor-pointer hover:opacity-90"
        >
          <Brain size={14} /> Gemini AI
        </button>
      }
    >
      {/* ══ SCROLLABLE CONTENT ══════════════════════════════════════ */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-7">

        {/* ── Page Header ── */}
        <div className="pt-1 pb-2">
          <h2 className="text-[32px] font-extrabold text-[#111827] leading-tight">My Inventory</h2>
          <p className="text-[14px] text-[#6b7280] mt-1">
            AI-powered stock management ·{" "}
            <span className="text-[#9ca3af]">ការគ្រប់គ្រងស្តុក AI</span>
          </p>
        </div>

        {/* ── Low Stock Alert Banner (reused from pro/inventory) ── */}
        {(lowCount > 0 || outCount > 0) && (
          <div className="bg-[rgba(245,158,11,0.06)] rounded-[14px] px-[22px] py-5 border border-[rgba(245,158,11,0.2)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
            <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-[rgba(245,158,11,0.06)] pointer-events-none" />
            <div className="flex items-start gap-4 z-10">
              <div className="p-2.5 bg-white border border-[rgba(245,158,11,0.25)] rounded-[11px] shrink-0 shadow-sm">
                <AlertTriangle className="w-5 h-5 text-[#f59e0b]" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-[15px] text-[#92400e]">
                    Low Stock Alert ({lowCount + outCount} Items)
                  </h3>
                </div>
                <p className="text-[#b45309] text-[13px] leading-relaxed max-w-2xl">
                  {INVENTORY.filter(i => i.status === "low" || i.status === "out").map(i => i.name).join(", ")} {lowCount + outCount > 1 ? "are" : "is"} running low or out of stock.
                  Generate a restock order or check the AI Restock Plan tab.
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab("restock")}
              className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold rounded-[10px] transition-colors text-[13px] shadow-sm min-h-[40px] z-10 shrink-0 border-0 cursor-pointer whitespace-nowrap"
            >
              <FileText className="w-4 h-4" /> View AI Restock Plan
            </button>
          </div>
        )}

        {/* ── Tabs ── */}
        <div className="flex items-end gap-0 border-b border-[#e8eaed] -mt-3">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 text-[13.5px] font-medium border-b-2 -mb-px flex flex-col items-start gap-0.5 bg-transparent border-x-0 border-t-0 cursor-pointer transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-b-[#111827] text-[#111827] font-semibold"
                  : "border-b-transparent text-[#6b7280] hover:text-[#111827]"
              }`}
            >
              <span>{tab.label}</span>
              <span className="text-[10px] text-[#9ca3af]">{tab.khmer}</span>
            </button>
          ))}
        </div>

        {/* ══ OVERVIEW TAB ══ */}
        {activeTab === "overview" && (
          <>
            {/* Summary Cards — reusing VendorSummaryCard */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              <VendorSummaryCard
                title="Stock Value"
                khmerTitle="តម្លៃស្តុក"
                value={`$${totalValue.toFixed(2)}`}
                icon={CircleDollarSign}
                variant="dark"
                subtext={`${INVENTORY.length} products`}
              />
              <VendorSummaryCard
                title="Low Stock"
                khmerTitle="ស្តុកជិតអស់"
                value={lowCount}
                icon={AlertTriangle}
                trend="Needs restock"
                isPositive={false}
              />
              <VendorSummaryCard
                title="Out of Stock"
                khmerTitle="ស្តុកអស់"
                value={outCount}
                icon={Package}
                trend="Unavailable"
                isPositive={false}
              />
              <VendorSummaryCard
                title="Waste Alerts"
                khmerTitle="ការព្រមានខាតបង់"
                value={wasteCount}
                icon={TrendingDown}
                trend="High-waste items"
                isPositive={false}
              />
              {/* AI exclusive — highlight green like pro's Turnover Rate card */}
              <VendorSummaryCard
                title="Turnover Rate"
                khmerTitle="អត្រាលក់ចេញ"
                value="4.2x"
                icon={ArrowUpRight}
                trend="Fast moving"
                isPositive={true}
                highlight
              />
            </div>

            {/* Inventory Table Card */}
            <div className="bg-white border border-[#e8eaed] rounded-[14px] overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
              <div className="px-6 py-5 border-b border-[#f0f2f5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-[17px] font-bold text-[#111827]">Master Product List</div>
                  <div className="text-[12px] text-[#6b7280] mt-0.5">
                    បញ្ជីផលិតផលមេ · {filtered.length} of {INVENTORY.length} items
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
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
                    className="hidden sm:block px-3 py-[9px] rounded-[10px] text-[13px] font-medium bg-[#f7f8fa] border border-[#e8eaed] text-[#6b7280] cursor-pointer outline-none">
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                  {/* Search */}
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280] pointer-events-none" />
                    <input type="text" placeholder="Search items..." value={search} onChange={e => setSearch(e.target.value)}
                      className="pl-[34px] pr-4 py-[9px] bg-[#f7f8fa] border border-[#e8eaed] rounded-[10px] text-[13px] outline-none text-[#111827] focus:border-[#3ecf8e] w-[180px]" />
                  </div>
                  {/* Add Item */}
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
                          <div className="flex items-center gap-2.5">
                            <span className="text-[15px] font-bold text-[#111827] w-5 shrink-0">{item.stock}</span>
                            <div className="flex flex-col gap-1">
                              <div className="w-[56px] h-1.5 bg-[#f0f2f5] rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full transition-all"
                                  style={{
                                    width: `${Math.min((item.stock / (item.threshold * 2)) * 100, 100)}%`,
                                    background: item.status === "out" ? "#ef4444" : item.status === "low" ? "#f59e0b" : "#3ecf8e",
                                  }}
                                />
                              </div>
                              <span className="text-[10px] text-[#9ca3af]">{item.unit}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-[18px] py-[14px] text-[12.5px] text-[#9ca3af]">{item.threshold} {item.unit}</td>
                        <td className="px-[18px] py-[14px] text-[12.5px] text-[#6b7280] whitespace-nowrap">{item.supplier}</td>
                        <td className="px-[18px] py-[14px] text-[12px] text-[#9ca3af] whitespace-nowrap">{item.lastOrdered}</td>
                        <td className="px-[18px] py-[14px]">
                          {item.status === "out" ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-[7px] bg-[rgba(239,68,68,0.1)] text-[#ef4444] text-[11.5px] font-bold border border-[rgba(239,68,68,0.2)]">
                              Out of Stock
                            </span>
                          ) : item.status === "low" ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-[7px] bg-[rgba(245,158,11,0.1)] text-[#f59e0b] text-[11.5px] font-bold border border-[rgba(245,158,11,0.2)]">
                              Low Stock
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-[7px] bg-[rgba(62,207,142,0.1)] text-[#3ecf8e] text-[11.5px] font-bold border border-[rgba(62,207,142,0.2)]">
                              In Stock
                            </span>
                          )}
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
                            <button className="w-8 h-8 rounded-[8px] bg-transparent hover:bg-[rgba(62,207,142,0.1)] border-0 flex items-center justify-center cursor-pointer text-[#6b7280] hover:text-[#3ecf8e]" title="Quick Restock"><PlusCircle size={13} /></button>
                            <button className="w-8 h-8 rounded-[8px] bg-transparent hover:bg-[#f0f2f5] border-0 flex items-center justify-center cursor-pointer text-[#6b7280] hover:text-[#111827]" title="Edit"><Edit2 size={13} /></button>
                            <button className="w-8 h-8 rounded-[8px] bg-transparent hover:bg-[rgba(239,68,68,0.08)] border-0 flex items-center justify-center cursor-pointer text-[#6b7280] hover:text-[#ef4444]" title="Delete"><Trash2 size={13} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="px-[22px] py-3 border-t border-[#f0f2f5] flex items-center justify-between">
                <span className="text-[11.5px] text-[#9ca3af]">{filtered.length} items · AI restock &amp; waste powered by Gemini</span>
                <span className="text-[13px] font-bold text-[#111827]">Total value: <span className="text-[#3ecf8e]">${totalValue.toFixed(2)}</span></span>
              </div>
            </div>
          </>
        )}

        {/* ══ AI RESTOCK TAB ══ */}
        {activeTab === "restock" && (
          <>
            <div className="bg-[rgba(62,207,142,0.06)] border border-[rgba(62,207,142,0.18)] rounded-[14px] px-[22px] py-4 flex items-center gap-3">
              <Brain size={15} className="text-[#3ecf8e] shrink-0" />
              <span className="text-[13px] text-[#111827]">AI generated this restock plan based on tonight&apos;s rainy forecast + low stock data. Total: <strong className="text-[#3ecf8e]">$103.60</strong> · Best time: Orussey Market 6–8 AM tomorrow</span>
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

            {/* AI Morning Market Route */}
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
                  { market:"Lucky Supermarket", time:"7:30–8:00 AM", items:"Coconut Milk (10 cans)",           saving:"Best price for canned" },
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

        {/* ══ WASTE PREDICTION TAB ══ */}
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

            {/* Full waste overview */}
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

      {/* ══ GEMINI AI CHAT (floating overlay) ══════════════════════ */}
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
                className="flex-1 px-4 py-2.5 bg-[#f7f8fa] border border-[#e8eaed] rounded-[10px] text-[13px] outline-none text-[#111827] focus:border-[#3ecf8e]" />
              <button onClick={handleSend} className="p-2.5 bg-gradient-to-br from-[#8b5cf6] to-[#3ecf8e] text-white rounded-[10px] border-0 cursor-pointer hover:opacity-90"><Send size={15} /></button>
            </div>
          </div>
        </div>
      )}
    </VendorDashboardLayout>
  );
}