"use client";

"use client";

"use client";

import React, { useState, useRef, useEffect } from "react";

export default function LandingPage() {
  const [signupOpen, setSignupOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const signupRef = useRef<HTMLDivElement>(null);
  const loginRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (signupRef.current && !signupRef.current.contains(e.target as Node)) {
        setSignupOpen(false);
      }
      if (loginRef.current && !loginRef.current.contains(e.target as Node)) {
        setLoginOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-dark-bg text-white flex flex-col items-center justify-start font-sans selection:bg-brand-primary selection:text-white">
      {/* ========================================
        HEADER / NAV
        ======================================== */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-md">
        <div className="max-w-[1200px] mx-auto px-6 h-14 flex justify-between items-center">
          {/* Left: Brand / Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer">
            <span className="font-semibold text-[15px] tracking-tight text-[#F7F8F8]">
              PsarPulse KH
            </span>
          </div>

          {/* Right: Navigation & Auth Actions */}
          <div className="flex items-center gap-6">
            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-6">
              {[
                "Product",
                "Resources",
                "Customers",
                "Pricing",
                "Now",
                "Contact",
              ].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-[13px] font-medium text-[#8A8F98] transition-colors hover:text-white"
                >
                  {item}
                </a>
              ))}
            </nav>

            {/* Auth Actions with Divider */}
            <div className="hidden md:flex items-center gap-5 ml-1">
              {/* Faint vertical divider */}
              <div className="w-[1px] h-3.5 bg-white/15"></div>

              {/* ── Log in dropdown ── */}
              <div className="relative" ref={loginRef}>
                <button
                  onClick={() => {
                    setLoginOpen((v) => !v);
                    setSignupOpen(false);
                  }}
                  className="text-[13px] font-medium text-[#8A8F98] hover:text-white transition-colors flex items-center gap-1"
                >
                  Log in
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                    className={`transition-transform duration-200 ${loginOpen ? "rotate-180" : ""}`}
                  >
                    <path
                      d="M2 4l3 3 3-3"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {loginOpen && (
                  <div className="absolute right-0 top-[calc(100%+10px)] w-[210px] bg-[#111] border border-white/10 rounded-xl p-1.5 shadow-xl shadow-black/50 z-50">
                    {/* Vendor */}
                    <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors text-left">
                      <div className="w-7 h-7 rounded-md bg-brand-primary/10 flex items-center justify-center text-sm shrink-0">
                        🏪
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-white leading-tight">
                          Vendor log in
                        </p>
                        <p className="text-[11px] text-[#8A8F98] leading-tight mt-0.5">
                          Manage stall & analytics
                        </p>
                      </div>
                    </button>

                    {/* Divider */}
                    <div className="my-1 h-[0.5px] bg-white/8" />

                    {/* Customer */}
                    <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors text-left">
                      <div className="w-7 h-7 rounded-md bg-blue-400/10 flex items-center justify-center text-sm shrink-0">
                        🛍️
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-white leading-tight">
                          Customer log in
                        </p>
                        <p className="text-[11px] text-[#8A8F98] leading-tight mt-0.5">
                          Browse & follow stalls
                        </p>
                      </div>
                    </button>

                    {/* Guest */}
                    <div className="my-1 h-[0.5px] bg-white/8" />
                    <button className="w-full text-center py-2 text-[11px] text-[#8A8F98] hover:text-white transition-colors">
                      Try Demo →
                    </button>
                  </div>
                )}
              </div>

              {/* ── Sign up dropdown ── */}
              <div className="relative" ref={signupRef}>
                <button
                  onClick={() => {
                    setSignupOpen((v) => !v);
                    setLoginOpen(false);
                  }}
                  className="px-3 py-1.5 rounded-md bg-[#F7F8F8] hover:bg-white transition-colors text-black text-[13px] font-medium flex items-center gap-1.5"
                >
                  Sign up
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                    className={`transition-transform duration-200 ${signupOpen ? "rotate-180" : ""}`}
                  >
                    <path
                      d="M2 4l3 3 3-3"
                      stroke="black"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {signupOpen && (
                  <div className="absolute right-0 top-[calc(100%+10px)] w-[210px] bg-[#111] border border-white/10 rounded-xl p-1.5 shadow-xl shadow-black/50 z-50">
                    {/* Vendor */}
                    <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors text-left">
                      <div className="w-7 h-7 rounded-md bg-brand-primary/10 flex items-center justify-center text-sm shrink-0">
                        🏪
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-white leading-tight">
                          I&apos;m a Vendor
                        </p>
                        <p className="text-[11px] text-[#8A8F98] leading-tight mt-0.5">
                          Sell at night markets
                        </p>
                      </div>
                    </button>

                    {/* Divider */}
                    <div className="my-1 h-[0.5px] bg-white/8" />

                    {/* Customer */}
                    <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors text-left">
                      <div className="w-7 h-7 rounded-md bg-blue-400/10 flex items-center justify-center text-sm shrink-0">
                        🛍️
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-white leading-tight">
                          I&apos;m a Customer
                        </p>
                        <p className="text-[11px] text-[#8A8F98] leading-tight mt-0.5">
                          Browse & follow stalls
                        </p>
                      </div>
                    </button>

                    {/* Guest */}
                    <div className="my-1 h-[0.5px] bg-white/8" />
                    <button className="w-full text-center py-2 text-[11px] text-[#8A8F98] hover:text-white transition-colors">
                      Try Demo →
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ========================================
        HERO SECTION
        ======================================== */}
      <section
        className="relative w-full flex flex-col items-center pt-50 sm:pt-65 pb-8 px-4 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.95)), url('https://res.cloudinary.com/dg5grwcd5/image/upload/v1773661915/cambodia-night-market-phsar-chas-2_1_ii8ae1.jpg')`,
        }}
      >
        <h1 className="fade-in-1 text-4xl sm:text-5xl md:text-6xl font-semibold text-center text-white leading-[1.15] mb-6 max-w-4xl tracking-tight relative z-10">
          Smart business for <br className="hidden sm:block" />
          Cambodia&apos;s night markets
          <span className="text-brand-primary">.</span>
        </h1>

        <p className="fade-in-2 text-gray-300 text-center text-sm sm:text-base max-w-2xl mb-10 leading-relaxed relative z-10">
          Data-driven analytics and AI forecasting built exclusively for
          Cambodia&apos;s informal economy. Log sales, track growth, and let AI
          prepare your next move.
        </p>

        {/* CTA Buttons */}
        <div className="fade-in-3 flex flex-col sm:flex-row items-center gap-4 mb-6 relative z-10">
          <button className="px-6 py-3 rounded-xl bg-brand-primary hover:bg-brand-primary-hover transition-all duration-200 text-white font-semibold text-sm shadow-lg shadow-brand-primary/20 hover:-translate-y-[1px]">
            Get Started as Vendor →
          </button>
          <button className="px-6 py-3 rounded-xl border border-blue-400/40 text-blue-400 hover:border-blue-400/70 hover:text-blue-300 transition-all duration-200 font-medium text-sm">
            Sign in as Customer
          </button>
        </div>

        {/* Guest link */}
        <button className="fade-in-3 mb-28 text-[13px] text-white/30 hover:text-white/60 transition-colors underline underline-offset-2 relative z-10">
          Or try the demo
        </button>
      </section>

      {/* ========================================
        WHY CHOOSE HEADING
        ======================================== */}
      <h2 className="text-3xl sm:text-4xl font-medium text-center tracking-tight mb-24 px-4 mt-20">
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
              <p className="text-[13px] font-semibold text-muted mb-4">Basic</p>
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

      <footer className="relative w-full mt-24 pt-16 pb-[18vw] sm:pb-[14vw] lg:pb-[12vw] px-4 sm:px-8 lg:px-12 bg-[#0d0d0d] border-t border-dark-border overflow-hidden">
        {/* Top Grid Section */}
        <div className="relative z-20 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand & Tagline */}
          <div className="flex flex-col">
            <h4 className="text-xl font-bold text-white mb-4 tracking-tight">
              Psar<span className="text-brand-primary">Pulse</span>
            </h4>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
              Smart business analytics for Cambodia&apos;s night market vendors.
              Track sales, forecast demand, and grow with AI-powered insights.
            </p>
            {/* Social Icons */}
            <div className="flex gap-4">
              <a
                href="#"
                className="w-8 h-8 rounded-full border border-dark-border flex items-center justify-center hover:border-brand-primary hover:text-brand-primary transition-colors text-gray-400"
              >
                <span className="text-xs font-bold">FB</span>
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full border border-dark-border flex items-center justify-center hover:border-brand-primary hover:text-brand-primary transition-colors text-gray-400"
              >
                <span className="text-xs font-bold">TG</span>
              </a>
            </div>
          </div>

          {/* Links Column 1 */}
          <div className="flex flex-col">
            <h5 className="text-white text-sm font-semibold uppercase tracking-wider mb-6">
              Product
            </h5>
            <ul className="flex flex-col gap-3 text-sm text-gray-400">
              <li>
                <a
                  href="#features"
                  className="hover:text-brand-primary transition-colors"
                >
                  AI Forecasting
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  className="hover:text-brand-primary transition-colors"
                >
                  Sales Analytics
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  className="hover:text-brand-primary transition-colors"
                >
                  KHQR &amp; ABA Pay
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="hover:text-brand-primary transition-colors"
                >
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div className="flex flex-col">
            <h5 className="text-white text-sm font-semibold uppercase tracking-wider mb-6">
              Company
            </h5>
            <ul className="flex flex-col gap-3 text-sm text-gray-400">
              <li>
                <a
                  href="#"
                  className="hover:text-brand-primary transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#use-cases"
                  className="hover:text-brand-primary transition-colors"
                >
                  Use Cases
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="hover:text-brand-primary transition-colors"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-brand-primary transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Status & Location */}
          <div className="flex flex-col">
            <h5 className="text-white text-sm font-semibold uppercase tracking-wider mb-6">
              Status
            </h5>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 rounded-full bg-brand-primary animate-pulse shadow-[0_0_10px_rgba(41,178,141,0.6)]"></div>
              <span className="text-sm text-gray-300 font-medium">
                All Systems Operational
              </span>
            </div>
            <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">
              Based In
            </p>
            <p className="text-sm text-gray-400 leading-relaxed">
              Phnom Penh, Cambodia
            </p>
          </div>
        </div>

        {/* Bottom Section: Copyright */}
        <div className="relative z-20 max-w-7xl mx-auto border-t border-dark-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4 mt-8">
          <p className="text-gray-500 text-xs sm:text-sm text-center md:text-left">
            © {new Date().getFullYear()} PsarPulse KH. Built for Cambodia&apos;s
            vendors.
          </p>
          <div className="flex gap-6 text-xs text-gray-500">
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms of Service
            </a>
          </div>
        </div>

        {/* Massive Background Text & Gradient */}
        <h3 className="absolute bottom-[-10px] sm:bottom-[-20px] left-1/2 -translate-x-1/2 text-[14vw] sm:text-[10vw] font-bold tracking-tighter z-0 opacity-[0.03] whitespace-nowrap text-white pointer-events-none select-none">
          PSARPULSE
        </h3>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-brand-primary opacity-[0.04] blur-[80px] rounded-full pointer-events-none z-0"></div>
      </footer>
    </div>
  );
}