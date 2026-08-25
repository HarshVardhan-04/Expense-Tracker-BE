const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");


const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoute");
const expenseRoutes = require("./routes/transactionRoute");
const searchRoutes = require("./routes/searchRoute");
const userRoute = require("./routes/userRoute");
const settingRoute = require("./routes/settingRoute");

const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: "https://expense-tracker-fe-tawny.vercel.app",
    // origin : " http://localhost:5173",
    credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


dotenv.config();

connectDB();



app.get("/" , (req, res)=>{
    res.send("Backend is Running");
});

app.use("/api", authRoutes);
app.use("/api", expenseRoutes);
app.use("/api", searchRoutes); // handle search filter delete
app.use("/api/user", userRoute);
app.use("/api" , settingRoute);



app.listen(PORT , ()=>{
    console.log("port is working")
});