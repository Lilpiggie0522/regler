import mongoose, { Schema } from 'mongoose';

export const courseSchema = new Schema({
    courseName: {
        type: 'string', required: true
    },
    teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: false}],
    mentors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: false}],
    term: {type: 'string', required: true}
});

courseSchema.index({ courseName: 1, term: 1 }, { unique: true });