import mongoose, { Schema } from 'mongoose';


// team id, course id, issue id: when a team/course/issue has been deleted, remove object from database
// When student completes the form or a student is deleted, remove student id from students
// Timestamp will be given when initial student clicks submit in sendTeam
// Need to re-schedule all jobs when the server restarts
export const reminderSchema = new Schema({
    team: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true
    },
    issue: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Issue', required: true
    },
    // timestamp: {
    //     minute: {type: 'string', required: true},
    //     hour: {type: 'string', required: true},
    //     day: {type: 'string', required: true},
    // },
    schedule: {
        type: Date
    },
    students: [
        {type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true}
    ],
    mentors: [
        {type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true}
    ],
});
