// controllers/ecoSuggestionController.js
// Flow: User data → Flask ML (emission level) → Groq (dynamic suggestions)

const Habit         = require("../models/Habit");
const Goal          = require("../models/Goal");
const CarbonLog     = require("../models/Carbon");
const ActivityLog   = require("../models/ActivityLog");
const UserLifestyle = require("../models/UserLifestyle");

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:5001";
const GROQ_API_KEY   = process.env.GROQ_API_KEY;
const GROQ_URL       = "https://api.groq.com/openai/v1/chat/completions";

const buildMLInput = (lifestyle, latestCarbonLog) => {
    const heatingMap = { LPG: "natural gas", Wood: "wood", Electricity: "electricity", Biogas: "natural gas", None: "electricity" };
    const dietMap    = { vegan: "vegan", vegetarian: "vegetarian", balanced: "omnivore", "meat-heavy": "omnivore" };

    return {
        "Body Type":                     lifestyle?.bodyType             || "normal",
        "Sex":                           lifestyle?.sex                  || "male",
        "Diet":                          dietMap[latestCarbonLog?.diet]  || "omnivore",
        "How Often Shower":              lifestyle?.showerFrequency      || "daily",
        "Heating Energy Source":         heatingMap[latestCarbonLog?.cookingFuel] || "natural gas",
        "Transport":                     latestCarbonLog?.transport > 0 ? "private" : "walk/bicycle",
        "Vehicle Type":                  lifestyle?.vehicleType          || "none",
        "Social Activity":               lifestyle?.socialActivity       || "sometimes",
        "Monthly Grocery Bill":          lifestyle?.monthlyGroceryBill   || 200,
        "Frequency of Traveling by Air": lifestyle?.airTravelFrequency   || "rarely",
        "Vehicle Monthly Distance Km":   latestCarbonLog?.transport      || 0,
        "Waste Bag Size":                lifestyle?.wasteBagSize         || "medium",
        "Waste Bag Weekly Count":        lifestyle?.wasteBagWeeklyCount  || 3,
        "How Long TV PC Daily Hour":     lifestyle?.tvPcHoursDaily       || 4,
        "How Many New Clothes Monthly":  lifestyle?.newClothesMonthly    || 3,
        "How Long Internet Daily Hour":  lifestyle?.internetHoursDaily   || 5,
        "Energy efficiency":             lifestyle?.energyEfficiency     || "Sometimes",
        "Recycling":                     lifestyle?.recycling            || ["Paper", "Metal"],
        "Cooking_With":                  lifestyle?.cookingWith          || ["Stove"],
    };
};

