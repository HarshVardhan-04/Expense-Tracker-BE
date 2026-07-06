const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    amount:{
        type:Number,
        require:true
    },
    date:{
        type:Date,
        require:true
    },
    category:{
        type:String,
        require:true,
    },
    description:{
        type:String,
        require:true
    }
})

module.exports = mongoose.model("Expense" , userSchema);