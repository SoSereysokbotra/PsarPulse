"use client";

import { useEffect, useState } from "react";
import { WifiOff, Wifi } from "lucide-react";

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [showBackOnline, setShowBackOnline] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      setShowBackOnline(true);
      setTimeout(() => setShowBackOnline(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowBackOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Only render on client to avoid hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  if (isOnline && !showBackOnline) return null;

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[100] p-2 text-center text-sm font-medium transition-colors duration-300 flex items-center justify-center gap-2 ${
        isOnline
          ? "bg-[#29B28D] text-white"
          : "bg-amber-500 text-white"
      }`}
    >
      {isOnline ? (
        <>
          <Wifi className="w-4 h-4" />
          <span>Back online!</span>
        </>
      ) : (
        <>
          <WifiOff className="w-4 h-4" />
          <span>You're offline — data will sync when you're back online</span>
        </>
      )}
    </div>
  );
}
