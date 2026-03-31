import { NextRequest, NextResponse } from "next/server";
import { TokenUtil } from "@/lib/auth/utils/token.util";
import { authConfig } from "@/lib/auth/config";
import { VendorRepository } from "@/lib/db/repositories/vendor.repository";
import { InventoryRepository } from "@/lib/db/repositories/inventory.repository";
import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * AI Weather Intelligence API
 * Detects current simulated weather and provides business impact analysis via Gemini.
 */

export async function GET(request: NextRequest) {
  const token = request.cookies.get(authConfig.cookies.accessToken)?.value;
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const payload = TokenUtil.verifyAccessToken(token);
    if (!payload?.id) return NextResponse.json({ message: "Invalid token" }, { status: 401 });

    const vendor = await VendorRepository.findByUserId(payload.id);
    if (!vendor) return NextResponse.json({ message: "Vendor not found" }, { status: 404 });

    // 1. Fetch real-time weather (Phnom Penh context)
    let weather = {
      condition: "Clear Sky",
      temp: "32°C",
      icon: "☀️",
      impact: "steady"
    };

    try {
      // Use wttr.in for keyless real-time data or open-meteo
      const weatherRes = await fetch("https://wttr.in/Phnom+Penh?format=j1");
      const weatherData = await weatherRes.json();
      
      if (weatherData && weatherData.current_condition && weatherData.current_condition[0]) {
        const current = weatherData.current_condition[0];
        const tempC = current.temp_C;
        const desc = current.weatherDesc[0].value;
        
        weather = {
          condition: desc,
          temp: `${tempC}°C`,
          icon: desc.toLowerCase().includes("rain") ? "🌧️" : 
                desc.toLowerCase().includes("cloud") ? "☁️" : 
                desc.toLowerCase().includes("clear") ? "☀️" : "⛅",
          impact: desc.toLowerCase().includes("rain") ? "busy" : "steady"
        };
      }
    } catch (err) {
      console.error("Real Weather Fetch Error (falling back to simulation):", err);
      // Fallback simulation if service is down
      const hour = new Date().getHours();
      if (hour >= 18 || hour <= 5) weather = { condition: "Cool Evening", temp: "26°C", icon: "🌙", impact: "steady" };
    }

    // 2. Fetch Vendor's Actual Inventory
    const inventory = await InventoryRepository.findByVendorId(vendor.id);
    const productNames = inventory.map(i => `${i.name} (Stock: ${i.stock})`).join(", ");

    // 3. AI Analysis with Gemini
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Return a smart mock if no API key
      return NextResponse.json({
        success: true,
        data: {
          ...weather,
          suggestions: [
            { product: inventory[0]?.name || "Primary Products", change: "+15%", reason: `Standard demand spike for ${weather.condition} conditions.` }
          ]
        }
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are the PsarPulse Weather Intelligence Assistant for vendor: ${vendor.businessName}.
      Current Weather: ${weather.condition} (${weather.temp}).
      
      Vendor Inventory: [${productNames}].
      
      Based on this weather and inventory, identify 2-3 products that will experience a change in demand.
      Provide the result in the following JSON array format ONLY (no other text):
      [
        {"product": "Product Name", "change": "+25%", "reason": "Short business reason"}
      ]
      
      If the inventory is empty, suggest generic market items relevant to ${weather.condition}.
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().replace(/```json|```/g, "").trim();
    const suggestions = JSON.parse(responseText);

    return NextResponse.json({
      success: true,
      data: {
        ...weather,
        suggestions
      }
    });

  } catch (error) {
    console.error("Weather Intelligence API Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
