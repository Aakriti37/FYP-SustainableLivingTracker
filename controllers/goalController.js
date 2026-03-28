const Goal = require('../models/Goal');
const Habit = require('../models/Habit');

exports.getGoals = async (req, res) => {
    try {
        const goals = await Goal.find({ userId: req.user.id }).sort({ targetDate: 1 });

        // Dynamically compute progress based on associated habits
        const goalsWithProgress = await Promise.all(goals.map(async (goal) => {
            const habits = await Habit.find({ goalId: goal._id });
            let progress = 0;

            if (goal.status === 'completed') {
                progress = 100;
            } else if (habits.length > 0) {
                // Goal progress scales with habit streaks (arbitrary completion threshold of 10 per habit for demo)
                const totalStreak = habits.reduce((acc, h) => acc + h.streak, 0);
                const targetStreak = habits.length * 10;
                progress = Math.min(Math.round((totalStreak / targetStreak) * 100), 100);
            }

            return {
                ...goal._doc,
                progress
            };
        }));

        res.json(goalsWithProgress);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching goals', error: error.message });
    }
};

exports.createGoal = async (req, res) => {
    try {
        const { title, targetDate } = req.body;
        const goal = new Goal({
            userId: req.user.id,
            title,
            targetDate
        });
        await goal.save();
        res.status(201).json(goal);
    } catch (error) {
        res.status(500).json({ message: 'Error creating goal', error: error.message });
    }
};

exports.updateGoalStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const goal = await Goal.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            { status },
            { new: true }
        );
        if (!goal) return res.status(404).json({ message: 'Goal not found' });
        res.json(goal);
    } catch (error) {
        res.status(500).json({ message: 'Error updating goal', error: error.message });
    }
};

exports.deleteGoal = async (req, res) => {
    try {
        const goal = await Goal.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        if (!goal) return res.status(404).json({ message: 'Goal not found' });
        res.json({ message: 'Goal deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting goal', error: error.message });
    }
};
