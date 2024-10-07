import nodemailer from 'nodemailer';
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect'
import models from '@/models/models'

/*
    Input: 
        - studentName: Student Name (Could be optional?)
        - email: Student's email address
        - authCode: Authentication code
    Output: 
        Send email contains authentication code to student
    Error:
        - Check if student exists
        - Check if student is correct by name
        - Check if email given matches student's email
*/
export async function POST(request: NextRequest) {
    try {
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD,
            },
        });
        const { studentName, email, authCode } = await request.json();

        
        // Check if email exists and student name is correct
        await dbConnect();
        const Student = models.Student;
        const student = await Student.findOne({ email: email });
        if (!student) {
            return NextResponse.json({ error: "Invalid Email Address" }, { status: 404 });
        }
        if (student.studentName !== studentName) {
            return NextResponse.json({ error: "Incorrect Student Name" }, { status: 400 });
        }
        if (student.email !== email) {
            return NextResponse.json({ error: "Given email does not match student's email" }, { status: 400 });
        }
        
        const mailingParameters = {
            from: process.env.SMTP_EMAIL,
            to: email,
            subject: 'UNSW Evaluation System Verification Code (Do not reply)',
            html: `
            <p>
                Hi, ${studentName}!
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
                UNSW Development Team
            </p>
            `,
        };
        const info = await transport.sendMail(mailingParameters);
        return NextResponse.json({data: info}, {status: 200})
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error - Team Email:', error);
            return NextResponse.json({error: error.message}, {status: 502})
        }
    }
}