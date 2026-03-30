"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  CircleDollarSign,
  Receipt,
  Users,
  Package,
  Settings,
  Menu,
  X,
  Bell,
  FileBarChart,
  TrendingUp,
  TrendingDown,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Flame,
  AlertTriangle,
  Crown,
  FileText,
  MousePointerClick
} from "lucide-react";

import VendorDashboardLayout from "@/components/vendor/VendorDashboardLayout";

const PRO_NAV = [
  { icon: LayoutDashboard, title: "Dashboard", khmerTitle: "ផ្ទាំងគ្រប់គ្រង", href: "/vendor/pro" },
  { icon: CircleDollarSign, title: "Sales", khmerTitle: "ការលក់", href: "/vendor/pro/sales" },
  { icon: Receipt, title: "Expenses", khmerTitle: "ចំណាយ", href: "/vendor/pro/expenses" },
  { icon: Users, title: "Customers", khmerTitle: "អតិថិជន", href: "/vendor/pro/customer" },
  { icon: Package, title: "Inventory", khmerTitle: "ស្តុក", href: "/vendor/pro/inventory" },
  { icon: FileBarChart, title: "Reports", khmerTitle: "របាយការណ៍", href: "/vendor/pro/reports", active: true },
];

// ─── MOCK DATA ────────────────────────────────────────
const plData = {
  revenue: "$2,450.00",
  expenses: "$890.50",
  netProfit: "$1,559.50",
  revenueTrend: "+22%",
  expenseTrend: "-2%",
  profitTrend: "+28%",
  profitMargin: "63.6%", // Pro specific metric
  // daily bars: [revenue, expense] pairs for 7 days
  daily: [
    { day: "Mon", rev: 240, exp: 90 },
    { day: "Tue", rev: 310, exp: 110 },
    { day: "Wed", rev: 280, exp: 85 },
    { day: "Thu", rev: 420, exp: 130 },
    { day: "Fri", rev: 390, exp: 120 },
    { day: "Sat", rev: 510, exp: 150 },
    { day: "Sun", rev: 300, exp: 105 },
  ],
};

const salesData = {
  totalSales: 342,
  avgOrderValue: "$7.16",
  topItems: [
    { name: "Iced Coffee", khmer: "កាហ្វេទឹកកក", qty: 112, revenue: "$168.00", pct: 100 },
    { name: "Noodle Soup", khmer: "គុយទាវ", qty: 85, revenue: "$255.00", pct: 75 },
    { name: "Hot Latte", khmer: "ឡាតេក្តៅ", qty: 64, revenue: "$128.00", pct: 57 },
    { name: "Mango Sticky Rice", khmer: "បាយដំណើបស្វាយ", qty: 45, revenue: "$112.50", pct: 40 },
    { name: "Matcha Frappe", khmer: "ម៉ាឆា", qty: 36, revenue: "$108.00", pct: 32 },
  ],
  // trend: simple % heights for a sparkline-like bar chart across 7 periods
  trend: [45, 60, 50, 85, 75, 100, 65],
  comparison: { current: "$2,450", previous: "$2,005", change: "+22.1%" },
};

const expenseData = {
  categories: [
    { name: "Ingredients", khmer: "គ្រឿងផ្សំ", amount: "$420.00", pct: 47, color: "#6366f1" },
    { name: "Rent", khmer: "ថ្លៃជួល", amount: "$200.00", pct: 22, color: "#8b5cf6" },
    { name: "Labor", khmer: "កម្លាំងពលកម្ម", amount: "$150.00", pct: 16, color: "#f43f5e" },
    { name: "Transport", khmer: "ការធ្វើដំណើរ", amount: "$65.00", pct: 7, color: "#f59e0b" },
    { name: "Marketing (Ads)", khmer: "ផ្សព្វផ្សាយ", amount: "$35.00", pct: 4, color: "#10b981" },
    { name: "Others", khmer: "ផ្សេងៗ", amount: "$20.50", pct: 4, color: "#94a3b8" },
  ],
};

