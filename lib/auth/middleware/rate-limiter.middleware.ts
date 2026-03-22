import { NextRequest, NextResponse } from "next/server";
import { authConfig } from "../config";

// Rate limiter middleware using in-memory storage
const requestCounts = new Map<string, { count: number; resetTime: number }>();

function getClientIP(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") || "unknown";
}

export async function authLimiter(
  request: NextRequest,
): Promise<NextResponse | null> {
  const clientIP = getClientIP(request);
  const now = Date.now();
  const windowMs = authConfig.rateLimiting.authWindowMs * 1000;
  const maxRequests = authConfig.rateLimiting.authMax;

  const record = requestCounts.get(clientIP);

  // Clean up old records
  if (record && now > record.resetTime) {
    requestCounts.delete(clientIP);
  }

  // Get or create record
  const current = requestCounts.get(clientIP) || {
    count: 0,
    resetTime: now + windowMs,
  };

  // Increment count
  current.count++;
  requestCounts.set(clientIP, current);

  // Check if exceeded limit
  if (current.count > maxRequests) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  return null;
}
