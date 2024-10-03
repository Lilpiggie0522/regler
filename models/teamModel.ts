import mongoose, { InferSchemaType, Schema, model } from 'mongoose';

const teamSchema = new Schema({
    teamName: {
        type: 'string', required: true, unique: true
    },
    studnets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true}],
    mentors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true}],
});

type Team = InferSchemaType<typeof teamSchema>;

export default model<Team>('Team', teamSchema);