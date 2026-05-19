"use client";

import React, { useState } from "react";
import {
  Star,
  MessageSquare,
  Clock,
  LayoutDashboard,
  CircleDollarSign,
  Receipt,
  Users,
  Lock,
} from "lucide-react";
import VendorSidebar from "@/components/vendor/VendorSidebar";
import VendorTopbar from "@/components/vendor/VendorTopbar";
import Link from "next/link";
import { useLanguage } from "@/components/providers/LanguageProvider";

const DEMO_REVIEWS = [
  {
    id: "1",
    rating: 5,
    comment: "Great products and very friendly service! Will definitely come back.",
    createdAt: "2026-05-10T08:00:00Z",
    user: { fullName: "Sophea Mao" },
  },
  {
    id: "2",
    rating: 4,
    comment: "Good quality items at a fair price. The stall is well organised.",
    createdAt: "2026-05-08T14:30:00Z",
    user: { fullName: "Dara Keo" },
  },
  {
    id: "3",
    rating: 5,
    comment: "Fresh products every day. Highly recommended for market shoppers!",
    createdAt: "2026-05-06T09:15:00Z",
    user: { fullName: "Sreymom Chan" },
  },
  {
    id: "4",
    rating: 3,
    comment: "Decent selection but could use more variety. Nice staff though.",
    createdAt: "2026-05-03T11:00:00Z",
    user: { fullName: "Virak Pich" },
  },
];

const averageRating = (
  DEMO_REVIEWS.reduce((acc, r) => acc + r.rating, 0) / DEMO_REVIEWS.length
).toFixed(1);

export default function GuestReviewsPage() {
  const { language } = useLanguage();
  const isKhmer = language === "km";
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const navLinks = [
    { icon: LayoutDashboard, title: "Dashboard", khmerTitle: "ផ្ទាំងគ្រប់គ្រង", href: "/guest" },
    { icon: CircleDollarSign, title: "Sales", khmerTitle: "ការលក់", href: "/guest/sales" },
    { icon: Receipt, title: "Expenses", khmerTitle: "ចំណាយ", href: "/guest/expenses" },
    { icon: Users, title: "Customers", khmerTitle: "អតិថិជន", href: "/guest/customers" },
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f0f2f5] text-slate-900 pt-[36px]">
      {/* Guest Mode Strip */}
      <div className="fixed top-0 left-0 right-0 z-[100] border-b border-slate-200 py-2 text-center flex items-center justify-center h-[36px] bg-white">
        <span className="text-xs text-slate-600">
          {isKhmer
            ? "អ្នកកំពុងស្ថិតក្នុង Guest Mode — ទិន្នន័យនឹងមិនត្រូវបានរក្សាទុកទេ"
            : "You are in Guest Mode — data will not be saved"}
        </span>
        <button
          onClick={() => (window.location.href = "/signup")}
          className="ml-3 text-[#29B28D] text-xs font-semibold bg-transparent border-0 cursor-pointer hover:underline"
        >
          {isKhmer ? "បង្កើតគណនី →" : "Create account →"}
        </button>
      </div>

      {/* Sidebar */}
      <VendorSidebar
        plan="free"
        isGuest={true}
        onLockedClick={() => {}}
        navLinks={navLinks}
        currentPath="/guest/reviews"
        collapsed={isSidebarCollapsed}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <VendorTopbar
          title="Customer Reviews"
          isSidebarCollapsed={isSidebarCollapsed}
          setIsSidebarCollapsed={setIsSidebarCollapsed}
          setIsMobileSidebarOpen={setIsSidebarOpen}
          rightActions={
            <button
              onClick={() => (window.location.href = "/signup")}
              className="hidden sm:block px-4 py-[9px] rounded-[10px] bg-[#29B28D] text-white text-[13px] font-bold hover:bg-[#239979] transition-colors shadow-[0_2px_14px_rgba(41,178,141,0.28)] border-0 cursor-pointer"
            >
              {isKhmer ? "បង្កើតគណនី" : "Create Account"}
            </button>
          }
        />

        <div className="flex-1 overflow-y-auto px-5 lg:px-9 py-[26px]">
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 mb-1">
                  {isKhmer ? "ការវាយតម្លៃអតិថិជន" : "Customer Reviews"}
                </h1>
                <p className="text-slate-500 text-sm flex items-center gap-1.5">
                  <Lock size={12} className="text-[#29B28D]" />
                  {isKhmer
                    ? "ទិន្នន័យគំរូ — ការវាយតម្លៃពិតប្រាកដចំណាយគណនីដើម្បីបង្ហាញ"
                    : "Demo data — real reviews appear after creating an account"}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Average Rating */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-slate-900 mb-2">{averageRating}</span>
                <div className="flex text-yellow-400 mb-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={20}
                      className={s <= parseFloat(averageRating) ? "fill-current" : "text-slate-200"}
                    />
                  ))}
                </div>
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                  {isKhmer ? "ការវាយតម្លៃមធ្យម" : "Average Rating"}
                </span>
              </div>

              {/* Total Reviews */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-slate-900 mb-2">{DEMO_REVIEWS.length}</span>
                <MessageSquare size={24} className="text-[#29B28D] mb-2" />
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                  {isKhmer ? "ការវាយតម្លៃសរុប" : "Total Reviews"}
                </span>
              </div>

              {/* Satisfaction */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-[#29B28D] mb-2">100%</span>
                <Star size={24} className="text-yellow-400 fill-current mb-2" />
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                  {isKhmer ? "ការពេញចិត្ត" : "Satisfaction"}
                </span>
              </div>
            </div>

            {/* Review list */}
            <div className="space-y-4">
              {DEMO_REVIEWS.map((review) => (
                <div
                  key={review.id}
                  className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold shrink-0">
                        {review.user.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{review.user.fullName}</h4>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                          <Clock size={12} />
                          {new Date(review.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex text-yellow-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={14}
                          className={s <= review.rating ? "fill-current" : "text-slate-200"}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="rounded-2xl border border-[#29B28D]/20 bg-[rgba(41,178,141,0.05)] p-6 text-center">
              <MessageSquare size={32} className="mx-auto text-[#29B28D] mb-3" />
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                {isKhmer ? "ចង់ឃើញការវាយតម្លៃពិតប្រាកដ?" : "Want to see your real reviews?"}
              </h3>
              <p className="text-slate-500 text-sm mb-4">
                {isKhmer
                  ? "បង្កើតគណនីដើម្បីប្រមូលការវាយតម្លៃពិតប្រាកដពីអតិថិជន"
                  : "Create an account to collect real customer reviews for your stall."}
              </p>
              <Link
                href="/signup"
                className="inline-block px-6 py-2.5 rounded-xl bg-[#29B28D] text-white font-bold text-sm hover:bg-[#239979] transition-colors no-underline"
              >
                {isKhmer ? "ចាប់ផ្តើមឥតគិតថ្លៃ" : "Get Started Free"}
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
