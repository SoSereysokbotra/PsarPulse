"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, ShieldCheck, RefreshCcw } from "lucide-react";

export default function VerifyCodePage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer for resending code
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Logic for verifying credentials against stored data [cite: 180]
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Verifying OTP:", otp.join(""));
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row font-sans bg-white selection:bg-[#29B28D] selection:text-white">
      {/* --- LEFT SIDE: Brand & Security Focus --- */}
      <div className="hidden lg:flex lg:w-5/12 bg-slate-900 relative overflow-hidden flex-col justify-between p-12 text-white border-r-4 border-[#29B28D]">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#29B28D] rounded-full mix-blend-multiply filter blur-[128px] opacity-30"></div>

        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#29B28D] flex items-center justify-center font-bold text-white text-2xl shadow-lg">
              P
            </div>
            <span className="font-extrabold text-2xl tracking-tight">
              PsarPulse KH
            </span>
          </Link>
        </div>

        <div className="relative z-10 my-auto">
          <div className="w-16 h-16 rounded-2xl bg-[#29B28D]/20 flex items-center justify-center text-[#29B28D] mb-6">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-4xl font-extrabold leading-[1.2] mb-4">
            Protecting your <br />
            <span className="text-[#29B28D]">business data.</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-sm">
            We've sent a 6-digit verification code to your email. This ensures
            only you can access your stall's records.
          </p>
        </div>

        <p className="relative z-10 text-slate-500 text-sm font-medium">
          © 2026 PsarPulse KH • Built for Cambodian Vendors [cite: 25, 71]
        </p>
      </div>

      {/* --- RIGHT SIDE: OTP Input --- */}
      <div className="flex-1 flex flex-col justify-center relative bg-white py-12 px-6 sm:px-12 lg:px-20 xl:px-32">
        <div className="absolute top-8 left-6 lg:left-12">
          <Link
            href="/forgot-password"
            title="Back to Forgot Password"
            className="text-slate-400 hover:text-slate-900 transition-colors flex items-center font-bold"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Link>
        </div>

        <div className="w-full max-w-md mx-auto">
          <header className="mb-10">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
              Verify Code
            </h1>
            <p className="text-slate-500 font-medium font-khmer text-lg">
              សូមបញ្ចូលលេខកូដផ្ទៀងផ្ទាត់ ៦ ខ្ទង់
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex justify-between gap-2 sm:gap-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-full h-14 sm:h-16 text-center text-2xl font-bold bg-slate-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-[#29B28D] focus:ring-0 outline-none transition-all"
                  required
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading || otp.some((d) => !d)}
              className="w-full flex items-center justify-center gap-2 bg-[#29B28D] text-white font-bold text-lg py-5 rounded-2xl shadow-xl hover:bg-[#239979] hover:-translate-y-1 active:translate-y-0 transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                "Verify & Continue"
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-slate-500 font-medium mb-4">
              Didn't receive the code?
            </p>
            <button
              onClick={() => setTimer(60)}
              disabled={timer > 0}
              className="inline-flex items-center gap-2 text-[#29B28D] font-extrabold hover:underline disabled:text-slate-300 disabled:no-underline"
            >
              <RefreshCcw
                className={`w-4 h-4 ${timer > 0 ? "" : "animate-pulse"}`}
              />
              {timer > 0 ? `Resend in ${timer}s` : "Resend Code"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
