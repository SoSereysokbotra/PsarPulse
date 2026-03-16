"use client";

import { useState } from "react";
import { 
  User, 
  Bell, 
  Shield, 
  Paintbrush, 
  Save, 
  Globe,
  Mail,
  Smartphone,
  Key,
  Database,
  Eye,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export default function SettingsPage() {
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
    { id: "profile", label: "Profile Information", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security & Access", icon: Shield },
    { id: "appearance", label: "Appearance", icon: Paintbrush },
    { id: "system", label: "System Preferences", icon: Database },
  ];

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Platform Settings</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your account settings and administrative preferences.</p>
        </div>
        
        <div className="flex items-center gap-3">
          {saveSuccess && (
            <div className="flex items-center gap-2 text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg animate-in fade-in zoom-in slide-in-from-right-4 duration-300">
              <CheckCircle2 className="w-4 h-4" />
              Changes saved
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
            {isSaving ? "Saving..." : "Save Changes"}
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
                      ? "bg-white text-indigo-700 shadow-sm border border-slate-200/60 ring-1 ring-slate-900/5 shadow-indigo-100/50" 
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/50 border border-transparent"
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
        <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          
          {/* Profile Section */}
          {activeTab === "profile" && (
            <div className="divide-y divide-slate-100 animate-in fade-in duration-300">
              <div className="p-6 sm:p-8">
                <h2 className="text-lg font-semibold text-slate-800 mb-1">Personal Information</h2>
                <p className="text-sm text-slate-500 mb-6">Update your personal details and how we can reach you.</p>

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
                      <label className="text-sm font-medium text-slate-700 block">First Name</label>
                      <input 
                        type="text" 
                        value={personalInfo.firstName}
                        onChange={(e) => setPersonalInfo({...personalInfo, firstName: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 outline-none focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700 block">Last Name</label>
                      <input 
                        type="text" 
                        value={personalInfo.lastName}
                        onChange={(e) => setPersonalInfo({...personalInfo, lastName: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 outline-none focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium" 
                      />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-sm font-medium text-slate-700 block">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          type="email" 
                          value={personalInfo.email}
                          onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
                          className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 outline-none focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium" 
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5 sm:col-span-2 mb-2">
                      <label className="text-sm font-medium text-slate-700 block">Your Role</label>
                      <input 
                        type="text" 
                        disabled
                        value={personalInfo.role}
                        className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-500 cursor-not-allowed font-medium" 
                      />
                      <p className="text-xs text-slate-500 mt-1">Contact your organization administrator to change your role.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <h2 className="text-lg font-semibold text-slate-800 mb-1">Local Preferences</h2>
                <p className="text-sm text-slate-500 mb-6">Customize your language and regional formatting.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <Globe className="w-4 h-4 text-slate-400" /> Language
                    </label>
                    <select 
                      value={personalInfo.language}
                      onChange={(e) => setPersonalInfo({...personalInfo, language: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 outline-none focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium appearance-none"
                    >
                      <option>English (US)</option>
                      <option>Khmer</option>
                      <option>French (FR)</option>
                      <option>Chinese (Simplified)</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <Globe className="w-4 h-4 text-slate-400" /> Timezone
                    </label>
                    <select 
                      value={personalInfo.timezone}
                      onChange={(e) => setPersonalInfo({...personalInfo, timezone: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 outline-none focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium appearance-none"
                    >
                      <option>(UTC-05:00) Eastern Time (US & Canada)</option>
                      <option>(UTC+07:00) Indochina Time</option>
                      <option>(UTC+08:00) Singapore Time</option>
                      <option>(UTC+00:00) Coordinated Universal Time</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Section */}
          {activeTab === "notifications" && (
            <div className="p-6 sm:p-8 animate-in fade-in duration-300">
               <h2 className="text-lg font-semibold text-slate-800 mb-1">Notification Preferences</h2>
               <p className="text-sm text-slate-500 mb-6">Choose how and when you want to be notified about platform activities.</p>

               <div className="space-y-6">
                 {/* Email Notifications */}
                 <div className="bg-slate-50/50 rounded-xl border border-slate-100 p-5">
                   <div className="flex items-center gap-3 mb-4">
                     <div className="bg-white p-2 rounded-lg shadow-sm border border-slate-200 text-slate-600">
                       <Mail className="w-5 h-5" />
                     </div>
                     <div>
                       <h3 className="font-semibold text-slate-800">Email Alerts</h3>
                       <p className="text-sm text-slate-500">Sent to {personalInfo.email}</p>
                     </div>
                     <div className="ml-auto">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                     </div>
                   </div>
                   
                   <div className="space-y-3 pt-4 border-t border-slate-200/60 ml-14">
                     <label className="flex items-start gap-3 cursor-pointer group">
                       <input type="checkbox" defaultChecked className="mt-1 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600" />
                       <div>
                         <p className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">New Vendor Registrations</p>
                         <p className="text-xs text-slate-500">Notify me when a new merchant applies to join the platform.</p>
                       </div>
                     </label>
                     <label className="flex items-start gap-3 cursor-pointer group">
                       <input type="checkbox" defaultChecked className="mt-1 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600" />
                       <div>
                         <p className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">Billing & Subscriptions</p>
                         <p className="text-xs text-slate-500">Invoices, payment failures, and tier upgrades.</p>
                       </div>
                     </label>
                     <label className="flex items-start gap-3 cursor-pointer group">
                       <input type="checkbox" className="mt-1 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600" />
                       <div>
                         <p className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">Daily Summary Reports</p>
                         <p className="text-xs text-slate-500">A daily digest of platform metrics and activities.</p>
                       </div>
                     </label>
                   </div>
                 </div>

                 {/* Push Notifications */}
                 <div className="bg-slate-50/50 rounded-xl border border-slate-100 p-5">
                   <div className="flex items-center gap-3 mb-4">
                     <div className="bg-white p-2 rounded-lg shadow-sm border border-slate-200 text-slate-600">
                       <Smartphone className="w-5 h-5" />
                     </div>
                     <div>
                       <h3 className="font-semibold text-slate-800">Push Notifications</h3>
                       <p className="text-sm text-slate-500">Instant alerts sent directly to your devices.</p>
                     </div>
                     <div className="ml-auto">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                     </div>
                   </div>
                   
                   <div className="space-y-3 pt-4 border-t border-slate-200/60 ml-14">
                     <label className="flex items-start gap-3 cursor-pointer group">
                       <input type="checkbox" defaultChecked className="mt-1 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600" />
                       <div>
                         <p className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">Critical System Alerts</p>
                         <p className="text-xs text-slate-500">Downtimes, security breaches, or major errors.</p>
                       </div>
                     </label>
                     <label className="flex items-start gap-3 cursor-pointer group">
                       <input type="checkbox" className="mt-1 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600" />
                       <div>
                         <p className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">Direct Messages</p>
                         <p className="text-xs text-slate-500">When vendors or staff send you a direct direct message.</p>
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
               <h2 className="text-lg font-semibold text-slate-800 mb-1">Security & Access</h2>
               <p className="text-sm text-slate-500 mb-6">Manage your password, two-factor authentication, and connected devices.</p>

               <div className="space-y-6">
                 {/* Password */}
                 <div className="bg-white border text-left border-slate-200 rounded-xl overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between p-5 gap-4">
                   <div className="flex gap-4">
                     <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                       <Key className="w-5 h-5 text-slate-600" />
                     </div>
                     <div>
                       <h3 className="font-semibold text-slate-800">Account Password</h3>
                       <p className="text-sm text-slate-500 mt-0.5">Last changed 3 months ago. Make sure your password is strong.</p>
                     </div>
                   </div>
                   <button className="whitespace-nowrap px-4 py-2 bg-white border border-slate-200 shadow-sm hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg transition-colors shrink-0">
                     Update Password
                   </button>
                 </div>

                 {/* 2FA */}
                 <div className="bg-white border text-left border-emerald-200 rounded-xl overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between p-5 gap-4 shadow-sm shadow-emerald-100/50">
                   <div className="flex gap-4">
                     <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                       <Shield className="w-5 h-5 text-emerald-600" />
                     </div>
                     <div>
                       <div className="flex items-center gap-2">
                         <h3 className="font-semibold text-slate-800">Two-Factor Authentication</h3>
                         <span className="bg-emerald-100 text-emerald-700 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full">Enabled</span>
                       </div>
                       <p className="text-sm text-slate-500 mt-0.5">Your account is secured with a TOTP authenticator app.</p>
                     </div>
                   </div>
                   <button className="whitespace-nowrap px-4 py-2 bg-white border border-slate-200 shadow-sm hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg transition-colors shrink-0">
                     Manage 2FA
                   </button>
                 </div>

                 {/* Active Sessions */}
                 <div className="pt-4 mt-6">
                   <h3 className="font-semibold text-slate-800 mb-4">Active Sessions</h3>
                   <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden">
                     {/* Session 1 */}
                     <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4 bg-slate-50">
                       <div className="flex gap-4">
                         <div className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center shrink-0">
                           <Globe className="w-5 h-5 text-indigo-600" />
                         </div>
                         <div>
                           <div className="flex items-center gap-2">
                             <p className="font-medium text-slate-800 text-sm">Chrome on Windows</p>
                             <span className="text-xs font-medium text-emerald-600 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Current Session</span>
                           </div>
                           <p className="text-xs text-slate-500 mt-0.5">Phnom Penh, KH • IP: 104.28.192.122</p>
                         </div>
                       </div>
                     </div>
                     {/* Session 2 */}
                     <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4">
                       <div className="flex gap-4">
                         <div className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center shrink-0">
                           <Smartphone className="w-5 h-5 text-slate-500" />
                         </div>
                         <div>
                           <p className="font-medium text-slate-800 text-sm">Safari on iPhone</p>
                           <p className="text-xs text-slate-500 mt-0.5">Phnom Penh, KH • Yesterday at 10:24 AM</p>
                         </div>
                       </div>
                       <button className="text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors self-start sm:self-auto">
                         Revoke
                       </button>
                     </div>
                   </div>
                 </div>
               </div>
            </div>
          )}

          {/* Placeholders for other tabs */}
          {["appearance", "system"].includes(activeTab) && (
            <div className="p-12 text-center animate-in fade-in duration-300 flex items-center justify-center flex-col min-h-[400px]">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
                {activeTab === "appearance" ? <Paintbrush className="w-8 h-8" /> : <Database className="w-8 h-8" />}
              </div>
              <h2 className="text-lg font-semibold text-slate-800 mb-1 capitalize">{activeTab} Settings</h2>
              <p className="text-sm text-slate-500 max-w-sm mx-auto">This section is currently under development. These settings will allow you to customize your {activeTab} preferences globally.</p>
              
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
