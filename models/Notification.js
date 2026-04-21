const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    type: {
        type: String,
        enum: [
            'habit_reminder',       // haven't logged habit today
            'goal_deadline',        // goal deadline approaching
            'goal_completed',       // goal marked complete
            'badge_earned',         // earned a badge
            'streak_milestone',     // reached a streak milestone
        ],
        required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    link: { type: String, default: null },          // eg: '/habits', '/goals'
    meta: { type: mongoose.Schema.Types.Mixed, default: {} },       // extra data
    
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);



