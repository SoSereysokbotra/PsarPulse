"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { User, Mail, Lock, Loader2, Star, CheckCircle2 } from "lucide-react";
import { AuthLayout, LeftPanelContent, FormInput } from "@/components/auth";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/utils/client-auth";

type SignupResponse = {
  success: boolean;
  message?: string;
};

function VipRegistrationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [error, setError] = useState("");
  const [tokenError, setTokenError] = useState("");

  useEffect(() => {
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

        if (data.success && data.role === "vendor") {
          setIsTokenValid(true);
          setFormData((prev) => ({ ...prev, email: data.email }));
        } else {
          setTokenError(
            data.message ||
              "This invitation is not valid for VIP vendor registration.",
          );
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
        role: "vendor",
        token,
      })) as SignupResponse;

      if (!result.success) {
        setError(result.message || "Registration failed. Please try again.");
        return;
      }

      setIsSuccess(true);
      setTimeout(() => {
        router.push("/verify");
      }, 1200);
    } catch {
      setError("Unable to connect to server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="w-full flex justify-center items-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-[#29B28D]" />
      </div>
    );
  }

  if (!token || !isTokenValid) {
    return (
      <div className="w-full max-w-md mx-auto bg-white rounded-3xl p-10 shadow-xl border border-slate-100 text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6 mx-auto">
          <Star className="h-10 w-10 text-red-500" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">
          Invalid Invitation
        </h2>
        <p className="text-slate-500 mb-8 leading-relaxed">
          {tokenError ||
            "The invitation link is missing, expired, or has already been used."}
        </p>
        <Link
          href="/"
          className="block w-full py-4 bg-slate-900 text-white rounded-xl font-bold shadow-lg shadow-slate-900/20 hover:-translate-y-1 hover:shadow-xl transition-all"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="w-full max-w-md mx-auto bg-white rounded-3xl p-10 shadow-xl border border-slate-100 text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="w-20 h-20 bg-[#29B28D]/20 rounded-full flex items-center justify-center mb-6 mx-auto">
          <CheckCircle2 className="h-10 w-10 text-[#29B28D]" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">
          Welcome to Premium
        </h2>
        <p className="text-slate-500 mb-8 leading-relaxed">
          Your VIP Vendor account is created. Please verify your email to finish
          activation.
        </p>
        <p className="text-sm text-slate-500">Redirecting to verification...</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#29B28D]/20 text-[#29B28D] text-xs font-bold mb-4">
          <Star className="w-3 h-3 fill-[#29B28D] text-[#29B28D]" />
          VIP Invitation
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          Complete Your Setup
        </h1>
        <p className="text-slate-500 font-medium">
          Set up your VIP vendor profile. Your email has been verified via the
          secure invitation link.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-5">
          <FormInput
            id="email"
            name="email"
            type="email"
            label="Verified Email"
            icon={Mail}
            value={formData.email}
            readOnly
            disabled
          />

          <FormInput
            id="fullName"
            name="fullName"
            type="text"
            label="Full Name"
            icon={User}
            placeholder="e.g. Sokha Meas"
            value={formData.fullName}
            onChange={handleInputChange}
            required
            disabled={isLoading}
          />

          <FormInput
            id="password"
            name="password"
            type="password"
            label="Create Password"
            icon={Lock}
            placeholder="Secure password for your account"
            value={formData.password}
            onChange={handleInputChange}
            required
            minLength={8}
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !token || !isTokenValid}
          className="w-full flex items-center justify-center gap-2 bg-[#29B28D] text-white font-bold text-sm py-3 rounded-xl shadow-[0_8px_20px_-6px_rgba(41,178,141,0.5)] hover:bg-[#239979] hover:-translate-y-1 hover:shadow-[0_12px_24px_-8px_rgba(41,178,141,0.6)] active:translate-y-0 transition-all duration-300 disabled:opacity-70"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Creating Account...
            </>
          ) : (
            "Complete Registration"
          )}
        </button>

        {error && <p className="text-sm font-medium text-red-600">{error}</p>}
      </form>
    </>
  );
}

export default function VipVendorRegisterPage() {
  return (
    <AuthLayout
      leftContent={
        <LeftPanelContent
          icon={<Star className="w-8 h-8 fill-[#29B28D] text-[#29B28D]" />}
          title="Welcome to the Premium Experience."
          subtitle=""
          features={[
            {
              title: "Advanced Analytics",
              desc: "Deep insights into shopper behavior and revenue forecasting.",
            },
            {
              title: "Priority Placement",
              desc: "Your stall shows up first when customers search for products.",
            },
            {
              title: "Dedicated Support",
              desc: "24/7 direct line to our market management team.",
            },
          ]}
          footerText="Premium Vendor Access"
        />
      }
      showBack={false}
    >
      <Suspense
        fallback={
          <div className="w-full flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-[#29B28D]" />
          </div>
        }
      >
        <VipRegistrationForm />
      </Suspense>
    </AuthLayout>
  );
}
