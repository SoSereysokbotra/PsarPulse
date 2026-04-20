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
      // 3. Create proxy request
      // We clone the headers but might want to override Host or Origin
      // Cloudflare worker will automatically set its own client IP which Bakong allows
      
      const newHeaders = new Headers(request.headers);
      // Remove restricted headers that might interfere with Cloudflare/Bakong
      newHeaders.delete("Host");
      newHeaders.delete("Origin");
      newHeaders.delete("Referer");

      const proxyRequest = new Request(targetUrl, {
        method: request.method,
        headers: newHeaders,
        body: request.method !== "GET" && request.method !== "HEAD" ? await request.clone().arrayBuffer() : null,
      });

      // 4. Fetch from Bakong API
      const response = await fetch(proxyRequest);

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
