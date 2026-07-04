const mongoose = require("mongoose");

const connectDB = async ()=>{
    await mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("MongoDB connection is successful");
    }).catch((err)=>{
        console.log("Connection Failed");
        console.log(err);
    });
}

module.exports = connectDB;