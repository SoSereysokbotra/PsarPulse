import { NextRequest, NextResponse } from "next/server";
import { TokenUtil } from "@/lib/auth/utils/token.util";
import { authConfig } from "@/lib/auth/config";
import { getGeminiModel } from "@/lib/ai/gemini";
import { SchemaType } from "@google/generative-ai";

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

    const model = getGeminiModel(`You are a Smart Sales Assistant for PsarPulse. 
Parse the following natural language sales log into structured data.
Extract:
1. amount: Total price/revenue (number). IMPORTANT: Distinguish between item count (e.g., "3 coffee") and total price (e.g., "12$"). The amount is the currency value.
2. items: Description of what was sold (string).
3. category: Single best category (one of: Food, Beverage, Apparel, Electronics, Household, Service, Other).
4. method: Payment method (one of: "Cash", "ABA/KHQR", "Other"). Look for keywords like "aba", "khqr", "transfer", "cash".`);

    if (!model) {
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

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
             amount: { type: SchemaType.NUMBER },
             items: { type: SchemaType.STRING },
             category: { type: SchemaType.STRING },
             method: { type: SchemaType.STRING }
          },
          required: ["amount", "items", "category", "method"]
        }
      }
    });

    const parsedData = JSON.parse(result.response.text());

    return NextResponse.json({
      success: true,
      data: parsedData
    });
  } catch (error: any) {
    console.error("AI Smart Add Error:", error?.message || error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
