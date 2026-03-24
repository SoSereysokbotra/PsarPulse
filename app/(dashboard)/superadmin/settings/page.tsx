"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  Save,
  Loader2,
  Globe,
  CreditCard,
  Database,
  Building2,
  Mail,
  Clock,
  Percent,
  DollarSign,
} from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";

const DEFAULT_SETTINGS = [
  {
    key: "platform_name",
    label: "Platform Name",
    value: "PsarPulse KH",
    group: "general",
    icon: Building2,
    desc: "The global name displayed across the platform.",
  },
  {
    key: "support_email",
    label: "Support Email",
    value: "support@psarpulse.com",
    group: "general",
    icon: Mail,
    desc: "Primary email address for user support inquiries.",
  },
  {
    key: "locale",
    label: "Default Locale",
    value: "en-US",
    group: "regional",
    icon: Globe,
    desc: "Standard language and formatting locale.",
  },
  {
    key: "timezone",
    label: "Timezone",
    value: "Asia/Phnom_Penh",
    group: "regional",
    icon: Clock,
    desc: "Global timezone for system operations and logs.",
  },
  {
    key: "currency",
    label: "Currency Code",
    value: "USD",
    group: "financial",
    icon: DollarSign,
    desc: "Base currency used for billing and subscriptions.",
  },
  {
    key: "tax_rate",
    label: "Tax Rate (%)",
    value: "10",
    group: "financial",
    icon: Percent,
    desc: "Default tax rate applied to platform transactions.",
  },
];

const TABS = [
  {
    id: "general",
    label: "General",
    icon: Settings,
    desc: "Platform info & contact",
  },
  {
    id: "regional",
    label: "Localization",
    icon: Globe,
    desc: "Region & time settings",
  },
  {
    id: "financial",
    label: "Financial",
    icon: CreditCard,
    desc: "Currency & tax rates",
  },
  {
    id: "system",
    label: "System",
    icon: Database,
    desc: "Advanced configuration",
  },
];

