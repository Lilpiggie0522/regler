import mongoose, { InferSchemaType, Schema, model } from 'mongoose';

const courseSchema = new Schema({
    courseName: {
        type: 'string', required: true, unique: true
    },
    teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: false}],
    mentors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: false}],
});

type Course = InferSchemaType<typeof courseSchema>;

export default model<Course>('Course', courseSchema);