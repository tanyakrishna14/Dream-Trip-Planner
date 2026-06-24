import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn("WARNING: GEMINI_API_KEY is not defined in the environment variables.");
}

const ai = new GoogleGenAI({
  apiKey: apiKey || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// API endpoint for itinerary generation
app.post("/api/generate-plan", async (req: express.Request, res: express.Response) => {
  try {
    const { destination, startPoint, budget, days, travelStyle, interests } = req.body;

    if (!destination || !budget || !days || !interests) {
      res.status(400).json({ error: "Missing required fields: destination, budget, days, or interests." });
      return;
    }

    const startFrom = startPoint ? startPoint : "New Delhi";
    const selectedStyle = travelStyle || "Balanced";

    const prompt = `Create a realistic, practical, and highly detailed dream trip itinerary for the following travel profile:
- Starting Location (Start Point): ${startFrom}
- Destination: ${destination}
- Budget: ₹${budget} (Indian Rupees)
- Duration: ${days} Days
- Travel Style: ${selectedStyle} (Balanced, customized based on destination)
- Interests: ${Array.isArray(interests) ? interests.join(", ") : interests}

Please generate a day-by-day plan departing from ${startFrom} to ${destination}, local food recommendations, travel tips, attraction recommendations, and packing lists custom-tailored to their interests. Ensure that the total estimated budget breakdown realistically fits within ₹${budget} (accounting for Indian Rupees and local pricing). Include local transport options or general travel choices from ${startFrom} to ${destination} in the day-by-day itinerary if relevant.`;

    // Try multiple models and retry on failure to handle 503 errors and transient limits
    const modelsToTry = ["gemini-3.5-flash", "gemini-flash-latest"];
    let lastError: any = null;
    let response: any = null;

    for (const model of modelsToTry) {
      let retries = 3;
      let delay = 1000;

      while (retries > 0) {
        try {
          console.log(`[TripPlanner] Querying GenAI model=${model}, retries_remaining=${retries}`);
          response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
              systemInstruction: "You are an expert travel planner and native guide. Your job is to draft realistic, highly detailed, and practical itineraries. All pricing and allocations should be in Indian Rupees (₹). Make the food and spot recommendations very specific and highly authentic to the destination.",
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  tripSummary: {
                    type: Type.OBJECT,
                    properties: {
                      destination: { type: Type.STRING },
                      days: { type: Type.INTEGER },
                      budget: { type: Type.STRING },
                      travelStyle: { type: Type.STRING },
                      interests: { type: Type.ARRAY, items: { type: Type.STRING } },
                      shortTagline: { type: Type.STRING }
                    },
                    required: ["destination", "days", "budget", "travelStyle", "interests", "shortTagline"]
                  },
                  budgetBreakdown: {
                    type: Type.OBJECT,
                    properties: {
                      accommodation: { type: Type.STRING, description: "Estimated cost or percentage for stays" },
                      transport: { type: Type.STRING, description: "Estimated local transport cost" },
                      foodAndDining: { type: Type.STRING, description: "Estimated meal cost" },
                      activitiesAndSightseeing: { type: Type.STRING, description: "Estimated entry tickets and tours" },
                      miscellaneous: { type: Type.STRING, description: "Emergency fund or shopping" },
                      totalAllocated: { type: Type.STRING, description: "Total of the above, should stay within ₹" + budget }
                    },
                    required: ["accommodation", "transport", "foodAndDining", "activitiesAndSightseeing", "miscellaneous", "totalAllocated"]
                  },
                  itinerary: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        dayNumber: { type: Type.INTEGER },
                        dayTitle: { type: Type.STRING },
                        activities: {
                          type: Type.ARRAY,
                          items: {
                            type: Type.OBJECT,
                            properties: {
                              time: { type: Type.STRING, description: "e.g. Morning, Afternoon, Evening" },
                              activityTitle: { type: Type.STRING },
                              description: { type: Type.STRING, description: "Interesting details, tips, and logistics" },
                              costEstimate: { type: Type.STRING, description: "Estimated cost in ₹ or 'Free'" },
                              location: { type: Type.STRING, description: "Name of the place" }
                            },
                            required: ["time", "activityTitle", "description", "costEstimate"]
                          }
                        }
                      },
                      required: ["dayNumber", "dayTitle", "activities"]
                    }
                  },
                  attractions: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        description: { type: Type.STRING },
                        bestTimeToVisit: { type: Type.STRING },
                        entryFee: { type: Type.STRING }
                      },
                      required: ["name", "description", "bestTimeToVisit", "entryFee"]
                    }
                  },
                  foodSuggestions: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        dishName: { type: Type.STRING },
                        description: { type: Type.STRING },
                        type: { type: Type.STRING, description: "e.g. Street Food, Dessert, Main Course" },
                        recommendedPlaces: { type: Type.STRING, description: "Highly specific authentic spots or areas to eat this" }
                      },
                      required: ["dishName", "description", "type", "recommendedPlaces"]
                    }
                  },
                  travelTips: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  packingSuggestions: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        category: { type: Type.STRING, description: "e.g. Clothing, Essentials, Tech, Pharma" },
                        items: { type: Type.ARRAY, items: { type: Type.STRING } }
                      },
                      required: ["category", "items"]
                    }
                  }
                },
                required: ["tripSummary", "budgetBreakdown", "itinerary", "attractions", "foodSuggestions", "travelTips", "packingSuggestions"]
              }
            }
          });

          // If successful, break outer loop
          if (response) break;
        } catch (error: any) {
          lastError = error;
          console.error(`[TripPlanner] Attempt failed for model=${model}, error=${error.message || error}`);
          retries--;
          if (retries > 0) {
            await new Promise((resolve) => setTimeout(resolve, delay));
            delay *= 2;
          }
        }
      }

      if (response) break;
    }

    if (!response) {
      throw lastError || new Error("Failed to generate content from any available Gemini models after retries.");
    }

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No response text received from Gemini.");
    }

    res.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error("Error generating trip plan:", error);
    res.status(500).json({ error: error.message || "Failed to generate travel plan. Please check your inputs or try again." });
  }
});

async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Dream Trip Planner server running at http://0.0.0.0:${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
});
