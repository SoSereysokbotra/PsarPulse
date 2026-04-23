"use client";

import React, { useEffect, useState } from "react";
import { Star, MessageSquare, Clock, ArrowLeft } from "lucide-react";

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

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Customer Reviews</h1>
          <p className="text-slate-500 text-sm">See what your customers are saying about your business.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12 text-slate-500">Loading reviews...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-slate-900 mb-2">{averageRating}</span>
              <div className="flex text-yellow-500 mb-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={20} className={s <= parseFloat(averageRating) ? "fill-current" : "text-slate-200"} />
                ))}
              </div>
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Average Rating</span>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-slate-900 mb-2">{reviews.length}</span>
              <MessageSquare size={24} className="text-emerald-500 mb-2" />
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Reviews</span>
            </div>
          </div>

          <div className="space-y-4">
            {reviews.length === 0 ? (
              <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
                <MessageSquare size={48} className="mx-auto text-slate-300 mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-1">No reviews yet</h3>
                <p className="text-slate-500 text-sm">When customers leave reviews, they will appear here.</p>
              </div>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold shrink-0">
                        {review.user?.fullName?.charAt(0).toUpperCase() || "?"}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{review.user?.fullName || "Anonymous Customer"}</h4>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                          <Clock size={12} />
                          {new Date(review.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex text-yellow-500">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={14} className={s <= review.rating ? "fill-current" : "text-slate-200"} />
                      ))}
                    </div>
                  </div>
                  {review.comment ? (
                    <p className="text-slate-700 text-sm leading-relaxed">{review.comment}</p>
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
  );
}
