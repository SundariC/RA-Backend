import express from "express";
import { register, loginUser, forgotPassword, resetPassword, sendFeedback } from "../Controllers/userController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password", resetPassword);
router.post("/send-feedback", sendFeedback);

export default router;