const customerData = {
  totalCustomers: 428,
  avgSpend: "$5.72",
  peakHour: "12:30 PM",
  retentionRate: "68%", // Pro Specific
  weekdayAvg: 52,
  weekendAvg: 84,
  // hourly traffic: value represents relative customer volume
  hourlyTraffic: [
    { hour: "8AM", val: 25 },
    { hour: "9AM", val: 40 },
    { hour: "10AM", val: 45 },
    { hour: "11AM", val: 65 },
    { hour: "12PM", val: 95 },
    { hour: "1PM", val: 80 },
    { hour: "2PM", val: 55 },
    { hour: "3PM", val: 60 },
    { hour: "4PM", val: 75 },
    { hour: "5PM", val: 90 },
    { hour: "6PM", val: 85 },
    { hour: "7PM", val: 60 },
  ],
  dailyTrend: [58, 62, 55, 75, 82, 95, 78],
};

const inventoryData = {
  lowStockItems: [
    { name: "Hot Latte", khmer: "ឡាតេក្តៅ", stock: 8, threshold: 10, status: "low" as const },
    { name: "Croissant", khmer: "នំខូសង់", stock: 5, threshold: 8, status: "low" as const },
    { name: "Mango Sticky Rice", khmer: "បាយដំណើបស្វាយ", stock: 0, threshold: 5, status: "out" as const },
  ],
  topMovers: [
    { name: "Iced Coffee", sold: 112, restocked: 150 },
    { name: "Noodle Soup", sold: 85, restocked: 100 },
    { name: "Matcha Frappe", sold: 36, restocked: 50 },
  ],
  totalValue: "$1,245.50",
  totalItems: 48,
};

