"use client";

import React, { useEffect, useState } from "react";
import {
  Check,
  X,
  Sparkles,
  Crown,
  Zap,
  Shield,
  ArrowRight,
  Star,
} from "lucide-react";
import { authClient } from "@/lib/auth/utils/client-auth";

type PlanId = "free" | "pro" | "premium";

interface Feature {
  text: string;
  included: boolean;
}

interface Plan {
  id: PlanId;
  name: string;
  khmer: string;
  monthlyPrice: string;
  annualPrice: string;
  period: string;
  annualPeriod: string;
  description: string;
  icon: React.ElementType;
  popular?: boolean;
  features: Feature[];
}

const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    khmer: "ឥតគិតថ្លៃ",
    monthlyPrice: "$0",
    annualPrice: "$0",
    period: "/month",
    annualPeriod: "/year",
    description:
      "Essential tools to get your stall up and running with structured daily tracking.",
    icon: Shield,
    features: [
      { text: "Sales Logging — up to 500 entries/month", included: true },
      { text: "Manual Expense Tracking", included: true },
      { text: "Predefined Khmer Business Categories", included: true },
      { text: "3 Core Performance Charts", included: true },
      { text: "Daily Summary & End-of-Day Lock", included: true },
      { text: "Inventory Tracking — up to 20 items", included: true },
      { text: "Custom Expense Categories", included: false },
      { text: "Export Reports (PDF / Excel)", included: false },
      { text: "Public Map Listing", included: false },
      { text: "AI-Powered Features", included: false },
      { text: "AI Assistant (Gemini)", included: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    khmer: "ផែនការ Pro",
    monthlyPrice: "$3",
    annualPrice: "$30",
    period: "/month",
    annualPeriod: "/year",
    description:
      "Comprehensive analytics, full inventory control, and automated reporting for growing businesses.",
    icon: Crown,
    popular: true,
    features: [
      { text: "Everything in Free", included: true },
      { text: "Unlimited Transaction Logs", included: true },
      { text: "Advanced Analytics & Business Metrics", included: true },
      { text: "Inventory Management — up to 100 items", included: true },
      { text: "Custom Expense Categories", included: true },
      { text: "Export Reports (PDF & Excel)", included: true },
      { text: "Public Business Map Listing", included: true },
      { text: "AI-Generated Daily Business Summaries", included: true },
      { text: "AI Sales Forecaster", included: false },
      { text: "Weather Demand Intelligence", included: false },
      { text: "AI Assistant (Gemini)", included: false },
    ],
  },
  {
    id: "premium",
    name: "Premium",
    khmer: "ផែនការ Premium",
    monthlyPrice: "$7",
    annualPrice: "$70",
    period: "/month",
    annualPeriod: "/year",
    description:
      "Full-suite AI intelligence to forecast, optimize, and scale your market business.",
    icon: Sparkles,
    features: [
      { text: "Everything in Pro", included: true },
      { text: "Unlimited Inventory Items", included: true },
      { text: "AI Sales Forecaster & Break-Even Calculator", included: true },
      { text: "Weather-Driven Demand Intelligence", included: true },
      { text: "Smart Restock & Low-Stock Forecaster", included: true },
      { text: "AI Perishable Waste Reduction", included: true },
      { text: "AI Customer Segmentation (VIP / At-Risk)", included: true },
      { text: "AI Cost Optimization Recommendations", included: true },
      { text: "Gemini Weekly Business Intelligence Report", included: true },
      { text: "Smart Push Alerts & Sales Drop Notifications", included: true },
      { text: "Floating AI Business Assistant (Gemini)", included: true },
    ],
  },
];

