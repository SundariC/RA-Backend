import express from "express";
import { registerUser, loginUser, forgotPassword, resetPassword } from "../Controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password", resetPassword);

export default router;