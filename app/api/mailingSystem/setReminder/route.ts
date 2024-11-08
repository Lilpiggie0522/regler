import dbConnect from "@/lib/dbConnect";
import reminderMod from "@/lib/reminderMod";
import models from "@/models/models";
import { NextResponse } from "next/server";
import cron from "node-cron";

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
            // If team/course/issue is not found or issue closed, delete the reminder.
            const [teamCheck, issueCheck, courseCheck] = await Promise.all([
                Team.findById(reminder.team),
                Issue.findById(reminder.issue),
                Course.findById(reminder.course)
            ]);
            if (!teamCheck || !issueCheck || !courseCheck || issueCheck.status === "closed") {
                await models.Reminder.deleteOne({ _id: reminder._id });
                continue;
            }

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
    cron.schedule("*/5 * * * *", async () => {
        await reminderRequest();
    });
}

export async function POST() {
    try {
        await InitialReminderCron();
        return NextResponse.json({ message: "Reminder Initialised" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 404 });
    }
}
