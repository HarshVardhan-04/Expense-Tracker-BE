const express = require("express");
const Expense = require("../models/Expense");
const router = express.Router();

router.post("/add" , async (req,res)=>{
    const{amount, date , category,  description} = req.body;

    const expense = await Expense.create({
        amount,
        date,
        category,
        description,
    });

     res.status(201).json({
        success: true,
        message: "Expense Added",
        expense,
    });
});

module.exports = router;