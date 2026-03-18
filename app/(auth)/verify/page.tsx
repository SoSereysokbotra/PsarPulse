"use client";

import React, { useState, useEffect } from "react";
import { MailCheck, RefreshCcw, Loader2, SmartphoneNfc } from "lucide-react";
import { AuthLayout, LeftPanelContent, OTPInput } from "@/components/auth";

export default function EmailVerificationPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Verifying Email Code:", otp.join(""));
    setIsLoading(false);
  };

  return (
    <AuthLayout
      leftContent={
        <LeftPanelContent
          icon={<SmartphoneNfc className="w-8 h-8" />}
          title="Verify your identity."
          subtitle="We've sent a 6-digit code to your email. Please enter it to activate your vendor account and start tracking sales."
          footerText="© 2026 PsarPulse KH • Developed at Kirirom Institute of Technology"
        />
      }
      backHref="/signup"
    >
      <header className="mb-10 text-center lg:text-left">
        <div className="lg:hidden mb-6 flex justify-center">
          <div className="w-16 h-16 bg-psar-primary/10 rounded-2xl flex items-center justify-center">
            <MailCheck className="w-8 h-8 text-psar-primary" />
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
        <OTPInput otp={otp} setOtp={setOtp} disabled={isLoading} />

        <button
          type="submit"
          disabled={isLoading || otp.some((d) => !d)}
          className="w-full flex items-center justify-center gap-2 bg-psar-primary text-white font-bold text-lg py-3 rounded-2xl shadow-xl hover:bg-[#239979] hover:-translate-y-1 active:translate-y-0 transition-all duration-300 disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            "Verify Account"
          )}
        </button>
      </form>

      <div className="mt-10 text-center">
        <p className="text-slate-500 font-medium mb-3">
          Didn't receive the code?
        </p>
        <button
          onClick={() => setResendTimer(60)}
          disabled={resendTimer > 0}
          className="inline-flex items-center gap-2 text-psar-primary font-extrabold hover:text-[#239979] transition-colors disabled:text-slate-300"
        >
          <RefreshCcw
            className={`w-4 h-4 ${resendTimer > 0 ? "opacity-50" : "animate-spin-slow"}`}
          />
          {resendTimer > 0
            ? `Resend code in ${resendTimer}s`
            : "Resend Verification Code"}
        </button>
      </div>
    </AuthLayout>
  );
}
