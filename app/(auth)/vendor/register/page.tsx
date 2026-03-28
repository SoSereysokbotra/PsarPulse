"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  User,
  Mail,
  Lock,
  Phone,
  Store,
  MapPin,
  FileText,
  Loader2,
  Navigation,
} from "lucide-react";
import { Map, Overlay } from "pigeon-maps";
import { AuthLayout, LeftPanelContent, FormInput } from "@/components/auth";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import { authClient } from "@/lib/auth/utils/client-auth";

type SignupResponse = {
  success: boolean;
  message?: string;
};

export default function VendorRegisterPage() {
  const { language, t } = useLanguage();
  const { resolvedTheme } = useTheme();
  const isKhmer = language === "km";
  const isDark = resolvedTheme === "dark";
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    storeName: "",
    description: "",
    password: "",
    latitude: "11.5564",
    longitude: "104.9282",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = (await authClient.signup({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: "vendor",
        businessName: formData.storeName,
        businessEmail: formData.email,
        phone: formData.phone,
        description: formData.description,
        latitude: formData.latitude,
        longitude: formData.longitude,
      })) as SignupResponse;

      if (!result.success) {
        setError(result.message || "Registration failed. Please try again.");
        return;
      }

      setIsSuccess(true);
    } catch {
      setError("Unable to connect to server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className={`min-h-screen w-full flex items-center justify-center p-6 ${isDark ? "bg-dark-bg" : "bg-slate-50"}`}>
        <div className={`max-w-md w-full rounded-3xl p-10 shadow-xl text-center border ${isDark ? "bg-dark-surface border-dark-border" : "bg-white border-slate-100"}`}>
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 mx-auto">
            <Store className="h-10 w-10 text-emerald-600" />
          </div>
          <h2 className={`text-3xl font-extrabold mb-4 tracking-tight ${isDark ? "text-white" : "text-slate-900"} ${isKhmer ? "font-suwannaphum" : ""}`}>
            {t("auth.register.successTitle")}
          </h2>
          <p className={`mb-8 leading-relaxed ${isDark ? "text-[#8A8F98]" : "text-slate-500"} ${isKhmer ? "font-suwannaphum" : ""}`}>
            {t("auth.register.successDesc")}
          </p>
          <Link
            href="/"
            className={`block w-full py-4 rounded-xl font-bold shadow-lg transition-all ${isDark ? "bg-white text-black hover:bg-slate-100 shadow-white/5" : "bg-slate-900 text-white shadow-slate-900/20 hover:-translate-y-1 hover:shadow-xl"} ${isKhmer ? "font-suwannaphum" : ""}`}
          >
            {t("auth.register.returnHome")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <AuthLayout
      leftContent={
        <LeftPanelContent
          icon={<Store className="w-8 h-8" />}
          title={t("auth.register.startSellingTitle")}
          subtitle=""
          features={[
            {
              title: t("auth.register.feature1Title"),
              desc: t("auth.register.feature1Desc"),
            },
            {
              title: t("auth.register.feature2Title"),
              desc: t("auth.register.feature2Desc"),
            },
            {
              title: t("auth.register.feature3Title"),
              desc: t("auth.register.feature3Desc"),
            },
          ]}
          footerText="© 2026 PsarPulse KH • Developed at Kirirom Institute of Technology"
        />
      }
      backHref="/"
    >
      <header className="mb-10">
        <h1 className={`text-3xl sm:text-4xl font-extrabold tracking-tight mb-3 ${isDark ? "text-white" : "text-slate-900"} ${isKhmer ? "font-suwannaphum" : ""}`}>
          {t("auth.register.title")}
        </h1>
        <p className={`font-medium ${isDark ? "text-[#8A8F98]" : "text-slate-500"} ${isKhmer ? "font-suwannaphum" : ""}`}>
          {t("auth.register.subtitle")}
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormInput
            id="fullName"
            name="fullName"
            type="text"
            label={t("auth.register.fullName")}
            icon={User}
            placeholder={t("auth.register.fullNamePlaceholder")}
            value={formData.fullName}
            onChange={handleInputChange}
            required
            disabled={isLoading}
          />

          <FormInput
            id="phone"
            name="phone"
            type="tel"
            label={t("auth.register.phone")}
            icon={Phone}
            placeholder={t("auth.register.phonePlaceholder")}
            value={formData.phone}
            onChange={handleInputChange}
            required
            disabled={isLoading}
          />
        </div>

        <FormInput
          id="email"
          name="email"
          type="email"
          label={t("auth.register.email")}
          icon={Mail}
          placeholder={t("auth.register.emailPlaceholder")}
          value={formData.email}
          onChange={handleInputChange}
          required
          disabled={isLoading}
        />

        <FormInput
          id="storeName"
          name="storeName"
          type="text"
          label={t("auth.register.storeName")}
          icon={Store}
          placeholder={t("auth.register.storeNamePlaceholder")}
          value={formData.storeName}
          onChange={handleInputChange}
          required
          disabled={isLoading}
        />

        <div className="space-y-3">
          <label className={`block text-sm font-bold mb-2 flex items-center gap-2 ${isDark ? "text-slate-200" : "text-slate-700"} ${isKhmer ? "font-suwannaphum" : ""}`}>
            <Navigation className="w-4 h-4 text-psar-primary" />
            {isKhmer ? "កំណត់ទីតាំងតូបនៅលើផែនទី" : "Pin Stall Location on Map"}
          </label>
          <div className={`h-56 w-full rounded-2xl overflow-hidden border shadow-inner ${isDark ? "border-dark-border bg-slate-900" : "border-slate-200 bg-slate-100"}`}>
            <Map 
              height={224}
              defaultCenter={[11.5564, 104.9282]} 
              defaultZoom={13}
              onClick={({ latLng }) => {
                setFormData(prev => ({ 
                  ...prev, 
                  latitude: latLng[0].toFixed(8), 
                  longitude: latLng[1].toFixed(8) 
                }));
              }}
            >
              <Overlay anchor={[parseFloat(formData.latitude), parseFloat(formData.longitude)]}>
                <div className="relative flex flex-col items-center">
                  <div className="w-10 h-10 bg-psar-primary rounded-full border-4 border-white dark:border-slate-800 shadow-xl flex items-center justify-center animate-bounce">
                    <Store className="w-5 h-5 text-white" />
                  </div>
                  <div className="w-3 h-1 bg-black/20 rounded-full mt-1 blur-[1px]" />
                </div>
              </Overlay>
            </Map>
          </div>
          <div className="flex justify-between items-center px-1">
            <p className="text-[10px] text-slate-400 italic">
              {isKhmer 
                ? "សូមចុចលើផែនទីដើម្បីកំណត់ទីតាំងពិតប្រាកដរបស់តូបអ្នក" 
                : "Click on the map to mark the exact location of your stall"}
            </p>
            <div className="text-[10px] font-mono text-slate-400">
              {parseFloat(formData.latitude).toFixed(4)}, {parseFloat(formData.longitude).toFixed(4)}
            </div>
          </div>
        </div>

        <FormInput
          id="description"
          name="description"
          label={t("auth.register.businessDesc")}
          icon={FileText}
          placeholder={t("auth.register.descPlaceholder")}
          value={formData.description}
          onChange={handleInputChange}
          required
          disabled={isLoading}
          multiline
          rows={3}
        />

        <FormInput
          id="password"
          name="password"
          type="password"
          label={t("auth.register.securePassword")}
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
            className={`text-sm font-medium ${isDark ? "text-red-400" : "text-red-600"} ${isKhmer ? "font-suwannaphum" : ""}`}
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full flex items-center justify-center gap-2 bg-psar-primary text-white font-bold text-sm py-3 rounded-xl shadow-[0_8px_20px_-6px_rgba(41,178,141,0.5)] hover:bg-[#239979] hover:-translate-y-1 hover:shadow-[0_12px_24px_-8px_rgba(41,178,141,0.6)] active:translate-y-0 transition-all duration-300 disabled:opacity-70 mt-8 ${isKhmer ? "font-suwannaphum" : ""}`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {isKhmer ? "កំពុងដាក់ពាក្យសុំ..." : "Submitting Application..."}
            </>
          ) : (
            t("auth.register.submit")
          )}
        </button>
      </form>

      <p className={`mt-8 text-center font-medium ${isDark ? "text-[#8A8F98]" : "text-slate-500"} ${isKhmer ? "font-suwannaphum" : ""}`}>
        {t("auth.register.alreadyVendor")}{" "}
        <Link
          href="/login"
          className={`font-extrabold hover:text-psar-primary transition-colors underline decoration-slate-300 underline-offset-4 hover:decoration-psar-primary ${isDark ? "text-psar-primary decoration-white/20" : "text-slate-900"}`}
        >
          {t("auth.signup.signInAccount")}
        </Link>
      </p>
    </AuthLayout>
  );
}
