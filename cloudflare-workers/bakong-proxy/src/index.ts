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
      // Only forward strictly necessary headers to avoid triggering CloudFront WAF
      const newHeaders = new Headers();
      
      const auth = request.headers.get("Authorization");
      if (auth) newHeaders.set("Authorization", auth);
      
      const contentType = request.headers.get("Content-Type");
      if (contentType) newHeaders.set("Content-Type", contentType);
      
      // Pass a standard User Agent if present, otherwise default
      const ua = request.headers.get("User-Agent");
      newHeaders.set("User-Agent", ua || "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");
      
      // Add standard accepts to look like a normal client
      newHeaders.set("Accept", "application/json, text/plain, */*");
      newHeaders.set("Accept-Language", "en-US,en;q=0.9");
      
      // Spoof Origin, Host, and Referer to trick WAF into thinking this is a direct/first-party API call
      newHeaders.set("Host", "api-bakong.nbc.gov.kh");
      newHeaders.set("Origin", "https://api-bakong.nbc.gov.kh");
      newHeaders.set("Referer", "https://api-bakong.nbc.gov.kh/");

      // Read body fully before sending
      const bodyText = request.method !== "GET" && request.method !== "HEAD" ? await request.text() : undefined;

      const response = await fetch(targetUrl, {
        method: request.method,
        headers: newHeaders,
        body: bodyText,
        redirect: "follow",
      });

      // 5. Build response with original body and status
      const responseBody = await response.arrayBuffer();
      const headers = new Headers(response.headers);
      
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
