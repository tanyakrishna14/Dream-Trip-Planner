import React, { useState, useEffect } from "react";
import { 
  MapPin, 
  IndianRupee, 
  Calendar, 
  Sparkles, 
  Flame, 
  Trees, 
  Utensils, 
  Heart, 
  History as HistoryIcon, 
  Compass,
  ArrowRight,
  PlaneTakeoff,
  Image as ImageIcon
} from "lucide-react";

interface TripFormProps {
  onSubmit: (formData: {
    destination: string;
    startPoint: string;
    budget: number;
    days: number;
    interests: string[];
  }) => void;
  isLoading: boolean;
}

const POPULAR_DESTINATIONS = [
  { name: "Rajasthan", startPoint: "New Delhi", days: 4, budget: 15000, interests: ["History", "Culture"] },
  { name: "Goa", startPoint: "Mumbai", days: 3, budget: 12000, interests: ["Food", "Adventure"] },
  { name: "Leh Ladakh", startPoint: "Srinagar", days: 6, budget: 35000, interests: ["Nature", "Adventure"] },
  { name: "Kerala", startPoint: "Bengaluru", days: 5, budget: 20000, interests: ["Nature", "Spiritual", "Culture"] }
];

const INTEREST_OPTIONS = [
  { id: "History", label: "History", icon: HistoryIcon, color: "from-amber-500 to-orange-600" },
  { id: "Nature", label: "Nature", icon: Trees, color: "from-emerald-500 to-teal-600" },
  { id: "Food", label: "Food", icon: Utensils, color: "from-red-500 to-rose-600" },
  { id: "Adventure", label: "Adventure", icon: Flame, color: "from-orange-500 to-red-600" },
  { id: "Spiritual", label: "Spiritual", icon: Heart, color: "from-purple-500 to-indigo-600" },
  { id: "Culture", label: "Culture", icon: Compass, color: "from-blue-500 to-cyan-600" }
];

interface DestinationImage {
  name: string;
  url: string;
}

