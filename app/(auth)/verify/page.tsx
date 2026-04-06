"use client";

import React, { useState, useEffect } from "react";
import { MailCheck, RefreshCcw, Loader2, SmartphoneNfc } from "lucide-react";
import { AuthLayout, LeftPanelContent, OTPInput } from "@/components/auth";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import { authClient } from "@/lib/auth/utils/client-auth";

type VerifyResponse = {
  success: boolean;
  message?: string;
};

export default function EmailVerificationPage() {
  const { language, t } = useLanguage();
  const { resolvedTheme } = useTheme();
  const router = useRouter();
  const isKhmer = language === "km";
  const isDark = resolvedTheme === "dark";
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setInfo("");

    try {
      const result = (await authClient.verifyEmail(
        otp.join(""),
      )) as any; // Using any to avoid strict type issues with the new return data

      if (!result.success) {
        setError(result.message || "Verification failed. Please try again.");
        return;
      }

      setInfo("Email verified successfully. Redirecting...");
      
      // Auto-login and redirect based on role
      const role = result.data?.user?.role;
      if (role === "vendor") {
        router.push("/vendor");
      } else if (role === "admin" || role === "super_admin") {
        router.push("/admin");
      } else {
        router.push("/customer");
      }
    } catch {
      setError("Unable to connect to server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setInfo("");
    setIsLoading(true);

    try {
      const result =
        (await authClient.resendVerificationCode()) as VerifyResponse;

      if (!result.success) {
        setError(result.message || "Could not resend verification code.");
        return;
      }

      setInfo(result.message || "Verification code resent.");
      setResendTimer(60);
    } catch {
      setError("Unable to connect to server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      leftContent={
        <LeftPanelContent
          icon={<SmartphoneNfc className="w-8 h-8" />}
          title={
            isKhmer ? "បញ្ជាក់អត្តសញ្ញាណរបស់អ្នក។" : "Verify your identity."
          }
          subtitle={
            isKhmer
              ? "យើងបានផ្ញើលេខកូដ ៦ ខ្ទង់ទៅកាន់អ៊ីមែលរបស់អ្នក។ សូមបញ្ចូលវាដើម្បីធ្វើឱ្យគណនីអ្នកលក់របស់អ្នកសកម្ម និងចាប់ផ្តើមតាមដានការលក់។"
              : "We've sent a 6-digit code to your email. Please enter it to activate your vendor account and start tracking sales."
          }
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
        <h1
          className={`text-4xl font-extrabold tracking-tight mb-2 ${isDark ? "text-white" : "text-slate-900"} ${isKhmer ? "font-battambang text-3xl" : ""}`}
        >
          {isKhmer ? "ការបញ្ជាក់អ៊ីមែល" : "Email Verification"}
        </h1>
        <p
          className={`font-medium text-lg ${isDark ? "text-[#8A8F98]" : "text-slate-500"} ${isKhmer ? "font-battambang" : ""}`}
        >
          {isKhmer
            ? "សូមបញ្ចូលលេខកូដសម្ងាត់ ៦ ខ្ទង់ដែលបានផ្ញើទៅកាន់អ៊ីមែលរបស់អ្នក"
            : "Please enter the 6-digit verification code sent to your email."}
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8">
        <OTPInput otp={otp} setOtp={setOtp} disabled={isLoading} />

        {error && (
          <p
            className={`text-sm font-medium ${isDark ? "text-red-400" : "text-red-600"} ${isKhmer ? "font-battambang" : ""}`}
          >
            {error}
          </p>
        )}

        {info && (
          <p
            className={`text-sm font-medium ${isDark ? "text-emerald-400" : "text-emerald-600"} ${isKhmer ? "font-battambang" : ""}`}
          >
            {info}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading || otp.some((d) => !d)}
          className={`w-full flex items-center justify-center gap-2 bg-psar-primary text-white font-bold text-lg py-3 rounded-2xl shadow-xl hover:bg-[#239979] hover:-translate-y-1 active:translate-y-0 transition-all duration-300 disabled:opacity-50 ${isKhmer ? "font-battambang" : ""}`}
        >
          {isLoading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : isKhmer ? (
            "បញ្ជាក់គណនី"
          ) : (
            "Verify Account"
          )}
        </button>
      </form>

      <div className="mt-10 text-center">
        <p
          className={`font-medium mb-3 ${isDark ? "text-[#8A8F98]" : "text-slate-500"} ${isKhmer ? "font-battambang" : ""}`}
        >
          {isKhmer ? "មិនបានទទួលលេខកូដមែនទេ?" : "Didn't receive the code?"}
        </p>
        <button
          onClick={handleResend}
          disabled={resendTimer > 0 || isLoading}
          className={`inline-flex items-center gap-2 text-psar-primary font-extrabold hover:text-[#239979] transition-colors disabled:text-slate-300 ${isKhmer ? "font-battambang" : ""}`}
        >
          <RefreshCcw
            className={`w-4 h-4 ${resendTimer > 0 ? "opacity-50" : "animate-spin-slow"}`}
          />
          {resendTimer > 0
            ? isKhmer
              ? `ផ្ញើលេខកូដម្តងទៀតក្នុងរយៈពេល ${resendTimer}វិនាទី`
              : `Resend code in ${resendTimer}s`
            : isKhmer
              ? "ផ្ញើលេខកូដបញ្ជាក់ម្តងទៀត"
              : "Resend Verification Code"}
        </button>
      </div>
    </AuthLayout>
  );
}
