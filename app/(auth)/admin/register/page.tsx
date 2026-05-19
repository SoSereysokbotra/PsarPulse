"use client";

import React, { useState, Suspense } from "react";
import { useSettings } from "@/components/providers/SettingsProvider";
import Link from "next/link";
import { User, Mail, Lock, Shield, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthLayout, LeftPanelContent, FormInput } from "@/components/auth";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import { authClient } from "@/lib/auth/utils/client-auth";

type SignupResponse = {
  success: boolean;
  message?: string;
};

function AdminRegisterPageContent() {
  const { platform_name } = useSettings();
  const { language, t } = useLanguage();
  const { resolvedTheme } = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isKhmer = language === "km";
  const isDark = resolvedTheme === "dark";

  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [error, setError] = useState("");
  const [tokenError, setTokenError] = useState("");

  React.useEffect(() => {
    async function verifyToken() {
      if (!token) {
        setIsVerifying(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/auth/invitations/verify?token=${encodeURIComponent(token)}`,
        );
        const data = await response.json();

        if (data.success) {
          setIsTokenValid(true);
          setFormData((prev) => ({ ...prev, email: data.email }));
        } else {
          setTokenError(data.message || "Invalid invitation");
        }
      } catch (err) {
        console.error(err);
        setTokenError("Unable to verify invitation at the moment.");
      } finally {
        setIsVerifying(false);
      }
    }
    verifyToken();
  }, [token]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !isTokenValid) return;

    setIsLoading(true);
    setError("");

    try {
      const result = (await authClient.signup({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: "admin",
        token: token,
      })) as SignupResponse;

      if (!result.success) {
        setError(
          result.message || "Admin Registration failed. Please try again.",
        );
        return;
      }

      router.push("/verify");
    } catch {
      setError("Unable to connect to server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50 dark:bg-[#0d1117]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!token || !isTokenValid) {
    return (
      <div className="flex h-screen w-full items-center justify-center p-4 bg-slate-50 dark:bg-[#0d1117]">
        <div className="max-w-md w-full p-8 rounded-2xl bg-white dark:bg-[#161b22] border border-slate-200 dark:border-white/10 shadow-xl text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-red-600 dark:text-red-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">
            Invalid Invitation
          </h2>
          <p className="text-slate-500 mb-6 text-sm">
            {tokenError ||
              "The invitation link is missing, expired, or has already been used."}
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <AuthLayout
      leftContent={
        <LeftPanelContent
          icon={<Shield className="w-8 h-8" />}
          title="Admin Registration"
          subtitle="Manage PsarPulseKH Market Operations"
          features={[
            {
              title: "Full Control",
              desc: "Oversee market operations and vendor management securely.",
            },
            {
              title: "Review Vendors",
              desc: "Approve vendor registrations and manage stalls directly from your dashboard.",
            },
          ]}
          footerText={`© ${new Date().getFullYear()} ${platform_name} • Admin Portal`}
        />
      }
      backHref="/"
    >
      <header className="mb-10">
        <h1
          className={`text-3xl sm:text-4xl font-extrabold tracking-tight mb-3 ${isDark ? "text-white" : "text-slate-900"} ${isKhmer ? "font-battambang" : ""}`}
        >
          Admin Registration
        </h1>
        <p
          className={`font-medium ${isDark ? "text-[#8A8F98]" : "text-slate-500"} ${isKhmer ? "font-battambang" : ""}`}
        >
          Create your administrative account
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput
          id="fullName"
          name="fullName"
          type="text"
          label={t("auth.signup.fullNameLabel")}
          icon={User}
          placeholder={t("auth.register.fullNamePlaceholder")}
          value={formData.fullName}
          onChange={handleInputChange}
          required
          disabled={isLoading}
        />

        <FormInput
          id="email"
          name="email"
          type="email"
          label={t("auth.signup.emailLabel")}
          icon={Mail}
          placeholder={t("auth.register.emailPlaceholder")}
          value={formData.email}
          onChange={handleInputChange}
          required
          disabled={true}
        />

        <FormInput
          id="password"
          name="password"
          type="password"
          label={t("auth.signup.passwordLabel")}
          icon={Lock}
          placeholder={t("auth.register.passwordPlaceholder")}
          value={formData.password}
          onChange={handleInputChange}
          required
          minLength={8}
          disabled={isLoading}
        />

        {error && (
          <p
            className={`text-sm font-medium ${isDark ? "text-red-400" : "text-red-600"} ${isKhmer ? "font-battambang" : ""}`}
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold text-sm py-3 rounded-xl shadow-xl hover:bg-indigo-700 hover:-translate-y-1 active:translate-y-0 transition-all duration-300 disabled:opacity-70 ${isKhmer ? "font-battambang" : ""}`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Creating Admin...
            </>
          ) : (
            "Create Admin Account"
          )}
        </button>
      </form>

      <p
        className={`mt-8 text-center font-medium ${isDark ? "text-[#8A8F98]" : "text-slate-500"} ${isKhmer ? "font-battambang" : ""}`}
      >
        {t("auth.signup.alreadyMember")}{" "}
        <Link
          href="/login"
          className={`font-extrabold hover:text-indigo-400 transition-colors underline decoration-slate-300 underline-offset-4 hover:decoration-indigo-400 ${isDark ? "text-indigo-400 decoration-white/20" : "text-slate-900"}`}
        >
          {t("auth.signup.signInAccount")}
        </Link>
      </p>
    </AuthLayout>
  );
}

export default function AdminRegisterPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen w-full items-center justify-center bg-slate-50 dark:bg-[#0d1117]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    }>
      <AdminRegisterPageContent />
    </Suspense>
  );
}
