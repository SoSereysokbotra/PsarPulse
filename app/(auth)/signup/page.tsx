"use client";

import React, { useState } from "react";
import Link from "next/link";
import { User, Mail, Lock, ArrowLeft, Loader2 } from "lucide-react";
import { AuthLayout, LeftPanelContent, FormInput } from "@/components/auth";

export default function SignupPageAlt() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Alt signup:", formData);
    setIsLoading(false);
  };

  return (
    <AuthLayout
      leftContent={
        <LeftPanelContent
          icon={<User className="w-8 h-8" />}
          title="Grow your market stall with confidence."
          subtitle=""
          features={[
            {
              title: "Real-time Tracking",
              desc: "Monitor sales as they happen at your stall.",
            },
            {
              title: "Inventory Alerts",
              desc: "Get notified before you run out of stock.",
            },
            {
              title: "Offline Mode",
              desc: "Works even when the market signal is weak.",
            },
          ]}
          footerText="© 2026 PsarPulse KH • Developed at Kirirom Institute of Technology"
        />
      }
      showLangToggle
      backHref="/"
    >
      <header className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          Get Started
        </h1>
        <p className="text-slate-500 font-medium">
          Create your free account to start managing your daily sales and
          inventory.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput
          id="fullName"
          name="fullName"
          type="text"
          label="Full Name"
          khmerLabel="ឈ្មោះ​ពេញ"
          icon={User}
          placeholder="e.g. Sokha Meas"
          value={formData.fullName}
          onChange={handleInputChange}
          required
          disabled={isLoading}
        />

        <FormInput
          id="email"
          name="email"
          type="email"
          label="Email Address"
          khmerLabel="អ៊ីមែល"
          icon={Mail}
          placeholder="vendor@market.com"
          value={formData.email}
          onChange={handleInputChange}
          required
          disabled={isLoading}
        />

        <FormInput
          id="password"
          name="password"
          type="password"
          label="Password"
          khmerLabel="ពាក្យសម្ងាត់"
          icon={Lock}
          placeholder="Create a strong password"
          value={formData.password}
          onChange={handleInputChange}
          required
          minLength={8}
          disabled={isLoading}
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 bg-psar-primary text-white font-bold text-sm py-3 rounded-xl shadow-[0_8px_20px_-6px_rgba(41,178,141,0.5)] hover:bg-[#239979] hover:-translate-y-1 hover:shadow-[0_12px_24px_-8px_rgba(41,178,141,0.6)] active:translate-y-0 transition-all duration-300 disabled:opacity-70"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Creating Account...
            </>
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      {/* Social login section */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-slate-400 font-medium">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {/* Google */}
        <button
          type="button"
          onClick={() => console.log("Google login")}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100 transition-all disabled:opacity-50"
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
          <span className="text-sm font-medium text-slate-700">Google</span>
        </button>

        {/* Facebook */}
        <button
          type="button"
          onClick={() => console.log("Facebook login")}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100 transition-all disabled:opacity-50"
        >
          <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          <span className="text-sm font-medium text-slate-700">Facebook</span>
        </button>

        {/* TikTok */}
        <button
          type="button"
          onClick={() => console.log("TikTok login")}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100 transition-all disabled:opacity-50"
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
          <span className="text-sm font-medium text-slate-700">TikTok</span>
        </button>
      </div>

      <p className="mt-8 text-center text-slate-500 font-medium">
        Already a member?{" "}
        <Link
          href="/login"
          className="text-slate-900 font-extrabold hover:text-psar-primary transition-colors underline decoration-slate-300 underline-offset-4 hover:decoration-psar-primary"
        >
          Sign in to your account
        </Link>
      </p>
    </AuthLayout>
  );
}
