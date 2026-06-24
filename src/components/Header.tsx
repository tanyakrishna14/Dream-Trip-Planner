import React from "react";
import { Compass, Globe, Sparkles } from "lucide-react";

export default function Header() {
  return (
    <header className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-lg rounded-3xl p-6 md:p-8 mb-8" id="app-header">
      {/* Decorative background elements */}
      <div className="absolute right-0 top-0 -mt-6 -mr-6 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />
      <div className="absolute left-1/3 bottom-0 -mb-10 w-48 h-48 rounded-full bg-emerald-500/20 blur-2xl pointer-events-none" />
      
      <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4 z-10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/15 backdrop-blur-md rounded-2xl border border-white/20 shadow-inner flex items-center justify-center">
            <Compass className="w-8 h-8 text-amber-300 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold font-mono tracking-widest text-amber-300 uppercase bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                AI Powered
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black font-display tracking-tight mt-1">
              Dream Trip Planner
            </h1>
            <p className="text-sm md:text-base text-emerald-100 font-light mt-1 max-w-xl">
              Tell us your vibe, and our advanced AI will craft a personalized day-wise itinerary, budget allocation, local food suggestions, and curated local tips.
            </p>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-2 bg-black/10 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-3">
          <Globe className="w-5 h-5 text-cyan-200 animate-pulse" />
          <div className="text-left">
            <p className="text-xs text-cyan-200 font-mono">CURRENT STATION</p>
            <p className="text-sm font-semibold">World Explorer</p>
          </div>
        </div>
      </div>
    </header>
  );
}
