import { queueRequest } from "./sync-queue";

/**
 * A wrapper around native fetch that catches network errors
 * and queues mutations (POST, PUT, DELETE, PATCH) for later sync via IndexedDB
 */
export async function offlineFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  try {
    const response = await fetch(input, init);
    return response;
  } catch (error) {
    // If it's a mutation and network failed, queue it
    const method = init?.method?.toUpperCase() || "GET";
    if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
      const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
      
      let parsedBody = init?.body;
      if (typeof parsedBody === "string") {
        try {
          parsedBody = JSON.parse(parsedBody);
        } catch (e) {
          // Keep as string if parsing fails
        }
      }

      await queueRequest(
        url,
        method,
        parsedBody,
        init?.headers as Record<string, string>
      );
      
      // Return a simulated success response so the UI optimistically updates
      return new Response(JSON.stringify({ 
        success: true, 
        offlineQueued: true,
        data: {
          id: "temp-" + Date.now(),
          ...(typeof parsedBody === 'object' && parsedBody !== null ? parsedBody : { raw: parsedBody }),
          createdAt: new Date().toISOString()
        }
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    // For GET requests, let the caller or Service Worker cache handle it
    throw error;
  }
}
