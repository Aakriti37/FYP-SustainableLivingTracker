const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const habitController = require('../controllers/habitController');

// Get all habits for the logged-in user
router.get('/', authMiddleware, habitController.getHabits);

// Create a new habit
router.post('/', authMiddleware, habitController.createHabit);

// Update a habit
router.put('/:id', authMiddleware, habitController.updateHabit);

// Delete a habit
router.delete('/:id', authMiddleware, habitController.deleteHabit);

// Log an activity for a habit
router.post('/:id/log', authMiddleware, habitController.logActivity);

// Get recent activity logs
router.get('/activities/recent', authMiddleware, habitController.getRecentActivities);

module.exports = router;
