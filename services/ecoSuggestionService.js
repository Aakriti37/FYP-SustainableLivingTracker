// services/ecoSuggestionService.js
// Uses Groq API (llama-3.3-70b) — completely free, works in Nepal

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

/**
 * Builds the prompt string from the user's data
 */
const buildPrompt = (habits, goals, carbonLogs, activityLogs) => {
  const avgCO2 =
    carbonLogs.length
      ? (carbonLogs.reduce((sum, l) => sum + l.totalCO2, 0) / carbonLogs.length).toFixed(2)
      : "unknown";

  const latestLog = carbonLogs[0] || null;

  const activeHabits =
    habits
      .filter((h) => h.isActive)
      .map((h) => `${h.name} (streak: ${h.streak}, frequency: ${h.frequency})`)
      .join(", ") || "None";

  const inProgressGoals =
    goals
      .filter((g) => g.status === "in-progress")
      .map((g) => g.title)
      .join(", ") || "None";

  const totalPointsToday = activityLogs.reduce((sum, a) => sum + a.pointsEarned, 0);

  return `
    You are an expert eco-sustainability advisor. Analyze the user's data and return EXACTLY 4 short, personalized eco suggestions.

    USER DATA:
    - Active habits: ${activeHabits}
    - In-progress goals: ${inProgressGoals}
    - Average daily CO2 (last 30 days): ${avgCO2} kg CO2e
    - Latest carbon log:
        Private transport: ${latestLog?.transport ?? 0} km
        Public transport: ${latestLog?.publicTransport ?? 0} km
        Energy used: ${latestLog?.energy ?? 0} kWh
        Cooking fuel: ${latestLog?.cookingFuel ?? "Unknown"}
        Diet type: ${latestLog?.diet ?? "Unknown"}
        Total CO2: ${latestLog?.totalCO2 ?? 0} kg
    - Eco-points earned today: ${totalPointsToday}

    Return ONLY a valid JSON array with exactly 4 objects. No markdown, no backticks, no preamble, no extra text.
    Each object must have these exact fields:
    - "id": number (1 to 4)
    - "icon": a single relevant emoji as a unicode character (e.g. a leaf, bicycle, lightning bolt etc. relevant to the suggestion)
    - "title": short title, max 6 words
    - "description": one actionable sentence, max 20 words
    - "impact": exactly one of "High", "Medium", or "Low"
    - "category": exactly one of "Transport", "Energy", "Diet", "Lifestyle"

    Example format:
    [{"id":1,"icon":"<relevant emoji>","title":"Bike instead of driving","description":"Replace one short car trip with cycling to cut 2.5 kg CO2 today.","impact":"High","category":"Transport"}]
    `.trim();

};


/**
 * Calls Groq API using built-in fetch (Node 18+)
 * and returns parsed suggestions array
 */
const callGroqAPI = async (prompt) => {
  const response = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 600,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Groq API error ${response.status}: ${errorBody}`);
  }

  const data = await response.json();
  const raw = data?.choices?.[0]?.message?.content ?? "";
  const cleaned = raw.replace(/```json|```/g, "").trim();

  const suggestions = JSON.parse(cleaned);

  if (!Array.isArray(suggestions) || suggestions.length === 0) {
    throw new Error("Invalid response format from Groq");
  }

  return suggestions;
};

module.exports = { buildPrompt, callGroqAPI };