const generateSuggestionsWithGroq = async (emissionLevel, confidence, userContext) => {
    const prompt = `
You are an expert eco-sustainability advisor. Based on the user data below, generate EXACTLY 4 short personalised eco suggestions.

PREDICTED EMISSION LEVEL: ${emissionLevel} (model confidence: ${confidence}%)

USER DATA:
- Diet: ${userContext.diet}
- Private transport: ${userContext.transport} km/month
- Public transport: ${userContext.publicTransport} km/month
- Energy used: ${userContext.energy} kWh
- Cooking fuel: ${userContext.cookingFuel}
- Air travel: ${userContext.airTravelFrequency}
- Vehicle type: ${userContext.vehicleType}
- Energy efficiency at home: ${userContext.energyEfficiency}
- Recycling: ${userContext.recycling}
- New clothes per month: ${userContext.newClothesMonthly}
- Waste bags per week: ${userContext.wasteBagWeeklyCount}
- Active habits: ${userContext.activeHabits}
- Current goals: ${userContext.activeGoals}

RULES:
- High emission level → focus on High impact suggestions
- Medium emission level → mix High and Medium impact
- Low emission level → Low/Medium nudges to maintain habits
- Each suggestion must target a DIFFERENT category
- Keep suggestions specific to user data above

Return ONLY a valid JSON array with exactly 4 objects. No markdown, no backticks, no extra text.
Each object: "id" (1-4), "icon" (single relevant emoji), "title" (max 6 words), "description" (max 20 words), "impact" ("High"/"Medium"/"Low"), "category" ("Transport"/"Energy"/"Diet"/"Lifestyle")
`.trim();

    const response = await fetch(GROQ_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${GROQ_API_KEY}` },
        body: JSON.stringify({ model: "llama-3.3-70b-versatile", messages: [{ role: "user", content: prompt }], temperature: 0.7, max_tokens: 600 }),
    });

    if (!response.ok) throw new Error(`Groq API error: ${response.status}`);

    const data     = await response.json();
    const raw      = data?.choices?.[0]?.message?.content ?? "";
    const cleaned  = raw.replace(/```json|```/g, "").trim();
    const suggestions = JSON.parse(cleaned);

    if (!Array.isArray(suggestions) || suggestions.length === 0) throw new Error("Invalid response from Groq");
    return suggestions;
};

exports.generateSuggestions = async (req, res) => {
    try {
        const userId = req.user.id;

        const [lifestyle, carbonLogs, habits, goals] = await Promise.all([
            UserLifestyle.findOne({ userId }).lean(),
            CarbonLog.find({ userId }).sort({ date: -1 }).limit(1).lean(),
            Habit.find({ userId, isActive: true }).lean(),
            Goal.find({ userId, status: "in-progress" }).lean(),
        ]);

        const latestCarbonLog = carbonLogs[0] || null;

        // Step 1 — XGBoost predicts emission level
        const mlInput    = buildMLInput(lifestyle, latestCarbonLog);
        const mlResponse = await fetch(`${ML_SERVICE_URL}/predict`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(mlInput),
        });

        if (!mlResponse.ok) throw new Error(`ML service error: ${mlResponse.status}`);
        const mlData = await mlResponse.json();
        if (!mlData.success) throw new Error(mlData.message || "ML service failed");

        const { emission_level: emissionLevel, confidence } = mlData;
        console.log(`ML Prediction: ${emissionLevel} (${confidence}% confidence)`);

        // Step 2 — Groq generates dynamic suggestions based on prediction
        const userContext = {
            diet:                latestCarbonLog?.diet            || "unknown",
            transport:           latestCarbonLog?.transport       || 0,
            publicTransport:     latestCarbonLog?.publicTransport || 0,
            energy:              latestCarbonLog?.energy          || 0,
            cookingFuel:         latestCarbonLog?.cookingFuel     || "unknown",
            airTravelFrequency:  lifestyle?.airTravelFrequency    || "rarely",
            vehicleType:         lifestyle?.vehicleType           || "none",
            energyEfficiency:    lifestyle?.energyEfficiency      || "Sometimes",
            recycling:           lifestyle?.recycling?.join(", ") || "none",
            newClothesMonthly:   lifestyle?.newClothesMonthly     || 0,
            wasteBagWeeklyCount: lifestyle?.wasteBagWeeklyCount   || 0,
            activeHabits:        habits.map(h => h.name).join(", ") || "none",
            activeGoals:         goals.map(g => g.title).join(", ")  || "none",
        };

        const suggestions = await generateSuggestionsWithGroq(emissionLevel, confidence, userContext);

        res.status(200).json({ success: true, emission_level: emissionLevel, confidence, count: suggestions.length, suggestions });

    } catch (error) {
        console.error("Eco suggestion error:", error.message);
        res.status(500).json({ success: false, message: "Server error while generating suggestions.", error: error.message });
    }
};

exports.getLifestyle = async (req, res) => {
    try {
        const lifestyle = await UserLifestyle.findOne({ userId: req.user.id });
        res.json({ success: true, hasLifestyle: !!lifestyle, lifestyle: lifestyle || null });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

exports.saveLifestyle = async (req, res) => {
    try {
        const userId    = req.user.id;
        const lifestyle = await UserLifestyle.findOneAndUpdate(
            { userId }, { userId, ...req.body }, { upsert: true, new: true }
        );
        res.json({ success: true, lifestyle });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

exports.chat = async (req, res) => {
    try {
        const userId = req.user.id;
        const { message, conversationHistory = [] } = req.body;
        if (!message) return res.status(400).json({ success: false, message: "Message is required" });

        const [lifestyle, carbonLogs, habits, goals] = await Promise.all([
            UserLifestyle.findOne({ userId }).lean(),
            CarbonLog.find({ userId }).sort({ date: -1 }).limit(3).lean(),
            Habit.find({ userId, isActive: true }).lean(),
            Goal.find({ userId, status: "in-progress" }).lean(),
        ]);

        const avgCO2 = carbonLogs.length
            ? (carbonLogs.reduce((s, l) => s + l.totalCO2, 0) / carbonLogs.length).toFixed(1)
            : "unknown";

        const systemPrompt = `You are EcoBot, a friendly eco-sustainability assistant.
USER CONTEXT:
- Average daily CO2: ${avgCO2} kg
- Active habits: ${habits.map(h => h.name).join(", ") || "none"}
- Active goals: ${goals.map(g => g.title).join(", ") || "none"}
- Diet: ${carbonLogs[0]?.diet || "unknown"}
- Transport: ${carbonLogs[0]?.transport > 0 ? "uses private vehicle" : "uses public transport or walks"}
Keep responses concise (2-4 sentences). Stay focused on eco and sustainability topics only.`;

        const messages = [
            { role: "system", content: systemPrompt },
            ...conversationHistory.slice(-10),
            { role: "user", content: message },
        ];

        const groqResponse = await fetch(GROQ_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${GROQ_API_KEY}` },
            body: JSON.stringify({ model: "llama-3.3-70b-versatile", messages, temperature: 0.7, max_tokens: 300 }),
        });

        if (!groqResponse.ok) throw new Error(`Groq API error: ${groqResponse.status}`);
        const groqData = await groqResponse.json();
        const reply    = groqData?.choices?.[0]?.message?.content ?? "";

        res.json({ success: true, reply });
    } catch (error) {
        console.error("Chatbot error:", error.message);
        res.status(500).json({ success: false, message: "Chatbot unavailable right now.", error: error.message });
    }
};
