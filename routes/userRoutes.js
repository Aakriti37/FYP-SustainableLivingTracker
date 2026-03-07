const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

router.get("/dashboard", authMiddleware, (req, res) => {
  // Only normal users should access
  if (req.user.role !== "user") {
    return res.status(403).json({ message: "Access denied: Users only" });
  }
  res.json({ message: `Welcome ${req.user.email}` });
});

module.exports = router;