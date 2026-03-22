"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LanguageDropdown } from "@/components/ui/LanguageDropdown";

export default function LandingPage() {
  const [signupOpen, setSignupOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const { language: lang, setLanguage } = useLanguage();
  const { theme, resolvedTheme } = useTheme();

  const signupRef = useRef<HTMLDivElement>(null);
  const loginRef = useRef<HTMLDivElement>(null);

  const t = {
    en: {
      nav: ["Product", "Resources", "Customers", "Pricing", "Now", "Contact"],
      login: "Log in",
      signup: "Sign up",
      heroTitle1: "Smart business for",
      heroTitle2: "Cambodia's night markets",
      heroDesc: "Data-driven analytics and AI forecasting built exclusively for Cambodia's informal economy. Log sales, track growth, and let AI prepare your next move.",
      btnVendor: "Get Started as Vendor →",
      btnCustomer: "Sign up as Customer",
      btnDemo: "Or try the demo",
      loginVendor: "Vendor log in",
      loginVendorDesc: "Manage stall & analytics",
      loginCustomer: "Customer log in",
      loginCustomerDesc: "Browse & follow stalls",
      signupVendor: "I'm a Vendor",
      signupVendorDesc: "Sell at night markets",
      signupCustomer: "I'm a Customer",
      signupCustomerDesc: "Browse & follow stalls",
      tryDemo: "Try Demo →",
      whyChoose: "Why Choose PsarPulse for Your Business?",
      feature1Title: "Gemini-Powered AI Forecasting",
      feature1Desc: "Predict tomorrow's customer traffic using local weather data and historical sales patterns. Get inventory recommendations before the night begins and auto-generate Khmer Facebook selling posts with one click.",
      aiPredictions: "AI Predictions",
      aiPredictionsDesc: "Tomorrow: +35% foot traffic",
      feature2Title: "Real-Time Analytics",
      feature2Desc: "Log sales instantly with one tap. View best-sellers, profit margins, daily revenue trends, and compare weekly growth — all designed for vendors who need speed over complexity.",
      salesDashboard: "Sales Dashboard",
      salesDashboardToday: "Today: ៛ 450,000",
      items: "Items",
      growth: "Growth",
      avg: "Avg",
      feature3Title: "Local Payments",
      feature3Desc: "Accept payments through ABA PayWay and KHQR directly in the platform. Manage subscriptions, track Riel transactions, and reconcile everything in one place — no extra apps needed.",
      paymentIntegration: "Payment Integration",
      paymentIntegrationDesc: "KHQR • ABA PayWay",
      useCasesTitle: "Real-World Applications",
      useCasesSubtitle: "The Cambodian Context",
      useCase1Title: "Night Market Stalls",
      useCase1Desc: "Track sales, predict busy nights, and manage inventory across Phnom Penh's busiest markets.",
      useCase2Title: "Street Food Carts",
      useCase2Desc: "One-tap sale logging designed for speed when customers are lining up.",
      useCase3Title: "Small Retail Shops",
      useCase3Desc: "Full inventory management with low-stock SMS alerts and AI-powered restock suggestions.",
      useCase4Title: "Your Command Centre",
      useCase4Desc: "A real-time dashboard with revenue charts, AI insights, and growth analytics at your fingertips.",
      pricingTitle: "Vendor-friendly pricing",
      pricingDesc: "Integrated with ABA PayWay for seamless subscriptions.",
      basicFeatures: ["Basic sales logging", "7-day history", "3 dashboard charts", "Khmer/English UI toggle"],
      proFeatures: ["Full analytics & insights", "Unlimited logs & history", "Export data (PDF/Excel)", "ABA PayWay integration"],
      premiumFeatures: ["Everything in Pro", "AI Sales Forecaster", "Low-stock SMS alerts", "FB post auto-generator"],
      footerTagline: "Smart business analytics for Cambodia's night market vendors. Track sales, forecast demand, and grow with AI-powered insights.",
      footerProduct: "Product",
      footerCompany: "Company",
      footerResources: "Resources",
      aboutUs: "About Us",
      useCases: "Use Cases",
      pricing: "Pricing",
      footerLinks: {
        aiForecasting: "AI Forecasting",
        salesAnalytics: "Sales Analytics",
        payments: "KHQR & ABA Pay"
      },
      basicName: "Free",
      proName: "Pro",
      premiumName: "Premium",
      popular: "Popular",
      startFree: "Start Free",
      upgradePro: "Upgrade to Pro",
      getPremium: "Get Premium",
      approxRiel: "≈ ៛ 16,000",
      month: "/month",
      status: "STATUS",
      systemsOperational: "All Systems Operational",
      basedIn: "BASED IN",
      location: "Phnom Penh, Cambodia",
      contact: "Contact",
      copyright: "Built for Cambodia's vendors.",
      privacyPolicy: "Privacy Policy",
      termsOfService: "Terms of Service"
    },
    km: {
      nav: ["ផលិតផល", "ធនធាន", "អតិថិជន", "តម្លៃ", "ឥឡូវនេះ", "ទំនាក់ទំនង"],
      login: "ចូលគណនី",
      signup: "ចុះឈ្មោះ",
      heroTitle1: "អាជីវកម្មឆ្លាតវៃសម្រាប់",
      heroTitle2: "ផ្សាររាត្រីនៅកម្ពុជា",
      heroDesc: "ការវិភាគទিন្នន័យ និងការព្យាករណ៍ AI សម្រាប់សេដ្ឋកិច្ចក្រៅប្រព័ន្ធរបស់កម្ពុជា។ កត់ត្រាការលក់តាមដាននិងអនុញ្ញាតឱ្យ AI រៀបចំដំណើរការអាជីវកម្មអ្នក។",
      btnVendor: "ចាប់ផ្តើមជាអ្នកលក់ →",
      btnCustomer: "ចុះឈ្មោះជាអតិថិជន",
      btnDemo: "ឬសាកល្បងវេបសាយគំរូ",
      loginVendor: "ចូលគណនីអ្នកលក់",
      loginVendorDesc: "គ្រប់គ្រងស្តង់ និងការវិភាគ",
      loginCustomer: "ចូលគណនីអតិថិជន",
      loginCustomerDesc: "ស្វែងរក និងតាមដានស្តង់",
      signupVendor: "ខ្ញុំជាអ្នកលក់",
      signupVendorDesc: "លក់នៅផ្សាររាត្រី",
      signupCustomer: "ខ្ញុំជាអតិថិជន",
      signupCustomerDesc: "ស្វែងរក និងតាមដានស្តង់",
      tryDemo: "សាកល្បង Demo →",
      whyChoose: "ហេតុអ្វីបានជាជ្រើសរើស PsarPulse សម្រាប់អាជីវកម្មរបស់អ្នក?",
      feature1Title: "ការព្យាករណ៍ AI ដំណើរការដោយ Gemini",
      feature1Desc: "ព្យាករណ៍ចរាចរណ៍អតិថិជននៅថ្ងៃស្អែកដោយប្រើទិន្នន័យអាកាសធាតុក្នុងតំបន់ និងលំនាំនៃការលក់ពីមុន។ ទទួលបានការណែនាំអំពីសារពើភ័ណ្ឌមុនពេលយប់ចាប់ផ្តើម និងបង្កើតការបង្ហោះលក់ក្នុង Facebook ជាភាសាខ្មែរដោយស្វ័យប្រវត្តិដោយចុចតែម្តង។",
      aiPredictions: "ការព្យាករណ៍ AI",
      aiPredictionsDesc: "ថ្ងៃស្អែក៖ +៣៥% ចរាចរណ៍អតិថិជន",
      feature2Title: "ការវិភាគពេលវេលាជាក់ស្តែង",
      feature2Desc: "កត់ត្រាការលក់ភ្លាមៗដោយចុចតែម្តង។ មើលទំនិញលក់ដាច់បំផុត ភាគលាភ ចរន្តចំណូលប្រចាំថ្ងៃ និងប្រៀបធៀបកំណើនប្រចាំសប្តាហ៍ — ទាំងអស់នេះរចនាឡើងសម្រាប់អ្នកលក់ដែលត្រូវការភាពរហ័សជាងភាពស្មុគស្មាញ។",
      salesDashboard: "ផ្ទាំងគ្រប់គ្រងការលក់",
      salesDashboardToday: "ថ្ងៃនេះ៖ ៛ ៤៥០,០០០",
      items: "មុខទំនិញ",
      growth: "កំណើន",
      avg: "មធ្យម",
      feature3Title: "ការទូទាត់ក្នុងស្រុក",
      feature3Desc: "ទទួលយកការទូទាត់តាមរយៈ ABA PayWay និង KHQR ដោយផ្ទាល់នៅក្នុងប្រព័ន្ធ។ គ្រប់គ្រងការជាវ តាមដានប្រតិបត្តិការប្រាក់រៀល និងសម្រុះសម្រួលអ្វីៗគ្រប់យ៉ាងនៅកន្លែងតែមួយ — មិនចាំបាច់មានកម្មវិធីបន្ថែមទេ។",
      paymentIntegration: "ការរួមបញ្ចូលការទូទាត់",
      paymentIntegrationDesc: "KHQR • ABA PayWay",
      useCasesTitle: "កម្មវិធីប្រើប្រាស់ក្នុងពិភពពិត",
      useCasesSubtitle: "បរិបទកម្ពុជា",
      useCase1Title: "ស្តង់ផ្សាររាត្រី",
      useCase1Desc: "តាមដានការលក់ ព្យាករណ៍យប់ដែលមមាញឹក និងគ្រប់គ្រងសារពើភ័ណ្ឌនៅទូទាំងទីផ្សារដែលមមាញឹកបំផុតរបស់ភ្នំពេញ។",
      useCase2Title: "រទេះអាហារតាមផ្លូវ",
      useCase2Desc: "ការកត់ត្រាការលក់ដោយចុចតែម្តងរចនាឡើងសម្រាប់ភាពរហ័សនៅពេលអតិថិជនកំពុងតម្រង់ជួរ។",
      useCase3Title: "ហាងលក់រាយតូចៗ",
      useCase3Desc: "ការគ្រប់គ្រងសារពើភ័ណ្ឌពេញលេញជាមួយនឹងការផ្ញើសារជូនដំណឹងនៅពេលទំនិញជិតអស់ និងការណែនាំអំពីការបំពេញទំនិញដែលដំណើរការដោយ AI ។",
      useCase4Title: "មជ្ឈមណ្ឌលបញ្ជារបស់អ្នក",
      useCase4Desc: "ផ្ទាំងគ្រប់គ្រងពេលវេលាជាក់ស្តែងជាមួយនឹងតារាងចំណូល ការយល់ដឹងពី AI និងការវិភាគកំណើននៅចុងម្រាមដៃរបស់អ្នក។",
      pricingTitle: "តម្លៃសមរម្យសម្រាប់អ្នកលក់",
      pricingDesc: "រួមបញ្ចូលជាមួយ ABA PayWay សម្រាប់ការជាវដោយរលូន។",
      basicFeatures: ["កត់ត្រាការលក់មូលដ្ឋាន", "ប្រវត្តិ ៧ ថ្ងៃ", "តារាងផ្ទាំងគ្រប់គ្រង ៣", "ប្តូរភាសា ខ្មែរ/អង់គ្លេស"],
      proFeatures: ["ការវិភាគ និងការយល់ដឹងពេញលេញ", "កំណត់ត្រា និងប្រវត្តិមិនកំណត់", "នាំចេញទិន្នន័យ (PDF/Excel)", "ការរួមបញ្ចូល ABA PayWay"],
      premiumFeatures: ["អ្វីគ្រប់យ៉ាងនៅក្នុង Pro", "ការព្យាករណ៍ការលក់ AI", "សារជូនដំណឹងទំនិញជិតអស់", "ការបង្កើតការបង្ហោះ FB ស្វ័យប្រវត្តិ"],
      footerTagline: "ការវិភាគអាជីវកម្មឆ្លាតវៃសម្រាប់អ្នកលក់នៅផ្សាររាត្រីរបស់កម្ពុជា។ តាមដានការលក់ ព្យាករណ៍តម្រូវការ និងរីកលូតលាស់ជាមួយនឹងការយល់ដឹងដែលដំណើរការដោយ AI ។",
      footerProduct: "ផលិតផល",
      footerCompany: "ក្រុមហ៊ុន",
      footerResources: "ធនធាន",
      aboutUs: "អំពីយើង",
      useCases: "ករណីប្រើប្រាស់",
      pricing: "តម្លៃ",
      footerLinks: {
        aiForecasting: "ការព្យាករណ៍ AI",
        salesAnalytics: "ការវិភាគការលក់",
        payments: "KHQR និង ABA Pay"
      },
      basicName: "ឥតគិតថ្លៃ",
      proName: "Pro",
      premiumName: "Premium",
      popular: "ពេញនិយម",
      startFree: "ចាប់ផ្តើមឥតគិតថ្លៃ",
      upgradePro: "តំឡើងទៅ Pro",
      getPremium: "ទទួលបាន Premium",
      approxRiel: "≈ ៛ ១៦,០០០",
      month: "/ខែ",
      status: "ស្ថានភាព",
      systemsOperational: "ប្រព័ន្ធដំណើរការធម្មតា",
      basedIn: "មូលដ្ឋាននៅ",
      location: "ភ្នំពេញ កម្ពុជា",
      contact: "ទំនាក់ទំនង",
      copyright: "បង្កើតឡើងសម្រាប់អ្នកលក់នៅកម្ពុជា។",
      privacyPolicy: "គោលការណ៍ឯកជនភាព",
      termsOfService: "លក្ខខណ្ឌប្រើប្រាស់"
    }
  };

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
    <div className={`min-h-screen ${resolvedTheme === "light" ? "bg-white text-slate-900" : "bg-dark-bg text-white"} flex flex-col items-center justify-start font-sans selection:bg-brand-primary selection:text-white transition-colors duration-500`}>
      {/* ========================================
        HEADER / NAV
        ======================================== */}
      <header className={`fixed top-0 left-0 right-0 z-50 border-b ${resolvedTheme === "light" ? "border-slate-200 bg-white/80" : "border-white/10 bg-black/80"} backdrop-blur-md transition-colors duration-500`}>
        <div className="max-w-[1200px] mx-auto px-6 h-14 flex justify-between items-center">
          {/* Left: Brand / Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer">
            <span className={`font-semibold text-[15px] tracking-tight ${resolvedTheme === "light" ? "text-slate-900" : "text-[#F7F8F8]"}`}>
              PsarPulse KH
            </span>
          </div>

          {/* Right: Navigation & Auth Actions */}
          <div className="flex items-center gap-6">
            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-6">
              {t[lang].nav.map((item, idx) => (
                <a
                  key={idx}
                  href={`#section-${idx}`}
                  className={`text-[13px] font-medium transition-colors ${resolvedTheme === "light" ? "text-slate-500 hover:text-slate-900" : "text-[#8A8F98] hover:text-white"}`}
                >
                  {item}
                </a>
              ))}
            </nav>

            {/* Auth Actions with Divider */}
            <div className="hidden md:flex items-center gap-5 ml-1">
              {/* Theme Toggle */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-medium text-[#8A8F98] uppercase">
                  {theme === "dark" ? "Dark" : "Light"}
                </span>
                <ThemeToggle />
              </div>

              {/* Language Switch Toggle */}
              <LanguageDropdown />

              {/* Faint vertical divider */}
              <div className="w-[1px] h-3.5 bg-white/15"></div>

              {/* ── Log in dropdown ── */}
              <div className="relative" ref={loginRef}>
                <button
                  onClick={() => {
                    setLoginOpen((v) => !v);
                    setSignupOpen(false);
                  }}
                  className={`text-[13px] font-medium transition-colors flex items-center gap-1 ${resolvedTheme === "light" ? "text-slate-500 hover:text-slate-900" : "text-[#8A8F98] hover:text-white"}`}
                >
                  {t[lang].login}
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
                  <div className={`absolute right-0 top-[calc(100%+10px)] w-[210px] border rounded-xl p-1.5 shadow-xl z-50 transition-colors ${resolvedTheme === "light" ? "bg-white border-slate-200 shadow-slate-200/50" : "bg-[#111] border-white/10 shadow-black/50"}`}>
                    {/* Vendor */}
                    <Link href="/login" className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors text-left ${resolvedTheme === "light" ? "hover:bg-slate-50" : "hover:bg-white/5"}`}>
                      <div className="w-7 h-7 rounded-md bg-brand-primary/10 flex items-center justify-center text-sm shrink-0">
                        🏪
                      </div>
                      <div>
                        <p className={`text-[13px] font-medium leading-tight ${resolvedTheme === "light" ? "text-slate-900" : "text-white"}`} style={lang === "km" ? { fontFamily: "var(--font-suwannaphum)" } : {}}>
                          {t[lang].loginVendor}
                        </p>
                        <p className={`text-[11px] leading-tight mt-0.5 ${resolvedTheme === "light" ? "text-slate-500" : "text-[#8A8F98]"}`} style={lang === "km" ? { fontFamily: "var(--font-suwannaphum)" } : {}}>
                          {t[lang].loginVendorDesc}
                        </p>
                      </div>
                    </Link>

                    {/* Divider */}
                    <div className="my-1 h-[0.5px] bg-white/8" />

                    {/* Customer */}
                    <Link href="/login" className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors text-left">
                      <div className="w-7 h-7 rounded-md bg-blue-400/10 flex items-center justify-center text-sm shrink-0">
                        🛍️
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-white leading-tight" style={lang === "km" ? { fontFamily: "var(--font-suwannaphum)" } : {}}>
                          {t[lang].loginCustomer}
                        </p>
                        <p className="text-[11px] text-[#8A8F98] leading-tight mt-0.5" style={lang === "km" ? { fontFamily: "var(--font-suwannaphum)" } : {}}>
                          {t[lang].loginCustomerDesc}
                        </p>
                      </div>
                    </Link>

                    {/* Guest */}
                    <div className="my-1 h-[0.5px] bg-white/8" />
                    <Link href="/guest" className="w-full block text-center py-2 text-[11px] text-[#8A8F98] hover:text-white transition-colors" style={lang === "km" ? { fontFamily: "var(--font-suwannaphum)" } : {}}>
                      {t[lang].tryDemo}
                    </Link>
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
                  {t[lang].signup}
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
                    <Link href="/vendor/register" className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors text-left">
                      <div className="w-7 h-7 rounded-md bg-brand-primary/10 flex items-center justify-center text-sm shrink-0">
                        🏪
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-white leading-tight" style={lang === "km" ? { fontFamily: "var(--font-suwannaphum)" } : {}}>
                          {t[lang].signupVendor}
                        </p>
                        <p className="text-[11px] text-[#8A8F98] leading-tight mt-0.5" style={lang === "km" ? { fontFamily: "var(--font-suwannaphum)" } : {}}>
                          {t[lang].signupVendorDesc}
                        </p>
                      </div>
                    </Link>

                    {/* Divider */}
                    <div className="my-1 h-[0.5px] bg-white/8" />

                    {/* Customer */}
                    <Link href="/signup" className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors text-left">
                      <div className="w-7 h-7 rounded-md bg-blue-400/10 flex items-center justify-center text-sm shrink-0">
                        🛍️
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-white leading-tight" style={lang === "km" ? { fontFamily: "var(--font-suwannaphum)" } : {}}>
                          {t[lang].signupCustomer}
                        </p>
                        <p className="text-[11px] text-[#8A8F98] leading-tight mt-0.5" style={lang === "km" ? { fontFamily: "var(--font-suwannaphum)" } : {}}>
                          {t[lang].signupCustomerDesc}
                        </p>
                      </div>
                    </Link>

                    {/* Guest */}
                    <div className="my-1 h-[0.5px] bg-white/8" />
                    <Link href="/guest" className="w-full block text-center py-2 text-[11px] text-[#8A8F98] hover:text-white transition-colors" style={lang === "km" ? { fontFamily: "var(--font-suwannaphum)" } : {}}>
                      {t[lang].tryDemo}
                    </Link>
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
        className="relative w-full flex flex-col items-center pt-50 sm:pt-65 pb-8 px-4 bg-cover bg-center bg-no-repeat transition-all duration-700"
        style={{
          backgroundImage: `${resolvedTheme === "light" 
            ? "linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.9))" 
            : "linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.95))"}, url('https://res.cloudinary.com/dg5grwcd5/image/upload/v1773661915/cambodia-night-market-phsar-chas-2_1_ii8ae1.jpg')`,
        }}
      >
        <h1 className={`fade-in-1 text-4xl sm:text-5xl md:text-6xl font-semibold text-center leading-[1.15] mb-6 max-w-4xl tracking-tight relative z-10 w-full transition-colors ${resolvedTheme === "light" ? "text-slate-900" : "text-white"}`} style={lang === "km" ? { fontFamily: "var(--font-suwannaphum)", lineHeight: "1.4" } : {}}>
          {t[lang].heroTitle1} <br className="hidden sm:block" />
          {t[lang].heroTitle2}
        </h1>

        <p className={`fade-in-2 text-center text-sm sm:text-base max-w-2xl mb-10 leading-relaxed relative z-10 transition-colors ${resolvedTheme === "light" ? "text-slate-600" : "text-gray-300"}`} style={lang === "km" ? { fontFamily: "var(--font-suwannaphum)", lineHeight: "1.8", fontSize: "16px" } : {}}>
          {t[lang].heroDesc}
        </p>

        <div className="fade-in-3 flex flex-col sm:flex-row items-center gap-4 mb-6 relative z-10">
          <Link href="/vendor/register" className="px-6 py-3 rounded-xl bg-brand-primary hover:bg-brand-primary-hover transition-all duration-200 text-white font-semibold text-sm shadow-lg shadow-brand-primary/20 hover:-translate-y-[1px]" style={lang === "km" ? { fontFamily: "var(--font-suwannaphum)" } : {}}>
            {t[lang].btnVendor}
          </Link>
          <Link href="/login" className="px-6 py-3 rounded-xl border border-blue-400/40 text-blue-400 hover:border-blue-400/70 hover:text-blue-300 transition-all duration-200 font-medium text-sm" style={lang === "km" ? { fontFamily: "var(--font-suwannaphum)" } : {}}>
            {t[lang].btnCustomer}
          </Link>
        </div>

        {/* Guest link */}
        <Link href="/guest" className={`fade-in-3 mb-28 text-[13px] transition-colors underline underline-offset-2 relative z-10 ${resolvedTheme === "light" ? "text-slate-400 hover:text-slate-600" : "text-white/30 hover:text-white/60"}`} style={lang === "km" ? { fontFamily: "var(--font-suwannaphum)", fontSize: "14px" } : {}}>
          {t[lang].btnDemo}
        </Link>
      </section>

      {/* ========================================
        WHY CHOOSE HEADING
        ======================================== */}
      <h2 className={`text-3xl sm:text-4xl font-medium text-center tracking-tight mb-24 px-4 mt-20 transition-colors ${resolvedTheme === "light" ? "text-slate-900" : "text-white"}`} style={lang === "km" ? { fontFamily: "var(--font-suwannaphum)" } : {}}>
        {t[lang].whyChoose}
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
            <h3 className={`text-3xl sm:text-4xl font-semibold leading-[1.2] mb-6 tracking-tight transition-colors ${resolvedTheme === "light" ? "text-slate-900" : "text-white"}`} style={lang === "km" ? { fontFamily: "var(--font-suwannaphum)", lineHeight: "1.4" } : {}}>
              {t[lang].feature1Title}
            </h3>
            <p className={`text-sm sm:text-base leading-relaxed max-w-lg transition-colors ${resolvedTheme === "light" ? "text-slate-600" : "text-muted"}`} style={lang === "km" ? { fontFamily: "var(--font-suwannaphum)", lineHeight: "1.8" } : {}}>
              {t[lang].feature1Desc}
            </p>
          </div>
          <div className="w-full md:w-1/2 flex justify-center md:justify-end">
            <div className={`relative w-full max-w-[400px] aspect-square rounded-2xl border flex items-center justify-center overflow-hidden transition-colors ${resolvedTheme === "light" ? "bg-slate-50 border-slate-200" : "bg-dark-surface border-dark-border"}`}>
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
                  <p className={`font-semibold text-lg mb-2 transition-colors ${resolvedTheme === "light" ? "text-slate-900" : "text-white"}`} style={lang === "km" ? { fontFamily: "var(--font-suwannaphum)" } : {}}>
                    {t[lang].aiPredictions}
                  </p>
                  <p className={`text-sm transition-colors ${resolvedTheme === "light" ? "text-slate-500" : "text-muted"}`} style={lang === "km" ? { fontFamily: "var(--font-suwannaphum)" } : {}}>
                    {t[lang].aiPredictionsDesc}
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
              <div className={`absolute inset-0 pointer-events-none ${resolvedTheme === "light" ? "bg-gradient-to-b from-transparent via-transparent to-white" : "bg-gradient-to-b from-transparent via-transparent to-dark-bg"}`}></div>
            </div>
          </div>
        </div>

        {/* Feature 2: Advanced Analytics (Reversed) */}
        <div className="flex flex-col md:flex-row-reverse items-center justify-between gap-12 md:gap-20">
          <div className="w-full md:w-1/2 text-left">
            <h3 className={`text-3xl sm:text-4xl font-semibold leading-[1.2] mb-6 tracking-tight transition-colors ${resolvedTheme === "light" ? "text-slate-900" : "text-white"}`} style={lang === "km" ? { fontFamily: "var(--font-suwannaphum)" } : {}}>
              {t[lang].feature2Title}
            </h3>
            <p className={`text-sm sm:text-base leading-relaxed max-w-lg transition-colors ${resolvedTheme === "light" ? "text-slate-600" : "text-muted"}`} style={lang === "km" ? { fontFamily: "var(--font-suwannaphum)", lineHeight: "1.8" } : {}}>
              {t[lang].feature2Desc}
            </p>
          </div>
          <div className="w-full md:w-1/2 flex justify-center md:justify-start">
            <div className={`relative w-full max-w-[400px] aspect-square rounded-2xl border flex items-center justify-center overflow-hidden transition-colors ${resolvedTheme === "light" ? "bg-slate-50 border-slate-200" : "bg-dark-surface border-dark-border"}`}>
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
                  <p className={`font-semibold text-lg mb-2 transition-colors ${resolvedTheme === "light" ? "text-slate-900" : "text-white"}`} style={lang === "km" ? { fontFamily: "var(--font-suwannaphum)" } : {}}>
                    {t[lang].salesDashboard}
                  </p>
                  <p className={`text-sm transition-colors ${resolvedTheme === "light" ? "text-slate-500" : "text-muted"}`} style={lang === "km" ? { fontFamily: "var(--font-suwannaphum)" } : {}}>
                    {t[lang].salesDashboardToday}
                  </p>
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    {[
                      ["24", "Items"],
                      ["+14%", "Growth"],
                      ["៛18k", "Avg"],
                    ].map(([v, l]) => (
                      <div
                        key={l}
                        className={`rounded-lg py-2 px-3 border transition-colors ${resolvedTheme === "light" ? "bg-white border-slate-200" : "bg-dark-bg border-dark-border"}`}
                      >
                        <p className="text-brand-primary font-bold text-sm">
                          {v === "Items" ? t[lang].items : v === "Growth" ? t[lang].growth : v === "Avg" ? t[lang].avg : v}
                        </p>
                        <p className="text-muted text-[10px]" style={lang === "km" ? { fontFamily: "var(--font-suwannaphum)" } : {}}>
                          {l === "Items" ? t[lang].items : l === "Growth" ? t[lang].growth : l === "Avg" ? t[lang].avg : l}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className={`absolute inset-0 pointer-events-none ${resolvedTheme === "light" ? "bg-gradient-to-b from-transparent via-transparent to-white" : "bg-gradient-to-b from-transparent via-transparent to-dark-bg"}`}></div>
            </div>
          </div>
        </div>

        {/* Feature 3: Local Payments */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-20">
          <div className="w-full md:w-1/2 text-left">
            <h3 className={`text-3xl sm:text-4xl font-semibold leading-[1.2] mb-6 tracking-tight transition-colors ${resolvedTheme === "light" ? "text-slate-900" : "text-white"}`} style={lang === "km" ? { fontFamily: "var(--font-suwannaphum)" } : {}}>
              {t[lang].feature3Title}
            </h3>
            <p className={`text-sm sm:text-base leading-relaxed max-w-lg transition-colors ${resolvedTheme === "light" ? "text-slate-600" : "text-muted"}`} style={lang === "km" ? { fontFamily: "var(--font-suwannaphum)", lineHeight: "1.8" } : {}}>
              {t[lang].feature3Desc}
            </p>
          </div>
          <div className="w-full md:w-1/2 flex justify-center md:justify-end">
            <div className={`relative w-full max-w-[400px] aspect-square rounded-2xl border flex items-center justify-center overflow-hidden transition-colors ${resolvedTheme === "light" ? "bg-slate-50 border-slate-200" : "bg-dark-surface border-dark-border"}`}>
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
                  <p className={`font-semibold text-lg mb-2 transition-colors ${resolvedTheme === "light" ? "text-slate-900" : "text-white"}`} style={lang === "km" ? { fontFamily: "var(--font-suwannaphum)" } : {}}>
                    {t[lang].paymentIntegration}
                  </p>
                  <p className={`text-sm transition-colors ${resolvedTheme === "light" ? "text-slate-500" : "text-muted"}`} style={lang === "km" ? { fontFamily: "var(--font-suwannaphum)" } : {}}>
                    {t[lang].paymentIntegrationDesc}
                  </p>
                  <div className="mt-4 flex items-center gap-3 justify-center">
                    <div className={`border rounded-lg py-2 px-4 transition-colors ${resolvedTheme === "light" ? "bg-white border-slate-200" : "bg-dark-bg border-dark-border"}`}>
                      <p className="text-brand-primary font-bold text-xs">
                        KHQR
                      </p>
                    </div>
                    <div className={`border rounded-lg py-2 px-4 transition-colors ${resolvedTheme === "light" ? "bg-white border-slate-200" : "bg-dark-bg border-dark-border"}`}>
                      <p className="text-brand-primary font-bold text-xs">
                        ABA
                      </p>
                    </div>
                    <div className={`border rounded-lg py-2 px-4 transition-colors ${resolvedTheme === "light" ? "bg-white border-slate-200" : "bg-dark-bg border-dark-border"}`}>
                      <p className="text-brand-primary font-bold text-xs">
                        ៛ KHR
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`absolute inset-0 pointer-events-none ${resolvedTheme === "light" ? "bg-gradient-to-b from-transparent via-transparent to-white" : "bg-gradient-to-b from-transparent via-transparent to-dark-bg"}`}></div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================
        REAL-WORLD USE CASES
        ======================================== */}
      <div id="use-cases" className="w-full pt-12 pb-32">
        <h2 className={`text-3xl sm:text-4xl md:text-5xl font-medium text-center tracking-tight leading-[1.15] mb-16 px-4 transition-colors ${resolvedTheme === "light" ? "text-slate-900" : "text-white"}`} style={lang === "km" ? { fontFamily: "var(--font-suwannaphum)", lineHeight: "1.4" } : {}}>
          {t[lang].useCasesTitle} <br />
          <span className="text-secondary">{t[lang].useCasesSubtitle}</span>
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
                <h4 className="text-3xl font-bold text-white mb-3" style={lang === "km" ? { fontFamily: "var(--font-suwannaphum)" } : {}}>
                  {t[lang].useCase1Title}
                </h4>
                <p className="text-muted text-sm max-w-[280px]" style={lang === "km" ? { fontFamily: "var(--font-suwannaphum)", lineHeight: "1.6" } : {}}>
                  {t[lang].useCase1Desc}
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
                <h4 className="text-2xl font-bold text-white mb-3" style={lang === "km" ? { fontFamily: "var(--font-suwannaphum)" } : {}}>
                  {t[lang].useCase2Title}
                </h4>
                <p className="text-muted text-sm max-w-[280px]" style={lang === "km" ? { fontFamily: "var(--font-suwannaphum)", lineHeight: "1.6" } : {}}>
                  {t[lang].useCase2Desc}
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
                <h4 className="text-2xl font-bold text-white mb-3" style={lang === "km" ? { fontFamily: "var(--font-suwannaphum)" } : {}}>
                  {t[lang].useCase3Title}
                </h4>
                <p className="text-muted text-sm max-w-[280px]" style={lang === "km" ? { fontFamily: "var(--font-suwannaphum)", lineHeight: "1.6" } : {}}>
                  {t[lang].useCase3Desc}
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
                <h4 className="text-2xl font-bold text-white mb-3" style={lang === "km" ? { fontFamily: "var(--font-suwannaphum)" } : {}}>
                  {t[lang].useCase4Title}
                </h4>
                <p className="text-muted text-sm max-w-[280px]" style={lang === "km" ? { fontFamily: "var(--font-suwannaphum)", lineHeight: "1.6" } : {}}>
                  {t[lang].useCase4Desc}
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
        className={`w-full py-24 px-4 sm:px-8 border-t transition-colors ${resolvedTheme === "light" ? "bg-slate-50/50 border-slate-200" : "bg-transparent border-dark-border"}`}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <span className="bg-brand-primary/10 text-brand-primary text-[11px] font-bold tracking-[0.08em] uppercase py-1.5 px-3 rounded-full border border-brand-primary/20 mb-4 inline-block" style={lang === "km" ? { fontFamily: "var(--font-suwannaphum)" } : {}}>
              {t[lang].pricing}
            </span>
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight mb-3 transition-colors ${resolvedTheme === "light" ? "text-slate-900" : "text-white"}`}>
              {t[lang].pricingTitle}
            </h2>
            <p className={`text-sm sm:text-base transition-colors ${resolvedTheme === "light" ? "text-slate-500" : "text-muted"}`}>
              {t[lang].pricingDesc}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {/* Basic */}
            <div className={`border rounded-[20px] transition-colors duration-200 hover:border-brand-primary/30 py-8 px-7 flex flex-col ${resolvedTheme === "light" ? "bg-white border-slate-200" : "bg-dark-surface border-dark-border"}`}>
              <p className={`text-[13px] font-semibold mb-4 transition-colors ${resolvedTheme === "light" ? "text-slate-400" : "text-muted"}`}>{t[lang].basicName}</p>
              <p className={`text-[40px] font-bold tracking-[-0.03em] mb-6 transition-colors ${resolvedTheme === "light" ? "text-slate-900" : "text-white"}`} style={lang === "km" ? { fontFamily: "var(--font-suwannaphum)" } : {}}>
                {t[lang].basicName}
              </p>
              <div className="flex-1 flex flex-col gap-3 mb-7">
                {t[lang].basicFeatures.map((f) => (
                  <div key={f} className="flex gap-2.5 items-start">
                    <div className="w-[5px] h-[5px] rounded-full bg-[#333] shrink-0 mt-[7px]"></div>
                    <span className="text-muted text-[13px]" style={lang === "km" ? { fontFamily: "var(--font-suwannaphum)" } : {}}>{f}</span>
                  </div>
                ))}
              </div>
              <button className={`w-full p-3 rounded-xl border font-semibold text-sm transition-colors ${resolvedTheme === "light" ? "border-slate-200 bg-slate-50 text-slate-900 hover:bg-slate-100" : "border-dark-border bg-dark-bg text-white hover:bg-dark-surface-hover"}`}>
                {t[lang].startFree}
              </button>
            </div>

            {/* Pro */}
            <div className={`border-2 border-brand-primary rounded-[20px] shadow-lg shadow-brand-primary/10 py-8 px-7 flex flex-col relative transform md:-translate-y-2 transition-colors ${resolvedTheme === "light" ? "bg-white" : "bg-dark-surface"}`}>
              <div className="flex justify-between items-center mb-4">
                <p className={`text-[13px] font-bold transition-colors ${resolvedTheme === "light" ? "text-slate-900" : "text-white"}`}>{t[lang].proName}</p>
                <span className="bg-brand-primary/10 text-brand-primary text-[10px] font-bold tracking-[0.1em] uppercase py-[3px] px-2 rounded-md border border-brand-primary/20">
                  {t[lang].popular}
                </span>
              </div>
              <div className={`mb-1 transition-colors ${resolvedTheme === "light" ? "text-slate-900" : "text-white"}`}>
                <span className="text-[40px] font-bold tracking-[-0.03em]">
                  $3
                </span>
                <span className={`text-sm ml-1 transition-colors ${resolvedTheme === "light" ? "text-slate-500" : "text-muted"}`}>{t[lang].month}</span>
              </div>
              <p className="text-xs text-brand-primary font-semibold mb-6">
                {t[lang].approxRiel}
              </p>
              <div className="flex-1 flex flex-col gap-3 mb-7">
                {t[lang].proFeatures.map((f) => (
                  <div key={f} className="flex gap-2.5 items-start">
                    <div className="w-[5px] h-[5px] rounded-full bg-brand-primary shrink-0 mt-[7px]"></div>
                    <span className={`font-medium text-[13px] transition-colors ${resolvedTheme === "light" ? "text-slate-700" : "text-white"}`} style={lang === "km" ? { fontFamily: "var(--font-suwannaphum)" } : {}}>
                      {f}
                    </span>
                  </div>
                ))}
              </div>
              <button className="bg-brand-primary text-white font-semibold py-[13px] px-7 rounded-xl transition-all duration-200 text-sm tracking-[-0.01em] hover:bg-brand-primary-hover hover:-translate-y-[1px] w-full shadow-sm">
                {t[lang].upgradePro}
              </button>
            </div>

            {/* Premium */}
            <div className={`border rounded-[20px] transition-colors duration-200 hover:border-brand-primary/30 py-8 px-7 flex flex-col ${resolvedTheme === "light" ? "bg-white border-slate-200" : "bg-dark-surface border-dark-border"}`}>
              <p className={`text-[13px] font-semibold mb-4 transition-colors ${resolvedTheme === "light" ? "text-slate-400" : "text-muted"}`}>
                {t[lang].premiumName}
              </p>
              <div className={`mb-6 transition-colors ${resolvedTheme === "light" ? "text-slate-900" : "text-white"}`}>
                <span className="text-[40px] font-bold tracking-[-0.03em]">
                  $7
                </span>
                <span className={`text-sm ml-1 transition-colors ${resolvedTheme === "light" ? "text-slate-500" : "text-muted"}`}>{t[lang].month}</span>
              </div>
              <div className="flex-1 flex flex-col gap-3 mb-7">
                {t[lang].premiumFeatures.map((f) => (
                  <div key={f} className="flex gap-2.5 items-start">
                    <div className="w-[5px] h-[5px] rounded-full bg-[#333] shrink-0 mt-[7px]"></div>
                    <span className="text-muted text-[13px]" style={lang === "km" ? { fontFamily: "var(--font-suwannaphum)" } : {}}>{f}</span>
                  </div>
                ))}
              </div>
              <button className={`w-full p-3 rounded-xl border font-semibold text-sm transition-colors ${resolvedTheme === "light" ? "border-slate-200 bg-slate-50 text-slate-900 hover:bg-slate-100" : "border-dark-border bg-dark-bg text-white hover:bg-dark-surface-hover"}`}>
                {t[lang].getPremium}
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className={`relative w-full mt-24 pt-16 pb-[18vw] sm:pb-[14vw] lg:pb-[12vw] px-4 sm:px-8 lg:px-12 border-t overflow-hidden transition-colors ${resolvedTheme === "light" ? "bg-slate-50 border-slate-200" : "bg-[#0d0d0d] border-dark-border"}`}>
        {/* Top Grid Section */}
        <div className="relative z-20 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand & Tagline */}
          <div className="flex flex-col">
            <h4 className={`text-xl font-bold mb-4 tracking-tight transition-colors ${resolvedTheme === "light" ? "text-slate-900" : "text-white"}`}>
              Psar<span className="text-brand-primary">Pulse</span>
            </h4>
            <p className={`text-sm leading-relaxed mb-6 max-w-xs transition-colors ${resolvedTheme === "light" ? "text-slate-500" : "text-gray-400"}`} style={lang === "km" ? { fontFamily: "var(--font-suwannaphum)", lineHeight: "1.6" } : {}}>
              {t[lang].footerTagline}
            </p>
            {/* Social Icons */}
            <div className="flex gap-4">
              <a
                href="#"
                className={`w-8 h-8 rounded-full border flex items-center justify-center hover:border-brand-primary hover:text-brand-primary transition-colors ${resolvedTheme === "light" ? "border-slate-200 text-slate-500" : "border-dark-border text-gray-400"}`}
              >
                <span className="text-xs font-bold">FB</span>
              </a>
              <a
                href="#"
                className={`w-8 h-8 rounded-full border flex items-center justify-center hover:border-brand-primary hover:text-brand-primary transition-colors ${resolvedTheme === "light" ? "border-slate-200 text-slate-500" : "border-dark-border text-gray-400"}`}
              >
                <span className="text-xs font-bold">TG</span>
              </a>
            </div>
          </div>

          {/* Links Column 1 */}
          <div className="flex flex-col">
            <h5 className={`text-sm font-semibold uppercase tracking-wider mb-6 transition-colors ${resolvedTheme === "light" ? "text-slate-900" : "text-white"}`} style={lang === "km" ? { fontFamily: "var(--font-suwannaphum)" } : {}}>
              {t[lang].footerProduct}
            </h5>
            <ul className={`flex flex-col gap-3 text-sm transition-colors ${resolvedTheme === "light" ? "text-slate-500" : "text-gray-400"}`}>
              <li>
                <a
                  href="#features"
                  className="hover:text-brand-primary transition-colors"
                  style={lang === "km" ? { fontFamily: "var(--font-suwannaphum)" } : {}}
                >
                  {t[lang].footerLinks.aiForecasting}
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  className="hover:text-brand-primary transition-colors"
                  style={lang === "km" ? { fontFamily: "var(--font-suwannaphum)" } : {}}
                >
                  {t[lang].footerLinks.salesAnalytics}
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  className="hover:text-brand-primary transition-colors"
                  style={lang === "km" ? { fontFamily: "var(--font-suwannaphum)" } : {}}
                >
                  {t[lang].footerLinks.payments}
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="hover:text-brand-primary transition-colors"
                  style={lang === "km" ? { fontFamily: "var(--font-suwannaphum)" } : {}}
                >
                  {t[lang].pricing}
                </a>
              </li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div className="flex flex-col">
            <h5 className={`text-sm font-semibold uppercase tracking-wider mb-6 transition-colors ${resolvedTheme === "light" ? "text-slate-900" : "text-white"}`} style={lang === "km" ? { fontFamily: "var(--font-suwannaphum)" } : {}}>
              {t[lang].footerCompany}
            </h5>
            <ul className={`flex flex-col gap-3 text-sm transition-colors ${resolvedTheme === "light" ? "text-slate-500" : "text-gray-400"}`}>
              <li>
                <a
                  href="#"
                  className="hover:text-brand-primary transition-colors"
                  style={lang === "km" ? { fontFamily: "var(--font-suwannaphum)" } : {}}
                >
                  {t[lang].aboutUs}
                </a>
              </li>
              <li>
                <a
                  href="#use-cases"
                  className="hover:text-brand-primary transition-colors"
                  style={lang === "km" ? { fontFamily: "var(--font-suwannaphum)" } : {}}
                >
                  {t[lang].useCases}
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="hover:text-brand-primary transition-colors"
                  style={lang === "km" ? { fontFamily: "var(--font-suwannaphum)" } : {}}
                >
                  {t[lang].contact}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-brand-primary transition-colors"
                  style={lang === "km" ? { fontFamily: "var(--font-suwannaphum)" } : {}}
                >
                  {t[lang].privacyPolicy}
                </a>
              </li>
            </ul>
          </div>

          {/* Status & Location */}
          <div className="flex flex-col">
            <h5 className="text-white text-sm font-semibold uppercase tracking-wider mb-6" style={lang === "km" ? { fontFamily: "var(--font-suwannaphum)" } : {}}>
              {t[lang].status}
            </h5>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 rounded-full bg-brand-primary animate-pulse shadow-[0_0_10px_rgba(41,178,141,0.6)]"></div>
              <span className="text-sm text-gray-300 font-medium" style={lang === "km" ? { fontFamily: "var(--font-suwannaphum)" } : {}}>
                {t[lang].systemsOperational}
              </span>
            </div>
            <p className="text-gray-500 text-xs uppercase tracking-widest mb-2" style={lang === "km" ? { fontFamily: "var(--font-suwannaphum)" } : {}}>
              {t[lang].basedIn}
            </p>
            <p className="text-sm text-gray-400 leading-relaxed" style={lang === "km" ? { fontFamily: "var(--font-suwannaphum)" } : {}}>
              {t[lang].location}
            </p>
          </div>
        </div>

        {/* Bottom Section: Copyright */}
        <div className="relative z-20 max-w-7xl mx-auto border-t border-dark-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4 mt-8">
          <p className="text-gray-500 text-xs sm:text-sm text-center md:text-left" style={lang === "km" ? { fontFamily: "var(--font-suwannaphum)" } : {}}>
            © {new Date().getFullYear()} PsarPulse KH. {t[lang].copyright}
          </p>
          <div className="flex gap-6 text-xs text-gray-500">
            <a href="#" className="hover:text-white transition-colors" style={lang === "km" ? { fontFamily: "var(--font-suwannaphum)" } : {}}>
              {t[lang].privacyPolicy}
            </a>
            <a href="#" className="hover:text-white transition-colors" style={lang === "km" ? { fontFamily: "var(--font-suwannaphum)" } : {}}>
              {t[lang].termsOfService}
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