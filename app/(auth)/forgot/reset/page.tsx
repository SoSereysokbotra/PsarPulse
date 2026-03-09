"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Lock,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";

/**
 * REUSABLE COMPONENTS (Matching your existing design system)
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
          className="block w-full pl-11 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#29B28D] focus:ring-0 outline-none transition-all duration-200 min-h-[56px]"
          {...props}
        />
      </div>
    </div>
  );
};

export default function ResetPasswordPage() {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setIsLoading(true);
    try {
      // Logic for updating password in the database [cite: 171]
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsSuccess(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row font-sans bg-white selection:bg-[#29B28D] selection:text-white">
      {/* --- LEFT SIDE: Brand & Security Focus --- */}
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
          <div className="w-16 h-16 rounded-2xl bg-[#29B28D]/20 flex items-center justify-center text-[#29B28D] mb-6">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-4xl font-extrabold leading-[1.2] mb-4">
            Reset your <br />
            <span className="text-[#29B28D]">access credentials.</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-sm">
            Choose a strong password to keep your sales data and business
            insights safe from unauthorized access.
          </p>
        </div>

        <p className="relative z-10 text-slate-500 text-sm font-medium">
          © 2026 PsarPulse KH • Developed at Kirirom Institute of Technology
          [cite: 6]
        </p>
      </div>

      {/* --- RIGHT SIDE: Reset Form --- */}
      <div className="flex-1 flex flex-col justify-center relative bg-white py-12 px-6 sm:px-12 lg:px-20 xl:px-32">
        {!isSuccess && (
          <div className="absolute top-8 left-6 lg:left-12">
            <Link
              href="/forgot-password/verify"
              className="text-slate-400 hover:text-slate-900 transition-colors flex items-center font-bold"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Link>
          </div>
        )}

        <div className="w-full max-w-md mx-auto">
          {!isSuccess ? (
            <>
              <header className="mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
                  New Password
                </h1>
                <p className="text-slate-500 font-medium font-khmer text-lg">
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

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-4 flex items-center justify-center gap-2 bg-[#29B28D] text-white font-bold text-lg py-5 rounded-2xl shadow-xl hover:bg-[#239979] hover:-translate-y-1 active:translate-y-0 transition-all duration-300 disabled:opacity-70"
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
            <div className="text-center animate-in fade-in zoom-in duration-500">
              <div className="w-20 h-20 bg-[#29B28D]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-[#29B28D]" />
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-4">
                Success!
              </h2>
              <p className="text-slate-500 font-medium mb-10">
                Your password has been reset successfully. You can now use your
                new password to sign in.
              </p>
              <Link
                href="/login"
                className="block w-full bg-[#29B28D] text-white font-bold text-lg py-5 rounded-2xl shadow-xl hover:bg-[#239979] transition-all"
              >
                Go to Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