// ─── MAIN PAGE ────────────────────────────────────────
export default function ProReportsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [dateRange, setDateRange] = useState("This Week");
  const [activeTab, setActiveTab] = useState("pl");

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    sales: 0,
    expenses: 0,
    customers: 0,
    transactions: 0
  });
  const [realExpenseCategories, setRealExpenseCategories] = useState<any[]>([]);
  const [realExpenseTotal, setRealExpenseTotal] = useState("$0.00");
  const [realInventoryItems, setRealInventoryItems] = useState<any[]>([]);

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const [salesRes, expRes, custRes, invRes] = await Promise.all([
          fetch("/api/vendor/sales"),
          fetch("/api/vendor/expenses"),
          fetch("/api/vendor/customers"),
          fetch("/api/vendor/inventory"),
        ]);
        const [salesDataRes, expDataRes, custDataRes, invDataRes] = await Promise.all([
          salesRes.json(),
          expRes.json(),
          custRes.json(),
          invRes.json(),
        ]);

        if (salesDataRes.success && expDataRes.success && custDataRes.success) {
          const totalSales = salesDataRes.data.reduce((s: number, t: any) => s + parseFloat(t.amount || "0"), 0);
          const totalExp = expDataRes.data.reduce((s: number, t: any) => s + parseFloat(t.amount || "0"), 0);
          setStats({
            sales: totalSales,
            expenses: totalExp,
            customers: custDataRes.data.length,
            transactions: salesDataRes.data.length
          });

          // Compute real expense breakdown by category
          const catMap: Record<string, number> = {};
          expDataRes.data.forEach((e: any) => {
            const cat = e.category || "Others";
            catMap[cat] = (catMap[cat] || 0) + parseFloat(e.amount || "0");
          });
          const COLORS = ["#6366f1", "#8b5cf6", "#f43f5e", "#f59e0b", "#10b981", "#94a3b8"];
          const totalCatAmt = Object.values(catMap).reduce((a, b) => a + b, 0);
          const dynamicExpCats = Object.entries(catMap).map(([name, amount], idx) => ({
            name,
            khmer: name,
            amount: `$${amount.toFixed(2)}`,
            pct: totalCatAmt > 0 ? Math.round((amount / totalCatAmt) * 100) : 0,
            color: COLORS[idx % COLORS.length],
          }));
          setRealExpenseCategories(dynamicExpCats);
          setRealExpenseTotal(`$${totalExp.toFixed(2)}`);
        }

        if (invDataRes.success) {
          setRealInventoryItems(invDataRes.data);
        }
      } catch (e) {
        console.error("Reports fetch error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const dynamicPlData = {
    ...plData,
    revenue: `$${stats.sales.toFixed(2)}`,
    expenses: `$${stats.expenses.toFixed(2)}`,
    netProfit: `$${(stats.sales - stats.expenses).toFixed(2)}`,
    profitMargin: stats.sales > 0 ? `${(((stats.sales - stats.expenses) / stats.sales) * 100).toFixed(1)}%` : "0%"
  };

  const dynamicSalesData = {
    ...salesData,
    totalSales: stats.transactions,
    avgOrderValue: stats.transactions > 0 ? `$${(stats.sales / stats.transactions).toFixed(2)}` : "$0.00"
  };

  const dynamicCustomerData = {
    ...customerData,
    totalCustomers: stats.customers,
    avgSpend: stats.customers > 0 ? `$${(stats.sales / stats.customers).toFixed(2)}` : "$0.00"
  };

  const handleExportPDF = () => window.print();

  const tabs = [
    { id: "pl", label: "Profit & Loss", khmer: "ចំណេញ និង ខាត" },
    { id: "sales", label: "Sales Report", khmer: "របាយការណ៍ការលក់" },
    { id: "expenses", label: "Expense Breakdown", khmer: "ការបែងចែកចំណាយ" },
    { id: "customers", label: "Customer Analytics", khmer: "ការវិភាគអតិថិជន" },
    { id: "inventory", label: "Inventory Report", khmer: "របាយការណ៍ស្តុក" },
  ];

  return (
    <VendorDashboardLayout
      settingsHref="/vendor/pro/settings"
      plan="pro"
      navLinks={PRO_NAV}
      currentPath="/vendor/pro/reports"
      title="Reports"
      planBadge={{ label: "PRO", icon: Crown }}
      rightActions={
        <>
          <div className="flex items-center gap-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-slate-50 dark:bg-[#0d1117] border border-slate-200 text-sm font-medium rounded-xl px-3.5 py-2.5 outline-none focus:border-psar-primary focus:ring-1 focus:ring-psar-primary min-h-[40px] hidden md:block"
            >
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
              <option>Last 3 Months (Pro)</option>
              <option>Last 12 Months (Pro)</option>
            </select>
            <button onClick={handleExportPDF} className="hidden lg:flex items-center gap-2 bg-psar-dark hover:opacity-90 text-white font-medium px-4 py-2.5 rounded-xl transition-colors text-sm min-h-[40px] border-0 cursor-pointer">
              <Download className="w-4 h-4" /> Export PDF
            </button>
            <button className="lg:hidden p-2.5 bg-psar-dark text-white rounded-xl border-0 cursor-pointer">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </>
      }
    >
      <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">

          {/* Tabs Navigation */}
          <div className="flex items-end gap-0 border-b border-[#e8eaed] dark:border-white/5 -mt-3 overflow-x-auto scrollbar-none">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3 text-[13.5px] font-medium border-b-2 -mb-px flex flex-col items-start gap-0.5 bg-transparent border-x-0 border-t-0 cursor-pointer transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-b-[#111827] text-[#111827] dark:text-white font-semibold"
                    : "border-b-transparent text-[#6b7280] dark:text-[#7d8590] hover:text-[#111827] dark:text-white"
                }`}
              >
                <span>{tab.label}</span>
                <span className="text-[10px] text-[#9ca3af]">{tab.khmer}</span>
              </button>
            ))}
          </div>

          {/* ═══════ 1. PROFIT & LOSS ═══════ */}
          {activeTab === "pl" && (
          <section>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1.5 h-6 bg-psar-primary rounded-full"></div>
              <h2 className="font-bold text-[19px] text-slate-900 dark:text-white">Profit & Loss</h2>
              <span className="text-[12px] font-khmer text-slate-400 ml-1">ចំណេញ និង ខាត</span>
            </div>

            {/* P&L Metric Cards - 4 items in Pro */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
              <PLCard
                title="Total Revenue" khmer="ចំណូលសរុប"
                value={dynamicPlData.revenue} trend={dynamicPlData.revenueTrend} isPositive={true}
                icon={<TrendingUp className="w-5 h-5" />}
                accentColor="bg-psar-primary"
              />
              <PLCard
                title="Total Expenses" khmer="ចំណាយសរុប"
                value={dynamicPlData.expenses} trend={dynamicPlData.expenseTrend} isPositive={true}
                icon={<TrendingDown className="w-5 h-5" />}
                accentColor="bg-slate-50 dark:bg-[#0d1117]"
              />
              <PLCard
                title="Net Profit" khmer="ប្រាក់ចំណេញសុទ្ធ"
                value={dynamicPlData.netProfit} trend={dynamicPlData.profitTrend} isPositive={true}
                icon={<CircleDollarSign className="w-5 h-5" />}
                accentColor="bg-psar-primary"
                highlight
              />
              {/* Pro Specific */}
              <PLCard
                title="Profit Margin" khmer="អត្រាប្រាក់ចំណេញ"
                value={dynamicPlData.profitMargin} trend="Excellent" isPositive={true}
                icon={<MousePointerClick className="w-5 h-5" />}
                accentColor="bg-fuchsia-500"
              />
            </div>

            {/* P&L Bar Chart */}
            <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:bg-dark-surface dark:border-white/5 rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-[15px] text-slate-900 dark:text-white mb-5">Revenue vs Expenses</h3>
              <div className="h-52 flex items-end gap-3">
                {dynamicPlData.daily.map((d, i) => {
                  const maxVal = 550; // Dynamic based on data in real world
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full flex items-end gap-0.5 justify-center h-44">
                        {/* Revenue bar */}
                        <div className="w-[45%] bg-psar-primary/10 rounded-t-lg relative group">
                          <div
                            className="absolute bottom-0 w-full bg-psar-primary rounded-t-lg transition-all duration-500 group-hover:bg-psar-primary"
                            style={{ height: `${(d.rev / maxVal) * 100}%` }}
                          ></div>
                        </div>
                        {/* Expense bar */}
                        <div className="w-[45%] bg-slate-100 rounded-t-lg relative group">
                          <div
                            className="absolute bottom-0 w-full bg-slate-400 rounded-t-lg transition-all duration-500 group-hover:bg-slate-50 dark:hover:bg-white/5 dark:bg-[#0d1117]0"
                            style={{ height: `${(d.exp / maxVal) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">{d.day}</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center gap-6 mt-4 pt-4 border-t border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-[#7d8590] font-medium">
                  <div className="w-3 h-3 rounded-sm bg-psar-primary"></div> Revenue
                </div>
                <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-[#7d8590] font-medium">
                  <div className="w-3 h-3 rounded-sm bg-slate-400"></div> Expenses
                </div>
              </div>
            </div>
          </section>
          )}

          {/* ═══════ 2. SALES REPORT ═══════ */}
          {activeTab === "sales" && (
          <section>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1.5 h-6 bg-psar-primary rounded-full"></div>
              <h2 className="font-bold text-[19px] text-slate-900 dark:text-white">Sales Report</h2>
              <span className="text-[12px] font-khmer text-slate-400 ml-1">របាយការណ៍ការលក់</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Top Selling Items */}
              <div className="lg:col-span-2 bg-white dark:bg-dark-surface border border-slate-200 dark:bg-dark-surface dark:border-white/5 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 dark:border-white/5">
                  <h3 className="font-semibold text-[15px] text-slate-900 dark:text-white">Top Selling Items</h3>
                  <p className="text-[12px] font-khmer text-slate-400 mt-0.5">ទំនិញលក់ដាច់ជាងគេ</p>
                </div>
                <div className="p-5 space-y-4">
                  {dynamicSalesData.topItems.map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 dark:text-[#7d8590] text-[12px] font-bold flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1.5">
                          <div>
                            <span className="text-[14px] font-semibold text-slate-900 dark:text-white">{item.name}</span>
                            <span className="text-[11px] font-khmer text-slate-400 ml-2">{item.khmer}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[14px] font-bold text-psar-primary">{item.revenue}</span>
                            <span className="text-[12px] text-slate-400 ml-2">({item.qty} sold)</span>
                          </div>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-psar-primary rounded-full transition-all duration-700"
                            style={{ width: `${item.pct}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sales Summary + Trend */}
              <div className="flex flex-col gap-6">
                {/* Period Comparison */}
                <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:bg-dark-surface dark:border-white/5 rounded-2xl shadow-sm p-5 flex-1">
                  <h3 className="font-semibold text-[15px] text-slate-900 dark:text-white mb-4">Period Comparison</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] text-slate-500 dark:text-[#7d8590] font-medium">Current</span>
                      <span className="text-[17px] font-bold text-slate-900 dark:text-white">{dynamicSalesData.comparison.current}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] text-slate-500 dark:text-[#7d8590] font-medium">Previous</span>
                      <span className="text-[17px] font-bold text-slate-400">{dynamicSalesData.comparison.previous}</span>
                    </div>
                    <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                      <span className="text-[13px] text-slate-500 dark:text-[#7d8590] font-medium">Change</span>
                      <span className="flex items-center gap-1 text-[15px] font-bold text-psar-primary">
                        <ArrowUpRight className="w-4 h-4" />
                        {dynamicSalesData.comparison.change}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sales Trend Mini Chart */}
                <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:bg-dark-surface dark:border-white/5 rounded-2xl shadow-sm p-5 flex-1">
                  <h3 className="font-semibold text-[15px] text-slate-900 dark:text-white mb-4">Sales Trend</h3>
                  <div className="h-24 flex items-end gap-1.5">
                    {dynamicSalesData.trend.map((h, i) => (
                      <div key={i} className="flex-1 bg-psar-primary/10 rounded-t-md relative group">
                        <div
                          className="absolute bottom-0 w-full bg-psar-primary rounded-t-md transition-all duration-500 group-hover:bg-psar-primary"
                          style={{ height: `${h}%` }}
                        ></div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-[13px] text-slate-500 dark:text-[#7d8590] font-medium">
                    <span>Total: {dynamicSalesData.totalSales} sales</span>
                    <span>·</span>
                    <span>Avg: {dynamicSalesData.avgOrderValue}/order</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
          )}

          {/* ═══════ 3. EXPENSE BREAKDOWN ═══════ */}
          {activeTab === "expenses" && (
          <section>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1.5 h-6 bg-psar-primary rounded-full"></div>
              <h2 className="font-bold text-[19px] text-slate-900 dark:text-white">Expense Breakdown</h2>
              <span className="text-[12px] font-khmer text-slate-400 ml-1">ការបែងចែកចំណាយ</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Donut-style visual */}
              <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:bg-dark-surface dark:border-white/5 rounded-2xl shadow-sm p-6">
                <h3 className="font-semibold text-[15px] text-slate-900 dark:text-white mb-5">By Category</h3>
                {realExpenseCategories.length === 0 ? (
                  <div className="flex items-center justify-center h-44 rounded-xl border border-dashed border-slate-200 dark:border-white/10">
                    <p className="text-sm text-slate-400 text-center">No expense data yet.<br/>Add expenses to see the breakdown.</p>
                  </div>
                ) : (
                  <>
                {/* CSS Donut */}
                <div className="flex items-center justify-center mb-6">
                  <div className="relative w-44 h-44">
                    <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                      {(() => {
                        let offset = 0;
                        return realExpenseCategories.map((cat, i) => {
                          const dash = cat.pct;
                          const gap = 100 - dash;
                          const el = (
                            <circle
                              key={i}
                              cx="18" cy="18" r="15.9155"
                              fill="none"
                              stroke={cat.color}
                              strokeWidth="3.5"
                              strokeDasharray={`${dash} ${gap}`}
                              strokeDashoffset={-offset}
                              className="transition-all duration-700 hover:opacity-80 cursor-pointer"
                            />
                          );
                          offset += dash;
                          return el;
                        });
                      })()}
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-[22px] font-bold text-slate-900 dark:text-white">{realExpenseTotal}</span>
                      <span className="text-[11px] text-slate-400 font-medium">Total</span>
                    </div>
                  </div>
                </div>
                {/* Legend */}
                <div className="grid grid-cols-2 gap-2.5">
                  {realExpenseCategories.map((cat, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }}></div>
                      <span className="text-[12px] text-slate-600 dark:text-[#9aa4b2] font-medium truncate">{cat.name}</span>
                      <span className="text-[12px] text-slate-400 font-semibold ml-auto">{cat.pct}%</span>
                    </div>
                  ))}
                </div>
                  </>
                )}
              </div>

              {/* Category Bars */}
              <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:bg-dark-surface dark:border-white/5 rounded-2xl shadow-sm p-6">
                <h3 className="font-semibold text-[15px] text-slate-900 dark:text-white mb-5">Category Details</h3>
                {realExpenseCategories.length === 0 ? (
                  <div className="flex items-center justify-center h-44 rounded-xl border border-dashed border-slate-200 dark:border-white/10">
                    <p className="text-sm text-slate-400 text-center">Log expenses to see category details.</p>
                  </div>
                ) : (
                <div className="space-y-4">
                  {realExpenseCategories.map((cat, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[14px] font-semibold text-slate-900 dark:text-white">{cat.name}</span>
                        </div>
                        <span className="text-[14px] font-bold text-slate-700 dark:text-[#c9d1d9]">{cat.amount}</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${cat.pct}%`, backgroundColor: cat.color }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
                )}
              </div>
            </div>
          </section>
          )}

          {/* ═══════ 4. CUSTOMER ANALYTICS ═══════ */}
          {activeTab === "customers" && (
          <section>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1.5 h-6 bg-psar-primary rounded-full"></div>
              <h2 className="font-bold text-[19px] text-slate-900 dark:text-white">Customer Analytics</h2>
              <span className="text-[12px] font-khmer text-slate-400 ml-1">ការវិភាគអតិថិជន</span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 md:grid-cols-2 gap-5 mb-6">
              <MiniCard title="Total Customers" khmer="អតិថិជនសរុប" value={String(dynamicCustomerData.totalCustomers)} />
              <MiniCard title="Avg. Spend" khmer="ការចំណាយមធ្យម" value={dynamicCustomerData.avgSpend} />
              <MiniCard title="Peak Hour" khmer="ម៉ោងមមាញឹក" value={dynamicCustomerData.peakHour} accent />
              <MiniCard title="Retention Rate" khmer="អត្រារក្សាទុក" value={dynamicCustomerData.retentionRate} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Hourly Traffic Chart */}
              <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:bg-dark-surface dark:border-white/5 rounded-2xl shadow-sm p-6">
                <h3 className="font-semibold text-[15px] text-slate-900 dark:text-white mb-1">Hourly Traffic</h3>
                <p className="text-[12px] text-slate-400 font-medium mb-5">Customer volume by hour of day</p>
                <div className="h-40 flex items-end gap-1">
                  {dynamicCustomerData.hourlyTraffic.map((h, i) => {
                    const isPeak = h.val >= 70;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div className={`w-full ${isPeak ? "bg-orange-100" : "bg-slate-100"} rounded-t-lg relative group`} style={{ height: "120px" }}>
                          <div
                            className={`absolute bottom-0 w-full rounded-t-lg transition-all duration-500 ${isPeak ? "bg-orange-400 group-hover:bg-orange-500" : "bg-psar-primary group-hover:bg-psar-primary"}`}
                            style={{ height: `${(h.val / 100) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-[9px] text-slate-400 font-medium">{h.hour}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center gap-5 mt-4 pt-3 border-t border-slate-100 dark:border-white/5">
                  <div className="flex items-center gap-1.5 text-[12px] text-slate-500 dark:text-[#7d8590] font-medium">
                    <div className="w-2.5 h-2.5 rounded-sm bg-psar-primary"></div> Regular
                  </div>
                  <div className="flex items-center gap-1.5 text-[12px] text-slate-500 dark:text-[#7d8590] font-medium">
                    <Flame className="w-3 h-3 text-orange-400" /> Peak Hours
                  </div>
                </div>
              </div>

              {/* Daily Trend */}
              <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:bg-dark-surface dark:border-white/5 rounded-2xl shadow-sm p-6">
                <h3 className="font-semibold text-[15px] text-slate-900 dark:text-white mb-1">Daily Customer Trend</h3>
                <p className="text-[12px] text-slate-400 font-medium mb-5">Customers per day this week</p>
                <div className="h-40 flex items-end gap-2">
                  {dynamicCustomerData.dailyTrend.map((val, i) => {
                    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
                    const isWeekend = i >= 5;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-[11px] font-bold text-slate-500 dark:text-[#7d8590]">{val}</span>
                        <div className={`w-full ${isWeekend ? "bg-psar-primary/10" : "bg-slate-100"} rounded-t-lg relative group`} style={{ height: "110px" }}>
                          <div
                            className={`absolute bottom-0 w-full rounded-t-lg transition-all duration-500 ${isWeekend ? "bg-psar-primary group-hover:bg-psar-primary" : "bg-slate-400 group-hover:bg-slate-50 dark:hover:bg-white/5 dark:bg-[#0d1117]0"}`}
                            style={{ height: `${(val / 100) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-[11px] text-slate-400 font-medium">{days[i]}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center gap-5 mt-4 pt-3 border-t border-slate-100 dark:border-white/5">
                  <div className="flex items-center gap-1.5 text-[12px] text-slate-500 dark:text-[#7d8590] font-medium">
                    <div className="w-2.5 h-2.5 rounded-sm bg-slate-400"></div> Weekday
                  </div>
                  <div className="flex items-center gap-1.5 text-[12px] text-slate-500 dark:text-[#7d8590] font-medium">
                    <div className="w-2.5 h-2.5 rounded-sm bg-psar-primary"></div> Weekend
                  </div>
                </div>
              </div>
            </div>
          </section>
          )}

          {/* ═══════ 5. INVENTORY REPORT ═══════ */}
          {activeTab === "inventory" && (
          <section className="pb-4">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1.5 h-6 bg-psar-primary rounded-full"></div>
              <h2 className="font-bold text-[19px] text-slate-900 dark:text-white">Inventory Report</h2>
              <span className="text-[12px] font-khmer text-slate-400 ml-1">របាយការណ៍ស្តុក</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Low Stock Alerts */}
              <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:bg-dark-surface dark:border-white/5 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 dark:border-white/5 flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                  <div>
                    <h3 className="font-semibold text-[15px] text-slate-900 dark:text-white">Low Stock Alerts</h3>
                    <p className="text-[12px] font-khmer text-slate-400 mt-0.5">ស្តុកជិតអស់</p>
                  </div>
                </div>
                <div className="p-5 space-y-4">
                  {(() => {
                    const lowItems = realInventoryItems.filter(
                      (i) => i.status === "low" || i.status === "out" || (i.stock !== undefined && i.threshold !== undefined && i.stock <= i.threshold)
                    );
                    return lowItems.length === 0 ? (
                      <p className="text-center text-slate-400 py-6 text-sm">All items are well stocked! ✓</p>
                    ) : lowItems.map((item: any, i: number) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-[#0d1117]/50 dark:bg-white/5">
                        <div>
                          <p className="text-[14px] font-semibold text-slate-900 dark:text-white">{item.name}</p>
                          <p className="text-[11px] font-khmer text-slate-400">{item.khmerName || ""}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[16px] font-bold text-slate-900 dark:text-white">{item.stock}</span>
                          {item.status === "out" || item.stock === 0 ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-red-100 text-red-700 text-[11px] font-bold">Out of Stock</span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-orange-100 text-orange-700 text-[11px] font-bold">Low Stock</span>
                          )}
                        </div>
                      </div>
                    ));
                  })()}
                  {realInventoryItems.length === 0 && (
                    <p className="text-center text-slate-400 py-6 text-sm">No inventory items found. Add items to track stock.</p>
                  )}
                </div>
                <div className="px-6 py-4 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-[#0d1117]">
                  <button className="w-full bg-psar-primary/10 hover:bg-psar-primary/10 text-psar-primary font-bold py-2 rounded-xl transition-colors text-sm">
                    Generate Purchase Order
                  </button>
                </div>
              </div>

              {/* Stock Movement */}
              <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:bg-dark-surface dark:border-white/5 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 dark:border-white/5 flex items-center gap-3">
                  <Package className="w-5 h-5 text-slate-400" />
                  <div>
                    <h3 className="font-semibold text-[15px] text-slate-900 dark:text-white">Stock Movement</h3>
                    <p className="text-[12px] font-khmer text-slate-400 mt-0.5">ចលនាស្តុក</p>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-[#0d1117] border-b border-slate-100 dark:border-white/5 text-[12px] text-slate-500 dark:text-[#7d8590] uppercase tracking-wider font-semibold">
                        <th className="px-6 py-3">Product</th>
                        <th className="px-6 py-3 text-center">Sold</th>
                        <th className="px-6 py-3 text-center">Restocked</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                      {inventoryData.topMovers.map((item, i) => (
                        <tr key={i} className="hover:bg-slate-50 dark:hover:bg-white/5 dark:bg-[#0d1117]/50 dark:bg-white/5 transition-colors">
                          <td className="px-6 py-4">
                            <span className="text-[14px] font-semibold text-slate-900 dark:text-white">{item.name}</span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="text-[14px] font-bold text-red-500 flex items-center justify-center gap-1">
                              <ArrowDownRight className="w-3.5 h-3.5" /> {item.sold}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="text-[14px] font-bold text-psar-primary flex items-center justify-center gap-1">
                              <ArrowUpRight className="w-3.5 h-3.5" /> {item.restocked}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-6 py-4 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-[#0d1117] flex items-center justify-between text-[13px]">
                  <span className="text-slate-500 dark:text-[#7d8590] font-medium">Total Products: <strong className="text-slate-900 dark:text-white">{realInventoryItems.length}</strong></span>
                  <span className="text-slate-500 dark:text-[#7d8590] font-medium">Est. Value: <strong className="text-psar-primary">${realInventoryItems.reduce((a, i) => a + parseFloat(i.price || "0") * (i.stock || 0), 0).toFixed(2)}</strong></span>
                </div>
              </div>
            </div>
          </section>
          )}

        </div>
    </VendorDashboardLayout>
  );
}

// ─── SUB-COMPONENTS ───────────────────────────────────

function PLCard({
  title,
  khmer,
  value,
  trend,
  isPositive,
  icon,
  accentColor,
  highlight = false,
}: {
  title: string;
  khmer: string;
  value: string;
  trend: string;
  isPositive: boolean;
  icon: React.ReactNode;
  accentColor: string;
  highlight?: boolean;
}) {
  return (
    <div className={`p-5 rounded-2xl ${highlight ? "bg-psar-primary text-white border-transparent shadow-md" : "bg-white dark:bg-dark-surface border-slate-200 shadow-sm"}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className={`text-sm font-semibold ${highlight ? "text-white/90" : "text-slate-500 dark:text-[#7d8590]"}`}>{title}</h4>
          <p className={`text-[11px] font-khmer mt-0.5 ${highlight ? "text-white/70" : "text-slate-400"}`}>{khmer}</p>
        </div>
        <div className={`p-2 rounded-xl ${highlight ? "bg-white/20" : `${accentColor}/10 text-psar-primary border border-slate-100 dark:border-white/5`}`}>
          {icon}
        </div>
      </div>
      <div className="flex items-end justify-between">
        <h2 className="text-[26px] font-bold tracking-tight leading-none">{value}</h2>
        <span className={`text-sm font-semibold mb-0.5 ${highlight ? "text-white" : isPositive ? "text-psar-primary" : "text-red-500"}`}>
          {trend}
        </span>
      </div>
    </div>
  );
}

function MiniCard({
  title,
  khmer,
  value,
  accent = false,
}: {
  title: string;
  khmer: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className={`p-4 rounded-2xl border ${accent ? "bg-psar-primary/10 border-psar-primary/20" : "bg-white dark:bg-dark-surface border-slate-200 shadow-sm"}`}>
      <p className="text-[12px] font-semibold text-slate-500 dark:text-[#7d8590] mb-0.5">{title}</p>
      <p className="text-[10px] font-khmer text-slate-400">{khmer}</p>
      <h3 className={`text-[22px] font-bold mt-2 ${accent ? "text-psar-primary" : "text-slate-900 dark:text-white"}`}>{value}</h3>
    </div>
  );
}
