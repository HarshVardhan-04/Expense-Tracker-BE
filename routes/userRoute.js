// routes/userRoute.js

const express = require("express");
const router = express.Router();
const User = require("../models/user");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/me", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;