const gradientTextStyle: React.CSSProperties = {
  background: "linear-gradient(to right, #29B28D, #6366f1, #a855f7)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};

const proGradientStyle: React.CSSProperties = {
  background: "linear-gradient(to right, #6366f1, #4f46e5)",
};

const premiumGradientStyle: React.CSSProperties = {
  background: "linear-gradient(to right, #a855f7, #d946ef, #a855f7)",
};

const premiumIconStyle: React.CSSProperties = {
  background: "linear-gradient(to right, #a855f7, #d946ef)",
};

import { useRouter } from "next/navigation";

export default function PricingPage() {
  const router = useRouter();
  const [currentPlan, setCurrentPlan] = useState<PlanId>("free");
  const [isAnnual, setIsAnnual] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState(true);

  useEffect(() => {
    let mounted = true;

    authClient
      .getProfile()
      .then((res: any) => {
        if (!mounted || !res?.success) return;

        const rawPlan = String(
          res?.data?.vendor?.plan?.name || "free",
        ).toLowerCase();
        if (rawPlan === "free" || rawPlan === "pro" || rawPlan === "premium") {
          setCurrentPlan(rawPlan);
        }
      })
      .catch(() => {
        // Keep default free plan when profile is unavailable.
      })
      .finally(() => {
        if (mounted) setLoadingPlan(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const visiblePlans = plans.filter((plan) => {
    if (currentPlan === "free") return true;
    if (currentPlan === "pro") return plan.id === "premium";
    return plan.id === "premium";
  });

  const canUpgrade = (planId: PlanId) => {
    if (currentPlan === "free") return planId === "pro" || planId === "premium";
    if (currentPlan === "pro") return planId === "premium";
    return false;
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-4 bg-[#29B28D]/10 text-[#29B28D]">
            <Zap className="w-4 h-4" />
            Simple, transparent pricing for every stage
          </div>
          <h2 className="text-4xl font-bold text-slate-900 mb-3">
            Scale Your Business with{" "}
            <span style={gradientTextStyle}>PsarPulse</span>
          </h2>
          <p className="text-slate-500 text-base max-w-xl mx-auto leading-relaxed">
            Start free and upgrade as your business grows. Every plan is built
            for Cambodian market vendors - no complexity, no hidden costs.
          </p>

          <p className="mt-3 text-sm font-semibold text-slate-600">
            {loadingPlan
              ? "Checking your current plan..."
              : `Current plan: ${currentPlan.toUpperCase()}`}
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <span
              className={`text-sm font-semibold ${!isAnnual ? "text-slate-900" : "text-slate-400"}`}
            >
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative w-14 h-7 rounded-full transition-colors duration-300"
              style={{ backgroundColor: isAnnual ? "#29B28D" : "#e2e8f0" }}
            >
              <div
                className="absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300"
                style={{
                  transform: isAnnual ? "translateX(28px)" : "translateX(2px)",
                }}
              />
            </button>
            <span
              className={`text-sm font-semibold ${isAnnual ? "text-slate-900" : "text-slate-400"}`}
            >
              Annual
              <span className="ml-1.5 text-xs font-bold px-2 py-0.5 rounded-full bg-[#29B28D]/10 text-[#29B28D]">
                Save 17%
              </span>
            </span>
          </div>
        </div>

        {/* Plan Cards */}
        <div 
          className={`grid grid-cols-1 gap-6 mb-12 ${
            visiblePlans.length === 1 
              ? 'max-w-md mx-auto' 
              : 'md:grid-cols-3'
          }`}
        >
          {visiblePlans.map((plan) => {
            const isCurrentPlan = currentPlan === plan.id;
            const Icon = plan.icon;
            const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
            const period = isAnnual ? plan.annualPeriod : plan.period;

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl border-2 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                  plan.id === "premium"
                    ? "border-purple-300 shadow-lg shadow-purple-100"
                    : plan.id === "pro"
                      ? "border-indigo-300 shadow-lg shadow-indigo-100"
                      : "border-slate-200 bg-white shadow-sm"
                }`}
                style={
                  plan.id === "premium"
                    ? {
                        background:
                          "linear-gradient(to bottom, rgba(250,245,255,0.5), white)",
                      }
                    : plan.id === "pro"
                      ? {
                          background:
                            "linear-gradient(to bottom, rgba(238,242,255,0.3), white)",
                        }
                      : undefined
                }
              >
                {plan.popular && (
                  <div
                    className="absolute top-0 left-0 right-0 text-white text-center py-1.5 text-xs font-bold tracking-wide uppercase"
                    style={proGradientStyle}
                  >
                    <Star className="w-3 h-3 inline mr-1 -mt-0.5" />
                    Most Popular
                  </div>
                )}
                {plan.id === "premium" && (
                  <div
                    className="absolute top-0 left-0 right-0 text-white text-center py-1.5 text-xs font-bold tracking-wide uppercase"
                    style={premiumGradientStyle}
                  >
                    <Sparkles className="w-3 h-3 inline mr-1 -mt-0.5" />
                    AI-Powered
                  </div>
                )}

                <div
                  className={`p-6 ${plan.popular || plan.id === "premium" ? "pt-12" : "pt-6"}`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-white"
                      style={
                        plan.id === "premium"
                          ? premiumIconStyle
                          : plan.id === "pro"
                            ? { backgroundColor: "#6366f1" }
                            : { backgroundColor: "#f1f5f9", color: "#64748b" }
                      }
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        {plan.name}
                      </h3>
                      <p className="text-xs text-slate-400">{plan.khmer}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-bold text-slate-900 leading-none">
                        {price}
                      </span>
                      <span className="text-sm text-slate-400 font-medium">
                        {period}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                      {plan.description}
                    </p>
                  </div>

                  {isCurrentPlan ? (
                    <div className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl border-2 font-bold text-sm mb-6 border-[#29B28D] text-[#29B28D]">
                      <Check className="w-5 h-5" />
                      Current Plan
                    </div>
                  ) : (
                    <button
                      disabled={!canUpgrade(plan.id)}
                      onClick={() =>
                        router.push(
                          `/vendor/pricing/checkout?plan=${plan.id}&billing=${isAnnual ? "annual" : "monthly"}`,
                        )
                      }
                      className={`w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-bold text-sm transition-all mb-6 text-white ${
                        !canUpgrade(plan.id)
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      style={
                        plan.id === "premium"
                          ? {
                              background:
                                "linear-gradient(to right, #a855f7, #d946ef)",
                              boxShadow:
                                "0 10px 15px -3px rgba(168,85,247,0.2)",
                            }
                          : plan.id === "pro"
                            ? {
                                backgroundColor: "#6366f1",
                                boxShadow:
                                  "0 10px 15px -3px rgba(99,102,241,0.2)",
                              }
                            : { backgroundColor: "#0f172a" }
                      }
                    >
                      Upgrade to {plan.name}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}

                  <div className="border-t border-slate-100 pt-5 mb-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                      Features included
                    </p>
                  </div>

                  <div className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        {feature.included ? (
                          <div
                            className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                            style={
                              plan.id === "premium"
                                ? {
                                    backgroundColor: "#f3e8ff",
                                    color: "#9333ea",
                                  }
                                : plan.id === "pro"
                                  ? {
                                      backgroundColor: "#e0e7ff",
                                      color: "#4f46e5",
                                    }
                                  : {
                                      backgroundColor: "rgba(41,178,141,0.1)",
                                      color: "#29B28D",
                                    }
                            }
                          >
                            <Check className="w-3 h-3" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                            <X className="w-3 h-3 text-slate-300" />
                          </div>
                        )}
                        <span
                          className={`text-sm font-medium ${feature.included ? "text-slate-700" : "text-slate-400"}`}
                        >
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

        {/* Footer note */}
        <div className="text-center pb-8">
          <div className="flex items-center justify-center gap-4 text-sm text-slate-400 font-medium flex-wrap">
            <Shield className="w-4 h-4 text-[#29B28D]" />
            <span>Payments secured via ABA PayWay & KHQR</span>
            <span>·</span>
            <span>Cancel or change plan anytime</span>
            <span>·</span>
            <span>No hidden fees, ever</span>
          </div>
        </div>
      </div>
    </div>
  );
}
