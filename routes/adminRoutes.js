const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminController = require('../controllers/adminController');

// If not, we can implement it locally or use authMiddleware and check role
const adminCheck = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Admin only' });
  }
};

// GET /api/admin/stats
router.get('/stats', authMiddleware, adminCheck, adminController.getStats);

// GET /api/admin/users
router.get('/users', authMiddleware, adminCheck, adminController.getUsers);

// DELETE /api/admin/users/:id
router.delete('/users/:id', authMiddleware, adminCheck, adminController.deleteUser);

// GET /api/admin/posts
router.get('/posts', authMiddleware, adminCheck, adminController.getPosts);

// DELETE /api/admin/posts/:id
router.delete('/posts/:id', authMiddleware, adminCheck, adminController.deletePost);

module.exports = router;