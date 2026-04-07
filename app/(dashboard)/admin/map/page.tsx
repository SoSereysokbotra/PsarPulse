"use client";

import { useState, useEffect } from "react";
import { Map, Overlay, ZoomControl } from "pigeon-maps";
import {
  Map as MapIcon,
  Filter,
  Eye,
  EyeOff,
  Search,
  Clock,
  ShieldAlert,
  Navigation,
  Layers,
  ChevronRight,
  TrendingUp,
  X,
  CreditCard,
  Building,
  User,
  Store,
  Phone,
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function VendorMapPage() {
  const { language } = useLanguage();
  const isKhmer = language === "km";
  const [pins, setPins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/vendors")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          const mapped = d.data.map((v: any, index: number) => {
            return {
              id: v.id,
              name: v.name,
              owner: v.owner,
              status: v.status,
              tier: v.tier,
              lat: parseFloat(v.latitude) || 11.5564,
              lng: parseFloat(v.longitude) || 104.9282,
              publicVisible: v.status === "Active",
              visitors: Math.floor(Math.random() * 500),
            };
          });
          setPins(mapped);
        }
        setLoading(false);
      });
  }, []);
  const [selectedPin, setSelectedPin] = useState<any>(null);
  const [mapMode, setMapMode] = useState<"internal" | "public">("internal");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState({
    active: true,
    pending: true,
    suspended: true,
  });

  // Map state
  const [center, setCenter] = useState<[number, number]>([11.5564, 104.9282]);
  const [zoom, setZoom] = useState(13);

  // Filtered Pins
  const filteredPins = pins.filter((pin) => {
    if (mapMode === "public" && !pin.publicVisible) return false;
    if (mapMode === "internal") {
      if (!activeFilters.active && pin.status === "Active") return false;
      if (!activeFilters.pending && pin.status === "Pending") return false;
      if (!activeFilters.suspended && pin.status === "Suspended") return false;
    }
    if (
      searchQuery &&
      !pin.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  const togglePublicVisibility = async (pinId: string) => {
    const pin = pins.find((p) => p.id === pinId);
    if (!pin) return;

    const newPublic = !pin.publicVisible;

    // Optimistic update
    setPins((current) =>
      current.map((p) =>
        p.id === pinId ? { ...p, publicVisible: newPublic } : p,
      ),
    );
    if (selectedPin?.id === pinId) {
      setSelectedPin({ ...selectedPin, publicVisible: newPublic });
    }

    try {
      const res = await fetch(`/api/admin/vendors/${pinId}/public`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublic: newPublic }),
      });

      if (!res.ok) throw new Error("Failed to update visibility");
    } catch (error) {
      // Revert on error
      setPins((current) =>
        current.map((p) =>
          p.id === pinId ? { ...p, publicVisible: !newPublic } : p,
        ),
      );
      if (selectedPin?.id === pinId) {
        setSelectedPin({ ...selectedPin, publicVisible: !newPublic });
      }
      alert(
        isKhmer
          ? "កំហុសក្នុងការកែប្រែភាពមើលឃើញ។ សូមព្យាយាមម្តងទៀត។"
          : "Error updating visibility. Please try again.",
      );
    }
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col pt-2 pb-6 px-4 sm:px-8 bg-slate-50/50 dark:bg-slate-950 transition-colors duration-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2 transition-colors">
            <MapIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            {isKhmer ? "ផែនទីអាជីវករ" : "Vendor Mapping"}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 transition-colors">
            {isKhmer
              ? "គ្រប់គ្រងទីតាំងអាជីវករ តំបន់ និងភាពមើលឃើញសាធារណៈ។"
              : "Manage vendor geolocations, zones & public visibility."}
          </p>
        </div>

        {/* Toggle Mode */}
        <div className="flex items-center bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative z-20 transition-colors">
          <button
            onClick={() => {
              setMapMode("internal");
              setSelectedPin(null);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              mapMode === "internal"
                ? "bg-slate-900 dark:bg-slate-100 shadow text-white dark:text-slate-900"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            <ShieldAlert
              className={`h-4 w-4 ${
                mapMode === "internal"
                  ? "text-indigo-400 dark:text-indigo-600"
                  : ""
              }`}
            />
            {isKhmer ? "ប្រតិបត្តិការផ្ទៃក្នុង" : "Internal Ops"}
          </button>
          <button
            onClick={() => {
              setMapMode("public");
              setSelectedPin(null);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              mapMode === "public"
                ? "bg-indigo-600 dark:bg-indigo-500 shadow text-white"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            <Navigation
              className={`h-4 w-4 ${
                mapMode === "public"
                  ? "text-indigo-200 dark:text-indigo-100"
                  : ""
              }`}
            />
            {isKhmer ? "ផែនទីសាធារណៈ" : "Public Map"}
          </button>
        </div>
      </div>

      <div className="flex-1 relative rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-lg shadow-slate-200/40 dark:shadow-none overflow-hidden flex bg-slate-100/50 dark:bg-slate-900/50 transition-colors">
        {/* Map Sidebar Filters */}
        <div className="absolute left-4 top-4 bottom-4 w-80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/20 dark:border-slate-800 shadow-[-10px_0_30px_rgba(0,0,0,0.05)] dark:shadow-[-10px_0_30px_rgba(0,0,0,0.5)] rounded-xl flex flex-col shrink-0 z-20 overflow-hidden ring-1 ring-slate-900/5 dark:ring-white/5 transition-colors">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 transition-colors">
            <h2 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2">
              <Filter className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
              {isKhmer ? "ការគ្រប់គ្រងផែនទី" : "Map Controls"}
            </h2>
          </div>

          <div className="p-5 space-y-6 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
            <div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
                <input
                  type="text"
                  placeholder={isKhmer ? "ស្វែងរកចំណុច..." : "Search pins..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all font-medium text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>
            </div>

            {mapMode === "internal" ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                    <Layers className="h-3 w-3" />{" "}
                    {isKhmer ? "ស្រទាប់ស្ថានភាព" : "Status Layer"}
                  </label>
                  <div className="space-y-2.5">
                    <label className="flex items-center justify-between group cursor-pointer p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent hover:border-slate-100 dark:hover:border-slate-700 transition-colors">
                      <div className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                        {isKhmer
                          ? "បានផ្ទៀងផ្ទាត់ (សកម្ម)"
                          : "Verified (Active)"}
                      </div>
                      <input
                        type="checkbox"
                        checked={activeFilters.active}
                        onChange={(e) =>
                          setActiveFilters({
                            ...activeFilters,
                            active: e.target.checked,
                          })
                        }
                        className="rounded border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-indigo-600 focus:ring-indigo-600 dark:focus:ring-indigo-500"
                      />
                    </label>
                    <label className="flex items-center justify-between group cursor-pointer p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent hover:border-slate-100 dark:hover:border-slate-700 transition-colors">
                      <div className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></span>
                        {isKhmer ? "កំពុងរង់ចាំផ្ទៀងផ្ទាត់" : "Pending Verif."}
                      </div>
                      <input
                        type="checkbox"
                        checked={activeFilters.pending}
                        onChange={(e) =>
                          setActiveFilters({
                            ...activeFilters,
                            pending: e.target.checked,
                          })
                        }
                        className="rounded border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-indigo-600 focus:ring-indigo-600 dark:focus:ring-indigo-500"
                      />
                    </label>
                    <label className="flex items-center justify-between group cursor-pointer p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent hover:border-slate-100 dark:hover:border-slate-700 transition-colors">
                      <div className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></span>
                        {isKhmer ? "ផ្អាក/បិទ" : "Suspended/Off"}
                      </div>
                      <input
                        type="checkbox"
                        checked={activeFilters.suspended}
                        onChange={(e) =>
                          setActiveFilters({
                            ...activeFilters,
                            suspended: e.target.checked,
                          })
                        }
                        className="rounded border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-indigo-600 focus:ring-indigo-600 dark:focus:ring-indigo-500"
                      />
                    </label>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                    <Navigation className="h-3 w-3" />{" "}
                    {isKhmer ? "ការរៀបចំសាធារណៈ" : "Public Curation"}
                  </label>
                  <div className="p-4 bg-gradient-to-br from-indigo-50 to-blue-50/50 dark:from-indigo-900/30 dark:to-blue-900/20 border border-indigo-100/60 dark:border-indigo-500/20 rounded-xl shadow-sm">
                    <p className="text-sm font-medium text-indigo-900 dark:text-indigo-200 mb-3 leading-relaxed">
                      {isKhmer
                        ? "អ្នកកំពុងមើលជាមុននូវអ្វីដែលអ្នកប្រើឃើញក្នុងកម្មវិធីអតិថិជន PsarPulse។"
                        : "You are previewing exactly what users see within the custom PsarPulse consumer app."}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 mt-auto transition-colors">
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-white dark:bg-slate-800 py-3 rounded-lg border border-slate-100 dark:border-slate-700 shadow-sm transition-colors">
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  {isKhmer ? "ចំនួនដែលបានដាក់ផែនទី" : "Total Mapped"}
                </p>
                <p className="text-xl font-black text-slate-800 dark:text-white tracking-tight">
                  {filteredPins.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Real Free Map Area (Pigeon Maps + OpenStreetMap) */}
        <div className="flex-1 relative w-full h-full bg-[#e5e7eb] dark:bg-slate-800 transition-colors overflow-hidden">
          <Map
            center={center}
            zoom={zoom}
            onBoundsChanged={({ center, zoom }) => {
              setCenter(center);
              setZoom(zoom);
            }}
            onClick={() => setSelectedPin(null)}
          >
            <ZoomControl />

            {/* Render Custom Map Markers as Overlays */}
            {filteredPins.map((pin) => {
              const isSelected = selectedPin?.id === pin.id;
              return (
                <Overlay
                  key={pin.id}
                  anchor={[pin.lat, pin.lng]}
                  offset={[20, 48]} // Offsets the HTML so the tail points exactly at the GPS coordinate
                >
                  <div
                    className="group cursor-pointer relative flex flex-col items-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPin(pin);
                    }}
                  >
                    {/* Pin Head */}
                    <div
                      className={`
                      relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-white 
                      shadow-[0_4px_14px_0_rgba(0,0,0,0.15)] transition-all duration-300
                      ${pin.status === "Active" ? "bg-gradient-to-tr from-emerald-600 to-emerald-400" : ""}
                      ${pin.status === "Pending" ? "bg-gradient-to-tr from-amber-500 to-amber-300" : ""}
                      ${pin.status === "Suspended" ? "bg-gradient-to-tr from-red-600 to-red-400" : ""}
                      ${isSelected ? "ring-4 ring-white dark:ring-slate-800 shadow-[0_8px_24px_0_rgba(0,0,0,0.25)] scale-110 !z-30" : "hover:scale-110"}
                    `}
                    >
                      {pin.status === "Active" && <Store className="h-4 w-4" />}
                      {pin.status === "Pending" && (
                        <Clock className="h-4 w-4" />
                      )}
                      {pin.status === "Suspended" && (
                        <ShieldAlert className="h-4 w-4" />
                      )}

                      {/* Public App Indicator */}
                      {mapMode === "internal" && pin.publicVisible && (
                        <div className="absolute -top-1 -right-1 bg-indigo-500 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center"></div>
                      )}
                    </div>
                    {/* Pin Tail */}
                    <div
                      className={`
                      w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[10px]
                      transition-all duration-300 -mt-1 relative z-0
                      ${pin.status === "Active" ? "border-t-emerald-600" : ""}
                      ${pin.status === "Pending" ? "border-t-amber-500" : ""}
                      ${pin.status === "Suspended" ? "border-t-red-600" : ""}
                    `}
                    ></div>

                    {/* Pulse effect for pending */}
                    {pin.status === "Pending" && (
                      <div className="absolute inset-0 top-0 bottom-3 rounded-full bg-amber-500 animate-ping opacity-40"></div>
                    )}
                  </div>
                </Overlay>
              );
            })}

            {/* Custom Tooltip Overlay */}
            {selectedPin && (
              <Overlay
                anchor={[selectedPin.lat, selectedPin.lng]}
                offset={[144, 260]} // Positioned beautifully above the custom pin
              >
                <div
                  className="bg-white dark:bg-slate-900 rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.2)] dark:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] border border-slate-100/50 dark:border-slate-800 w-72 overflow-hidden animate-in fade-in zoom-in-95 duration-200 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-lg truncate pr-2 leading-tight">
                          {selectedPin.name}
                        </h3>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <User className="w-3.5 h-3.5" /> {selectedPin.owner}
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedPin(null)}
                        className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full p-1.5 transition-colors -mr-2"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm mb-4 p-3 bg-slate-50/80 dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-700 transition-colors">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                          Plan
                        </span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                          <CreditCard className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />{" "}
                          {selectedPin.tier}
                        </span>
                      </div>
                      <div className="flex flex-col gap-0.5 text-right">
                        <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                          Since
                        </span>
                        <span className="font-semibold text-slate-600 dark:text-slate-400 flex items-center justify-end gap-1">
                          <Clock className="w-3.5 h-3.5" /> {selectedPin.joined}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4 px-1">
                      <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                        <Phone className="w-3.5 h-3.5 text-emerald-500" />
                        <span>
                          {selectedPin.phone ||
                            (isKhmer ? "មិនមានលេខទូរស័ព្ទ" : "No phone")}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Link
                        href={`/admin/vendors?search=${encodeURIComponent(selectedPin.name)}`}
                        className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 rounded-xl text-sm font-semibold transition-all shadow-md shadow-slate-900/10 dark:shadow-none"
                      >
                        {isKhmer ? "មើលព័ត៌មានលម្អិត" : "View Full Details"}{" "}
                        <ChevronRight className="w-4 h-4" />
                      </Link>

                      {selectedPin.status === "Active" &&
                        mapMode === "internal" && (
                          <button
                            className={`w-full text-center py-2.5 border rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                              selectedPin.publicVisible
                                ? "border-indigo-100 dark:border-indigo-500/30 bg-indigo-50/80 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100/80 dark:hover:bg-indigo-500/20"
                                : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600"
                            }`}
                            onClick={() =>
                              togglePublicVisibility(selectedPin.id)
                            }
                          >
                            {selectedPin.publicVisible ? (
                              <EyeOff className="h-3.5 w-3.5" />
                            ) : (
                              <Eye className="h-3.5 w-3.5" />
                            )}
                            {selectedPin.publicVisible
                              ? isKhmer
                                ? "លាក់ពីអ្នកប្រើ"
                                : "Hide from Consumers"
                              : isKhmer
                                ? "បង្ហាញក្នុងកម្មវិធី"
                                : "Publish to App"}
                          </button>
                        )}
                    </div>
                  </div>
                </div>
              </Overlay>
            )}
          </Map>
        </div>
      </div>
    </div>
  );
}
