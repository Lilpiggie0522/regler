import mongoose, { Schema } from 'mongoose';
import models from './models';

export const teamSchema = new Schema({
    teamName: {
        type: 'string', required: true, unique: true
    },

    //course: {type: mongoose.Schema.Types.ObjectId, required: true},
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: false}],
    mentors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: false}],
    issues: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Issue', required: false}],
});



// If delete team on Team Model that has _id: 111, pre-middleware will be executed and triggered
// 
teamSchema.pre('deleteMany', async function(next) {
    try {
        const Reminder = models.Reminder;
        const query = this.getFilter();
        const teamDelete = await mongoose.model('Team').find(query, '_id');
        const teamId = teamDelete.map(team => team._id);
        await Reminder.deleteMany({ team: teamId });
        next();
    } catch (error) {
        if (error instanceof Error) {
            next(error);
        }
    }
});
