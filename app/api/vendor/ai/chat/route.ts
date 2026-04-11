import { NextRequest, NextResponse } from "next/server";
import { TokenUtil } from "@/lib/auth/utils/token.util";
import { authConfig } from "@/lib/auth/config";
import { VendorRepository } from "@/lib/db/repositories/vendor.repository";
import { SalesRepository } from "@/lib/db/repositories/sales.repository";
import { getGeminiModel } from "@/lib/ai/gemini";

// System prompt giving Gemini the role of a Premium business assistant
const SYSTEM_PROMPT = `You are a smart AI business assistant for PsarPulse, a market vendor management application used in Cambodia.
You help Premium-tier vendors analyze their sales, manage inventory, forecast revenue, and make data-driven business decisions.
You understand both English and Khmer (Cambodian language).

Your personality:
- Friendly, concise, and actionable
- Focused on business insights, not generic advice
- You reference specific numbers when available from the vendor's context
- You respond in the same language the user writes in
- Keep responses under 150 words unless a detailed breakdown is explicitly asked for

You are embedded in:
1. The Premium Dashboard — where vendors see their daily overview
2. The Premium Sales page — where they track transactions

When asked about sales, inventory, or trends, be specific and helpful.
If you don't have live data, clearly say so and offer what you can with the context provided.`;

export async function POST(request: NextRequest) {
  const token = request.cookies.get(authConfig.cookies.accessToken)?.value;
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  let userMessage = "";

  try {
    const payload = TokenUtil.verifyAccessToken(token);
    if (!payload?.id) return NextResponse.json({ message: "Invalid token" }, { status: 401 });

    const body = await request.json();
    userMessage = body.message || "";
    const context: string = body.context || ""; // optional: "dashboard" | "sales"

    if (!userMessage.trim()) {
      return NextResponse.json({ success: false, message: "Message is required" }, { status: 400 });
    }

    // Fetch live vendor sales context to inject into the prompt
    let liveContext = "";
    try {
      const vendor = await VendorRepository.findByUserId(payload.id);
      if (vendor) {
        const sales = await SalesRepository.findByVendorId(vendor.id);
        const today = new Date().toDateString();
        const todaySales = sales.filter(s => new Date(s.createdAt).toDateString() === today);
        const todayRevenue = todaySales.reduce((sum, s) => sum + parseFloat(s.amount || "0"), 0);
        const totalRevenue = sales.reduce((sum, s) => sum + parseFloat(s.amount || "0"), 0);
        
        liveContext = `
LIVE VENDOR DATA (use this in your response where relevant):
- Business: ${vendor.businessName || "vendor"}
- Today's transactions: ${todaySales.length}
- Today's revenue: $${todayRevenue.toFixed(2)}
- Total all-time revenue: $${totalRevenue.toFixed(2)}
- Total transactions: ${sales.length}
- Page context: ${context || "dashboard"}
`;
      }
    } catch {
      // silently skip if data fetch fails
    }

    const model = getGeminiModel(SYSTEM_PROMPT + "\n\n" + liveContext);

    // If no API key configured, fall back to a smart mock
    if (!model) {
      const reply = getFallbackReply(userMessage);
      return NextResponse.json({ success: true, response: reply });
    }

    const result = await model.generateContent(userMessage);
    const text = result.response.text() || "";

    return NextResponse.json({ success: true, response: text });
  } catch (error: any) {
    console.error("Gemini AI API error:", error?.message || error);
    
    // Catch rate limits gracefully (429 Too Many Requests)
    const errMsg = (error?.message || error?.statusText || "").toLowerCase();
    if (errMsg.includes("429") || errMsg.includes("too many requests") || errMsg.includes("quota")) {
      return NextResponse.json({
        success: true,
        response: "I'm helping a lot of vendors right now! Please wait about 10 seconds and ask me again. 🙏"
      });
    }

    // Graceful fallback so the chat never fully breaks
    return NextResponse.json({
      success: true,
      response: "I'm having a momentary issue connecting to my AI engine. Please try again in a few seconds! 🙏",
    });
  }
}

// Smart keyword-based fallback when no API key is set
function getFallbackReply(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("hello") || m.includes("hi") || m.includes("សួស្ត"))
    return "សួស្តី! I'm your AI Business Assistant. I can help analyze sales trends, forecast revenue, and manage your inventory. What would you like to know?";
  if (m.includes("sales") && m.includes("today"))
    return "You're currently tracking your real-time sales on the dashboard. Check the summary cards above for today's totals!";
  if (m.includes("inventory") || m.includes("stock"))
    return "Head to the Inventory page to see your live stock levels. Smart Alerts will also notify you before items run critically low.";
  if (m.includes("forecast") || m.includes("predict") || m.includes("next week"))
    return "The AI Revenue Forecast chart on your Sales page shows a 7-day prediction based on historical data. Currently forecasting ~$3,120 next week.";
  if (m.includes("profit"))
    return "Your Net Profit = Total Sales − Total Expenses. It's shown in real-time on the dashboard summary cards.";
  if (m.includes("weather") || m.includes("rain"))
    return "🌧️ Rainy conditions typically increase demand for umbrellas and rain gear by 25-35%. Consider stocking up on waterproof phone cases too!";
  return "I'm your AI-powered Premium business assistant! Ask me about sales trends, inventory, forecasts, or any business question. Please configure GEMINI_API_KEY for full AI capabilities.";
}
