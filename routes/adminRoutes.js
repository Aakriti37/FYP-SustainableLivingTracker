// routes/adminRoutes.js

const express        = require('express');
const router         = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminController = require('../controllers/adminController');

const adminCheck = (req, res, next) => {
    if (req.user?.role === 'admin') next();
    else res.status(403).json({ message: 'Access denied: Admin only' });
};

router.get('/stats',       authMiddleware, adminCheck, adminController.getStats);
router.get('/analytics',   authMiddleware, adminCheck, adminController.getAnalytics);
router.get('/users',       authMiddleware, adminCheck, adminController.getUsers);
router.delete('/users/:id', authMiddleware, adminCheck, adminController.deleteUser);
router.get('/posts',       authMiddleware, adminCheck, adminController.getPosts);
router.delete('/posts/:id', authMiddleware, adminCheck, adminController.deletePost);
router.get('/carbon-logs', authMiddleware, adminCheck, adminController.getCarbonLogs);

module.exports = router;
