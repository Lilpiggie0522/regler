import mongoose, { InferSchemaType, Schema, model } from 'mongoose';

const teamSchema = new Schema({
    teamName: {
        type: 'string', required: true, unique: true
    },

    //course: {type: mongoose.Schema.Types.ObjectId, required: true},
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: false}],
    mentors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: false}],
});

type Team = InferSchemaType<typeof teamSchema>;

export default model<Team>('Team', teamSchema);