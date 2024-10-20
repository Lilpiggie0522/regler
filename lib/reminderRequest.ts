import dbConnect from '@/lib/dbConnect';
import models from "@/models/models";
import reminderMod from './reminderMod';


// Traverse the whole reminder to send notification
export async function reminderRequest() {
    await dbConnect();
    const Reminder = models.Reminder
    const reminders = await Reminder.find();
    const currentTime = new Date();

    reminders.forEach(async (reminder) => {
        // Send email if schedule is after current time
        if (reminder.schedule > currentTime) {
            reminderMod(reminder.team, reminder.course, reminder.issue, reminder.students, reminder.mentors);
            const futureSchedule = new Date(reminder.schedule.getTime() + 7*24*60*60*1000);
            // update next schedule
            reminder.schedule = futureSchedule;
            await reminder.save();
        }
    });
}


reminderRequest();
console.log('Send reminder and update database for overdue schedule');
setInterval(reminderRequest, 24*60*60*1000);
console.log('Reminder will be check after 24 hours');

export default reminderRequest;