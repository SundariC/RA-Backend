// import nodemailer from "nodemailer";

// const sendEmail = async (email, subject, text) => {
//     try {
//         const transporter = nodemailer.createTransport({
//             service: "gmail",
//             auth: {
//                 user: process.env.PASS_MAIL,
//                 pass: process.env.PASS_KEY
//             },
//         });
//         await transporter.sendMail({
//             from: process.env.PASS_MAIL,
//             to: email,
//             subject: subject,
//             text: text,
//         });
//         console.log("Email sent successfully to:" + email);
//         return true;
//     } catch (err) {
//         console.log("Email error:", err.message);
//         throw new Error("Email sending failed");
//     }
// }


// export default sendEmail;

import SibApiV3Sdk from "sib-api-v3-sdk";
import dotenv from "dotenv";

dotenv.config();

const client = SibApiV3Sdk.ApiClient.instance;
const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

const sendEmail = async (to, subject, text) => {
  try {
    const emailData = {
      sender: {
        name: "Recipes App",
        email: process.env.PASS_MAIL,
      },
      to: [
        {
          email: to,
        },
      ],
      subject,
      textContent: text,
    };

    await tranEmailApi.sendTransacEmail(emailData);
    console.log("Email sent successfully via Brevo");
  } catch (error) {
    console.error("Brevo email error:", error);
    throw error;
  }
};

export default sendEmail;
