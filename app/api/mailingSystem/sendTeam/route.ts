import nodemailer from 'nodemailer';
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Team from '@/models/teamModel';
import Student from '@/models/studentModel';
import Course from '@/models/courseModel';
// import mongoose from 'mongoose';
// tempId.equals(mongoose.Types.ObjectId(studentId))

/*
    Input: 
        - teamId: Unique object id of team
        - courseId: Unique object id of course
        - studentId: Unique object id of student who submits application
    Output: 
        Send email contains evaluation link to the rest of members
    Error:
        - Check if team exists
        - Check if course exists
        - Check if team is contained in courses
        - Check if student given in team or not
*/
export async function POST(request: NextRequest) {
    try {
        const { teamId, courseId, studentId } = await request.json()

        await dbConnect();
        const team = await Team.findById(teamId);
        const course = await Course.findById(courseId)
        if (!team) {
            return NextResponse.json({ error: "Team not found"}, { status: 404 })
        }
        if (!course) {
            return NextResponse.json({ error: "Course not found"}, { status: 404 })
        } 
        if (!course.teams.includes(teamId)) {
            return NextResponse.json({ error: "Team not found from course"}, { status: 404 })
        }
        if (!team.students.includes(studentId)) {
            return NextResponse.json({ error: "Student not in the team"}, { status: 404 })
        }

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        // Get email addresses from the rest of the team
        const emailList = []
        for (const tempId of team.students) {
            const student = await Student.findById(tempId);
            if (student && tempId.toString() !== studentId.toString()) {
                emailList.push(student.email);
            }
        }

        const mailingParameters = {
            from: process.env.SMTP_EMAIL,
            to: emailList.join(','),
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
            <a style="display:inline-block; background-color:#f7b602; color:black; 
            padding:8px 16px; margin-right:6px; vertical-align:middle; border-radius:4px"
            href="https://3900-capstone.vercel.app/teamEvaluationForm"><strong>Complete Here</strong></a>
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
