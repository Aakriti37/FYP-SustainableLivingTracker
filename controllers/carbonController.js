// controllers/carbonController.js
// ─────────────────────────────────────────────────────────────────────────────
// EMISSION FACTORS — Real values from verified scientific sources
// ─────────────────────────────────────────────────────────────────────────────
//
// Transport: UK Government GHG Conversion Factors 2023
//   https://www.gov.uk/government/collections/government-conversion-factors-for-company-reporting
//
// Public Transport: Our World in Data — Travel Carbon Footprint
//   https://ourworldindata.org/travel-carbon-footprint
//
// Electricity (Nepal): LowCarbonPower.org / IEA / Ember (2022)
//   https://www.lowcarbonpower.org/region/Nepal
//   Nepal grid: 96% hydropower → 41 gCO2eq/kWh = 0.041 kg CO2e/kWh
//
// Diet: Oxford University / Scarborough et al. (2014) PMC Study
//   https://pmc.ncbi.nlm.nih.gov/articles/PMC4372775/
//
// Cooking Fuel: Springer Nature 2025
//   https://link.springer.com/article/10.1007/s43621-025-00858-x
//   LPG: 1.492 kg CO2e/kg — Wood: 1.83 kg CO2e/kg
// ─────────────────────────────────────────────────────────────────────────────


const Carbon = require('../models/Carbon');

//Transport factors (kg CO2e per km)
const TRANSPORT_FACTORS = {
    petrol: 0.1645,
    diesel: 0.1698,
    hybrid: 0.0931,
    electric: 0.0450,
    motorcycle: 0.1137,
    none: 0,
};


const BUS_FACTOR = 0.1085;      // kg CO2e per passenger km
const TRAIN_FACTOR = 0.0355;    // kg CO2e per passenger km


// Electricity factor - Nepal grid ( kg CO2e per kWh)
const ELECTRICITY_FACTOR = 0.041;


// Diet factors ( kg CO2e per day)
const DIET_FACTORS = {
    vegan: 2.89,
    vegetarian: 3.81,
    pescatarian: 3.91,
    balanced: 5.63,
    'meat-heavy': 7.91,
};



// Cooking fuel factors (kg CO2e per hour of cooking)
// LPG: 1.492 kg CO2e/kg × 0.3 kg/hr average household use
// Wood: 1.83 kg CO2e/kg × 1.5 kg/hr average household use
// Electricity: 0.041 kg CO2e/kWh × 1.5 kWh/hr for cooking
// Biogas: near-zero renewable

const COOKING_FACTORS_PER_HOUR = {
    LPG: 0.448,
    Wood: 2.745,
    Electricity: 0.062,
    Biogas: 0.050,
    None: 0,
};


// Period multiplier (days)
const PERIOD_DAYS = {
    daily: 1,
    weekly: 7,
    monthly: 30,
};


// CALCULATION FUNCTION
const calculateFootprint = ({
    period,
    privateTransportKm,
    vehicleFuelType,
    busKm,
    trainKm,
    electricityKwh,
    diet, 
    cookingFuel,
    cookingHoursPerDay,
}) => {
    const days = PERIOD_DAYS[period] || 1;

    // 1. Transport CO2
    // Private vehicle: total km entered * fuel factor

    const privateCO2 = (privateTransportKm || 0) * (TRANSPORT_FACTORS[vehicleFuelType] ||0);

    // Public transport: km * factor (already total for per period)
    const busCO2 = (busKm || 0) * BUS_FACTOR;
    const trainCO2 = (trainKm || 0) * TRAIN_FACTOR;
    const transportCO2 = parseFloat((privateCO2 + busCO2 + trainCO2).toFixed(3));


    // 2. Energy CO2
    // Total kWh entered * Nepal grid factor
    const energyCO2 = parseFloat(((electricityKwh || 0) * ELECTRICITY_FACTOR).toFixed(3));


    // 3. Diet CO2
    // Daily diet emission * number of days in period
    const dietCO2 = parseFloat(((DIET_FACTORS[diet] || 5.63) * days).toFixed(3));


    // 4. Cooking CO2
    // Hours per day * cooking factor * number of days
    const cookingCO2 = parseFloat((
        (cookingHoursPerDay || 1) *
        (COOKING_FACTORS_PER_HOUR[cookingFuel] || 0) * 
        days
    ).toFixed(3));


    // Total
    const totalCO2 = parseFloat((transportCO2 + energyCO2 + dietCO2 + cookingCO2).toFixed(2));

    return {
        transportCO2, energyCO2, dietCO2, cookingCO2, totalCO2
    };
};



