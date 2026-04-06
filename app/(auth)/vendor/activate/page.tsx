"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, CheckCircle2, XCircle, Store } from "lucide-react";
import { AuthLayout, LeftPanelContent } from "@/components/auth";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import { authClient } from "@/lib/auth/utils/client-auth";


import { Suspense } from "react";

function VendorActivationContent() {
  const { language, t } = useLanguage();
  const { resolvedTheme } = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const isKhmer = language === "km";
  const isDark = resolvedTheme === "dark";

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage(isKhmer ? "តំណភ្ជាប់ដែលមិនត្រឹមត្រូវ" : "Invalid activation link.");
      return;
    }

    const activateAccount = async () => {
      try {
        const result = await authClient.activateVendor(token) as any;
        if (result.success) {
          setStatus("success");
          setMessage(isKhmer ? "គណនីរបស់អ្នកត្រូវបានធ្វើឱ្យសកម្មដោយជោគជ័យ!" : "Your account has been successfully activated!");
          
          // Redirect to vendor dashboard after a short delay
          setTimeout(() => {
            router.push("/vendor");
          }, 2000);
        } else {
          setStatus("error");
          setMessage(result.message || (isKhmer ? "ការធ្វើឱ្យសកម្មបានបរាជ័យ" : "Activation failed."));
        }
      } catch (error) {
        setStatus("error");
        setMessage(isKhmer ? "កំហុសម៉ាស៊ីនបម្រើ" : "A server error occurred during activation.");
      }
    };

    activateAccount();
  }, [token, isKhmer, router]);

  return (
    <AuthLayout
      leftContent={
        <LeftPanelContent
          icon={<Store className="w-8 h-8" />}
          title={isKhmer ? "ធ្វើឱ្យគណនីអ្នកលក់សកម្ម" : "Activate Vendor Account"}
          subtitle={
            isKhmer
              ? "សូមរង់ចាំ ខណៈពេលដែលយើងរៀបចំតូបសម្រាប់អ្នក។"
              : "Please wait while we set up your shop."
          }
          footerText="© 2026 PsarPulse KH • Developed at Kirirom Institute of Technology"
        />
      }
      backHref="/login"
    >
      <div className="flex flex-col items-center justify-center py-10 space-y-6 text-center">
        {status === "loading" && (
          <>
            <div className="relative">
              <div className="w-20 h-20 border-4 border-psar-primary/20 border-t-psar-primary rounded-full animate-spin" />
              <Loader2 className="w-10 h-10 text-psar-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <h1 className={`text-3xl font-extrabold ${isDark ? "text-white" : "text-slate-900"} ${isKhmer ? "font-battambang" : ""}`}>
              {isKhmer ? "កំពុងធ្វើឱ្យសកម្ម..." : "Activating Account..."}
            </h1>
            <p className={`text-lg font-medium ${isDark ? "text-[#8A8F98]" : "text-slate-500"} ${isKhmer ? "font-battambang" : ""}`}>
              {isKhmer ? "សូមរង់ចាំបន្តិច" : "Please wait a moment while we verify your details."}
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950/30 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h1 className={`text-3xl font-extrabold ${isDark ? "text-white" : "text-slate-900"} ${isKhmer ? "font-battambang" : ""}`}>
              {isKhmer ? "ជោគជ័យ!" : "Success!"}
            </h1>
            <p className={`text-lg font-medium ${isDark ? "text-emerald-400" : "text-emerald-600"} ${isKhmer ? "font-battambang" : ""}`}>
              {message}
            </p>
            <p className={`text-sm ${isDark ? "text-[#8A8F98]" : "text-slate-500"} ${isKhmer ? "font-battambang" : ""}`}>
              {isKhmer ? "បញ្ជូនអ្នកទៅកាន់ផ្ទាំងគ្រប់គ្រង..." : "Redirecting you to the dashboard..."}
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-20 h-20 bg-red-100 dark:bg-red-950/30 rounded-full flex items-center justify-center">
              <XCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
            </div>
            <h1 className={`text-3xl font-extrabold ${isDark ? "text-white" : "text-slate-900"} ${isKhmer ? "font-battambang" : ""}`}>
              {isKhmer ? "កំហុសក្នុងការធ្វើឱ្យសកម្ម" : "Activation Error"}
            </h1>
            <p className={`text-lg font-medium ${isDark ? "text-red-400" : "text-red-600"} ${isKhmer ? "font-battambang" : ""}`}>
              {message}
            </p>
            <button
              onClick={() => router.push("/login")}
              className="mt-4 px-8 py-3 bg-psar-primary text-white font-bold rounded-xl shadow-lg hover:bg-[#239979] transition-all"
            >
              {isKhmer ? "ត្រឡប់ទៅការចូល" : "Back to Login"}
            </button>
          </>
        )}
      </div>
    </AuthLayout>
  );
}

export default function VendorActivationPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen w-screen items-center justify-center bg-[#f0f2f5] dark:bg-dark-bg transition-colors">
        <Loader2 className="w-8 h-8 animate-spin text-[#29B28D]" />
      </div>
    }>
      <VendorActivationContent />
    </Suspense>
  );
}
