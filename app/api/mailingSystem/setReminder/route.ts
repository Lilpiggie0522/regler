import dbConnect from '@/lib/dbConnect';
import reminderMod from '@/lib/reminderMod';
import models from "@/models/models";
import { NextRequest, NextResponse } from 'next/server';
import cron from 'node-cron';

// const CHECK_TIME = '';
// const PRO_INTERVAL = 7*24*60*60*1000;
const TEST_INTERVAL = 10*60*1000;

// Traverse the whole reminder to send notification
async function reminderRequest() {
    await dbConnect();
    const reminders = await models.Reminder.find();
    const Team = models.Team;
    const Course = models.Course;
    const Issue = models.Issue;
    const currentTime = new Date();
    for (const reminder of reminders) {
        // Send email if schedule is after current time
        if (currentTime > reminder.schedule) {
            // If team/course/issue is not found, delete the reminder.
            const [teamCheck, issueCheck, courseCheck] = await Promise.all([
                Team.findById(reminder.team),
                Issue.findById(reminder.issue),
                Course.findById(reminder.course)
            ]);
            if (!teamCheck || !issueCheck || !courseCheck) {
                await models.Reminder.deleteOne({ _id: reminder._id });
                continue;
            }
            // Check if students and tutors exists and in the team.
            // Check if students and tutors added into team?

            await reminderMod(reminder.team, reminder.course, reminder.issue, reminder.students, reminder.mentors);
            // interval < one week, server shuts for < 1 week
            let futureSchedule = new Date(reminder.schedule.getTime() + TEST_INTERVAL);

            // Edge case: interval > one week, server shuts for > 1 week
            if (currentTime.getTime() - reminder.schedule.getTime() > TEST_INTERVAL) {
                futureSchedule = new Date(currentTime.getTime() + TEST_INTERVAL);
            }
            // update next schedule
            reminder.schedule = futureSchedule;
            await reminder.save();
        }
    };
}

// Immediately send reminder and set up reminders for every 9:00am when server starts
// Using UTC time +00:00
// 4am => 3pm daylight saving sydney. 
// 

async function InitialReminderCron() {
    await reminderRequest();
    // cron.schedule('25 4 * * *', async () => {
    cron.schedule('*/5 * * * *', async () => {
        console.log('Check every 5 minutes');
        await reminderRequest();
    });
}

export async function POST() {
    try {
        await InitialReminderCron();
        return NextResponse.json({ message: "Reminder Initialised" }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error }, { status: 404 });
    }

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
// */
export async function DELETE(request: NextRequest) {
    try {
        await dbConnect();
        const { issueId, personId, type } = await request.json();
        
        // check if mentor or student exists
        const reminder = await models.Reminder.findOne({ issue: issueId });
        if (!reminder) {
            return NextResponse.json({ error: 'reminder not found or issue closed' }, { status: 400 });
        }
        if (type === "student") {
            const student = await models.Student.findById(personId);
            if (!student) {
                return NextResponse.json({ error: 'student not in the team/ already submitted' }, { status: 400 })
            }
            await models.Reminder.updateOne({ issue: issueId }, { $pull: { students: personId } });
        }
        if (type === "mentor") {
            const mentor = await models.Admin.findById({ _id: personId });
            if (!mentor) {
                return NextResponse.json({ error: 'tutor not in the team/ already submitted' }, { status: 400 })
            }
            await models.Reminder.updateOne({ issue: issueId }, { $pull: { mentors: personId } });
        }

        return NextResponse.json({ message: `Successfully remove ${personId} from ${issueId}` }, { status: 200 }) 
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error - setReminder (DELETE)', error);
            return NextResponse.json({ error: error.message }, { status: 502 })
        }
    }
}
