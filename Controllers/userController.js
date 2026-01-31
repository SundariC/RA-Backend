import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import sendEmail from "../Utils/sendEmail.js";
import crypto from "crypto";
import User from "../Models/UserSchema.js";

//1. Register a new user
export const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const passwordRegex = /^(?=.*[A-Z])(?=.*[@#*])[A-Za-z\d@#*]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ message: "Password must be at least 8 characters long, contain at least one uppercase letter and one special character (@, #, *)"})   
        } 
       const userExists = await User.findOne({ $or: [{username}, {email}] });
       if (userExists) return  res.status(400).json({ message: "User or Email already exist"});
       
       const hashedPassword = await bcrypt.hash(password, 10);
       const newUser = new User({ username, email, password: hashedPassword });
       await newUser.save();
       res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

//2. Login user
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found"});

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials"});

        const token = jwt.sign({ id:user._id }, process.env.JWT_SECRET, {expiresIn: "1d"});
        res.status(200).json({ token, userID: user._id, username: user.username});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

//3. Forgot Password
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User with this email does not exist"});
        }
        const resetToken = crypto.randomBytes(32).toString("hex");

        const resetUrl = `http://localhost:5173/reset-password/${resetToken}`; 

        const message = `You requested a password reset. Click this link to reset the Password: ${resetUrl}`;
        await sendEmail(user.email, "Password Reset Request", message);

        res.status(200).json({ message: "Reset link sent to your email"});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

//4. Reset Password
export const resetPassword = async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.findOneAndUpdate({ email }, { password:hashedPassword });
        res.status(200).json({ message: "Password updated successfully"});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
