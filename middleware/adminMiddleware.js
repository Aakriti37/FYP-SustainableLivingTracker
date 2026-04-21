const authMiddleware = require("./authMiddleware");

// Admin-only middleware
const adminMiddleware = (req, res, next) => {
  authMiddleware(req, res, () => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }
    
    next();
  });
};

module.exports = adminMiddleware;