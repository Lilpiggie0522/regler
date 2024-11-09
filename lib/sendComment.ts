import nodemailer from "nodemailer";
import dbConnect from "@/lib/dbConnect";
import models from "@/models/models";

const Student = models.Student;
const Team = models.Team;
const Course = models.Course;
const Issue = models.Issue;

/*
    Input: 
        - teamId: Unique object id of team
        - courseId: Unique object id of course
        - issueId: Unique object id of issue
        - comment: Result string
    Output: 
        Send email containing comments to student
    Error:
        - Check if team exists
        - Check if course exists
        - Check if issue exists
*/
export async function sendComment(teamId: string, courseId: string, issueId: string, comment: string) {
    try {
        await dbConnect();
        const team = await Team.findById(teamId);
        const course = await Course.findById(courseId);
        const issue = await Issue.findById(issueId);
        if (!team) {
            return "team not exists";
        }
        if (!course) {
            return "course not exists";
        }
        if (!issue) {
            return "issue not exists";
        }
        const transport = nodemailer.createTransport({
            service: "gmail",
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
                subject: "A Lecturer commented on Your Dispute",
                html: 
                `
                <p>
                    Hi, <strong>${student.studentName}</strong>!
                </p>
                <p>
                    A lecturer has commented on the dispute application regarding 
                    the contribution to your group <strong>${team.teamName}</strong> 
                    in the course <strong>${course.courseName}</strong>. Comment is 
                    specified as belowed:
                </p>
                <p>
                    <strong>${comment}</strong>
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
        return "Send emails to students successfully";
    } catch (error) {
        if (error instanceof Error) {
            return "failed to send result to students";
        }
    }
}

export default sendComment;