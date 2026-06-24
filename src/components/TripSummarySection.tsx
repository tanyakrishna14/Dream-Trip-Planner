import React from "react";
import { 
  Calendar, 
  IndianRupee, 
  Sparkles, 
  User, 
  Heart, 
  Copy, 
  Download, 
  RefreshCw,
  Check,
  MapPin
} from "lucide-react";
import { TravelPlan } from "../types";

interface TripSummarySectionProps {
  plan: TravelPlan;
  onRegenerate: () => void;
  onCopy: () => void;
  onDownload: () => void;
  copied: boolean;
}

export default function TripSummarySection({ 
  plan, 
  onRegenerate, 
  onCopy, 
  onDownload, 
  copied 
}: TripSummarySectionProps) {
  const { tripSummary, budgetBreakdown } = plan;

  // Render a visual tag for each interest
  const renderInterestBadge = (interest: string) => {
    return (
      <span 
        key={interest} 
        className="text-xs bg-slate-100 text-slate-700 font-semibold px-2.5 py-1 rounded-full border border-slate-200/50"
      >
        {interest}
      </span>
    );
  };

  // Helper to extract numeric values or just display the raw text for the budget breakdown
  const budgetItems = [
    { label: "Accommodation", value: budgetBreakdown.accommodation, color: "bg-amber-500" },
    { label: "Transport", value: budgetBreakdown.transport, color: "bg-blue-500" },
    { label: "Food & Dining", value: budgetBreakdown.foodAndDining, color: "bg-red-500" },
    { label: "Activities & Sightseeing", value: budgetBreakdown.activitiesAndSightseeing, color: "bg-emerald-500" },
    { label: "Miscellaneous", value: budgetBreakdown.miscellaneous, color: "bg-purple-500" },
  ];

  return (
    <div className="space-y-6" id="trip-summary-section">
      {/* Dynamic Destination Banner */}
      <div className="relative overflow-hidden bg-slate-900 rounded-3xl p-6 md:p-8 text-white border border-slate-800 shadow-md">
        {/* Subtle abstract backdrop */}
        <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-emerald-500/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold font-mono tracking-wider text-emerald-400 uppercase">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              Custom Curated Dream Plan
            </div>
            <h2 className="text-3xl font-black font-display tracking-tight text-white flex items-center gap-2">
              <MapPin className="w-7 h-7 text-emerald-500 shrink-0" />
              {tripSummary.destination}
            </h2>
            <p className="text-sm text-slate-300 font-light max-w-xl italic">
              &ldquo;{tripSummary.shortTagline}&rdquo;
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-4 md:min-w-[320px]">
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Duration</p>
              <p className="text-base font-bold text-white flex items-center gap-1 mt-0.5">
                <Calendar className="w-4 h-4 text-emerald-400" />
                {tripSummary.days} Days
              </p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Travel Style</p>
              <p className="text-base font-bold text-white flex items-center gap-1 mt-0.5">
                <User className="w-4 h-4 text-teal-400" />
                {tripSummary.travelStyle}
              </p>
            </div>
            <div className="col-span-2 sm:col-span-1 border-t sm:border-t-0 sm:border-l border-slate-800 pt-2 sm:pt-0 sm:pl-4">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Budget</p>
              <p className="text-base font-black text-amber-300 flex items-center gap-0.5 mt-0.5">
                <IndianRupee className="w-4 h-4" />
                {tripSummary.budget}
              </p>
            </div>
          </div>
        </div>

        {/* Interests Row */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono mr-1">
            Focus:
          </span>
          {tripSummary.interests.map(renderInterestBadge)}
        </div>
      </div>

      {/* Action Toolbar & Budget Breakdown Block */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Budget Allocation Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-mono flex items-center gap-2 mb-4">
              <IndianRupee className="w-4 h-4 text-emerald-500" />
              Estimated Budget Allocation
            </h3>
            
            <div className="space-y-3.5">
              {budgetItems.map((item) => (
                <div key={item.label} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-600">{item.label}</span>
                    <span className="text-slate-900 font-bold font-mono">{item.value}</span>
                  </div>
                  {/* Visual Bar */}
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${item.color} rounded-full`} 
                      style={{ width: "85%" }} // Visual default representation or full width
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400">Total Allocated Fund:</span>
            <span className="text-sm font-black text-emerald-700 bg-emerald-50 px-3 py-1 border border-emerald-100 rounded-xl">
              {budgetBreakdown.totalAllocated}
            </span>
          </div>
        </div>

        {/* Action Controls Card */}
        <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200/60 flex flex-col justify-between gap-4">
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-mono">
              Itinerary Controls
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Love your trip plan? You can instantly copy it to your clipboard with clean markdown formatting or download it as a local text file for offline reading.
            </p>
          </div>

          <div className="space-y-2.5">
            {/* Copy Button */}
            <button
              onClick={onCopy}
              className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 active:bg-slate-100 text-slate-700 shadow-sm cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500" />
                  Copied to Clipboard!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-500" />
                  Copy Full Itinerary
                </>
              )}
            </button>

            {/* Download Button */}
            <button
              onClick={onDownload}
              className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-sm cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Download as Text File
            </button>

            {/* Regenerate Button */}
            <button
              onClick={onRegenerate}
              className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl font-semibold text-xs transition-all duration-200 border border-dashed border-slate-300 hover:border-slate-400 hover:bg-slate-100 text-slate-500 cursor-pointer uppercase tracking-wider font-mono"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Regenerate Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
