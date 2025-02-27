import nodemailer from "nodemailer";
import 'dotenv/config';


const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    },
});

export const sendOtpEmail = async(email,otp)=>{
    try {
        const mailOptions ={
            from: process.env.EMAIL_USER,
            to: email, 
            subject: "Your OneApp OTP Code",
            text: `Your OTP code is: ${otp}. It will expire in 5 minutes.`,
        }

        await transporter.sendMail(mailOptions);
        console.log(`send otp to ${email}`);
        
    } catch (error) {
        console.error("Error sending OTP email:", error);
    }
}