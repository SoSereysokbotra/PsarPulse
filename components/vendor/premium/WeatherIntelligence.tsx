"use client";

import React, { useState, useEffect } from "react";
import { offlineFetch } from "@/lib/pwa/offline-fetch";
import { 
  Cloud, 
  CloudRain, 
  Sun, 
  CloudMoon, 
  Wind, 
  Thermometer, 
  Brain, 
  Sparkles,
  ChevronRight,
  TrendingUp,
  AlertCircle
} from "lucide-react";

interface WeatherData {
  condition: string;
  temp: string;
  icon: string;
  impact: string;
  suggestions: Array<{
    product: string;
    change: string;
    reason: string;
  }>;
}

export default function WeatherIntelligence() {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const res = await offlineFetch("/api/vendor/ai/weather");
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Failed to fetch weather intelligence:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchWeather();
  }, []);

  const getWeatherIcon = (condition: string) => {
    const c = condition.toLowerCase();
    if (c.includes("sun") || c.includes("clear")) return <Sun className="text-amber-400" size={32} />;
    if (c.includes("rain")) return <CloudRain className="text-blue-400" size={32} />;
    if (c.includes("cloud") || c.includes("evening")) return <Cloud className="text-slate-400" size={32} />;
    if (c.includes("cool")) return <CloudMoon className="text-indigo-400" size={32} />;
    return <Wind className="text-slate-300" size={32} />;
  };

  if (loading) {
    return (
      <div className="w-full bg-white dark:bg-[#0d1117] rounded-[20px] border border-[#e8eaed] dark:border-white/10 p-6 flex flex-col gap-4 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="h-6 w-32 bg-gray-200 dark:bg-white/5 rounded-md"></div>
          <div className="h-10 w-10 bg-gray-200 dark:bg-white/5 rounded-full"></div>
        </div>
        <div className="space-y-3">
          <div className="h-4 w-full bg-gray-200 dark:bg-white/5 rounded-md"></div>
          <div className="h-4 w-2/3 bg-gray-200 dark:bg-white/5 rounded-md"></div>
        </div>
      </div>
    );
  }

  if (error || !data) return null;

  return (
    <div className="relative overflow-hidden group">
      {/* Background Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-psar-primary/10 blur-[80px] rounded-full group-hover:bg-psar-primary/20 transition-all duration-700"></div>
      
      <div className="bg-white dark:bg-[#0d1117] rounded-[24px] border border-[#e8eaed] dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="p-1 px-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold rounded-full uppercase tracking-wider border border-indigo-100 dark:border-indigo-500/20">
                  AI Real-time
                </span>
                <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
              </div>
              <h3 className="text-[20px] font-extrabold text-[#111827] dark:text-white flex items-center gap-2">
                Weather Insights <Sparkles size={16} className="text-amber-500" />
              </h3>
              <p className="text-[12px] text-[#6b7280] dark:text-[#7d8590]">
                Market demand predictions based on live conditions.
              </p>
            </div>
            <div className="w-14 h-14 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-center border border-gray-100 dark:border-white/10 shadow-sm">
              {getWeatherIcon(data.condition)}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Current State */}
            <div className="bg-[#f8fafc] dark:bg-white/[0.03] rounded-2xl p-5 border border-gray-100 dark:border-white/5">
              <div className="flex items-center gap-4">
                <div className="text-[36px] font-black text-[#111827] dark:text-white leading-none">
                  {data.temp}
                </div>
                <div className="h-10 w-[1px] bg-gray-200 dark:bg-white/10"></div>
                <div>
                  <div className="text-[15px] font-bold text-[#111827] dark:text-white">
                    {data.condition}
                  </div>
                  <div className="text-[12px] text-[#6b7280] dark:text-[#7d8590] capitalize">
                    {data.impact} trade period
                  </div>
                </div>
              </div>
            </div>

            {/* AI Predictions */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[12px] font-bold text-[#374151] dark:text-[#abb4be] uppercase tracking-wider">
                <Brain size={14} className="text-psar-primary" />
                Demand Predictions
              </div>
              
              <div className="space-y-2">
                {data.suggestions.map((s, idx) => (
                  <div 
                    key={idx}
                    className="flex flex-col p-3 bg-white dark:bg-[#111827] rounded-xl border border-gray-100 dark:border-white/5 group/item cursor-default hover:border-psar-primary/30 transition-colors shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-bold text-[#111827] dark:text-white truncate max-w-[140px]">
                        {s.product}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] font-black text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-500/20">
                        <TrendingUp size={10} /> {s.change}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6b7280] dark:text-[#7d8590] mt-1 line-clamp-1 italic group-hover/item:text-psar-primary/80 transition-colors">
                      {s.reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle size={12} className="text-[#9ca3af]" />
              <span className="text-[11px] text-[#9ca3af]">Generated using Gemini Flash Engine v1.5</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
