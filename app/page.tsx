import React from "react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans font-['DM_Sans',_'Inter',_sans-serif]">
      {/* Retained for keyframes and font import */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        .fade-in { animation: fadeUp 0.7s ease both; }
        .fade-in-1 { animation: fadeUp 0.7s 0.1s ease both; }
        .fade-in-2 { animation: fadeUp 0.7s 0.2s ease both; }
        .fade-in-3 { animation: fadeUp 0.7s 0.35s ease both; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* NAV */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-[30px] h-[30px] bg-[#29B28D] rounded-lg flex items-center justify-center font-bold text-white text-sm">
              P
            </div>
            <span className="font-bold text-[15px] tracking-[-0.02em] text-slate-900">
              PsarPulse KH
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-slate-500 text-sm font-medium transition-colors duration-150 hover:text-slate-900"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-slate-500 text-sm font-medium transition-colors duration-150 hover:text-slate-900"
            >
              Pricing
            </a>
            <a
              href="#"
              className="text-slate-500 text-sm font-medium transition-colors duration-150 hover:text-slate-900"
            >
              Dashboard
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <button className="hidden sm:block text-slate-500 text-sm font-medium transition-colors duration-150 hover:text-slate-900">
              Log in
            </button>
            <button className="bg-[#29B28D] text-white font-semibold py-2.5 px-6 rounded-[10px] transition-all duration-200 text-sm tracking-[-0.01em] shadow-sm shadow-[#29B28D]/20 hover:bg-[#249e7d] hover:-translate-y-[1px]">
              Get started
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="max-w-5xl mx-auto px-6 pt-24 pb-24 text-center">
        <div className="fade-in inline-flex mb-6">
          <span className="bg-[#29B28D]/10 text-[#219072] text-[11px] font-bold tracking-[0.08em] uppercase py-1 px-2.5 rounded-md">
            New — Gemini AI Forecaster is live
          </span>
        </div>

        <h1 className="fade-in-1 text-[clamp(40px,6vw,72px)] font-bold leading-[1.05] tracking-[-0.03em] mb-6 text-slate-900">
          Smart business for
          <br />
          <span className="text-[#29B28D]">night market stalls.</span>
        </h1>

        <p className="fade-in-2 text-slate-600 text-lg leading-[1.7] max-w-[520px] mx-auto mb-9 font-normal">
          Data-driven analytics and AI forecasting built exclusively for
          Cambodia's informal economy.
        </p>

        <div className="fade-in-3 flex flex-col sm:flex-row gap-3 justify-center">
          <button className="bg-[#29B28D] text-white font-semibold py-[14px] px-8 rounded-[10px] transition-all duration-200 text-[15px] tracking-[-0.01em] shadow-md shadow-[#29B28D]/20 hover:bg-[#249e7d] hover:-translate-y-[1px]">
            Start logging for free →
          </button>
          <button className="text-slate-700 bg-white font-medium py-[14px] px-8 rounded-[10px] transition-all duration-200 text-[15px] border border-slate-200 shadow-sm hover:bg-slate-50 hover:border-slate-300">
            Book a demo
          </button>
        </div>

        {/* DASHBOARD MOCKUP */}
        <div className="fade-in-3 bg-white border border-slate-200 rounded-[20px] mt-16 text-left overflow-hidden shadow-xl shadow-slate-200/50 transition-colors duration-200 hover:border-[#29B28D]/30">
          {/* Browser chrome */}
          <div className="bg-slate-50 border-b border-slate-200 py-[14px] px-5 flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
            <div className="flex-1 ml-3 bg-white border border-slate-200 rounded-md py-1 px-3 text-[11px] text-slate-400 max-w-[200px] shadow-sm">
              app.psarpulse.kh
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-0">
            {/* Revenue card */}
            <div className="py-8 px-7 border-b md:border-b-0 md:border-r border-slate-200">
              <p className="text-[11px] text-slate-400 tracking-[0.06em] uppercase mb-1.5 font-semibold">
                Sokha's Grill Station
              </p>
              <p className="text-slate-600 text-[13px] mb-5">Today's Revenue</p>
              <div className="text-4xl font-bold text-[#29B28D] mb-2 tracking-[-0.02em]">
                ៛ 450,000
              </div>
              <span className="inline-block text-[12px] text-emerald-700 bg-emerald-100 border border-emerald-200 py-[3px] px-2 rounded-md font-semibold">
                +14% vs yesterday
              </span>
              <button className="block w-full mt-7 bg-[#29B28D] text-white font-semibold text-[13px] p-2.5 rounded-lg text-center shadow-sm hover:bg-[#249e7d] transition-colors">
                + Log Sale
              </button>
            </div>

            {/* AI Insight */}
            <div className="py-8 px-7 col-span-2">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-[10px] bg-[#29B28D]/10 flex items-center justify-center shrink-0">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#219072"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-[#29B28D]/10 text-[#219072] text-[10px] font-bold tracking-[0.1em] uppercase py-[3px] px-2 rounded-md border border-[#29B28D]/20">
                      AI Insight
                    </span>
                  </div>
                  <h4 className="text-base font-semibold mb-2.5 tracking-[-0.01em] text-slate-900">
                    Busy night tomorrow
                  </h4>
                  <p className="text-slate-600 text-sm leading-[1.65]">
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
                    className="bg-slate-50 rounded-[10px] py-3.5 px-4 border border-slate-200"
                  >
                    <div className="text-xl font-bold tracking-[-0.02em] mb-0.5 text-slate-900">
                      {val}
                    </div>
                    <div className="text-slate-500 text-[11px] font-medium">
                      {lbl}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <div className="border-y border-slate-200 py-6 bg-white">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
          <p className="text-slate-400 text-[11px] font-bold tracking-[0.1em] uppercase">
            Trusted across
          </p>
          {[
            "Russian Market",
            "PP Night Market",
            "Siem Reap Old Market",
            "Psar Leu",
          ].map((m) => (
            <span key={m} className="text-[13px] font-bold text-slate-300">
              {m}
            </span>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <section id="features" className="max-w-5xl mx-auto px-6 py-28">
        <div className="mb-14">
          <span className="bg-[#29B28D]/10 text-[#219072] text-[11px] font-bold tracking-[0.08em] uppercase py-1 px-2.5 rounded-md mb-4 inline-block">
            Features
          </span>
          <h2 className="text-[clamp(28px,4vw,44px)] font-bold tracking-[-0.03em] leading-[1.1] mb-4 text-slate-900">
            Intelligence for the
            <br />
            informal economy.
          </h2>
          <p className="text-slate-600 text-base max-w-[420px] leading-[1.7]">
            Enterprise-grade analytics at street-vendor prices. Built for how
            Cambodia actually works.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {/* Large feature */}
          <div className="bg-white border border-slate-200 rounded-[20px] transition-colors duration-200 hover:border-[#29B28D]/40 md:col-span-2 py-9 px-8 shadow-sm">
            <div className="w-11 h-11 rounded-xl bg-[#29B28D]/10 flex items-center justify-center mb-5">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#219072"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2.5 tracking-[-0.02em] text-slate-900">
              Gemini AI Forecasting
            </h3>
            <p className="text-slate-600 text-sm leading-[1.7]">
              Predictive notifications for inventory preparation based on local
              weather and market events. Auto-generate Khmer Facebook selling
              posts with one click.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-[20px] transition-colors duration-200 hover:border-[#29B28D]/40 py-9 px-8 shadow-sm">
            <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center mb-5">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#475569"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-2.5 tracking-[-0.02em] text-slate-900">
              Advanced Analytics
            </h3>
            <p className="text-slate-600 text-[13px] leading-[1.7]">
              Log sales instantly. View best-sellers, profit margins, and
              compare growth.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-[20px] transition-colors duration-200 hover:border-[#29B28D]/40 py-9 px-8 shadow-sm">
            <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center mb-5">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#475569"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-2.5 tracking-[-0.02em] text-slate-900">
              Local Payments
            </h3>
            <p className="text-slate-600 text-[13px] leading-[1.7]">
              ABA PayWay and KHQR integrated. Manage subscriptions or accept
              Riel payments.
            </p>
          </div>

          {/* CTA bento */}
          <div className="md:col-span-2 bg-[#29B28D] rounded-[20px] py-9 px-8 flex items-center justify-between shadow-md shadow-[#29B28D]/20">
            <div>
              <h3 className="text-[22px] font-bold text-white mb-1.5 tracking-[-0.02em]">
                Ready to grow?
              </h3>
              <p className="text-white/80 text-sm mb-6">
                Join hundreds of vendors tracking their success.
              </p>
              <button className="bg-white text-[#219072] hover:bg-slate-50 font-semibold text-[13px] py-2.5 px-[22px] rounded-lg transition-colors">
                Create free account
              </button>
            </div>
            <svg
              width="80"
              height="80"
              viewBox="0 0 24 24"
              fill="rgba(255,255,255,0.15)"
              className="hidden md:block"
            >
              <path d="M12 2L2 22h20L12 2z" />
            </svg>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section
        id="pricing"
        className="border-t border-slate-200 py-20 px-6 bg-white"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <span className="bg-[#29B28D]/10 text-[#219072] text-[11px] font-bold tracking-[0.08em] uppercase py-1 px-2.5 rounded-md mb-3.5 inline-block">
              Pricing
            </span>
            <h2 className="text-[clamp(28px,4vw,42px)] font-bold tracking-[-0.03em] mb-2.5 text-slate-900">
              Vendor-friendly pricing
            </h2>
            <p className="text-slate-600 text-[15px]">
              Integrated with ABA PayWay for seamless subscriptions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {/* Basic */}
            <div className="bg-white border border-slate-200 rounded-[20px] transition-colors duration-200 hover:border-[#29B28D]/40 py-8 px-7 flex flex-col shadow-sm">
              <p className="text-[13px] font-semibold text-slate-500 mb-4">
                Basic
              </p>
              <p className="text-[40px] font-bold tracking-[-0.03em] mb-6 text-slate-900">
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
                    <div className="w-[5px] h-[5px] rounded-full bg-slate-300 shrink-0 mt-[7px]"></div>
                    <span className="text-slate-600 text-[13px]">{f}</span>
                  </div>
                ))}
              </div>
              <button className="w-full p-3 rounded-[10px] border border-slate-200 bg-slate-50 text-slate-700 font-semibold text-sm hover:bg-slate-100 transition-colors">
                Start Free
              </button>
            </div>

            {/* Pro */}
            <div className="bg-white border-2 border-[#29B28D] rounded-[20px] shadow-lg shadow-[#29B28D]/10 py-8 px-7 flex flex-col relative transform md:-translate-y-2">
              <div className="flex justify-between items-center mb-4">
                <p className="text-[13px] font-bold text-slate-900">Pro</p>
                <span className="bg-[#29B28D]/10 text-[#219072] text-[10px] font-bold tracking-[0.1em] uppercase py-[3px] px-2 rounded-md">
                  Popular
                </span>
              </div>
              <div className="mb-1 text-slate-900">
                <span className="text-[40px] font-bold tracking-[-0.03em]">
                  $3
                </span>
                <span className="text-slate-500 text-sm ml-1">/mo</span>
              </div>
              <p className="text-xs text-[#219072] font-semibold mb-6">
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
                    <div className="w-[5px] h-[5px] rounded-full bg-[#29B28D] shrink-0 mt-[7px]"></div>
                    <span className="text-slate-700 font-medium text-[13px]">
                      {f}
                    </span>
                  </div>
                ))}
              </div>
              <button className="bg-[#29B28D] text-white font-semibold py-[13px] px-7 rounded-[10px] transition-all duration-200 text-sm tracking-[-0.01em] hover:bg-[#249e7d] hover:-translate-y-[1px] w-full shadow-sm">
                Upgrade to Pro
              </button>
            </div>

            {/* Premium */}
            <div className="bg-white border border-slate-200 rounded-[20px] transition-colors duration-200 hover:border-[#29B28D]/40 py-8 px-7 flex flex-col shadow-sm">
              <p className="text-[13px] font-semibold text-slate-500 mb-4">
                Premium
              </p>
              <div className="mb-6 text-slate-900">
                <span className="text-[40px] font-bold tracking-[-0.03em]">
                  $7
                </span>
                <span className="text-slate-500 text-sm ml-1">/mo</span>
              </div>
              <div className="flex-1 flex flex-col gap-3 mb-7">
                {[
                  "Everything in Pro",
                  "AI Sales Forecaster",
                  "Low-stock SMS alerts",
                  "FB post auto-generator",
                ].map((f) => (
                  <div key={f} className="flex gap-2.5 items-start">
                    <div className="w-[5px] h-[5px] rounded-full bg-slate-300 shrink-0 mt-[7px]"></div>
                    <span className="text-slate-600 text-[13px]">{f}</span>
                  </div>
                ))}
              </div>
              <button className="w-full p-3 rounded-[10px] border border-slate-200 bg-slate-50 text-slate-700 font-semibold text-sm hover:bg-slate-100 transition-colors">
                Get Premium
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 pt-12 px-6 pb-9 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-10 mb-12">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-7 h-7 bg-[#29B28D] rounded-md flex items-center justify-center font-bold text-white text-[13px]">
                  P
                </div>
                <span className="font-bold text-[15px] tracking-[-0.02em] text-slate-900">
                  PsarPulse KH
                </span>
              </div>
              <p className="text-slate-500 text-[13px] max-w-[240px] leading-[1.7]">
                Empowering Cambodia's informal economy with data-driven
                insights. Built with ❤️ in Phnom Penh.
              </p>
            </div>
            <div className="flex gap-12">
              <div>
                <p className="text-xs font-bold mb-3.5 text-slate-400 tracking-[0.06em] uppercase">
                  Product
                </p>
                <div className="flex flex-col gap-2.5">
                  {["Features", "Pricing"].map((l) => (
                    <a
                      key={l}
                      href="#"
                      className="text-[13px] text-slate-500 transition-colors duration-150 hover:text-slate-900"
                    >
                      {l}
                    </a>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold mb-3.5 text-slate-400 tracking-[0.06em] uppercase">
                  Legal
                </p>
                <div className="flex flex-col gap-2.5">
                  {["Privacy", "Terms"].map((l) => (
                    <a
                      key={l}
                      href="#"
                      className="text-[13px] text-slate-500 transition-colors duration-150 hover:text-slate-900"
                    >
                      {l}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-200 pt-5 flex justify-between items-center flex-wrap gap-3">
            <p className="text-slate-400 text-xs">
              © 2026 PsarPulse KH. All rights reserved.
            </p>
            <div className="flex bg-slate-200/50 rounded-lg p-[3px] border border-slate-200">
              <button className="text-xs font-semibold py-1.5 px-3.5 rounded-md bg-white text-slate-900 shadow-sm border border-slate-200/50">
                English
              </button>
              <button className="text-xs font-medium py-1.5 px-3.5 text-slate-500 hover:text-slate-700 transition-colors">
                ភាសាខ្មែរ
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
