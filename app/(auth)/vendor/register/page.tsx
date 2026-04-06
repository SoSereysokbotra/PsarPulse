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
  Upload,
  LocateFixed,
} from "lucide-react";
import { Map as PigeonMap, Overlay, ZoomControl } from "pigeon-maps";
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
    businessCategory: "apparel",
    businessLogo: "",
    businessAddress: "",
    description: "",
    password: "",
    latitude: "",
    longitude: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  
  const [mapCenter, setMapCenter] = useState<[number, number]>([11.5564, 104.9282]);
  const [mapZoom, setMapZoom] = useState(13);
  const [isLocating, setIsLocating] = useState(false);

  const handleLocateMe = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setMapCenter([lat, lng]);
        setMapZoom(15);
        setFormData(prev => ({ 
          ...prev, 
          latitude: lat.toString(), 
          longitude: lng.toString() 
        }));
        setIsLocating(false);
      },
      () => {
        alert("Unable to retrieve your location");
        setIsLocating(false);
      }
    );
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const uploadData = new FormData();
      uploadData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });
      const result = await res.json();
      
      if (result.success && result.url) {
        setFormData(prev => ({ ...prev, businessLogo: result.url }));
      } else {
        setError("Failed to upload image. Please try again.");
      }
    } catch (error) {
      console.error("Upload failed", error);
      setError("Network error during upload.");
    } finally {
      setIsUploading(false);
    }
  };

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
        businessAddress: formData.businessAddress,
        businessCategory: formData.businessCategory,
        businessLogo: formData.businessLogo,
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
          <h2 className={`text-3xl font-extrabold mb-4 tracking-tight ${isDark ? "text-white" : "text-slate-900"} ${isKhmer ? "font-battambang" : ""}`}>
            {t("auth.register.successTitle")}
          </h2>
          <p className={`mb-8 leading-relaxed ${isDark ? "text-[#8A8F98]" : "text-slate-500"} ${isKhmer ? "font-battambang" : ""}`}>
            {t("auth.register.successDesc")}
          </p>
          <Link
            href="/"
            className={`block w-full py-4 rounded-xl font-bold shadow-lg transition-all ${isDark ? "bg-white text-black hover:bg-slate-100 shadow-white/5" : "bg-slate-900 text-white shadow-slate-900/20 hover:-translate-y-1 hover:shadow-xl"} ${isKhmer ? "font-battambang" : ""}`}
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
        <h1 className={`text-3xl sm:text-4xl font-extrabold tracking-tight mb-3 ${isDark ? "text-white" : "text-slate-900"} ${isKhmer ? "font-battambang" : ""}`}>
          {t("auth.register.title")}
        </h1>
        <p className={`font-medium ${isDark ? "text-[#8A8F98]" : "text-slate-500"} ${isKhmer ? "font-battambang" : ""}`}>
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

        <div className={`relative ${isDark ? "text-slate-200" : "text-slate-800"} mb-5`}>
          <label className={`block text-sm font-bold mb-2 ${isDark ? "text-slate-300" : "text-slate-700"} ${isKhmer ? "font-battambang" : ""}`}>
            Store Category
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Store className={`h-5 w-5 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
            </div>
            <select
              name="businessCategory"
              value={formData.businessCategory}
              onChange={(e) => setFormData(prev => ({ ...prev, businessCategory: e.target.value }))}
              disabled={isLoading}
              className={`w-full pl-11 pr-4 py-3 rounded-xl border text-sm font-medium transition-all appearance-none outline-none ${
                isDark
                  ? "bg-[#0B1121] border-white/10 text-white focus:border-psar-primary focus:ring-1 focus:ring-psar-primary disabled:bg-slate-900 disabled:opacity-50"
                  : "bg-white border-slate-200 text-slate-900 focus:border-psar-primary focus:ring-1 focus:ring-psar-primary disabled:bg-slate-50 disabled:opacity-50"
              }`}
            >
              <option value="apparel">Apparel</option>
              <option value="electronics">Electronics</option>
              <option value="household">Household items</option>
              <option value="services">Services</option>
              <option value="accessories">Accessories</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className={`relative ${isDark ? "text-slate-200" : "text-slate-800"} mb-5`}>
          <label className={`block text-sm font-bold mb-2 ${isDark ? "text-slate-300" : "text-slate-700"} ${isKhmer ? "font-battambang" : ""}`}>
            Shop Image
          </label>
          <div className={`flex items-center gap-4 p-4 border rounded-xl ${isDark ? "bg-[#0B1121] border-white/10" : "bg-white border-slate-200"}`}>
            <div className={`w-16 h-16 rounded-xl flex items-center justify-center shrink-0 border-2 overflow-hidden ${isDark ? "bg-[#1C2128] border-white/10" : "bg-slate-50 border-slate-100"}`}>
              {formData.businessLogo ? (
                <img src={formData.businessLogo} alt="Shop Preview" className="w-full h-full object-cover" />
              ) : (
                <Store className={`h-8 w-8 ${isDark ? "text-slate-600" : "text-slate-300"}`} />
              )}
            </div>
            <div className="flex-1">
              <label className={`inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold rounded-lg cursor-pointer transition-all ${
                isDark 
                  ? "bg-slate-800 hover:bg-slate-700 text-white" 
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              } ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}>
                {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {isUploading ? "Uploading..." : "Upload Image"}
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleFileUpload}
                  disabled={isUploading || isLoading}
                />
              </label>
              <p className={`text-xs mt-2 ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                Recommended size: 800x600px. Max size: 2MB.
              </p>
            </div>
          </div>
        </div>

        <FormInput
          id="businessAddress"
          name="businessAddress"
          type="text"
          label={t("auth.register.businessAddress")}
          icon={MapPin}
          placeholder={t("auth.register.addressPlaceholder")}
          value={formData.businessAddress}
          onChange={handleInputChange}
          required
          disabled={isLoading}
        />

        <div className={`relative ${isDark ? "text-slate-200" : "text-slate-800"} mb-5`}>
          <div className="flex items-center justify-between mb-2">
            <label className={`block text-sm font-bold ${isDark ? "text-slate-300" : "text-slate-700"} ${isKhmer ? "font-battambang" : ""}`}>
              Stall Location (Optional)
            </label>
            <button 
              type="button" 
              onClick={handleLocateMe}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors border ${
                isDark ? "bg-[#111216] hover:bg-[#1a1c23] border-white/10 text-psar-primary" : "bg-white hover:bg-slate-50 border-slate-200 text-psar-primary shadow-sm"
              }`}
            >
              <LocateFixed className={`w-3.5 h-3.5 ${isLocating ? "animate-pulse" : ""}`} />
              {isLocating ? "Locating..." : "Use My Location"}
            </button>
          </div>
          <div className={`h-[300px] w-full rounded-xl overflow-hidden border ${isDark ? "border-white/10" : "border-slate-200"} relative z-0`}>
            <PigeonMap
              center={mapCenter}
              zoom={mapZoom}
              onBoundsChanged={({ center, zoom }) => {
                setMapCenter(center);
                setMapZoom(zoom);
              }}
              onClick={({ latLng }) => {
                setFormData(prev => ({
                  ...prev,
                  latitude: latLng[0].toString(),
                  longitude: latLng[1].toString()
                }));
              }}
            >
              <ZoomControl />
              {formData.latitude && formData.longitude && (
                <Overlay anchor={[parseFloat(formData.latitude), parseFloat(formData.longitude)]} offset={[16, 32]}>
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white bg-psar-primary`}>
                      <Store className="w-4 h-4" />
                    </div>
                    <div className={`w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] -mt-1 border-t-psar-primary`}></div>
                  </div>
                </Overlay>
              )}
            </PigeonMap>
          </div>
          <p className={`text-xs mt-2 ${isDark ? "text-slate-500" : "text-slate-400"}`}>
            Click on the map to pin your exact stall location.
          </p>
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
            className={`text-sm font-medium ${isDark ? "text-red-400" : "text-red-600"} ${isKhmer ? "font-battambang" : ""}`}
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full flex items-center justify-center gap-2 bg-psar-primary text-white font-bold text-sm py-3 rounded-xl shadow-[0_8px_20px_-6px_rgba(41,178,141,0.5)] hover:bg-[#239979] hover:-translate-y-1 hover:shadow-[0_12px_24px_-8px_rgba(41,178,141,0.6)] active:translate-y-0 transition-all duration-300 disabled:opacity-70 mt-8 ${isKhmer ? "font-battambang" : ""}`}
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

      <p className={`mt-8 text-center font-medium ${isDark ? "text-[#8A8F98]" : "text-slate-500"} ${isKhmer ? "font-battambang" : ""}`}>
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
