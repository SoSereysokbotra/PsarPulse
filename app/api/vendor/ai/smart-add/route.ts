import { NextRequest, NextResponse } from "next/server";
import { TokenUtil } from "@/lib/auth/utils/token.util";
import { authConfig } from "@/lib/auth/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: NextRequest) {
  const token = request.cookies.get(authConfig.cookies.accessToken)?.value;
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const payload = TokenUtil.verifyAccessToken(token);
    if (!payload?.id) return NextResponse.json({ message: "Invalid token" }, { status: 401 });

    const body = await request.json();
    const { prompt } = body;

    if (!prompt) {
      return NextResponse.json({ success: false, message: "No prompt provided" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Basic fallback logic if no API key
      const amountMatch = prompt.match(/\$?\d+(\.\d{2})?/);
      return NextResponse.json({
        success: true,
        data: {
          amount: amountMatch ? parseFloat(amountMatch[0].replace("$", "")) : 0,
          items: prompt,
          category: "Other",
          method: prompt.toLowerCase().includes("aba") ? "ABA/KHQR" : "Cash"
        }
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const aiPrompt = `
      You are a Smart Sales Assistant for PsarPulse. 
      Parse the following natural language sales log into structured data:
      "${prompt}"
      
      Extract:
      1. amount: Total price/revenue (number). IMPORTANT: Distinguish between item count (e.g., "3 coffee") and total price (e.g., "12$"). The amount is the currency value.
      2. items: Description of what was sold (string).
      3. category: Single best category (one of: Food, Beverage, Apparel, Electronics, Household, Service, Other).
      4. method: Payment method (one of: "Cash", "ABA/KHQR", "Other"). Look for keywords like "aba", "khqr", "transfer", "cash".
      
      Respond in JSON format ONLY:
      {"amount": number, "items": "items here", "category": "category here", "method": "method here"}
    `;

    const result = await model.generateContent(aiPrompt);
    const responseText = result.response.text().replace(/```json|```/g, "").trim();
    const parsedData = JSON.parse(responseText);

    return NextResponse.json({
      success: true,
      data: parsedData
    });
  } catch (error) {
    console.error("AI Smart Add Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
