const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const goalController = require('../controllers/goalController');

// Get all goals for user
router.get('/', authMiddleware, goalController.getGoals);

// Create a goal
router.post('/', authMiddleware, goalController.createGoal);

// Update goal status
router.patch('/:id/status', authMiddleware, goalController.updateGoalStatus);

// Delete goal
router.delete('/:id', authMiddleware, goalController.deleteGoal);

module.exports = router;
