const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();


// Name change
router.put("/update-name", authMiddleware, async (req, res) => {
    try {
        const { name } = req.body;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { name },
            { new: true }
        );

        res.json(user);
    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
});

//email

router.put("/email", authMiddleware, async (req, res) => {
    try {
        const { oldEmail, newEmail } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.email !== oldEmail) {
            return res.status(400).json({
                message: "Old email is incorrect",
            });
        }

        user.email = newEmail;

        await user.save();

        res.json(user);
    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
});

module.exports = router;