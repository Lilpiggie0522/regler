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

// If 'deleteOne' team on Team Model that has _id: 111, pre-middleware will be executed and triggered
// const Team = models.Team;
// this = await Team.findOneAndDelete({ _id: "67148e6edd88f94865e98a76" });
// this.getFilter() = { _id: "67148e6edd88f94865e98a76" };
teamSchema.pre('findOneAndDelete', async function(next) {
    try {
        const Reminder = models.Reminder;
        const query = this.getFilter();
        const team = await mongoose.model('Team').findOne(query);
        if (team) {
            await Reminder.deleteMany({ team: team._id });
        }
        next();
    } catch (error) {
        if (error instanceof Error) {
            next(error);
        }
    }
});