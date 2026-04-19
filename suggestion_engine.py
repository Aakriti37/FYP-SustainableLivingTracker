# ml-service/suggestion_engine.py
# Generates 4 personalised eco suggestions based on
# predicted emission level + user input features

# Suggestion bank
SUGGESTIONS = {
    "Transport": [
        {
            "title": "Switch to public transport",
            "description": "Use buses or trains instead of your private vehicle to significantly reduce CO2 emissions.",
            "impact": "High",
        },
        {
            "title": "Walk or cycle short distances",
            "description": "Replace short car trips with walking or cycling to cut transport emissions daily.",
            "impact": "High",
        },
        {
            "title": "Consider an electric vehicle",
            "description": "Switching to an electric or hybrid vehicle can drastically lower your transport footprint.",
            "impact": "High",
        },
        {
            "title": "Combine your errands",
            "description": "Plan trips efficiently to cover multiple errands in one journey and reduce total distance.",
            "impact": "Medium",
        },
        {
            "title": "Reduce air travel",
            "description": "Replacing one flight with a train or video call can save hundreds of kg of CO2.",
            "impact": "High",
        },
    ],
    "Diet": [
        {
            "title": "Try a plant-based diet",
            "description": "Shifting to plant-based meals can cut your food-related emissions by up to 50%.",
            "impact": "High",
        },
        {
            "title": "Have meat-free days",
            "description": "Try at least 3 meat-free days per week to meaningfully lower your dietary footprint.",
            "impact": "High",
        },
        {
            "title": "Buy local and seasonal food",
            "description": "Locally grown seasonal produce has far lower transport emissions in the supply chain.",
            "impact": "Medium",
        },
        {
            "title": "Reduce food waste",
            "description": "Plan meals and store food properly to avoid waste and lower overall grocery emissions.",
            "impact": "Medium",
        },
        {
            "title": "Grow your own vegetables",
            "description": "Even a small home garden reduces reliance on store-bought produce and packaging waste.",
            "impact": "Low",
        },
    ],
    "Energy": [
        {
            "title": "Switch to renewable energy",
            "description": "Consider switching home heating and electricity to renewable sources like solar or wind.",
            "impact": "High",
        },
        {
            "title": "Use energy-efficient appliances",
            "description": "Replace old appliances with energy-efficient models to reduce electricity consumption.",
            "impact": "High",
        },
        {
            "title": "Reduce daily screen time",
            "description": "Cutting TV and PC usage by 2 hours daily can meaningfully reduce your energy use.",
            "impact": "Medium",
        },
        {
            "title": "Improve home insulation",
            "description": "Better insulation reduces heating and cooling needs, lowering energy use all year.",
            "impact": "Medium",
        },
        {
            "title": "Turn off standby devices",
            "description": "Unplugging devices on standby can save up to 10% of your monthly electricity bill.",
            "impact": "Low",
        },
    ],
    "Lifestyle": [
        {
            "title": "Recycle more materials",
            "description": "Expanding recycling to paper, plastic, glass and metal reduces landfill emissions.",
            "impact": "Medium",
        },
        {
            "title": "Buy fewer new clothes",
            "description": "Choosing second-hand or buying less fashion significantly lowers your footprint.",
            "impact": "Medium",
        },
        {
            "title": "Compost organic waste",
            "description": "Composting food scraps diverts waste from landfill and reduces methane emissions.",
            "impact": "Medium",
        },
        {
            "title": "Use reusable bags and bottles",
            "description": "Replacing single-use plastics with reusables cuts waste and manufacturing emissions.",
            "impact": "Low",
        },
        {
            "title": "Shower less frequently",
            "description": "Reducing shower frequency or duration saves water and the energy used to heat it.",
            "impact": "Low",
        },
    ]
}


# Category icons (lucid-react icon names - used by frontend)
CATEGORY_ICONS = {
    "Transport": "car",
    "Diet": "salad",
    "Energy": "zap",
    "Lifestyle": "leaf",
}


def _priority_categories(user_data: dict) -> list:
    """
    Determines which categories to prioritise based on user data.
    Returns ordered list of all 4 categories, highest priority first.
    """

    scores = {"Transport": 0, "Diet": 0, "Energy": 0, "Lifestyle": 0}

    # Transport score
    if user_data.get("Transport", "").lower() == "private":
        scores["Transport"] += 2
    if user_data.get("Vehicle Monthly Distance Km", 0) > 500:
        scores["Transport"] += 2
    air = user_data.get("Frequency of Travelling by Air", "").lower()
    if "frequently" in air or "very" in air:
        scores["Transport"] += 3


    # Diet score
    diet = user_data.get("Diet", "").lower()
    if diet == "omnivore":
        scores["Diet"] += 3
    elif diet == "pescatarian":
        scores["Diet"] += 2
    if user_data.get("Monthly Grocery Bill", 0) > 300:
        scores["Diet"] += 1


    # Energy score
    heating = user_data.get("Heating Energy Source", "").lower()
    if heating in ["coal", "wood"]:
        scores["Energy"] += 3
    if user_data.get("How Long TV PC Daily Hour", 0) > 5:
        scores["Energy"] += 2
    if user_data.get("Energy efficiency", "").lower() == "no":
        scores["Energy"] += 2


    # Lifestyle score
    if user_data.get("Recycling_count", 0) < 2:
        scores["Lifestyle"] += 2
    if user_data.get("How Many New Clothes Monthly", 0) > 5:
        scores["Lifestyle"] += 2
    if user_data.get("Waste Bag Weekly Count", 0) > 3:
        scores["Lifestyle"] += 1


    # Sort by score descending
    return sorted(scores.keys(), key=lambda c: scores[c], reverse=True)


def get_suggestions(user_data: dict, emission_level: str) -> list:
    """
    Returns 4 personalised eco suggestions.

    Args:
        user_data: dict of user lifestyle + carbon log fields
        emission_level: "Low", "Medium", or "High"

    Returns:
        list of 4 suggestion dicts ready for frontend
    """

    categories = _priority_categories(user_data)

    suggestions = []
    for i, category in enumerate(categories[:4]):
        bank = SUGGESTIONS[category]

        # Pick suggestion by impact based on emisssion level 
        if emission_level == "High":
            pick = next((s for s in  bank if s["impact"] == "High"), bank[0])
        elif emission_level == "Medium":
            pick = next((s for s in bank if s["impact"] in ["High", "Medium"]), bank[0])
        else:
            pick = bank[-1]     # Low impact nudges for already low emitters

        
        suggestions.append({
            "id": i + 1,
            "icon": CATEGORY_ICONS[category],
            "title": pick["title"],
            "description": pick["description"],
            "impact": pick["impact"],
            "category": category,
        })

    return suggestions






