const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    targetDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['in-progress', 'completed', 'failed'],
        default: 'in-progress'
    }
}, { timestamps: true });

module.exports = mongoose.model('Goal', goalSchema);
