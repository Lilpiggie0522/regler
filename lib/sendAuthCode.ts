import nodemailer from "nodemailer";
import dbConnect from "@/lib/dbConnect"
import models from "@/models/models"

/*
    Input: 
        - studentName: Student Name (Could be optional?)
        - email: Student's email address
        - authCode: Authentication code
    Output: 
        Send email contains authentication code to student
    Error:
        - Check if student exists
        - Check if admin exists
*/
export async function sendAuthCode(email: string, authCode: string, role: string) {
    try {
        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        // Check if email exists and student name is correct
        await dbConnect();
        const Student = models.Student;
        const Admin = models.Admin;
        if (role === "student") {
            const student = await Student.findOne({ email: email });
            if (!student) {
                // console.error("Invalid Email Address");
                return "Invalid Email Address";
            }
        } else {
            const admin = await Admin.findOne({ email: email });
            if (!admin) {
                // console.error("Invalid Email Address");
                return "Invalid Email Address";
            }
        }


        const mailingParameters = {
            from: process.env.SMTP_EMAIL,
            to: email,
            subject: "Contribalance Verification Code (Do not reply)",
            html: `
            <p>
                Hi!
            </p>
            <p>
                Your verification code is: <strong>${authCode}</strong>.
            </p>
            <p>
                This verification code will expire in 5 minutes.
                Please keep it private and don't share it with others.
            </p>
            <p>
                Regards,<br>
                Contribalance
            </p>
            `,
        };
        await transport.sendMail(mailingParameters);
        // console.error(`Failed to send email: ${info}`)
        return "Send verification code successfully."

    } catch (error) {
        if (error instanceof Error) {
            console.error("Unexpected error", error);
            return `Unexpected error ${error}`
        }
    }
}

export default sendAuthCode;