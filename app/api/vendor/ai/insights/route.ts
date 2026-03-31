import { NextRequest, NextResponse } from "next/server";
import { TokenUtil } from "@/lib/auth/utils/token.util";
import { authConfig } from "@/lib/auth/config";
import { VendorRepository } from "@/lib/db/repositories/vendor.repository";
import { SalesRepository } from "@/lib/db/repositories/sales.repository";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(authConfig.cookies.accessToken)?.value;
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const payload = TokenUtil.verifyAccessToken(token);
    if (!payload?.id) return NextResponse.json({ message: "Invalid token" }, { status: 401 });

    const vendor = await VendorRepository.findByUserId(payload.id);
    if (!vendor) return NextResponse.json({ message: "Vendor not found" }, { status: 404 });

    const sales = await SalesRepository.findByVendorId(vendor.id);
    
    // 1. AI Analysis with Gemini
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || sales.length === 0) {
      // Fallback if no API key or no sales data
      return NextResponse.json({
        success: true,
        data: [
          {
            tag: "Peak Hour",
            title: "Analyzing Patterns...",
            detail: sales.length === 0 ? "Log some sales to see AI insights here." : "Analyzing your sales data for peak patterns.",
            color: "#8b5cf6",
            icon: "zap"
          }
        ]
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const salesSummary = sales.slice(0, 50).map(s => ({
      item: s.items,
      amount: s.amount,
      date: s.createdAt
    }));

    const prompt = `
      You are the PsarPulse Sales Analyst for vendor: ${vendor.businessName}.
      Analyze the following last ${salesSummary.length} sales records:
      ${JSON.stringify(salesSummary)}
      
      Identify 3 unique, actionable business insights.
      Provide the result in the following JSON array format ONLY:
      [
        {"tag": "category", "title": "short title", "detail": "1-2 sentence advice", "color": "hex", "icon": "lucide-icon-name"}
      ]
      Categories: Peak Hour, Inventory Tip, Margin Alert, Customer Trend.
      Icons: zap, package, trending-up, users.
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().replace(/```json|```/g, "").trim();
    const insights = JSON.parse(responseText);

    return NextResponse.json({
      success: true,
      data: insights
    });
  } catch (error) {
    console.error("AI Insights GET Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
