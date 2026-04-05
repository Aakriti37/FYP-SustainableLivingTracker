// models/UserLifestyle.js
const mongoose = require("mongoose");

const userLifestyleSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        bodyType: {
            type: String,
            enum: ["underweight", "normal", "overweight", "obese"],
            default: "normal",
        },
        sex: {
            type: String,
            enum: ["male", "female"],
            required: true,
        },
        showerFrequency: {
            type: String,
            enum: ["daily", "twice a day", "more frequently", "less frequently"],
            default: "daily",
        },
        socialActivity: {
            type: String,
            enum: ["never", "sometimes", "often"],
            default: "sometimes",
        },
        airTravelFrequency: {
            type: String,
            enum: ["never", "rarely", "frequently", "very frequently"],
            default: "rarely",
        },
        vehicleType: {
            type: String,
            enum: ["none", "petrol", "diesel", "hybrid", "lpg", "electric"],
            default: "none",
        },
        wasteBagSize: {
            type: String,
            enum: ["small", "medium", "large", "extra large"],
            default: "medium",
        },
        wasteBagWeeklyCount: {
            type: Number,
            default: 3,
        },
        monthlyGroceryBill: {
            type: Number,
            default: 200,
        },
        tvPcHoursDaily: {
            type: Number,
            default: 4,
        },
        internetHoursDaily: {
            type: Number,
            default: 5,
        },
        newClothesMonthly: {
            type: Number,
            default: 3,
        },
        energyEfficiency: {
            type: String,
            enum: ["No", "Sometimes", "Yes"],
            default: "Sometimes",
        },
        recycling: {
            type: [String],
            default: [],
        },
        cookingWith: {
            type: [String],
            default: ["Stove"],
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("UserLifestyle", userLifestyleSchema);
