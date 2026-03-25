"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Shield,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Lock,
  Loader2,
  ShieldCheck,
  HelpCircle,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { authClient } from "@/lib/auth/utils/client-auth";
// import Image from "next/image"; // Uncomment if using next/image for bank icons

// ─── TYPES ───────────────────────────────────────────────────────────────────

type PlanId = "pro" | "premium";
type PaymentMethod = "aba" | "acleda" | "bakong";
type CheckoutStep = "selection" | "details" | "success";

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planParam = searchParams.get("plan") as PlanId;
  const billingParam = searchParams.get("billing") || "monthly";

  const [step, setStep] = useState<CheckoutStep>("selection");
  const [method, setMethod] = useState<PaymentMethod>("aba");
  const [email, setEmail] = useState("");
  const [qrString, setQrString] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "creating" | "waiting" | "completed" | "failed"
  >("idle");
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Graceful error handling in case authClient isn't ready
    try {
      authClient.getProfile().then((res: any) => {
        if (res?.success && res?.data?.user) {
          setEmail(res.data.user.email);
        }
      });
    } catch (e) {
      console.error("Failed to fetch profile email:", e);
    }
  }, []);

  const planInfo = {
    pro: {
      name: "Pro",
      price: billingParam === "annual" ? "$30.00" : "$0.01",
      period: billingParam === "annual" ? "year" : "month",
      features: [
        "Standard listings",
        "Basic analytics",
        "Email support",
        "Custom domain",
      ],
    },
    premium: {
      name: "Premium",
      price: billingParam === "annual" ? "$70.00" : "$0.02",
      period: billingParam === "annual" ? "year" : "month",
      features: [
        "Unlimited listings",
        "Priority placement",
        "Advanced analytics",
        "24/7 Premium support",
      ],
    },
  }[planParam || "pro"];

  const planId = planParam || "pro";

  const startPayment = async (selectedMethod: PaymentMethod) => {
    setMethod(selectedMethod);
    setStep("details");
    setPaymentError(null);
    setPaymentStatus("creating");
    setQrString(null);
    setTransactionId(null);

    try {
      const res = await fetch("/api/bakong/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId,
          billingCycle: billingParam === "annual" ? "annual" : "monthly",
          method: selectedMethod,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data?.qrString || !data?.transactionId) {
        throw new Error(data?.error || "Unable to generate payment QR");
      }

      setQrString(data.qrString);
      setTransactionId(data.transactionId);
      setPaymentStatus("waiting");
    } catch (error) {
      setPaymentStatus("failed");
      setPaymentError(
        error instanceof Error ? error.message : "Failed to start payment",
      );
    }
  };

  useEffect(() => {
    if (step !== "details" || !transactionId || paymentStatus !== "waiting") {
      return;
    }

    const intervalId = setInterval(async () => {
      try {
        const res = await fetch(
          `/api/bakong/status?transactionId=${encodeURIComponent(transactionId)}`,
          { cache: "no-store" },
        );

        if (!res.ok) {
          return;
        }

        const data = await res.json();
        if (data?.status === "completed") {
          setPaymentStatus("completed");
          setStep("success");
          setIsRedirecting(true);

          setTimeout(() => {
            window.location.href =
              planId === "premium" ? "/vendor/premium" : "/vendor/pro";
          }, 1800);
        } else if (data?.status === "failed") {
          setPaymentStatus("failed");
          setPaymentError("Payment failed. Please try again.");
        }
      } catch {
        // Keep polling on transient network failures.
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, [step, transactionId, paymentStatus, router, planId]);

  const getMethodDetails = (m: PaymentMethod) => {
    switch (m) {
      case "aba":
        return { name: "ABA", color: "#005e82", icon: "/images/banks/aba.png" };
      case "acleda":
        return {
          name: "ACLEDA",
          color: "#0c3b6f",
          icon: "/images/banks/acleda.png",
        };
      case "bakong":
        return {
          name: "BAKONG",
          color: "#e3000f",
          icon: "/images/banks/bakong.png",
        };
    }
  };

  const activeMethod = getMethodDetails(method);

  // ─── STEP 3: SUCCESS ──────────────────────────────────────────────────────
  if (step === "success") {
    return (
      <div className="min-h-screen bg-[#f2f4f5] flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden p-10 text-center animate-in fade-in zoom-in duration-300">
          <div className="w-20 h-20 bg-[#00b06f]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="text-[#00b06f]" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Payment Successful
          </h2>
          <p className="text-slate-500 text-sm mb-8">
            You are now subscribed to PsarPulse {planInfo.name}. Redirecting to
            your dashboard...
          </p>
          <button
            onClick={() => {
              window.location.href =
                planParam === "premium" ? "/vendor/premium" : "/vendor/pro";
            }}
            className="w-full py-3.5 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors"
          >
            {isRedirecting ? "Redirecting..." : "Return to Dashboard"}
          </button>
        </div>
      </div>
    );
  }

  // ─── STEP 1: SELECTION ────────────────────────────────────────────────────
  if (step === "selection") {
    return (
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
        {/* Simple, Professional Header */}
        <header className="w-full bg-white border-b border-slate-200 py-4 px-6 sm:px-8 flex justify-between items-center">
          <div className="font-black text-xl tracking-tight text-slate-900">
            PsarPulse<span className="text-blue-600">.</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
            <Lock size={16} />
            <span>Secure Checkout</span>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow flex items-center justify-center p-6 sm:p-12">
          <div className="max-w-5xl w-full mx-auto flex flex-col lg:flex-row gap-12 lg:gap-24">
            {/* Left Column: Summary & Value Reinforcement */}
            <div className="lg:w-[45%] flex flex-col justify-center">
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-8 text-slate-900">
                Complete your purchase
              </h1>

              {/* Order Summary Card */}
              <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                <div className="flex items-center justify-between mb-8 pb-8 border-b border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 rounded-2xl">
                      <Shield
                        className="w-8 h-8 text-blue-600"
                        fill="currentColor"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-black text-2xl leading-none">
                        {planInfo.name}
                      </span>
                      <span className="text-xs font-bold text-slate-400 uppercase mt-1.5 tracking-widest">
                        Plan
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className="font-black text-3xl text-slate-900"
                      suppressHydrationWarning
                    >
                      {planInfo.price}
                    </p>
                    <p className="text-sm font-bold text-slate-400 capitalize">
                      per {planInfo.period}
                    </p>
                  </div>
                </div>

                {/* Feature List */}
                <div className="space-y-4 mb-8">
                  <p className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-wide">
                    What's included
                  </p>
                  {planInfo.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                      <span className="text-slate-600 font-medium">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center gap-6 mt-8 text-slate-500 text-sm font-medium">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  <span>256-bit Encryption</span>
                </div>
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-slate-400" />
                  <span>
                    Need help?{" "}
                    <span className="text-blue-600 hover:underline cursor-pointer">
                      Contact Support
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Payment Selection */}
            <div className="lg:w-[55%] flex flex-col justify-center">
              <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-xl shadow-slate-200/20">
                <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">
                  Select payment method
                </h3>
                <p className="text-slate-500 mb-8 font-medium">
                  Choose how you would like to pay for your subscription.
                </p>

                <div className="space-y-4">
                  {(["aba", "acleda", "bakong"] as PaymentMethod[]).map((m) => {
                    const details = getMethodDetails(m);
                    return (
                      <button
                        key={m}
                        onClick={() => startPayment(m)}
                        className="group w-full bg-white hover:bg-slate-50 transition-all duration-200 rounded-2xl flex items-center justify-between p-4 border-2 border-slate-200 hover:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/10 active:scale-[0.99]"
                      >
                        <div className="flex items-center gap-5">
                          <div className="w-16 h-12 bg-white rounded-xl flex items-center justify-center p-2 border border-slate-200 shadow-sm relative overflow-hidden shrink-0 group-hover:border-blue-200 transition-colors">
                            <img
                              src={details.icon}
                              alt={details.name}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                                e.currentTarget.parentElement!.innerHTML = `<span class="text-xs font-bold text-slate-400">${details.name}</span>`;
                              }}
                            />
                          </div>
                          <span className="font-bold text-lg text-slate-800">
                            {details.name} KHQR
                          </span>
                        </div>

                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-10 pt-6 border-t border-slate-100">
                  <p className="text-xs text-slate-500 leading-relaxed font-medium text-center">
                    By proceeding, you agree to our{" "}
                    <span className="font-bold text-slate-900 hover:text-blue-600 cursor-pointer transition-colors">
                      Terms of Service
                    </span>{" "}
                    and acknowledge our{" "}
                    <span className="font-bold text-slate-900 hover:text-blue-600 cursor-pointer transition-colors">
                      Privacy Policy
                    </span>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ─── STEP 2: DETAILS (ROBLOX SPLIT SCREEN) ────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#ffffff] font-sans">
      {/* Left Panel: Dark */}
      <div className="w-full md:w-1/2 bg-[#222222] text-white flex items-center justify-center p-10 lg:p-20 relative shrink-0">
        <div className="max-w-[320px] w-full flex flex-col min-h-[500px]">
          <button
            onClick={() => setStep("selection")}
            className="flex items-center gap-1 group mb-2 -ml-6"
          >
            <ChevronLeft
              size={24}
              className="text-white opacity-40 group-hover:opacity-100 transition-opacity"
            />
            <span className="text-3xl font-black tracking-tighter uppercase italic">
              PsarPulse
            </span>
          </button>

          <div className="mt-8 mb-4">
            <p className="text-white/60 text-sm font-medium mb-1">
              Subscribe to PsarPulse {planInfo.name}
            </p>
            <div className="flex items-baseline gap-1">
              <span
                className="text-5xl font-bold tracking-tight"
                suppressHydrationWarning
              >
                {planInfo.price}
              </span>
              <div className="flex flex-col ml-1">
                <span className="text-white/60 text-[10px] font-bold leading-none">
                  per
                </span>
                <span className="text-white/60 text-[10px] font-bold leading-none">
                  {planInfo.period}
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center py-20">
            <div className="w-32 h-32 lg:w-40 lg:h-40 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10 shadow-2xl backdrop-blur-sm">
              <Shield
                className="w-16 h-16 lg:w-20 lg:h-20 text-white/90"
                fill="currentColor"
                strokeWidth={0}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: White Payment Details */}
      <div className="flex-1 min-h-screen bg-white flex items-center justify-center p-10 lg:p-20 overflow-y-auto">
        <div className="w-full max-w-[420px] flex flex-col min-h-[600px]">
          <h2 className="text-2xl font-bold mb-10 text-[#2b2d2f]">
            Payment method
          </h2>

          <div className="space-y-6 flex-1">
            {/* Payment Method Card WITH QR CODE */}
            <div className="border border-slate-200 rounded-lg overflow-hidden shadow-sm bg-white flex flex-col">
              <div className="p-4 flex items-center justify-between border-b border-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-slate-900 rounded-sm flex items-center justify-center">
                    <Lock
                      className="w-2.5 h-2.5 text-white"
                      fill="currentColor"
                    />
                  </div>
                  <span className="font-bold text-[#2b2d2f] text-sm">
                    Scan to Pay
                  </span>
                </div>
              </div>

              <div className="py-8 bg-slate-50/50 flex flex-col items-center border-b border-slate-50">
                {paymentStatus === "creating" && (
                  <div className="flex flex-col items-center gap-4 py-6">
                    <Loader2
                      className="animate-spin text-slate-500"
                      size={30}
                    />
                    <p className="text-xs text-slate-500 font-medium">
                      Generating secure KHQR...
                    </p>
                  </div>
                )}

                {paymentStatus !== "creating" && qrString && (
                  <>
                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                      <QRCodeSVG
                        value={qrString}
                        size={220}
                        level="H"
                        fgColor={activeMethod.color}
                        bgColor="#FFFFFF"
                        marginSize={2}
                        imageSettings={{
                          src: activeMethod.icon,
                          height: 36,
                          width: 36,
                          excavate: true,
                        }}
                      />
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-4 text-center px-4">
                      Open your {activeMethod.name} app to scan and pay.
                    </p>
                    
                    {/* SIMULATION BUTTON FOR LOCAL DEVELOPMENT */}
                    {process.env.NODE_ENV === "development" && (
                      <button
                        onClick={async () => {
                          try {
                            // Simulate Bakong Webhook
                            await fetch("/api/bakong/webhook", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                transactionId: transactionId,
                                status: "SUCCESS"
                              }),
                            });
                          } catch (e) {
                            console.error("Simulation failed:", e);
                          }
                        }}
                        className="mt-4 w-[220px] py-2 bg-purple-100 text-purple-700 hover:bg-purple-200 border border-purple-200 hover:border-purple-300 rounded-lg text-xs font-bold transition-colors"
                      >
                        [DEV] Simulate Payment Success
                      </button>
                    )}
                  </>
                )}

                {paymentStatus === "failed" && (
                  <p className="text-xs text-red-600 font-medium text-center px-4">
                    {paymentError || "Unable to generate payment QR."}
                  </p>
                )}
              </div>

              <div className="px-5 pb-6 pt-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-medium">Email</span>
                    <span className="text-[#2b2d2f] font-bold">
                      {email || "vendor@example.com"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-50">
                    <span className="text-slate-400 font-medium">Pay with</span>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                        <img
                          src={activeMethod.icon}
                          alt={activeMethod.name}
                          className="h-4 w-auto object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                        <span className="text-[#2b2d2f] text-[10px] font-black uppercase tracking-tighter">
                          {activeMethod.name}
                        </span>
                      </div>
                      <button
                        onClick={() => setStep("selection")}
                        className="text-blue-600 font-bold hover:underline"
                      >
                        Change
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              {paymentStatus === "waiting" && (
                <p>
                  Waiting for payment confirmation. Once your scan payment is
                  successful, you will be redirected to your dashboard
                  automatically.
                </p>
              )}
              {paymentStatus === "failed" && (
                <div className="space-y-3">
                  <p>{paymentError || "Payment failed."}</p>
                  <button
                    onClick={() => startPayment(method)}
                    className="w-full py-2.5 rounded-md bg-[#3572e8] text-white font-bold hover:bg-[#2862d5] transition-colors"
                  >
                    Generate New QR
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex flex-col items-center gap-3 pt-8 mt-auto border-t border-slate-50">
              <div className="flex items-center gap-2 text-[9px] text-[#b8b8b8] font-bold uppercase tracking-[0.2em]">
                <span>Powered by PsarPulse Pay</span>
              </div>
              <div className="flex items-center gap-6 text-[10px] font-bold text-[#b8b8b8] uppercase tracking-wider">
                <span className="hover:text-slate-900 cursor-pointer">
                  Legal
                </span>
                <span className="hover:text-slate-900 cursor-pointer">
                  Contact
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
