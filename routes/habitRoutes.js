const express = require('express');
const router = express.Router();
const Habit = require("../models/Habit");
const ActivityLog = require("../models/ActivityLog");
const authMiddleware = require("../middleware/authMiddleware");


// Get all habits for the logged-in user
router.get('/', authMiddleware, async (req, res) => {
    try {
        const habits = await Habit.find({ userId: req.user.id });
        res.json(habits);
    } 
    catch (error) {
        res.status(500).json({ message: 'Error fetching habits', error: error.message });
    }
});


// Create a new habit
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { name, description, frequency, pointsPerCompletion } = req.body;
        const habit = new Habit({
            userId: req.user.id,
            name,
            description,
            frequency,
            pointsPerCompletion
        });

        await habit.save();
        res.status(201).json(habit);

    }
    catch (error) {
        res.status(500).json({ message: 'Error creating habit', error: error.message });
    }
});


// Update a habit
router.put('/:id', authMiddleware, async (req, res) => {
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
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating habit', error: error.message });
    }
});


// Delete a habit
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const habit = await Habit.findOneAndDelete({ _id: req.params.id, userId: req.user.id });

        if (!habit) {
            return res.status(404).json({ message: 'Habit not found' });
        }

        // Also delete associated activity logs
        await ActivityLog.deleteMany({ habitId: req.params.id });

        res.json({ message: 'Habit deleted successfully' });

    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting habit', error: error.message });
    }
});


// Log an activity for a habit
router.post('/:id/log', authMiddleware, async (req, res) => {
    try {
        const habitId = req.params.id;

        const habit = await Habit.findOne({ _id: habitId, userId: req.user.id });

        if (!habit) {
            return res.status(404).json({ message: 'Habit not found' });
        }

        //Check if already logged today
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const existingLog = await ActivityLog.findOne({
            habitId,
            userId: req.user.id,
            date: { $gte: startOfDay, $lte: endOfDay}
        });

        if (existingLog) {
            return res.status(400).json({ message: 'Habit already logged for today' });
        }

        const activity = new ActivityLog({
            userId: req.user.id,
            habitId: habit._id,
            pointsEarned: habit.pointsPerCompletion
        });

        await activity.save();

        // Update Streak
        habit.streak += 1;
        await habit.save();

        res.status(201).json({ activity, habit });
    }
    catch (error) {
        res.status(500).json({ message: 'Error logging activity', error: error.message });
    }
});


// Get recent activity logs
router.get('/activities/recent', authMiddleware, async (req, res) => {
    try {
        const activities = await ActivityLog.find({ userId: req.user.id })
            .populate('habitId', 'name')
            .sort({ date: -1 })
            .limit(10);
        
        res.json(activities);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching recent activities', error: error.message });
    }
});


module.exports = router;


