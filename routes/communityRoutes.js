const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const communityController = require('../controllers/communityController');

// Get all posts (Feed)
router.get('/posts', authMiddleware, communityController.getPosts);

// Create a post
router.post('/posts', authMiddleware, communityController.createPost);

// Delete a post
router.delete('/posts/:id', authMiddleware, communityController.deletePost);

// Like / Unlike a post
router.post('/posts/:id/like', authMiddleware, communityController.toggleLike);

// Add Comment to a post
router.post('/posts/:id/comment', authMiddleware, communityController.addComment);

// Get Leaderboard (Top users by Habit streak)
router.get('/leaderboard', authMiddleware, communityController.getLeaderboard);

module.exports = router;