const DESTINATION_IMAGES_MAP: Record<string, DestinationImage[]> = {
  rajasthan: [
    { name: "Hawa Mahal (Jaipur)", url: "https://images.unsplash.com/photo-1477584308802-e48c9b3017c9?auto=format&fit=crop&w=600&q=80" },
    { name: "Mehrangarh Fort (Jodhpur)", url: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80" },
    { name: "Thar Desert dunes (Jaisalmer)", url: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80" }
  ],
  goa: [
    { name: "Palolem Beach Palms", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80" },
    { name: "Basilica of Bom Jesus", url: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=600&q=80" },
    { name: "Dudhsagar Waterfalls", url: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=600&q=80" }
  ],
  ladakh: [
    { name: "Pangong Tso Blue Lake", url: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=600&q=80" },
    { name: "Nubra Valley Desert Dunes", url: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=600&q=80" },
    { name: "Thiksey Monastery Skyline", url: "https://images.unsplash.com/photo-1544085311-11a028465b03?auto=format&fit=crop&w=600&q=80" }
  ],
  kerala: [
    { name: "Munnar Rolling Tea Gardens", url: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=600&q=80" },
    { name: "Alleppey Backwater Houseboats", url: "https://images.unsplash.com/photo-1593693411515-c202e9742af8?auto=format&fit=crop&w=600&q=80" },
    { name: "Athirappilly Waterfall Canopy", url: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=600&q=80" }
  ],
  paris: [
    { name: "Eiffel Tower over Seine", url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80" },
    { name: "Louvre Glass Pyramid", url: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=600&q=80" },
    { name: "Notre-Dame Cathedral Front", url: "https://images.unsplash.com/photo-1509060464153-44667396260f?auto=format&fit=crop&w=600&q=80" }
  ],
  kyoto: [
    { name: "Fushimi Inari Torii Path", url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80" },
    { name: "Arashiyama Green Bamboo Walk", url: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80" },
    { name: "Kinkaku-ji (Golden Pavilion)", url: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=600&q=80" }
  ],
  bali: [
    { name: "Uluwatu Seaside Cliff Temple", url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80" },
    { name: "Tegallalang Green Rice Terraces", url: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=600&q=80" },
    { name: "Kelingking Beach Nusa Penida", url: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?auto=format&fit=crop&w=600&q=80" }
  ],
  mumbai: [
    { name: "Gateway of India Arch", url: "https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=600&q=80" },
    { name: "Marine Drive Queen's Necklace", url: "https://images.unsplash.com/photo-1496372412473-e8548ffd82bc?auto=format&fit=crop&w=600&q=80" },
    { name: "Bandra-Worli Sea Link Bridge", url: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=600&q=80" }
  ],
  agra: [
    { name: "The Majestic Taj Mahal", url: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=600&q=80" },
    { name: "Agra Red Fort Walls", url: "https://images.unsplash.com/photo-1585464297241-bc40194b745f?auto=format&fit=crop&w=600&q=80" },
    { name: "Mehtab Bagh Gardens View", url: "https://images.unsplash.com/photo-1598325301809-ff51410d9f43?auto=format&fit=crop&w=600&q=80" }
  ],
  himachal: [
    { name: "Manali Solang Valley Peaks", url: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=600&q=80" },
    { name: "Shimla Mall Road Clocktower", url: "https://images.unsplash.com/photo-1597075687490-8f673c6c17f6?auto=format&fit=crop&w=600&q=80" },
    { name: "Spiti Valley Rocky Ranges", url: "https://images.unsplash.com/photo-1544085311-11a028465b03?auto=format&fit=crop&w=600&q=80" }
  ]
};

export default function TripForm({ onSubmit, isLoading }: TripFormProps) {
  const [destination, setDestination] = useState("");
  const [startPoint, setStartPoint] = useState("New Delhi");
  const [budget, setBudget] = useState<number>(15000);
  const [days, setDays] = useState<number>(4);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [currentImages, setCurrentImages] = useState<DestinationImage[]>([]);

  // Calculate dynamic list of destination images on typing or selection
  useEffect(() => {
    if (!destination.trim()) {
      setCurrentImages([]);
      return;
    }
    const search = destination.toLowerCase();
    let matched = false;

    for (const [key, list] of Object.entries(DESTINATION_IMAGES_MAP)) {
      if (search.includes(key)) {
        setCurrentImages(list);
        matched = true;
        break;
      }
    }

    if (!matched) {
      // Dynamic fallback heuristics
      if (search.includes("beach") || search.includes("coast") || search.includes("sea") || search.includes("maldives")) {
        setCurrentImages([
          { name: "Exotic White Sand Resort", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80" },
          { name: "Crystal Blue Coral Reef", url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80" },
          { name: "Sunset Beach Palms", url: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=600&q=80" }
        ]);
      } else if (search.includes("mountain") || search.includes("snow") || search.includes("himalaya") || search.includes("swiss") || search.includes("trek")) {
        setCurrentImages([
          { name: "Snowy Mountain Peaks", url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80" },
          { name: "High Altitude Pine Forest", url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80" },
          { name: "Deep Green Alpine Valleys", url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80" }
        ]);
      } else if (search.includes("temple") || search.includes("church") || search.includes("spiritual") || search.includes("historical")) {
        setCurrentImages([
          { name: "Heritage Temple Spires", url: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=600&q=80" },
          { name: "Sacred Ceremonial Path", url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80" },
          { name: "Ancient Carved Stone Arch", url: "https://images.unsplash.com/photo-1544085311-11a028465b03?auto=format&fit=crop&w=600&q=80" }
        ]);
      } else {
        // Highly reactive name tag overlays!
        const cleanName = destination.length > 20 ? destination.substring(0, 20) + "..." : destination;
        setCurrentImages([
          { name: `Iconic Spot in ${cleanName}`, url: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80" },
          { name: `Scenic View of ${cleanName}`, url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80" },
          { name: `Local Vibe of ${cleanName}`, url: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=600&q=80" }
        ]);
      }
    }
  }, [destination]);

  const handleInterestToggle = (interestId: string) => {
    setSelectedInterests(prev => 
      prev.includes(interestId)
        ? prev.filter(i => i !== interestId)
        : [...prev, interestId]
    );
  };

  const applyQuickFill = (destName: string, start: string, d: number, b: number, interests: string[]) => {
    setDestination(destName);
    setStartPoint(start);
    setDays(d);
    setBudget(b);
    setSelectedInterests(interests);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim() || !startPoint.trim()) return;
    
    // Fallback to "Culture" if no interest selected
    const finalInterests = selectedInterests.length > 0 ? selectedInterests : ["Culture"];
    
    onSubmit({
      destination: destination.trim(),
      startPoint: startPoint.trim(),
      budget,
      days,
      interests: finalInterests
    });
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100" id="trip-planner-form">
      {/* Quick Fill suggestions with gorgeous cards */}
      <div className="mb-6">
        <p className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          Popular Quick Starts
        </p>
        <div className="flex flex-wrap gap-2.5">
          {POPULAR_DESTINATIONS.map((dest) => (
            <button
              key={dest.name}
              type="button"
              onClick={() => applyQuickFill(dest.name, dest.startPoint, dest.days, dest.budget, dest.interests)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 border border-slate-200/60 text-xs font-semibold text-slate-600 transition-all duration-200 cursor-pointer flex items-center gap-1.5"
            >
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {dest.name}
              <span className="text-[10px] text-slate-400 font-mono">({dest.days} Days from {dest.startPoint})</span>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Departure Point & Destination Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
              <PlaneTakeoff className="w-4 h-4 text-emerald-500 animate-pulse" />
              Starting Location (Start Point)
            </label>
            <div className="relative">
              <input
                type="text"
                value={startPoint}
                onChange={(e) => setStartPoint(e.target.value)}
                placeholder="e.g. New Delhi, Mumbai, Bengaluru"
                required
                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl py-3.5 pl-4 pr-10 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                Departure
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-500" />
              Where is your Dream Destination?
            </label>
            <div className="relative">
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Rajasthan, Goa, Paris, Bali"
                required
                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl py-3.5 pl-4 pr-10 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                Destination
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Destination Images Gallery */}
        {currentImages.length > 0 && (
          <div className="space-y-2.5 animate-fade-in p-4 bg-slate-50 rounded-2xl border border-slate-200/50">
            <p className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-sky-500" />
              Stunning Destination Highlights
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {currentImages.map((img, idx) => (
                <div key={idx} className="relative group rounded-xl overflow-hidden aspect-video border border-slate-200 shadow-xs">
                  <img
                    src={img.url}
                    alt={img.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-2.5">
                    <p className="text-[11px] font-bold text-white tracking-wide truncate w-full">
                      {img.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Duration & Budget Slider */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-500" />
                Trip Duration (Days)
              </label>
              <span className="text-emerald-600 font-bold font-mono text-sm px-2.5 py-0.5 bg-emerald-50 border border-emerald-100 rounded-lg">
                {days} {days === 1 ? "Day" : "Days"}
              </span>
            </div>
            <div className="pt-2">
              <input
                type="range"
                min={1}
                max={14}
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1 px-1">
                <span>1 Day</span>
                <span>5 Days</span>
                <span>10 Days</span>
                <span>14 Days</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
              <IndianRupee className="w-4 h-4 text-emerald-500" />
              Total Budget for the trip (₹)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">
                ₹
              </span>
              <input
                type="number"
                min={1000}
                max={10000000}
                step={500}
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                required
                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl py-3.5 pl-9 pr-16 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-mono">
                INR
              </span>
            </div>
          </div>
        </div>

        {/* Interests Selection */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-emerald-500" />
            Choose Your Interests <span className="text-xs font-normal text-slate-400">(Select multiple)</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {INTEREST_OPTIONS.map((interest) => {
              const isSelected = selectedInterests.includes(interest.id);
              const Icon = interest.icon;
              return (
                <button
                  key={interest.id}
                  type="button"
                  onClick={() => handleInterestToggle(interest.id)}
                  className={`relative overflow-hidden flex flex-col items-center justify-center p-3.5 rounded-2xl border text-center transition-all cursor-pointer group ${
                    isSelected
                      ? "border-emerald-500 bg-emerald-500/5 text-emerald-800 font-semibold"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                  }`}
                >
                  <div className={`p-2 rounded-xl mb-2 transition-all ${
                    isSelected ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium">{interest.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-2xl shadow-md hover:shadow-lg hover:shadow-emerald-900/10 active:scale-[0.99] transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Crafting Your Itinerary...
              </>
            ) : (
              <>
                Generate Dream Trip Plan
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
