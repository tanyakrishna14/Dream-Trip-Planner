import React, { useState, useEffect } from "react";
import { Compass, Plane, Map, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const LOADING_STEPS = [
  "Mapping optimal geographic routes...",
  "Sourcing authentic local street food spots...",
  "Calculating ticket prices and entry fees...",
  "Tailoring itinerary to your travel style and interests...",
  "Optimizing budget allocations for the best value...",
  "Generating helpful safety, culture, and packing guides...",
];

const TRAVEL_QUOTES = [
  "\"Travel is the only thing you buy that makes you richer.\"",
  "\"To travel is to live.\" — Hans Christian Andersen",
  "\"The world is a book and those who do not travel read only one page.\" — Saint Augustine",
  "\"Jobs fill your pockets, but adventures fill your soul.\"",
  "\"Not all those who wander are lost.\" — J.R.R. Tolkien"
];

export default function LoadingScreen() {
  const [stepIndex, setStepIndex] = useState(0);
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % LOADING_STEPS.length);
    }, 3000);

    const quoteInterval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % TRAVEL_QUOTES.length);
    }, 5500);

    return () => {
      clearInterval(stepInterval);
      clearInterval(quoteInterval);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center bg-white rounded-3xl border border-slate-100/80 shadow-sm" id="loading-screen">
      {/* Animated Airplane Circle */}
      <div className="relative w-28 h-28 mb-8 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border-2 border-dashed border-emerald-200 rounded-full"
        />
        
        <motion.div
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20"
        >
          <Plane className="w-8 h-8 rotate-45" />
        </motion.div>

        {/* Pulsing Outer rings */}
        <div className="absolute -inset-4 border border-emerald-500/10 rounded-full animate-ping pointer-events-none" style={{ animationDuration: '3s' }} />
      </div>

      {/* Rotating Status Step */}
      <div className="h-8 mb-4">
        <AnimatePresence mode="wait">
          <motion.p
            key={stepIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-base font-semibold text-emerald-700 flex items-center justify-center gap-2"
          >
            <Compass className="w-4 h-4 animate-spin text-emerald-500" />
            {LOADING_STEPS[stepIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Progress Line */}
      <div className="w-full max-w-md bg-slate-100 h-1.5 rounded-full overflow-hidden mb-8">
        <motion.div 
          initial={{ width: "10%" }}
          animate={{ width: "95%" }}
          transition={{ duration: 15, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
        />
      </div>

      {/* Inspirational Quotes */}
      <div className="max-w-md border-t border-slate-100 pt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={quoteIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-1.5"
          >
            <p className="text-sm italic text-slate-500 font-serif leading-relaxed">
              {TRAVEL_QUOTES[quoteIndex]}
            </p>
            <p className="text-[10px] font-bold font-mono uppercase tracking-widest text-slate-400">
              TRAVEL WISDOM
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
