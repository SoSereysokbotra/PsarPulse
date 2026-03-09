"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Loader2, KeyRound, CheckCircle2 } from "lucide-react";

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

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Logic for password reset request [cite: 183]
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsSubmitted(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row font-sans bg-white selection:bg-[#29B28D] selection:text-white">
      {/* --- LEFT SIDE: Brand/Context --- */}
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
            <KeyRound className="w-8 h-8" />
          </div>
          <h2 className="text-4xl font-extrabold leading-[1.2] mb-4">
            Secure your <br />
            <span className="text-[#29B28D]">vendor account.</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-sm">
            Don't worry! It happens to the best of us. We'll help you get back
            to managing your stall in no time.
          </p>
        </div>

        <p className="relative z-10 text-slate-500 text-sm font-medium">
          © 2026 PsarPulse KH • Developed at KIT
        </p>
      </div>

      {/* --- RIGHT SIDE: Reset Form --- */}
      <div className="flex-1 flex flex-col justify-center relative bg-white py-12 px-6 sm:px-12 lg:px-20 xl:px-32">
        <div className="absolute top-8 left-6 lg:left-12">
          <Link
            href="/login"
            className="text-slate-400 hover:text-slate-900 transition-colors flex items-center font-bold"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Sign In
          </Link>
        </div>

        <div className="w-full max-w-md mx-auto">
          {!isSubmitted ? (
            <>
              <header className="mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
                  Forgot Password?
                </h1>
                <p className="text-slate-500 font-medium font-khmer text-lg">
                  ភ្លេចពាក្យសម្ងាត់? បញ្ចូលអ៊ីមែលរបស់អ្នកដើម្បីបន្ត។
                </p>
              </header>

              <form onSubmit={handleSubmit} className="space-y-6">
                <FormInput
                  id="email"
                  name="email"
                  type="email"
                  label="Email Address"
                  khmerLabel="អ៊ីមែល"
                  icon={Mail}
                  placeholder="vendor@psarpulse.kh"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 bg-[#29B28D] text-white font-bold text-lg py-5 rounded-2xl shadow-xl hover:bg-[#239979] hover:-translate-y-1 active:translate-y-0 transition-all duration-300 disabled:opacity-70"
                >
                  {isLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    "Send Reset Link"
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
                Check your email
              </h2>
              <p className="text-slate-500 font-medium mb-8">
                We've sent a password reset link to <br />
                <span className="text-slate-900 font-bold">{email}</span>
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="text-[#29B28D] font-extrabold hover:underline"
              >
                Didn't receive the email? Try again
              </button>
            </div>
          )}

          <p className="mt-10 text-center text-slate-500 font-medium">
            Remember your password?{" "}
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
