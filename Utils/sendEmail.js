import nodemailer from "nodemailer";

const sendEmail = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.PASS_MAIL,
                pass: process.env.PASS_KEY
            },
        });
        await transporter.sendMail({
            from: process.env.PASS_MAIL,
            to: email,
            subject: subject,
            text: text,
        });
        console.log("Email sent successfully to:" + email);
        return true;
    } catch (err) {
        console.log("Email error:", err.message);
        throw new Error("Email sending failed");
    }
}


export default sendEmail;