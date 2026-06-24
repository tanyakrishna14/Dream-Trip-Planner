import React, { useState } from "react";
import Header from "./components/Header";
import TripForm from "./components/TripForm";
import LoadingScreen from "./components/LoadingScreen";
import TripSummarySection from "./components/TripSummarySection";
import ItineraryDays from "./components/ItineraryDays";
import { TravelPlan } from "./types";
import { Compass, Sparkles, PlaneTakeoff, Info, AlertCircle } from "lucide-react";

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<TravelPlan | null>(null);
  const [copied, setCopied] = useState(false);
  const [lastSubmittedData, setLastSubmittedData] = useState<{
    destination: string;
    startPoint: string;
    budget: number;
    days: number;
    interests: string[];
  } | null>(null);

  const generateItineraryText = (currentPlan: TravelPlan): string => {
    const summary = currentPlan.tripSummary;
    const budget = currentPlan.budgetBreakdown;
    
    let text = `==================================================\n`;
    text += `DREAM TRIP PLAN: ${summary.destination.toUpperCase()}\n`;
    text += `"${summary.shortTagline}"\n`;
    text += `==================================================\n\n`;
    text += `TRIP SUMMARY:\n`;
    text += `- Duration: ${summary.days} Days\n`;
    text += `- Travel Style: ${summary.travelStyle}\n`;
    text += `- Total Budget: ${summary.budget}\n`;
    text += `- Focus Interests: ${summary.interests.join(", ")}\n\n`;

    text += `BUDGET BREAKDOWN:\n`;
    text += `- Accommodation: ${budget.accommodation}\n`;
    text += `- Transport: ${budget.transport}\n`;
    text += `- Food & Dining: ${budget.foodAndDining}\n`;
    text += `- Activities & Sightseeing: ${budget.activitiesAndSightseeing}\n`;
    text += `- Miscellaneous: ${budget.miscellaneous}\n`;
    text += `- Total Allocated: ${budget.totalAllocated}\n\n`;

    text += `--------------------------------------------------\n`;
    text += `DAY-BY-DAY ITINERARY:\n`;
    text += `--------------------------------------------------\n`;
    currentPlan.itinerary.forEach((day) => {
      text += `\nDAY ${day.dayNumber}: ${day.dayTitle}\n`;
      day.activities.forEach((activity) => {
        text += `  [${activity.time}] ${activity.activityTitle}\n`;
        if (activity.location) {
          text += `  Location: ${activity.location}\n`;
        }
        text += `  Cost Est: ${activity.costEstimate}\n`;
        text += `  Description: ${activity.description}\n\n`;
      });
    });

    text += `--------------------------------------------------\n`;
    text += `MUST-VISIT ATTRACTIONS:\n`;
    text += `--------------------------------------------------\n`;
    currentPlan.attractions.forEach((spot, idx) => {
      text += `${idx + 1}. ${spot.name}\n`;
      text += `   - Best time to visit: ${spot.bestTimeToVisit}\n`;
      text += `   - Entry Fee: ${spot.entryFee}\n`;
      text += `   - Info: ${spot.description}\n\n`;
    });

    text += `--------------------------------------------------\n`;
    text += `LOCAL FOOD RECOMMENDATIONS:\n`;
    text += `--------------------------------------------------\n`;
    currentPlan.foodSuggestions.forEach((dish, idx) => {
      text += `${idx + 1}. ${dish.dishName} (${dish.type})\n`;
      text += `   - Authentic Places: ${dish.recommendedPlaces}\n`;
      text += `   - Info: ${dish.description}\n\n`;
    });

    text += `--------------------------------------------------\n`;
    text += `SMART TRAVEL TIPS:\n`;
    text += `--------------------------------------------------\n`;
    currentPlan.travelTips.forEach((tip, idx) => {
      text += `${idx + 1}. ${tip}\n`;
    });
    text += `\n`;

    text += `--------------------------------------------------\n`;
    text += `TAILORED PACKING LIST:\n`;
    text += `--------------------------------------------------\n`;
    currentPlan.packingSuggestions.forEach((cat) => {
      text += `${cat.category}:\n`;
      cat.items.forEach((item) => {
        text += `  [ ] ${item}\n`;
      });
      text += `\n`;
    });

    text += `==================================================\n`;
    text += `Generated with Dream Trip Planner AI\n`;
    text += `==================================================\n`;

    return text;
  };

  const handleFormSubmit = async (formData: {
    destination: string;
    startPoint: string;
    budget: number;
    days: number;
    interests: string[];
  }) => {
    setIsLoading(true);
    setError(null);
    setLastSubmittedData(formData);

    try {
      const response = await fetch("/api/generate-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          travelStyle: "Balanced"
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${response.status}`);
      }

      const data: TravelPlan = await response.json();
      setPlan(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to generate your trip plan. Please verify your connection or try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = () => {
    if (lastSubmittedData) {
      handleFormSubmit(lastSubmittedData);
    }
  };

  const handleCopy = () => {
    if (!plan) return;
    const formattedText = generateItineraryText(plan);
    navigator.clipboard.writeText(formattedText)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  const handleDownload = () => {
    if (!plan) return;
    const formattedText = generateItineraryText(plan);
    const blob = new Blob([formattedText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `itinerary-${plan.tripSummary.destination.toLowerCase().replace(/\s+/g, "-")}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 px-4 md:px-8" id="dream-trip-planner-app">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Main Header */}
        <Header />

        {/* Error Alert Box */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div className="text-sm">
              <span className="font-bold">Error Crafting Trip:</span> {error}
              <button 
                onClick={handleRegenerate}
                className="block mt-2 text-xs font-bold font-mono text-red-700 underline hover:text-red-800 cursor-pointer"
              >
                Retry Generation
              </button>
            </div>
          </div>
        )}

        {/* Main Application Interface */}
        <div className="grid grid-cols-1 gap-8">
          {/* Top Form section */}
          <TripForm onSubmit={handleFormSubmit} isLoading={isLoading} />

          {/* Result Render Area */}
          {isLoading && <LoadingScreen />}

          {!isLoading && plan && (
            <div className="space-y-8 animate-fade-in">
              {/* Trip Summary Card & Quick Control Bar */}
              <TripSummarySection 
                plan={plan}
                onRegenerate={handleRegenerate}
                onCopy={handleCopy}
                onDownload={handleDownload}
                copied={copied}
              />

              {/* Day-wise Details, Attractions, Food Recommendations, Tips and Packing suggestions */}
              <ItineraryDays plan={plan} />
            </div>
          )}

          {/* Placeholder when no plan generated yet */}
          {!isLoading && !plan && (
            <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200 min-h-[250px]">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <PlaneTakeoff className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="text-lg font-bold font-display text-slate-800 mb-1">
                Your Adventure Awaits
              </h3>
              <p className="text-xs text-slate-400 font-light max-w-sm leading-relaxed">
                Fill out the travel destination, select your budget & duration, choose what you enjoy, and let the planner design an unparalleled travel strategy for you.
              </p>
            </div>
          )}
        </div>

        {/* Footer info line */}
        <footer className="text-center text-xs text-slate-400/80 font-medium py-6 border-t border-slate-200/50 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p>© 2026 Dream Trip Planner. Live Local Guides Powered by Gemini.</p>
          <div className="flex items-center gap-2 text-[11px] bg-slate-100 border border-slate-200/50 px-3 py-1 rounded-full text-slate-500">
            <Info className="w-3.5 h-3.5" />
            <span>Budgets dynamically scaled to real-time regional rates.</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
