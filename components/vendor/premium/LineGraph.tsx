"use client";

import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { TrendingUp, Calendar } from "lucide-react";
import { offlineFetch } from "@/lib/pwa/offline-fetch";

// Dynamically import Recharts components with SSR disabled
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Sale {
  createdAt: string;
  amount: string;
}

export default function LineGraph() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSales() {
      try {
        const res = await offlineFetch("/api/vendor/sales");
        const json = await res.json();
        if (json.success) {
          setSales(json.data);
        }
      } catch (err) {
        console.error("Failed to fetch sales for graph:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSales();
  }, []);

  const chartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split("T")[0];
    }).reverse();

    return last7Days.map((date) => {
      const dailyTotal = sales
        .filter((s) => s.createdAt.startsWith(date))
        .reduce((sum, s) => sum + parseFloat(s.amount), 0);

      return {
        name: new Date(date).toLocaleDateString("en-US", { weekday: "short" }),
        amount: dailyTotal,
      };
    });
  }, [sales]);

  if (loading) {
    return (
      <div className="h-[400px] w-full bg-white dark:bg-[#0d1117] rounded-[24px] border border-[#e8eaed] dark:border-white/10 p-6 flex flex-col justify-center items-center gap-4 animate-pulse">
        <div className="h-4 w-1/3 bg-gray-200 dark:bg-white/5 rounded-md"></div>
        <div className="h-48 w-full bg-gray-200 dark:bg-white/5 rounded-md"></div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden group">
      {/* Background Glow */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#3ecf8e]/10 blur-[100px] rounded-full group-hover:bg-[#3ecf8e]/20 transition-all duration-700"></div>

      <div className="bg-white dark:bg-[#0d1117] rounded-[24px] border border-[#e8eaed] dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-8 min-h-[450px] flex flex-col transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1 px-2 bg-[#3ecf8e]/10 text-[#3ecf8e] text-[10px] font-bold rounded-full uppercase tracking-wider border border-[#3ecf8e]/20">
                Performance Metrics
              </span>
              <span className="flex h-2 w-2 rounded-full bg-[#3ecf8e] animate-pulse"></span>
            </div>
            <h3 className="text-[22px] font-black text-[#111827] dark:text-white flex items-center gap-2">
              <TrendingUp size={22} className="text-[#3ecf8e]" />
              7-Day Sales Velocity
            </h3>
            <p className="text-[13px] text-[#6b7280] dark:text-[#7d8590] mt-1">
              Real-time revenue accumulation across all active channels.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-[12px] font-bold text-[#3ecf8e] bg-[#3ecf8e]/5 px-3 py-1.5 rounded-xl border border-[#3ecf8e]/10 flex items-center gap-1.5">
              <Calendar size={14} /> Last 7 Days
            </div>
          </div>
        </div>

        <div className="w-full h-[400px] mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart 
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorAmountDetailed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3ecf8e" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3ecf8e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e8eaed"
                className="dark:stroke-white/5"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#6b7280", fontWeight: 500 }}
                dy={15}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#6b7280", fontWeight: 500 }}
                dx={-10}
                tickFormatter={(val) => `$${val}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111827",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "16px",
                  fontSize: "13px",
                  color: "#fff",
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.4)",
                  padding: "12px",
                }}
                itemStyle={{ color: "#3ecf8e", fontWeight: "800" }}
                labelStyle={{ color: "#9ca3af", marginBottom: "6px", fontWeight: "bold" }}
                cursor={{ stroke: "#3ecf8e", strokeWidth: 2, strokeDasharray: "5 5" }}
                formatter={(value: any) => {
                  if (typeof value === "number") return [`$${value.toLocaleString()}`, "Revenue"];
                  return [value || "0", "Revenue"];
                }}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#3ecf8e"
                strokeWidth={4}
                fillOpacity={1}
                fill="url(#colorAmountDetailed)"
                animationDuration={2000}
                activeDot={{ r: 6, stroke: "#fff", strokeWidth: 2, fill: "#3ecf8e" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-[10px] text-[#9ca3af] font-bold uppercase tracking-widest">Status</span>
              <span className="text-[12px] text-emerald-500 font-bold">Live Data Feed</span>
            </div>
            <div className="w-[1px] h-8 bg-gray-100 dark:bg-white/5"></div>
            <div className="flex flex-col">
              <span className="text-[10px] text-[#9ca3af] font-bold uppercase tracking-widest">Update</span>
              <span className="text-[12px] text-[#6b7280] dark:text-[#7d8590] font-bold">Auto-sync active</span>
            </div>
          </div>
          <p className="text-[11px] text-[#9ca3af] italic">
            Visualizing the most recent 168 hours of business performance.
          </p>
        </div>
      </div>
    </div>
  );
}
