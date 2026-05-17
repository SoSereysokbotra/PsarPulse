import { addToStore, getAllFromStore, deleteFromStore } from "./db";

export interface SyncRequest {
  id: string;
  url: string;
  method: string;
  body?: any;
  headers?: Record<string, string>;
  timestamp: number;
  retryCount: number;
}

export async function queueRequest(url: string, method: string, body?: any, headers?: Record<string, string>) {
  const request: SyncRequest = {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'temp-' + Date.now() + Math.random().toString(36).substring(2),
    url,
    method,
    body,
    headers,
    timestamp: Date.now(),
    retryCount: 0,
  };
  await addToStore("sync-queue", request);
  
  // Try to register background sync if supported
  if ("serviceWorker" in navigator && "SyncManager" in window) {
    try {
      const registration = await navigator.serviceWorker.ready;
      await (registration as any).sync.register("sync-offline-data");
    } catch (err) {
      console.error("Background Sync registration failed:", err);
    }
  }
}

export async function getQueuedRequests(): Promise<SyncRequest[]> {
  const requests = await getAllFromStore("sync-queue");
  return requests.sort((a, b) => a.timestamp - b.timestamp);
}

export async function removeFromQueue(id: string) {
  await deleteFromStore("sync-queue", id);
}

let isProcessing = false;

export async function processQueue() {
  if (typeof navigator !== "undefined" && navigator.locks) {
    await navigator.locks.request("sync-queue-process", { ifAvailable: true }, async (lock) => {
      if (!lock) return; // Already processing in this or another tab
      await doProcessQueue();
    });
  } else {
    if (isProcessing) return;
    isProcessing = true;
    try {
      await doProcessQueue();
    } finally {
      isProcessing = false;
    }
  }
}

async function doProcessQueue() {
  try {
    const requests = await getQueuedRequests();
    if (requests.length === 0) return;

    // Send to background sync API route
    const syncResults = await fetch("/api/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requests }),
    });

    if (syncResults.ok) {
      const data = await syncResults.json();
      for (const result of data.results || []) {
        if (result.success || result.unrecoverable) {
          await removeFromQueue(result.id);
        } else {
          // Increment retry count
          const req = requests.find((r) => r.id === result.id);
          if (req) {
            req.retryCount += 1;
            await addToStore("sync-queue", req);
          }
        }
      }
    }
  } catch (error) {
    console.error("Failed to process sync queue", error);
  }
}
