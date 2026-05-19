import { NextRequest, NextResponse } from "next/server";
import { TokenUtil } from "@/lib/auth/utils/token.util";
import { authConfig } from "@/lib/auth/config";
import { VendorRepository } from "@/lib/db/repositories/vendor.repository";
import { SalesRepository } from "@/lib/db/repositories/sales.repository";
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

function buildDeterministicInsights(vendorName: string, sales: any[]) {
  const totalRevenue = sales.reduce(
    (sum, tx) => sum + Number.parseFloat(tx.amount || "0"),
    0,
  );
  const totalTransactions = sales.length;

  const dailyRevenueMap = new Map<string, number>();
  const hourlyRevenueMap = new Map<number, number>();

  for (const tx of sales) {
    const createdAt = new Date(tx.createdAt);
    if (!Number.isNaN(createdAt.getTime())) {
      const day = createdAt.toDateString();
      const hour = createdAt.getHours();
      dailyRevenueMap.set(
        day,
        (dailyRevenueMap.get(day) || 0) + Number.parseFloat(tx.amount || "0"),
      );
      hourlyRevenueMap.set(
        hour,
        (hourlyRevenueMap.get(hour) || 0) + Number.parseFloat(tx.amount || "0"),
      );
    }
  }

  const topDay = [...dailyRevenueMap.entries()].sort((a, b) => b[1] - a[1])[0];
  const topHour = [...hourlyRevenueMap.entries()].sort((a, b) => b[1] - a[1])[0];
  const averageTicket = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;
  const formattedRevenue = totalRevenue.toFixed(2);
  const formattedAverage = averageTicket.toFixed(2);

  const peakDayLabel = topDay?.[0] || "No sales data";
  const peakHourLabel = topHour ? `${topHour[0].toString().padStart(2, "0")}:00` : "N/A";

  return {
    insights: [
      {
        tag: "Revenue",
        title: totalTransactions > 0 ? `Total Revenue: $${formattedRevenue}` : "No Revenue Yet",
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
        title: topHour ? `Best Hour: ${peakHourLabel}` : "Waiting for traffic",
        detail: topHour
          ? `The strongest hour generated $${topHour[1].toFixed(2)} in revenue around ${peakHourLabel}.`
          : "Hourly patterns will appear after more sales activity is recorded.",
        color: "#f59e0b",
        icon: "package",
      },
    ] satisfies Insight[],
    projectedHourly: Array.from({ length: 24 }, (_, hour) => {
      const value = hourlyRevenueMap.get(hour) || 0;
      return Math.round(value);
    }),
    projectedDaily: Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() + index + 1);
      const label = date.toLocaleDateString(undefined, { weekday: "short" });
      const value = dailyRevenueMap.get(date.toDateString()) || 0;
      return { label, count: Math.round(value) };
    }),
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

    // 1. Try cloud AI (Gemini) first — more reliable on Vercel/serverless
    try {
      const deterministic = buildDeterministicInsights(vendor.businessName || "vendor", sales);
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
                (sum: number, tx: any) => sum + Number.parseFloat(tx.amount || "0"),
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
          const text = result.response.text?.() || result.response?.toString?.() || "";
          try {
            const parsed = JSON.parse(extractJsonPayload(text));
            if (parsed?.insights?.length) {
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

    // 2. Final fallback: deterministic sales-based insights so the UI always has real data.
    const fallback = buildDeterministicInsights(
      vendor.businessName || "vendor",
      sales,
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
