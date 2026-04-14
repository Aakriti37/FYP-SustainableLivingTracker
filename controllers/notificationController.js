const Notification = require('../models/Notification');
const Habit = require('../models/Habit');
const Activitylog = require('../models/ActivityLog');
const Goal = require('../models/Goal');
const Badge = require('../models/Badge');

// GET /api/notifications — get all notifications for user 
exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.user.id })
            .sort({ createdAt: -1 })
            .limit(20);

        const unreadCount = await Notification.countDocuments({
            userId: req.user.id,
            isRead: false,
        });

        res.json({ notifications, unreadCount });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notifications', error: error.message });
    }
};


// PATCH /api/notifications/:id/read — mark one as read 
exports.markAsRead = async (req, res) => {
    try {
        await Notification.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            { isRead: true }
        );
        res.json({ message: 'Notification marked as read' });
    } catch (error) {
        res.status(500).json({ message: 'Error marking notification', error: error.message });
    }
};


// PATCH /api/notifications/read-all — mark all as read 
exports.markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { userId: req.user.id, isRead: false },
            { isRead: true }
        );
        res.json({ message: 'All notifications marked as read' });
    } catch (error) {
        res.status(500).json({ message: 'Error marking notifications', error: error.message });
    }
};


// DELETE /api/notifications/:id — delete one 
exports.deleteNotification = async (req, res) => {
    try {
        await Notification.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        res.json({ message: 'Notification deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting notification', error: error.message });
    }
};


// GET /api/notifications/badges — get user badges
exports.getBadges = async (req, res) => {
    try {
        const badges = await Badge.find({ userId: req.user.id }).sort({ earnedAt: -1 });
        res.json(badges);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching badges', error: error.message });
    }
};


// POST /api/notifications/generate-reminders
// Called once per day (or on page load) to generate reminders
exports.generateReminders = async (req, res) => {
    try {
        const userId  = req.user.id;
        const today   = new Date();
        const created = [];

        // 1. Habit reminder — habits not logged today 
        const habits = await Habit.find({ userId, isActive: true });

        for (const habit of habits) {
            const todayLog = await ActivityLog.findOne({
                habitId: habit._id,
                userId,
                date: {
                    $gte: new Date(today.setHours(0, 0, 0, 0)),
                    $lte: new Date(today.setHours(23, 59, 59, 999)),
                },
            });

            // Reset today date after using it above
            today.setHours(12, 0, 0, 0);

            if (!todayLog) {
                // Check if we already sent this reminder today
                const existingReminder = await Notification.findOne({
                    userId,
                    type: 'habit_reminder',
                    'meta.habitId': habit._id.toString(),
                    createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
                });

                if (!existingReminder) {
                    const notif = await Notification.create({
                        userId,
                        type:    'habit_reminder',
                        title:   'Habit Reminder',
                        message: `Don't forget to complete "${habit.name}" today!`,
                        link:    '/habits',
                        meta:    { habitId: habit._id.toString() },
                    });
                    created.push(notif);
                }
            }
        }

        // 2. Goal deadline reminders 
        const goals = await Goal.find({ userId, status: 'in-progress' });

        for (const goal of goals) {
            const targetDate = new Date(goal.targetDate);
            const daysLeft   = Math.ceil((targetDate - new Date()) / (1000 * 60 * 60 * 24));

            // Remind at 7 days, 3 days, 1 day left
            if ([7, 3, 1].includes(daysLeft)) {
                const existingReminder = await Notification.findOne({
                    userId,
                    type: 'goal_deadline',
                    'meta.goalId': goal._id.toString(),
                    'meta.daysLeft': daysLeft,
                });

                if (!existingReminder) {
                    const notif = await Notification.create({
                        userId,
                        type:    'goal_deadline',
                        title:   `Goal Deadline ${daysLeft === 1 ? 'Tomorrow!' : `in ${daysLeft} Days`}`,
                        message: `"${goal.title}" is due ${daysLeft === 1 ? 'tomorrow' : `in ${daysLeft} days`}. Keep going!`,
                        link:    '/goals',
                        meta:    { goalId: goal._id.toString(), daysLeft },
                    });
                    created.push(notif);
                }
            }

            // Goal overdue
            if (daysLeft <= 0) {
                const existingOverdue = await Notification.findOne({
                    userId,
                    type: 'goal_deadline',
                    'meta.goalId': goal._id.toString(),
                    'meta.overdue': true,
                });

                if (!existingOverdue) {
                    const notif = await Notification.create({
                        userId,
                        type:    'goal_deadline',
                        title:   'Goal Deadline Passed',
                        message: `The deadline for "${goal.title}" has passed. Consider updating your goal.`,
                        link:    '/goals',
                        meta:    { goalId: goal._id.toString(), overdue: true },
                    });
                    created.push(notif);
                }
            }
        }

        // Emit all new notifications via socket
        const io = req.app.get('io');
        if (io && created.length > 0) {
            created.forEach(notif => {
                io.emit(`notification:${userId}`, notif);
            });
        }

        res.json({ message: `Generated ${created.length} reminders`, created });
    } catch (error) {
        res.status(500).json({ message: 'Error generating reminders', error: error.message });
    }
};


