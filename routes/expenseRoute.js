const express = require("express");
const Expense = require("../models/Expense");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { amount, date, category, description } = req.body;

    const expense = await Expense.create({
      amount,
      date,
      category,
      description,
      user: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Expense Added",
      expense,
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.get("/expenses", authMiddleware, async (req, res) => {
  try {

    const expenses = await Expense.find({
      user: req.user.id,
    });

    res.status(200).json(expenses);   // ✅ THIS WAS MISSING

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }
});

module.exports = router;