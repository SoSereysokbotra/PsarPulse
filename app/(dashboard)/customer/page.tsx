"use client";

import React, { useState, useEffect } from "react";
import { Map, Marker } from "pigeon-maps";
import {
  Heart, Star, Clock, Search,
  MessageSquare, MapPin, Navigation, List, SlidersHorizontal,
} from "lucide-react";

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

const mockVendors: Vendor[] = [
  {
    id: "1",
    name: "Bopha Kitchen",
    rating: 4.8,
    category: "Khmer Cuisine",
    deliveryTime: "20-30 MIN",
    coords: [11.5650, 104.8900],
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "2",
    name: "Mekong Coffee",
    rating: 4.5,
    category: "Cafe & Bakery",
    deliveryTime: "15-25 MIN",
    coords: [11.5600, 104.8850],
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=600",
  },
];

const NAV_TABS: { id: TabId; icon: React.ElementType; label: string }[] = [
  { id: "list", icon: List, label: "Discover" },
  { id: "map", icon: MapPin, label: "Map View" },
  { id: "favorites", icon: Heart, label: "Favorites" },
];

export default function PsarPulseDashboard() {
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
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">

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
              <div className="relative w-full max-w-[560px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search vendors..."
                  className="w-full pl-11 pr-4 py-2.5 bg-[#1E293B] border border-slate-600 rounded-full text-sm text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-[#4ade80]/40 focus:border-[#4ade80]/60 transition-all"
                />
              </div>
            </div>

            {/* Avatar */}
            <div className="w-44 shrink-0 flex justify-end">
              <div className="w-10 h-10 rounded-full border-2 border-[#4ade80]/40 flex items-center justify-center bg-[#1E293B] cursor-pointer hover:border-[#4ade80] transition-all">
                <span className="text-[#4ade80] font-bold text-xs">SM</span>
              </div>
            </div>
          </div>

          {/* Nav tabs */}
          <div className="flex gap-8">
            {NAV_TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`text-sm font-bold flex items-center gap-2 py-3 transition-all relative ${
                    activeTab === tab.id ? "text-[#4ade80]" : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#4ade80]" />
                  )}
                </button>
              );
            })}
          </div>

        </div>
      </header>

      {/* ── Filter Toolbar (hidden on map tab) ── */}
      {activeTab !== "map" && (
        <section className="bg-white border-b border-slate-200 sticky top-[108px] z-40">
          <div className="max-w-7xl mx-auto px-8 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-x-auto">
              <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors shrink-0">
                <SlidersHorizontal size={14} /> All Filters
              </button>
              <div className="h-4 w-px bg-slate-200 mx-2 shrink-0" />
              {["Khmer", "Coffee", "Bakery", "Vegetarian", "Fast Food", "Desserts"].map((cat) => (
                <button
                  key={cat}
                  className="px-4 py-2 border border-slate-200 rounded-full text-xs font-semibold text-slate-500 hover:border-[#4ade80] hover:text-[#4ade80] transition-all whitespace-nowrap"
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="hidden lg:flex items-center gap-2 text-xs font-bold text-slate-400 shrink-0">
              Sort by: <span className="text-slate-900 cursor-pointer hover:text-[#4ade80]">Recommended</span>
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
            {mockVendors.map((vendor) => (
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
            {mockVendors
              .filter((v) => activeTab !== "favorites" || favorites.includes(v.id))
              .map((vendor) => (
                <div
                  key={vendor.id}
                  className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group"
                >
                  <div className="relative h-56">
                    <img
                      src={vendor.image}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      alt={vendor.name}
                    />
                    <button
                      onClick={() => toggleFavorite(vendor.id)}
                      className="absolute top-4 right-4 p-2.5 bg-white/95 backdrop-blur rounded-xl shadow-md hover:scale-110 transition-all"
                    >
                      <Heart
                        size={18}
                        className={favorites.includes(vendor.id) ? "fill-red-500 text-red-500" : "text-slate-300"}
                      />
                    </button>
                    <div className="absolute bottom-4 left-4 bg-white px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-md border border-slate-50">
                      <Star size={14} className="text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-bold text-slate-800">{vendor.rating}</span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="font-bold text-slate-900 text-xl mb-1">{vendor.name}</h3>
                        <p className="text-sm text-slate-500 font-medium">{vendor.category}</p>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 uppercase tracking-wider shrink-0">
                        <Clock size={12} /> {vendor.deliveryTime}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <button className="flex items-center justify-center gap-2 py-3 border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all">
                        <Navigation size={16} className="text-slate-400" /> Directions
                      </button>
                      <button className="py-3 bg-[#10b981] hover:bg-[#059669] text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-100 transition-all">
                        <MessageSquare size={16} /> Review
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Empty state for favorites */}
          {activeTab === "favorites" && favorites.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-slate-400">
              <Heart size={48} className="mb-4 opacity-30" />
              <p className="text-lg font-semibold">No favorites yet</p>
              <p className="text-sm mt-1">Tap the heart on any vendor to save them here.</p>
            </div>
          )}
        </main>
      )}
    </div>
  );
}