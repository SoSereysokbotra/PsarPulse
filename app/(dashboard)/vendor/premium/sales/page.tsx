"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  LayoutDashboard,
  CircleDollarSign,
  Receipt,
  Users,
  Package,
  Plus,
  Search,
  MoreVertical,
  X,
  Clock,
  Filter,
  TrendingUp,
  TrendingDown,
  FileBarChart,
  Sparkles,
  FileText,
  FileSpreadsheet,
  Brain,
  MessageSquare,
  Zap,
  CheckCircle2,
  Send,
} from "lucide-react";

import VendorDashboardLayout from "@/components/vendor/VendorDashboardLayout";
import VendorSummaryCard from "@/components/vendor/VendorSummaryCard";
import AIHub from "@/components/vendor/premium/AIHub";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import { offlineFetch } from "@/lib/pwa/offline-fetch";

// ─── Local Types ───────────────────────────────────────────────────
export type Period = "Day" | "Week" | "Month";
export type Method = "Cash" | "ABA/KHQR" | "Other";
export type ToastT = {
  id: number;
  msg: string;
  type: "success" | "error";
};

const PREMIUM_NAV = [
  {
    icon: LayoutDashboard,
    title: "Dashboard",
    khmerTitle: "ផ្ទាំងគ្រប់គ្រង",
    href: "/vendor/premium",
  },
  {
    icon: CircleDollarSign,
    title: "Sales",
    khmerTitle: "ការលក់",
    href: "/vendor/premium/sales",
    active: true,
  },
  {
    icon: Receipt,
    title: "Expenses",
    khmerTitle: "ចំណាយ",
    href: "/vendor/premium/expenses",
  },
  {
    icon: Users,
    title: "Customers",
    khmerTitle: "អតិថិជន",
    href: "/vendor/premium/customer",
  },
  {
    icon: Package,
    title: "Inventory",
    khmerTitle: "ស្តុក",
    href: "/vendor/premium/inventory",
  },
  {
    icon: FileBarChart,
    title: "Reports",
    khmerTitle: "របាយការណ៍",
    href: "/vendor/premium/reports",
  },
];

// Data fetch uses dynamic state

const smartAlerts = [
  {
    type: "opportunity",
    message:
      "Rain starting! Demand for umbrellas and rain gear is spiking. Suggest moving them to the front.",
    time: "10 min ago",
  },
  {
    type: "warning",
    message:
      "Sales dropped 15% in the last hour compared to historical average.",
    time: "1 hour ago",
  },
];

