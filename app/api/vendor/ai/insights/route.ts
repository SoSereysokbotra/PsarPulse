import { NextRequest, NextResponse } from "next/server";
import { TokenUtil } from "@/lib/auth/utils/token.util";
import { authConfig } from "@/lib/auth/config";
import { VendorRepository } from "@/lib/db/repositories/vendor.repository";
import { SalesRepository } from "@/lib/db/repositories/sales.repository";
import { exec } from "child_process";
import path from "path";
import util from "util";
const execAsync = util.promisify(exec);

// ─── In-memory cache (per vendor, 10-minute TTL) ─────────────────────
const insightsCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

export async function GET(request: NextRequest) {
  const token = request.cookies.get(authConfig.cookies.accessToken)?.value;
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const payload = TokenUtil.verifyAccessToken(token);
    if (!payload?.id) return NextResponse.json({ message: "Invalid token" }, { status: 401 });

    const vendor = await VendorRepository.findByUserId(payload.id);
    if (!vendor) return NextResponse.json({ message: "Vendor not found" }, { status: 404 });

    // Check cache first
    const cached = insightsCache.get(vendor.id);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json({ success: true, data: cached.data, cached: true });
    }

    const sales = await SalesRepository.findByVendorId(vendor.id);
    
    // 1. Use Custom ML Python Script (PsarPulse/ml)
    const scriptPath = path.join(process.cwd(), "ml", "predict_customer.py");
    try {
      const { stdout } = await execAsync(`python "${scriptPath}"`);
      const mlResult = JSON.parse(stdout.trim());
      
      if (mlResult.success) {
        insightsCache.set(vendor.id, { data: mlResult.data, timestamp: Date.now() });
        return NextResponse.json({ success: true, data: mlResult.data });
      } else {
        throw new Error(mlResult.message || "Failed to predict from Python model");
      }
    } catch (mlErr) {
       console.error("ML execution failed:", mlErr);
       return NextResponse.json({
         success: true,
         data: [
           { tag: "Peak Hour", title: "System Ready", detail: "Insufficient data to run ML models locally at this time.", color: "#8b5cf6", icon: "zap" }
         ]
       });
    }
  } catch (error: any) {
    console.error("AI Insights GET Error:", error?.message || error);
    
    // Generic fallback for any other errors
    
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
