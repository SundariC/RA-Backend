import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./Database/dbConfig.js";
import recipeRouter from "./Routes/RecipeRoutes.js";
import userRouter from "./Routes/UserRoutes.js";

dotenv.config();


//1. Connect to Database
connectDB();

//2.Body Parser MiddleWare
const app = express();

app.use(express.json());
app.use(cors());

//3. Test Route
app.get("/", (req, res) => {
    res.send("API is running...");
});

//4. Routes
app.use("/api/recipe", recipeRouter);
app.use("/api/user", userRouter);

//5. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
