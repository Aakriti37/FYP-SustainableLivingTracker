const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    badgeType: {
        type: String,
        enum: [
            'eco_starter',          // completed first goal
            'habit_builder',        // logged 5 habits total
            'streak_master',        // any habit reached 7 day streak
            'eco_champion',         // completed 3 goals
            'green_warrior',        // logged carbon 7 days in a row
            'consistency_king',     // logged habits 30 days total
        ],
        required: true,
    },
    earnedAt: { type: Date, default: Date.now },

}, { timestamps: true });

// One badge type per user
badgeSchema.index({ userID: 1, badgeType: 1}, { unique: true });

module.exports = mongoose.model('Badge', badgeSchema);


