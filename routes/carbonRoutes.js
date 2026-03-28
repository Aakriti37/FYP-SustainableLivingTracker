const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const carbonController = require('../controllers/carbonController');

// Create a new carbon log
router.post('/', authMiddleware, carbonController.createCarbonLog);

// Get user's carbon footprint history
router.get('/history', authMiddleware, carbonController.getCarbonHistory);

// Get today's log
router.get('/today', authMiddleware, carbonController.getTodayCarbonLog);

module.exports = router;
