// controllers/habitController.js
// Added badge + notification triggers on activity log

const Habit        = require('../models/Habit');
const ActivityLog  = require('../models/ActivityLog');
const Notification = require('../models/Notification');
const Badge        = require('../models/Badge');

// Helper: award badge if not already earned 
const awardBadgeIfNew = async (userId, badgeType, badgeTitle, badgeMessage, io) => {
    try {
        const existing = await Badge.findOne({ userID: userId, badgeType });
        if (existing) return;

        await Badge.create({ userID: userId, badgeType });

        const notification = await Notification.create({
            userId,
            type:    'badge_earned',
            title:   `Badge Earned: ${badgeTitle}`,
            message: badgeMessage,
            link:    '/profile',
            meta:    { badgeType },
        });

        if (io) io.emit(`notification:${userId}`, notification);
    } catch (err) {
        if (err.code !== 11000) console.error('Badge error:', err.message);
    }
};


exports.getHabits = async (req, res) => {
    try {
        const habits = await Habit.find({ userId: req.user.id }).lean();
        const today  = new Date();

        const habitsWithLogStatus = await Promise.all(habits.map(async (habit) => {
            const recentLog = await ActivityLog.findOne({
                habitId: habit._id,
                userId:  req.user.id,
            }).sort({ date: -1 });

            let completedToday = false;
            if (recentLog?.date) {
                const logDate = new Date(recentLog.date);
                if (
                    logDate.getDate()     === today.getDate()     &&
                    logDate.getMonth()    === today.getMonth()    &&
                    logDate.getFullYear() === today.getFullYear()
                ) {
                    completedToday = true;
                }
            }

            return { ...habit, completedToday };
        }));

        res.json(habitsWithLogStatus);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching habits', error: error.message });
    }
};


exports.createHabit = async (req, res) => {
    try {
        const { name, description, frequency, pointsPerCompletion, goalId } = req.body;
        const habit = new Habit({
            userId: req.user.id,
            name,
            description,
            frequency,
            pointsPerCompletion,
            goalId: goalId || undefined,
        });
        await habit.save();
        res.status(201).json(habit);
    } catch (error) {
        res.status(500).json({ message: 'Error creating habit', error: error.message });
    }
};


exports.updateHabit = async (req, res) => {
    try {
        const habit = await Habit.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            req.body,
            { new: true }
        );
        if (!habit) return res.status(404).json({ message: 'Habit not found' });
        res.json(habit);
    } catch (error) {
        res.status(500).json({ message: 'Error updating habit', error: error.message });
    }
};


exports.deleteHabit = async (req, res) => {
    try {
        const habit = await Habit.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        if (!habit) return res.status(404).json({ message: 'Habit not found' });
        res.json({ message: 'Habit deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting habit', error: error.message });
    }
};


exports.logActivity = async (req, res) => {
    try {
        const habitId = req.params.id;
        const userId  = req.user.id;
        const habit   = await Habit.findOne({ _id: habitId, userId });

        if (!habit) return res.status(404).json({ message: 'Habit not found' });

        // Check if already logged today
        const today     = new Date();
        const recentLog = await ActivityLog.findOne({ habitId, userId }).sort({ date: -1 });

        if (recentLog?.date) {
            const logDate = new Date(recentLog.date);
            if (
                logDate.getDate()     === today.getDate()     &&
                logDate.getMonth()    === today.getMonth()    &&
                logDate.getFullYear() === today.getFullYear()
            ) {
                return res.status(400).json({ message: 'Habit already logged for today' });
            }
        }

        const activity = new ActivityLog({
            userId,
            habitId: habit._id,
            pointsEarned: habit.pointsPerCompletion,
        });
        await activity.save();

        // Update streak
        habit.streak += 1;
        await habit.save();

        const io = req.app.get('io');

        // Streak milestone notifications 
        if (habit.streak === 7) {
            await Notification.create({
                userId,
                type:    'streak_milestone',
                title:   '7 Day Streak!',
                message: `Amazing! You've maintained "${habit.name}" for 7 days in a row!`,
                link:    '/habits',
            });
            await awardBadgeIfNew(userId, 'streak_master', 'Streak Master', 'You reached a 7-day habit streak!', io);
        }

        if (habit.streak === 30) {
            await Notification.create({
                userId,
                type:    'streak_milestone',
                title:   '30 Day Streak!',
                message: `Incredible! "${habit.name}" - 30 days straight! You are unstoppable!`,
                link:    '/habits',
            });
        }

        // Check total activity logs for badges 
        const totalActivities = await ActivityLog.countDocuments({ userId });

        if (totalActivities >= 5) {
            await awardBadgeIfNew(userId, 'habit_builder', 'Habit Builder', 'You have logged 5 habits!', io);
        }
        if (totalActivities >= 30) {
            await awardBadgeIfNew(userId, 'consistency_king', 'Consistency King', 'You have logged habits 30 times!', io);
        }

        // Emit real-time notification if streak milestone
        if (io && (habit.streak === 7 || habit.streak === 30)) {
            const notif = await Notification.findOne({ userId, type: 'streak_milestone' }).sort({ createdAt: -1 });
            io.emit(`notification:${userId}`, notif);
        }

        res.status(201).json({ activity, habit });
    } catch (error) {
        res.status(500).json({ message: 'Error logging activity', error: error.message });
    }
};


exports.getRecentActivities = async (req, res) => {
    try {
        const activities = await ActivityLog.find({ userId: req.user.id })
            .populate('habitId', 'name')
            .sort({ date: -1 })
            .limit(10);
        res.json(activities);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching recent activities', error: error.message });
    }
};
