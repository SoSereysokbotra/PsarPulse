"use client";

import React, { useState } from "react";
import { 
  CloudSun, 
  TrendingUp, 
  Sparkles, 
  Brain,
  ChevronRight
} from "lucide-react";
import dynamic from "next/dynamic";

const WeatherIntelligence = dynamic(() => import("./WeatherIntelligence"), {
  loading: () => <div className="h-40 bg-gray-100 dark:bg-white/5 animate-pulse rounded-2xl"></div>,
  ssr: false
});

const SalesAnalysis = dynamic(() => import("./SalesAnalysis"), {
  loading: () => <div className="h-80 bg-gray-100 dark:bg-white/5 animate-pulse rounded-2xl"></div>,
  ssr: false
});

const LineGraph = dynamic(() => import("./LineGraph"), {
  loading: () => <div className="h-64 bg-gray-100 dark:bg-white/5 animate-pulse rounded-2xl"></div>,
  ssr: false
});

const MLForecast = dynamic(() => import("./MLForecast"), {
  loading: () => <div className="h-64 bg-gray-100 dark:bg-white/5 animate-pulse rounded-2xl"></div>,
  ssr: false
});

type Tab = "weather" | "sales" | "trend" | "ml";

export default function AIHub() {
  const [activeTab, setActiveTab] = useState<Tab>("weather");

  return (
    <div className="w-full space-y-6">
      {/* Tab Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-psar-primary/10 rounded-xl flex items-center justify-center text-psar-primary border border-psar-primary/20">
            <Brain size={22} />
          </div>
          <div>
            <h2 className="text-[22px] font-black text-[#111827] dark:text-white leading-tight">
              Premium AI Suite
            </h2>
            <p className="text-[12px] text-[#6b7280] dark:text-[#7d8590] flex items-center gap-1">
              Real-time intelligence dashboard <ChevronRight size={12} />
            </p>
          </div>
        </div>

        <div className="inline-flex p-[4px] bg-[#f0f2f5] dark:bg-[#161B22] rounded-[14px] border border-[#e8eaed] dark:border-white/10 transition-colors">
          {/* <button
            onClick={() => setActiveTab("weather")}
            className={`flex items-center gap-2 px-4 py-[8px] rounded-[11px] text-[13px] font-extrabold transition-all duration-300 border-0 cursor-pointer ${
              activeTab === "weather"
                ? "bg-white dark:bg-[#0d1117] text-[#111827] dark:text-white shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
                : "bg-transparent text-[#6b7280] dark:text-[#7d8590] hover:text-[#111827] dark:hover:text-white"
            }`}
          >
            <CloudSun size={15} />
            Weather
          </button> */}
          <button
            onClick={() => setActiveTab("ml")}
            className={`flex items-center gap-2 px-4 py-[8px] rounded-[11px] text-[13px] font-extrabold transition-all duration-300 border-0 cursor-pointer ${
              activeTab === "ml"
                ? "bg-white dark:bg-[#0d1117] text-[#111827] dark:text-white shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
                : "bg-transparent text-[#6b7280] dark:text-[#7d8590] hover:text-[#111827] dark:hover:text-white"
            }`}
          >
            <Brain size={15} className="text-fuchsia-500" />
            ML Model
          </button>
        </div>
      </div>

      {/* Dynamic Content Area */}
      <div className="relative transition-all duration-500 min-h-[160px]">
        {activeTab === "weather" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <WeatherIntelligence />
          </div>
        )}
        {activeTab === "sales" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <SalesAnalysis />
          </div>
        )}
        {activeTab === "trend" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <LineGraph />
          </div>
        )}
        {activeTab === "ml" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <MLForecast />
          </div>
        )}
      </div>
    </div>
  );
}
