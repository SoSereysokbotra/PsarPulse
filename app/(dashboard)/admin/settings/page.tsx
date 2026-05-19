"use client";

import { useState, useEffect } from "react";
import { 
  Paintbrush, 
  Save, 
  Globe,
  Sun,
  Moon,
  Mail,
  CheckCircle2
} from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useTheme } from "@/components/providers/ThemeProvider";

export default function SettingsPage() {
  const { language, setLanguage, t } = useLanguage();
  const { resolvedTheme, setTheme } = useTheme();
  const isKhmer = language === "km";
  const isDark = resolvedTheme === "dark";

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Form states for demonstration
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "Administrator",
    language: "English (US)",
    timezone: "(UTC+07:00) Indochina Time"
  });

  useEffect(() => {
    async function fetchMe() {
      try {
        const res = await fetch("/api/admin/me");
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data?.personalInfo) {
            setPersonalInfo(prev => ({
              ...prev,
              ...json.data.personalInfo
            }));
          }
        }
      } catch (err) {
        console.error("Failed to fetch personal info", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMe();
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    setSaveSuccess(false);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 800);
  };

  return (
    <div className={`max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 ${isKhmer ? "font-battambang" : ""}`}>
      {/* Page Header */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className={`text-2xl font-bold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
            {isKhmer ? "ការកំណត់ប្រព័ន្ធ" : "Platform Settings"}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {isKhmer ? "គ្រប់គ្រងការកំណត់គណនី និងចំណូលចិត្តរដ្ឋបាលរបស់អ្នក។" : "Manage your account settings and administrative preferences."}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {saveSuccess && (
            <div className={`flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-lg animate-in fade-in zoom-in slide-in-from-right-4 duration-300 ${
              isDark ? "text-emerald-400 bg-emerald-500/10" : "text-emerald-600 bg-emerald-50"
            }`}>
              <CheckCircle2 className="w-4 h-4" />
              {isKhmer ? "បានរក្សាទុកការផ្លាស់ប្តូរ" : "Changes saved"}
            </div>
          )}
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg shadow-sm shadow-indigo-600/20 transition-all border border-transparent"
          >
            {isSaving ? (
              <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isSaving ? (isKhmer ? "កំពុងរក្សាទុក..." : "Saving...") : (isKhmer ? "រក្សាទុកការផ្លាស់ប្តូរ" : "Save Changes")}
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className={`rounded-2xl border shadow-sm overflow-hidden ${isDark ? "bg-[#0d1117] border-white/10" : "bg-white border-slate-200"}`}>
        <div className={`divide-y ${isDark ? "divide-white/5" : "divide-slate-100"}`}>
          {/* Profile Section */}
          <div className="p-6 sm:p-8">
            <h2 className={`text-lg font-semibold mb-1 ${isDark ? "text-white" : "text-slate-800"}`}>
              {isKhmer ? "ព័ត៌មានផ្ទាល់ខ្លួន" : "Personal Information"}
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              {isKhmer ? "ធ្វើបច្ចុប្បន្នភាពព័ត៌មានផ្ទាល់ខ្លួនរបស់អ្នក និងរបៀបដែលយើងអាចទាក់ទងអ្នកបាន។" : "Update your personal details and how we can reach you."}
            </p>

            <div className="flex flex-col sm:flex-row gap-6">
              {isLoading ? (
                <div className="w-full flex justify-center py-8">
                  <div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-indigo-600 animate-spin" />
                </div>
              ) : (
                <>
                  <div className="shrink-0">
                    <div className="relative group">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-100 to-blue-50 border-4 border-white shadow-md flex items-center justify-center text-indigo-600 text-3xl font-bold overflow-hidden uppercase">
                        {personalInfo.firstName[0] || ""}{personalInfo.lastName[0] || ""}
                      </div>
                      <button className="absolute inset-0 bg-slate-900/40 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <Paintbrush className="w-5 h-5 mb-1" />
                        <span className="text-[10px] font-medium uppercase tracking-wider">Change</span>
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className={`text-sm font-medium block ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                        {isKhmer ? "នាមខ្លួន" : "First Name"}
                      </label>
                      <input 
                        type="text" 
                        value={personalInfo.firstName}
                        onChange={(e) => setPersonalInfo({...personalInfo, firstName: e.target.value})}
                        className={`w-full px-3 py-2 rounded-lg text-sm outline-none transition-all font-medium ${
                          isDark ? "bg-white/5 border-white/10 text-white focus:border-indigo-500" : "bg-slate-50 border-slate-200 text-slate-800 focus:bg-white focus:border-indigo-500"
                        }`} 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={`text-sm font-medium block ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                        {isKhmer ? "នាមត្រកូល" : "Last Name"}
                      </label>
                      <input 
                        type="text" 
                        value={personalInfo.lastName}
                        onChange={(e) => setPersonalInfo({...personalInfo, lastName: e.target.value})}
                        className={`w-full px-3 py-2 rounded-lg text-sm outline-none transition-all font-medium ${
                          isDark ? "bg-white/5 border-white/10 text-white focus:border-indigo-500" : "bg-slate-50 border-slate-200 text-slate-800 focus:bg-white focus:border-indigo-500"
                        }`} 
                      />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className={`text-sm font-medium block ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                        {isKhmer ? "អាសយដ្ឋានអ៊ីមែល" : "Email Address"}
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          type="email" 
                          value={personalInfo.email}
                          onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
                          className={`w-full pl-9 pr-3 py-2 rounded-lg text-sm outline-none transition-all font-medium ${
                            isDark ? "bg-white/5 border-white/10 text-white focus:border-indigo-500" : "bg-slate-50 border-slate-200 text-slate-800 focus:bg-white focus:border-indigo-500"
                          }`} 
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5 sm:col-span-2 mb-2">
                      <label className={`text-sm font-medium block ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                        {isKhmer ? "តួនាទីរបស់អ្នក" : "Your Role"}
                      </label>
                      <input 
                        type="text" 
                        disabled
                        value={personalInfo.role}
                        className={`w-full px-3 py-2 border rounded-lg text-sm cursor-not-allowed font-medium ${isDark ? "bg-white/5 border-white/10 text-slate-500" : "bg-slate-100 border-slate-200 text-slate-500"}`} 
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        {isKhmer ? "ទាក់ទងអ្នកគ្រប់គ្រងស្ថាប័នរបស់អ្នកដើម្បីប្តូរតួនាទីរបស់អ្នក។" : "Contact your organization administrator to change your role."}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Local Preferences */}
          <div className="p-6 sm:p-8">
            <h2 className={`text-lg font-semibold mb-1 ${isDark ? "text-white" : "text-slate-800"}`}>
              {isKhmer ? "ចំណូលចិត្តក្នុងតំបន់" : "Local Preferences"}
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              {isKhmer ? "ប្ដូរភាសារបស់អ្នកតាមតម្រូវការ។" : "Customize your language preference."}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className={`text-sm font-medium flex items-center gap-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  <Globe className="w-4 h-4 text-slate-400" /> {isKhmer ? "ភាសា" : "Language"}
                </label>
                <select 
                  value={language === "km" ? "Khmer" : "English (US)"}
                  onChange={(e) => setLanguage(e.target.value === "Khmer" ? "km" : "en")}
                  className={`w-full px-3 py-2 border rounded-lg text-sm outline-none transition-all font-medium appearance-none ${
                    isDark ? "bg-white/5 border-white/10 text-white focus:border-indigo-500" : "bg-slate-50 border-slate-200 text-slate-800 focus:bg-white focus:border-indigo-500"
                  }`}
                >
                  <option>English (US)</option>
                  <option>Khmer</option>
                </select>
              </div>
            </div>

            <div className={`mt-10 pt-8 border-t ${isDark ? "border-white/5" : "border-slate-100"}`}>
              <div className="flex flex-col mb-6">
                <h2 className={`text-lg font-semibold mb-1 ${isDark ? "text-white" : "text-slate-800"}`}>
                  {t("settings.interfaceTheme") || (isKhmer ? "រូបរាង" : "Appearance")}
                </h2>
                <p className="text-sm text-slate-500">
                  {t("settings.interfaceThemeDesc") || (isKhmer ? "ជ្រើសរើសរបៀបដែល PsarPulse បង្ហាញសម្រាប់អ្នក។" : "Choose how PsarPulse looks for you.")}
                </p>
              </div>

              <div className="flex flex-row gap-3">
                {[
                  { id: "light" as const, label: isKhmer ? "ពន្លឺ" : "Light", icon: Sun, color: "#facc15" },
                  { id: "dark" as const, label: isKhmer ? "ងងឹត" : "Dark", icon: Moon, color: "#3ecf8e" }
                ].map((mode) => {
                  const Icon = mode.icon;
                  const isSelected = resolvedTheme === mode.id;
                  
                  return (
                    <button
                      key={mode.id}
                      onClick={() => setTheme(mode.id)}
                      className={`group relative flex items-center gap-3 px-6 py-3 rounded-2xl border-2 transition-all duration-300 ${
                        isSelected 
                          ? (isDark ? "bg-[#3ecf8e]/10 border-[#3ecf8e] shadow-[0_0_15px_rgba(62,207,142,0.1)]" : "bg-white border-indigo-600 shadow-lg shadow-indigo-600/5")
                          : (isDark ? "bg-[#0d1117] border-white/5 hover:border-white/10" : "bg-slate-50 border-slate-100 hover:border-slate-200")
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-transform duration-300 ${
                        isSelected ? "bg-white shadow-sm" : (isDark ? "bg-white/5" : "bg-white border border-slate-100")
                      }`}>
                        <Icon size={18} style={{ color: isSelected ? mode.color : "#94a3b8" }} />
                      </div>
                      <span className={`text-sm font-bold ${isSelected ? (isDark ? "text-[#3ecf8e]" : "text-indigo-600") : (isDark ? "text-[#7d8590]" : "text-slate-500")}`}>
                        {mode.label}
                      </span>
                      {isSelected && (
                        <div className={`ml-1 w-1.5 h-1.5 rounded-full ${isDark ? "bg-[#3ecf8e]" : "bg-indigo-600"}`} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
