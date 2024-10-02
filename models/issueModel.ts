import mongoose, { InferSchemaType, Schema, model } from 'mongoose';

const issueSchema = new Schema({
    status: {
        type: 'string', 
        enum: ['pending', 'closed'],
        message: '{VALUE} is not a valid role',
        required: true
      },
    startby: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true,
    },
    // url should be in the form of url1,url2,url3....
    studentComments: [{
        title: {type: 'string', required: true},
        content: {type: 'string', required: true},
        fileUrl: {type: 'string'},
        createdAt: {type: Date, default: Date.now},
        updatedAt: {type: Date, default: Date.now},
        student: {type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true},
      },],
    tutorComments:[{
        title: {type: 'string', required: true},
        content: {type: 'string', required: true},
        fileUrl: {type: 'string'},
        createdAt: {type: Date, default: Date.now},
        updatedAt: {type: Date, default: Date.now},
        tutor: {type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true},
    }]
});

type Issue = InferSchemaType<typeof issueSchema>;

export default model<Issue>('Issue', issueSchema);