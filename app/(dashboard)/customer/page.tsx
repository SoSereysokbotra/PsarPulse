"use client";

import React, { useState, useEffect } from "react";
import { Map, Marker } from "pigeon-maps";
import {
  Heart,
  Star,
  Clock,
  Search,
  MessageSquare,
  MapPin,
  Navigation,
  List,
  SlidersHorizontal,
  ChevronRight,
  ArrowRight,
  Plus,
  Minus,
  LocateFixed,
  X,
} from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useUser } from "@/components/providers/UserProvider";

interface Vendor {
  id: string;
  name: string;
  rating: number;
  category: string;
  deliveryTime: string;
  coords: [number, number];
  image: string;
}

type TabId = "list" | "map" | "favorites";

const USER_LOCATION: [number, number] = [11.5621, 104.888];

// Remove mock vendors

export default function PsarPulseDashboard() {
  const { t, language } = useLanguage();
  const { resolvedTheme } = useTheme();
  const { user, loading } = useUser();
  const isDark = resolvedTheme === "dark";
  const isKhmer = language === "km";

  // Initials
  const getInitials = (name: string) => {
    if (!name) return "??";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.trim().slice(0, 2).toUpperCase();
  };

  const displayInitials = getInitials(user?.fullName || "User");

  const [activeTab, setActiveTab] = useState<TabId>("list");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loadingVendors, setLoadingVendors] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [reviewVendorId, setReviewVendorId] = useState<string | null>(null);

  const handleDirections = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, "_blank");
  };

  // --- Map State ---
  const [mapCenter, setMapCenter] = useState<[number, number]>(USER_LOCATION);
  const [mapZoom, setMapZoom] = useState(14);
  const [selectedMapVendor, setSelectedMapVendor] = useState<Vendor | null>(
    null,
  );

  useEffect(() => {
    setMounted(true);
    const fetchVendors = async () => {
      try {
        const response = await fetch("/api/customer/vendors");
        const json = await response.json();
        if (json.success) {
          setVendors(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch vendors:", error);
      } finally {
        setLoadingVendors(false);
      }
    };
    fetchVendors();
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
    );
  };

  // --- Map Handlers ---
  const handleZoomIn = () => setMapZoom(Math.min(mapZoom + 1, 18));
  const handleZoomOut = () => setMapZoom(Math.max(mapZoom - 1, 3));
  const handleLocateMe = () => {
    setMapCenter(USER_LOCATION);
    setMapZoom(15);
  };

  if (!mounted) return null;

  return (
    <div
      className={`min-h-screen transition-colors duration-300 font-sans ${isDark ? "bg-[#020617] text-white" : "bg-[#F8FAFC] text-slate-900"}`}
    >
      {/* ── Header ── */}
      <header className="bg-[#0F172A] text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-center gap-4 py-4">
            {/* Logo */}
            <div className="flex items-center gap-3 w-44 shrink-0">
              <div className="bg-[#4ade80] w-10 h-10 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-black font-black text-xl">P</span>
              </div>
              <span className="text-xl font-bold tracking-tight hidden sm:block">
                PsarPulse KH
              </span>
            </div>

            {/* Search */}
            <div className="flex-1 flex justify-center">
              <div className="relative w-full max-w-[560px] group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none group-focus-within:text-emerald-400 transition-colors" />
                <input
                  type="text"
                  placeholder={t("customer.searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-11 pr-4 py-2.5 border rounded-full text-sm outline-none transition-all ${
                    isDark
                      ? "bg-slate-900/50 border-white/10 text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/40"
                      : "bg-slate-800/50 border-white/20 text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/60"
                  } ${isKhmer ? "font-battambang" : ""}`}
                />
              </div>
            </div>

            {/* Avatar & Theme Toggle */}
            <div className="w-44 shrink-0 flex items-center justify-end gap-3">
              <ThemeToggle />
              <div className="w-10 h-10 rounded-full border-2 border-emerald-500/40 flex items-center justify-center bg-slate-800 cursor-pointer hover:border-emerald-500 transition-all shadow-lg active:scale-95">
                <span className="text-emerald-400 font-bold text-xs">
                  {loading ? ".." : displayInitials}
                </span>
              </div>
            </div>
          </div>

          {/* Nav tabs */}
          <div className="flex gap-8">
            {[
              { id: "list", icon: List, label: t("customer.tabs.discover") },
              { id: "map", icon: MapPin, label: t("customer.tabs.map") },
              {
                id: "favorites",
                icon: Heart,
                label: t("customer.tabs.favorites"),
              },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabId)}
                  className={`text-sm font-bold flex items-center gap-2 py-3 transition-all relative ${
                    activeTab === tab.id
                      ? "text-emerald-400"
                      : "text-slate-400 hover:text-white"
                  } ${isKhmer ? "font-battambang" : ""}`}
                >
                  <Icon size={16} />
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-400 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* ── Filter Toolbar (hidden on map tab) ── */}
      {activeTab !== "map" && (
        <section
          className={`border-b sticky top-[108px] z-40 transition-colors duration-300 ${isDark ? "bg-[#020617] border-white/5" : "bg-white border-slate-200"}`}
        >
          <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-sm ${
                  selectedCategory === "all"
                    ? "bg-emerald-500 text-white shadow-emerald-500/20"
                    : isDark
                      ? "bg-white/5 text-slate-300 hover:bg-white/10"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                } ${isKhmer ? "font-battambang text-sm" : ""}`}
              >
                <SlidersHorizontal size={14} /> {t("customer.filters.all")}
              </button>
              <div
                className={`h-5 w-px mx-2 shrink-0 ${isDark ? "bg-white/10" : "bg-slate-200"}`}
              />
              {[
                "apparel",
                "electronics",
                "household",
                "services",
                "accessories",
                "other",
              ].map((catKey) => (
                <button
                  key={catKey}
                  onClick={() => setSelectedCategory(catKey)}
                  className={`px-5 py-2.5 border rounded-full text-xs font-bold transition-all whitespace-nowrap shadow-sm hover:-translate-y-0.5 ${
                    selectedCategory === catKey
                      ? "bg-emerald-500 border-emerald-500 text-white shadow-emerald-500/20"
                      : isDark
                        ? "border-white/10 text-slate-400 hover:border-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/5"
                        : "border-slate-200 text-slate-500 hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50"
                  } ${isKhmer ? "font-battambang text-sm" : ""}`}
                >
                  {t(`customer.filters.categories.${catKey}`)}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Map View ── */}
      {activeTab === "map" && (
        <div className="relative h-[calc(100vh-108px)] w-full overflow-hidden">
          <Map
            center={mapCenter}
            zoom={mapZoom}
            onBoundsChanged={({ center, zoom }) => {
              setMapCenter(center);
              setMapZoom(zoom);
            }}
            onClick={() => setSelectedMapVendor(null)} // Deselect vendor on map click
          >
            {/* User location marker */}
            <Marker width={45} anchor={USER_LOCATION}>
              <div className="w-5 h-5 bg-blue-500 rounded-full border-4 border-white shadow-lg animate-pulse" />
            </Marker>

            {/* Vendor markers */}
            {vendors.map((vendor) => {
              const isSelected = selectedMapVendor?.id === vendor.id;
              return (
                <Marker
                  key={vendor.id}
                  width={40}
                  anchor={vendor.coords}
                  onClick={({ event }) => {
                    event.stopPropagation();
                    setSelectedMapVendor(vendor);
                    setMapCenter(vendor.coords); // Center map on clicked vendor
                  }}
                >
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full shadow-lg transition-transform ${
                      isSelected
                        ? "bg-amber-500 scale-125 z-50"
                        : "bg-emerald-500 hover:scale-110"
                    }`}
                  >
                    <MapPin size={20} className="text-white" />
                  </div>
                </Marker>
              );
            })}
          </Map>

          {/* Interactive Map Controls */}
          <div className="absolute top-6 right-6 flex flex-col gap-3 z-10">
            <button
              onClick={handleLocateMe}
              className={`p-3 rounded-xl shadow-lg transition-all active:scale-95 ${
                isDark
                  ? "bg-slate-800 text-blue-400 hover:bg-slate-700"
                  : "bg-white text-blue-500 hover:bg-slate-50"
              }`}
              title="Locate Me"
            >
              <LocateFixed size={20} />
            </button>
            <div
              className={`flex flex-col rounded-xl shadow-lg overflow-hidden ${
                isDark
                  ? "bg-slate-800 text-slate-300"
                  : "bg-white text-slate-700"
              }`}
            >
              <button
                onClick={handleZoomIn}
                className={`p-3 transition-colors ${isDark ? "hover:bg-slate-700" : "hover:bg-slate-50"}`}
              >
                <Plus size={20} />
              </button>
              <div
                className={`w-full h-px ${isDark ? "bg-slate-700" : "bg-slate-100"}`}
              />
              <button
                onClick={handleZoomOut}
                className={`p-3 transition-colors ${isDark ? "hover:bg-slate-700" : "hover:bg-slate-50"}`}
              >
                <Minus size={20} />
              </button>
            </div>
          </div>

          {/* Floating Vendor Popup / Bottom Sheet */}
          {selectedMapVendor && (
            <div
              className={`absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-sm px-4 z-20 transition-all transform animate-in slide-in-from-bottom-8`}
            >
              <div
                className={`flex gap-4 p-4 rounded-2xl shadow-2xl border ${
                  isDark
                    ? "bg-slate-900 border-slate-800"
                    : "bg-white border-slate-100"
                }`}
              >
                <div className="relative w-24 h-24 shrink-0">
                  <img
                    src={selectedMapVendor.image}
                    alt={selectedMapVendor.name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                  <div className="absolute -top-2 -right-2 bg-white px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow-md border border-slate-100">
                    <Star
                      size={12}
                      className="text-yellow-500 fill-yellow-500"
                    />
                    <span className="text-xs font-bold text-slate-800">
                      {selectedMapVendor.rating}
                    </span>
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex justify-between items-start mb-1">
                    <h3
                      className={`font-bold text-lg leading-tight ${isDark ? "text-white" : "text-slate-900"} ${isKhmer ? "font-battambang" : ""}`}
                    >
                      {selectedMapVendor.name}
                    </h3>
                    <button
                      onClick={() => setSelectedMapVendor(null)}
                      className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <X
                        size={16}
                        className={isDark ? "text-slate-400" : "text-slate-500"}
                      />
                    </button>
                  </div>
                  <p
                    className={`text-sm mb-3 ${isDark ? "text-slate-400" : "text-slate-500"} ${isKhmer ? "font-battambang" : ""}`}
                  >
                    {selectedMapVendor.category} •{" "}
                    {selectedMapVendor.deliveryTime} mins
                  </p>
                  <button 
                    onClick={() => handleDirections(selectedMapVendor.coords[0], selectedMapVendor.coords[1])}
                    className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all"
                  >
                    <Navigation size={14} /> Directions
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── List / Favorites View ── */}
      {activeTab !== "map" && (
        <main className="max-w-7xl mx-auto p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loadingVendors ? (
              <div className="col-span-full py-12 flex justify-center text-slate-500">
                Loading vendors...
              </div>
            ) : vendors
              .filter((v) => {
                const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) || v.category.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesCategory = selectedCategory === "all" || v.category.toLowerCase() === selectedCategory.toLowerCase();
                const isFavoriteTab = activeTab === "favorites" ? favorites.includes(v.id) : true;
                return matchesSearch && matchesCategory && isFavoriteTab;
              })
              .map((vendor) => (
                <div
                  key={vendor.id}
                  className={`border rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all group hover:-translate-y-1 duration-300 ${
                    isDark
                      ? "bg-slate-900 border-white/5 shadow-white/5"
                      : "bg-white border-slate-100"
                  }`}
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={vendor.image}
                      className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                      alt={vendor.name}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <button
                      onClick={() => toggleFavorite(vendor.id)}
                      className="absolute top-4 right-4 p-2.5 bg-white/95 backdrop-blur rounded-xl shadow-md hover:scale-110 active:scale-95 transition-all text-slate-900"
                    >
                      <Heart
                        size={18}
                        className={
                          favorites.includes(vendor.id)
                            ? "fill-red-500 text-red-500"
                            : "text-slate-300"
                        }
                      />
                    </button>
                    <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-md border border-slate-100">
                      <Star
                        size={14}
                        className="text-yellow-500 fill-yellow-500"
                      />
                      <span className="text-sm font-bold text-slate-800">
                        {vendor.rating}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3
                          className={`font-bold text-xl mb-1 ${isDark ? "text-white" : "text-slate-900"} ${isKhmer ? "font-battambang" : ""}`}
                        >
                          {vendor.name}
                        </h3>
                        <p
                          className={`text-sm font-medium ${isDark ? "text-slate-400" : "text-slate-500"} ${isKhmer ? "font-battambang" : ""}`}
                        >
                          {vendor.category}
                        </p>
                      </div>
                      <div
                        className={`flex items-center gap-1.5 text-[10px] font-black px-3 py-1.5 rounded-lg border uppercase tracking-wider shrink-0 ${
                          isDark
                            ? "bg-white/5 border-white/5 text-slate-400"
                            : "bg-slate-50 border-slate-100 text-slate-500"
                        }`}
                      >
                        <Clock size={12} /> {vendor.deliveryTime.split(" ")[0]}{" "}
                        {t("customer.deliveryTime")}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => handleDirections(vendor.coords[0], vendor.coords[1])}
                        className={`flex items-center justify-center gap-2 py-3 border rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5 ${
                          isDark
                            ? "border-white/10 text-slate-300 hover:bg-white/5"
                            : "border-slate-200 text-slate-700 hover:bg-slate-50"
                        } ${isKhmer ? "font-battambang text-xs" : ""}`}
                      >
                        <Navigation size={16} className="text-emerald-500" />{" "}
                        {t("customer.actions.directions")}
                      </button>
                      <button
                        onClick={() => setReviewVendorId(vendor.id)}
                        className={`py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5 ${isKhmer ? "font-battambang text-xs" : ""}`}
                      >
                        <MessageSquare size={16} />{" "}
                        {t("customer.actions.review")}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Empty state for favorites */}
          {activeTab === "favorites" && favorites.length === 0 && (
            <div
              className={`flex flex-col items-center justify-center py-32 text-center transition-opacity duration-500 ${isDark ? "text-slate-500" : "text-slate-400"}`}
            >
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${isDark ? "bg-white/5" : "bg-slate-100"}`}
              >
                <Heart size={40} className="opacity-20 translate-y-0.5" />
              </div>
              <p
                className={`text-xl font-bold mb-2 ${isDark ? "text-white" : "text-slate-900"} ${isKhmer ? "font-battambang text-2xl" : ""}`}
              >
                {t("customer.favoritesEmpty.title")}
              </p>
              <p
                className={`text-sm max-w-[240px] leading-relaxed ${isDark ? "text-slate-400" : "text-slate-500"} ${isKhmer ? "font-battambang" : ""}`}
              >
                {t("customer.favoritesEmpty.desc")}
              </p>
            </div>
          )}
        </main>
      )}

      {reviewVendorId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className={`w-full max-w-md rounded-2xl p-6 shadow-2xl ${isDark ? "bg-slate-900 text-white border border-white/10" : "bg-white text-slate-900"}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Leave a Review</h3>
              <button onClick={() => setReviewVendorId(null)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            <p className={`text-sm mb-6 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Share your experience with this vendor.
            </p>
            <textarea 
              placeholder="Write your review here..."
              className={`w-full p-4 rounded-xl border outline-none min-h-[120px] mb-6 resize-none ${isDark ? "bg-slate-800 border-white/10 text-white focus:border-emerald-500" : "bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-500"}`}
            />
            <button 
              onClick={() => {
                alert("Thank you for your review!");
                setReviewVendorId(null);
              }}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-colors"
            >
              Submit Review
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
