const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({

    amount: {
        type: Number,
        required: true,
    },

    date: {
        type: Date,
        required: true,
    },

    category: {
        type: String,
        required: true,
    },

    description: {
        type: String,
    },

    type: {
        type: String,
        enum: ["Income", "Expense"],
        required: true,
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }

}, { timestamps: true });

module.exports = mongoose.model("Transaction", transactionSchema);