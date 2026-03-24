import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { requests } = await req.json();
    if (!Array.isArray(requests)) {
      return NextResponse.json({ success: false, error: "Invalid format" }, { status: 400 });
    }

    const token = req.cookies.get("access_token")?.value;
    const origin = req.nextUrl.origin;
    const results = [];

    for (const syncReq of requests) {
      try {
        // Ensure relative URLs are resolved correctly against our origin
        const urlToFetch = syncReq.url.startsWith("http") 
          ? syncReq.url 
          : new URL(syncReq.url, origin).toString();
        
        const fetchOptions: RequestInit = {
          method: syncReq.method,
          headers: {
            "Content-Type": "application/json",
            ...(token ? { "Cookie": `access_token=${token}` } : {})
          },
        };

        if (syncReq.body && syncReq.method !== "GET" && syncReq.method !== "HEAD") {
          fetchOptions.body = JSON.stringify(syncReq.body);
        }

        const res = await fetch(urlToFetch, fetchOptions);
        
        if (res.ok) {
          results.push({ id: syncReq.id, success: true });
        } else {
          // If 4xx client error, it's likely unrecoverable (validation failed, not found, etc.)
          const isUnrecoverable = res.status >= 400 && res.status < 500;
          results.push({ id: syncReq.id, success: false, unrecoverable: isUnrecoverable, status: res.status });
        }
      } catch (err) {
        // Network errors or connection issues, definitely recoverable
        results.push({ id: syncReq.id, success: false, unrecoverable: false });
      }
    }

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error("Sync API error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
