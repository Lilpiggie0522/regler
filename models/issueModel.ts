import { timeStamp } from 'console';
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
        filesUrl: {type: 'string'},
        student: {type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true},
      }, timeStamp],
    tutorComments:[{
        title: {type: 'string', required: true},
        content: {type: 'string', required: true},
        filesUrl: {type: 'string'},
        tutor: {type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: false},
    }, timeStamp]
});

type Issue = InferSchemaType<typeof issueSchema>;

export default model<Issue>('Issue', issueSchema);