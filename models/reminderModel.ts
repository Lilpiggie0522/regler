import mongoose, { Schema } from 'mongoose';


// team id, course id, issue id: when a team/course/issue has been deleted, remove from database
// When student completes 
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
    students: [
        {id: {type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true}, timestamp: {type: 'string', required: true}}
    ]
});