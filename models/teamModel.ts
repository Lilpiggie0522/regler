import mongoose, { Schema } from 'mongoose';

export const teamSchema = new Schema({
    teamName: {
        type: 'string', required: true
    },

    course: {type: mongoose.Schema.Types.ObjectId, required: true},
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: false}],
    mentors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: false}],
    issues: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Issue', required: false}],
});

teamSchema.index({ teamName: 1, course: 1 }, { unique: true });
