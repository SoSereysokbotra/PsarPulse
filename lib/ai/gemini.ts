import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

/**
 * Returns an instance of the configured Gemini 1.5 Flash model.
 * @param systemInstruction Optional system instruction string to guide behavior
 */
export function getGeminiModel(systemInstruction?: string) {
  if (!apiKey) {
    return null;
  }
  
  return genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    // Only pass systemInstruction if it's provided and not empty
    ...(systemInstruction ? { systemInstruction } : {})
  });
}

// ─── Shared In-Memory Cache ──────────────────────────────
type CacheItem = { data: any; timestamp: number };
const memoryCache = new Map<string, CacheItem>();

/**
 * Wraps an AI function call with memory caching to preserve rate limits.
 * @param key Unique key for the cache (e.g., \`weather-\${vendorId}\`)
 * @param ttlMs Time to live in milliseconds
 * @param fetcher Async function that generates the data to cache if it's a miss
 */
export async function withAICache<T>(key: string, ttlMs: number, fetcher: () => Promise<T>): Promise<{ data: T; cached: boolean }> {
  const cached = memoryCache.get(key);
  
  if (cached && Date.now() - cached.timestamp < ttlMs) {
    return { data: cached.data as T, cached: true };
  }

  // Cache Miss - Fetch Data
  const data = await fetcher();
  
  // Only cache if data was successfully produced
  if (data) {
    memoryCache.set(key, { data, timestamp: Date.now() });
  }

  return { data, cached: false };
}
