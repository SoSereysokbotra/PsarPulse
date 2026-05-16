"use client";

import React, { useEffect, useState } from "react";
import { Star, MessageSquare, Clock, ArrowLeft, LayoutDashboard, CircleDollarSign, Receipt, Users, Package, FileBarChart } from "lucide-react";
import VendorDashboardLayout from "@/components/vendor/VendorDashboardLayout";
import { useUser } from "@/components/providers/UserProvider";

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    fullName: string;
    avatarUrl: string | null;
  } | null;
}

export default function VendorReviewsPage() {
  const { vendor, user, loading: userLoading } = useUser();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch("/api/vendor/reviews");
        const json = await res.json();
        if (json.success) {
          setReviews(json.data);
        }
      } catch (err) {
        console.error("Failed to fetch reviews", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  const plan = (vendor?.plan?.name as "free" | "pro" | "premium") || "free";
  const baseHref = plan === "premium" ? "/vendor/premium" : plan === "pro" ? "/vendor/pro" : "/vendor";

  const navLinks = [
    {
      icon: LayoutDashboard,
      title: "Dashboard",
      khmerTitle: "ផ្ទាំងគ្រប់គ្រង",
      href: baseHref,
    },
    {
      icon: CircleDollarSign,
      title: "Sales",
      khmerTitle: "ការលក់",
      href: `${baseHref}/sales`,
    },
    {
      icon: Receipt,
      title: "Expenses",
      khmerTitle: "ចំណាយ",
      href: `${baseHref}/expenses`,
    },
    {
      icon: Users,
      title: "Customers",
      khmerTitle: "អតិថិជន",
      href: `${baseHref}/customer`,
    },
    {
      icon: Package,
      title: "Inventory",
      khmerTitle: "ស្តុក",
      href: `${baseHref}/inventory`,
    },
  ];

  if (plan === "pro" || plan === "premium") {
    navLinks.push({
      icon: FileBarChart,
      title: "Reports",
      khmerTitle: "របាយការណ៍",
      href: `${baseHref}/reports`,
    });
  }

  const getInitials = (name: string) => {
    if (!name) return "??";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return name.trim().slice(0, 2).toUpperCase();
  };

  const displayName = user?.fullName || (user as any)?.full_name || vendor?.businessName || (user?.email ? user.email.split('@')[0] : "User");
  const displayInitials = getInitials(displayName);

  return (
    <VendorDashboardLayout
      title="Customer Reviews"
      plan={plan}
      currentPath="/vendor/reviews"
      settingsHref={`${baseHref}/settings`}
      userName={displayName}
      userInitials={displayInitials}
      userEmail={user?.email || ""}
      navLinks={navLinks}
    >
      <div className="flex-1 overflow-y-auto px-5 lg:px-9 py-[26px]">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Customer Reviews</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm">See what your customers are saying about your business.</p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12 text-slate-500 dark:text-slate-400">Loading reviews...</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-slate-900 dark:text-white mb-2">{averageRating}</span>
                  <div className="flex text-yellow-500 mb-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={20} className={s <= parseFloat(averageRating) ? "fill-current" : "text-slate-200 dark:text-slate-700"} />
                    ))}
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Average Rating</span>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-slate-900 dark:text-white mb-2">{reviews.length}</span>
                  <MessageSquare size={24} className="text-emerald-500 mb-2" />
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Total Reviews</span>
                </div>
              </div>

              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <div className="text-center py-16 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 border-dashed">
                    <MessageSquare size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No reviews yet</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">When customers leave reviews, they will appear here.</p>
                  </div>
                ) : (
                  reviews.map((review) => (
                    <div key={review.id} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold shrink-0">
                            {review.user?.fullName?.charAt(0).toUpperCase() || "?"}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 dark:text-white text-sm">{review.user?.fullName || "Anonymous Customer"}</h4>
                            <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                              <Clock size={12} />
                              {new Date(review.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex text-yellow-500">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} size={14} className={s <= review.rating ? "fill-current" : "text-slate-200 dark:text-slate-700"} />
                          ))}
                        </div>
                      </div>
                      {review.comment ? (
                        <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">{review.comment}</p>
                      ) : (
                        <p className="text-slate-400 text-sm italic">No comment provided.</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </VendorDashboardLayout>
  );
}
