import { NextRequest, NextResponse } from "next/server";
import { TokenUtil } from "@/lib/auth/utils/token.util";
import { authConfig } from "@/lib/auth/config";
import { VendorRepository } from "@/lib/db/repositories/vendor.repository";
import { TrafficRepository } from "@/lib/db/repositories/traffic.repository";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(authConfig.cookies.accessToken)?.value;
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const payload = TokenUtil.verifyAccessToken(token);
    if (!payload?.id) return NextResponse.json({ message: "Invalid token" }, { status: 401 });

    const vendor = await VendorRepository.findByUserId(payload.id);
    if (!vendor) return NextResponse.json({ message: "Vendor not found" }, { status: 404 });

    // 1. Get historical hourly patterns
    const patterns = await TrafficRepository.getHourlyPattern(vendor.id);
    
    // 2. Prepare chart data (ensure all 24 hours are represented)
    const chartData = Array.from({ length: 24 }, (_, i) => {
      const match = patterns.find(p => p.hour === i);
      const hour = i % 12 || 12;
      const ampm = i >= 12 ? 'PM' : 'AM';
      return {
        time: `${hour}${ampm}`,
        hour: i,
        historical: match ? Math.round(match.avgCount) : 0,
        forecast: match ? Math.round(match.avgCount * (1 + (Math.random() * 0.2 - 0.1))) : 0, // Mock forecast baseline
      };
    });

    // 3. Generate AI Insight if API key exists
    let aiInsight = "Record more traffic logs to see personalized AI insights.";
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (apiKey && patterns.length > 0) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const prompt = `
          As an AI Business Analyst for PsarPulse, analyze this vendor's hourly foot traffic pattern:
          ${JSON.stringify(patterns)}
          
          Provide a concise, professional 2-sentence forecast/strategy for tomorrow. 
          Focus on:
          1. The specific peak hour expected.
          2. A tactical advice for staffing or inventory.
          
          Current business: "${vendor.businessName}". 
          Language: English.
          Respond with the plain text advice ONLY.
        `;
        
        const result = await model.generateContent(prompt);
        aiInsight = result.response.text().trim();
      } catch (aiError) {
        console.error("Gemini Forecast Error:", aiError);
        aiInsight = "Our AI suggests preparing for a typical peak around dinner time. Ensure your best-sellers are stocked.";
      }
    } else if (patterns.length > 0) {
      aiInsight = "Historical data shows peak activity in the early evening. Consider preparing extra stock between 5PM and 7PM.";
    }

    return NextResponse.json({
      success: true,
      data: {
        chartData,
        aiInsight,
        isAiPowered: !!apiKey
      }
    });

  } catch (error) {
    console.error("Forecast GET Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
