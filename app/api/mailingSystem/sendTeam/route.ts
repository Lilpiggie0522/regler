import nodemailer from 'nodemailer';
import { NextRequest, NextResponse } from 'next/server';
// import { MongoClient } from 'mongodb'

// interface EmailTeamInfo {
//     firstName: string,
//     lastName: string,
//     course: string,
//     project: string,
//     team: string,
// }

export async function POST(request: NextRequest) {
    try {
        const transport = nodemailer.createTransport({
            service: 'gmail',  // SMTP server? Other server
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD,
            },
            // How to use without self-signed certificates, gmail from only?
            // Now is development-only, not for production
        });

        // Get team members' information from database
        // request Team members' information given student's id name email?
        // Customisation? Name, course, group, project.
        // to: ['z5361545@ad.unsw.edu.au', 'z5361545@ad.unsw.edu.au',]
        const mailingParameters = {
            from: process.env.SMTP_EMAIL,
            to: 'z5361545@ad.unsw.edu.au',
            subject: 'Group Project Contribution Dispute',
            html: `
            <p>
                Hi!
            </p>
            <p>
                We have received a dispute application regarding 
                the contribution to your group project in this course. 
                To ensure fairness and uphold the quality of learning, 
                we sincerely ask that you fill out the following form 
                to assist us solve the issue promptly. 
                We appreciate your cooperation!
            </p>
            <p>
                If the information is not correct, or this message does
                not apply to you, please ignore this message. Thank you!
            </p>
            <p>
                Regards,<br>
                UNSW Development Team
            </p>
            <a href = 'https://forms.office.com/Pages/ResponsePage.aspx?id=pM_2PxXn20i44Qhnufn7o2SAAYsNGbpPtDpcJj4gjllUNVdESFhXWk5QMTQ1VTVBVUs2VVJBTDVZWi4u'>Click here to complete the form<a>
            `,
        };

        const info = await transport.sendMail(mailingParameters);
        return NextResponse.json({data: info}, {status: 200})
    } catch (error) {
        console.error('Error - Team Email:', error);
        return NextResponse.json({error: error.message}, {status: 502})
    }
}
