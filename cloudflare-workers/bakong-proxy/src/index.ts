/**
 * Welcome to Cloudflare Workers!
 *
 * This worker acts as a proxy to the Bakong API, bypassing WAF restrictions 
 * that block cloud hosting IPs (like Vercel/AWS), and injecting CORS headers 
 * to allow direct browser polling from our frontend.
 */

export interface Env {
  // If you set any secrets, they go here
}

const BAKONG_API_BASE = "https://api-bakong.nbc.gov.kh/v1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
};

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // 1. Handle CORS Preflight requests
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    // 2. Determine target URL
    const url = new URL(request.url);
    // Forward the specific path requested, e.g. /check_transaction_by_md5
    const targetUrl = `${BAKONG_API_BASE}${url.pathname}${url.search}`;

    try {
      // 3. Create proxy request - Absolute minimal headers
      const targetReqHeaders = new Headers();
      if (request.headers.get("Authorization")) {
        targetReqHeaders.set("Authorization", request.headers.get("Authorization")!);
      }
      if (request.headers.get("Content-Type")) {
        targetReqHeaders.set("Content-Type", request.headers.get("Content-Type")!);
      }

      // 4. Fetch from Bakong API
      const response = await fetch(targetUrl, {
        method: request.method,
        headers: targetReqHeaders,
        body: request.method !== "GET" && request.method !== "HEAD" ? await request.text() : undefined,
      });

      // 5. Build response 
      const responseBody = await response.text();
      const headers = new Headers();
      headers.set("Content-Type", response.headers.get("Content-Type") || "application/json");
      
      // Inject our CORS headers into the real response
      Object.entries(corsHeaders).forEach(([key, value]) => {
        headers.set(key, value);
      });

      return new Response(responseBody, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
      
    } catch (error: any) {
      return new Response(JSON.stringify({ error: error.message || "Proxy error" }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    }
  },
};
