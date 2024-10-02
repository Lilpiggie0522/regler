import mongoose, { InferSchemaType, Schema, model } from 'mongoose';

const courseSchema = new Schema({
    courseName: {
        type: 'string', required: true, unique: true
    },
    teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true}],
    mentors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true}],
});

type Course = InferSchemaType<typeof courseSchema>;

export default model<Course>('Course', courseSchema);