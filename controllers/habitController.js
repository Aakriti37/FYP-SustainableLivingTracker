const Habit = require('../models/Habit');
const ActivityLog = require('../models/ActivityLog');

exports.getHabits = async (req, res) => {
    try {
        const habits = await Habit.find({ userId: req.user.id }).lean();

        const today = new Date();

        const habitsWithLogStatus = await Promise.all(habits.map(async (habit) => {
            const recentLog = await ActivityLog.findOne({
                habitId: habit._id,
                userId: req.user.id
            }).sort({ date: -1 });

            let completedToday = false;
            if (recentLog && recentLog.date) {
                const logDate = new Date(recentLog.date);
                if (logDate.getDate() === today.getDate() &&
                    logDate.getMonth() === today.getMonth() &&
                    logDate.getFullYear() === today.getFullYear()) {
                    completedToday = true;
                }
            }

            return {
                ...habit,
                completedToday
            };
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
            goalId: goalId || undefined
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
        if (!habit) {
            return res.status(404).json({ message: 'Habit not found' });
        }
        res.json(habit);
    } catch (error) {
        res.status(500).json({ message: 'Error updating habit', error: error.message });
    }
};

exports.deleteHabit = async (req, res) => {
    try {
        const habit = await Habit.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        if (!habit) {
            return res.status(404).json({ message: 'Habit not found' });
        }
        // Points history is intentionally preserved.
        res.json({ message: 'Habit deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting habit', error: error.message });
    }
};

exports.logActivity = async (req, res) => {
    try {
        const habitId = req.params.id;
        const habit = await Habit.findOne({ _id: habitId, userId: req.user.id });

        if (!habit) {
            return res.status(404).json({ message: 'Habit not found' });
        }

        // Check if already logged today
        const today = new Date();
        
        const recentLog = await ActivityLog.findOne({
            habitId,
            userId: req.user.id
        }).sort({ date: -1 });

        if (recentLog && recentLog.date) {
            const logDate = new Date(recentLog.date);
            if (logDate.getDate() === today.getDate() &&
                logDate.getMonth() === today.getMonth() &&
                logDate.getFullYear() === today.getFullYear()) {
                return res.status(400).json({ message: 'Habit already logged for today' });
            }
        }

        const activity = new ActivityLog({
            userId: req.user.id,
            habitId: habit._id,
            pointsEarned: habit.pointsPerCompletion
        });

        await activity.save();

        // Update streak
        habit.streak += 1;
        await habit.save();

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
