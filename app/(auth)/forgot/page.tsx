"use client";

import React, { useState } from "react";
import { Mail, KeyRound, Loader2 } from "lucide-react";
import {
  AuthLayout,
  LeftPanelContent,
  FormInput,
  SuccessCard,
} from "@/components/auth";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import { authClient } from "@/lib/auth/utils/client-auth";

type ForgotResponse = {
  success: boolean;
  message?: string;
};

export default function ForgotPasswordPage() {
  const { language, t } = useLanguage();
  const { resolvedTheme } = useTheme();
  const isKhmer = language === "km";
  const isDark = resolvedTheme === "dark";
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = (await authClient.requestPasswordReset(
        email,
      )) as ForgotResponse;

      if (!result.success) {
        setError(result.message || "Failed to send reset code.");
        return;
      }

      setIsSubmitted(true);
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
          icon={<KeyRound className="w-8 h-8" />}
          title={
            isKhmer
              ? "រក្សាសុវត្ថិភាពគណនីអ្នកលក់របស់អ្នក។"
              : "Secure your vendor account."
          }
          subtitle={
            isKhmer
              ? "កុំបារម្ភ! វាអាចកើតឡើងចំពោះយើងទាំងអស់គ្នា។ យើងនឹងជួយអ្នកឱ្យត្រឡប់ទៅគ្រប់គ្រងស្តង់របស់អ្នកវិញ។"
              : "Don't worry! It happens to the best of us. We'll help you get back to managing your stall."
          }
          footerText="© 2026 PsarPulse KH • Developed at Kirirom Institute of Technology"
        />
      }
      backHref="/login"
    >
      {!isSubmitted ? (
        <>
          <header className="mb-10">
            <h1
              className={`text-4xl font-extrabold tracking-tight mb-2 ${isDark ? "text-white" : "text-slate-900"} ${isKhmer ? "font-suwannaphum text-3xl" : ""}`}
            >
              {isKhmer ? "ភ្លេចពាក្យសម្ងាត់?" : "Forgot Password?"}
            </h1>
            <p
              className={`font-medium text-lg ${isDark ? "text-[#8A8F98]" : "text-slate-500"} ${isKhmer ? "font-suwannaphum" : ""}`}
            >
              {isKhmer
                ? "បញ្ចូលអ៊ីមែលរបស់អ្នកដើម្បីបន្ត។"
                : "Enter your email to continue."}
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            <FormInput
              id="email"
              name="email"
              type="email"
              label={t("auth.login.emailLabel")}
              icon={Mail}
              placeholder="vendor@psarpulse.kh"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />

            {error && (
              <p
                className={`text-sm font-medium ${isDark ? "text-red-400" : "text-red-600"} ${isKhmer ? "font-suwannaphum" : ""}`}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex items-center justify-center gap-2 bg-psar-primary text-white font-bold text-sm py-3 rounded-xl shadow-xl hover:bg-[#239979] hover:-translate-y-1 active:translate-y-0 transition-all duration-300 disabled:opacity-70 ${isKhmer ? "font-suwannaphum" : ""}`}
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : isKhmer ? (
                "ផ្ញើតំណភ្ជាប់ដើម្បីកំណត់ឡើងវិញ"
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>
        </>
      ) : (
        <SuccessCard
          title={isKhmer ? "ពិនិត្យមើលអ៊ីមែលរបស់អ្នក" : "Check your email"}
          message={
            isKhmer
              ? `យើងបានផ្ញើលេខកូដកំណត់ពាក្យសម្ងាត់ឡើងវិញទៅកាន់ ${email}`
              : `We've sent a password reset code to ${email}`
          }
          buttonText={
            isKhmer ? "បញ្ចូលលេខកូដបញ្ជាក់" : "Enter Verification Code"
          }
          buttonHref={`/forgot/verify?email=${encodeURIComponent(email)}`}
        />
      )}
    </AuthLayout>
  );
}
