import nodemailer from "nodemailer";
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
        Create team reminder to schedule
    Error:
        - Check if team exists
        - Check if course exists
*/
export async function sendTeamEmail(teamId: string, courseId: string, studentId:string, issueId: string) {
    try {
        await dbConnect();
        const team = await Team.findById(teamId);
        const course = await Course.findById(courseId);
        if (!team) {
            return "Team not found"
        }
        if (!course) {
            return "Course not found"
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
            }
        }

        // Send notification to tutors
        const emailList = [];
        for (const mentorId of team.mentors) {
            const temp = await Admin.findById(mentorId);
            if (!temp) {
                continue
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
            schedule: weeklySchedule,
            students: restId,
            mentors: team.mentors,
        });
        
        return { message: "Notification sent to the team and tutors successfully" };

    } catch (error) {
        if (error instanceof Error) {
            return { message: `Error - sendTeam ${error}` }
        }
    }
}

export default sendTeamEmail;