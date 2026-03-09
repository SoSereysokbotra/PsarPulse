"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  User,
  Mail,
  Lock,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  TrendingUp,
  Smartphone,
  CloudOff,
} from "lucide-react";

/**
 * REUSABLE COMPONENTS
 */

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
          <span className="text-[#29B28D] font-khmer ml-1 font-normal">
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
          className="block w-full pl-11 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#29B28D] focus:ring-0 outline-none transition-all duration-200 min-h-[56px]" // min-h for 44px+ touch target
          {...props}
        />
      </div>
    </div>
  );
};

export default function SignupPage() {
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
    try {
      // Logic for registration validation and duplicate account checking [cite: 168, 169]
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Account Created Successfully:", formData);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row font-sans bg-white selection:bg-[#29B28D] selection:text-white">
      {/* --- LEFT SIDE: Brand & Value Prop (SRS 1.1 & 2.1) --- */}
      <div className="hidden lg:flex lg:w-5/12 bg-slate-900 relative overflow-hidden flex-col justify-between p-12 text-white border-r-4 border-[#29B28D]">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#29B28D] rounded-full mix-blend-multiply filter blur-[128px] opacity-30"></div>

        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#29B28D] flex items-center justify-center font-bold text-white text-2xl shadow-lg">
              P
            </div>
            <span className="font-extrabold text-2xl tracking-tight">
              PsarPulse KH
            </span>
          </Link>
        </div>

        <div className="relative z-10 my-auto">
          <h2 className="text-4xl xl:text-5xl font-extrabold leading-[1.2] mb-8">
            Modernize your <br />
            <span className="text-[#29B28D]">market stall operations.</span>
          </h2>

          <div className="space-y-8">
            <FeatureItem
              icon={TrendingUp}
              title="Real-time Analytics"
              desc="Track daily sales, expenses, and profits automatically."
            />
            <FeatureItem
              icon={CloudOff}
              title="Offline-First Logging"
              desc="Record transactions even without internet signal."
            />
            <FeatureItem
              icon={Smartphone}
              title="Khmer Interface"
              desc="Designed specifically for local Cambodian vendors."
            />
          </div>
        </div>

        <p className="relative z-10 text-slate-500 text-sm font-medium">
          © 2026 PsarPulse KH • Developed at Kirirom Institute of Technology
        </p>
      </div>

      {/* --- RIGHT SIDE: Signup Form (SRS 3.1) --- */}
      <div className="flex-1 flex flex-col justify-center relative bg-white py-12 px-6 sm:px-12 lg:px-20 xl:px-32">
        {/* Language & Navigation */}
        <div className="absolute top-8 left-6 right-6 lg:left-12 lg:right-12 flex justify-between items-center">
          <Link
            href="/"
            className="text-slate-400 hover:text-slate-900 transition-colors flex items-center font-bold"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Link>
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button className="px-4 py-2 bg-white text-slate-900 rounded-lg font-bold shadow-sm text-xs">
              EN
            </button>
            <button className="px-4 py-2 text-slate-500 font-khmer text-xs">
              ខ្មែរ
            </button>
          </div>
        </div>

        <div className="w-full max-w-md mx-auto">
          <header className="mb-10 mt-8 lg:mt-0">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
              Create Account
            </h1>
            <p className="text-slate-500 font-medium font-khmer text-lg">
              ចុះឈ្មោះដើម្បីគ្រប់គ្រងអាជីវកម្មរបស់អ្នក
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-5">
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
              placeholder="vendor@psarpulse.kh"
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
              placeholder="Min. 8 characters"
              value={formData.password}
              onChange={handleInputChange}
              required
              minLength={8}
              disabled={isLoading}
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 flex items-center justify-center gap-2 bg-[#29B28D] text-white font-bold text-lg py-5 rounded-2xl shadow-xl hover:bg-[#239979] hover:-translate-y-1 active:translate-y-0 transition-all duration-300 disabled:opacity-70"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                "Start Your Free Trial"
              )}
            </button>
          </form>

          {/* OAUTH SECTION */}
          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-400 font-medium">
                Quick Sign Up
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <SocialButton
              icon="google"
              onClick={() => {}}
              disabled={isLoading}
            />
            <SocialButton
              icon="facebook"
              onClick={() => {}}
              disabled={isLoading}
            />
            <SocialButton
              icon="tiktok"
              onClick={() => {}}
              disabled={isLoading}
            />
          </div>

          <p className="mt-10 text-center text-slate-500 font-medium">
            Already using PsarPulse?{" "}
            <Link
              href="/login"
              className="text-[#29B28D] font-extrabold hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * HELPER COMPONENTS
 */

function FeatureItem({
  icon: Icon,
  title,
  desc,
}: {
  icon: any;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex gap-5 items-start">
      <div className="mt-1 w-12 h-12 rounded-2xl bg-[#29B28D]/10 flex items-center justify-center flex-shrink-0 text-[#29B28D]">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h4 className="font-bold text-xl mb-1">{title}</h4>
        <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function SocialButton({
  icon,
  onClick,
  disabled,
}: {
  icon: string;
  onClick: () => void;
  disabled: boolean;
}) {
  const icons: any = {
    google: (
      <path
        fill="#EA4335"
        d="M12.48 10.92v3.28h7.84c-.24 1.84-.9 3.47-1.92 4.64-1.16 1.16-2.67 2.01-4.51 2.01-3.6 0-6.53-2.93-6.53-6.53s2.93-6.53 6.53-6.53c1.94 0 3.69.83 4.93 2.18l2.3-2.3C19.17 5.62 16.1 4 12.48 4 6.7 4 2 8.7 2 14.48s4.7 10.48 10.48 10.48c3.14 0 5.51-1.04 7.37-2.93 1.91-1.91 2.51-4.6 2.51-6.84 0-.67-.05-1.32-.16-1.97h-9.71z"
      />
    ),
    facebook: (
      <path
        fill="#1877F2"
        d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
      />
    ),
    tiktok: (
      <path
        fill="currentColor"
        d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"
      />
    ),
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex items-center justify-center py-4 px-4 border-2 border-slate-50 rounded-2xl hover:bg-slate-50 hover:border-slate-100 transition-all text-slate-600 disabled:opacity-50"
    >
      <svg className="w-6 h-6" viewBox="0 0 24 24">
        {icons[icon]}
      </svg>
    </button>
  );
}
