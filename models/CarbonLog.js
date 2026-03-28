const mongoose = require('mongoose');

const carbonLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    transport: {
        type: Number, // km traveled via personal car/bike
        default: 0
    },
    publicTransport: {
        type: Number, // km traveled via bus/train
        default: 0
    },
    energy: {
        type: Number, // kWh used
        default: 0
    },
    cookingFuel: {
        type: String, // 'LPG', 'Wood', 'Electricity', 'Biogas'
        enum: ['LPG', 'Wood', 'Electricity', 'Biogas', 'None'],
        default: 'LPG'
    },
    diet: {
        type: String, // 'vegan', 'vegetarian', 'meat-heavy', 'balanced'
        enum: ['vegan', 'vegetarian', 'balanced', 'meat-heavy'],
        default: 'balanced'
    },
    totalCO2: {
        type: Number, // calculated footprint in kg CO2e
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('CarbonLog', carbonLogSchema);
