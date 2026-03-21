"use client";

import React, { useState, useEffect } from "react";
import { Map, Marker } from "pigeon-maps";
import {
  Heart, Star, Clock, Search,
  MessageSquare, MapPin, Navigation, List, SlidersHorizontal,
  ChevronRight, ArrowRight
} from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

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

const USER_LOCATION: [number, number] = [11.5621, 104.8880];

const mockVendors: (t: any) => Vendor[] = (t) => [
  {
    id: "1",
    name: "Bopha Kitchen",
    rating: 4.8,
    category: t("customer.filters.categories.khmer"),
    deliveryTime: "20-30",
    coords: [11.5650, 104.8900],
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "2",
    name: "Mekong Coffee",
    rating: 4.5,
    category: t("customer.filters.categories.coffee"),
    deliveryTime: "15-25",
    coords: [11.5600, 104.8850],
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "3",
    name: "Blue Pumpkin",
    rating: 4.6,
    category: t("customer.filters.categories.bakery"),
    deliveryTime: "25-35",
    coords: [11.5620, 104.8920],
    image: "https://images.unsplash.com/photo-1517433456452-f9633a119fbd?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "4",
    name: "Veggie Garden",
    rating: 4.7,
    category: t("customer.filters.categories.vegetarian"),
    deliveryTime: "30-45",
    coords: [11.5580, 104.8830],
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "5",
    name: "Market Grill",
    rating: 4.4,
    category: t("customer.filters.categories.fastFood"),
    deliveryTime: "10-20",
    coords: [11.5640, 104.8810],
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "6",
    name: "Sweet Khmer",
    rating: 4.9,
    category: t("customer.filters.categories.desserts"),
    deliveryTime: "15-30",
    coords: [11.5610, 104.8890],
    image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&q=80&w=600",
  },
];

const NAV_TABS: { id: TabId; icon: React.ElementType; label: string }[] = [
  { id: "list", icon: List, label: "Discover" },
  { id: "map", icon: MapPin, label: "Map View" },
  { id: "favorites", icon: Heart, label: "Favorites" },
];

