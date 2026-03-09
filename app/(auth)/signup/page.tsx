"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  User,
  Mail,
  Lock,
  ArrowLeft,
  Quote,
  Sparkles,
  Loader2,
} from "lucide-react";

// 1. Reusable Input Component to keep code DRY and maintainable
interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  khmerLabel?: string;
  icon: React.ElementType;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  khmerLabel,
  icon: Icon,
  id,
  ...props
}) => {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-bold text-slate-900 mb-2"
      >
        {label}{" "}
        {khmerLabel && (
          <span className="text-slate-400 font-khmer ml-1 font-normal">
            / {khmerLabel}
          </span>
        )}
      </label>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-slate-400 group-focus-within:text-[#29B28D] transition-colors" />
        </div>
        <input
          id={id}
          className="block w-full pl-11 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#29B28D] focus:ring-0 outline-none transition-all duration-200"
          {...props}
        />
      </div>
    </div>
  );
};

export default function SignupPageAlt() {
  // 2. Form State Management
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

  // 3. Form Submission Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call to backend
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Form submitted:", formData);
      // Handle success (e.g., redirect to dashboard or show success toast)
    } catch (error) {
      console.error("Signup failed:", error);
      // Handle error (e.g., show error message to user)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row font-sans bg-white selection:bg-[#29B28D] selection:text-white">
      {/* --- LEFT SIDE: Brand & Testimonial --- */}
      <div className="hidden lg:flex lg:w-5/12 bg-slate-900 relative overflow-hidden flex-col justify-between p-12 text-white">
        {/* Abstract Background Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#29B28D] rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#166b53] rounded-full mix-blend-multiply filter blur-[128px] opacity-40"></div>

        {/* Brand Header */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-[#29B28D] flex items-center justify-center font-bold text-white text-xl transition-transform group-hover:scale-105">
              P
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-white">
              PsarPulse KH
            </span>
          </Link>
        </div>

        {/* Center Content: Mission & Testimonial */}
        <div className="relative z-10 my-auto pt-12">
          <h2 className="text-4xl lg:text-5xl font-extrabold leading-[1.1] tracking-tight mb-12">
            Grow your market stall with{" "}
            <span className="text-[#29B28D]">confidence.</span>
          </h2>

          {/* Key Benefits List */}
          <div className="space-y-6 relative z-10">
            {[
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
            ].map((item, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="mt-1 w-5 h-5 rounded-full bg-[#29B28D]/20 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-[#29B28D]" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg">{item.title}</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Links */}
        <div className="relative z-10 flex gap-6 text-sm font-medium text-slate-500">
          <Link href="#" className="hover:text-white transition-colors">
            Privacy
          </Link>
          <Link href="#" className="hover:text-white transition-colors">
            Terms
          </Link>
          <Link href="#" className="hover:text-white transition-colors">
            Support
          </Link>
        </div>
      </div>

      {/* --- RIGHT SIDE: Form Section --- */}
      <div className="flex-1 flex flex-col justify-center relative bg-white py-10 px-6 sm:px-12 lg:px-24 xl:px-32">
        {/* Top Navigation */}
        <div className="absolute top-6 left-6 right-6 lg:left-12 lg:right-12 flex justify-between items-center text-sm">
          <Link
            href="/"
            className="text-slate-400 hover:text-slate-900 transition-colors flex items-center font-bold"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Link>
          <div className="flex bg-slate-100 p-1 rounded-full">
            <button
              type="button"
              className="px-4 py-1.5 bg-white text-slate-900 rounded-full font-bold shadow-sm transition-all"
            >
              EN
            </button>
            <button
              type="button"
              className="px-4 py-1.5 text-slate-500 hover:text-slate-900 rounded-full font-khmer font-medium transition-all"
            >
              ខ្មែរ
            </button>
          </div>
        </div>

        {/* Mobile Logo (Hidden on Desktop) */}
        <div className="lg:hidden mt-12 mb-8">
          <div className="w-12 h-12 rounded-full bg-[#29B28D] flex items-center justify-center font-bold text-white text-2xl mb-4">
            P
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">
            PsarPulse KH
          </h2>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-md mx-auto lg:mx-0 mt-8 lg:mt-0">
          <div className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
              Get Started
            </h1>
            <p className="text-slate-500 font-medium">
              Create your free account to start managing your daily sales and
              inventory.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
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
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-[#29B28D] text-white font-bold text-lg py-4 rounded-full shadow-[0_8px_20px_-6px_rgba(41,178,141,0.5)] hover:bg-[#239979] hover:-translate-y-1 hover:shadow-[0_12px_24px_-8px_rgba(41,178,141,0.6)] active:translate-y-0 active:shadow-none transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
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

          {/* Social Login Section */}
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
              onClick={() => console.log("Google signup")}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-sm font-medium text-slate-700">Google</span>
            </button>

            {/* Facebook */}
            <button
              type="button"
              onClick={() => console.log("Facebook signup")}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span className="text-sm font-medium text-slate-700">
                Facebook
              </span>
            </button>

            {/* TikTok */}
            <button
              type="button"
              onClick={() => console.log("TikTok signup")}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
              </svg>
              <span className="text-sm font-medium text-slate-700">TikTok</span>
            </button>
          </div>
          {/* Login Link */}
          <div className="mt-8 pt-8 border-t border-slate-100">
            <p className="text-slate-500 text-center font-medium">
              Already a member?{" "}
              <Link
                href="/login"
                className="text-slate-900 font-extrabold hover:text-[#29B28D] transition-colors underline decoration-slate-300 underline-offset-4 hover:decoration-[#29B28D]"
              >
                Sign in to your account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
