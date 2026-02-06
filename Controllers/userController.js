import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import sendEmail from "../Utils/sendEmail.js";
import crypto from "crypto";
import User from "../Models/UserSchema.js";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

//1. Register a new user

export const register = async (req, res) => {
    try {
        const { username, password, email } = req.body;

        // 1. Check if user already exists
        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(400).json({ message: "User already exists!" });
        }

        // 2. Hash the password (10 salt rounds)
        // Mukkiam: bcrypt install aagi irukanum (npm install bcrypt)
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Create and Save New User
        const newUser = new User({
            username,
            email, // Email-um schema-la irundha sethukonga
            password: hashedPassword,
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully!" });

    } catch (err) {
        console.error("Register Error:", err); // Intha log terminal-la varum
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};
// export const registerUser = async (req, res) => {
//     try {
//         const { username, email, password } = req.body;
//         const passwordRegex = /^(?=.*[A-Z])(?=.*[@#*])[A-Za-z\d@#*]{8,}$/;
//         if (!passwordRegex.test(password)) {
//             return res.status(400).json({ message: "Password must be at least 8 characters long, contain at least one uppercase letter and one special character (@, #, *)"})   
//         } 
//        const userExists = await User.findOne({ $or: [{username}, {email}] });
//        if (userExists) return  res.status(400).json({ message: "User or Email already exist"});
       
//        const hashedPassword = await bcrypt.hash(password, 10);
//        const newUser = new User({ username, email, password: hashedPassword });
//        await newUser.save();
//        res.status(201).json({ message: "User registered successfully" });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };

//2. Login user
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found"});

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials"});

        const token = jwt.sign({ id:user._id }, process.env.JWT_SECRET, {expiresIn: "1d"});
        res.status(200).json({ token, userID: user._id, username: user.username, email: user.email});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

//3. Forgot Password
// export const forgotPassword = async (req, res) => {
//     try {
//         const { email } = req.body;
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(404).json({ message: "User with this email does not exist"});
//         }
//         const resetToken = crypto.randomBytes(32).toString("hex");

//         const resetUrl = `http://localhost:5173/reset-password/$/${user._id}/${resetToken}`; 

//         const message = `You requested a password reset. Click this link to reset the Password: ${resetUrl}`;
//         await sendEmail(user.email, "Password Reset Request", message);

//         res.status(200).json({ message: "Reset link sent to your email"});
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// }
export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        // Step 1: Check user
        const user = await User.findOne({ email }); // Import panna name correct-ah nu check pannunga
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        // Step 2: Generate Token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });

        // Step 3: Setup Transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.PASS_MAIL,
                pass: process.env.PASS_KEY    // Unga 16-digit Google App Password
            }
        });

        const resetLink = `http://localhost:5173/reset-password/${user._id}/${token}`;

        const mailOptions = {
            from: process.env.PASS_MAIL,
            to: email,
            subject: 'Password Reset Link - Recipe App',
            html: `
                <p>You requested a password reset.</p>
                <p>Click the link below to reset your password. This link is valid for 15 minutes:</p>
                <a href="${resetLink}">${resetLink}</a>
            `
        };

        // Step 4: Send Mail & Respond
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: "Error sending email", error: error.message });
            } else {
                return res.status(200).json({ message: "Reset link sent to your email!" });
            }
        });

    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

//4. Reset Password
export const resetPassword = async (req, res) => {
    const { id, token } = req.params;
    const { password } = req.body;

    try {
        // 1. Verify token
        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Invalid or expired token" });
            }

            // 2. Hash new password
            const hashedPassword = await bcrypt.hash(password, 10);

            // 3. Update User Password in DB
            await User.findByIdAndUpdate({ _id: id }, { password: hashedPassword });

            return res.status(200).json({ message: "Password updated successfully" });
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

//5. send feedback 
// export const sendFeedback = async (req, res) => {
//     try {
//         const { email, message } = req.body;
//         const ownerEmail = process.env.PASS_MAIL; // Inga unga mail ID kudunga

//         const emailContent = `
//             New Feedback from ChefCloud User:
//             User Email: ${email}
//             Message: ${message}
//         `;

//         await sendEmail(ownerEmail, "ChefCloud User Feedback", emailContent);
//         res.status(200).json({ message: "Feedback sent successfully!" });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };

// Controllers/userController.js
// export const sendFeedback = async (req, res) => {
//     try {
//         const { email, message } = req.body;
        
//         if (!email || !message) {
//             return res.status(400).json({ message: "Email and message are required" });
//         }

//         console.log(`New Feedback from ${email}: ${message}`);
        
//         // Success response kandippa anupuna thaan frontend-la "Feedback sent" toast varum
//         res.status(200).json({ success: true, message: "Feedback sent successfully!" });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };


export const sendFeedback = async (req, res) => {
    try {
        const { email, message } = req.body;

        // 1. Mail Transporter setup (Google Gmail use pannalam)
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.PASS_MAIL,
                pass: process.env.PASS_KEY   
            },
        });

        // 2. Mail Options
        const mailOptions = {
            from: email, // User oda email
            to: process.env.PASS_MAIL, // Ungaluku thaan mail varanum
            subject: `ChefCloud Feedback from ${email}`,
            text: message,
        };

        // 3. Send Mail
        await transporter.sendMail(mailOptions);

        res.status(200).json({ success: true, message: "Feedback sent to owner's email!" });
    } catch (err) {
        console.error("Mail Error:", err);
        res.status(500).json({ success: false, message: "Server error while sending mail" });
    }
};