const express = require("express");
const router = express.Router();

const Transaction = require("../models/Transactions");

router.get("/search/:key", async (req, res) => {
    try {

        const key = req.params.key;

        const conditions = [
            { category: { $regex: key, $options: "i" } }
        ];

        if (!isNaN(key)) {
            conditions.push({ amount: Number(key) });
        }

        const data = await Transaction.find({
            $or: conditions
        });

        res.json(data);

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});

module.exports = router;

