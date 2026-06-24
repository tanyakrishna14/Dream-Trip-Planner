import React, { useState } from "react";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Utensils, 
  Sparkles, 
  Lightbulb, 
  Backpack, 
  ChevronDown, 
  ChevronUp, 
  Map, 
  Info, 
  TrendingUp, 
  Compass, 
  Camera 
} from "lucide-react";
import { TravelPlan, DayItinerary, Attraction, FoodSuggestion, PackingCategory } from "../types";

interface ItineraryDaysProps {
  plan: TravelPlan;
}

export default function ItineraryDays({ plan }: ItineraryDaysProps) {
  const { itinerary, attractions, foodSuggestions, travelTips, packingSuggestions } = plan;
  const [activeTab, setActiveTab] = useState<"itinerary" | "attractions" | "food" | "tips_packing">("itinerary");
  const [expandedDay, setExpandedDay] = useState<number | null>(1);

  const toggleDay = (dayNum: number) => {
    setExpandedDay(expandedDay === dayNum ? null : dayNum);
  };

  return (
    <div className="space-y-8" id="itinerary-days-details">
      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto scrollbar-none gap-2 p-1 bg-slate-50 rounded-2xl">
        <button
          onClick={() => setActiveTab("itinerary")}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-bold rounded-xl whitespace-nowrap cursor-pointer transition-all ${
            activeTab === "itinerary"
              ? "bg-white text-emerald-800 shadow-sm border border-slate-200/50"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Calendar className="w-4 h-4 text-emerald-500" />
          Day-wise Itinerary
        </button>

        <button
          onClick={() => setActiveTab("attractions")}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-bold rounded-xl whitespace-nowrap cursor-pointer transition-all ${
            activeTab === "attractions"
              ? "bg-white text-emerald-800 shadow-sm border border-slate-200/50"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Camera className="w-4 h-4 text-sky-500" />
          Recommended Attractions
        </button>

        <button
          onClick={() => setActiveTab("food")}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-bold rounded-xl whitespace-nowrap cursor-pointer transition-all ${
            activeTab === "food"
              ? "bg-white text-emerald-800 shadow-sm border border-slate-200/50"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Utensils className="w-4 h-4 text-rose-500" />
          Local Food Suggestions
        </button>

        <button
          onClick={() => setActiveTab("tips_packing")}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-bold rounded-xl whitespace-nowrap cursor-pointer transition-all ${
            activeTab === "tips_packing"
              ? "bg-white text-emerald-800 shadow-sm border border-slate-200/50"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Backpack className="w-4 h-4 text-amber-500" />
          Tips & Packing List
        </button>
      </div>

      {/* Tab Panels */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm min-h-[300px]">
        {/* PANEL: Day-wise Itinerary */}
        {activeTab === "itinerary" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-black font-display text-slate-800 flex items-center gap-2">
                <Compass className="w-5 h-5 text-emerald-600 animate-pulse" />
                Your Custom Journey Route
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                Click days to view specific activities
              </span>
            </div>

            <div className="space-y-4">
              {itinerary.map((day) => {
                const isExpanded = expandedDay === day.dayNumber;
                return (
                  <div 
                    key={day.dayNumber} 
                    className={`border rounded-2xl overflow-hidden transition-all duration-200 ${
                      isExpanded 
                        ? "border-emerald-200 bg-emerald-50/10 shadow-sm" 
                        : "border-slate-100 hover:border-slate-200"
                    }`}
                  >
                    {/* Day Header Trigger */}
                    <button
                      onClick={() => toggleDay(day.dayNumber)}
                      className="w-full flex items-center justify-between p-5 text-left font-semibold hover:bg-slate-50/50 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-600 text-white font-mono text-sm font-black shadow-sm shadow-emerald-600/10 shrink-0">
                          D{day.dayNumber}
                        </span>
                        <div>
                          <h4 className="text-base font-bold text-slate-800 font-display">
                            {day.dayTitle}
                          </h4>
                        </div>
                      </div>
                      <div>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                    </button>

                    {/* Day Activities */}
                    {isExpanded && (
                      <div className="p-5 pt-0 border-t border-slate-100/80 divide-y divide-slate-100/50 space-y-6">
                        {day.activities.map((activity, actIdx) => (
                          <div key={actIdx} className="pt-5 first:pt-4 flex flex-col md:flex-row gap-4 md:items-start">
                            {/* Left Meta info */}
                            <div className="md:w-1/4 shrink-0">
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono text-emerald-700 bg-emerald-50 border border-emerald-100">
                                <Clock className="w-3 h-3" />
                                {activity.time}
                              </span>
                              {activity.costEstimate && (
                                <p className="text-xs text-slate-400 font-medium font-mono mt-2">
                                  Est: <span className="text-slate-700 font-bold font-sans">{activity.costEstimate}</span>
                                </p>
                              )}
                            </div>

                            {/* Right Description */}
                            <div className="flex-1 space-y-1.5">
                              <h5 className="text-base font-bold text-slate-800 font-display flex items-center gap-1.5 flex-wrap">
                                {activity.location && (
                                  <span className="inline-flex items-center text-xs text-sky-600 bg-sky-50 border border-sky-100 font-semibold px-2 py-0.5 rounded-md">
                                    <MapPin className="w-3 h-3 mr-0.5" />
                                    {activity.location}
                                  </span>
                                )}
                                {activity.activityTitle}
                              </h5>
                              <p className="text-sm text-slate-600 font-light leading-relaxed">
                                {activity.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* PANEL: Recommended Attractions */}
        {activeTab === "attractions" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-black font-display text-slate-800 flex items-center gap-2 mb-1">
                <Camera className="w-5 h-5 text-sky-500" />
                Must-Visit Attraction Spotlights
              </h3>
              <p className="text-sm text-slate-400 font-light">
                Our AI recommends these iconic locations with verified timings and estimates.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {attractions.map((spot, idx) => (
                <div key={idx} className="relative overflow-hidden border border-slate-100 bg-slate-50/30 rounded-2xl p-5 hover:border-sky-200 transition-all duration-200">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="text-base font-bold text-slate-800 font-display flex items-center gap-1.5">
                      <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-sky-100 text-sky-700 font-mono text-xs font-black shrink-0">
                        {idx + 1}
                      </span>
                      {spot.name}
                    </h4>
                  </div>
                  
                  <p className="text-xs text-slate-500 leading-relaxed font-light mb-4">
                    {spot.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-200/50">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Best Time</p>
                      <p className="text-xs font-semibold text-slate-700 mt-0.5">{spot.bestTimeToVisit}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Entry Fee</p>
                      <p className="text-xs font-semibold text-emerald-700 font-mono mt-0.5">{spot.entryFee}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PANEL: Local Food Suggestions */}
        {activeTab === "food" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-black font-display text-slate-800 flex items-center gap-2 mb-1">
                <Utensils className="w-5 h-5 text-rose-500" />
                Culinary Highlights & Authentic Spots
              </h3>
              <p className="text-sm text-slate-400 font-light">
                Do not leave without trying these iconic culinary masterworks, along with recommended local food joints.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {foodSuggestions.map((dish, idx) => (
                <div key={idx} className="border border-slate-100 bg-white rounded-2xl p-5 hover:border-rose-200 hover:shadow-sm transition-all duration-200">
                  <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
                    <h4 className="text-base font-bold text-slate-800 font-display flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                      {dish.dishName}
                    </h4>
                    <span className="text-[10px] font-bold font-mono tracking-wider uppercase text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-md">
                      {dish.type}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed font-light mb-4">
                    {dish.description}
                  </p>

                  <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-3">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Recommended authentic spots</p>
                    <p className="text-xs font-semibold text-slate-700">{dish.recommendedPlaces}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PANEL: Tips & Packing Suggestions */}
        {activeTab === "tips_packing" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Travel Tips Column */}
            <div className="space-y-4">
              <h3 className="text-lg font-black font-display text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                Smart Traveler Tips
              </h3>

              <ul className="space-y-3.5">
                {travelTips.map((tip, idx) => (
                  <li key={idx} className="flex gap-3">
                    <span className="flex items-center justify-center w-5 h-5 rounded bg-amber-50 text-amber-700 border border-amber-100 text-xs font-bold font-mono shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed font-light">
                      {tip}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Packing List Column */}
            <div className="space-y-4">
              <h3 className="text-lg font-black font-display text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
                <Backpack className="w-5 h-5 text-emerald-500" />
                Tailored Packing Checklist
              </h3>

              <div className="space-y-4">
                {packingSuggestions.map((cat, idx) => (
                  <div key={idx} className="bg-slate-50/50 border border-slate-200/50 rounded-2xl p-4">
                    <h4 className="text-xs font-bold font-mono text-slate-500 uppercase tracking-wider mb-2.5">
                      {cat.category}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {cat.items.map((item, itemIdx) => (
                        <span 
                          key={itemIdx} 
                          className="text-xs bg-white text-slate-700 font-medium px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-xs"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
