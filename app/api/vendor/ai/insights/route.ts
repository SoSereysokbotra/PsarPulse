import { NextRequest, NextResponse } from "next/server";
import { TokenUtil } from "@/lib/auth/utils/token.util";
import { authConfig } from "@/lib/auth/config";
import { VendorRepository } from "@/lib/db/repositories/vendor.repository";
import { SalesRepository } from "@/lib/db/repositories/sales.repository";
import { TrafficRepository } from "@/lib/db/repositories/traffic.repository";
import { getGeminiModel, withAICache } from "@/lib/ai/gemini";

// ─── In-memory cache (per vendor, 10-minute TTL) ─────────────────────
const insightsCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

type Insight = {
  tag: string;
  title: string;
  detail: string;
  color: string;
  icon: string;
};

function extractJsonPayload(text: string) {
  const trimmed = text.trim();

  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fenced?.[1]) {
    return fenced[1].trim();
  }

  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    return trimmed.slice(firstBrace, lastBrace + 1);
  }

  return trimmed;
}

function buildDeterministicInsights(
  vendorName: string,
  sales: any[],
  hourlyPattern: { hour: number; avgCount: number; totalLogs: number }[],
  trafficLogs: any[],
) {
  const totalRevenue = sales.reduce(
    (sum, tx) => sum + Number.parseFloat(tx.amount || "0"),
    0,
  );
  const totalTransactions = sales.length;

  const dailyRevenueMap = new Map<string, number>();

  for (const tx of sales) {
    const createdAt = new Date(tx.createdAt);
    if (!Number.isNaN(createdAt.getTime())) {
      const day = createdAt.toDateString();
      dailyRevenueMap.set(
        day,
        (dailyRevenueMap.get(day) || 0) + Number.parseFloat(tx.amount || "0"),
      );
    }
  }

  const topDay = [...dailyRevenueMap.entries()].sort((a, b) => b[1] - a[1])[0];

  // Build hourly traffic map from real traffic logs
  const hourlyTrafficMap = new Map<number, number>();
  for (const log of trafficLogs) {
    const h = new Date(log.createdAt).getHours();
    hourlyTrafficMap.set(h, (hourlyTrafficMap.get(h) || 0) + (log.count || 0));
  }
  // Also merge in the DB-aggregated hourly pattern
  for (const row of hourlyPattern) {
    const existing = hourlyTrafficMap.get(row.hour) || 0;
    if (existing === 0) {
      hourlyTrafficMap.set(row.hour, Math.round(row.avgCount));
    }
  }

  const topHourEntry = [...hourlyTrafficMap.entries()].sort((a, b) => b[1] - a[1])[0];
  const averageTicket =
    totalTransactions > 0 ? totalRevenue / totalTransactions : 0;
  const formattedRevenue = totalRevenue.toFixed(2);
  const formattedAverage = averageTicket.toFixed(2);

  const peakDayLabel = topDay?.[0] || "No sales data";
  const peakHourLabel = topHourEntry
    ? `${topHourEntry[0].toString().padStart(2, "0")}:00`
    : "N/A";

  // Build 7-day daily traffic buckets (Mon=0 … Sun=6)
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const dailyTrafficBuckets = Array(7).fill(0);
  for (const log of trafficLogs) {
    const dow = (new Date(log.createdAt).getDay() + 6) % 7; // 0=Mon
    dailyTrafficBuckets[dow] += log.count || 0;
  }

  return {
    insights: [
      {
        tag: "Revenue",
        title:
          totalTransactions > 0
            ? `Total Revenue: $${formattedRevenue}`
            : "No Revenue Yet",
        detail:
          totalTransactions > 0
            ? `${vendorName} has ${totalTransactions} transactions with an average ticket size of $${formattedAverage}.`
            : `${vendorName} has no recorded sales yet, so this report is showing a setup-ready placeholder.`,
        color: "#8b5cf6",
        icon: "zap",
      },
      {
        tag: "Peak Day",
        title: topDay ? peakDayLabel : "Waiting for sales",
        detail: topDay
          ? `Highest daily revenue was $${topDay[1].toFixed(2)} on ${peakDayLabel}.`
          : "Once sales are recorded, the report will highlight your strongest day.",
        color: "#3ecf8e",
        icon: "users",
      },
      {
        tag: "Peak Hour",
        title: topHourEntry ? `Best Hour: ${peakHourLabel}` : "Waiting for traffic",
        detail: topHourEntry
          ? `The busiest hour had ${topHourEntry[1]} visitors around ${peakHourLabel}.`
          : "Hourly patterns will appear after more traffic is logged.",
        color: "#f59e0b",
        icon: "package",
      },
    ] satisfies Insight[],
    // Use real traffic log counts per hour (not sales revenue)
    projectedHourly: Array.from({ length: 24 }, (_, hour) =>
      hourlyTrafficMap.get(hour) || 0,
    ),
    // Use real traffic log counts per weekday
    projectedDaily: days.map((label, i) => ({
      label,
      count: dailyTrafficBuckets[i],
    })),
  };
}

