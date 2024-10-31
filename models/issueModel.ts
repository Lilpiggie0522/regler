import mongoose, { Schema } from 'mongoose';
// import models from './models';

export const issueSchema = new Schema({
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
        filesName: {type: 'string'},
        student: {type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true},
      }, { timestamps: true }],
    tutorComments:[{
        content: {type: 'string', required: true},
        // filesUrl: {type: 'string'},
        tutor: {type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: false},
    }, { timestamps: true }]
});
