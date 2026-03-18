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
} from "lucide-react";
import { AuthLayout, LeftPanelContent, FormInput } from "@/components/auth";

export default function VendorRegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    storeName: "",
    businessAddress: "",
    description: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSuccess(true);
    setIsLoading(false);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-10 shadow-xl text-center border border-slate-100">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 mx-auto">
            <Store className="h-10 w-10 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Application Received
          </h2>
          <p className="text-slate-500 mb-8 leading-relaxed">
            Thank you for applying to become a vendor on PsarPulse! Your request
            is currently pending admin review. We will notify you at{" "}
            <span className="font-semibold text-slate-700">
              {formData.email}
            </span>{" "}
            once approved.
          </p>
          <Link
            href="/"
            className="block w-full py-4 bg-slate-900 text-white rounded-xl font-bold shadow-lg shadow-slate-900/20 hover:-translate-y-1 hover:shadow-xl transition-all"
          >
            Return to Home
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
          title="Start selling on PsarPulse with a Free Vendor Account."
          subtitle=""
          features={[
            {
              title: "Reach More Customers",
              desc: "Get your products in front of thousands of daily shoppers.",
            },
            {
              title: "Easy Management",
              desc: "Intuitive tools to manage inventory, sales, and analytics.",
            },
            {
              title: "Secure Platform",
              desc: "Reliable and secure infrastructure for market operations.",
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
          Become a Vendor
        </h1>
        <p className="text-slate-500 font-medium">
          Submit your details to register as a new vendor on the platform.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
            id="phone"
            name="phone"
            type="tel"
            label="Phone Number"
            icon={Phone}
            placeholder="012 345 678"
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
          label="Email Address"
          icon={Mail}
          placeholder="contact@store.com"
          value={formData.email}
          onChange={handleInputChange}
          required
          disabled={isLoading}
        />

        <FormInput
          id="storeName"
          name="storeName"
          type="text"
          label="Store Name"
          icon={Store}
          placeholder="e.g. Sokha Fashion Shop"
          value={formData.storeName}
          onChange={handleInputChange}
          required
          disabled={isLoading}
        />

        <FormInput
          id="businessAddress"
          name="businessAddress"
          type="text"
          label="Business Address / Stall No."
          icon={MapPin}
          placeholder="e.g. Stall #12, Central Market"
          value={formData.businessAddress}
          onChange={handleInputChange}
          required
          disabled={isLoading}
        />

        <FormInput
          id="description"
          name="description"
          label="Business Description"
          icon={FileText}
          placeholder="Describe what you sell..."
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
          label="Secure Password"
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
          className="w-full flex items-center justify-center gap-2 bg-psar-primary text-white font-bold text-sm py-3 rounded-xl shadow-[0_8px_20px_-6px_rgba(41,178,141,0.5)] hover:bg-[#239979] hover:-translate-y-1 hover:shadow-[0_12px_24px_-8px_rgba(41,178,141,0.6)] active:translate-y-0 transition-all duration-300 disabled:opacity-70 mt-8"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Submitting Application...
            </>
          ) : (
            "Submit Application"
          )}
        </button>
      </form>

      <p className="mt-8 text-center text-slate-500 font-medium">
        Already a vendor?{" "}
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
