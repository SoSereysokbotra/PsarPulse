"use client";

import React, { useState, useEffect } from "react";
import { Settings, Save, Loader2 } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";

const DEFAULT_SETTINGS = [
  { key: "currency", label: "Currency Code", value: "USD" },
  { key: "locale", label: "Default Locale", value: "en-US" },
  { key: "tax_rate", label: "Tax Rate (%)", value: "10" },
  { key: "platform_name", label: "Platform Name", value: "PsarPulse KH" },
  { key: "support_email", label: "Support Email", value: "support@psarpulse.com" },
  { key: "timezone", label: "Timezone", value: "Asia/Phnom_Penh" },
];

export default function SettingsPage() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/superadmin/settings").then(r => r.json()).then(d => {
      if (d.success) {
        const map: Record<string, string> = {};
        d.data.forEach((s: any) => { map[s.key] = s.value; });
        setSettings(map);
      }
      setLoading(false);
    });
  }, []);

  const handleSave = async (key: string, label: string) => {
    setSaving(key);
    const value = settings[key] ?? DEFAULT_SETTINGS.find(s => s.key === key)?.value ?? "";
    await fetch("/api/superadmin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value, label }),
    });
    setSaving(null);
    setSaved(key);
    setTimeout(() => setSaved(null), 2000);
  };

  const displaySettings = DEFAULT_SETTINGS.map(s => ({
    ...s,
    value: settings[s.key] ?? s.value,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-2xl font-bold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>Platform Settings</h1>
        <p className={`text-sm mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Configure app-wide defaults for currency, locale, tax and more.</p>
      </div>

      <div className={`rounded-xl border shadow-sm overflow-hidden ${isDark ? "bg-[#161b22] border-white/10" : "bg-white border-slate-200"}`}>
        {loading ? (
          <div className="flex items-center justify-center py-12"><Loader2 className="animate-spin text-slate-400 w-5 h-5" /></div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-white/5">
            {displaySettings.map((setting) => (
              <div key={setting.key} className="flex items-center gap-4 px-6 py-4">
                <div className="flex-1">
                  <label className={`block text-sm font-medium mb-1 ${isDark ? "text-slate-200" : "text-slate-700"}`}>
                    {setting.label}
                  </label>
                  <input
                    type="text"
                    value={setting.value}
                    onChange={e => setSettings(prev => ({ ...prev, [setting.key]: e.target.value }))}
                    className={`w-full px-3 py-2 text-sm rounded-lg border focus:ring-2 focus:ring-violet-500/30 outline-none ${isDark ? "bg-white/5 border-white/10 text-white" : "bg-slate-50 border-slate-200 text-slate-900"}`}
                  />
                </div>
                <button
                  onClick={() => handleSave(setting.key, setting.label)}
                  disabled={saving === setting.key}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                    saved === setting.key
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-violet-600 hover:bg-violet-700 text-white"
                  } disabled:opacity-50`}
                >
                  {saving === setting.key
                    ? <Loader2 className="w-3 h-3 animate-spin" />
                    : saved === setting.key
                    ? "Saved ✓"
                    : <><Save className="w-3 h-3" /> Save</>
                  }
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
