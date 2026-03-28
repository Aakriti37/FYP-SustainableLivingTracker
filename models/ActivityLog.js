const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    habitId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Habit',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    pointsEarned: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
