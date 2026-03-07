const express = require("express");
const router = express.Router();
const adminMiddleware = require("../middleware/adminMiddleware");

router.get("/admin/dashboard", adminMiddleware, (req, res) => {
  res.json({ message: `Welcome Admin ${req.user.email}` });
});

module.exports = router;