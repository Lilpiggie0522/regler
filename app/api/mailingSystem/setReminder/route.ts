// import nodemailer from 'nodemailer';
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
// import mongoose from 'mongoose';
import models from "@/models/models";
// import cron from 'node-cron';
import reminderMod from '@/lib/reminderMod';
// import { Queue } from 'bullmq';


// const Student = models.Student;
// const Team = models.Team;
// const Course = models.Course;
// const Issue = models.Issue;
const Reminder = models.Reminder


/*
    Input: 
        - teamId: Unique object id of team
        - courseId: Unique object id of course
        - studentId: Unique object id of student who submits application
        - restId: List of students Id
    Output: 
        Send email contains evaluation link to the rest of members
        Send confirmation email to initial applicant
    Error:
        - Check if team exists
        - Check if course exists
        - Check if team is contained in courses
        - Check if student given in team or not
*/
export async function POST(request: NextRequest) {
    await dbConnect();
    const { teamId, courseId, issueId, restId } = await request.json();
    

    const weeklySchedule = new Date(new Date().getTime() + 7*24*60*60*1000);
    // const timestamp = {
    //     minute: time.getMinutes().toString(),
    //     hour: time.getHours().toString(),
    //     day: time.getDay().toString(),
    // };

    // Record job into database
    await Reminder.create({
        team: teamId,
        course: courseId,
        issue: issueId,
        // timestamp: timestamp,
        schedule: weeklySchedule,
        students: restId
    });

    // try {
    //     await reminderMod(teamId, courseId, issueId, restId, timestamp)
    // } catch (error) {
    //     if (error instanceof Error) {
    //         console.error('Error - setReminder (POST)', error);
    //         return NextResponse.json({ error: error.message }, { status: 502 })
    //     }
    // }

    return NextResponse.json({ message: 'Reminder for team is recorded in database' }, { status: 200 })

}


// /*
//     Overview:
//     This function deletes job and update database when student submits form
//     Input: 
//         - id: Unique object id (team/student/course/issue)
//         - type: strings to indicate type of id
//     Output: 
//         Delete object if id in (team/course/issue)
//         Delete student if id in student
//     Error:
//         - 
// // */


// export async function DELETE(request: NextRequest) {
//     try {
//         await dbConnect();
//         const { teamId, issueId, studentId, courseId } = await request.json();

//         // if type = team and there is an object with field team:id or course:id or issue:id, delete the object that has the id
//         // if type = student and id in students field, delete student in the list id in all object

//         return NextResponse.json({ message: `Successfully remove delete ${type}: ${id}` }, { status: 200 }) 
//     } catch (error) {
//         if (error instanceof Error) {
//             console.error('Error - setReminder (DELETE)', error);
//             return NextResponse.json({ error: error.message }, { status: 502 })
//         }
//     }

// }