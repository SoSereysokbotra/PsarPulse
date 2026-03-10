"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard, CircleDollarSign, Receipt, Users, Settings,
  Plus, TrendingUp, Menu, X, Bell, ChevronRight,
  Clock, Flame, Minus, CheckCircle2,
  PanelLeftClose, PanelLeftOpen,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────
interface NavItemProps { icon: React.ElementType; title: string; href: string; active?: boolean; collapsed?: boolean; }

interface CustomerLog {
  id:     string;
  time:   string;
  count:  number;
  isPeak: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 9);
const nowTime = () => new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

const INITIAL_LOGS: CustomerLog[] = [
  { id: uid(), time: "2:30 PM",  count: 2,  isPeak: false },
  { id: uid(), time: "1:45 PM",  count: 5,  isPeak: true  },
  { id: uid(), time: "12:15 PM", count: 12, isPeak: true  },
  { id: uid(), time: "10:30 AM", count: 3,  isPeak: false },
];

// ═════════════════════════════════════════════════════════════════
export default function CustomersPage() {
  const [isSidebarOpen,      setIsSidebarOpen]      = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [logs,               setLogs]               = useState<CustomerLog[]>(INITIAL_LOGS);
  const [customCount,        setCustomCount]        = useState("");
  const [counterVal,         setCounterVal]         = useState(1);
  const [saved,              setSaved]              = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fn = () => { if (window.innerWidth >= 1024) setIsSidebarOpen(false); };
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  const totalToday   = logs.reduce((s, l) => s + l.count, 0);
  const avgSpend     = totalToday > 0 ? (124.50 / totalToday).toFixed(2) : "0.00";
  const weeklyTotal  = 315;
  const peakHour     = logs.filter(l => l.isPeak).reduce((max, l) => l.count > max.count ? l : max, logs[0] || { time: "—", count: 0, isPeak: false });

  const addCustomers = (n: number) => {
    if (n <= 0) return;
    const newLog: CustomerLog = { id: uid(), time: nowTime(), count: n, isPeak: n >= 8 };
    setLogs(p => [newLog, ...p]);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  const handleManual = (e: React.FormEvent) => {
    e.preventDefault();
    const n = parseInt(customCount);
    if (!n || n <= 0) return;
    addCustomers(n);
    setCustomCount("");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#f0f2f5] text-[#111827]" style={{ fontFamily: "inherit" }}>

      {isSidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}

      {/* ══ SIDEBAR ══════════════════════════════════════════════ */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 flex flex-col h-screen shrink-0 bg-[#0d1117] transition-all duration-300 ease-in-out ${isSidebarCollapsed ? "w-[68px]" : "w-72"} ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className={`flex items-center border-b border-white/[0.07] h-[70px] shrink-0 ${isSidebarCollapsed ? "justify-center px-0" : "justify-between px-6"}`}>
          {!isSidebarCollapsed && (
            <Link href="/vendor" className="flex items-center gap-3 no-underline">
              <div className="w-10 h-10 rounded-[10px] bg-[#3ecf8e] flex items-center justify-center font-extrabold text-[#0d1117] text-[17px] shrink-0">P</div>
              <span className="font-extrabold text-[16px] text-[#e6edf3] tracking-[0.02em] whitespace-nowrap">PsarPulse KH</span>
            </Link>
          )}
          {isSidebarCollapsed && (
            <Link href="/vendor" className="no-underline">
              <div className="w-10 h-10 rounded-[10px] bg-[#3ecf8e] flex items-center justify-center font-extrabold text-[#0d1117] text-[17px]">P</div>
            </Link>
          )}
          <button className="lg:hidden bg-transparent border-0 text-[#7d8590] cursor-pointer p-0 shrink-0" onClick={() => setIsSidebarOpen(false)}><X size={18} /></button>
        </div>

        <nav className={`flex-1 pt-3 overflow-y-auto ${isSidebarCollapsed ? "px-2" : "px-3"}`}>
          <NavItem icon={LayoutDashboard}  title="Dashboard" href="/vendor"           collapsed={isSidebarCollapsed} />
          <NavItem icon={CircleDollarSign} title="Sales"     href="/vendor/sales"     collapsed={isSidebarCollapsed} />
          <NavItem icon={Receipt}          title="Expenses"  href="/vendor/expenses"  collapsed={isSidebarCollapsed} />
          <NavItem icon={Users}            title="Customers" href="/vendor/customer"  collapsed={isSidebarCollapsed} active />
        </nav>

        <div className={`pb-3 pt-2 border-t border-white/[0.07] ${isSidebarCollapsed ? "px-2" : "px-3"}`}>
          <NavItem icon={Settings} title="Settings" href="/vendor/settings" collapsed={isSidebarCollapsed} />
          {!isSidebarCollapsed && (
            <>
              <div className="mt-2 px-4 py-3.5 rounded-[11px] bg-[rgba(62,207,142,0.08)] border border-[rgba(62,207,142,0.18)]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[13px] font-semibold text-[#e6edf3]">Free Plan</span>
                  <span className="text-[11px] font-bold text-[#7d8590]">ឥតគិតថ្លៃ</span>
                </div>
                <Link href="/vendor/pricing" className="block text-center text-[13px] font-bold text-[#3ecf8e] bg-[rgba(62,207,142,0.12)] py-2 rounded-[8px] no-underline hover:bg-[rgba(62,207,142,0.18)] transition-colors">Upgrade Plan ↗</Link>
              </div>
              <div className="flex items-center gap-3 px-3 pt-4 pb-2">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#3ecf8e] to-[#1a9c65] flex items-center justify-center text-[13px] font-bold text-white shrink-0">SM</div>
                <span className="text-[14px] font-medium text-[#e6edf3] flex-1">Sok Maly</span>
                <ChevronRight size={15} className="text-[#7d8590]" />
              </div>
            </>
          )}
          {isSidebarCollapsed && (
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#3ecf8e] to-[#1a9c65] flex items-center justify-center text-[13px] font-bold text-white">SM</div>
            </div>
          )}
        </div>
      </aside>

      {/* ══ MAIN ══════════════════════════════════════════════════ */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">

        {/* ── Topbar ── */}
        <header className="bg-white border-b border-[#e8eaed] px-5 lg:px-7 h-[70px] flex items-center justify-between shrink-0 relative z-30">
          <div className="flex items-center gap-3">
            <button className="flex lg:hidden items-center justify-center w-10 h-10 rounded-[10px] bg-transparent border-0 cursor-pointer text-[#6b7280] hover:bg-[#f0f2f5] transition-colors" onClick={() => setIsSidebarOpen(true)}><Menu size={22} /></button>
            <button className="hidden lg:flex items-center justify-center w-10 h-10 rounded-[10px] bg-transparent border-0 cursor-pointer text-[#6b7280] hover:bg-[#f0f2f5] transition-colors" onClick={() => setIsSidebarCollapsed(c => !c)}>
              {isSidebarCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
            </button>
            <h1 className="font-bold text-[20px] text-[#111827]">Customers</h1>
            <span className="text-[13px] text-[#6b7280] hidden sm:block">ការគ្រប់គ្រងអតិថិជន</span>
          </div>
          <div className="flex items-center gap-[10px]">
            <div className="w-[34px] h-[34px] rounded-full bg-[rgba(62,207,142,0.12)] border-[1.5px] border-[#3ecf8e] flex items-center justify-center text-[11px] font-bold text-[#3ecf8e]">SM</div>
          </div>
        </header>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto px-5 lg:px-9 py-[26px]">
          <div className="max-w-[1400px] mx-auto flex flex-col gap-5">

            {/* ── Page header ── */}
            <div className="pt-1 pb-2">
              <h2 className="text-[32px] font-extrabold text-[#111827] leading-tight">My Customers</h2>
              <p className="text-[14px] text-[#6b7280] mt-1">Track and log your daily foot traffic · <span className="text-[#9ca3af]">តាមដាន និងកត់ត្រាអតិថិជន</span></p>
            </div>

            {/* ── Stat cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {/* Today — dark hero */}
              <div className="bg-[#0d1117] rounded-[14px] border border-white/[0.06] px-[26px] py-6">
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <div className="text-[10.5px] font-bold text-[#7d8590] uppercase tracking-[0.07em]">Today's Customers</div>
                    <div className="text-[10px] text-[#4d5562] mt-0.5">អតិថិជនថ្ងៃនេះ</div>
                  </div>
                  <div className="w-[34px] h-[34px] rounded-[10px] bg-[rgba(62,207,142,0.12)] border border-[rgba(62,207,142,0.2)] flex items-center justify-center">
                    <Users size={15} className="text-[#3ecf8e]" />
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <span className="font-bold text-[30px] leading-none text-[#3ecf8e]">{totalToday}</span>
                  <span className="text-[12.5px] font-bold mb-0.5 text-[#7d8590]">{logs.length} logs</span>
                </div>
              </div>

              {/* Avg Spend */}
              <div className="bg-white border border-[#e8eaed] rounded-[14px] px-[26px] py-6 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <div className="text-[10.5px] font-bold text-[#6b7280] uppercase tracking-[0.07em]">Avg. Spend</div>
                    <div className="text-[10px] text-[#9ca3af] mt-0.5">ការចំណាយមធ្យម</div>
                  </div>
                  <div className="w-[34px] h-[34px] rounded-[10px] bg-[#f7f8fa] border border-[#e8eaed] flex items-center justify-center">
                    <CircleDollarSign size={15} className="text-[#3ecf8e]" />
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <span className="font-bold text-[30px] leading-none text-[#111827]">${avgSpend}</span>
                  <span className="text-[12.5px] text-[#6b7280] mb-0.5">per customer</span>
                </div>
              </div>

              {/* Weekly — GREEN */}
              <div className="bg-[#3ecf8e] rounded-[14px] border border-[#3ecf8e] px-[26px] py-6 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <div className="text-[10.5px] font-bold text-white/80 uppercase tracking-[0.07em]">Weekly</div>
                    <div className="text-[10px] text-white/60 mt-0.5">អតិថិជនប្រចាំសប្តាហ៍</div>
                  </div>
                  <div className="w-[34px] h-[34px] rounded-[10px] bg-white/20 border border-transparent flex items-center justify-center">
                    <TrendingUp size={15} className="text-white" />
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <span className="font-bold text-[30px] leading-none text-white">{weeklyTotal}</span>
                  <span className="text-[12.5px] font-bold mb-0.5 text-white">+12%</span>
                </div>
              </div>

              {/* Peak Hour */}
              <div className="bg-white border border-[#e8eaed] rounded-[14px] px-[26px] py-6 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <div className="text-[10.5px] font-bold text-[#6b7280] uppercase tracking-[0.07em]">Peak Time</div>
                    <div className="text-[10px] text-[#9ca3af] mt-0.5">ម៉ោងមមាញឹក</div>
                  </div>
                  <div className="w-[34px] h-[34px] rounded-[10px] bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.2)] flex items-center justify-center">
                    <Flame size={15} className="text-[#f59e0b]" />
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <span className="font-bold text-[22px] leading-none text-[#111827]">{peakHour?.time ?? "—"}</span>
                  <span className="text-[12.5px] font-bold mb-0.5 text-[#f59e0b]">{peakHour?.count ?? 0} cust.</span>
                </div>
              </div>
            </div>

            {/* ── Quick log panel ── */}
            <div className="bg-[#0d1117] rounded-[14px] border border-white/[0.06] px-[26px] py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div>
                <div className="text-[17px] font-bold text-[#e6edf3]">Log Customers</div>
                <div className="text-[12px] text-[#7d8590] mt-0.5">កត់ត្រាអតិថិជនថ្មី · Fast entry</div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch gap-3">
                {/* Quick +1 / +5 / +10 */}
                <div className="flex gap-2">
                  {[1, 5, 10].map(n => (
                    <button key={n} onClick={() => addCustomers(n)}
                      className="w-[58px] h-[46px] rounded-[10px] bg-[rgba(62,207,142,0.1)] border border-[rgba(62,207,142,0.2)] text-[#3ecf8e] font-bold text-[15px] cursor-pointer hover:bg-[rgba(62,207,142,0.2)] transition-all">
                      +{n}
                    </button>
                  ))}
                </div>

                {/* Stepper */}
                <div className="flex items-center bg-white/[0.06] border border-white/[0.1] rounded-[10px] overflow-hidden h-[46px]">
                  <button onClick={() => setCounterVal(v => Math.max(1, v - 1))} className="w-10 h-full bg-transparent border-0 cursor-pointer text-[#7d8590] hover:text-[#e6edf3] flex items-center justify-center transition-colors"><Minus size={14} /></button>
                  <span className="min-w-[32px] text-center text-[15px] font-bold text-[#e6edf3]">{counterVal}</span>
                  <button onClick={() => setCounterVal(v => v + 1)} className="w-10 h-full bg-transparent border-0 cursor-pointer text-[#7d8590] hover:text-[#e6edf3] flex items-center justify-center transition-colors"><Plus size={14} /></button>
                </div>

                {/* Custom input */}
                <form onSubmit={handleManual} className="flex h-[46px]">
                  <input ref={inputRef} type="number" min="1" placeholder="Custom..." value={customCount} onChange={e => setCustomCount(e.target.value)}
                    className="w-[100px] px-3 bg-white/[0.06] border border-r-0 border-white/[0.1] rounded-l-[10px] text-[14px] font-semibold text-[#e6edf3] placeholder-[#4d5562] outline-none focus:border-[#3ecf8e] transition-colors h-full"
                    style={{ fontFamily: "inherit" }} />
                  <button type="submit" className="px-4 bg-[#3ecf8e] text-[#0d1117] font-bold rounded-r-[10px] border-0 cursor-pointer hover:bg-[#4dd49a] transition-colors h-full flex items-center justify-center">
                    <Plus size={16} />
                  </button>
                </form>

                {/* Log stepper button */}
                <button onClick={() => addCustomers(counterVal)}
                  className={`h-[46px] px-5 rounded-[10px] font-bold text-[13.5px] border-0 cursor-pointer transition-all flex items-center gap-2 ${saved ? "bg-[rgba(62,207,142,0.15)] text-[#3ecf8e]" : "bg-[#3ecf8e] text-[#0d1117] shadow-[0_2px_14px_rgba(62,207,142,0.28)] hover:bg-[#4dd49a]"}`}>
                  {saved ? <><CheckCircle2 size={15} /> Logged!</> : <><Plus size={15} /> Log {counterVal}</>}
                </button>
              </div>
            </div>

            {/* ── Log history table ── */}
            <div className="bg-white border border-[#e8eaed] rounded-[14px] overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
              <div className="px-[22px] py-4 border-b border-[#f0f2f5] flex items-center justify-between">
                <div>
                  <div className="text-[14px] font-semibold text-[#111827]">Recent Customer Logs</div>
                  <div className="text-[11px] text-[#6b7280] mt-0.5">Today's recorded foot traffic</div>
                </div>
                <span className="text-[13px] font-bold text-[#111827]">Total: <span className="text-[#3ecf8e]">{totalToday}</span></span>
              </div>

              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#f0f2f5]">
                    <th className="px-[22px] py-[11px] text-[10.5px] font-bold text-[#9ca3af] uppercase tracking-[0.07em]">Time Logged</th>
                    <th className="px-[22px] py-[11px] text-[10.5px] font-bold text-[#9ca3af] uppercase tracking-[0.07em]">Count</th>
                    <th className="px-[22px] py-[11px] text-[10.5px] font-bold text-[#9ca3af] uppercase tracking-[0.07em]">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log, i) => (
                    <tr key={log.id} className={`transition-colors hover:bg-[#f7f8fa] ${i < logs.length - 1 ? "border-b border-[#f0f2f5]" : ""}`}>
                      <td className="px-[22px] py-[14px]">
                        <div className="flex items-center gap-1.5 text-[13px] text-[#6b7280]"><Clock size={12} className="text-[#9ca3af]" />{log.time}</div>
                      </td>
                      <td className="px-[22px] py-[14px]">
                        <div className="flex items-center gap-2">
                          <span className="text-[16px] font-bold text-[#111827]">+{log.count}</span>
                          <Users size={13} className="text-[#9ca3af]" />
                        </div>
                      </td>
                      <td className="px-[22px] py-[14px]">
                        {log.isPeak
                          ? <span className="inline-flex items-center gap-1 px-2.5 py-[3px] rounded-full bg-[rgba(245,158,11,0.1)] text-[#f59e0b] text-[11.5px] font-bold border border-[rgba(245,158,11,0.2)]"><Flame size={11} />Peak Traffic</span>
                          : <span className="inline-flex items-center gap-1 px-2.5 py-[3px] rounded-full bg-[#f0f2f5] text-[#6b7280] text-[11.5px] font-bold border border-[#e8eaed]">Regular</span>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="px-[22px] py-3 border-t border-[#f0f2f5] text-center">
                <button className="text-[13px] font-semibold text-[#3ecf8e] bg-transparent border-0 cursor-pointer hover:underline">View Full History</button>
              </div>
            </div>

            <div className="h-4" />
          </div>
        </div>
      </main>
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