import nodemailer from "nodemailer";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";

import models from "@/models/models";


const Student = models.Student;
const Team = models.Team;
const Course = models.Course;
const Reminder = models.Reminder;
const Admin = models.Admin;


/*
    Input: 
        - teamId: Unique object id of team
        - courseId: Unique object id of course
        - studentId: Unique object id of student who submits application
        - issueId: Unique object id of issue
    Output: 
        Send email contains evaluation link to the rest of members
        Send confirmation email to initial applicant
    Error:
        - Check if team exists
        - Check if course exists
        // - Check if team is contained in courses
        // - Check if student given in team or not
*/
export async function POST(request: NextRequest) {
    try {
        const { teamId, courseId, studentId, issueId } = await request.json()

        await dbConnect();
        const team = await Team.findById(teamId);
        const course = await Course.findById(courseId);
        if (!team) {
            return NextResponse.json({ error: "Team not found"}, { status: 404 })
        }
        if (!course) {
            return NextResponse.json({ error: "Course not found"}, { status: 404 })
        } 
        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        const restId = []
        for (const tempId of team.students) {
            const student = await Student.findById(tempId);
            if (student && tempId.toString() !== studentId.toString()) {
                restId.push(tempId);
                const mailingParameters = {
                    from: process.env.SMTP_EMAIL,
                    to: student.email,
                    subject: "Group Project Contribution Dispute",
                    html: 
                    `
                    <p>
                        Hi, <strong>${student.studentName}</strong>!
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
                        not apply to you, please contact your course admin as 
                        soon as possible. Thank you!
                    </p>
                    <p>
                        Regards,<br>
                        Contribalance
                    </p>
                    <a style="display:inline-block; background-color:#f7b602; color:black; padding:8px 16px; border-radius:4px"
                    href="http://localhost:3000/studentLogin"><strong>Complete Here</strong></a>
                    `
                };
                await transport.sendMail(mailingParameters);       
            } else if (student && tempId.toString() === studentId.toString()) {
                const mailingParameters = {
                    from: process.env.SMTP_EMAIL,
                    to: student.email,
                    subject: "Submission Confirmed (Do not reply)",
                    html: 
                    `
                    <p>
                        Hi, <strong>${student.studentName}</strong>!
                    </p>
                    <p>
                        We have received your request of contribution review and
                        inform the rest of your team members in <strong>
                        ${team.teamName}</strong> to fill out forms 
                        anonymously. The evaluation result will be released via
                        email after lecturers make adjustment. Please be rest assured.
                    </p>
                    <p>
                        If the information is not correct, or this message does
                        not apply to you, please contact your course admin as 
                        soon as possible. Thank you!
                    </p>
                    <p>
                        Regards,<br>
                        Contribalance
                    </p>
                    `
                };
                await transport.sendMail(mailingParameters);  
            } else {
                console.log("Error: Partial notification failed due to student not exists");
            }
        }

        // Send notification to tutors
        const emailList = [];
        for (const mentorId of team.mentors) {
            const temp = await Admin.findById(mentorId);
            if (!temp) {
                return NextResponse.json({ error: "Tutor not found"}, { status: 404 })
            }
            emailList.push(temp.email);
        }
        const mailingParameters = {
            from: process.env.SMTP_EMAIL,
            to: emailList.join(","),
            subject: "New Contribution Dispute",
            html: 
            `
            <p>
                Hi!
            </p>
            <p>
                We have received a new dispute application regarding 
                the contribution to the group <strong>${team.teamName}</strong> 
                in the course <strong>${course.courseName}</strong>. 
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
                Contribalance
            </p>
            `
        };
        await transport.sendMail(mailingParameters);


        // Set reminder for the rest of team member
        const weeklySchedule = new Date(new Date().getTime() + 10*60*1000);
        // const weeklySchedule = new Date(new Date().getTime() + 7*24*60*60*1000);
        await Reminder.create({
            team: teamId,
            course: courseId,
            issue: issueId,
            // timestamp: timestamp,
            schedule: weeklySchedule,
            students: restId,
            mentors: team.mentors,
        });
        
        return NextResponse.json({ message: "Notification sent to the team and tutors successfully" }, { status: 200 })


    } catch (error) {
        if (error instanceof Error) {
            console.error("Error - sendTeam", error);
            return NextResponse.json({ error: error.message }, { status: 502 })
        }
    }
}
