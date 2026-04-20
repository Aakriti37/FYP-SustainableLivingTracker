// controllers/goalController.js
// Fixed progress logic: based on time elapsed vs target date

const Goal        = require('../models/Goal');
const Habit       = require('../models/Habit');
const ActivityLog = require('../models/ActivityLog');
const Notification = require('../models/Notification');
const Badge       = require('../models/Badge');

// Helper: award badge if not already earned 
const awardBadgeIfNew = async (userId, badgeType, badgeTitle, badgeMessage, io) => {
    try {
        const existing = await Badge.findOne({ userID: userId, badgeType });
        if (existing) return; // already has this badge

        await Badge.create({ userID: userId, badgeType });

        // Create notification for badge
        const notification = await Notification.create({
            userId,
            type:    'badge_earned',
            title:   `Badge Earned: ${badgeTitle}`,
            message: badgeMessage,
            link:    '/profile',
            meta:    { badgeType },
        });

        // Emit real-time notification
        if (io) {
            io.emit(`notification:${userId}`, notification);
        }
    } catch (err) {
        // Ignore duplicate badge errors
        if (err.code !== 11000) console.error('Badge error:', err.message);
    }
};

// Helper: calculate correct progress 
// Progress = time elapsed since goal creation / total goal duration × 100
// But capped by actual habit completion rate
const calculateGoalProgress = async (goal) => {
    if (goal.status === 'completed') return 100;
    if (goal.status === 'failed')    return 0;

    const habits = await Habit.find({ goalId: goal._id });
    if (habits.length === 0) {
        // No habits linked — use time-based progress
        const created  = new Date(goal.createdAt).getTime();
        const target   = new Date(goal.targetDate).getTime();
        const now      = Date.now();
        const elapsed  = now - created;
        const total    = target - created;
        if (total <= 0) return 0;
        return Math.min(Math.round((elapsed / total) * 100), 99); // max 99 until manually completed
    }

    // Habits linked — calculate expected vs actual completions
    const created      = new Date(goal.createdAt);
    const target       = new Date(goal.targetDate);
    const now          = new Date();
    const totalDays    = Math.ceil((target - created) / (1000 * 60 * 60 * 24));
    const elapsedDays  = Math.ceil((now - created) / (1000 * 60 * 60 * 24));

    // Expected completions = habits × elapsed days (for daily habits)
    const dailyHabits   = habits.filter(h => h.frequency === 'daily').length;
    const weeklyHabits  = habits.filter(h => h.frequency === 'weekly').length;
    const monthlyHabits = habits.filter(h => h.frequency === 'monthly').length;

    const expectedCompletions =
        (dailyHabits   * elapsedDays) +
        (weeklyHabits  * Math.floor(elapsedDays / 7)) +
        (monthlyHabits * Math.floor(elapsedDays / 30));

    if (expectedCompletions === 0) return 0;

    // Actual completions — count activity logs for these habits since goal creation
    const habitIds = habits.map(h => h._id);
    const actualCompletions = await ActivityLog.countDocuments({
        habitId: { $in: habitIds },
        date:    { $gte: created },
    });

    const progress = Math.min(Math.round((actualCompletions / expectedCompletions) * 100), 99);
    return progress;
};


// GET /api/goals 
exports.getGoals = async (req, res) => {
    try {
        const goals = await Goal.find({ userId: req.user.id }).sort({ targetDate: 1 });

        const goalsWithProgress = await Promise.all(goals.map(async (goal) => {
            const progress = await calculateGoalProgress(goal);

            // Check if goal is overdue and not completed → mark as failed
            const isOverdue = new Date(goal.targetDate) < new Date() && goal.status === 'in-progress';
            if (isOverdue) {
                await Goal.findByIdAndUpdate(goal._id, { status: 'failed' });
                return { ...goal._doc, progress: 0, status: 'failed' };
            }

            return { ...goal._doc, progress };
        }));

        res.json(goalsWithProgress);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching goals', error: error.message });
    }
};


// POST /api/goals 
exports.createGoal = async (req, res) => {
    try {
        const { title, targetDate } = req.body;
        const goal = new Goal({ userId: req.user.id, title, targetDate });
        await goal.save();
        res.status(201).json({ ...goal._doc, progress: 0 });
    } catch (error) {
        res.status(500).json({ message: 'Error creating goal', error: error.message });
    }
};


// PATCH /api/goals/:id/status 
exports.updateGoalStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const goal = await Goal.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            { status },
            { new: true }
        );
        if (!goal) return res.status(404).json({ message: 'Goal not found' });

        const io = req.app.get('io');

        // If goal just completed — create notification + check badges
        if (status === 'completed') {
            await Notification.create({
                userId:  req.user.id,
                type:    'goal_completed',
                title:   'Goal Completed!',
                message: `Congratulations! You completed "${goal.title}"`,
                link:    '/goals',
            });

            // Check how many goals completed for badge
            const completedCount = await Goal.countDocuments({
                userId: req.user.id,
                status: 'completed',
            });

            if (completedCount === 1) {
                await awardBadgeIfNew(req.user.id, 'eco_starter', 'Eco Starter', 'You completed your first eco goal!', io);
            }
            if (completedCount >= 3) {
                await awardBadgeIfNew(req.user.id, 'eco_champion', 'Eco Champion', 'Amazing! You completed 3 eco goals!', io);
            }

            // Emit goal completion notification
            if (io) {
                const notif = await Notification.findOne({ userId: req.user.id, type: 'goal_completed' }).sort({ createdAt: -1 });
                io.emit(`notification:${req.user.id}`, notif);
            }
        }

        res.json({ ...goal._doc, status });
    } catch (error) {
        res.status(500).json({ message: 'Error updating goal', error: error.message });
    }
};


// DELETE /api/goals/:id 
exports.deleteGoal = async (req, res) => {
    try {
        const goal = await Goal.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        if (!goal) return res.status(404).json({ message: 'Goal not found' });
        res.json({ message: 'Goal deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting goal', error: error.message });
    }
};
