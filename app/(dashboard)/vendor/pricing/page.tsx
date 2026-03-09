"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  CircleDollarSign,
  Receipt,
  Users,
  Settings,
  Menu,
  X,
  Bell,
  Check,
  X as XIcon,
  Sparkles,
  Crown,
  Zap,
  Shield,
  ArrowRight,
  Star,
  Package,
  Download,
  MapPin,
  Brain,
  CloudSun,
  MessageSquare,
  Megaphone,
  BellRing,
  TrendingUp,
  BarChart3,
  Calculator,
} from "lucide-react";

export default function PricingPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<"free" | "pro" | "premium">("free");
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      id: "free" as const,
      name: "Free",
      khmer: "ឥតគិតថ្លៃ",
      price: "$0",
      period: "/month",
      description: "Perfect for getting started with basic sales tracking",
      color: "slate",
      icon: Shield,
      features: [
        { text: "Basic Sales Logging", included: true },
        { text: "500 Logs/Month Cap", included: true },
        { text: "Manual Expense Tracking", included: true },
        { text: "Predefined Khmer Categories", included: true },
        { text: "3 Simple Charts (Weekly, Monthly, Expenses)", included: true },
        { text: "End-of-Day Summary & Lock", included: true },
        { text: "Custom Expense Categories", included: false },
        { text: "Export to PDF/Excel", included: false },
        { text: "Inventory Management", included: false },
        { text: "AI Features", included: false },
        { text: "Public Map Visibility", included: false },
      ],
    },
    {
      id: "pro" as const,
      name: "Pro",
      khmer: "ផែនការ Pro",
      price: isAnnual ? "$30" : "$3",
      period: isAnnual ? "/year" : "/month",
      description: "Unlock unlimited data & robust management tools",
      color: "indigo",
      icon: Crown,
      popular: true,
      features: [
        { text: "Everything in Free", included: true },
        { text: "Unlimited Transaction Logs", included: true },
        { text: "Advanced Analytics & Metrics", included: true },
        { text: "Best-Selling Products Tracking", included: true },
        { text: "Inventory Management System", included: true },
        { text: "Custom Expense Categories", included: true },
        { text: "Export to PDF & Excel", included: true },
        { text: "Public Discovery Map", included: true },
        { text: "AI-Generated Daily Summaries", included: true },
        { text: "AI Sales Forecaster", included: false },
        { text: "Weather Intelligence", included: false },
        { text: "AI Marketing & Chatbot", included: false },
      ],
    },
    {
      id: "premium" as const,
      name: "Premium",
      khmer: "ផែនការ Premium",
      price: isAnnual ? "$70" : "$7",
      period: isAnnual ? "/year" : "/month",
      description: "AI-powered business assistant with Gemini",
      color: "purple",
      icon: Sparkles,
      features: [
        { text: "Everything in Pro", included: true },
        { text: "AI Sales Forecaster", included: true },
        { text: "Break-Even Calculator", included: true },
        { text: "Weather Correlation Intelligence", included: true },
        { text: "Smart Product Suggestions", included: true },
        { text: "Automated Marketing Hub", included: true },
        { text: "Facebook Post Generator (Khmer)", included: true },
        { text: "AI Chatbot Assistant", included: true },
        { text: "Smart Push Notifications", included: true },
        { text: "Loss & Sales Drop Alerts", included: true },
        { text: "Priority Support", included: true },
      ],
    },
  ];

  const handlePlanSelect = (planId: "free" | "pro" | "premium") => {
    setCurrentPlan(planId);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900 selection:bg-[#29B28D] selection:text-white">
      {/* --- SIDEBAR --- */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out flex flex-col ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="px-6 py-5 flex items-center justify-between border-b border-slate-100">
          <Link href="/vendor" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#29B28D] flex items-center justify-center font-bold text-white shadow-sm">
              P
            </div>
            <span className="font-bold text-[19px] tracking-tight">
              PsarPulse KH
            </span>
          </Link>
          <button
            className="lg:hidden text-slate-400"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-1.5">
          <NavItem
            icon={LayoutDashboard}
            title="Dashboard"
            khmerTitle="ផ្ទាំងគ្រប់គ្រង"
          />
          <NavItem icon={CircleDollarSign} title="Sales" khmerTitle="ការលក់" />
          <NavItem icon={Receipt} title="Expenses" khmerTitle="ចំណាយ" />
          <NavItem icon={Users} title="Customers" khmerTitle="អតិថិជន" />
        </nav>

        <div className="p-4 border-t border-slate-100">
          <NavItem icon={Settings} title="Settings" khmerTitle="ការកំណត់" />
          {currentPlan === "free" && (
            <div className="mt-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm text-slate-700">Free Plan</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ឥតគិតថ្លៃ</span>
              </div>
              <Link
                href="/vendor/pricing"
                className="block w-full text-center text-[13px] font-bold text-[#29B28D] hover:text-[#239979] bg-[#29B28D]/10 hover:bg-[#29B28D]/15 py-2 rounded-lg transition-colors"
              >
                Upgrade Plan ↗
              </Link>
            </div>
          )}
          {currentPlan === "pro" && (
            <div className="mt-3 p-3.5 bg-indigo-50 rounded-xl border border-indigo-200">
              <div className="flex items-center gap-1.5 mb-1">
                <Crown className="w-4 h-4 text-indigo-500" />
                <span className="font-semibold text-sm text-indigo-700">Pro Plan</span>
              </div>
              <p className="text-xs text-indigo-400">$3/month · Unlimited</p>
            </div>
          )}
          {currentPlan === "premium" && (
            <div className="mt-3 p-3.5 bg-slate-900 rounded-xl text-white">
              <div className="flex items-center gap-1.5 mb-1">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="font-semibold text-sm">Premium Plan</span>
              </div>
              <p className="text-xs text-slate-400">AI Assistant Active</p>
            </div>
          )}
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col w-full min-w-0">
        <header className="bg-white border-b border-slate-200 px-6 md:px-8 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden text-slate-500 hover:text-slate-900"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-[22px] font-bold text-slate-900">Plans & Pricing</h1>
              <p className="text-[12px] font-khmer text-slate-500">ផែនការ និង តម្លៃ</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors relative">
              <Bell className="w-5 h-5" />
            </button>
            <div className="w-9 h-9 rounded-full bg-[#29B28D]/10 flex items-center justify-center text-[#29B28D] font-bold border border-[#29B28D] text-sm shadow-sm">
              SM
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#29B28D]/10 text-[#29B28D] rounded-full text-sm font-bold mb-4">
                <Zap className="w-4 h-4" />
                Choose the right plan for your business
              </div>
              <h2 className="text-[32px] md:text-[40px] font-bold text-slate-900 leading-tight mb-3">
                Grow Your Stall with
                <span className="bg-gradient-to-r from-[#29B28D] via-indigo-500 to-purple-500 bg-clip-text text-transparent"> PsarPulse</span>
              </h2>
              <p className="text-slate-500 text-[16px] max-w-xl mx-auto leading-relaxed">
                From basic logging to AI-powered insights — pick the plan that matches your needs. Upgrade or downgrade anytime.
              </p>

              {/* Billing Toggle */}
              <div className="flex items-center justify-center gap-3 mt-6">
                <span className={`text-sm font-semibold ${!isAnnual ? "text-slate-900" : "text-slate-400"}`}>Monthly</span>
                <button
                  onClick={() => setIsAnnual(!isAnnual)}
                  className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${isAnnual ? "bg-[#29B28D]" : "bg-slate-200"}`}
                >
                  <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${isAnnual ? "translate-x-7.5" : "translate-x-0.5"}`}></div>
                </button>
                <span className={`text-sm font-semibold ${isAnnual ? "text-slate-900" : "text-slate-400"}`}>
                  Annual
                  <span className="ml-1.5 text-[11px] font-bold text-[#29B28D] bg-[#29B28D]/10 px-2 py-0.5 rounded-full">Save 17%</span>
                </span>
              </div>
            </div>

            {/* Plan Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {plans.map((plan) => {
                const isCurrentPlan = currentPlan === plan.id;
                const Icon = plan.icon;

                return (
                  <div
                    key={plan.id}
                    className={`relative rounded-2xl border-2 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                      plan.id === "premium"
                        ? "border-purple-300 bg-gradient-to-b from-purple-50/50 to-white shadow-lg shadow-purple-100"
                        : plan.id === "pro"
                        ? "border-indigo-300 bg-gradient-to-b from-indigo-50/30 to-white shadow-lg shadow-indigo-100"
                        : "border-slate-200 bg-white shadow-sm"
                    }`}
                  >
                    {/* Popular Badge */}
                    {plan.popular && (
                      <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-center py-1.5 text-[12px] font-bold tracking-wide uppercase">
                        <Star className="w-3 h-3 inline mr-1 -mt-0.5" />
                        Most Popular
                      </div>
                    )}
                    {plan.id === "premium" && (
                      <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-purple-600 text-white text-center py-1.5 text-[12px] font-bold tracking-wide uppercase">
                        <Sparkles className="w-3 h-3 inline mr-1 -mt-0.5" />
                        AI-Powered
                      </div>
                    )}

                    <div className={`p-6 ${plan.popular || plan.id === "premium" ? "pt-12" : "pt-6"}`}>
                      {/* Plan Header */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                          plan.id === "premium" ? "bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white" :
                          plan.id === "pro" ? "bg-indigo-500 text-white" :
                          "bg-slate-100 text-slate-500"
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-[19px] font-bold text-slate-900">{plan.name}</h3>
                          <p className="text-[11px] font-khmer text-slate-400">{plan.khmer}</p>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="mb-4">
                        <div className="flex items-baseline gap-1">
                          <span className="text-[42px] font-bold text-slate-900 leading-none">{plan.price}</span>
                          <span className="text-[15px] text-slate-400 font-medium">{plan.period}</span>
                        </div>
                        <p className="text-[13px] text-slate-500 mt-2 leading-relaxed">{plan.description}</p>
                      </div>

                      {/* CTA Button */}
                      {isCurrentPlan ? (
                        <div className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl border-2 border-[#29B28D] text-[#29B28D] font-bold text-[15px] mb-6 min-h-[52px]">
                          <Check className="w-5 h-5" />
                          Current Plan
                        </div>
                      ) : (
                        <button
                          onClick={() => handlePlanSelect(plan.id)}
                          className={`w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-bold text-[15px] transition-all mb-6 min-h-[52px] ${
                            plan.id === "premium"
                              ? "bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600 text-white shadow-lg shadow-purple-200"
                              : plan.id === "pro"
                              ? "bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                              : "bg-slate-900 hover:bg-slate-800 text-white"
                          }`}
                        >
                          {currentPlan === "free" && plan.id !== "free" ? "Upgrade" : "Switch"} to {plan.name}
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      )}

                      {/* Divider */}
                      <div className="border-t border-slate-100 pt-5 mb-1">
                        <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-4">What&apos;s included</p>
                      </div>

                      {/* Features List */}
                      <div className="space-y-3">
                        {plan.features.map((feature, i) => (
                          <div key={i} className="flex items-start gap-3">
                            {feature.included ? (
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                                plan.id === "premium" ? "bg-purple-100 text-purple-600" :
                                plan.id === "pro" ? "bg-indigo-100 text-indigo-600" :
                                "bg-[#29B28D]/10 text-[#29B28D]"
                              }`}>
                                <Check className="w-3 h-3" />
                              </div>
                            ) : (
                              <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <X className="w-3 h-3 text-slate-300" />
                              </div>
                            )}
                            <span className={`text-[13px] font-medium ${feature.included ? "text-slate-700" : "text-slate-400"}`}>
                              {feature.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Feature Comparison Table */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-10">
              <div className="px-6 py-5 border-b border-slate-100">
                <h3 className="font-bold text-[19px] text-slate-900">Full Feature Comparison</h3>
                <p className="text-[12px] font-khmer text-slate-500 mt-0.5">ការប្រៀបធៀបមុខងារពេញលេញ</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-[13px] text-slate-500 uppercase tracking-wider font-semibold">
                      <th className="px-6 py-4">Feature</th>
                      <th className="px-6 py-4 text-center">Free</th>
                      <th className="px-6 py-4 text-center">
                        <span className="text-indigo-600">Pro</span>
                      </th>
                      <th className="px-6 py-4 text-center">
                        <span className="text-purple-600">Premium</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { feature: "Sales Logging", free: "500/mo", pro: "Unlimited", premium: "Unlimited" },
                      { feature: "Expense Categories", free: "Predefined", pro: "Custom", premium: "Custom + AI" },
                      { feature: "Analytics Charts", free: "3 Basic", pro: "Advanced", premium: "AI-Powered" },
                      { feature: "Inventory Management", free: false, pro: true, premium: true },
                      { feature: "Export (PDF/Excel)", free: false, pro: true, premium: true },
                      { feature: "Public Map Visibility", free: false, pro: true, premium: true },
                      { feature: "AI Daily Summaries", free: false, pro: true, premium: true },
                      { feature: "Sales Forecaster", free: false, pro: false, premium: true },
                      { feature: "Weather Intelligence", free: false, pro: false, premium: true },
                      { feature: "Marketing Hub", free: false, pro: false, premium: true },
                      { feature: "AI Chatbot", free: false, pro: false, premium: true },
                      { feature: "Smart Notifications", free: false, pro: false, premium: true },
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 text-[14px] font-medium text-slate-700">{row.feature}</td>
                        <td className="px-6 py-4 text-center">
                          {typeof row.free === "boolean" ? (
                            row.free ? (
                              <Check className="w-5 h-5 text-[#29B28D] mx-auto" />
                            ) : (
                              <X className="w-5 h-5 text-slate-300 mx-auto" />
                            )
                          ) : (
                            <span className="text-[13px] font-semibold text-slate-500">{row.free}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {typeof row.pro === "boolean" ? (
                            row.pro ? (
                              <Check className="w-5 h-5 text-indigo-500 mx-auto" />
                            ) : (
                              <X className="w-5 h-5 text-slate-300 mx-auto" />
                            )
                          ) : (
                            <span className="text-[13px] font-semibold text-indigo-600">{row.pro}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {typeof row.premium === "boolean" ? (
                            row.premium ? (
                              <Check className="w-5 h-5 text-purple-500 mx-auto" />
                            ) : (
                              <X className="w-5 h-5 text-slate-300 mx-auto" />
                            )
                          ) : (
                            <span className="text-[13px] font-semibold text-purple-600">{row.premium}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="text-center pb-8">
              <div className="flex items-center justify-center gap-4 text-[13px] text-slate-400 font-medium">
                <Shield className="w-4 h-4 text-[#29B28D]" />
                <span>Secure payments via ABA PayWay & KHQR</span>
                <span>·</span>
                <span>Cancel anytime</span>
                <span>·</span>
                <span>No hidden fees</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function NavItem({
  icon: Icon,
  title,
  khmerTitle,
  active = false,
}: {
  icon: any;
  title: string;
  khmerTitle: string;
  active?: boolean;
}) {
  const hrefMap: Record<string, string> = {
    Dashboard: "/vendor",
    Sales: "/vendor/sales",
    Expenses: "/vendor/expenses",
    Customers: "/vendor/customer",
    Settings: "/vendor/settings",
  };

  return (
    <Link
      href={hrefMap[title] || "#"}
      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-colors min-h-[48px] ${
        active
          ? "bg-[#29B28D]/10 text-[#29B28D]"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon
          className={`w-4 h-4 ${active ? "text-[#29B28D]" : "text-slate-400"}`}
        />
        <span
          className={`text-[15px] ${active ? "font-semibold" : "font-medium"}`}
        >
          {title}
        </span>
      </div>
      <span className="text-[11px] font-khmer opacity-60">{khmerTitle}</span>
    </Link>
  );
}
