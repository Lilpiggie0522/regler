import nodemailer from 'nodemailer';
import dbConnect from '@/lib/dbConnect';
import models from "@/models/models";

const Student = models.Student;
const Team = models.Team;
const Course = models.Course;
const Issue = models.Issue;

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
        - Check if issue exists
*/
export async function sendResult(teamId: string, courseId: string, issueId: string, result: string) {
    try {
        await dbConnect();
        const team = await Team.findById(teamId);
        const course = await Course.findById(courseId);
        const issue = await Issue.findById(issueId);
        if (!team) {
            // console.log('team not exists')
            return 'team not exists';
        }
        if (!course) {
            // console.log('course not exists')
            return 'course not exists';
        }
        if (!issue) {
            // console.log('issue not exists')
            return 'issue not exists';
        }
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        for (const tempId of team.students) {
            const student = await Student.findById(tempId);
            const mailingParameters = {
                from: process.env.SMTP_EMAIL,
                to: student.email,
                subject: 'Contribution Dispute Completed',
                html: 
                `
                <p>
                    Hi, <strong>${student.studentName}</strong>!
                </p>
                <p>
                    Your lecturer has finalised the dispute application regarding 
                    the contribution to your group <strong>${team.teamName}</strong> 
                    in the course <strong>${course.courseName}</strong>. Result 
                    specified as belowed:
                </p>
                <p>
                    <strong>${result}</strong>
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
        }
        return 'Send emails to students successfully';
    } catch (error) {
        if (error instanceof Error) {
            // console.error('Error - sendResult');
            return 'failed to send result to students';
        }
    }
}
