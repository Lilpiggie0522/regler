import nodemailer from 'nodemailer';
import dbConnect from '@/lib/dbConnect';

import models from "@/models/models";

const Team = models.Team;
const Course = models.Course;
const Admin = models.Admin;
const Issue = models.Issue;


/*
    Input: 
        - teamId: Unique object id of team
        - courseId: Unique object id of course
        - issueId: Unique object id of issue
        - lecturers: List of lecturer object id
    Output: 
        Send email to lecturers when tutor submits opinion
    Error:
        - Check if team exists
        - Check if course exists
        - Check if issue exists
*/
export async function sendLecturerTutor(teamId: string, courseId: string, issueId: string, lecturers: string[]) {
    try {
        await dbConnect();
        const team = await Team.findById(teamId);
        const course = await Course.findById(courseId);
        const issue = await Issue.findById(issueId);
        if (!team) {
            return 'team not exists';
        }
        if (!course) {
            return 'course not exists';
        }
        if (!issue) {
            return 'issue not exists';
        }
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        
        for (const tempId of lecturers) {
            const lecturer = await Admin.findById(tempId);
            const mailingParameters = {
                from: process.env.SMTP_EMAIL,
                to: lecturer.email,
                subject: 'Tutor Opinion Submission on Contribalance',
                html: 
                `
                <p>
                    Hi!
                </p>
                <p>
                    A tutor has provided opinion the dispute application regarding 
                    the dispute of the group <strong>${team.teamName}</strong> 
                    in the course <strong>${course.courseName}</strong>. 
                    Please log in to and check it on Contribalance.
                </p>
                <p>
                    Regards,<br>
                    Contribalance
                </p>
                `
            };
            await transport.sendMail(mailingParameters);
        }
        return 'Send email successfully';
    } catch (error) {
        if (error instanceof Error) {
            return 'Unexpected error';
        }
    }
}

export default sendLecturerTutor;