"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, RefreshCcw, Loader2 } from "lucide-react";
import { AuthLayout, LeftPanelContent, OTPInput } from "@/components/auth";
import { useTheme } from "@/components/providers/ThemeProvider";

export default function VerifyCodePage() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate verification
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Verifying OTP:", otp.join(""));
    setIsLoading(false);
  };

  return (
    <AuthLayout
      leftContent={
        <LeftPanelContent
          icon={<ShieldCheck className="w-8 h-8" />}
          title="Protecting your business data."
          subtitle="We've sent a 6-digit verification code to your email. This ensures only you can access your stall's records."
          footerText="© 2026 PsarPulse KH • Developed at Kirirom Institute of Technology"
        />
      }
      backHref="/forgot-password"
    >
      <header className="mb-10">
        <h1
          className={`text-4xl font-extrabold tracking-tight mb-2 ${isDark ? "text-white" : "text-slate-900"}`}
        >
          Verify Code
        </h1>
        <p
          className={`font-medium text-lg ${isDark ? "text-[#8A8F98]" : "text-slate-500"} font-khmer`}
        >
          សូមបញ្ចូលលេខកូដផ្ទៀងផ្ទាត់ ៦ ខ្ទង់
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8">
        <OTPInput otp={otp} setOtp={setOtp} disabled={isLoading} />

        <button
          type="submit"
          disabled={isLoading || otp.some((d) => !d)}
          className="w-full flex items-center justify-center gap-2 bg-psar-primary text-white font-bold text-lg py-3 rounded-2xl shadow-xl hover:bg-[#239979] hover:-translate-y-1 active:translate-y-0 transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0"
        >
          {isLoading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            "Verify & Continue"
          )}
        </button>
      </form>

      <div className="mt-10 text-center">
        <p
          className={`font-medium mb-4 ${isDark ? "text-[#8A8F98]" : "text-slate-500"}`}
        >
          Didn't receive the code?
        </p>
        <button
          onClick={() => setTimer(60)}
          disabled={timer > 0}
          className="inline-flex items-center gap-2 text-psar-primary font-extrabold hover:underline disabled:text-slate-300 disabled:no-underline"
        >
          <RefreshCcw
            className={`w-4 h-4 ${timer > 0 ? "" : "animate-pulse"}`}
          />
          {timer > 0 ? `Resend in ${timer}s` : "Resend Code"}
        </button>
      </div>
    </AuthLayout>
  );
}
