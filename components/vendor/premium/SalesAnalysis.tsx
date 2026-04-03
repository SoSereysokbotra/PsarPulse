"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { 
  Zap, 
  Package, 
  TrendingUp, 
  Users, 
  Brain, 
  Sparkles,
  ArrowRight,
  Info
} from "lucide-react";

const LineGraph = dynamic(() => import("./LineGraph"), {
  loading: () => <div className="h-64 bg-gray-100 dark:bg-white/5 animate-pulse rounded-2xl"></div>,
  ssr: false
});

interface Insight {
  tag: string;
  title: string;
  detail: string;
  color: string;
  icon: string;
}

const IconMap: Record<string, any> = {
  zap: Zap,
  package: Package,
  "trending-up": TrendingUp,
  users: Users,
};

export default function SalesAnalysis() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInsights() {
      try {
        const res = await fetch("/api/vendor/ai/insights");
        const json = await res.json();
        if (json.success && json.data) {
          if (json.data.insights) {
            setInsights(json.data.insights);
          } else if (Array.isArray(json.data)) {
            setInsights(json.data);
          }
        }
      } catch (err) {
        console.error("Failed to fetch AI insights:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchInsights();
  }, []);

  const handleAction = (title: string) => {
    setActionFeedback(`AI Action Initiated: ${title}`);
    setTimeout(() => setActionFeedback(null), 3000);
  };

  if (loading) {
    return (
      <div className="w-full bg-white dark:bg-[#0d1117] rounded-[24px] border border-[#e8eaed] dark:border-white/10 p-6 flex flex-col gap-4 animate-pulse">
        <div className="h-40 bg-gray-100 dark:bg-white/5 rounded-2xl"></div>
      </div>
    );
  }

  if (insights.length === 0) return null;

  return (
    <div className="relative overflow-hidden group">
      {/* Background Glow */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-psar-primary/10 blur-[80px] rounded-full group-hover:bg-psar-primary/20 transition-all duration-700"></div>
      
      <div className="bg-white dark:bg-[#0d1117] rounded-[24px] border border-[#e8eaed] dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="p-1 px-2 bg-psar-primary/10 text-psar-primary text-[10px] font-bold rounded-full uppercase tracking-wider border border-psar-primary/20">
                  Business Intelligence
                </span>
                {actionFeedback && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500 text-white text-[10px] font-bold rounded-full animate-in fade-in slide-in-from-top-1 duration-300">
                    <Sparkles size={12} /> {actionFeedback}
                  </div>
                )}
              </div>
              <h3 className="text-[20px] font-extrabold text-[#111827] dark:text-white flex items-center gap-2">
                AI Sales Analysis <Brain size={18} className="text-psar-primary" />
              </h3>
              <p className="text-[12px] text-[#6b7280] dark:text-[#7d8590]">
                Growth strategies and performance trends generated from transaction logs.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-[#8b5cf6]" />
              <span className="text-[11px] text-[#9ca3af] font-medium border border-[#8b5cf6]/30 bg-[#8b5cf6]/10 px-2 py-0.5 rounded-full">Powered by Custom ML Model</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-5">
            {insights.map((insight, idx) => {
              const Icon = IconMap[insight.icon] || Info;
              return (
                <div 
                  key={idx}
                  className="flex-1 min-w-[300px] bg-[#f8fafc] dark:bg-white/[0.03] rounded-2xl p-5 border border-gray-100 dark:border-white/5 group/item transition-all hover:bg-white dark:hover:bg-white/[0.05] hover:shadow-md hover:border-psar-primary/20"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span 
                      className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border"
                      style={{ 
                        color: insight.color, 
                        backgroundColor: `${insight.color}15`,
                        borderColor: `${insight.color}30`
                      }}
                    >
                      {insight.tag}
                    </span>
                    <div className="p-1.5 rounded-lg bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm">
                      <Icon size={14} style={{ color: insight.color }} />
                    </div>
                  </div>
                  
                  <h4 className="font-bold text-[14px] text-[#111827] dark:text-white mb-1">
                    {insight.title}
                  </h4>
                  <p className="text-[11.5px] text-[#6b7280] dark:text-[#7d8590] leading-relaxed line-clamp-2 italic mb-3">
                    {insight.detail}
                  </p>
                  
                  <button 
                    onClick={() => handleAction(insight.title)}
                    className="flex justify-center items-center gap-1 w-full py-2 bg-white dark:bg-white/5 text-psar-primary dark:text-white text-[11px] font-bold rounded-xl border border-gray-100 dark:border-white/10 hover:bg-psar-primary hover:text-white dark:hover:bg-psar-primary transition-all cursor-pointer shadow-sm group-hover/item:border-psar-primary/30"
                  >
                    Take action <ArrowRight size={12} className="group-hover/item:translate-x-1 transition-transform" />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[11px] text-[#9ca3af]">
              <Info size={12} />
              <span>Real-time analysis updated every 15 minutes</span>
            </div>
            <div className="text-[11px] text-[#9ca3af]">
              Last refresh: Today, {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
