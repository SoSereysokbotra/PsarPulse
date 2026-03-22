"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LogIn,
  Mail,
  Lock,
  Loader2,
  TrendingUp,
  CloudOff,
  Smartphone,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthLayout, LeftPanelContent, FormInput } from "@/components/auth";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import { authClient } from "@/lib/auth/utils/client-auth";

type LoginResponse = {
  success: boolean;
  message?: string;
  data?: {
    user?: {
      role?: "admin" | "vendor" | string;
    };
  };
};

export default function LoginPage() {
  const { language, t } = useLanguage();
  const { resolvedTheme } = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isKhmer = language === "km";
  const isDark = resolvedTheme === "dark";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = (await authClient.login(formData)) as LoginResponse;

      if (!result.success) {
        setError(result.message || "Login failed. Please try again.");
        return;
      }

      const redirectPath = searchParams.get("redirect");
      if (redirectPath && redirectPath.startsWith("/")) {
        router.push(redirectPath);
        return;
      }

      const role = result.data?.user?.role;
      if (role === "super_admin") {
        router.push("/superadmin");
        return;
      }

      if (role === "admin") {
        router.push("/admin");
        return;
      }

      if (role === "vendor") {
        router.push("/vendor");
        return;
      }

      router.push("/customer");
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
          icon={<LogIn className="w-8 h-8" />}
          title={t("auth.login.welcomeTitle")}
          subtitle={t("auth.login.welcomeSubtitle")}
          features={[
            {
              title: t("auth.login.feature1Title"),
              desc: t("auth.login.feature1Desc"),
            },
            {
              title: t("auth.login.feature2Title"),
              desc: t("auth.login.feature2Desc"),
            },
            {
              title: t("auth.login.feature3Title"),
              desc: t("auth.login.feature3Desc"),
            },
          ]}
          footerText="© 2026 PsarPulse KH • Developed at Kirirom Institute of Technology"
        />
      }
      backHref="/"
    >
      <header className="mb-10">
        <h1
          className={`text-4xl font-extrabold tracking-tight mb-2 ${isDark ? "text-white" : "text-slate-900"} ${isKhmer ? "font-suwannaphum" : ""}`}
        >
          {t("auth.login.title")}
        </h1>
        <p
          className={`font-medium text-lg ${isDark ? "text-[#8A8F98]" : "text-slate-500"} ${isKhmer ? "font-suwannaphum" : ""}`}
        >
          {t("auth.login.subtitle")}
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput
          id="email"
          name="email"
          type="email"
          label={t("auth.login.emailLabel")}
          icon={Mail}
          placeholder={t("auth.register.emailPlaceholder")}
          value={formData.email}
          onChange={handleInputChange}
          required
          disabled={isLoading}
        />

        <FormInput
          id="password"
          name="password"
          type="password"
          label={t("auth.login.passwordLabel")}
          icon={Lock}
          placeholder="••••••••"
          value={formData.password}
          onChange={handleInputChange}
          required
          disabled={isLoading}
          rightLabelElement={
            <Link
              href="/forgot"
              className={`text-sm font-bold text-psar-primary hover:underline hover:text-psar-dark transition-colors ${isKhmer ? "font-suwannaphum" : ""}`}
            >
              {t("auth.login.forgotPassword")}
            </Link>
          }
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
          ) : (
            t("auth.login.signInButton")
          )}
        </button>
      </form>

      {/* Social login section */}
      <div className="relative my-10">
        <div className="absolute inset-0 flex items-center">
          <div
            className={`w-full border-t ${isDark ? "border-white/10" : "border-slate-100"}`}
          ></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span
            className={`px-4 font-medium ${isDark ? "bg-dark-bg text-[#8A8F98]" : "bg-white text-slate-400"} ${isKhmer ? "font-suwannaphum" : ""}`}
          >
            {t("auth.login.orContinueWith")}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {/* Google */}
        <button
          type="button"
          onClick={() => console.log("Google login")}
          disabled={isLoading}
          className={`flex items-center justify-center gap-2 px-4 py-3 border rounded-xl transition-all disabled:opacity-50 ${
            isDark
              ? "border-dark-border bg-dark-surface hover:bg-dark-surface-hover hover:border-white/20 text-white"
              : "border-slate-200 hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100 text-slate-700"
          }`}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4" // Google Blue
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853" // Google Green
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05" // Google Yellow
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335" // Google Red
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span
            className={`text-sm font-medium ${isDark ? "text-white" : "text-slate-700"} ${isKhmer ? "font-suwannaphum text-xs" : ""}`}
          >
            Google
          </span>
        </button>

        {/* Facebook */}
        <button
          type="button"
          onClick={() => console.log("Facebook login")}
          disabled={isLoading}
          className={`flex items-center justify-center gap-2 px-4 py-3 border rounded-xl transition-all disabled:opacity-50 ${
            isDark
              ? "border-dark-border bg-dark-surface hover:bg-dark-surface-hover hover:border-white/20 text-white"
              : "border-slate-200 hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100 text-slate-700"
          }`}
        >
          <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          <span
            className={`text-sm font-medium ${isDark ? "text-white" : "text-slate-700"} ${isKhmer ? "font-suwannaphum text-xs" : ""}`}
          >
            Facebook
          </span>
        </button>

        {/* TikTok */}
        <button
          type="button"
          onClick={() => console.log("TikTok login")}
          disabled={isLoading}
          className={`flex items-center justify-center gap-2 px-4 py-3 border rounded-xl transition-all disabled:opacity-50 ${
            isDark
              ? "border-dark-border bg-dark-surface hover:bg-dark-surface-hover hover:border-white/20 text-white"
              : "border-slate-200 hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100 text-slate-700"
          }`}
        >
          <svg className="w-5 h-5" viewBox="0 0 448 512">
            <path
              fill="#24f6f0"
              d="M448 209.91a210.06 210.06 0 0 1-122.77-39.25V349.38A162.55 162.55 0 1 1 185 188.31v89.89a74.62 74.62 0 1 0 52.23 71.18V0l88 0a121.18 121.18 0 0 0 1.86 22.17h0A122.18 122.18 0 0 0 381 102.39a121.43 121.43 0 0 0 67 20.14Z"
            />
            <path
              fill="#fe2c55"
              d="M438 209.91a210.06 210.06 0 0 1-122.77-39.25V349.38A162.55 162.55 0 1 1 175 188.31v89.89a74.62 74.62 0 1 0 52.23 71.18V0l88 0a121.18 121.18 0 0 0 1.86 22.17h0A122.18 122.18 0 0 0 371 102.39a121.43 121.43 0 0 0 67 20.14Z"
            />
            <path
              fill="#000000"
              d="M443 209.91a210.06 210.06 0 0 1-122.77-39.25V349.38A162.55 162.55 0 1 1 180 188.31v89.89a74.62 74.62 0 1 0 52.23 71.18V0l88 0a121.18 121.18 0 0 0 1.86 22.17h0A122.18 122.18 0 0 0 376 102.39a121.43 121.43 0 0 0 67 20.14Z"
            />
          </svg>
          <span
            className={`text-sm font-medium ${isDark ? "text-white" : "text-slate-700"} ${isKhmer ? "font-suwannaphum text-xs" : ""}`}
          >
            TikTok
          </span>
        </button>
      </div>

      <p
        className={`mt-8 text-center font-medium ${isDark ? "text-[#8A8F98]" : "text-slate-500"} ${isKhmer ? "font-suwannaphum" : ""}`}
      >
        {t("auth.login.noAccount")}{" "}
        <Link
          href="/signup"
          className={`font-extrabold hover:underline ${isDark ? "text-psar-primary" : "text-psar-primary"}`}
        >
          {t("auth.login.signUpFree")}
        </Link>
      </p>
    </AuthLayout>
  );
}
