import dbConnect from '@/lib/dbConnect';
import models from "@/models/models";
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';

export async function reminderMod(teamId: mongoose.Schema.Types.ObjectId, 
                                courseId: mongoose.Schema.Types.ObjectId, 
                                issueId: mongoose.Schema.Types.ObjectId, 
                                restIds: mongoose.Schema.Types.ObjectId[],
                                mentorIds: mongoose.Schema.Types.ObjectId[]) {
    await dbConnect();
    const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
        },
    });

    const Student = models.Student;
    const Team = models.Team;
    const Course = models.Course;
    const Admin = models.Admin;

    // Send reminder email to remind the rest of team members
    const team = await Team.findById(teamId);
    const course = await Course.findById(courseId);
    for (const tempId of restIds) {
        const student = await Student.findById(tempId);
        if (student) {
            const mailingParameters = {
                from: process.env.SMTP_EMAIL,
                to: student.email,
                subject: 'Reminder for Form Completion',
                html: 
                `
                <p>
                    Hi, <strong>${student.studentName}</strong>!
                </p>
                <p>
                    This is a reminder to complete the contribution form for
                    your group <strong>${team.teamName}</strong> 
                    in the course <strong>${course.courseName}</strong>.
                    Please click the button below and complete the form.
                    We appreciate your cooperation!
                </p>
                <p>
                    If the information is not correct, or this message does
                    not apply to you, please contact your course admin as 
                    soon as possible. Thank you!
                </p>
                <p>
                    Regards,<br>
                    UNSW Development Team
                </p>
                <a style="display:inline-block; background-color:#f7b602; color:black; padding:8px 16px; border-radius:4px"
                href="https://3900-capstone.vercel.app/teamEvaluationForm/update?studentId=${tempId}&teamId=${teamId}&courseId=${courseId}&issueId=${issueId}"><strong>Complete Here</strong></a>
                `
            };
            await transport.sendMail(mailingParameters);  
        };
    }

    // Send reminder email to remind tutors
    const emailList = [];
    for (const mentorId of mentorIds) {
        const temp = await Admin.findById(mentorId);
        if (temp) {
            emailList.push(temp.email);
        }
    }
    const mailingParameters = {
        from: process.env.SMTP_EMAIL,
        to: emailList.join(','),
        subject: 'Reminder for Providing Opinion',
        html: 
        `
        <p>
            Hi!
        </p>
        <p>
            This is a reminder to provide opinion regarding
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
            UNSW Development Team
        </p>
        `
    };
    await transport.sendMail(mailingParameters);   
}



export default reminderMod;