const weatherData = {
  condition: "Rainy Evening",
  temp: "28°C",
  icon: "Rain",
  impact: "busy",
  suggestions: [
    {
      product: "Umbrellas & Rain Gear",
      change: "+20%",
      reason: "Demand for weather protection rises in rain",
    },
  ],
};
// ═══════════════════════════════════════════════════════════════════
export default function PremiumSalesPage() {
  const { language } = useLanguage();
  const { resolvedTheme } = useTheme();
  const isKhmer = language === "km";
  const [salesRaw, setSalesRaw] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Custom Modal States from free tier
  const [inventory, setInventory] = useState<any[]>([]);
  const [fAmount, setFAmount] = useState("");
  const [fItems, setFItems] = useState("");
  const [fMethod, setFMethod] = useState<Method>("Cash");
  const [fInventoryItemId, setFInventoryItemId] = useState<string | null>(null);
  const [fQuantity, setFQuantity] = useState<number>(1);
  const amountRef = React.useRef<HTMLInputElement>(null);
  const isDark = resolvedTheme === "dark";

  const [isQuickLogModalOpen, setIsQuickLogModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [period, setPeriod] = useState<Period>("Day");
  const [searchQuery, setSearchQuery] = useState("");
  const [saving, setSaving] = useState(false);
  const [toasts, setToasts] = useState<ToastT[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  const showToast = useCallback(
    (msg: string, type: ToastT["type"] = "success") => {
      const id = Date.now();
      setToasts((p) => [...p, { id, msg, type }]);
      setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3500);
    },
    [],
  );

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [salesRes, invRes] = await Promise.all([
        offlineFetch("/api/vendor/sales"),
        offlineFetch("/api/vendor/inventory"),
      ]);
      const salesJson = await salesRes.json();
      const invJson = await invRes.json();
      if (salesJson.success) setSalesRaw(salesJson.data);
      if (invJson.success) setInventory(invJson.data);
    } catch (err) {
      console.error("Sales fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleExportPDF = () => {
    const printContent = `
      <html>
        <head>
          <title>PsarPulse Premium Sales Report</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #111827; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #29B28D; pb: 20px; mb: 30px; }
            .title { font-size: 24px; font-weight: 800; color: #111827; }
            .meta { font-size: 12px; color: #6b7280; }
            table { w-full; border-collapse: collapse; mt: 30px; }
            th { text-align: left; padding: 12px; font-size: 11px; text-transform: uppercase; color: #9ca3af; border-bottom: 1px solid #e8eaed; }
            td { padding: 12px; font-size: 13px; border-bottom: 1px solid #f0f2f5; }
            .amount { font-weight: 700; color: #29B28D; }
            .footer { mt: 50px; pt: 20px; border-top: 1px solid #e8eaed; font-size: 10px; color: #9ca3af; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="title">Sales Performance Report</div>
              <div class="meta">PsarPulse Premium · Generated ${new Date().toLocaleString()}</div>
            </div>
            <div style="text-align: right">
              <div style="font-weight: 800; font-size: 18px; color: #29B28D">Premium Tier</div>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Items Sold</th>
                <th>Method</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${filteredSales
                .map(
                  (s) => `
                <tr>
                  <td>${new Date(s.createdAt).toLocaleDateString()}</td>
                  <td>${s.items || "N/A"}</td>
                  <td>${s.method || "Cash"}</td>
                  <td class="amount">$${parseFloat(s.amount).toFixed(2)}</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
          <div class="footer">
            Confidential Business Report · Generated by PsarPulse AI Intelligence
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const filteredSales = useMemo(() => {
    const now = new Date();
    const isWithinPeriod = (dateStr: string) => {
      const d = new Date(dateStr);
      if (period === "Day") return d.toDateString() === now.toDateString();
      if (period === "Week") {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return d >= weekAgo;
      }
      if (period === "Month") {
        const monthAgo = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          now.getDate(),
        );
        return d >= monthAgo;
      }
      return true;
    };

    return salesRaw.filter(
      (s) =>
        ((s.items || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (s.id || "")
            .toString()
            .toLowerCase()
            .includes(searchQuery.toLowerCase())) &&
        isWithinPeriod(s.createdAt),
    );
  }, [salesRaw, searchQuery, period]);

  const stats = useMemo(() => {
    const now = new Date();
    const isWithinPeriod = (dateStr: string) => {
      const d = new Date(dateStr);
      if (period === "Day") return d.toDateString() === now.toDateString();
      if (period === "Week") {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return d >= weekAgo;
      }
      if (period === "Month") {
        const monthAgo = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          now.getDate(),
        );
        return d >= monthAgo;
      }
      return true;
    };

    const periodSales = salesRaw.filter((s) => isWithinPeriod(s.createdAt));
    const totalRevenue = periodSales.reduce(
      (s, t) => s + parseFloat(t.amount || "0"),
      0,
    );
    const count = periodSales.length;
    const avgSale = count > 0 ? totalRevenue / count : 0;
    return { totalRevenue, avgSale, count };
  }, [salesRaw, period]);

  const handleSendMessage = async () => {
    if (!chatMessage.trim() || isChatLoading) return;
    const userMsg = { role: "user", content: chatMessage };
    setMessages((p) => [...p, userMsg]);
    setChatMessage("");
    setIsChatLoading(true);

    try {
      const res = await offlineFetch("/api/vendor/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.content, context: "sales" }),
      });
      const json = await res.json();
      if (json.success) {
        setMessages((p) => [
          ...p,
          { role: "assistant", content: json.response },
        ]);
      } else {
        setMessages((p) => [
          ...p,
          { role: "assistant", content: "Sorry, I encountered an error." },
        ]);
      }
    } catch (err) {
      console.error("Chat error:", err);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this sale record?")) return;
    try {
      // optimistic ui not used here for reliability, but could be added
      const res = await offlineFetch(`/api/vendor/sales?id=${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        showToast("Sale deleted successfully");
        setSalesRaw((prev) => prev.filter((t) => t.id !== id));
      } else {
        showToast(json.message || "Error deleting sale", "error");
      }
    } catch (err) {
      console.error("Delete error:", err);
      showToast("Server error occurred", "error");
    }
  };

  const handleSave = async () => {
    if (!fAmount || Number.isNaN(Number(fAmount)) || saving) return;

    if (fInventoryItemId) {
      const selectedItem = inventory.find((i) => i.id === fInventoryItemId);
      const availableStock = Number(selectedItem?.stock ?? 0);
      const isOut = selectedItem?.status === "out" || availableStock <= 0;

      if (!selectedItem || isOut) {
        showToast(isKhmer ? "ទំនិញអស់ស្តុក" : "Item is out of stock", "error");
        return;
      }

      if (fQuantity > availableStock) {
        showToast(
          isKhmer
            ? `ស្តុកមិនគ្រប់គ្រាន់ (មាន ${availableStock})`
            : `Insufficient stock (available: ${availableStock})`,
          "error",
        );
        return;
      }
    }

    setSaving(true);
    try {
      const res = await offlineFetch("/api/vendor/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(fAmount),
          method: fMethod,
          items: fItems,
          inventoryItemId: fInventoryItemId,
          quantity: fQuantity,
        }),
      });

      const result = await res.json();
      if (res.ok && result.success) {
        setIsQuickLogModalOpen(false);
        setFAmount("");
        setFItems("");
        setFMethod("Cash");
        setFInventoryItemId(null);
        setFQuantity(1);
        showToast(isKhmer ? "បានកត់ត្រាជោគជ័យ" : "Sale logged successfully");
        fetchData();
      } else {
        showToast(result.message || "Error saving sale", "error");
      }
    } catch (error) {
      console.error("Save sale error:", error);
      showToast("Error saving sale", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <VendorDashboardLayout
      settingsHref="/vendor/premium/settings"
      plan="premium"
      navLinks={PREMIUM_NAV}
      currentPath="/vendor/premium/sales"
      title={isKhmer ? "ការលក់" : "Sales"}
      planBadge={{ label: isKhmer ? "PREMIUM" : "PREMIUM", icon: Sparkles }}
      rightActions={
        <>
          <div className="hidden sm:flex items-center bg-[#f0f2f5] dark:bg-[#161B22] border border-[#e8eaed] dark:border-white/10 rounded-[10px] p-[3px] transition-colors">
            {(["Day", "Week", "Month"] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-[7px] rounded-[8px] text-[13px] font-semibold border-0 cursor-pointer transition-all ${
                  period === p
                    ? "bg-white dark:bg-[#0d1117] text-[#111827] dark:text-white shadow-[0_1px_4px_rgba(0,0,0,0.08)]"
                    : "bg-transparent text-[#6b7280] dark:text-[#7d8590] hover:text-[#111827] dark:hover:text-white"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <button
            onClick={handleExportPDF}
            className="hidden sm:flex items-center gap-2 bg-[#0d1117] dark:bg-white hover:opacity-90 text-white dark:text-[#0d1117] font-medium px-4 py-[9px] rounded-[10px] transition-colors text-[13px] cursor-pointer border-0"
          >
            <FileText className="w-4 h-4" />{" "}
            {isKhmer ? "ទាញយកជា PDF" : "Export PDF"}
          </button>
          <div className="relative">
            <button
              onClick={() => {
                if (isQuickLogModalOpen) {
                  setIsQuickLogModalOpen(false);
                  return;
                }

                setIsQuickLogModalOpen(true);
                setFAmount("");
                setFItems("");
                setFMethod("Cash");
                setFInventoryItemId(null);
                setFQuantity(1);
              }}
              className={`flex items-center gap-[7px] border-0 rounded-[10px] px-4 py-[9px] font-bold text-[13px] cursor-pointer transition-all ${isQuickLogModalOpen ? "bg-[#0d1117] text-white shadow-[0_2px_14px_rgba(0,0,0,0.15)]" : "bg-[#29B28D] text-white shadow-[0_2px_14px_rgba(41,178,141,0.28)] hover:opacity-90"}`}
            >
              {isQuickLogModalOpen ? <X size={14} /> : <Sparkles size={14} />}{" "}
              {isQuickLogModalOpen
                ? isKhmer
                  ? "បោះបង់"
                  : "Cancel"
                : isKhmer
                  ? "បន្ថែមដោយឆ្លាតវៃ"
                  : "Smart Add"}
            </button>
            {isQuickLogModalOpen && (
              <div
                className="absolute top-[calc(100%+10px)] right-0 w-[360px] bg-white dark:bg-[#0d1117] border border-[#e8eaed] dark:border-white/10 rounded-[14px] shadow-[0_20px_56px_rgba(0,0,0,0.18)] overflow-hidden"
                style={{ zIndex: 9999 }}
                onMouseDown={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-2 px-[18px] py-[14px] border-b border-[#e8eaed] dark:border-white/5">
                  <Sparkles className="w-4 h-4 text-[#29B28D]" />
                  <span className="font-bold text-sm text-[#111827] dark:text-white">
                    {isKhmer ? "បន្ថែមការលក់រហ័ស" : "Quick Add Sale"}
                  </span>
                  <span className="text-[11px] text-[#6b7280] dark:text-[#7d8590] ml-auto">
                    {isKhmer ? "ដោយដៃ" : "Manual"}
                  </span>
                </div>
                <div className="p-[14px_18px] max-h-[60vh] overflow-y-auto">
                  <div className="space-y-4">
                    <div className="p-3 bg-[rgba(41,178,141,0.08)] border border-[rgba(41,178,141,0.18)] rounded-[12px] text-[12.5px] text-[#29B28D] flex items-center gap-2 font-medium">
                      <CheckCircle2 size={14} />{" "}
                      {isKhmer
                        ? "បញ្ចូលព័ត៌មានលក់ដោយដៃ"
                        : "Enter sale details manually"}
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#6b7280] dark:text-[#7d8590] uppercase tracking-[0.08em] mb-2">
                        {isKhmer ? "ជ្រើសរើសពីស្តុក" : "Quick Pick (Inventory)"}
                      </label>
                      <div className="grid grid-cols-2 gap-1.5">
                        {inventory.length > 0 ? (
                          inventory.map((item) => {
                            const isSelected = fInventoryItemId === item.id;
                            const stock = Number(item.stock ?? 0);
                            const isOut = item.status === "out" || stock <= 0;
                            return (
                              <button
                                key={item.id}
                                type="button"
                                disabled={isOut}
                                onClick={() => {
                                  if (isOut) return;
                                  if (isSelected) {
                                    setFInventoryItemId(null);
                                    setFQuantity(1);
                                    setFAmount("");
                                    setFItems("");
                                  } else {
                                    setFInventoryItemId(item.id);
                                    setFQuantity(1);
                                    setFAmount(item.price.toString());
                                    setFItems(`1x ${item.name}`);
                                  }
                                }}
                                className={`px-3 py-[9px] rounded-[9px] text-left transition-all duration-[120ms] relative border ${isOut ? "bg-[#f3f4f6] dark:bg-[#11161f] border-[#e5e7eb] dark:border-white/5 opacity-60 cursor-not-allowed" : isSelected ? "bg-[rgba(41,178,141,0.12)] border-[#29B28D] cursor-pointer" : "bg-[#f7f8fa] dark:bg-[#0d1117] border-[#e8eaed] dark:border-white/5 hover:bg-[#eff0f2] cursor-pointer"}`}
                              >
                                <div
                                  className={`text-xs font-semibold truncate mb-0.5 ${isOut ? "text-[#9ca3af]" : isSelected ? "text-[#29B28D]" : "text-[#111827] dark:text-white"}`}
                                >
                                  {item.name}
                                </div>
                                <div
                                  className={`text-[11px] font-bold ${isOut ? "text-[#9ca3af]" : isSelected ? "text-[#29B28D]" : "text-[#6b7280] dark:text-[#7d8590]"}`}
                                >
                                  ${parseFloat(item.price).toFixed(2)}
                                </div>
                                <div className="text-[10px] mt-0.5 text-[#9ca3af]">
                                  {isOut
                                    ? isKhmer
                                      ? "អស់ស្តុក"
                                      : "Out of stock"
                                    : `${isKhmer ? "ស្តុក" : "Stock"}: ${stock}`}
                                </div>
                                {isSelected && (
                                  <span className="absolute top-1.5 right-2 bg-[#29B28D] text-[#0E1319] rounded-full w-[17px] h-[17px] text-[9px] font-extrabold flex items-center justify-center">
                                    {fQuantity}
                                  </span>
                                )}
                              </button>
                            );
                          })
                        ) : (
                          <div className="col-span-2 py-8 flex flex-col items-center justify-center rounded-lg border border-dashed border-[#e8eaed] dark:border-white/10">
                            <span className="text-[13px] font-bold text-[#6b7280] dark:text-[#7d8590]">
                              No data. Add item
                            </span>
                            <span className="text-[10px] text-[#7d8590] mt-1 text-center">
                              Add products to your inventory first
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {fInventoryItemId && (
                      <div className="flex items-center justify-between py-2 border-t border-[#f0f2f5] mb-1 mt-1">
                        <span className="text-xs text-[#6b7280] dark:text-[#7d8590] font-medium">
                          Quantity
                        </span>
                        <div className="flex items-center bg-[#f7f8fa] dark:bg-[#0d1117] border border-[#e8eaed] dark:border-white/5 rounded-[8px] overflow-hidden">
                          <button
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              const newQty = Math.max(1, fQuantity - 1);
                              setFQuantity(newQty);
                              const item = inventory.find(
                                (i) => i.id === fInventoryItemId,
                              );
                              if (item) {
                                setFAmount(
                                  (parseFloat(item.price) * newQty).toString(),
                                );
                                setFItems(`${newQty}x ${item.name}`);
                              }
                            }}
                            className="w-7 h-7 bg-transparent border-0 cursor-pointer text-[#6b7280] dark:text-[#7d8590] flex items-center justify-center hover:bg-[#e8eaed]"
                          >
                            -
                          </button>
                          <span className="text-[13px] font-bold min-w-[24px] text-center">
                            {fQuantity}
                          </span>
                          <button
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              const item = inventory.find(
                                (i) => i.id === fInventoryItemId,
                              );
                              const availableStock = Number(item?.stock ?? 0);
                              const newQty = Math.min(
                                availableStock,
                                fQuantity + 1,
                              );
                              setFQuantity(newQty);
                              if (item) {
                                setFAmount(
                                  (parseFloat(item.price) * newQty).toString(),
                                );
                                setFItems(`${newQty}x ${item.name}`);
                              }
                            }}
                            className="w-7 h-7 bg-transparent border-0 cursor-pointer text-[#6b7280] dark:text-[#7d8590] flex items-center justify-center hover:bg-[#e8eaed]"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-[11px] font-bold text-[#6b7280] dark:text-[#7d8590] uppercase tracking-[0.08em] mb-2">
                        {isKhmer ? "ចំនួនទឹកប្រាក់ ($)" : "Amount ($)"}
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-lg">
                          $
                        </span>
                        <input
                          ref={amountRef}
                          type="number"
                          placeholder="0.00"
                          value={fAmount}
                          onChange={(e) => {
                            setFAmount(e.target.value);
                            setFInventoryItemId(null);
                          }}
                          disabled={!!fInventoryItemId}
                          className={`w-full pl-9 pr-4 py-4 rounded-[12px] text-2xl font-bold outline-none transition-all ${isDark ? "bg-[#161B22] border border-white/10 text-white focus:border-[#29B28D]" : "bg-[#f7f8fa] border border-[#e8eaed] text-[#111827] focus:border-[#29B28D]"} ${fInventoryItemId ? "opacity-50 cursor-not-allowed" : ""}`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#6b7280] dark:text-[#7d8590] uppercase tracking-[0.08em] mb-2">
                        {isKhmer ? "វិធីសាស្ត្របង់ប្រាក់" : "Payment Method"}
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {(["Cash", "ABA/KHQR", "Other"] as Method[]).map(
                          (m) => (
                            <button
                              key={m}
                              type="button"
                              onClick={() => setFMethod(m)}
                              className={`py-3 rounded-[10px] text-[12px] font-bold transition-all border-0 cursor-pointer ${fMethod === m ? "bg-[#29B28D] text-[#0d1117] shadow-lg" : isDark ? "bg-[#161B22] text-slate-400 border border-white/5 hover:bg-white/10" : "bg-[#f7f8fa] text-slate-500 border border-transparent hover:bg-slate-100"}`}
                            >
                              {m}
                            </button>
                          ),
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsQuickLogModalOpen(false);
                        }}
                        className={`flex-1 py-3 rounded-[12px] font-bold transition-all border-0 cursor-pointer ${isDark ? "bg-white/5 text-slate-400 hover:bg-white/10" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}
                      >
                        {isKhmer ? "បោះបង់" : "Cancel"}
                      </button>
                      <button
                        type="button"
                        onClick={handleSave}
                        disabled={!fAmount || saving}
                        className="flex-[1.4] py-3 rounded-[12px] font-bold transition-all border-0 cursor-pointer bg-[#29B28D] text-[#0d1117] shadow-[0_4px_14px_rgba(41,178,141,0.24)] hover:opacity-90 disabled:opacity-50"
                      >
                        {saving
                          ? isKhmer
                            ? "កំពុងរក្សាទុក..."
                            : "Saving..."
                          : isKhmer
                            ? "រក្សាទុក"
                            : "Save Log"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      }
    >
      {/* ── Toasts ── */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 items-center pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-[12px] shadow-[2xl] text-[13.5px] font-semibold min-w-[280px] border transition-all animate-in slide-in-from-bottom-5 ${t.type === "error" ? "bg-white dark:bg-[#0d1117] text-[#ef4444] border-[#ef4444]/20" : "bg-white dark:bg-[#0d1117] text-[#111827] dark:text-white border-[#e8eaed] dark:border-white/10"}`}
          >
            {t.type === "success" ? (
              <CheckCircle2 size={16} className="text-[#29B28D]" />
            ) : (
              <X size={16} className="text-[#ef4444]" />
            )}
            <span className="flex-1">{t.msg}</span>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-7">
        <div className="pt-1 pb-2">
          <h2 className="text-[32px] font-extrabold text-[#111827] dark:text-white leading-tight">
            {isKhmer ? "ការលក់របស់ខ្ញុំ" : "My Sales"}
          </h2>
          <p className="text-[14px] text-[#6b7280] dark:text-[#7d8590] mt-1">
            {isKhmer
              ? "ការតាមដានប្រវត្តិលក់គ្មានដែនកំណត់"
              : "Unlimited sales history tracking"}{" "}
            ·{" "}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <VendorSummaryCard
            variant="dark"
            title={isKhmer ? "ចំណូលថ្ងៃនេះ" : `${period}'s Revenue`}
            khmerTitle="ចំណូលថ្ងៃនេះ"
            value={`$${stats.totalRevenue.toFixed(2)}`}
            icon={CircleDollarSign}
            isPositive={true}
            trend="+12.5%"
          />
          <VendorSummaryCard
            title={isKhmer ? "ប្រតិបត្តិការ" : "Transactions"}
            khmerTitle="ប្រតិបត្តិការ"
            value={stats.count}
            icon={Receipt}
            subtext={isKhmer ? "សរុបប្រវត្តិលក់" : "sales history total"}
          />
          <VendorSummaryCard
            title={isKhmer ? "តម្លៃលក់មធ្យម" : "Avg. Sale Value"}
            khmerTitle="តម្លៃលក់មធ្យម"
            value={`$${stats.avgSale.toFixed(2)}`}
            icon={TrendingUp}
            subtext={isKhmer ? "ក្នុងមួយប្រតិបត្តិការ" : "per transaction"}
            highlight
          />
        </div>

        <AIHub />

        <div className="bg-white dark:bg-[#0d1117] rounded-[14px] border border-[#e8eaed] dark:border-white/10 shadow-[0_1px_4px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col transition-colors">
          <div className="p-5 md:p-6 border-b border-[#f0f2f5] dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-[17px] text-[#111827] dark:text-white">
                {isKhmer
                  ? "ប្រវត្តិប្រតិបត្តិការពេញលេញ"
                  : "Full Transaction History"}
              </h3>
              <p className="text-[12px] text-[#6b7280] dark:text-[#7d8590] mt-0.5">
                {isKhmer
                  ? "គ្រប់គ្រងរាល់ការលក់របស់អ្នក"
                  : "Manage all your sales records"}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2.5 px-3 py-2 bg-[#f7f8fa] dark:bg-[#161B22] border border-[#e8eaed] dark:border-white/10 rounded-[10px] transition-colors group focus-within:border-[#29B28D] w-64">
                <Search className="w-4 h-4 text-[#9ca3af] dark:text-[#7d8590] group-focus-within:text-[#29B28D] transition-colors" />
                <input
                  type="text"
                  placeholder={
                    isKhmer
                      ? "ស្វែងរកប្រតិបត្តិការ..."
                      : "Search transactions..."
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-[13px] text-[#111827] dark:text-white w-full placeholder:text-[#9ca3af]"
                />
              </div>
              <button className="p-2 border border-[#e8eaed] dark:border-white/10 rounded-[10px] text-[#6b7280] dark:text-[#7d8590] hover:bg-[#f0f2f5] dark:hover:bg-white/5 transition-colors min-h-[40px] bg-white dark:bg-[#161B22] cursor-pointer">
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f7f8fa] dark:bg-[#161B22] border-b border-[#f0f2f5] dark:border-white/5 text-[11px] text-[#9ca3af] dark:text-[#7d8590] uppercase tracking-wider font-bold transition-colors">
                  <th className="px-6 py-4">
                    {isKhmer ? "កាលបរិច្ឆេទ និងម៉ោង" : "Date & Time"}
                  </th>
                  <th className="px-6 py-4">
                    {isKhmer ? "ទំនិញដែលបានលក់" : "Items Sold"}
                  </th>
                  <th className="px-6 py-4">
                    {isKhmer ? "ចំនួនសរុប" : "Total Amount"}
                  </th>
                  <th className="px-6 py-4">
                    {isKhmer ? "ស្ថានភាព" : "Status"}
                  </th>
                  <th className="px-6 py-4 text-center">
                    {isKhmer ? "សកម្មភាព" : "Actions"}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f2f5] dark:divide-white/5">
                {loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-[#9ca3af]"
                    >
                      {isKhmer
                        ? "កំពុងទាញយកប្រវត្តិលក់របស់អ្នក..."
                        : "Loading your sales history..."}
                    </td>
                  </tr>
                ) : filteredSales.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-[#9ca3af]"
                    >
                      {isKhmer
                        ? "រកមិនឃើញប្រតិបត្តិការសម្រាប់រយៈពេលនេះទេ។"
                        : "No transactions found for this period."}
                    </td>
                  </tr>
                ) : (
                  filteredSales.map((txn) => (
                    <tr
                      key={txn.id}
                      className="hover:bg-[#f7f8fa] dark:hover:bg-white/5 transition-colors group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-[14px] font-bold text-[#111827] dark:text-white">
                            {new Date(txn.createdAt).toLocaleDateString()}
                          </span>
                          <span className="text-[12px] text-[#6b7280] dark:text-[#7d8590] flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(txn.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[13.5px] font-medium text-[#374151] dark:text-[#e6edf3]">
                          {txn.items
                            ? isKhmer
                              ? (txn as any).khmerItems || txn.items
                              : txn.items
                            : isKhmer
                              ? "មុខទំនិញលក់"
                              : "Sale Item"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-[15px] font-bold text-[#29B28D]">
                          ${parseFloat(txn.amount).toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[rgba(41,178,141,0.1)] text-[#29B28D] text-[11px] font-bold rounded-full border border-[rgba(41,178,141,0.2)]">
                          <CheckCircle2 size={12} />{" "}
                          {isKhmer ? "រួចរាល់" : "Complete"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => handleDelete(txn.id)}
                          className="p-2 text-[#9ca3af] dark:text-[#7d8590] hover:text-[#ef4444] dark:hover:text-[#f87171] rounded-[8px] hover:bg-[rgba(239,68,68,0.08)] dark:hover:bg-[rgba(239,68,68,0.15)] transition-colors opacity-0 group-hover:opacity-100 min-h-[40px] min-w-[40px] border-0 cursor-pointer bg-transparent"
                        >
                          <X className="w-5 h-5 mx-auto" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-[#8b5cf6] to-[#29B28D] rounded-full shadow-[0_8px_32px_rgba(139,92,246,0.4)] flex items-center justify-center text-white hover:scale-110 transition-transform cursor-pointer border-0"
        >
          <MessageSquare size={22} />
        </button>
      )}

      {isChatOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] max-h-[520px] bg-white dark:bg-[#0d1117] rounded-[20px] shadow-2xl border border-[#e8eaed] dark:border-white/10 flex flex-col overflow-hidden transition-colors">
          <div className="px-5 py-4 bg-[#0d1117] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-[#8b5cf6] to-[#29B28D] rounded-full flex items-center justify-center">
                <Brain size={18} className="text-white" />
              </div>
              <p className="font-bold text-[13.5px] text-[#e6edf3]">
                {isKhmer ? "ជំនួយការផ្នែកលក់ Gemini" : "Gemini Sales Assistant"}
              </p>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              className="text-[#7d8590] hover:text-[#e6edf3] bg-transparent border-0 cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 bg-[#f7f8fa] dark:bg-[#161B22] min-h-[300px] flex flex-col gap-3">
            <div className="bg-white dark:bg-[#0d1117] p-3 rounded-[12px] text-[13px] text-[#374151] dark:text-[#e6edf3] shadow-sm">
              {isKhmer
                ? "ខ្ញុំអាចជួយអ្នកវិភាគរាល់ការលក់របស់អ្នក ឬព្យាករណ៍ពីនិន្នាការនាពេលអនាគត។ តើអ្នកចង់ដឹងអ្វីខ្លះ?"
                : "I can help you analyze your unlimited sales logs or predict future trends. What would you like to know?"}
            </div>
            {messages.map((m, i) => (
              <div
                key={i}
                className={`p-3 rounded-[12px] text-[13px] shadow-sm max-w-[85%] ${
                  m.role === "user"
                    ? "bg-[#29B28D] text-[#0d1117] self-end rounded-br-none"
                    : "bg-white dark:bg-[#0d1117] text-[#374151] dark:text-[#e6edf3] self-start rounded-bl-none"
                }`}
              >
                {m.content}
              </div>
            ))}
            {isChatLoading && (
              <div className="bg-white dark:bg-[#0d1117] p-3 rounded-[12px] text-[13px] text-[#374151] dark:text-[#e6edf3] shadow-sm self-start rounded-bl-none italic">
                {isKhmer ? "Gemini កំពុងគិត..." : "Gemini is thinking..."}
              </div>
            )}
          </div>
          <div className="p-3 bg-white dark:bg-[#0d1117] border-t border-[#e8eaed] dark:border-white/10">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={
                  isKhmer ? "សួរជំនួយការរបស់អ្នក..." : "Ask your assistant..."
                }
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-[#f7f8fa] dark:bg-[#161B22] border border-[#e8eaed] dark:border-white/10 rounded-[10px] text-[13px] outline-none text-[#111827] dark:text-white focus:border-[#29B28D] transition-colors"
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <button
                onClick={handleSendMessage}
                disabled={isChatLoading}
                className="p-2.5 bg-gradient-to-br from-[#8b5cf6] to-[#29B28D] text-white rounded-[10px] border-0 cursor-pointer disabled:opacity-50"
              >
                {isChatLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Send size={15} />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </VendorDashboardLayout>
  );
}
