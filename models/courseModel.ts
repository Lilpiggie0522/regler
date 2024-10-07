import mongoose, { InferSchemaType, Schema, model } from 'mongoose';

export const courseSchema = new Schema({
    courseName: {
        type: 'string', required: true, unique: true
    },
    teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: false}],
    mentors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: false}],
});

