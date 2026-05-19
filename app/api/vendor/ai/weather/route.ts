import { NextRequest, NextResponse } from "next/server";
import { TokenUtil } from "@/lib/auth/utils/token.util";
import { authConfig } from "@/lib/auth/config";
import { VendorRepository } from "@/lib/db/repositories/vendor.repository";
import { InventoryRepository } from "@/lib/db/repositories/inventory.repository";
import { getGeminiModel, withAICache } from "@/lib/ai/gemini";
import { SchemaType } from "@google/generative-ai";

/**
 * AI Weather Intelligence API
 * Detects current simulated weather and provides business impact analysis via Gemini.
 * Includes 10-minute per-vendor caching to avoid Gemini rate limit exhaustion.
 */
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
    const openWeatherApiKey = process.env.OPENWEATHER_API_KEY;

    // Use centralized AI cache wrapper
    const { data: responseData, cached } = await withAICache(
      `weather-${vendor.id}`,
      CACHE_TTL,
      async () => {
        // 1. Fetch real-time weather (Phnom Penh context)
        let weather = {
          condition: "Clear Sky",
          temp: "32°C",
          icon: "☀️",
          impact: "steady",
        };

        try {
          if (openWeatherApiKey) {
            // Use OpenWeather API for real-time data
            const weatherRes = await fetch(
              `https://api.openweathermap.org/data/2.5/weather?q=Phnom+Penh&appid=${encodeURIComponent(openWeatherApiKey)}&units=metric`,
            );

            if (weatherRes.ok) {
              const weatherData = await weatherRes.json();

              if (
                weatherData &&
                weatherData.weather &&
                weatherData.weather[0] &&
                weatherData.main
              ) {
                const tempC = Math.round(weatherData.main.temp);
                const desc = weatherData.weather[0].main;

                weather = {
                  condition: desc,
                  temp: `${tempC}°C`,
                  icon: desc.toLowerCase().includes("rain")
                    ? "🌧️"
                    : desc.toLowerCase().includes("cloud")
                      ? "☁️"
                      : desc.toLowerCase().includes("clear")
                        ? "☀️"
                        : "⛅",
                  impact: desc.toLowerCase().includes("rain")
                    ? "busy"
                    : "steady",
                };
              }
            } else {
              console.warn(
                "OpenWeather request failed, using fallback weather.",
              );
            }
          } else {
            console.warn(
              "OPENWEATHER_API_KEY is not set; using fallback weather.",
            );
          }
        } catch (err) {
          console.error(
            "Real Weather Fetch Error (falling back to simulation):",
            err,
          );
          const hour = new Date().getHours();
          if (hour >= 18 || hour <= 5)
            weather = {
              condition: "Cool Evening",
              temp: "26°C",
              icon: "🌙",
              impact: "steady",
            };
        }

        // 2. Fetch Vendor's Actual Inventory
        const inventory = await InventoryRepository.findByVendorId(vendor.id);
        const productNames = inventory
          .map((i) => `${i.name} (Stock: ${i.stock})`)
          .join(", ");

        const systemPrompt = `You are the PsarPulse Weather Intelligence Assistant for vendor: ${vendor.businessName}.`;
        const model = getGeminiModel(systemPrompt);

        if (!model) {
          // Return a smart mock if no API key
          return {
            ...weather,
            suggestions: [
              {
                product: inventory[0]?.name || "Primary Products",
                change: "+15%",
                reason: `Standard demand spike for ${weather.condition} conditions.`,
              },
            ],
          };
        }

        const prompt = `Current Weather: ${weather.condition} (${weather.temp}).
Vendor Inventory: [${productNames}].

Based on this weather and inventory, identify 2-3 products that will experience a change in demand.
If the inventory is empty, suggest generic market items relevant to ${weather.condition}.`;

        try {
          // Use JSON MIME type for robust response parsing
          const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: "application/json",
              responseSchema: {
                type: SchemaType.ARRAY,
                items: {
                  type: SchemaType.OBJECT,
                  properties: {
                    product: { type: SchemaType.STRING },
                    change: { type: SchemaType.STRING },
                    reason: { type: SchemaType.STRING },
                  },
                  required: ["product", "change", "reason"],
                },
              },
            },
          });

          const responseText = result.response.text() || "[]";
          const suggestions = JSON.parse(responseText);
          return { ...weather, suggestions };
        } catch (rateLimitErr: any) {
          const errMsg = (rateLimitErr?.message || "").toLowerCase();
          if (
            errMsg.includes("429") ||
            errMsg.includes("quota") ||
            errMsg.includes("too many")
          ) {
            return {
              ...weather,
              suggestions: [
                {
                  product: "Sunglasses & Hats",
                  change: "+20%",
                  reason:
                    "Hot weather increases demand for sun protection accessories.",
                },
                {
                  product: "Portable Fans & Batteries",
                  change: "+15%",
                  reason:
                    "Warm conditions drive demand for cooling accessories and power supplies.",
                },
              ],
            };
          }
          throw rateLimitErr;
        }
      },
    );

    return NextResponse.json({ success: true, data: responseData, cached });
  } catch (error: any) {
    console.error("Weather Intelligence API Error:", error?.message || error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
