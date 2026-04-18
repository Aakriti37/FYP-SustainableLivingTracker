// controllers/adminController.js

const User        = require('../models/User');
const Habit       = require('../models/Habit');
const Post        = require('../models/Post');
const CarbonLog   = require('../models/Carbon');
const ActivityLog = require('../models/ActivityLog');
const Goal        = require('../models/Goal');

// GET /api/admin/stats 
exports.getStats = async (req, res) => {
    try {
        const [totalUsers, totalHabits, totalPosts, allCarbonLogs, totalGoals] = await Promise.all([
            User.countDocuments({ role: 'user' }),
            Habit.countDocuments(),
            Post.countDocuments(),
            CarbonLog.find(),
            Goal.countDocuments(),
        ]);

        const totalCO2Log = allCarbonLogs.reduce((acc, log) => acc + log.totalCO2, 0);

        res.json({
            totalUsers,
            totalHabits,
            totalPosts,
            totalGoals,
            totalCO2Log: parseFloat(totalCO2Log.toFixed(2)),
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stats', error: error.message });
    }
};


// GET /api/admin/analytics 
// Returns real data for charts
exports.getAnalytics = async (req, res) => {
    try {
        // 1. User growth — last 6 months 
        const userGrowth = [];
        for (let i = 5; i >= 0; i--) {
            const date  = new Date();
            date.setMonth(date.getMonth() - i);
            const start = new Date(date.getFullYear(), date.getMonth(), 1);
            const end   = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);

            const count = await User.countDocuments({
                role:      'user',
                createdAt: { $gte: start, $lte: end },
            });

            userGrowth.push({
                month: date.toLocaleDateString('en', { month: 'short' }),
                users: count,
            });
        }

        // 2. CO2 trend — last 7 logs across all users
        const recentLogs = await CarbonLog.find()
            .sort({ date: -1 })
            .limit(30)
            .lean();

        // Group by date
        const co2ByDate: Record<string, number[]> = {};
        recentLogs.forEach(log => {
            const day = new Date(log.date).toLocaleDateString('en', { month: 'short', day: 'numeric' });
            if (!co2ByDate[day]) co2ByDate[day] = [];
            co2ByDate[day].push(log.totalCO2);
        });

        const co2Trend = Object.entries(co2ByDate)
            .slice(-7)
            .map(([date, values]) => ({
                date,
                avgCO2: parseFloat((values.reduce((a, b) => a + b, 0) / values.length).toFixed(1)),
            }));

        // 3. Activity split 
        const [habitCount, postCount, goalCount] = await Promise.all([
            Habit.countDocuments(),
            Post.countDocuments(),
            Goal.countDocuments(),
        ]);

        const activitySplit = [
            { name: 'Habits',    value: habitCount, color: '#17921f' },
            { name: 'Posts',     value: postCount,  color: '#508C12' },
            { name: 'Goals',     value: goalCount,  color: '#5cbd36' },
        ];

        // 4. Top habits 
        const topHabits = await Habit.aggregate([
            { $group: { _id: '$name', count: { $sum: 1 }, avgStreak: { $avg: '$streak' } } },
            { $sort: { count: -1 } },
            { $limit: 5 },
            { $project: { name: '$_id', count: 1, avgStreak: { $round: ['$avgStreak', 1] } } },
        ]);

        res.json({ userGrowth, co2Trend, activitySplit, topHabits });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching analytics', error: error.message });
    }
};


// GET /api/admin/users 
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};


// DELETE /api/admin/users/:id 
exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        await Habit.deleteMany({ userId: req.params.id });
        await Post.deleteMany({ userId: req.params.id });
        await CarbonLog.deleteMany({ userId: req.params.id });
        res.json({ message: 'User and their data deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
};


// GET /api/admin/posts 
exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('userId', 'firstName lastName email')
            .sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching posts', error: error.message });
    }
};


// DELETE /api/admin/posts/:id 
exports.deletePost = async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id);
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting post', error: error.message });
    }
};


// GET /api/admin/carbon-logs 
exports.getCarbonLogs = async (req, res) => {
    try {
        const logs = await CarbonLog.find()
            .populate('userId', 'firstName lastName email')
            .sort({ date: -1 })
            .limit(100);
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching carbon logs', error: error.message });
    }
};
