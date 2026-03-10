"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard, CircleDollarSign, Receipt, Users, Settings,
  Plus, TrendingUp, Menu, X, Bell, Lock, CheckCircle2,
  Search, ChevronRight, Minus, ShoppingCart, Zap,
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────
interface NavItemProps   { icon: React.ElementType; title: string; khmerTitle: string; href: string; active?: boolean; }
interface SummaryCardProps { title: string; khmerTitle: string; value: string; icon: React.ElementType; trend?: string; isPositive?: boolean; subtext?: string; highlight?: boolean; }
interface Product        { id: string; name: string; price: number; }

// ─── Constants ─────────────────────────────────────────────────────
const PRODUCT_LIBRARY: Product[] = [
  { id: "1", name: "Coffee Latte",      price: 4.50 },
  { id: "2", name: "Green Tea",         price: 3.20 },
  { id: "3", name: "Fried Rice",        price: 2.50 },
  { id: "4", name: "Spring Roll",       price: 1.80 },
  { id: "5", name: "Coconut Water",     price: 1.50 },
  { id: "6", name: "Mango Sticky Rice", price: 2.00 },
];

const EXP_CATS = [
  { key: "ingredients", label: "Ingredients", emoji: "🥦" },
  { key: "rent",        label: "Rent",        emoji: "🏪" },
  { key: "transport",   label: "Transport",   emoji: "🛺" },
  { key: "electricity", label: "Electric",    emoji: "⚡" },
  { key: "labor",       label: "Labor",       emoji: "👷" },
  { key: "other",       label: "Other",       emoji: "📦" },
];

// ─── Palette ────────────────────────────────────────────────────────
const C = {
  accent:     "#3ecf8e",
  accentDim:  "rgba(62,207,142,0.12)",
  accentGlow: "rgba(62,207,142,0.28)",
  sidebar:    "#0d1117",
  sidebarHov: "#1c2330",
  sidebarText:"#e6edf3",
  sidebarMut: "#7d8590",
  borderDark: "rgba(255,255,255,0.07)",
  bg:         "#f0f2f5",
  surface:    "#ffffff",
  border:     "#e8eaed",
  text:       "#111827",
  muted:      "#6b7280",
  danger:     "#ef4444",
};

