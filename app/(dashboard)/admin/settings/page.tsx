"use client";

import { useState } from "react";
import { 
  User, 
  Bell, 
  Shield, 
  Paintbrush, 
  Save, 
  Globe,
  Sun,
  Moon,
  Mail,
  Smartphone,
  Key,
  Database,
  Eye,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useTheme } from "@/components/providers/ThemeProvider";

export default function SettingsPage() {
  const { language, setLanguage, t } = useLanguage();
  const { resolvedTheme, setTheme } = useTheme();
  const isKhmer = language === "km";
  const isDark = resolvedTheme === "dark";

  const [activeTab, setActiveTab] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form states for demonstration
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@psarpulse.com",
    role: "System Administrator",
    language: "English (US)",
    timezone: "(UTC-05:00) Eastern Time (US & Canada)"
  });

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

  const tabs = [
    { id: "profile", label: isKhmer ? "ព័ត៌មានប្រវត្តិរូប" : "Profile Information", icon: User },
    { id: "notifications", label: isKhmer ? "ការជូនដំណឹង" : "Notifications", icon: Bell },
    { id: "security", label: isKhmer ? "សន្តិសុខ និងការចូលប្រើប្រាស់" : "Security & Access", icon: Shield },
    { id: "appearance", label: isKhmer ? "រូបរាង" : "Appearance", icon: Paintbrush },
    { id: "system", label: isKhmer ? "ចំណូលចិត្តប្រព័ន្ធ" : "System Preferences", icon: Database },
  ];

  return (
    <div className={`max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 ${isKhmer ? "font-suwannaphum" : ""}`}>
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

      <div className="flex flex-col md:flex-row gap-8">
        {/* Navigation Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <nav className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-none">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                    isActive 
                      ? (isDark ? "bg-white/10 text-white border border-white/10" : "bg-white text-indigo-700 shadow-sm border border-slate-200/60 ring-1 ring-slate-900/5 shadow-indigo-100/50")
                      : (isDark ? "text-slate-400 hover:text-white hover:bg-white/5" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/50 border border-transparent")
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-indigo-500" : "text-slate-400"}`} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content Area */}
        <div className={`flex-1 rounded-2xl border shadow-sm overflow-hidden ${isDark ? "bg-[#0d1117] border-white/10" : "bg-white border-slate-200"}`}>
          
          {/* Profile Section */}
          {activeTab === "profile" && (
            <div className={`divide-y animate-in fade-in duration-300 ${isDark ? "divide-white/5" : "divide-slate-100"}`}>
              <div className="p-6 sm:p-8">
                <h2 className={`text-lg font-semibold mb-1 ${isDark ? "text-white" : "text-slate-800"}`}>
                  {isKhmer ? "ព័ត៌មានផ្ទាល់ខ្លួន" : "Personal Information"}
                </h2>
                <p className="text-sm text-slate-500 mb-6">
                  {isKhmer ? "ធ្វើបច្ចុប្បន្នភាពព័ត៌មានផ្ទាល់ខ្លួនរបស់អ្នក និងរបៀបដែលយើងអាចទាក់ទងអ្នកបាន។" : "Update your personal details and how we can reach you."}
                </p>

                <div className="flex flex-col sm:flex-row gap-6 mb-8">
                  <div className="shrink-0">
                    <div className="relative group">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-100 to-blue-50 border-4 border-white shadow-md flex items-center justify-center text-indigo-600 text-3xl font-bold overflow-hidden">
                        JD
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
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <h2 className={`text-lg font-semibold mb-1 ${isDark ? "text-white" : "text-slate-800"}`}>
                  {isKhmer ? "ចំណូលចិត្តក្នុងតំបន់" : "Local Preferences"}
                </h2>
                <p className="text-sm text-slate-500 mb-6">
                  {isKhmer ? "ប្ដូរភាសា និងទម្រង់តំបន់របស់អ្នកតាមតម្រូវការ។" : "Customize your language and regional formatting."}
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
                  <div className="space-y-1.5">
                    <label className={`text-sm font-medium flex items-center gap-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                      <Globe className="w-4 h-4 text-slate-400" /> {isKhmer ? "តំបន់ម៉ោង" : "Timezone"}
                    </label>
                    <select 
                      value={personalInfo.timezone}
                      onChange={(e) => setPersonalInfo({...personalInfo, timezone: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg text-sm outline-none transition-all font-medium appearance-none ${
                        isDark ? "bg-white/5 border-white/10 text-white focus:border-indigo-500" : "bg-slate-50 border-slate-200 text-slate-800 focus:bg-white focus:border-indigo-500"
                      }`}
                    >
                      <option>(UTC-05:00) Eastern Time (US & Canada)</option>
                      <option>(UTC+07:00) Indochina Time</option>
                      <option>(UTC+08:00) Singapore Time</option>
                      <option>(UTC+00:00) Coordinated Universal Time</option>
                    </select>
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
                      { id: "light", label: isKhmer ? "ពន្លឺ" : "Light", icon: Sun, color: "#facc15" },
                      { id: "dark", label: isKhmer ? "ងងឹត" : "Dark", icon: Moon, color: "#3ecf8e" }
                    ].map((mode) => {
                      const Icon = mode.icon;
                      const isSelected = resolvedTheme === mode.id;
                      
                      return (
                        <button
                          key={mode.id}
                          onClick={() => setTheme(mode.id as any)}
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
          )}

          {/* Notifications Section */}
          {activeTab === "notifications" && (
            <div className={`p-6 sm:p-8 animate-in fade-in duration-300 ${isDark ? "text-slate-100" : ""}`}>
               <h2 className={`text-lg font-semibold mb-1 ${isDark ? "text-white" : "text-slate-800"}`}>
                 {isKhmer ? "ចំណូលចិត្តការជូនដំណឹង" : "Notification Preferences"}
               </h2>
               <p className="text-sm text-slate-500 mb-6">
                 {isKhmer ? "ជ្រើសរើសរបៀប និងពេលវេលាដែលអ្នកចង់ទទួលបានការជូនដំណឹងអំពីសកម្មភាពវេទិកា។" : "Choose how and when you want to be notified about platform activities."}
               </p>
 
               <div className="space-y-6">
                 {/* Email Notifications */}
                 <div className={`rounded-xl border p-5 ${isDark ? "bg-white/5 border-white/5" : "bg-slate-50/50 border-slate-100"}`}>
                   <div className="flex items-center gap-3 mb-4">
                     <div className={`p-2 rounded-lg shadow-sm border ${isDark ? "bg-white/5 border-white/10 text-slate-300" : "bg-white border-slate-200 text-slate-600"}`}>
                       <Mail className="w-5 h-5" />
                     </div>
                     <div>
                       <h3 className={`font-semibold ${isDark ? "text-white" : "text-slate-800"}`}>
                         {isKhmer ? "ការជូនដំណឹងតាមអ៊ីមែល" : "Email Alerts"}
                       </h3>
                       <p className="text-sm text-slate-500">Sent to {personalInfo.email}</p>
                     </div>
                     <div className="ml-auto">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className={`w-11 h-6 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 ${
                            isDark ? "bg-white/10" : "bg-slate-200"
                          }`}></div>
                        </label>
                     </div>
                   </div>
                   
                   <div className={`space-y-3 pt-4 border-t ml-14 ${isDark ? "border-white/5" : "border-slate-200/60"}`}>
                     <label className="flex items-start gap-3 cursor-pointer group">
                       <input type="checkbox" defaultChecked className="mt-1 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600" />
                       <div>
                         <p className={`text-sm font-medium transition-colors ${isDark ? "text-slate-300 group-hover:text-white" : "text-slate-700 group-hover:text-slate-900"}`}>
                           {isKhmer ? "ការចុះឈ្មោះអាជីវករថ្មី" : "New Vendor Registrations"}
                         </p>
                         <p className="text-xs text-slate-500">{isKhmer ? "ជូនដំណឹងដល់ខ្ញុំនៅពេលមានអាជីវករថ្មីដាក់ពាក្យចូលរួមក្នុងវេទិកា។" : "Notify me when a new merchant applies to join the platform."}</p>
                       </div>
                     </label>
                     <label className="flex items-start gap-3 cursor-pointer group">
                       <input type="checkbox" defaultChecked className="mt-1 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600" />
                       <div>
                         <p className={`text-sm font-medium transition-colors ${isDark ? "text-slate-300 group-hover:text-white" : "text-slate-700 group-hover:text-slate-900"}`}>
                           {isKhmer ? "ការចេញវិក្កយបត្រ និងការជាវ" : "Billing & Subscriptions"}
                         </p>
                         <p className="text-xs text-slate-500">{isKhmer ? "វិក្កយបត្រ ការបរាជ័យក្នុងការទូទាត់ និងការដំឡើងកម្រិត។" : "Invoices, payment failures, and tier upgrades."}</p>
                       </div>
                     </label>
                     <label className="flex items-start gap-3 cursor-pointer group">
                       <input type="checkbox" className="mt-1 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600" />
                       <div>
                         <p className={`text-sm font-medium transition-colors ${isDark ? "text-slate-300 group-hover:text-white" : "text-slate-700 group-hover:text-slate-900"}`}>
                           {isKhmer ? "របាយការណ៍សង្ខេបប្រចាំថ្ងៃ" : "Daily Summary Reports"}
                         </p>
                         <p className="text-xs text-slate-500">{isKhmer ? "សេចក្តីសង្ខេបប្រចាំថ្ងៃនៃមាត្រដ្ឋាន និងសកម្មភាពវេទិកា។" : "A daily digest of platform metrics and activities."}</p>
                       </div>
                     </label>
                   </div>
                 </div>

                 {/* Push Notifications */}
                 <div className={`rounded-xl border p-5 ${isDark ? "bg-white/5 border-white/5" : "bg-slate-50/50 border-slate-100"}`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-2 rounded-lg shadow-sm border ${isDark ? "bg-white/5 border-white/10 text-slate-300" : "bg-white border-slate-200 text-slate-600"}`}>
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className={`font-semibold ${isDark ? "text-white" : "text-slate-800"}`}>
                          {isKhmer ? "ការជូនដំណឹងជំរុញ (Push)" : "Push Notifications"}
                        </h3>
                        <p className="text-sm text-slate-500">{isKhmer ? "ការព្រមានភ្លាមៗត្រូវបានផ្ញើទៅកាន់ឧបករណ៍របស់អ្នក។" : "Instant alerts sent directly to your devices."}</p>
                      </div>
                      <div className="ml-auto">
                         <label className="relative inline-flex items-center cursor-pointer">
                           <input type="checkbox" className="sr-only peer" defaultChecked />
                           <div className={`w-11 h-6 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 ${
                             isDark ? "bg-white/10" : "bg-slate-200"
                           }`}></div>
                         </label>
                      </div>
                    </div>
                    
                    <div className={`space-y-3 pt-4 border-t ml-14 ${isDark ? "border-white/5" : "border-slate-200/60"}`}>
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <input type="checkbox" defaultChecked className="mt-1 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600" />
                        <div>
                          <p className={`text-sm font-medium transition-colors ${isDark ? "text-slate-300 group-hover:text-white" : "text-slate-700 group-hover:text-slate-900"}`}>
                            {isKhmer ? "ការជូនដំណឹងអំពីប្រព័ន្ធសំខាន់ៗ" : "Critical System Alerts"}
                          </p>
                          <p className="text-xs text-slate-500">{isKhmer ? "ការផ្អាកដំណើរការ ការបំពានសុវត្ថិភាព ឬកំហុសធំៗ។" : "Downtimes, security breaches, or major errors."}</p>
                        </div>
                      </label>
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <input type="checkbox" className="mt-1 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600" />
                        <div>
                          <p className={`text-sm font-medium transition-colors ${isDark ? "text-slate-300 group-hover:text-white" : "text-slate-700 group-hover:text-slate-900"}`}>
                            {isKhmer ? "សារផ្ទាល់" : "Direct Messages"}
                          </p>
                          <p className="text-xs text-slate-500">{isKhmer ? "នៅពេលអាជីវករ ឬបុគ្គលិកផ្ញើសារផ្ទាល់មកអ្នក។" : "When vendors or staff send you a direct direct message."}</p>
                        </div>
                      </label>
                    </div>
                  </div>
               </div>
            </div>
          )}

          {/* Security Section */}
          {activeTab === "security" && (
            <div className="p-6 sm:p-8 animate-in fade-in duration-300">
               <h2 className={`text-lg font-semibold mb-1 ${isDark ? "text-white" : "text-slate-800"}`}>
                 {isKhmer ? "សន្តិសុខ និងការចូលប្រើប្រាស់" : "Security & Access"}
               </h2>
               <p className="text-sm text-slate-500 mb-6">
                 {isKhmer ? "គ្រប់គ្រងពាក្យសម្ងាត់របស់អ្នក ការផ្ទៀងផ្ទាត់ពីរជំហាន និងឧបករណ៍ដែលបានភ្ជាប់។" : "Manage your password, two-factor authentication, and connected devices."}
               </p>
 
               <div className="space-y-6">
                 {/* Password */}
                 <div className={`border rounded-xl flex flex-col sm:flex-row sm:items-center justify-between p-5 gap-4 ${
                   isDark ? "bg-white/5 border-white/5" : "bg-white border-slate-200 shadow-sm"
                 }`}>
                   <div className="flex gap-4">
                     <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isDark ? "bg-white/5 text-slate-300" : "bg-slate-100 text-slate-600"}`}>
                       <Key className="w-5 h-5" />
                     </div>
                     <div>
                       <h3 className={`font-semibold ${isDark ? "text-white" : "text-slate-800"}`}>
                         {isKhmer ? "ពាក្យសម្ងាត់គណនី" : "Account Password"}
                       </h3>
                       <p className="text-sm text-slate-500 mt-0.5">
                         {isKhmer ? "បានប្តូរចុងក្រោយកាលពី ៣ ខែមុន។ សូមប្រាកដថាពាក្យសម្ងាត់របស់អ្នករឹងមាំ។" : "Last changed 3 months ago. Make sure your password is strong."}
                       </p>
                     </div>
                   </div>
                   <button className={`whitespace-nowrap px-4 py-2 border shadow-sm text-sm font-medium rounded-lg transition-colors shrink-0 ${
                     isDark ? "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                   }`}>
                     {isKhmer ? "ធ្វើបច្ចុប្បន្នភាពពាក្យសម្ងាត់" : "Update Password"}
                   </button>
                 </div>

                 {/* 2FA */}
                 <div className={`border rounded-xl flex flex-col sm:flex-row sm:items-center justify-between p-5 gap-4 ${
                   isDark ? "bg-emerald-500/10 border-emerald-500/20 shadow-sm shadow-emerald-900/10" : "bg-white border-emerald-200 shadow-sm shadow-emerald-100/50"
                 }`}>
                   <div className="flex gap-4">
                     <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isDark ? "bg-emerald-500/20 text-emerald-400" : "bg-emerald-100 text-emerald-600"}`}>
                       <Shield className="w-5 h-5" />
                     </div>
                     <div>
                       <div className="flex items-center gap-2">
                         <h3 className={`font-semibold ${isDark ? "text-white" : "text-slate-800"}`}>
                           {isKhmer ? "ការផ្ទៀងផ្ទាត់ពីរជំហាន" : "Two-Factor Authentication"}
                         </h3>
                         <span className="bg-emerald-500/20 text-emerald-500 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full">
                           {isKhmer ? "បានបើក" : "Enabled"}
                         </span>
                       </div>
                       <p className="text-sm text-slate-500 mt-0.5">
                         {isKhmer ? "គណនីរបស់អ្នកត្រូវបានការពារដោយកម្មវិធីផ្ទៀងផ្ទាត់ TOTP។" : "Your account is secured with a TOTP authenticator app."}
                       </p>
                     </div>
                   </div>
                   <button className={`whitespace-nowrap px-4 py-2 border shadow-sm text-sm font-medium rounded-lg transition-colors shrink-0 ${
                     isDark ? "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                   }`}>
                     {isKhmer ? "គ្រប់គ្រង 2FA" : "Manage 2FA"}
                   </button>
                 </div>

                 {/* Active Sessions */}
                 <div className="pt-4 mt-6">
                   <h3 className={`font-semibold mb-4 ${isDark ? "text-white" : "text-slate-800"}`}>
                     {isKhmer ? "វគ្គកម្មវិធីដែលសកម្ម" : "Active Sessions"}
                   </h3>
                   <div className={`rounded-xl border divide-y ${isDark ? "border-white/10 bg-white/[0.02] divide-white/5" : "border-slate-200 bg-white divide-slate-100"}`}>
                     {/* Session 1 */}
                     <div className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4 ${isDark ? "bg-white/5" : "bg-slate-50"}`}>
                       <div className="flex gap-4">
                         <div className={`w-10 h-10 rounded-full border shadow-sm flex items-center justify-center shrink-0 ${isDark ? "bg-white/5 border-white/10" : "bg-white border-slate-200"}`}>
                           <Globe className="w-5 h-5 text-indigo-500" />
                         </div>
                         <div>
                           <div className="flex items-center gap-2">
                             <p className={`font-medium text-sm ${isDark ? "text-white" : "text-slate-800"}`}>Chrome on Windows</p>
                             <span className="text-xs font-medium text-emerald-500 flex items-center gap-1">
                               <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> {isKhmer ? "វគ្គបច្ចុប្បន្ន" : "Current Session"}
                             </span>
                           </div>
                           <p className="text-xs text-slate-500 mt-0.5">Phnom Penh, KH • IP: 104.28.192.122</p>
                         </div>
                       </div>
                     </div>
                     {/* Session 2 */}
                     <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4">
                       <div className="flex gap-4">
                         <div className={`w-10 h-10 rounded-full border shadow-sm flex items-center justify-center shrink-0 ${isDark ? "bg-white/5 border-white/10" : "bg-white border-slate-200"}`}>
                           <Smartphone className="w-5 h-5 text-slate-500" />
                         </div>
                         <div>
                           <p className={`font-medium text-sm ${isDark ? "text-white" : "text-slate-800"}`}>Safari on iPhone</p>
                           <p className="text-xs text-slate-500 mt-0.5">{isKhmer ? "ម្សិលមិញ ម៉ោង ១០:២៤ ព្រឹក" : "Yesterday at 10:24 AM"}</p>
                         </div>
                       </div>
                       <button className="text-sm font-medium text-red-500 hover:text-red-400 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-lg transition-colors self-start sm:self-auto">
                         {isKhmer ? "ដកហូត" : "Revoke"}
                       </button>
                     </div>
                   </div>
                 </div>
               </div>
            </div>
          )}

          {activeTab === "appearance" && (
            <div className={`p-8 sm:p-10 animate-in fade-in duration-300 ${isDark ? "text-slate-100" : ""}`}>
              <div className="flex flex-col mb-8">
                <h2 className={`text-xl font-bold tracking-tight ${isDark ? "text-white" : "text-slate-800"}`}>
                  {isKhmer ? "ការកំណត់កម្រិតខ្ពស់" : "Advanced Styling"}
                </h2>
                <p className={`text-sm mt-1 ${isDark ? "text-[#7d8590]" : "text-slate-500"}`}>
                  Additional customization options for the administrative interface will be available soon.
                </p>
              </div>
              
              <div className={`p-6 rounded-2xl border border-dashed text-center ${isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-slate-50"}`}>
                <p className="text-sm text-slate-400 font-medium">More appearance settings coming in v1.3</p>
              </div>
            </div>
          )}

          {activeTab === "system" && (
            <div className={`p-12 text-center animate-in fade-in duration-300 flex items-center justify-center flex-col min-h-[400px] ${isDark ? "text-slate-300" : "text-slate-500"}`}>
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isDark ? "bg-white/5 text-slate-400" : "bg-slate-100 text-slate-400"}`}>
                <Database className="w-8 h-8" />
              </div>
              <h2 className={`text-lg font-semibold mb-1 capitalize ${isDark ? "text-white" : "text-slate-800"}`}>{activeTab} Settings</h2>
              <p className="text-sm max-w-sm mx-auto">This section is currently under development. These settings will allow you to customize your {activeTab} preferences globally.</p>
              
              <div className="mt-8 flex items-center gap-2 text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg text-sm font-medium">
                <AlertCircle className="w-4 h-4" /> Coming soon in v1.2
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
