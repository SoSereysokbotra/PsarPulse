"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LanguageDropdown } from "@/components/ui/LanguageDropdown";
import Link from "next/link";
import {
  Search,
  MapPin,
  Store,
  ChevronLeft,
  Navigation,
  Info,
  Map as MapIcon,
  List as ListIcon,
  LocateFixed,
} from "lucide-react";
import { Map, Overlay, ZoomControl } from "pigeon-maps";

export default function MarketPulsePage() {
  const { language: lang } = useLanguage();
  const { resolvedTheme } = useTheme();

  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVendor, setSelectedVendor] = useState<any>(null);

  // Default Map state (Phnom Penh)
  const [center, setCenter] = useState<[number, number]>([11.5564, 104.9282]);
  const [zoom, setZoom] = useState(13);

  // Mobile layout state
  const [isListView, setIsListView] = useState(true);

  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert(t[lang].noGeolocation ?? "Geolocation is not supported");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
        setCenter([position.coords.latitude, position.coords.longitude]);
        setZoom(15);
        setIsLocating(false);
      },
      () => {
        alert(t[lang].locationError ?? "Unable to retrieve location");
        setIsLocating(false);
      }
    );
  };

  useEffect(() => {
    fetch("/api/public/vendors?location=true")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          const mapped = data.data.map((v: any) => ({
            id: v.id,
            name: v.businessName,
            description: v.businessDescription,
            address: v.businessAddress,
            logo: v.businessLogo,
            lat: parseFloat(v.latitude),
            lng: parseFloat(v.longitude),
            joinedAt: new Date(v.createdAt).toLocaleDateString(),
          }));
          setVendors(mapped);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load vendors:", err);
        setLoading(false);
      });
  }, []);

  const t = {
    en: {
      back: "Back Home",
      title: "Psar Pulse",
      desc: "Discover stalls and shops across Cambodia's vibrant markets.",
      searchPlaceholder: "Search for stalls or products...",
      noResults: "No vendors found.",
      loading: "Loading map...",
      mapView: "Map",
      listView: "List",
      getDirections: "Directions",
      noGeolocation: "Geolocation is not supported by your browser",
      locationError: "Unable to retrieve your location",
      locateMe: "My Location",
    },
    km: {
      back: "ត្រឡប់",
      title: "Psar Pulse",
      desc: "ស្វែងរកស្តង់ និងហាងនៅទូទាំងទីផ្សារកម្ពុជា។",
      searchPlaceholder: "ស្វែងរកស្តង់ ហាង...",
      noResults: "រកមិនឃើញអ្នកលក់ទេ។",
      loading: "កំពុងផ្ទុក...",
      mapView: "ផែនទី",
      listView: "បញ្ជី",
      getDirections: "នាំផ្លូវ",
      noGeolocation: "កម្មវិធីរុករករបស់អ្នកមិនគាំទ្រទីតាំងភូមិសាស្ត្រទេ",
      locationError: "មិនអាចទាញយកទីតាំងរបស់អ្នកបានទេ",
      locateMe: "ទីតាំងរបស់ខ្ញុំ",
    },
  };

  const filteredVendors = vendors.filter((v) => {
    if (!searchQuery) return true;
    const lowerQ = searchQuery.toLowerCase();
    return (
      (v.name && v.name.toLowerCase().includes(lowerQ)) ||
      (v.description && v.description.toLowerCase().includes(lowerQ))
    );
  });

  const handleVendorClick = (vendor: any) => {
    setSelectedVendor(vendor);
    if (vendor.lat && vendor.lng) {
      setCenter([vendor.lat, vendor.lng]);
      setZoom(16);
    }
    setIsListView(false);
  };

  const isDark = resolvedTheme === "dark";

  return (
    <div
      className={`h-screen flex flex-col font-sans transition-colors duration-300 ${isDark ? "bg-[#0b0c10] text-gray-100" : "bg-gray-50 text-gray-900"}`}
    >
      {/* Header */}
      <header
        className={`shrink-0 z-50 flex items-center justify-between px-4 sm:px-6 h-16 transition-colors ${isDark ? "bg-[#111216] border-b border-white/5" : "bg-white border-b border-gray-200"}`}
      >
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"}`}
          >
            <ChevronLeft className="w-5 h-5" />
            <span
              className="hidden sm:inline"
              style={
                lang === "km" ? { fontFamily: "var(--font-suwannaphum)" } : {}
              }
            >
              {t[lang].back}
            </span>
          </Link>
          <div
            className={`w-[1px] h-5 ${isDark ? "bg-white/10" : "bg-gray-200"}`}
          ></div>
          <h1 className="font-semibold tracking-tight text-base flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${isDark ? "bg-[#66fcf1]" : "bg-brand-primary"} animate-pulse shadow-sm`}
            ></span>
            <span
              style={
                lang === "km" ? { fontFamily: "var(--font-suwannaphum)" } : {}
              }
            >
              {t[lang].title}
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <ThemeToggle />
            <LanguageDropdown />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar (List View) */}
        <aside
          className={`
          absolute inset-0 z-20 sm:static sm:z-auto sm:w-[400px] lg:w-[450px] shrink-0 flex flex-col transition-transform duration-300 ease-in-out
          ${isListView ? "translate-x-0" : "-translate-x-full sm:translate-x-0"}
          ${isDark ? "bg-[#0b0c10] border-r border-white/5" : "bg-white border-r border-gray-200"}
        `}
        >
          <div className="p-6 shrink-0">
            <h2
              className="text-2xl font-bold mb-2 tracking-tight"
              style={
                lang === "km" ? { fontFamily: "var(--font-suwannaphum)" } : {}
              }
            >
              {t[lang].title}
            </h2>
            <p
              className={`text-sm mb-6 leading-relaxed ${isDark ? "text-gray-400" : "text-gray-500"}`}
              style={
                lang === "km" ? { fontFamily: "var(--font-suwannaphum)" } : {}
              }
            >
              {t[lang].desc}
            </p>

            <div className="relative group">
              <Search
                className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isDark ? "text-gray-500 group-focus-within:text-[#66fcf1]" : "text-gray-400 group-focus-within:text-brand-primary"}`}
              />
              <input
                type="text"
                placeholder={t[lang].searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm transition-all outline-none border 
                  ${
                    isDark
                      ? "bg-[#1a1c23] border-white/5 text-white placeholder:text-gray-500 focus:border-[#45a29e] focus:ring-1 focus:ring-[#45a29e]"
                      : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-brand-primary focus:ring-1 focus:ring-brand-primary focus:shadow-sm"
                  }`}
                style={
                  lang === "km" ? { fontFamily: "var(--font-suwannaphum)" } : {}
                }
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-6 sm:px-6 flex flex-col gap-3 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full opacity-70">
                <div
                  className={`w-8 h-8 rounded-full border-2 border-t-transparent animate-spin mb-4 ${isDark ? "border-[#66fcf1]" : "border-brand-primary"}`}
                ></div>
                <p
                  className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
                >
                  {t[lang].loading}
                </p>
              </div>
            ) : filteredVendors.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full opacity-70">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${isDark ? "bg-white/5" : "bg-gray-100"}`}
                >
                  <Store
                    className={`w-6 h-6 ${isDark ? "text-gray-500" : "text-gray-400"}`}
                  />
                </div>
                <p
                  className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
                  style={
                    lang === "km"
                      ? { fontFamily: "var(--font-suwannaphum)" }
                      : {}
                  }
                >
                  {t[lang].noResults}
                </p>
              </div>
            ) : (
              filteredVendors.map((vendor) => {
                const isSelected = selectedVendor?.id === vendor.id;
                return (
                  <div
                    key={vendor.id}
                    onClick={() => handleVendorClick(vendor)}
                    className={`
                      cursor-pointer rounded-xl p-4 transition-all duration-200 border
                      ${
                        isDark
                          ? isSelected
                            ? "bg-[#1a1c23] border-[#45a29e]"
                            : "bg-[#111216] border-white/5 hover:border-white/10 hover:bg-[#15171c]"
                          : isSelected
                            ? "bg-white border-brand-primary shadow-md ring-1 ring-brand-primary/10"
                            : "bg-white border-gray-100 shadow-sm hover:border-gray-300 hover:shadow"
                      }
                    `}
                  >
                    <div className="flex gap-4 items-start">
                      <div
                        className={`w-14 h-14 rounded-lg shrink-0 flex items-center justify-center overflow-hidden border ${isDark ? "bg-[#1a1c23] border-white/5" : "bg-gray-50 border-gray-100"}`}
                      >
                        {vendor.logo ? (
                          <img
                            src={vendor.logo}
                            alt={vendor.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Store
                            className={`w-6 h-6 ${isDark ? "text-gray-600" : "text-gray-300"}`}
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0 pt-0.5">
                        <h3
                          className={`font-semibold text-[15px] truncate mb-1 ${isDark ? "text-gray-100" : "text-gray-900"} ${isSelected && isDark ? "text-[#66fcf1]" : ""}`}
                        >
                          {vendor.name}
                        </h3>
                        {vendor.description && (
                          <p
                            className={`text-xs line-clamp-2 leading-relaxed mb-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}
                          >
                            {vendor.description}
                          </p>
                        )}
                        <div
                          className={`flex items-center gap-1.5 text-xs font-medium ${isDark ? "text-gray-500" : "text-gray-400"}`}
                        >
                          <MapPin className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">
                            {vendor.address || "Local vendor"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </aside>

        {/* Map Area */}
        <div className="flex-1 relative bg-[#e5e7eb] dark:bg-[#1a1c23]">
          
          {/* Locate Me Button */}
          <div className="absolute bottom-20 sm:bottom-6 right-4 sm:right-6 z-40">
            <button
              onClick={handleLocateMe}
              className={`flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition-all active:scale-95 ${
                isDark
                  ? "bg-[#111216] text-[#66fcf1] border border-white/10 hover:bg-[#1a1c23]"
                  : "bg-white text-brand-primary border border-gray-200 hover:bg-gray-50"
              }`}
              title={t[lang].locateMe}
            >
              <LocateFixed className={`w-5 h-5 ${isLocating ? "animate-pulse text-[#45a29e]" : ""}`} />
            </button>
          </div>
          
          {/* Mobile Floating Toggle */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 sm:hidden">
            <button
              onClick={() => setIsListView(!isListView)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold shadow-xl transition-transform active:scale-95
                ${isDark ? "bg-white text-gray-900" : "bg-gray-900 text-white"}
               `}
              style={
                lang === "km" ? { fontFamily: "var(--font-suwannaphum)" } : {}
              }
            >
              {isListView ? (
                <>
                  <MapIcon className="w-4 h-4" /> {t[lang].mapView}
                </>
              ) : (
                <>
                  <ListIcon className="w-4 h-4" /> {t[lang].listView}
                </>
              )}
            </button>
          </div>

          <Map
            center={center}
            zoom={zoom}
            onBoundsChanged={({ center, zoom }) => {
              setCenter(center);
              setZoom(zoom);
            }}
            onClick={() => setSelectedVendor(null)}
          >
            <ZoomControl />

            {/* User Location Pin */}
            {userLocation && (
              <Overlay anchor={userLocation} offset={[12, 12]}>
                <div className="relative flex items-center justify-center w-6 h-6" title={t[lang].locateMe}>
                  <div className="absolute w-full h-full bg-blue-500 rounded-full animate-ping opacity-60"></div>
                  <div className="relative w-3.5 h-3.5 bg-blue-600 border-2 border-white rounded-full shadow-md"></div>
                </div>
              </Overlay>
            )}

            {/* Vendor Pins */}
            {filteredVendors.map((vendor) => {
              const isSelected = selectedVendor?.id === vendor.id;
              return (
                <Overlay
                  key={vendor.id}
                  anchor={[vendor.lat, vendor.lng]}
                  offset={[20, 48]}
                >
                  <div
                    className="group cursor-pointer relative flex flex-col items-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedVendor(vendor);
                      setCenter([vendor.lat, vendor.lng]);
                    }}
                  >
                    <div
                      className={`
                        relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-white 
                        shadow-md transition-all duration-300
                        ${
                          isSelected
                            ? isDark
                              ? "bg-[#66fcf1] text-gray-900 scale-110 ring-4 ring-[#1a1c23] !z-30 shadow-[#66fcf1]/20"
                              : "bg-brand-primary scale-110 ring-4 ring-white shadow-xl !z-30"
                            : isDark
                              ? "bg-[#45a29e] hover:bg-[#66fcf1] hover:text-gray-900"
                              : "bg-gray-800 hover:bg-gray-900 hover:scale-105"
                        }
                      `}
                    >
                      <Store className="w-4 h-4" />
                    </div>
                    {/* Map Pin Tail */}
                    <div
                      className={`
                        w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px]
                        transition-colors duration-300 -mt-[2px] relative z-0
                        ${isSelected ? (isDark ? "border-t-[#66fcf1]" : "border-t-brand-primary") : isDark ? "border-t-[#45a29e]" : "border-t-gray-800"}
                      `}
                    ></div>
                  </div>
                </Overlay>
              );
            })}

            {/* Vendor Tooltip Overlay */}
            {selectedVendor && (
              <Overlay
                anchor={[selectedVendor.lat, selectedVendor.lng]}
                offset={[140, 240]}
              >
                <div
                  className={`
                    w-[280px] sm:w-[320px] rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 transition-colors
                    ${isDark ? "bg-[#111216] shadow-black/80 ring-1 ring-white/10" : "bg-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.2)] ring-1 ring-black/5"}
                  `}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Banner Image */}
                  <div
                    className={`h-32 relative ${isDark ? "bg-[#1a1c23]" : "bg-gray-100"}`}
                  >
                    {selectedVendor.logo ? (
                      <img
                        src={selectedVendor.logo}
                        alt={selectedVendor.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Store
                          className={`w-8 h-8 ${isDark ? "text-gray-700" : "text-gray-300"}`}
                        />
                      </div>
                    )}
                    {/* Gradient Overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="font-bold text-lg leading-tight truncate drop-shadow-md">
                        {selectedVendor.name}
                      </h3>
                      <p className="text-xs font-medium text-gray-200 mt-1 flex items-center gap-1.5 w-full">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="truncate">
                          {selectedVendor.address || "Local Stall"}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5">
                    {selectedVendor.description ? (
                      <p
                        className={`text-sm leading-relaxed line-clamp-2 mb-5 ${isDark ? "text-gray-400" : "text-gray-600"}`}
                      >
                        {selectedVendor.description}
                      </p>
                    ) : (
                      <div className="mb-4"></div>
                    )}

                    <div className="flex items-center gap-3">
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${selectedVendor.lat},${selectedVendor.lng}${userLocation ? `&origin=${userLocation[0]},${userLocation[1]}` : ''}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`
                            flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all
                            ${
                              isDark
                                ? "bg-white text-gray-900 hover:bg-gray-200"
                                : "bg-gray-900 text-white hover:bg-gray-800"
                            }
                          `}
                        style={
                          lang === "km"
                            ? { fontFamily: "var(--font-suwannaphum)" }
                            : {}
                        }
                      >
                        <Navigation className="w-4 h-4" />{" "}
                        {t[lang].getDirections}
                      </a>
                      <button
                        className={`
                            p-2.5 rounded-lg flex items-center justify-center transition-all border
                            ${isDark ? "border-white/10 text-gray-400 hover:bg-white/5 hover:text-white" : "border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-900"}
                          `}
                        onClick={() => setSelectedVendor(null)}
                        title="Close"
                      >
                        <Info className="w-5 h-5" />
                      </button>
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