// CONTROLLERS

// POST /api/carbon - Create new carbon log

exports.createCarbonLog = async (req, res) => {
    try {
        const {
            period, 
            privateTransportKm,
            vehicleFuelType,
            busKm,
            trainKm,
            electricityKwh,
            diet,
            cookingFuel,
            cookingHoursPerDay,
        } = req.body;


        const { transportCO2, energyCO2, dietCO2, cookingCO2, totalCO2 } = calculateFootprint({
            period, 
            privateTransportKm,
            vehicleFuelType,
            busKm,
            trainKm,
            electricityKwh,
            diet,
            cookingFuel,
            cookingHoursPerDay,
        });

        const carbonLog = new Carbon({
            userId: req.user.id,
            period,
            privateTransportKm,
            vehicleFuelType,
            busKm,
            trainKm,
            electricityKwh,
            diet,
            cookingFuel,
            cookingHoursPerDay,
            transportCO2,
            energyCO2,
            dietCO2,
            cookingCO2,
            totalCO2,
        });

        await carbonLog.save();
        res.status(201).json(carbonLog);

    } catch (error) {
        res.status(500).json({ message: 'Error saving carbon log', error: error.message });
    }
};



// GET /api/carbon/history - Get all logs for user (last 50)
exports.getCarbonHistory = async (req, res) => {
    try {
        const logs = await Carbon.find({ userId: req.user.id })
            .sort({ date: -1 })
            .limit(50);
        
        res.json(logs);

    } catch (error) {
        res.status(500).json({ message: 'Error fetching carbon history', error: error.message });
    }
};


// GET /api/carbon/today — Get today's logs
exports.getTodayCarbonLog = async (req, res) => {
    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const log = await Carbon.findOne({
            userId: req.user.id,
            date: { $gte: startOfDay, $lte: endOfDay },
        }).sort({ createdAt: -1 });

        res.json(log || null);

    } catch (error) {
        res.status(500).json({ message: "Error fetching today's log", error: error.message });
    }
};



// GET /api/carbon/stats — Get total CO2 stats for user
exports.getCarbonStats = async (req, res) => {
    try {
        const logs = await Carbon.find({ userId: req.user.id });
        const totalCO2 = logs.reduce((sum, l) => sum + l.totalCO2, 0);
        const totalLogs = logs.length;
        const avgCO2 = totalLogs > 0 ? totalCO2 / totalLogs : 0;

        res.json({
            totalCO2: parseFloat(totalCO2.toFixed(2)),
            totalLogs,
            avgCO2: parseFloat(avgCO2.toFixed(2)),
        });

    } catch (error) {
        res.status(500).json({ message: 'Error fetching stats', error: error.message });
    }
};




// PUT /api/carbon/:id — Edit a carbon log
exports.updateCarbonLog = async (req, res) => {
    try {
        const log = await Carbon.findOne({ _id: req.params.id, userId: req.user.id });

        if (!log) {
            return res.status(404).json({ message: "Carbon log not found" });
        }


        const {
            period,
            privateTransportKm,
            vehicleFuelType,
            busKm,
            trainKm,
            electricityKwh,
            diet,
            cookingFuel,
            cookingHoursPerDay,
        } = req.body;


        const { transportCO2, energyCO2, dietCO2, cookingCO2, totalCO2 } = calculateFootprint({
            period: period ?? log.period,
            privateTransportKm: privateTransportKm ?? log.privateTransportKm,
            vehicleFuelType: vehicleFuelType ?? log.vehicleFuelType,
            busKm: busKm ?? log.busKm,
            trainKm: trainKm ?? log.trainKm,
            electricityKwh: electricityKwh ?? log.electricityKwh,
            diet: diet ?? log.diet,
            cookingFuel: cookingFuel ?? log.cookingFuel,
            cookingHoursPerDay: cookingHoursPerDay ?? log.cookingHoursPerDay,
        });


        const updated = await Carbon.findByIdAndUpdate(
            req.params.id,
            {
                ...req.body,
                transportCO2, energyCO2, dietCO2, cookingCO2, totalCO2,
            },
            { new: true }
        );

        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: 'Error updating carbon log', error: error.message });
    }
};



// DELETE /api/carbon/:id — Delete a carbon log
exports.deleteCarbonLog = async (req, res) => {
    try {
        const log = await Carbon.findOneAndDelete({ _id: req.params.id, userId: req.user.id });

        if (!log) {
            return res.status(404).json({ message: 'Carbon log not found'});
        }

        res.json({ message: 'Carbon log deleted successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Error deleting carbon log', error: error.message });
    }
};








