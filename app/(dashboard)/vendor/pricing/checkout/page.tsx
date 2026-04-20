"use client";

import React, { useState, useEffect, Suspense } from "react";
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
  ArrowLeft,
  Info,
  Box,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { authClient } from "@/lib/auth/utils/client-auth";
import { offlineFetch } from "@/lib/pwa/offline-fetch";
// import Image from "next/image"; // Uncomment if using next/image for bank icons

// ─── TYPES ───────────────────────────────────────────────────────────────────

type PlanId = "pro" | "premium";
type PaymentMethod = "aba" | "acleda" | "bakong";
type CheckoutStep = "selection" | "details" | "success";

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────────

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planParam = searchParams.get("plan") as PlanId;
  const billingParam = searchParams.get("billing") || "monthly";

  const [currency, setCurrency] = useState("KHR");
  const [isAnnual, setIsAnnual] = useState(billingParam === "annual");

  const [step, setStep] = useState<CheckoutStep>("selection");
  const [method, setMethod] = useState<PaymentMethod>("aba");
  const [email, setEmail] = useState("");
  const [qrString, setQrString] = useState<string | null>(null);
  const [md5Hash, setMd5Hash] = useState<string | null>(null);
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

  const USD_TO_KHR = 4170.2287;
  const basePriceUSD = planId === "premium" 
      ? (isAnnual ? 70.00 : 0.02)
      : (isAnnual ? 30.00 : 0.01);
  const displayPriceUSD = `$${basePriceUSD.toFixed(2)}`;
  const displayPriceKHR = `KHR ${(basePriceUSD * USD_TO_KHR).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const displayPrice = currency === "USD" ? displayPriceUSD : displayPriceKHR;
  const displayPeriod = isAnnual ? "year" : "month";
  
  const monthlyEquivalentUSD = planId === "premium" ? (70 / 12) : (30 / 12);
  const discountText = currency === "USD" 
    ? `$${monthlyEquivalentUSD.toFixed(2)}/month` 
    : `KHR ${(monthlyEquivalentUSD * USD_TO_KHR).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/month`;

  const startPayment = async (selectedMethod: PaymentMethod) => {
    setMethod(selectedMethod);
    setStep("details");
    setPaymentError(null);
    setPaymentStatus("creating");
    setQrString(null);
    setTransactionId(null);

    try {
      const res = await offlineFetch("/api/bakong/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId,
          billingCycle: isAnnual ? "annual" : "monthly",
          method: selectedMethod,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data?.qrString || !data?.transactionId) {
        throw new Error(data?.error || "Unable to generate payment QR");
      }

      setQrString(data.qrString);
      setMd5Hash(data.md5 || null);
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
    // If we've started the payment, just keep the UI in waiting state. 
    // We've removed automatic polling because the Bakong WAF explicitly geo-blocks requests outside of specific ASEAN regions. 
    // We now rely on user's manual confirmation to move to the success screen, and allow Admins to verify the payment manually from the backend.
  }, [step, transactionId, paymentStatus, md5Hash, router, planId]);

  const handleManualConfirmation = () => {
    setPaymentStatus("completed");
    setStep("success");
  };


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
            Payment Pending Verification
          </h2>
          <p className="text-slate-500 text-sm mb-8">
            Thank you! Your payment has been submitted. An admin will verify the transaction shortly and activate your {planInfo.name} subscription.
          </p>
          <button
            onClick={() => {
              window.location.href = "/vendor/dashboard";
            }}
            className="w-full py-3.5 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors"
          >
            Return to Dashboard
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
            {/* Left Column: Summary & Value Reinforcement (Redesigned Boxless) */}
            <div className="lg:w-[45%] flex flex-col justify-center py-4">
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-10 text-slate-900">
                Complete your purchase
              </h1>

              {/* Price & Plan Name (Integrated Typography instead of a card) */}
              <div className="mb-10">
                <div className="flex items-baseline gap-2 mb-3">
                  <span
                    className="text-6xl font-black text-slate-900 tracking-tighter"
                    suppressHydrationWarning
                  >
                    {planInfo.price}
                  </span>
                  <span className="text-xl font-bold text-slate-400">
                    / {planInfo.period}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                    <Shield className="w-6 h-6" fill="currentColor" />
                  </div>
                  <span className="text-2xl font-bold text-slate-800">
                    {planInfo.name} Plan
                  </span>
                </div>
              </div>

              {/* Feature List */}
              <div className="space-y-5 mb-12">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                  Everything included
                </p>
                {planInfo.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="mt-0.5 bg-blue-50 p-1 rounded-full text-blue-600 shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <span className="text-slate-700 text-lg font-medium leading-relaxed">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {/* Trust Indicators (Separated by a subtle line instead of a box) */}
              <div className="flex flex-col sm:flex-row gap-6 text-slate-500 text-sm font-medium border-t border-slate-200/60 pt-8">
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

            {/* Right Column: Payment Selection (Unchanged) */}
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
                                if (e.currentTarget.parentElement) {
                                  e.currentTarget.parentElement.innerHTML = `<span class="text-xs font-bold text-slate-400">${details.name}</span>`;
                                }
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
      <div className="w-full md:w-1/2 bg-black text-white flex justify-center p-8 lg:p-16 shrink-0 font-sans">
        <div className="max-w-[420px] w-full flex flex-col mt-4">
          {/* Header / Back Button */}
          <button
            onClick={() => setStep("selection")}
            className="flex items-center gap-3 w-fit text-neutral-400 hover:text-white transition-colors mb-10"
          >
            <ArrowLeft size={20} />
          </button>

          {/* Subscribe Title */}
          <h2 className="text-neutral-300 font-semibold text-base mb-1.5">
            Subscribe to PsarPulse {planInfo.name}
          </h2>

          {/* Large Price Display */}
          <div className="flex items-center gap-2.5 mb-8">
            <span
              className="text-[40px] font-bold tracking-tight text-white leading-none"
              suppressHydrationWarning
            >
              {displayPrice}
            </span>
            <div className="flex flex-col text-neutral-400 text-xs font-semibold justify-center mt-1">
              <span>per</span>
              <span>{displayPeriod}</span>
            </div>
          </div>

          {/* Currency Toggles */}
          <div className="flex gap-3 mb-3">
            <button
              onClick={() => setCurrency("KHR")}
              className={`flex-1 rounded-lg py-2.5 flex items-center justify-center gap-2 text-sm font-semibold transition-all ${
                currency === "KHR"
                  ? "bg-transparent border border-neutral-600 text-white"
                  : "bg-[#1A1A1A] border border-transparent text-neutral-400 hover:bg-neutral-800"
              }`}
            >
              🇰🇭 KHR
            </button>
            <button
              onClick={() => setCurrency("USD")}
              className={`flex-1 rounded-lg py-2.5 flex items-center justify-center gap-2 text-sm font-semibold transition-all ${
                currency === "USD"
                  ? "bg-transparent border border-neutral-600 text-white"
                  : "bg-[#1A1A1A] border border-transparent text-neutral-400 hover:bg-neutral-800"
              }`}
            >
              🇺🇸 USD
            </button>
          </div>
          <p className="text-neutral-500 text-[13px] mb-10">
            1 USD = 4,170.2287 KHR. Charges can vary based on exchange rates.
          </p>

          {/* Plan Details Card */}
          <div className="border border-neutral-800 rounded-xl bg-black overflow-hidden mb-10">
            <div className="p-5">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-4">
                  <div>
                    <h3 className="font-bold text-white text-[15px]">
                      PsarPulse {planInfo.name}
                    </h3>
                    <p className="text-neutral-400 text-[13px] mt-1.5 leading-relaxed pr-4">
                      PsarPulse {planInfo.name} unlocks unlimited tab
                      completions, extended agent limits, and access to most
                      features.
                    </p>
                    <p className="text-neutral-500 text-[13px] mt-3 font-medium">
                      Billed {displayPeriod}ly
                    </p>
                  </div>
                </div>
                <span className="font-bold text-[15px] shrink-0 text-white" suppressHydrationWarning>
                  {displayPrice}
                </span>
              </div>
            </div>

            {/* Annual Billing Toggle Footer */}
            <div className="bg-[#111111] px-5 py-4 border-t border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsAnnual(!isAnnual)}
                  className={`w-9 h-5 rounded-full relative px-0.5 flex items-center transition-colors duration-200 ease-in-out ${
                    isAnnual ? "bg-white" : "bg-neutral-600"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full transition-transform duration-200 ease-in-out ${
                      isAnnual
                        ? "bg-black translate-x-4"
                        : "bg-white translate-x-0"
                    }`}
                  />
                </button>
                <div className="flex items-center gap-2">
                  <span className="bg-[#B9FBC0] text-[#0A4D1C] text-xs font-bold px-2 py-0.5 rounded-sm">
                    Save 20%
                  </span>
                  <span className="text-[13px] font-semibold text-white">
                    with annual billing
                  </span>
                </div>
              </div>
              {/* Dynamic logic implemented */}
              <span className="text-[13px] text-neutral-300 font-medium" suppressHydrationWarning>
                {isAnnual ? discountText : "Switch to save 20%"}
              </span>
            </div>
          </div>

          {/* Totals Summary */}
          <div className="space-y-4 px-1">
            <div className="flex justify-between items-center text-[15px] font-bold text-white">
              <span>Subtotal</span>
              <span suppressHydrationWarning>{displayPrice}</span>
            </div>
            <div className="flex justify-between items-center text-[15px] text-neutral-400">
              <div className="flex items-center gap-1.5">
                <span>Tax</span>
                <Info
                  size={14}
                  className="text-neutral-500 cursor-pointer hover:text-neutral-300"
                />
              </div>
              <span className="text-neutral-500" suppressHydrationWarning>{currency === "USD" ? "$0.00" : "KHR 0.00"}</span>
            </div>

            <div className="flex justify-between items-center text-[15px] font-bold text-white pt-6 border-t border-neutral-800 mt-2">
              <span>Total due today</span>
              <span suppressHydrationWarning>{displayPrice}</span>
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
                <div className="space-y-4">
                  <p>
                    Please scan the KHQR above with your banking application. Once you have successfully finalized the transfer, click the button below.
                  </p>
                  <button 
                    onClick={handleManualConfirmation}
                    className="w-full py-3 bg-[#00b06f] hover:bg-[#009b62] text-white rounded-lg font-bold transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    I Have Dispatched Payment
                  </button>
                </div>
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

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
