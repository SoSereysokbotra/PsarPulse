"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  MailCheck,
  ArrowLeft,
  Loader2,
  RefreshCcw,
  SmartphoneNfc,
} from "lucide-react";

export default function EmailVerificationPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto-countdown for the resend button
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Move focus forward
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Move focus back on backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const fullCode = otp.join("");
    console.log("Verifying Email Code:", fullCode);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
    // Redirect logic would go here
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row font-sans bg-white selection:bg-[#29B28D] selection:text-white">
      {/* --- LEFT SIDE: Brand & UX Context --- */}
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
            <SmartphoneNfc className="w-8 h-8" />
          </div>
          <h2 className="text-4xl font-extrabold leading-[1.2] mb-4">
            Verify your <br />
            <span className="text-[#29B28D]">identity.</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-sm">
            We've sent a 6-digit code to your email. Please enter it to activate
            your vendor account and start tracking sales.
          </p>
        </div>

        <p className="relative z-10 text-slate-500 text-sm font-medium">
          © 2026 PsarPulse KH • Support: (+855) 12 345 678
        </p>
      </div>

      {/* --- RIGHT SIDE: OTP Input --- */}
      <div className="flex-1 flex flex-col justify-center relative bg-white py-12 px-6 sm:px-12 lg:px-20 xl:px-32">
        <div className="absolute top-8 left-6 lg:left-12">
          <Link
            href="/signup"
            className="text-slate-400 hover:text-slate-900 transition-colors flex items-center font-bold"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Sign Up
          </Link>
        </div>

        <div className="w-full max-w-md mx-auto text-center lg:text-left">
          <header className="mb-10">
            <div className="lg:hidden mb-6 flex justify-center">
              <div className="w-16 h-16 bg-[#29B28D]/10 rounded-2xl flex items-center justify-center">
                <MailCheck className="w-8 h-8 text-[#29B28D]" />
              </div>
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
              Email Verification
            </h1>
            <p className="text-slate-500 font-medium font-khmer text-lg">
              សូមបញ្ចូលលេខកូដសម្ងាត់ ៦ ខ្ទង់ដែលបានផ្ញើទៅកាន់អ៊ីមែលរបស់អ្នក
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex justify-between gap-2 sm:gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-full h-14 sm:h-16 text-center text-2xl font-bold bg-slate-50 border-2 border-slate-100 rounded-xl focus:bg-white focus:border-[#29B28D] focus:ring-0 outline-none transition-all duration-200"
                  required
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading || otp.some((d) => !d)}
              className="w-full flex items-center justify-center gap-2 bg-[#29B28D] text-white font-bold text-lg py-5 rounded-2xl shadow-xl hover:bg-[#239979] hover:-translate-y-1 active:translate-y-0 transition-all duration-300 disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                "Verify Account"
              )}
            </button>
          </form>

          <div className="mt-10">
            <p className="text-slate-500 font-medium mb-3">
              Didn't receive the code?
            </p>
            <button
              onClick={() => setResendTimer(60)}
              disabled={resendTimer > 0}
              className="inline-flex items-center gap-2 text-[#29B28D] font-extrabold hover:text-[#239979] transition-colors disabled:text-slate-300"
            >
              <RefreshCcw
                className={`w-4 h-4 ${resendTimer > 0 ? "opacity-50" : "animate-spin-slow"}`}
              />
              {resendTimer > 0
                ? `Resend code in ${resendTimer}s`
                : "Resend Verification Code"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
