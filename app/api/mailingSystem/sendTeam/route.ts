import nodemailer from 'nodemailer';
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Team from '@/models/teamModel';
import Student from '@/models/studentModel';
import Course from '@/models/courseModel';


export async function POST(request: NextRequest) {
    try {
        const { teamId, courseId } = await request.json()

        await dbConnect();
        const team = await Team.findById( { _id: teamId } );
        // Check if team exists
        if (!team) {
            return NextResponse.json({ error: "Team not found"}, { status: 404 })
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
        // Get course name and check if team exists in course.
        const course = await Course.findById({ _id: courseId })
        if (!course) {
            return NextResponse.json({ error: "Course not found"}, { status: 404 })
        } else if (!course.teams.includes(teamId)) {
            return NextResponse.json({ error: "Team not found from course"}, { status: 404 })
        }


        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD,
            },
        });

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
                in the course <strong>${course.courseName}</strong>. 
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
            <a href = 'https://3900-capstone.vercel.app/teamEvaluationForm'>
                <button>
                    <strong>Complete Here</strong>
				</button>
            <a>
            `,
        };
        // <a href = 'http://localhost:3000/teamEvaluationForm'>
        const info = await transport.sendMail(mailingParameters);
        return NextResponse.json({data: info}, {status: 200})
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error - Team Email:', error);
            return NextResponse.json({error: error.message}, {status: 502})
        }
    }
}
