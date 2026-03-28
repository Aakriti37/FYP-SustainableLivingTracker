const CarbonLog = require('../models/CarbonLog');

// Helper function to calculate CO2 footprint (simplified)
const calculateFootprint = (transport, publicTransport, energy, diet, cookingFuel) => {
    const transportCO2 = transport * 0.12;
    const publicTransportCO2 = publicTransport * 0.04;
    const energyCO2 = energy * 0.233;

    let dietCO2 = 0;
    switch (diet) {
        case 'vegan': dietCO2 = 2.0; break;
        case 'vegetarian': dietCO2 = 3.0; break;
        case 'balanced': dietCO2 = 4.5; break;
        case 'meat-heavy': dietCO2 = 6.0; break;
        default: dietCO2 = 4.5;
    }

    let fuelCO2 = 0;
    switch (cookingFuel) {
        case 'LPG': fuelCO2 = 1.5; break;
        case 'Wood': fuelCO2 = 3.0; break;
        case 'Electricity': fuelCO2 = 0.5; break;
        case 'Biogas': fuelCO2 = 0.1; break;
        case 'None': fuelCO2 = 0; break;
        default: fuelCO2 = 1.5;
    }

    return parseFloat((transportCO2 + publicTransportCO2 + energyCO2 + dietCO2 + fuelCO2).toFixed(2));
};

exports.createCarbonLog = async (req, res) => {
    try {
        const { transport, publicTransport, energy, diet, cookingFuel } = req.body;

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const existingLog = await CarbonLog.findOne({
            userId: req.user.id,
            date: { $gte: startOfDay, $lte: endOfDay }
        });

        if (existingLog) {
            return res.status(400).json({ message: 'Carbon footprint already logged for today' });
        }

        const totalCO2 = calculateFootprint(transport, publicTransport, energy, diet, cookingFuel);

        const carbonLog = new CarbonLog({
            userId: req.user.id,
            transport,
            publicTransport,
            energy,
            cookingFuel,
            diet,
            totalCO2
        });

        await carbonLog.save();
        res.status(201).json(carbonLog);
    } catch (error) {
        res.status(500).json({ message: 'Error saving carbon log', error: error.message });
    }
};

exports.getCarbonHistory = async (req, res) => {
    try {
        const logs = await CarbonLog.find({ userId: req.user.id })
            .sort({ date: -1 })
            .limit(30);
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching carbon history', error: error.message });
    }
};

exports.getTodayCarbonLog = async (req, res) => {
    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const log = await CarbonLog.findOne({
            userId: req.user.id,
            date: { $gte: startOfDay, $lte: endOfDay }
        });

        res.json(log || null);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching today’s log', error: error.message });
    }
};
