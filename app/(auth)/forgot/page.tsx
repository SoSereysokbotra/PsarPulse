"use client";

import React, { useState } from "react";
import { Mail, KeyRound, Loader2 } from "lucide-react";
import {
  AuthLayout,
  LeftPanelContent,
  FormInput,
  SuccessCard,
} from "@/components/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitted(true);
    setIsLoading(false);
  };

  return (
    <AuthLayout
      leftContent={
        <LeftPanelContent
          icon={<KeyRound className="w-8 h-8" />}
          title="Secure your vendor account."
          subtitle="Don't worry! It happens to the best of us. We'll help you get back to managing your stall."
          footerText="© 2026 PsarPulse KH • Developed at Kirirom Institute of Technology"
        />
      }
      backHref="/login"
    >
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
              className="w-full flex items-center justify-center gap-2 bg-psar-primary text-white font-bold text-sm py-3 rounded-xl shadow-xl hover:bg-[#239979] hover:-translate-y-1 active:translate-y-0 transition-all duration-300 disabled:opacity-70"
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
        <SuccessCard
          title="Check your email"
          message={`We've sent a password reset link to ${email}`}
          buttonText="Back to Sign In"
          buttonHref="/login"
        />
      )}
    </AuthLayout>
  );
}
