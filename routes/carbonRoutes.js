// routes/carbonRoutes.js

const express        = require('express');
const router         = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const carbonController = require('../controllers/carbonController');

// Create a new carbon log
// POST /api/carbon
router.post('/', authMiddleware, carbonController.createCarbonLog);

// Get carbon history (last 50 logs)
// GET /api/carbon/history
router.get('/history', authMiddleware, carbonController.getCarbonHistory);

// Get today's carbon log
// GET /api/carbon/today
router.get('/today', authMiddleware, carbonController.getTodayCarbonLog);

// Get total carbon stats
// GET /api/carbon/stats
router.get('/stats', authMiddleware, carbonController.getCarbonStats);

// Update a carbon log
// PUT /api/carbon/:id
router.put('/:id', authMiddleware, carbonController.updateCarbonLog);

// Delete a carbon log
// DELETE /api/carbon/:id
router.delete('/:id', authMiddleware, carbonController.deleteCarbonLog);

module.exports = router;
