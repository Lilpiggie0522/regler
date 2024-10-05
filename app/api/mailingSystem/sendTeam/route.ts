import nodemailer from 'nodemailer';
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Team from '@/models/teamModel';
import Student from '@/models/studentModel';


export async function POST(request: NextRequest) {
    try {
        // const { teamId } = await request.json()
        const teamId = "6700eaee7ae942fe983415c8"
        
        await dbConnect();
        const team = await Team.findById( { _id: teamId } );
        // Check if team exists
        if (!team) {
            return NextResponse.json({ error: "Team not found "}, { status: 404 })
        }
        // Get students' email
        let i = 0;
        const emailList = []

        for (;team.students[i];) {
            const student = await Student.findById({ _id: team.students[i] })
            if (student !== null) {
                emailList.push(student.email)
            }
            i++;
        }

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        const course: string = 'COMP3900'
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
                the contribution to your group <strong>${team.teamName}</strong> 
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
