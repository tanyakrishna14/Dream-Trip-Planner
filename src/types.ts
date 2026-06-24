export interface TripSummary {
  destination: string;
  days: number;
  budget: string;
  travelStyle: string;
  interests: string[];
  shortTagline: string;
}

export interface BudgetBreakdown {
  accommodation: string;
  transport: string;
  foodAndDining: string;
  activitiesAndSightseeing: string;
  miscellaneous: string;
  totalAllocated: string;
}

export interface Activity {
  time: string;
  activityTitle: string;
  description: string;
  costEstimate: string;
  location?: string;
}

export interface DayItinerary {
  dayNumber: number;
  dayTitle: string;
  activities: Activity[];
}

export interface Attraction {
  name: string;
  description: string;
  bestTimeToVisit: string;
  entryFee: string;
}

export interface FoodSuggestion {
  dishName: string;
  description: string;
  type: string;
  recommendedPlaces: string;
}

export interface PackingCategory {
  category: string;
  items: string[];
}

export interface TravelPlan {
  tripSummary: TripSummary;
  budgetBreakdown: BudgetBreakdown;
  itinerary: DayItinerary[];
  attractions: Attraction[];
  foodSuggestions: FoodSuggestion[];
  travelTips: string[];
  packingSuggestions: PackingCategory[];
}
