import mongoose, { InferSchemaType, Schema, model } from 'mongoose';
import models from './models';

export const courseSchema = new Schema({
    courseName: {
        type: 'string', required: true, unique: true
    },
    teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: false}],
    mentors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: false}],
});

courseSchema.pre('deleteMany', async function(next) {
    try {
        const query = this.getFilter();
        const courseDelete = await models.Course.find(query, '_id');
        const courseId = courseDelete.map(course => course._id);
        await models.Reminder.deleteMany({ course: courseId });
        next();
    } catch (error) {
        if (error instanceof Error) {
            next(error);
        }
    }
});