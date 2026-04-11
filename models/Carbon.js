const mongoose = require("mongoose")

const carbonSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true },
    period: { type: String, enum: ['daily', 'weekly', 'monthly'], default: 'daily' },
    date: { type: Date, default: Date.now },

    // Transport
    privateTransportKm: { type: Number, defaule: 0 },
    vehicleFuelType: { type: String, enum: ['petrol', 'diesel', 'hybrid', 'electric', 'motorcycle', 'none'], defaule: 'none' },
    busKm: { type: Number, defaule: 0 },
    trainKm: { type: Number, default: 0 },


    // Energy
    electricityKwh: { type: Number, default: 0 },

    // Diet
    diet: { type: String, enum: ['vegan', 'vegetarian', 'pescatarian', 'balanced', 'meat-heavy'], default: 'balanced' },


    // Cooking
    cookingFuel: { type: String, enum: ['LPG', 'Wood', 'Electricity', 'Biogas', 'None'], default: 'LPG' },
    cookingHoursPerDay: { type: Number, default: 1},


    // Breakdown
    transportCO2: { type: Number, default: 0 },
    energyCO2: { type: Number, default: 0 },
    dietCO2: { type: Number, default: 0 },
    cookingCO2: { type: Number, default: 0 },
    totalCO2: { type: Number, default: 0 },

}, { timestamps: true });

module.exports = mongoose.model('Carbon', carbonSchema);