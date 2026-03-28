const Post = require('../models/Post');
const User = require('../models/User');
const Habit = require('../models/Habit');
const ActivityLog = require('../models/ActivityLog');

exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('userId', 'firstName lastName profilePicture')
            .populate('comments.userId', 'firstName lastName profilePicture')
            .sort({ createdAt: -1 })
            .limit(50);
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching posts', error: error.message });
    }
};

exports.createPost = async (req, res) => {
    try {
        const { content, image } = req.body;
        const post = new Post({
            userId: req.user.id,
            content,
            image
        });
        await post.save();

        // Populate user details before sending response
        const populatedPost = await Post.findById(post._id).populate('userId', 'firstName lastName profilePicture');
        
        const io = req.app.get('io');
        if (io) {
            io.emit('new_post', populatedPost);
        }
        
        res.status(201).json(populatedPost);
    } catch (error) {
        console.error("Create post error:", error);
        res.status(500).json({ message: 'Error creating post', error: error.message });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });
        
        if (post.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this post' });
        }

        await post.deleteOne();

        const io = req.app.get('io');
        if (io) {
            io.emit('delete_post', req.params.id);
        }

        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting post', error: error.message });
    }
};

exports.toggleLike = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const index = post.likes.indexOf(req.user.id);
        if (index === -1) {
            // Like
            post.likes.push(req.user.id);
        } else {
            // Unlike
            post.likes.splice(index, 1);
        }

        await post.save();
        const updatedPost = await Post.findById(req.params.id)
            .populate('userId', 'firstName lastName profilePicture')
            .populate('comments.userId', 'firstName lastName profilePicture');

        const io = req.app.get('io');
        if (io) {
            io.emit('update_post', updatedPost);
        }

        res.json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: 'Error toggling like', error: error.message });
    }
};

exports.addComment = async (req, res) => {
    try {
        const { text } = req.body;
        if (!text || text.trim() === '') {
            return res.status(400).json({ message: 'Comment text is required' });
        }

        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        post.comments.push({ userId: req.user.id, text });
        await post.save();

        const updatedPost = await Post.findById(req.params.id)
            .populate('userId', 'firstName lastName profilePicture')
            .populate('comments.userId', 'firstName lastName profilePicture');

        const io = req.app.get('io');
        if (io) {
            io.emit('update_post', updatedPost);
        }

        res.json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: 'Error adding comment', error: error.message });
    }
};

// Get Leaderboard (Top users by Habit streak)
// Simplistic leaderboard: sum of all habit streaks per user
exports.getLeaderboard = async (req, res) => {
    try {
        const users = await User.find({ role: 'user' }, 'firstName lastName _id');

        let leaderboard = await Promise.all(users.map(async (user) => {
            const logs = await ActivityLog.find({ userId: user._id });
            const totalPoints = logs.reduce((acc, curr) => acc + curr.pointsEarned, 0);
            const totalStreak = logs.length; // Approximated total acts for leaderboard display

            return {
                _id: user._id,
                name: `${user.firstName} ${user.lastName}`,
                totalPoints,
                totalStreak
            };
        }));

        // Sort by points descending
        leaderboard.sort((a, b) => b.totalPoints - a.totalPoints);

        res.json(leaderboard.slice(0, 10)); // Top 10
    } catch (error) {
        res.status(500).json({ message: 'Error generating leaderboard', error: error.message });
    }
};


