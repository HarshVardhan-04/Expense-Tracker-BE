const express = require("express");
const router = express.Router();

const Transaction = require("../models/Transactions");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/add", authMiddleware, async (req, res) => {

    try {

        const { amount, date, category, description, type } = req.body;

        const transaction = await Transaction.create({

            amount,
            date,
            category,
            description,
            type,
            user: req.user.id

        });

        res.status(201).json({

            success: true,
            message: "Transaction Added",
            transaction

        });

    } catch (err) {

        res.status(500).json({

            success: false,
            message: err.message

        });

    }

});

    router.get("/expenses", authMiddleware, async (req, res) => {

    try {

        const expenses = await Transaction.find({

            user: req.user.id,
            type: "Expense"

        });

        res.json(expenses);

    } catch (err) {

        res.status(500).json({

            success: false,
            message: err.message

        });

    }

});

      router.get("/income", authMiddleware, async (req, res) => {

    try {

        const incomes = await Transaction.find({

            user: req.user.id,
            type: "Income"

        });

        res.json(incomes);

    } catch (err) {

        res.status(500).json({

            success: false,
            message: err.message

        });

    }

});

      router.get("/transactions", authMiddleware, async (req, res) => {

    try {

        const transactions = await Transaction.find({

            user: req.user.id

        }).sort({

            date: -1

        });

        res.json(transactions);

    } catch (err) {

        res.status(500).json({

            success: false,
            message: err.message

        });

    }

});

    router.get("/dashboard", async (req, res) => {
    try {

        const transactions = await Transaction.find()
            .sort({ date: -1 }); // Latest first

        res.json(transactions);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

// const express = require("express");
// const Expense = require("../models/Transactions");
// const router = express.Router();
// const authMiddleware = require("../middlewares/authMiddleware");

// router.post("/add", authMiddleware, async (req, res) => {
//   try {
//     const { amount, date, category, description } = req.body;

//     const expense = await Expense.create({
//       amount,
//       date,
//       category,
//       description,
//       user: req.user.id,
//     });

//     res.status(201).json({
//       success: true,
//       message: "Expense Added",
//       expense,
//     });

//   } catch (err) {
//     res.status(500).json({
//       message: err.message,
//     });
//   }
// });

// router.get("/expenses", authMiddleware, async (req, res) => {
//   try {

//     const expenses = await Expense.find({
//       user: req.user.id,
//     });

//     res.status(200).json(expenses);   // ✅ THIS WAS MISSING

//   } catch (err) {

//     res.status(500).json({
//       message: err.message,
//     });

//   }
// });

// module.exports = router;