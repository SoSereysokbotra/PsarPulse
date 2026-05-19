import { NextRequest, NextResponse } from "next/server";
import { TokenUtil } from "@/lib/auth/utils/token.util";
import { authConfig } from "@/lib/auth/config";
import { VendorRepository } from "@/lib/db/repositories/vendor.repository";
import { SalesRepository } from "@/lib/db/repositories/sales.repository";
import { exec } from "child_process";
import path from "path";
import util from "util";
import { getGeminiModel, withAICache } from "@/lib/ai/gemini";
const execAsync = util.promisify(exec);

// ─── In-memory cache (per vendor, 10-minute TTL) ─────────────────────
const insightsCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

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
      const salesSummary = {
        totalTransactions: sales.length,
        totalRevenue: sales.reduce(
          (s: number, x: any) => s + parseFloat(x.amount || 0),
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
                (sum: number, tx: any) => sum + parseFloat(tx.amount || 0),
                0,
              ),
          };
        }).reverse(),
      };

      const systemPrompt = `You are a concise Business Intelligence assistant. Return a JSON object with keys: \n- insights: an array of objects {tag,title,detail,color,icon} (icon one-word tag),\n- projectedHourly: array of 24 integers,\n- projectedDaily: array of 7 objects {label,count}.\nOnly return valid JSON (no explanatory text).`;

      const liveContext = `Vendor: ${vendor.businessName || "vendor"}\nSales summary: totalTransactions=${salesSummary.totalTransactions}, totalRevenue=${salesSummary.totalRevenue.toFixed(2)}\nRecentDays: ${salesSummary.recent7.map((r) => `${r.label}:${r.revenue.toFixed(2)}`).join(", ")}`;

      // Use in-memory cache per vendor (10 minutes)
      const { data, cached } = await withAICache(
        `insights-${vendor.id}`,
        10 * 60 * 1000,
        async () => {
          const model = getGeminiModel(systemPrompt + "\n\n" + liveContext);
          if (!model) return null;

          const userMessage = `Generate business insights and projections based on the provided sales summary. Output JSON exactly as requested.`;
          const result = await model.generateContent(userMessage);
          const text =
            result.response.text?.() || result.response?.toString?.() || "";
          try {
            const parsed = JSON.parse(text.trim());
            return parsed;
          } catch (err) {
            console.error(
              "Failed to parse Gemini output as JSON:",
              err,
              "raw:",
              text,
            );
            return null;
          }
        },
      );

      if (data) {
        insightsCache.set(vendor.id, { data, timestamp: Date.now() });
        return NextResponse.json({ success: true, data });
      }

      // If Gemini didn't return usable JSON, fall through to Python fallback below
    } catch (aiErr) {
      console.error("Gemini insights error:", aiErr);
      // continue to fallback path
    }

    // 2. Fallback: Try Custom ML Python Script (PsarPulse/ml) — may not work on serverless
    const scriptPath = path.join(process.cwd(), "ml", "predict_customer.py");
    try {
      const { stdout } = await execAsync(`python "${scriptPath}"`);
      const mlResult = JSON.parse(stdout.trim());

      if (mlResult.success) {
        insightsCache.set(vendor.id, {
          data: mlResult.data,
          timestamp: Date.now(),
        });
        return NextResponse.json({ success: true, data: mlResult.data });
      } else {
        throw new Error(
          mlResult.message || "Failed to predict from Python model",
        );
      }
    } catch (mlErr) {
      console.error("ML execution failed:", mlErr);
      // Final graceful fallback: return a helpful placeholder insight so UI still shows something
      const fallback = {
        insights: [
          {
            tag: "Peak Hour",
            title: "System Ready",
            detail: "Insufficient data to run ML models locally at this time.",
            color: "#8b5cf6",
            icon: "zap",
          },
        ],
        projectedHourly: Array(24).fill(0),
        projectedDaily: Array.from({ length: 7 }, (_, i) => ({
          label: new Date(Date.now() + (i + 1) * 86400000).toLocaleDateString(),
          count: 0,
        })),
      };
      return NextResponse.json({ success: true, data: fallback });
    }
  } catch (error: any) {
    console.error("AI Insights GET Error:", error?.message || error);

    // Generic fallback for any other errors

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
