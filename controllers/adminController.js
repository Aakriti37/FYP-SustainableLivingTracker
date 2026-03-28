const User = require('../models/User');
const Habit = require('../models/Habit');
const Post = require('../models/Post');
const CarbonLog = require('../models/CarbonLog');

exports.getStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'user' });
        const totalHabits = await Habit.countDocuments();
        const totalPosts = await Post.countDocuments();

        const allCarbonLogs = await CarbonLog.find();
        const totalCO2Log = allCarbonLogs.reduce((acc, log) => acc + log.totalCO2, 0);

        res.json({
            totalUsers,
            totalHabits,
            totalPosts,
            totalCO2Log: parseFloat(totalCO2Log.toFixed(2))
        });

    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching stats', error: error.message });
    }
};


exports.getUsers = async (req, res) => {
    try {
        const users = await User.find({ role: 'user' }).select('-password');
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ messsage: 'Error fetching users', error: error.message });
    }
};

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


exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('userId', 'firstName lastName email').sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching posts', error: error.message });
    }
};

exports.deletePost = async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id);
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting post', error: error.message });
    }
};




