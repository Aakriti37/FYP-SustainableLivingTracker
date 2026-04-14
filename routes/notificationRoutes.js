// routes/notificationRoutes.js

const express                  = require('express');
const router                   = express.Router();
const authMiddleware           = require('../middleware/authMiddleware');
const notificationController   = require('../controllers/notificationController');

// Get all notifications + unread count
router.get('/', authMiddleware, notificationController.getNotifications);

// Get user badges
router.get('/badges', authMiddleware, notificationController.getBadges);

// Generate reminders (call on page load)
router.post('/generate-reminders', authMiddleware, notificationController.generateReminders);

// Mark one as read
router.patch('/:id/read', authMiddleware, notificationController.markAsRead);

// Mark all as read
router.patch('/read-all', authMiddleware, notificationController.markAllAsRead);

// Delete one notification
router.delete('/:id', authMiddleware, notificationController.deleteNotification);

module.exports = router;
