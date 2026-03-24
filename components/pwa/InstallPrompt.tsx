"use client";

import { useEffect, useState } from "react";
import { X, Download } from "lucide-react";

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const isDismissed = localStorage.getItem("pwa-install-dismissed");
    if (isDismissed) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("pwa-install-dismissed", "true");
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-[#111111] border-t border-gray-800 shadow-lg transform transition-transform duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-white font-medium text-sm md:text-base">Install PsarPulse</h3>
          <p className="text-gray-400 text-xs md:text-sm">Get the app-like experience and offline capabilities.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDismiss}
            className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
          <button
            onClick={handleInstall}
            className="flex items-center gap-2 bg-[#29B28D] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#229A78] transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="hidden md:inline">Install App</span>
          </button>
        </div>
      </div>
    </div>
  );
}
