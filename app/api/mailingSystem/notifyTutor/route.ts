import nodemailer from 'nodemailer';
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';

import models from "@/models/models";

const Admin = models.Admin;


/*
    Input: 
        - mentors: List of Admin ids (Tutor) in the team
        - team: Team name in string
        - course: course name in string
    Output: 
        Send email to notify tutors, call by sendTeam
    Error:
        - Check if tutor exists
*/
export async function POST(request: NextRequest) {
    try {
        const { mentors, team, course } = await request.json()

        await dbConnect();

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD,
            },
        });
        
        const emailList = [];
        for (const mentorId of mentors) {
            const temp = await Admin.findById(mentorId);
            if (!temp) {
                return NextResponse.json({ error: "Tutor not found"}, { status: 404 })
            }
            emailList.push(temp.email);
        }
        const mailingParameters = {
            from: process.env.SMTP_EMAIL,
            to: emailList.join(','),
            subject: 'New Contribution Dispute (Do not reply)',
            html: 
            `
            <p>
                Hi!
            </p>
            <p>
                We have received a new dispute application regarding 
                the contribution to the group <strong>${team}</strong> 
                in the course <strong>${course}</strong>. 
                Please log in to Contribalance and provide your opinion
                to assist us solve the issue promptly.
                We appreciate your cooperation!
            </p>
            <p>
                If the information is not correct, or this message does
                not apply to you, please contact the course admin as 
                soon as possible. Thank you!
            </p>
            <p>
                Regards,<br>
                UNSW Development Team
            </p>
            `
        };
        await transport.sendMail(mailingParameters);      

        return NextResponse.json({message: 'Notification sent successfully'}, {status: 200})


    } catch (error) {
        if (error instanceof Error) {
            console.error('Error - notifyTutor:', error);
            return NextResponse.json({error: error.message}, {status: 502})
        }
    }
}
