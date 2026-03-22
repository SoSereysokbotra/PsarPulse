"use client";

import React, { useState } from "react";
import { Lock, ShieldAlert, Loader2, Check } from "lucide-react";
import {
  AuthLayout,
  LeftPanelContent,
  FormInput,
  SuccessCard,
} from "@/components/auth";
import { useTheme } from "@/components/providers/ThemeProvider";
import { authClient } from "@/lib/auth/utils/client-auth";

type ResetPasswordResponse = {
  success: boolean;
  message?: string;
};

export default function ResetPasswordPage() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const isLengthValid = formData.password.length >= 8;
  const hasNumber = /\d/.test(formData.password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password);
  const isMatch =
    formData.password.length > 0 &&
    formData.password === formData.confirmPassword;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const result = (await authClient.resetPassword(
        formData.password,
        formData.confirmPassword,
      )) as ResetPasswordResponse;

      if (!result.success) {
        setError(result.message || "Password reset failed. Please try again.");
        return;
      }

      setSuccessMessage(result.message || "Password reset successfully.");
      setIsSuccess(true);
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
          icon={<ShieldAlert className="w-8 h-8" />}
          title="Reset your access credentials."
          subtitle="Choose a strong password to keep your sales data and business insights safe."
          footerText="© 2026 PsarPulse KH • Developed at Kirirom Institute of Technology"
        />
      }
      backHref="/forgot-password/verify"
      showBack={!isSuccess}
    >
      {!isSuccess ? (
        <>
          <header className="mb-10">
            <h1
              className={`text-4xl font-extrabold tracking-tight mb-2 ${isDark ? "text-white" : "text-slate-900"}`}
            >
              New Password
            </h1>
            <p
              className={`font-medium text-lg ${isDark ? "text-[#8A8F98]" : "text-slate-500"} font-khmer`}
            >
              កំណត់ពាក្យសម្ងាត់ថ្មីរបស់អ្នក
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-5">
            <FormInput
              id="password"
              name="password"
              type="password"
              label="New Password"
              khmerLabel="ពាក្យសម្ងាត់ថ្មី"
              icon={Lock}
              placeholder="Min. 8 characters"
              value={formData.password}
              onChange={handleInputChange}
              required
              minLength={8}
              disabled={isLoading}
            />

            <FormInput
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="Confirm Password"
              khmerLabel="បញ្ជាក់ពាក្យសម្ងាត់"
              icon={Lock}
              placeholder="Repeat your password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              disabled={isLoading}
            />

            <div
              className={`p-4 rounded-xl space-y-3 ${isDark ? "bg-dark-surface" : "bg-slate-50"}`}
            >
              <p
                className={`text-xs font-semibold uppercase tracking-wider mb-5 ${isDark ? "text-[#8A8F98]" : "text-slate-600"}`}
              >
                Password Requirements
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <ValidationItem
                  label="8+ characters"
                  isValid={isLengthValid}
                  isDark={isDark}
                />
                <ValidationItem
                  label="At least one number"
                  isValid={hasNumber}
                  isDark={isDark}
                />
                <ValidationItem
                  label="One special character"
                  isValid={hasSpecial}
                  isDark={isDark}
                />
                <ValidationItem
                  label="Passwords match"
                  isValid={isMatch}
                  isDark={isDark}
                />
              </div>
            </div>

            {error && (
              <p
                className={`text-sm font-medium ${isDark ? "text-red-400" : "text-red-600"}`}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 flex items-center justify-center gap-2 bg-psar-primary text-white font-bold text-sm py-3 rounded-xl shadow-xl hover:bg-[#239979] hover:-translate-y-1 active:translate-y-0 transition-all duration-300 disabled:opacity-70"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        </>
      ) : (
        <SuccessCard
          title="Success!"
          message={
            successMessage ||
            "Your password has been reset successfully. You can now use your new password to sign in."
          }
          buttonText="Go to Sign In"
          buttonHref="/login"
        />
      )}
    </AuthLayout>
  );
}

// Sub-component for the checklist items
function ValidationItem({
  label,
  isValid,
  isDark = false,
}: {
  label: string;
  isValid: boolean;
  isDark?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`shrink-0 h-4 w-4 rounded-full flex items-center justify-center transition-colors ${
          isValid
            ? "bg-green-500/20"
            : isDark
              ? "bg-slate-600/20"
              : "bg-slate-200/20"
        }`}
      >
        {isValid && <Check className="h-2.5 w-2.5 text-green-500" />}
      </div>
      <span
        className={`text-xs ${
          isValid
            ? `font-medium ${isDark ? "text-green-400" : "text-green-600"}`
            : isDark
              ? "text-slate-500"
              : "text-slate-500"
        }`}
      >
        {label}
      </span>
    </div>
  );
}
