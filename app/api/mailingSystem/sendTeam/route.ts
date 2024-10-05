import nodemailer from 'nodemailer';
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Team from '@/models/teamModel';
import Student from '@/models/studentModel';


// interface EmailTeamInfo {
//     course: string,
//     project: string,
//     team: string,
// }

export async function POST(request: NextRequest) {
    try {
        // const { teamId, teamName } = await request.json()
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD,
            },
        });
        // await dbConnect();
        // const team = await Team.findById(teamId);

        const course: string = 'COMP3900'
        const emailList = ['z5361545@ad.unsw.edu.au']
        const teamName: string = "Arcaea";
        const mailingParameters = {
            from: process.env.SMTP_EMAIL,
            to: emailList,
            subject: 'Group Project Contribution Dispute',
            html: `
            <p>
                Hi!
            </p>
            <p>
                We have received a dispute application regarding 
                the contribution to your group <strong>${teamName}</strong> 
                in the course <strong>${course}</strong>. 
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
            <a href = 'http://localhost:3000/teamEvaluationForm'>
                <button>
                    <strong>Complete Here</strong>
				</button>
            <a>
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
