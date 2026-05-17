"use client";

import { useEffect } from "react";
import { processQueue } from "@/lib/pwa/sync-queue";

export function ServiceWorkerProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js").then(
          (registration) => {
            console.log("Service Worker registration successful with scope: ", registration.scope);
          },
          (err) => {
            console.log("Service Worker registration failed: ", err);
          }
        );
      });

      navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data?.type === "PROCESS_OFFLINE_QUEUE") {
          processQueue();
        }
      });

      window.addEventListener("online", () => {
        // Wait for connection to stabilize before syncing
        setTimeout(() => processQueue(), 2000);
      });
      
      // Process on initial load if online
      if (navigator.onLine) {
        setTimeout(() => processQueue(), 1000);
      }
    }
  }, []);

  return <>{children}</>;
}
