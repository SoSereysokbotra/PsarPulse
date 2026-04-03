"use client";

import React, { useState, useEffect } from "react";
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Users, 
  Activity,
  AlertCircle
} from "lucide-react";

interface MLPrediction {
  date: string;
  sales_prediction: number;
  traffic_prediction: number;
  model_quality: {
    sales_mae: number;
    traffic_mae: number;
    sales_rmse: number;
    traffic_rmse: number;
  };
}

export default function MLForecast() {
  const [data, setData] = useState<MLPrediction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchPrediction() {
      try {
        const res = await fetch("/api/vendor/ai/predict");
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Failed to fetch ML Prediction:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchPrediction();
  }, []);

  if (loading) {
    return (
      <div className="w-full bg-white dark:bg-[#0d1117] rounded-[24px] border border-[#e8eaed] dark:border-white/10 p-6 flex flex-col gap-4 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="h-6 w-48 bg-gray-200 dark:bg-white/5 rounded-md"></div>
          <div className="h-10 w-10 bg-gray-200 dark:bg-white/5 rounded-full"></div>
        </div>
        <div className="space-y-3 mt-4">
          <div className="h-24 w-full bg-gray-200 dark:bg-white/5 rounded-xl"></div>
          <div className="h-24 w-full bg-gray-200 dark:bg-white/5 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="w-full bg-red-50 dark:bg-red-500/10 rounded-[24px] border border-red-200 dark:border-red-500/20 p-6 flex flex-col items-center justify-center text-red-600 dark:text-red-400">
        <AlertCircle size={32} className="mb-2" />
        <p className="font-bold">Failed to connect to Python Engine</p>
        <p className="text-sm mt-1">Make sure the Python environment is set up.</p>
      </div>
    );
  }

  const forecastDate = new Date(data.date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="relative overflow-hidden group">
      {/* Background Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-fuchsia-500/10 blur-[80px] rounded-full group-hover:bg-fuchsia-500/20 transition-all duration-700"></div>
      
      <div className="bg-white dark:bg-[#0d1117] rounded-[24px] border border-[#e8eaed] dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="p-1 px-2 bg-fuchsia-50 dark:bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 text-[10px] font-bold rounded-full uppercase tracking-wider border border-fuchsia-100 dark:border-fuchsia-500/20">
                  Daily Forecast
                </span>
                <span className="flex h-2 w-2 rounded-full bg-fuchsia-500 animate-pulse"></span>
              </div>
              <h3 className="text-[20px] font-extrabold text-[#111827] dark:text-white flex items-center gap-2">
                Random Forest ML Model <Brain size={16} className="text-fuchsia-500" />
              </h3>
              <p className="text-[12px] text-[#6b7280] dark:text-[#7d8590] mt-1">
                Predicting tomorrow's performance using historical pattern extraction.
              </p>
            </div>
            <div className="w-14 h-14 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-center border border-gray-100 dark:border-white/10 shadow-sm">
              <Target className="text-fuchsia-400" size={28} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Sales Prediction */}
            <div className="bg-[#f8fafc] dark:bg-[#161B22] border border-[#e8eaed] dark:border-white/5 rounded-[16px] p-5">
              <div className="flex items-center gap-2 text-fuchsia-600 dark:text-fuchsia-400 font-bold text-[13px] mb-3">
                <TrendingUp size={16} /> Predicted Sales
              </div>
              <div className="text-[32px] font-black text-[#111827] dark:text-white">
                ${data.sales_prediction.toFixed(2)}
              </div>
              <div className="text-[12px] text-[#6b7280] dark:text-[#7d8590] mt-1 font-medium">
                Expected revenue for {forecastDate}
              </div>
            </div>

            {/* Traffic Prediction */}
            <div className="bg-[#f8fafc] dark:bg-[#161B22] border border-[#e8eaed] dark:border-white/5 rounded-[16px] p-5">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-[13px] mb-3">
                <Users size={16} /> Predicted Traffic
              </div>
              <div className="text-[32px] font-black text-[#111827] dark:text-white">
                ~{data.traffic_prediction} <span className="text-[18px] text-[#9ca3af]">customers</span>
              </div>
              <div className="text-[12px] text-[#6b7280] dark:text-[#7d8590] mt-1 font-medium">
                Estimated footfall for {forecastDate}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-gray-100 dark:border-white/5">
            <h4 className="text-[12px] font-bold text-[#111827] dark:text-white flex items-center gap-2 mb-3">
              <Activity size={14} className="text-indigo-400" />
              Model Accuracy Metrics (Lower is better)
            </h4>
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 bg-white dark:bg-[#0d1117] border border-[#e8eaed] dark:border-white/10 rounded-[12px] p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                <div className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-wider mb-1">Sales MAE</div>
                <div className="text-[15px] font-black text-[#111827] dark:text-white">${data.model_quality.sales_mae.toFixed(2)}</div>
              </div>
              <div className="flex-1 bg-white dark:bg-[#0d1117] border border-[#e8eaed] dark:border-white/10 rounded-[12px] p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                <div className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-wider mb-1">Traffic MAE</div>
                <div className="text-[15px] font-black text-[#111827] dark:text-white">{data.model_quality.traffic_mae.toFixed(2)} people</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
