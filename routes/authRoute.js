const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();


// Register
router.post("/register", async (req, res) => {

    const { name, age, email, password } = req.body;

    const UserExists = await User.findOne({ email });

    if (UserExists) {
        return res.status(400).json({
            success: false,
            message: "User already exists"
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
        name,
        age,
        email,
        password: hashedPassword
    });

    res.status(201).json({
        success: true,
        message: "User created successfully"
    });

});


// Login
router.post("/login", async (req, res) => {

    const { email, password } = req.body;

    const UserExists = await User.findOne({ email });

    if (!UserExists) {
        return res.status(404).json({
            success: false,
            message: "User does not exist"
        });
    }

    const isMatch = await bcrypt.compare(password, UserExists.password);

    if (!isMatch) {
        return res.status(401).json({
            success: false,
            message: "Invalid Password"
        });
    }

    const token = jwt.sign(
        {
            id: UserExists._id,
            email: UserExists.email
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    );

    res.cookie("token", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    });

    res.status(200).json({
        success: true,
        message: "Login Successful"
    });

});


// Logout
router.get("/logout", (req, res) => {

    res.clearCookie("token");

    res.status(200).json({
        success: true,
        message: "Logged Out Successfully"
    });

});


// Protected Route
router.get("/dashboard", authMiddleware, (req, res) => {

    res.status(200).json({
        success: true,
        message: "Welcome to Dashboard",
        user: req.user
    });

});

module.exports = router;