export async function GET(request: NextRequest) {
  const token = request.cookies.get(authConfig.cookies.accessToken)?.value;
  if (!token)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const payload = TokenUtil.verifyAccessToken(token);
    if (!payload?.id)
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });

    const vendor = await VendorRepository.findByUserId(payload.id);
    if (!vendor)
      return NextResponse.json(
        { message: "Vendor not found" },
        { status: 404 },
      );

    // Check cache first
    const cached = insightsCache.get(vendor.id);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json({
        success: true,
        data: cached.data,
        cached: true,
      });
    }

    const sales = await SalesRepository.findByVendorId(vendor.id);
    const hourlyPattern = await TrafficRepository.getHourlyPattern(vendor.id);
    const trafficLogs = await TrafficRepository.findByVendorId(vendor.id);

    // 1. Try cloud AI (Gemini) first — more reliable on Vercel/serverless
    try {
      const deterministic = buildDeterministicInsights(
        vendor.businessName || "vendor",
        sales,
        hourlyPattern,
        trafficLogs,
      );
      const salesSummary = {
        totalTransactions: sales.length,
        totalRevenue: sales.reduce(
          (s: number, x: any) => s + Number.parseFloat(x.amount || "0"),
          0,
        ),
        recent7: Array.from({ length: 7 }, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const day = d.toDateString();
          return {
            label: day,
            revenue: sales
              .filter((s: any) => new Date(s.createdAt).toDateString() === day)
              .reduce(
                (sum: number, tx: any) =>
                  sum + Number.parseFloat(tx.amount || "0"),
                0,
              ),
          };
        }).reverse(),
      };

      const systemPrompt = `You are a concise Business Intelligence assistant. Return a JSON object with keys:\n- insights: an array of objects {tag,title,detail,color,icon} where icon is one of: zap, users, package, trending-up.\n- projectedHourly: array of 24 integers.\n- projectedDaily: array of 7 objects {label,count}.\nOnly return valid JSON. Do not wrap it in markdown or code fences.`;

      const liveContext = `Vendor: ${vendor.businessName || "vendor"}\nSales summary: totalTransactions=${salesSummary.totalTransactions}, totalRevenue=${salesSummary.totalRevenue.toFixed(2)}\nRecentDays: ${salesSummary.recent7.map((r) => `${r.label}:${r.revenue.toFixed(2)}`).join(", ")}`;

      // Use in-memory cache per vendor (10 minutes)
      const { data, cached } = await withAICache(
        `insights-${vendor.id}`,
        10 * 60 * 1000,
        async () => {
          const model = getGeminiModel(systemPrompt + "\n\n" + liveContext);
          if (!model) return null;

          const userMessage = `Generate business insights and projections based on the provided sales summary. Output JSON exactly as requested.`;
          const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: userMessage }] }],
            generationConfig: {
              temperature: 0.2,
              responseMimeType: "application/json",
            },
          });
          const text =
            result.response.text?.() || result.response?.toString?.() || "";
          try {
            const parsed = JSON.parse(extractJsonPayload(text));
            if (parsed?.insights?.length) {
              // Always override AI-generated projections with real traffic data
              parsed.projectedHourly = deterministic.projectedHourly;
              parsed.projectedDaily = deterministic.projectedDaily;
              return parsed;
            }
            return deterministic;
          } catch (err) {
            console.error(
              "Failed to parse Gemini output as JSON:",
              err,
              "raw:",
              text,
            );
            return deterministic;
          }
        },
      );

      if (data) {
        insightsCache.set(vendor.id, { data, timestamp: Date.now() });
        return NextResponse.json({ success: true, data });
      }

      // If Gemini didn't return usable JSON, fall through to deterministic fallback below
    } catch (aiErr) {
      console.error("Gemini insights error:", aiErr);
    }

    // 2. Final fallback: deterministic traffic-based insights so the UI always has real data.
    const fallback = buildDeterministicInsights(
      vendor.businessName || "vendor",
      sales,
      hourlyPattern,
      trafficLogs,
    );
    insightsCache.set(vendor.id, { data: fallback, timestamp: Date.now() });
    return NextResponse.json({ success: true, data: fallback });
  } catch (error: any) {
    console.error("AI Insights GET Error:", error?.message || error);

    // Generic fallback for any other errors

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