export default function PsarPulseDashboard() {
  const { t, language } = useLanguage();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const isKhmer = language === "km";
  
  const [activeTab, setActiveTab] = useState<TabId>("list");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  if (!mounted) return null;

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans ${isDark ? "bg-[#020617] text-white" : "bg-[#F8FAFC] text-slate-900"}`}>

      {/* ── Header ── */}
      <header className="bg-[#0F172A] text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-[1400px] mx-auto px-6">

          {/* Single top row: Logo | Search | Avatar */}
          <div className="flex items-center gap-4 py-4">

            {/* Logo */}
            <div className="flex items-center gap-3 w-44 shrink-0">
              <div className="bg-[#4ade80] w-10 h-10 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-black font-black text-xl">P</span>
              </div>
              <span className="text-xl font-bold tracking-tight hidden sm:block">PsarPulse KH</span>
            </div>

            {/* Search */}
            <div className="flex-1 flex justify-center">
              <div className="relative w-full max-w-[560px] group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none group-focus-within:text-emerald-400 transition-colors" />
                <input
                  type="text"
                  placeholder={t("customer.searchPlaceholder")}
                  className={`w-full pl-11 pr-4 py-2.5 border rounded-full text-sm outline-none transition-all ${
                    isDark 
                      ? "bg-slate-900/50 border-white/10 text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/40" 
                      : "bg-slate-800/50 border-white/20 text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/60"
                  } ${isKhmer ? "font-suwannaphum" : ""}`}
                />
              </div>
            </div>

            {/* Avatar & Theme Toggle */}
            <div className="w-44 shrink-0 flex items-center justify-end gap-3">
              <ThemeToggle />
              <div className="w-10 h-10 rounded-full border-2 border-emerald-500/40 flex items-center justify-center bg-slate-800 cursor-pointer hover:border-emerald-500 transition-all shadow-lg active:scale-95">
                <span className="text-emerald-400 font-bold text-xs">SM</span>
              </div>
            </div>
          </div>

          {/* Nav tabs */}
          <div className="flex gap-8">
            {[
              { id: "list", icon: List, label: t("customer.tabs.discover") },
              { id: "map", icon: MapPin, label: t("customer.tabs.map") },
              { id: "favorites", icon: Heart, label: t("customer.tabs.favorites") },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabId)}
                  className={`text-sm font-bold flex items-center gap-2 py-3 transition-all relative ${
                    activeTab === tab.id ? "text-emerald-400" : "text-slate-400 hover:text-white"
                  } ${isKhmer ? "font-suwannaphum" : ""}`}
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
        <section className={`border-b sticky top-[108px] z-40 transition-colors duration-300 ${isDark ? "bg-[#020617] border-white/5" : "bg-white border-slate-200"}`}>
          <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
              <button className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-sm ${
                isDark ? "bg-white/5 text-slate-300 hover:bg-white/10" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              } ${isKhmer ? "font-suwannaphum text-sm" : ""}`}>
                <SlidersHorizontal size={14} /> {t("customer.filters.all")}
              </button>
              <div className={`h-5 w-px mx-2 shrink-0 ${isDark ? "bg-white/10" : "bg-slate-200"}`} />
              {["khmer", "coffee", "bakery", "vegetarian", "fastFood", "desserts"].map((catKey) => (
                <button
                  key={catKey}
                  className={`px-5 py-2.5 border rounded-full text-xs font-bold transition-all whitespace-nowrap shadow-sm hover:-translate-y-0.5 ${
                    isDark 
                      ? "border-white/10 text-slate-400 hover:border-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/5" 
                      : "border-slate-200 text-slate-500 hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50"
                  } ${isKhmer ? "font-suwannaphum text-sm" : ""}`}
                >
                  {t(`customer.filters.categories.${catKey}`)}
                </button>
              ))}
            </div>
            <div className={`hidden lg:flex items-center gap-2 text-xs font-bold shrink-0 ${isDark ? "text-slate-500" : "text-slate-400"}`}>
              {t("customer.sortBy")}: <span className="text-emerald-500 cursor-pointer hover:underline">{t("customer.recommended")}</span>
            </div>
          </div>
        </section>
      )}

      {/* ── Map View ── */}
      {activeTab === "map" && (
        <div className="h-[calc(100vh-108px)] w-full">
          <Map
            defaultCenter={USER_LOCATION}
            defaultZoom={14}
            height={undefined}
            width={undefined}
            attribution={false}
          >
            {/* User location marker */}
            <Marker
              width={40}
              anchor={USER_LOCATION}
              color="#4ade80"
            />

            {/* Vendor markers */}
            {mockVendors(t).map((vendor) => (
              <Marker
                key={vendor.id}
                width={36}
                anchor={vendor.coords}
                color="#10b981"
              />
            ))}
          </Map>
        </div>
      )}

      {/* ── List / Favorites View ── */}
      {activeTab !== "map" && (
        <main className="max-w-7xl mx-auto p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockVendors(t)
              .filter((v) => activeTab !== "favorites" || favorites.includes(v.id))
              .map((vendor) => (
                <div
                  key={vendor.id}
                  className={`border rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all group hover:-translate-y-1 duration-300 ${
                    isDark ? "bg-slate-900 border-white/5 shadow-white/5" : "bg-white border-slate-100"
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
                        className={favorites.includes(vendor.id) ? "fill-red-500 text-red-500" : "text-slate-300"}
                      />
                    </button>
                    <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-md border border-slate-100">
                      <Star size={14} className="text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-bold text-slate-800">{vendor.rating}</span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className={`font-bold text-xl mb-1 ${isDark ? "text-white" : "text-slate-900"} ${isKhmer ? "font-suwannaphum" : ""}`}>{vendor.name}</h3>
                        <p className={`text-sm font-medium ${isDark ? "text-slate-400" : "text-slate-500"} ${isKhmer ? "font-suwannaphum" : ""}`}>{vendor.category}</p>
                      </div>
                      <div className={`flex items-center gap-1.5 text-[10px] font-black px-3 py-1.5 rounded-lg border uppercase tracking-wider shrink-0 ${
                        isDark ? "bg-white/5 border-white/5 text-slate-400" : "bg-slate-50 border-slate-100 text-slate-500"
                      }`}>
                        <Clock size={12} /> {vendor.deliveryTime.split(" ")[0]} {t("customer.deliveryTime")}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <button className={`flex items-center justify-center gap-2 py-3 border rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5 ${
                        isDark ? "border-white/10 text-slate-300 hover:bg-white/5" : "border-slate-200 text-slate-700 hover:bg-slate-50"
                      } ${isKhmer ? "font-suwannaphum text-xs" : ""}`}>
                        <Navigation size={16} className="text-emerald-500" /> {t("customer.actions.directions")}
                      </button>
                      <button className={`py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5 ${isKhmer ? "font-suwannaphum text-xs" : ""}`}>
                        <MessageSquare size={16} /> {t("customer.actions.review")}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Empty state for favorites */}
          {activeTab === "favorites" && favorites.length === 0 && (
            <div className={`flex flex-col items-center justify-center py-32 text-center transition-opacity duration-500 ${isDark ? "text-slate-500" : "text-slate-400"}`}>
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${isDark ? "bg-white/5" : "bg-slate-100"}`}>
                <Heart size={40} className="opacity-20 translate-y-0.5" />
              </div>
              <p className={`text-xl font-bold mb-2 ${isDark ? "text-white" : "text-slate-900"} ${isKhmer ? "font-suwannaphum text-2xl" : ""}`}>
                {t("customer.favoritesEmpty.title")}
              </p>
              <p className={`text-sm max-w-[240px] leading-relaxed ${isDark ? "text-slate-400" : "text-slate-500"} ${isKhmer ? "font-suwannaphum" : ""}`}>
                {t("customer.favoritesEmpty.desc")}
              </p>
            </div>
          )}
        </main>
      )}
    </div>
  );
}