// ═══════════════════════════════════════════════════════════════════
export default function VendorDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDayLocked,   setIsDayLocked]   = useState(false);
  const [quickSaleOpen, setQuickSaleOpen] = useState(false);
  const [searchQuery,   setSearchQuery]   = useState("");
  const [cart,          setCart]          = useState<{ product: Product; qty: number }[]>([]);
  const [customers,     setCustomers]     = useState(1);
  const [expAmount,     setExpAmount]     = useState("");
  const [expCat,        setExpCat]        = useState("");
  const [expNote,       setExpNote]       = useState("");
  const [expLogged,     setExpLogged]     = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const summary = { sales: "$124.50", expenses: "$45.00", profit: "$79.50", customers: "42", avgCustomer: "$2.96" };
  const usage = { used: 127, limit: 500 };
  const usagePct = Math.min((usage.used / usage.limit) * 100, 100);

  const weeklyData   = [40, 70, 45, 90, 65, 120, 85];
  const weeklyLabels = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const monthlyData   = [320, 480, 410, 540];
  const monthlyLabels = ["Week 1","Week 2","Week 3","Week 4"];

  useEffect(() => {
    if (quickSaleOpen) setTimeout(() => searchRef.current?.focus(), 120);
  }, [quickSaleOpen]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") closeQuickSale(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);

  const filteredProducts = PRODUCT_LIBRARY.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToCart = (product: Product) => {
    setCart(prev => {
      const exists = prev.find(i => i.product.id === product.id);
      if (exists) return prev.map(i => i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { product, qty: 1 }];
    });
    setSearchQuery("");
    searchRef.current?.focus();
  };

  const changeQty = (id: string, delta: number) =>
    setCart(prev => prev.map(i => i.product.id === id ? { ...i, qty: i.qty + delta } : i).filter(i => i.qty > 0));

  const cartTotal = cart.reduce((sum, i) => sum + i.product.price * i.qty, 0);
  const cartItems = cart.reduce((sum, i) => sum + i.qty, 0);

  const completeSale = () => { setCart([]); setCustomers(1); setSearchQuery(""); setQuickSaleOpen(false); };
  const closeQuickSale = () => { setQuickSaleOpen(false); setCart([]); setSearchQuery(""); };

  const logExpense = () => {
    if (!expAmount || !expCat) return;
    setExpLogged(true);
    setExpAmount(""); setExpCat(""); setExpNote("");
    setTimeout(() => setExpLogged(false), 2200);
  };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", fontFamily: "inherit", background: C.bg, color: C.text }}>

      {/* Backdrop — sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={() => setIsSidebarOpen(false)} />
      )}
      {/* Backdrop — quick sale */}
      {quickSaleOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 40, background: "rgba(0,0,0,0.3)" }}
          onClick={closeQuickSale} />
      )}

      {/* ══ SIDEBAR ════════════════════════════════════════════════ */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
        style={{ width: 224, background: C.sidebar, flexShrink: 0, height: "100vh" }}
      >
        {/* Logo */}
        <div style={{ padding: "20px 18px 16px", borderBottom: `1px solid ${C.borderDark}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/vendor" style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none" }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: C.accent, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: C.sidebar, fontSize: 14 }}>P</div>
            <span style={{ fontWeight: 800, fontSize: 14, color: C.sidebarText, letterSpacing: ".02em" }}>PsarPulse KH</span>
          </Link>
          <button className="lg:hidden" onClick={() => setIsSidebarOpen(false)} style={{ background: "none", border: "none", color: C.sidebarMut, cursor: "pointer" }}>
            <X size={16} />
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "10px 10px 0", overflowY: "auto" }}>
          <NavItem icon={LayoutDashboard}  title="Dashboard" khmerTitle="ផ្ទាំងគ្រប់គ្រង" href="/vendor"         active />
          <NavItem icon={CircleDollarSign} title="Sales"     khmerTitle="ការលក់"           href="/vendor/sales"       />
          <NavItem icon={Receipt}          title="Expenses"  khmerTitle="ចំណាយ"            href="/vendor/expenses"    />
          <NavItem icon={Users}            title="Customers" khmerTitle="អតិថិជន"          href="/vendor/customer"    />
        </nav>

        {/* Footer */}
        <div style={{ padding: 10, borderTop: `1px solid ${C.borderDark}` }}>
          <NavItem icon={Settings} title="Settings" khmerTitle="ការកំណត់" href="/vendor/settings" />
          <div style={{ margin: "8px 0 0", padding: "12px 14px", background: "rgba(62,207,142,0.08)", border: "1px solid rgba(62,207,142,0.18)", borderRadius: 11 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 9 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: C.sidebarText }}>Free Plan</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: C.sidebarMut, textTransform: "uppercase", letterSpacing: ".06em" }}>ឥតគិតថ្លៃ</span>
            </div>
            <Link href="/vendor/pricing" style={{ display: "block", textAlign: "center", fontSize: 12, fontWeight: 700, color: C.accent, background: "rgba(62,207,142,0.12)", padding: "7px 0", borderRadius: 7, textDecoration: "none" }}>
              Upgrade Plan ↗
            </Link>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "11px 12px 4px" }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: `linear-gradient(135deg,${C.accent},#1a9c65)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0 }}>SM</div>
            <span style={{ fontSize: 13, fontWeight: 500, color: C.sidebarText, flex: 1 }}>Vendor</span>
            <ChevronRight size={13} style={{ color: C.sidebarMut }} />
          </div>
        </div>
      </aside>

      {/* ══ MAIN — scrollable ══════════════════════════════════════ */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, height: "100vh", overflow: "hidden" }}>

        {/* ── Topbar ── */}
        <header style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "0 28px", height: 58, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, position: "relative", zIndex: 30 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button className="lg:hidden" onClick={() => setIsSidebarOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted }}>
              <Menu size={20} />
            </button>
            <h1 style={{ fontWeight: 700, fontSize: 17, color: C.text }}>Overview</h1>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>

            {/* ─── QUICK SALE BUTTON + DROPDOWN ─── */}
            <div style={{ position: "relative", zIndex: 50 }}>
              <button
                onClick={() => setQuickSaleOpen(o => !o)}
                style={{ display: "flex", alignItems: "center", gap: 7, background: quickSaleOpen ? C.sidebar : C.accent, color: quickSaleOpen ? C.sidebarText : C.sidebar, border: "none", borderRadius: 10, padding: "9px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "all .2s", boxShadow: quickSaleOpen ? "none" : `0 2px 14px ${C.accentGlow}` }}
              >
                {quickSaleOpen ? <><X size={14} /> Cancel</> : <><Zap size={14} /> Quick Sale</>}
                {cartItems > 0 && !quickSaleOpen && (
                  <span style={{ background: C.sidebar, color: C.accent, borderRadius: "50%", width: 18, height: 18, fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", marginLeft: 2 }}>
                    {cartItems}
                  </span>
                )}
              </button>

              {/* Dropdown */}
              {quickSaleOpen && (
                <div style={{ position: "absolute", top: "calc(100% + 10px)", right: 0, width: 330, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, boxShadow: "0 20px 56px rgba(0,0,0,0.15)", zIndex: 60, overflow: "hidden" }}>
                  <div style={{ padding: "14px 18px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 8 }}>
                    <ShoppingCart size={14} style={{ color: C.accent }} />
                    <span style={{ fontWeight: 700, fontSize: 14, color: C.text }}>Quick Sale</span>
                    <span style={{ fontSize: 11, color: C.muted, marginLeft: "auto" }}>ការលក់រហ័ស</span>
                  </div>

                  <div style={{ padding: "14px 18px" }}>
                    {/* Search */}
                    <div style={{ position: "relative", marginBottom: 14 }}>
                      <Search size={13} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: C.muted, pointerEvents: "none" }} />
                      <input
                        ref={searchRef}
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Search product..."
                        style={{ width: "100%", padding: "9px 11px 9px 33px", background: "#f7f8fa", border: `1px solid ${C.border}`, borderRadius: 9, fontSize: 13, fontFamily: "inherit", outline: "none", color: C.text }}
                        onFocus={e => (e.currentTarget.style.borderColor = C.accent)}
                        onBlur={e  => (e.currentTarget.style.borderColor = C.border)}
                      />
                      {searchQuery && (
                        <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: C.surface, border: `1px solid ${C.border}`, borderTop: "none", borderRadius: "0 0 9px 9px", zIndex: 10, boxShadow: "0 8px 24px rgba(0,0,0,.08)", overflow: "hidden" }}>
                          {filteredProducts.length ? filteredProducts.map(p => (
                            <button key={p.id} onClick={() => addToCart(p)}
                              style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 13px", background: "none", border: "none", cursor: "pointer", fontSize: 13, fontFamily: "inherit", color: C.text, textAlign: "left" }}
                              onMouseEnter={e => (e.currentTarget.style.background = "#f7f8fa")}
                              onMouseLeave={e => (e.currentTarget.style.background = "none")}
                            >
                              <span>{p.name}</span>
                              <span style={{ color: C.accent, fontWeight: 700 }}>${p.price.toFixed(2)}</span>
                            </button>
                          )) : <div style={{ padding: "10px 13px", fontSize: 12.5, color: C.muted }}>No products found</div>}
                        </div>
                      )}
                    </div>

                    {/* Product grid */}
                    {!searchQuery && (
                      <div style={{ marginBottom: 14 }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 8 }}>Tap to add</div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                          {PRODUCT_LIBRARY.map(p => {
                            const inCart = cart.find(i => i.product.id === p.id);
                            return (
                              <button key={p.id} onClick={() => addToCart(p)}
                                style={{ padding: "9px 12px", background: inCart ? C.accentDim : "#f7f8fa", border: `1px solid ${inCart ? C.accent : C.border}`, borderRadius: 9, cursor: "pointer", textAlign: "left", transition: "all .12s", position: "relative" }}
                                onMouseEnter={e => { if (!inCart) (e.currentTarget as HTMLButtonElement).style.background = "#eff0f2"; }}
                                onMouseLeave={e => { if (!inCart) (e.currentTarget as HTMLButtonElement).style.background = "#f7f8fa"; }}
                              >
                                <div style={{ fontSize: 12, fontWeight: 600, color: inCart ? C.accent : C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginBottom: 2 }}>{p.name}</div>
                                <div style={{ fontSize: 11, color: inCart ? C.accent : C.muted, fontWeight: 700 }}>${p.price.toFixed(2)}</div>
                                {inCart && <span style={{ position: "absolute", top: 6, right: 8, background: C.accent, color: C.sidebar, borderRadius: "50%", width: 17, height: 17, fontSize: 9, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{inCart.qty}</span>}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Cart */}
                    {cart.length > 0 && (
                      <div style={{ marginBottom: 12, maxHeight: 150, overflowY: "auto" }}>
                        {cart.map(item => (
                          <div key={item.product.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 0", borderBottom: "1px solid #f0f2f5" }}>
                            <span style={{ fontSize: 12.5, flex: 1, color: C.text }}>{item.product.name}</span>
                            <div style={{ display: "flex", alignItems: "center", background: "#f7f8fa", border: `1px solid ${C.border}`, borderRadius: 7, overflow: "hidden" }}>
                              <button onClick={() => changeQty(item.product.id, -1)} style={{ width: 24, height: 24, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: C.muted }}><Minus size={10} /></button>
                              <span style={{ fontSize: 12, fontWeight: 700, minWidth: 18, textAlign: "center" }}>{item.qty}</span>
                              <button onClick={() => changeQty(item.product.id, 1)} style={{ width: 24, height: 24, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: C.muted }}><Plus size={10} /></button>
                            </div>
                            <span style={{ fontSize: 12.5, fontWeight: 700, minWidth: 48, textAlign: "right" }}>${(item.product.price * item.qty).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Customers */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderTop: "1px solid #f0f2f5", marginBottom: 12 }}>
                      <span style={{ fontSize: 12, color: C.muted, fontWeight: 500 }}>Customers · អតិថិជន</span>
                      <div style={{ display: "flex", alignItems: "center", background: "#f7f8fa", border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden" }}>
                        <button onClick={() => setCustomers(c => Math.max(1, c - 1))} style={{ width: 28, height: 28, background: "none", border: "none", cursor: "pointer", color: C.muted, display: "flex", alignItems: "center", justifyContent: "center" }}><Minus size={11} /></button>
                        <span style={{ fontSize: 13, fontWeight: 700, minWidth: 20, textAlign: "center" }}>{customers}</span>
                        <button onClick={() => setCustomers(c => c + 1)} style={{ width: 28, height: 28, background: "none", border: "none", cursor: "pointer", color: C.muted, display: "flex", alignItems: "center", justifyContent: "center" }}><Plus size={11} /></button>
                      </div>
                    </div>

                    {/* Total + complete */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                      <span style={{ fontSize: 12, color: C.muted }}>{cartItems} item{cartItems !== 1 ? "s" : ""}</span>
                      <span style={{ fontWeight: 800, fontSize: 20, color: C.accent }}>${cartTotal.toFixed(2)}</span>
                    </div>
                    <button
                      onClick={completeSale}
                      disabled={cart.length === 0}
                      style={{ width: "100%", padding: "12px", background: cart.length ? C.accent : "#f0f2f5", color: cart.length ? C.sidebar : C.muted, fontWeight: 700, fontSize: 13.5, border: "none", borderRadius: 10, cursor: cart.length ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, boxShadow: cart.length ? `0 4px 14px ${C.accentGlow}` : "none" }}
                    >
                      <CheckCircle2 size={15} /> Complete Sale
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, padding: 7, borderRadius: 8 }}>
              <Bell size={18} />
            </button>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: C.accentDim, border: `1.5px solid ${C.accent}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: C.accent }}>SM</div>
          </div>
        </header>

        {/* ── Scrollable page body ── */}
        <div style={{ flex: 1, overflowY: "auto", padding: "26px 36px" }}>
          <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>

            {/* ── Usage bar ── */}
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 22px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: C.text }}>Monthly Sales Logs</div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>កំណត់ត្រាលក់ប្រចាំខែ</div>
                </div>
                <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{usage.used} <span style={{ color: C.muted, fontWeight: 400 }}>/ {usage.limit}</span></span>
              </div>
              <div style={{ width: "100%", height: 6, background: "#f0f2f5", borderRadius: 99, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${usagePct}%`, background: usagePct > 80 ? "#f59e0b" : C.accent, borderRadius: 99, transition: "width .6s ease" }} />
              </div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 8 }}>
                {usage.limit - usage.used} logs remaining · Resets monthly ·{" "}
                <Link href="/vendor/pricing" style={{ color: C.accent, textDecoration: "none", fontWeight: 600 }}>Upgrade for unlimited</Link>
              </div>
            </div>

            {/* ── Metric cards ── */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
              <SummaryCard title="Total Sales"    khmerTitle="ការលក់សរុប"   value={summary.sales}     icon={CircleDollarSign} trend="+12%" isPositive />
              <SummaryCard title="Total Expenses" khmerTitle="ចំណាយសរុប"   value={summary.expenses}  icon={Receipt}          trend="-5%"  isPositive />
              <SummaryCard title="Net Profit"     khmerTitle="ប្រាក់ចំណេញ" value={summary.profit}    icon={TrendingUp}       trend="+18%" isPositive highlight />
              <SummaryCard title="Customers"      khmerTitle="អតិថិជនសរុប" value={summary.customers} icon={Users}            subtext={`Avg ${summary.avgCustomer}`} />
            </div>

            {/* ── Charts ── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <ChartCard title="Weekly Revenue" khmer="ចំណូលប្រចាំសប្តាហ៍">
                <div style={{ height: 180, display: "flex", alignItems: "flex-end", gap: 7 }}>
                  {weeklyData.map((v, i) => (
                    <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                      <div style={{ width: "100%", height: 155, position: "relative", background: C.accentDim, borderRadius: "7px 7px 0 0" }}>
                        <div style={{ position: "absolute", bottom: 0, width: "100%", background: C.accent, borderRadius: "7px 7px 0 0", height: `${v}%`, transition: "height .5s ease" }} />
                      </div>
                      <span style={{ fontSize: 10, color: C.muted }}>{weeklyLabels[i]}</span>
                    </div>
                  ))}
                </div>
              </ChartCard>

              <ChartCard title="Monthly Revenue" khmer="ចំណូលប្រចាំខែ">
                <div style={{ height: 180, display: "flex", alignItems: "flex-end", gap: 14 }}>
                  {monthlyData.map((v, i) => (
                    <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: C.muted }}>${v}</span>
                      <div style={{ width: "100%", flex: 1, position: "relative", background: C.accentDim, borderRadius: "7px 7px 0 0", minHeight: 10 }}>
                        <div style={{ position: "absolute", bottom: 0, width: "100%", background: C.accent, borderRadius: "7px 7px 0 0", height: `${(v / 600) * 100}%`, transition: "height .5s ease" }} />
                      </div>
                      <span style={{ fontSize: 10, color: C.muted }}>{monthlyLabels[i]}</span>
                    </div>
                  ))}
                </div>
              </ChartCard>
            </div>

            {/* ── Log Expense — full width horizontal bar ── */}
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 26px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Log Expense</div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>ចំណាយ · Quick entry</div>
                </div>
                {expLogged && (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 20, background: C.accentDim, color: C.accent, fontSize: 12, fontWeight: 700, border: `1px solid rgba(62,207,142,.2)` }}>
                    <CheckCircle2 size={13} /> Logged!
                  </span>
                )}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "170px 1fr 1fr auto", gap: 16, alignItems: "start" }}>
                {/* Amount */}
                <div>
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 7 }}>Amount</div>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", fontSize: 13, fontWeight: 700, color: C.muted }}>$</span>
                    <input
                      type="number" placeholder="0.00" value={expAmount}
                      onChange={e => setExpAmount(e.target.value)}
                      style={{ width: "100%", padding: "11px 12px 11px 28px", background: "#f7f8fa", border: `1px solid ${C.border}`, borderRadius: 10, fontSize: 17, fontWeight: 700, fontFamily: "inherit", outline: "none", color: C.text }}
                      onFocus={e => (e.currentTarget.style.borderColor = C.accent)}
                      onBlur={e  => (e.currentTarget.style.borderColor = C.border)}
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 7 }}>Category</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
                    {EXP_CATS.map(cat => (
                      <button key={cat.key} onClick={() => setExpCat(expCat === cat.key ? "" : cat.key)}
                        style={{ padding: "8px 6px", borderRadius: 9, fontSize: 11.5, fontWeight: 600, border: `1px solid ${expCat === cat.key ? C.accent : C.border}`, background: expCat === cat.key ? C.accentDim : "#f7f8fa", color: expCat === cat.key ? C.accent : C.muted, cursor: "pointer", transition: "all .12s", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}
                      >
                        <span style={{ fontSize: 13 }}>{cat.emoji}</span>
                        <span>{cat.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Note */}
                <div>
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 7 }}>
                    Note <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional)</span>
                  </div>
                  <input
                    type="text" placeholder="e.g. Morning market run" value={expNote}
                    onChange={e => setExpNote(e.target.value)}
                    style={{ width: "100%", padding: "11px 14px", background: "#f7f8fa", border: `1px solid ${C.border}`, borderRadius: 10, fontSize: 13.5, fontFamily: "inherit", outline: "none", color: C.text }}
                    onFocus={e => (e.currentTarget.style.borderColor = C.accent)}
                    onBlur={e  => (e.currentTarget.style.borderColor = C.border)}
                  />
                </div>

                {/* Submit */}
                <div style={{ paddingTop: 26 }}>
                  <button
                    onClick={logExpense}
                    disabled={!expAmount || !expCat}
                    style={{ padding: "11px 22px", background: expAmount && expCat ? C.sidebar : "#f0f2f5", color: expAmount && expCat ? C.sidebarText : C.muted, fontWeight: 700, fontSize: 13.5, border: "none", borderRadius: 10, cursor: expAmount && expCat ? "pointer" : "not-allowed", display: "flex", alignItems: "center", gap: 7, transition: "all .15s", whiteSpace: "nowrap" }}
                    onMouseEnter={e => { if (expAmount && expCat) (e.currentTarget as HTMLButtonElement).style.background = C.sidebarHov; }}
                    onMouseLeave={e => { if (expAmount && expCat) (e.currentTarget as HTMLButtonElement).style.background = C.sidebar; }}
                  >
                    <Receipt size={15} /> Log Expense
                  </button>
                </div>
              </div>
            </div>

            {/* ── End of Day — full black ── */}
            <div style={{ background: C.sidebar, borderRadius: 14, border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
              <div style={{ padding: "18px 26px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: C.sidebarText }}>End-of-Day Summary</div>
                  <div style={{ fontSize: 11, color: C.sidebarMut, marginTop: 2 }}>សង្ខេបចុងថ្ងៃ</div>
                </div>
                {isDayLocked && (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "6px 14px", borderRadius: 20, background: "rgba(62,207,142,0.15)", color: C.accent, fontSize: 12, fontWeight: 700, border: "1px solid rgba(62,207,142,0.25)" }}>
                    <CheckCircle2 size={13} /> Day Locked
                  </span>
                )}
              </div>

              <div style={{ padding: "22px 26px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 18 }}>
                  <div style={{ padding: "18px 20px", background: "rgba(255,255,255,0.05)", borderRadius: 12, textAlign: "center", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: C.sidebarMut, marginBottom: 2 }}>Total Sales</div>
                    <div style={{ fontSize: 10, color: "#4d5562", marginBottom: 10 }}>ការលក់សរុប</div>
                    <div style={{ fontWeight: 700, fontSize: 26, color: C.sidebarText }}>{summary.sales}</div>
                  </div>
                  <div style={{ padding: "18px 20px", background: "rgba(239,68,68,0.08)", borderRadius: 12, textAlign: "center", border: "1px solid rgba(239,68,68,0.15)" }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(239,68,68,0.85)", marginBottom: 2 }}>Total Expenses</div>
                    <div style={{ fontSize: 10, color: "#4d5562", marginBottom: 10 }}>ចំណាយសរុប</div>
                    <div style={{ fontWeight: 700, fontSize: 26, color: C.danger }}>{summary.expenses}</div>
                  </div>
                  <div style={{ padding: "18px 20px", background: "rgba(62,207,142,0.10)", borderRadius: 12, textAlign: "center", border: "1px solid rgba(62,207,142,0.20)" }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: C.accent, marginBottom: 2 }}>Net Profit</div>
                    <div style={{ fontSize: 10, color: "#4d5562", marginBottom: 10 }}>ប្រាក់ចំណេញ</div>
                    <div style={{ fontWeight: 700, fontSize: 26, color: C.accent }}>{summary.profit}</div>
                  </div>
                </div>

                <div style={{ fontSize: 12.5, color: C.sidebarMut, marginBottom: 18 }}>
                  Auto-calculated: {summary.sales} − {summary.expenses} ={" "}
                  <strong style={{ color: C.sidebarText }}>{summary.profit}</strong>
                </div>

                {!isDayLocked ? (
                  <button
                    onClick={() => setIsDayLocked(true)}
                    style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 9, background: C.accent, color: C.sidebar, fontWeight: 700, fontSize: 15, padding: "16px", borderRadius: 11, border: "none", cursor: "pointer", transition: "all .2s", boxShadow: `0 4px 22px ${C.accentGlow}` }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#4dd49a"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = C.accent; }}
                  >
                    <Lock size={16} />
                    Confirm &amp; Lock Day
                    <span style={{ fontSize: 12, opacity: .65 }}>បញ្ជាក់ និងចាក់សោ</span>
                  </button>
                ) : (
                  <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "rgba(255,255,255,0.05)", color: C.sidebarMut, fontWeight: 600, fontSize: 14, padding: "16px", borderRadius: 11, border: "1px solid rgba(255,255,255,0.08)" }}>
                    <CheckCircle2 size={16} style={{ color: C.accent }} />
                    Day Locked — Records Finalized
                  </div>
                )}
              </div>
            </div>

            {/* bottom breathing room */}
            <div style={{ height: 16 }} />

          </div>
        </div>
      </main>
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────

function NavItem({ icon: Icon, title, khmerTitle, href, active = false }: NavItemProps) {
  return (
    <Link href={href}
      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 12px", borderRadius: 8, marginBottom: 2, background: active ? "rgba(62,207,142,0.12)" : "transparent", color: active ? C.accent : C.sidebarMut, textDecoration: "none", transition: "all .12s" }}
      className={!active ? "hover:bg-white/5 hover:!text-[#e6edf3]" : ""}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
        <Icon size={15} />
        <span style={{ fontSize: 13.5, fontWeight: active ? 600 : 400 }}>{title}</span>
      </div>
      <span style={{ fontSize: 10.5, opacity: .65 }}>{khmerTitle}</span>
    </Link>
  );
}

function SummaryCard({ title, khmerTitle, value, icon: Icon, trend, isPositive, subtext, highlight = false }: SummaryCardProps) {
  return (
    <div style={{ padding: "24px 26px", borderRadius: 14, background: highlight ? C.accent : C.surface, border: highlight ? `1px solid ${C.accent}` : `1px solid ${C.border}`, boxShadow: "0 1px 4px rgba(0,0,0,.06)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 10.5, fontWeight: 700, color: highlight ? "rgba(255,255,255,.8)" : C.muted, textTransform: "uppercase", letterSpacing: ".07em" }}>{title}</div>
          <div style={{ fontSize: 10, color: highlight ? "rgba(255,255,255,.6)" : "#9ca3af", marginTop: 2 }}>{khmerTitle}</div>
        </div>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: highlight ? "rgba(255,255,255,.2)" : "#f7f8fa", border: highlight ? "none" : `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={15} style={{ color: highlight ? "#fff" : C.accent }} />
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <span style={{ fontWeight: 700, fontSize: 30, lineHeight: 1, color: highlight ? "#fff" : C.text }}>{value}</span>
        {trend   && <span style={{ fontSize: 12.5, fontWeight: 700, color: highlight ? "#fff" : (isPositive ? C.accent : C.danger), marginBottom: 2 }}>{trend}</span>}
        {subtext && <span style={{ fontSize: 12.5, color: highlight ? "rgba(255,255,255,.75)" : C.muted, marginBottom: 2 }}>{subtext}</span>}
      </div>
    </div>
  );
}

function ChartCard({ title, khmer, children }: { title: string; khmer: string; children: React.ReactNode }) {
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 26px", boxShadow: "0 1px 4px rgba(0,0,0,.06)" }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 2 }}>{title}</div>
      <div style={{ fontSize: 11, color: C.muted, marginBottom: 20 }}>{khmer}</div>
      {children}
    </div>
  );
}