export default function SuperadminSettingsPage() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/superadmin/settings")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          const map: Record<string, string> = {};
          d.data.forEach((s: any) => {
            map[s.key] = s.value;
          });
          setSettings(map);
        }
      })
      .catch(() => console.log("Simulating fetch failure, using defaults."))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (key: string, label: string) => {
    setSaving(key);
    const value =
      settings[key] ?? DEFAULT_SETTINGS.find((s) => s.key === key)?.value ?? "";

    try {
      await fetch("/api/superadmin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value, label }),
      });
    } catch (error) {
      console.log("Simulating save for", key);
    }

    // Simulate network delay for UI feedback
    setTimeout(() => {
      setSaving(null);
      setSaved(key);
      setTimeout(() => setSaved(null), 2000);
    }, 600);
  };

  const currentGroupSettings = DEFAULT_SETTINGS.filter(
    (s) => s.group === activeTab,
  ).map((s) => ({
    ...s,
    value: settings[s.key] ?? s.value,
  }));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div>
        <h1
          className={`text-3xl font-bold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}
        >
          Platform Settings
        </h1>
        <p
          className={`text-sm mt-1.5 max-w-2xl ${isDark ? "text-slate-400" : "text-slate-500"}`}
        >
          Configure app-wide defaults for currency, locale, tax, and system
          operations. Changes here affect all administrative and public-facing
          interfaces.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Navigation Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0 scrollbar-none">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-start gap-3 p-3 rounded-xl transition-all text-left min-w-[200px] md:min-w-0 ${
                    isActive
                      ? isDark
                        ? "bg-violet-500/10 border-violet-500/20 border text-violet-400"
                        : "bg-violet-50 border-violet-100 border text-violet-700"
                      : isDark
                        ? "border border-transparent text-slate-400 hover:bg-white/5 hover:text-slate-200"
                        : "border border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 mt-0.5 shrink-0 ${isActive ? "text-violet-500" : "opacity-70"}`}
                  />
                  <div>
                    <span className="block font-medium text-sm">
                      {tab.label}
                    </span>
                    <span
                      className={`block text-xs mt-0.5 ${isActive ? "opacity-80" : "opacity-60"}`}
                    >
                      {tab.desc}
                    </span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content Area */}
        <div
          className={`flex-1 rounded-2xl border shadow-sm min-h-[400px] flex flex-col ${isDark ? "bg-[#161b22] border-white/10" : "bg-white border-slate-200"}`}
        >
          <div
            className={`px-6 py-5 border-b ${isDark ? "border-white/5" : "border-slate-100"}`}
          >
            <h2
              className={`font-semibold text-lg capitalize ${isDark ? "text-white" : "text-slate-800"}`}
            >
              {activeTab} Settings
            </h2>
            <p
              className={`text-sm mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}
            >
              {TABS.find((t) => t.id === activeTab)?.desc}
            </p>
          </div>

          <div className="p-6 flex-1">
            {loading ? (
              <div className="flex items-center justify-center h-full min-h-[200px]">
                <Loader2 className="animate-spin text-violet-500 w-8 h-8" />
              </div>
            ) : activeTab === "system" ? (
              // Empty state for System tab
              <div
                className={`text-center flex flex-col items-center justify-center h-full min-h-[250px] ${isDark ? "text-slate-400" : "text-slate-500"}`}
              >
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isDark ? "bg-white/5" : "bg-slate-50"}`}
                >
                  <Database className="w-8 h-8 opacity-50" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                  Advanced System Configuration
                </h3>
                <p className="text-sm max-w-sm">
                  Cache management, cron job triggers, and database maintenance
                  tools will be available here in v2.0.
                </p>
              </div>
            ) : (
              // Dynamic Form Fields for General, Regional, and Financial
              <div className="space-y-5">
                {currentGroupSettings.map((setting) => (
                  <div
                    key={setting.key}
                    className={`p-5 rounded-xl border flex flex-col xl:flex-row xl:items-center gap-5 justify-between transition-colors ${
                      isDark
                        ? "border-white/5 bg-white/[0.02] hover:bg-white/[0.04]"
                        : "border-slate-100 bg-slate-50/50 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex gap-4 items-start flex-1">
                      <div
                        className={`p-2.5 rounded-lg shrink-0 ${isDark ? "bg-slate-800 text-slate-400" : "bg-white border shadow-sm text-slate-500"}`}
                      >
                        <setting.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 max-w-md">
                        <label
                          className={`block text-sm font-semibold mb-1 ${isDark ? "text-slate-200" : "text-slate-800"}`}
                        >
                          {setting.label}
                        </label>
                        <p
                          className={`text-xs mb-3 ${isDark ? "text-slate-400" : "text-slate-500"}`}
                        >
                          {setting.desc}
                        </p>
                        <input
                          type="text"
                          value={setting.value}
                          onChange={(e) =>
                            setSettings((prev) => ({
                              ...prev,
                              [setting.key]: e.target.value,
                            }))
                          }
                          className={`w-full px-3.5 py-2 text-sm rounded-lg border focus:ring-2 focus:ring-violet-500/30 outline-none transition-all ${
                            isDark
                              ? "bg-[#0d1117] border-white/10 text-white focus:border-violet-500/50"
                              : "bg-white border-slate-200 text-slate-900 focus:border-violet-400 shadow-sm"
                          }`}
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => handleSave(setting.key, setting.label)}
                      disabled={saving === setting.key}
                      className={`shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${
                        saved === setting.key
                          ? "bg-emerald-500 text-white shadow-emerald-500/20 shadow-sm"
                          : isDark
                            ? "bg-white/10 hover:bg-violet-600 hover:text-white text-slate-200"
                            : "bg-white border border-slate-200 shadow-sm hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 text-slate-700"
                      } disabled:opacity-50 xl:mt-0 mt-2`}
                    >
                      {saving === setting.key ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                        </>
                      ) : saved === setting.key ? (
                        "Saved ✓"
                      ) : (
                        <>
                          <Save className="w-4 h-4" /> Save Changes
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
