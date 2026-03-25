"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Shield, 
  ChevronLeft, 
  CheckCircle2, 
  Lock,
  Loader2,
} from "lucide-react";
import { authClient } from "@/lib/auth/utils/client-auth";
import Image from "next/image";

// ─── TYPES ───────────────────────────────────────────────────────────────────

type PlanId = "pro" | "premium";
type PaymentMethod = "aba" | "acleda" | "bakong";
type CheckoutStep = "selection" | "details" | "success";

// ─── HELPERS ─────────────────────────────────────────────────────────────

function QRCode({ color = "#000" }: { color?: string }) {
  // A cleaner, more realistic looking generic QR code pattern
  return (
    <svg width="180" height="180" viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
      <rect width="180" height="180" fill="white" rx="12" />
      {/* Top Left */}
      <rect x="20" y="20" width="45" height="45" rx="6" fill={color} />
      <rect x="28" y="28" width="29" height="29" rx="3" fill="white" />
      <rect x="36" y="36" width="13" height="13" rx="2" fill={color} />
      
      {/* Top Right */}
      <rect x="115" y="20" width="45" height="45" rx="6" fill={color} />
      <rect x="123" y="28" width="29" height="29" rx="3" fill="white" />
      <rect x="131" y="36" width="13" height="13" rx="2" fill={color} />
      
      {/* Bottom Left */}
      <rect x="20" y="115" width="45" height="45" rx="6" fill={color} />
      <rect x="28" y="123" width="29" height="29" rx="3" fill="white" />
      <rect x="36" y="131" width="13" height="13" rx="2" fill={color} />
      
      {/* Random Data Dots */}
      {[...Array(90)].map((_, i) => (
        <rect 
          key={i} 
          x={75 + (Math.random() * 80)} 
          y={75 + (Math.random() * 80)} 
          width="8" 
          height="8"
          rx="1" 
          fill={i % 2 === 0 ? color : (i % 3 === 0 ? "#111" : "#fff")} 
        />
      ))}
      <rect x="80" y="80" width="20" height="20" rx="4" fill="white" />
    </svg>
  );
}

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planParam = searchParams.get("plan") as PlanId;
  const billingParam = searchParams.get("billing") || "monthly";

  const [step, setStep] = useState<CheckoutStep>("selection");
  const [method, setMethod] = useState<PaymentMethod>("aba");
  const [email, setEmail] = useState("");
  const [tosAccepted, setTosAccepted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    authClient.getProfile().then((res: any) => {
      if (res.success && res.data.user) {
        setEmail(res.data.user.email);
      }
    });
  }, []);

  const planInfo = {
    pro: { name: "Pro", price: billingParam === "annual" ? "$30.00" : "$3.00", period: billingParam === "annual" ? "year" : "month" },
    premium: { name: "Premium", price: billingParam === "annual" ? "$70.00" : "$7.00", period: billingParam === "annual" ? "year" : "month" }
  }[planParam || "pro"];

  const handleSubscribe = () => {
    if (!tosAccepted) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsSuccess(true);
      setIsProcessing(false);
      setTimeout(() => setStep("success"), 1200);
    }, 2000);
  };

  const getMethodDetails = (m: PaymentMethod) => {
    switch(m) {
      case "aba": return { name: "ABA KHQR", color: "#005e82", icon: "/images/banks/aba.png" };
      case "acleda": return { name: "ACLEDA QR", color: "#0c3b6f", icon: "/images/banks/acleda.png" };
      case "bakong": return { name: "BAKONG", color: "#e3000f", icon: "/images/banks/bakong.png" };
    }
  };

  const activeMethod = getMethodDetails(method);

  // STEP 3: SUCCESS
  if (step === "success") {
    return (
      <div className="min-h-screen bg-[#f2f4f5] flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden p-10 text-center animate-in fade-in zoom-in duration-300">
           <div className="w-20 h-20 bg-[#00b06f]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} className="text-[#00b06f]" />
           </div>
           <h2 className="text-2xl font-bold text-slate-900 mb-2">Payment Successful</h2>
           <p className="text-slate-500 text-sm mb-8">
             You are now subscribed to PsarPulse {planInfo.name}.
           </p>
           <button 
             onClick={() => router.push(planParam === "premium" ? "/vendor/premium" : "/vendor/pro")}
             className="w-full py-3.5 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors"
           >
             Return to Dashboard
           </button>
        </div>
      </div>
    );
  }

  // STEP 1: SELECTION
  if (step === "selection") {
    return (
      <div className="min-h-screen bg-white font-sans text-slate-900 flex items-center justify-center p-6">
        <div className="max-w-5xl w-full mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* Left Summary */}
          <div className="lg:w-1/3 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-8 text-slate-800">
              <Lock size={22} className="text-slate-900" />
              <h1 className="text-3xl font-black tracking-tight">Secure checkout</h1>
            </div>

            <div className="border-2 border-slate-100 rounded-2xl p-6 flex items-center justify-between shadow-sm bg-white">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-slate-50 rounded-xl">
                  <Shield className="w-7 h-7 text-slate-900" fill="currentColor" />
                </div>
                <div className="flex flex-col">
                  <span className="font-black text-xl leading-none">{planInfo.name}</span>
                  <span className="text-xs font-bold text-slate-400 uppercase mt-1 tracking-widest">Plan</span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-2xl text-slate-900">{planInfo.price}</p>
                <p className="text-xs font-bold text-slate-400 capitalize">per {planInfo.period}</p>
              </div>
            </div>
          </div>

          {/* Right Selection */}
          <div className="lg:w-1/2 flex flex-col justify-center">
            <h3 className="text-lg font-black text-slate-800 mb-6 tracking-tight">Select payment type:</h3>
            <div className="space-y-4">
              {(["aba", "acleda", "bakong"] as PaymentMethod[]).map((m) => {
                const details = getMethodDetails(m);
                return (
                  <button
                    key={m}
                    onClick={() => {
                      setMethod(m);
                      setStep("details");
                    }}
                    className="w-full bg-[#f2f4f5] hover:bg-[#e6e8e9] transition-all rounded-xl flex items-center justify-between p-5 border-2 border-transparent hover:border-slate-200 active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-12 bg-white rounded-lg flex items-center justify-center p-1.5 border border-slate-200 shadow-sm relative overflow-hidden shrink-0">
                        <img 
                          src={details.icon} 
                          alt={details.name} 
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span className="font-bold text-lg text-slate-800">{details.name} KHQR</span>
                    </div>
                    <ChevronLeft className="w-5 h-5 text-slate-300 rotate-180" />
                  </button>
                );
              })}
            </div>
            
            <p className="text-xs text-slate-500 mt-8 leading-relaxed">
              By purchasing {planInfo.name}, you agree to our <span className="font-bold cursor-pointer">Terms of Use</span>, including the arbitration clause and revocation policy.
            </p>
          </div>

        </div>
      </div>
    );
  }

  // STEP 2: DETAILS (ROBLOX SPLIT SCREEN)
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#ffffff] font-sans">
      
      {/* Left Panel: Dark (Roblox style) */}
      <div className="w-full md:w-1/2 bg-[#222222] text-white flex items-center justify-center p-10 lg:p-20 relative shrink-0">
        <div className="max-w-[320px] w-full flex flex-col min-h-[500px]">
          <button 
            onClick={() => setStep("selection")}
            className="flex items-center gap-1 group mb-2 -ml-6"
          >
            <ChevronLeft size={24} className="text-white opacity-40 group-hover:opacity-100 transition-opacity" />
            <span className="text-3xl font-black tracking-tighter uppercase italic">PsarPulse</span>
          </button>

          <div className="mt-8 mb-4">
            <p className="text-white/60 text-sm font-medium mb-1">Subscribe to PsarPulse {planInfo.name}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-bold tracking-tight">{planInfo.price}</span>
              <div className="flex flex-col ml-1">
                 <span className="text-white/60 text-[10px] font-bold leading-none">per</span>
                 <span className="text-white/60 text-[10px] font-bold leading-none">{planInfo.period}</span>
              </div>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center py-20">
             <div className="w-32 h-32 lg:w-40 lg:h-40 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10 shadow-2xl backdrop-blur-sm">
                <Shield className="w-16 h-16 lg:w-20 lg:h-20 text-white/90" fill="currentColor" strokeWidth={0} />
             </div>
          </div>
        </div>
      </div>

      {/* Right Panel: White Payment Details */}
      <div className="flex-1 min-h-screen bg-white flex items-center justify-center p-10 lg:p-20 overflow-y-auto">
        <div className="w-full max-w-[420px] flex flex-col min-h-[600px]">
          <h2 className="text-2xl font-bold mb-10 text-[#2b2d2f]">Payment method</h2>

          <div className="space-y-6 flex-1">
            
            {/* Payment Method Card */}
            <div className="border border-slate-200 rounded-lg overflow-hidden shadow-sm bg-white">
               <div className="p-4 flex items-center justify-between border-b border-slate-50">
                  <div className="flex items-center gap-3">
                     <div className="w-5 h-5 bg-slate-900 rounded-sm flex items-center justify-center">
                        <Lock className="w-2.5 h-2.5 text-white" fill="currentColor" />
                     </div>
                     <span className="font-bold text-[#2b2d2f] text-sm">QR Pay</span>
                  </div>
               </div>
               <div className="px-5 pb-6 pt-4">
                  <div className="space-y-4">
                     <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400 font-medium">Email</span>
                        <span className="text-[#2b2d2f] font-bold">{email || "vendor@example.com"}</span>
                     </div>
                     <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-50">
                        <span className="text-slate-400 font-medium">Pay with</span>
                        <div className="flex items-center gap-2">
                           <div className="flex items-center gap-2 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                              <img src={activeMethod.icon} alt={activeMethod.name} className="h-4 w-auto object-contain" />
                              <span className="text-[#2b2d2f] text-[10px] font-black uppercase tracking-tighter">{activeMethod.name}</span>
                           </div>
                           <button onClick={() => setStep("selection")} className="text-blue-600 font-bold hover:underline">Change</button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Terms Checkbox */}
            <label className="flex items-start gap-4 cursor-pointer mt-6 mb-4">
               <div className="relative flex items-center mt-1">
                 <input 
                   type="checkbox" 
                   className="peer shrink-0 appearance-none w-5 h-5 border-2 border-slate-300 rounded bg-white checked:bg-[#3572e8] checked:border-[#3572e8] transition-all"
                   checked={tosAccepted}
                   onChange={(e) => setTosAccepted(e.target.checked)}
                 />
                 <CheckCircle2 size={12} strokeWidth={4} className="absolute left-[4px] text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
               </div>
               <div className="text-[10px] text-slate-500 leading-relaxed select-none">
                 <p className="mb-2">
                   I agree that I am purchasing a limited license to access the product governed by the <span className="underline cursor-pointer">Terms of License</span>. 
                   I am at least 18 years old, and I agree to the <span className="underline cursor-pointer">PsarPulse Terms</span> and <span className="underline cursor-pointer">Privacy Policy</span>. 
                   <span className="font-bold text-[#2b2d2f] ml-1">
                     I agree that PsarPulse Inc. will store my payment information for future purchases. I can cancel this subscription anytime.
                   </span>
                 </p>
               </div>
            </label>

            <div className="text-[9px] text-[#b8b8b8] text-center leading-normal px-4 mb-4">
              EU, UK and EEA residents: By confirming your subscription, you consent to the immediate performance of the contract and acknowledge that you thereby lose your right of withdrawal.
            </div>

            {/* Subscribe Button */}
            <button
               disabled={!tosAccepted || isProcessing}
               onClick={handleSubscribe}
               className={`w-full py-3.5 rounded-md text-base font-black transition-all duration-300 flex items-center justify-center gap-2 ${
                 !tosAccepted 
                   ? "bg-[#ced4da] text-white cursor-not-allowed" 
                   : isSuccess 
                     ? "bg-[#00b06f] text-white" 
                     : "bg-[#3572e8] text-white shadow-lg shadow-blue-500/10 active:scale-[0.98] hover:bg-[#2862d5]"
               }`}
            >
              {isProcessing && <Loader2 className="animate-spin" size={20} />}
              {isSuccess ? "Subscribed!" : isProcessing ? "Processing..." : "Subscribe"}
            </button>

            {/* Footer */}
            <div className="flex flex-col items-center gap-3 pt-8 mt-auto border-t border-slate-50">
               <div className="flex items-center gap-2 text-[9px] text-[#b8b8b8] font-bold uppercase tracking-[0.2em]">
                  <span>Powered by PsarPulse Pay</span>
               </div>
               <div className="flex items-center gap-6 text-[10px] font-bold text-[#b8b8b8] uppercase tracking-wider">
                  <span className="hover:text-slate-900 cursor-pointer">Legal</span>
                  <span className="hover:text-slate-900 cursor-pointer">Contact</span>
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
