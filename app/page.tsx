import React from "react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-dark-bg text-white flex flex-col items-center justify-start font-sans selection:bg-brand-primary selection:text-white">
      {/* ========================================
        HEADER / NAV
        ======================================== */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-dark-border bg-dark-bg/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-[30px] h-[30px] bg-brand-primary rounded-lg flex items-center justify-center font-bold text-white text-sm">
              P
            </div>
            <span className="font-bold text-[15px] tracking-[-0.02em] text-white">
              PsarPulse KH
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-muted text-sm font-medium transition-colors duration-150 hover:text-white"
            >
              Features
            </a>
            <a
              href="#use-cases"
              className="text-muted text-sm font-medium transition-colors duration-150 hover:text-white"
            >
              Use Cases
            </a>
            <a
              href="#pricing"
              className="text-muted text-sm font-medium transition-colors duration-150 hover:text-white"
            >
              Pricing
            </a>
            <a
              href="#contact"
              className="text-muted text-sm font-medium transition-colors duration-150 hover:text-white"
            >
              Contact
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <button className="hidden sm:block px-5 py-2.5 rounded-xl bg-dark-surface border border-dark-border hover:bg-dark-surface-hover transition-colors text-sm font-medium text-white">
              Log in
            </button>
            <button className="px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary-hover transition-colors text-white text-sm font-medium">
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* ========================================
        HERO SECTION
        ======================================== */}
      <section className="w-full flex flex-col items-center pt-36 sm:pt-44 px-4">
        <div className="fade-in inline-flex mb-6">
          <span className="bg-brand-primary/10 text-brand-primary text-[11px] font-bold tracking-[0.08em] uppercase py-1.5 px-3 rounded-full border border-brand-primary/20">
            New — Gemini AI Forecaster is live
          </span>
        </div>

        <h1 className="fade-in-1 text-4xl sm:text-5xl md:text-6xl font-semibold text-center leading-[1.15] mb-6 max-w-4xl tracking-tight">
          Smart business for <br className="hidden sm:block" />
          Cambodia&apos;s night markets
          <span className="text-brand-primary">.</span>
        </h1>

        <p className="fade-in-2 text-muted text-center text-sm sm:text-base max-w-2xl mb-10 leading-relaxed">
          Data-driven analytics and AI forecasting built exclusively for
          Cambodia&apos;s informal economy. Log sales, track growth, and let AI
          prepare your next move.
        </p>

        <div className="fade-in-3 flex flex-col sm:flex-row items-center gap-4 mb-16 w-full sm:w-auto">
          <button className="px-6 py-3.5 rounded-xl bg-dark-surface border border-dark-border hover:bg-dark-surface-hover transition-colors text-sm font-medium w-full sm:w-auto">
            Explore Features
          </button>
          <button className="px-6 py-3.5 rounded-xl bg-brand-primary hover:bg-brand-primary-hover transition-colors text-white text-sm font-medium w-full sm:w-auto shadow-lg shadow-brand-primary/20">
            Start Logging Free →
          </button>
        </div>

        {/* DASHBOARD PREVIEW */}
        <div className="fade-in-4 relative w-full max-w-[900px] mb-20">
          <div className="relative w-full rounded-2xl overflow-hidden border border-dark-border bg-dark-surface shadow-2xl shadow-brand-primary/5">
            {/* Browser chrome */}
            <div className="bg-dark-surface border-b border-dark-border py-3 px-5 flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#333]"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#333]"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#333]"></div>
              <div className="flex-1 ml-3 bg-dark-bg border border-dark-border rounded-md py-1 px-3 text-[11px] text-muted max-w-[200px]">
                app.psarpulse.kh
              </div>
            </div>

            {/* Dashboard content */}
            <div className="grid md:grid-cols-3 gap-0">
              {/* Revenue card */}
              <div className="py-8 px-7 border-b md:border-b-0 md:border-r border-dark-border">
                <p className="text-[11px] text-muted tracking-[0.06em] uppercase mb-1.5 font-semibold">
                  Sokha&apos;s Grill Station
                </p>
                <p className="text-muted text-[13px] mb-5">
                  Today&apos;s Revenue
                </p>
                <div className="text-4xl font-bold text-brand-primary mb-2 tracking-[-0.02em]">
                  ៛ 450,000
                </div>
                <span className="inline-block text-[12px] text-brand-primary bg-brand-primary/10 border border-brand-primary/20 py-[3px] px-2 rounded-md font-semibold">
                  +14% vs yesterday
                </span>
                <button className="block w-full mt-7 bg-brand-primary text-white font-semibold text-[13px] p-2.5 rounded-lg text-center shadow-sm hover:bg-brand-primary-hover transition-colors">
                  + Log Sale
                </button>
              </div>

              {/* AI Insight */}
              <div className="py-8 px-7 col-span-2">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-[10px] bg-brand-primary/10 flex items-center justify-center shrink-0">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#29B28D"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-brand-primary/10 text-brand-primary text-[10px] font-bold tracking-[0.1em] uppercase py-[3px] px-2 rounded-md border border-brand-primary/20">
                        AI Insight
                      </span>
                    </div>
                    <h4 className="text-base font-semibold mb-2.5 tracking-[-0.01em] text-white">
                      Busy night tomorrow
                    </h4>
                    <p className="text-muted text-sm leading-[1.65]">
                      Clear weather forecast + historical data shows a 35% surge
                      in foot traffic this weekend at Phnom Penh Night Market.
                      Prepare 30% more grilled skewer inventory.
                    </p>
                  </div>
                </div>

                {/* Mini stats row */}
                <div className="grid grid-cols-3 gap-3 mt-7">
                  {[
                    ["1,240", "Sales logged"],
                    ["98%", "Uptime"],
                    ["4.9★", "Vendor rating"],
                  ].map(([val, lbl]) => (
                    <div
                      key={lbl}
                      className="bg-dark-bg rounded-[10px] py-3.5 px-4 border border-dark-border"
                    >
                      <div className="text-xl font-bold tracking-[-0.02em] mb-0.5 text-white">
                        {val}
                      </div>
                      <div className="text-muted text-[11px] font-medium">
                        {lbl}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Shadow fade overlay */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-dark-bg pointer-events-none"></div>
        </div>
      </section>

      {/* ========================================
        WHY CHOOSE HEADING
        ======================================== */}
      <h2 className="text-3xl sm:text-4xl font-medium text-center tracking-tight mb-24 px-4">
        Why Choose <span className="text-secondary">PsarPulse</span> for Your
        Business?
      </h2>

      {/* ========================================
        ALTERNATING FEATURE SECTIONS
        ======================================== */}
      <div
        id="features"
        className="w-full max-w-6xl mx-auto flex flex-col gap-32 pb-24 px-4 sm:px-8"
      >
        {/* Feature 1: AI Forecasting */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-20">
          <div className="w-full md:w-1/2 text-left">
            <h3 className="text-3xl sm:text-4xl font-semibold leading-[1.2] mb-6 tracking-tight">
              Gemini-Powered <br />
              <span className="text-secondary">AI Forecasting</span>
            </h3>
            <p className="text-muted text-sm sm:text-base leading-relaxed max-w-lg">
              Predict tomorrow&apos;s customer traffic using local weather data
              and historical sales patterns. Get inventory recommendations
              before the night begins and auto-generate Khmer Facebook selling
              posts with one click.
            </p>
          </div>
          <div className="w-full md:w-1/2 flex justify-center md:justify-end">
            <div className="relative w-full max-w-[400px] aspect-square rounded-2xl bg-dark-surface border border-dark-border flex items-center justify-center overflow-hidden">
              {/* Icon visual */}
              <div className="flex flex-col items-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-brand-primary/10 flex items-center justify-center">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#29B28D"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="text-center px-8">
                  <p className="text-white font-semibold text-lg mb-2">
                    AI Predictions
                  </p>
                  <p className="text-muted text-sm">
                    Tomorrow: +35% foot traffic
                  </p>
                  <div className="mt-4 flex items-center gap-2 justify-center">
                    <div className="h-8 w-3 bg-brand-primary/20 rounded-sm"></div>
                    <div className="h-12 w-3 bg-brand-primary/30 rounded-sm"></div>
                    <div className="h-16 w-3 bg-brand-primary/50 rounded-sm"></div>
                    <div className="h-20 w-3 bg-brand-primary/70 rounded-sm"></div>
                    <div className="h-24 w-3 bg-brand-primary rounded-sm"></div>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-dark-bg pointer-events-none"></div>
            </div>
          </div>
        </div>

        {/* Feature 2: Advanced Analytics (Reversed) */}
        <div className="flex flex-col md:flex-row-reverse items-center justify-between gap-12 md:gap-20">
          <div className="w-full md:w-1/2 text-left">
            <h3 className="text-3xl sm:text-4xl font-semibold leading-[1.2] mb-6 tracking-tight">
              Real-Time Analytics <br />
              <span className="text-secondary">Track Every Sale</span>
            </h3>
            <p className="text-muted text-sm sm:text-base leading-relaxed max-w-lg">
              Log sales instantly with one tap. View best-sellers, profit
              margins, daily revenue trends, and compare weekly growth — all
              designed for vendors who need speed over complexity.
            </p>
          </div>
          <div className="w-full md:w-1/2 flex justify-center md:justify-start">
            <div className="relative w-full max-w-[400px] aspect-square rounded-2xl bg-dark-surface border border-dark-border flex items-center justify-center overflow-hidden">
              <div className="flex flex-col items-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-brand-primary/10 flex items-center justify-center">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#29B28D"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="text-center px-8">
                  <p className="text-white font-semibold text-lg mb-2">
                    Sales Dashboard
                  </p>
                  <p className="text-muted text-sm">Today: ៛ 450,000</p>
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    {[
                      ["24", "Items"],
                      ["+14%", "Growth"],
                      ["៛18k", "Avg"],
                    ].map(([v, l]) => (
                      <div
                        key={l}
                        className="bg-dark-bg rounded-lg py-2 px-3 border border-dark-border"
                      >
                        <p className="text-brand-primary font-bold text-sm">
                          {v}
                        </p>
                        <p className="text-muted text-[10px]">{l}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-dark-bg pointer-events-none"></div>
            </div>
          </div>
        </div>

        {/* Feature 3: Local Payments */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-20">
          <div className="w-full md:w-1/2 text-left">
            <h3 className="text-3xl sm:text-4xl font-semibold leading-[1.2] mb-6 tracking-tight">
              Local Payments <br />
              <span className="text-secondary">ABA & KHQR Built-In</span>
            </h3>
            <p className="text-muted text-sm sm:text-base leading-relaxed max-w-lg">
              Accept payments through ABA PayWay and KHQR directly in the
              platform. Manage subscriptions, track Riel transactions, and
              reconcile everything in one place — no extra apps needed.
            </p>
          </div>
          <div className="w-full md:w-1/2 flex justify-center md:justify-end">
            <div className="relative w-full max-w-[400px] aspect-square rounded-2xl bg-dark-surface border border-dark-border flex items-center justify-center overflow-hidden">
              <div className="flex flex-col items-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-brand-primary/10 flex items-center justify-center">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#29B28D"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div className="text-center px-8">
                  <p className="text-white font-semibold text-lg mb-2">
                    Payment Integration
                  </p>
                  <p className="text-muted text-sm">KHQR • ABA PayWay</p>
                  <div className="mt-4 flex items-center gap-3 justify-center">
                    <div className="bg-dark-bg border border-dark-border rounded-lg py-2 px-4">
                      <p className="text-brand-primary font-bold text-xs">
                        KHQR
                      </p>
                    </div>
                    <div className="bg-dark-bg border border-dark-border rounded-lg py-2 px-4">
                      <p className="text-brand-primary font-bold text-xs">
                        ABA
                      </p>
                    </div>
                    <div className="bg-dark-bg border border-dark-border rounded-lg py-2 px-4">
                      <p className="text-brand-primary font-bold text-xs">
                        ៛ KHR
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-dark-bg pointer-events-none"></div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================
        REAL-WORLD USE CASES
        ======================================== */}
      <div id="use-cases" className="w-full pt-12 pb-32">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium text-center tracking-tight leading-[1.15] mb-16 px-4">
          Real-World Applications <br />
          <span className="text-secondary">The Cambodian Context</span>
        </h2>

        <div className="max-w-5xl mx-auto px-4 sm:px-8 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Left Column */}
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="relative w-full h-[450px] sm:h-[550px] rounded-3xl overflow-hidden group bg-dark-surface border border-dark-border">
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src="https://res.cloudinary.com/dg5grwcd5/image/upload/v1773387153/pexels-chuck-2973392_t3hik9.jpg"
                  alt="Night Market Vendors"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-10"></div>
              <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col items-center text-center z-20">
                <h4 className="text-3xl font-bold text-white mb-3">
                  Night Market Stalls
                </h4>
                <p className="text-muted text-sm max-w-[280px]">
                  Track sales, predict busy nights, and manage inventory across
                  Phnom Penh&apos;s busiest markets.
                </p>
              </div>
            </div>

            <div className="relative w-full h-[350px] rounded-3xl overflow-hidden group bg-dark-surface border border-dark-border">
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src="https://res.cloudinary.com/dg5grwcd5/image/upload/v1773386990/pexels-zakhar-9407601_jpbr7t.jpg"
                  alt="Street Food Vendors"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-10"></div>
              <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col items-center text-center z-20">
                <h4 className="text-2xl font-bold text-white mb-3">
                  Street Food Carts
                </h4>
                <p className="text-muted text-sm max-w-[280px]">
                  One-tap sale logging designed for speed when customers are
                  lining up.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="relative w-full h-[350px] rounded-3xl overflow-hidden group bg-dark-surface border border-dark-border">
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src="https://res.cloudinary.com/dg5grwcd5/image/upload/v1773386708/pexels-cottonbro-4709369_ys1qfj.jpg"
                  alt="Small Retail Shops"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-10"></div>
              <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col items-center text-center z-20">
                <h4 className="text-2xl font-bold text-white mb-3">
                  Small Retail Shops
                </h4>
                <p className="text-muted text-sm max-w-[280px]">
                  Full inventory management with low-stock SMS alerts and
                  AI-powered restock suggestions.
                </p>
              </div>
            </div>

            <div className="relative w-full h-[504px] rounded-3xl overflow-hidden group bg-dark-surface border border-dark-border">
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src="https://res.cloudinary.com/dg5grwcd5/image/upload/v1773387072/pexels-tima-miroshnichenko-5380664_api0pc.jpg"
                  alt="Digital Analytics Dashboard"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-10"></div>
              <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col items-center text-center z-20">
                <h4 className="text-2xl font-bold text-white mb-3">
                  Your <span className="text-secondary">Command Centre</span>
                </h4>
                <p className="text-muted text-sm max-w-[280px]">
                  A real-time dashboard with revenue charts, AI insights, and
                  growth analytics at your fingertips.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================
        PRICING SECTION
        ======================================== */}
      <section
        id="pricing"
        className="w-full py-24 px-4 sm:px-8 border-t border-dark-border"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <span className="bg-brand-primary/10 text-brand-primary text-[11px] font-bold tracking-[0.08em] uppercase py-1.5 px-3 rounded-full border border-brand-primary/20 mb-4 inline-block">
              Pricing
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight mb-3">
              Vendor-friendly pricing
            </h2>
            <p className="text-muted text-sm sm:text-base">
              Integrated with ABA PayWay for seamless subscriptions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {/* Basic */}
            <div className="bg-dark-surface border border-dark-border rounded-[20px] transition-colors duration-200 hover:border-brand-primary/30 py-8 px-7 flex flex-col">
              <p className="text-[13px] font-semibold text-muted mb-4">
                Basic
              </p>
              <p className="text-[40px] font-bold tracking-[-0.03em] mb-6 text-white">
                Free
              </p>
              <div className="flex-1 flex flex-col gap-3 mb-7">
                {[
                  "Basic sales logging",
                  "7-day history",
                  "3 dashboard charts",
                  "Khmer/English UI toggle",
                ].map((f) => (
                  <div key={f} className="flex gap-2.5 items-start">
                    <div className="w-[5px] h-[5px] rounded-full bg-[#333] shrink-0 mt-[7px]"></div>
                    <span className="text-muted text-[13px]">{f}</span>
                  </div>
                ))}
              </div>
              <button className="w-full p-3 rounded-xl border border-dark-border bg-dark-bg text-white font-semibold text-sm hover:bg-dark-surface-hover transition-colors">
                Start Free
              </button>
            </div>

            {/* Pro */}
            <div className="bg-dark-surface border-2 border-brand-primary rounded-[20px] shadow-lg shadow-brand-primary/10 py-8 px-7 flex flex-col relative transform md:-translate-y-2">
              <div className="flex justify-between items-center mb-4">
                <p className="text-[13px] font-bold text-white">Pro</p>
                <span className="bg-brand-primary/10 text-brand-primary text-[10px] font-bold tracking-[0.1em] uppercase py-[3px] px-2 rounded-md border border-brand-primary/20">
                  Popular
                </span>
              </div>
              <div className="mb-1 text-white">
                <span className="text-[40px] font-bold tracking-[-0.03em]">
                  $3
                </span>
                <span className="text-muted text-sm ml-1">/mo</span>
              </div>
              <p className="text-xs text-brand-primary font-semibold mb-6">
                ≈ 12,000 Riel
              </p>
              <div className="flex-1 flex flex-col gap-3 mb-7">
                {[
                  "Full analytics & insights",
                  "Unlimited logs & history",
                  "Export data (PDF/Excel)",
                  "ABA PayWay integration",
                ].map((f) => (
                  <div key={f} className="flex gap-2.5 items-start">
                    <div className="w-[5px] h-[5px] rounded-full bg-brand-primary shrink-0 mt-[7px]"></div>
                    <span className="text-white font-medium text-[13px]">
                      {f}
                    </span>
                  </div>
                ))}
              </div>
              <button className="bg-brand-primary text-white font-semibold py-[13px] px-7 rounded-xl transition-all duration-200 text-sm tracking-[-0.01em] hover:bg-brand-primary-hover hover:-translate-y-[1px] w-full shadow-sm">
                Upgrade to Pro
              </button>
            </div>

            {/* Premium */}
            <div className="bg-dark-surface border border-dark-border rounded-[20px] transition-colors duration-200 hover:border-brand-primary/30 py-8 px-7 flex flex-col">
              <p className="text-[13px] font-semibold text-muted mb-4">
                Premium
              </p>
              <div className="mb-6 text-white">
                <span className="text-[40px] font-bold tracking-[-0.03em]">
                  $7
                </span>
                <span className="text-muted text-sm ml-1">/mo</span>
              </div>
              <div className="flex-1 flex flex-col gap-3 mb-7">
                {[
                  "Everything in Pro",
                  "AI Sales Forecaster",
                  "Low-stock SMS alerts",
                  "FB post auto-generator",
                ].map((f) => (
                  <div key={f} className="flex gap-2.5 items-start">
                    <div className="w-[5px] h-[5px] rounded-full bg-[#333] shrink-0 mt-[7px]"></div>
                    <span className="text-muted text-[13px]">{f}</span>
                  </div>
                ))}
              </div>
              <button className="w-full p-3 rounded-xl border border-dark-border bg-dark-bg text-white font-semibold text-sm hover:bg-dark-surface-hover transition-colors">
                Get Premium
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
        CONTACT & FOOTER
        ======================================== */}
      <div
        id="contact"
        className="w-full max-w-5xl mx-auto py-24 px-4 sm:px-8 flex flex-col items-center"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium text-center tracking-tight mb-4">
          Ready to <span className="text-secondary">Grow</span>?
        </h2>
        <p className="text-muted text-center text-sm sm:text-base mb-16 max-w-lg">
          Join hundreds of Cambodian vendors already using PsarPulse to track
          sales, forecast demand, and grow their business.
        </p>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-12 text-center mb-16">
          <div className="flex flex-col items-center">
            <h4 className="text-lg font-semibold mb-2">Support</h4>
            <a
              href="mailto:support@psarpulse.kh"
              className="text-brand-primary hover:underline"
            >
              support@psarpulse.kh
            </a>
          </div>
          <div className="flex flex-col items-center">
            <h4 className="text-lg font-semibold mb-2">Location</h4>
            <p className="text-muted text-sm">Phnom Penh, Cambodia</p>
          </div>
        </div>

        <button className="px-8 py-4 rounded-xl bg-brand-primary hover:bg-brand-primary-hover transition-all duration-200 text-white font-semibold shadow-lg shadow-brand-primary/20 hover:-translate-y-[1px]">
          Create Free Account →
        </button>
      </div>

      <footer className="relative w-full mt-12 pt-20 pb-10 px-4 sm:px-8 flex flex-col items-center overflow-hidden border-t border-dark-border/50">
        <div className="flex items-center gap-3 mb-8 z-10">
          <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center font-bold text-white text-sm">
            P
          </div>
          <h3 className="text-2xl font-medium tracking-wide">PsarPulse KH</h3>
        </div>

        <div className="flex gap-8 mb-8 z-10">
          {["Features", "Pricing", "Privacy", "Terms"].map((l) => (
            <a
              key={l}
              href="#"
              className="text-muted text-sm hover:text-white transition-colors"
            >
              {l}
            </a>
          ))}
        </div>

        <div className="flex bg-dark-surface rounded-lg p-[3px] border border-dark-border mb-8 z-10">
          <button className="text-xs font-semibold py-1.5 px-3.5 rounded-md bg-dark-surface-hover text-white border border-dark-border/50">
            English
          </button>
          <button className="text-xs font-medium py-1.5 px-3.5 text-muted hover:text-white transition-colors">
            ភាសាខ្មែរ
          </button>
        </div>

        <p className="text-muted text-xs sm:text-sm z-10">
          © 2026 PsarPulse KH. Empowering Cambodia&apos;s Informal Economy.
        </p>
      </footer>
    </div>
  );
}
