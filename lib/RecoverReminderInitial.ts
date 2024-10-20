import dbConnect from '@/lib/dbConnect';
// import mongoose from 'mongoose';
import models from "@/models/models";
import cron from 'node-cron';
import reminderMod from './reminderMod';

export async function RecoverReminderInitial() {
    await dbConnect();
    const Reminder = models.Reminder
    const reminders = await Reminder.find();

    reminders.forEach(reminder => {
        // cron.schedule(`${reminder.timestamp.minute} 
        //     ${reminder.timestamp.hour} * * ${reminder.timestamp.day}`, async () => {
        //     console.log(`Sending reminder email for teamId ${reminder.teamId}`);
        //     await reminderMod(reminder.teamId, reminder.courseId, 
        //         reminder.issueId, reminder.students, reminder.timestamp);
        // });
        if (reminder.schedule) {
            reminderMod(reminder.team, reminder.course, reminder.issue, reminder.students, reminder.mentors);

        }
    });
}

export default RecoverReminderInitial;