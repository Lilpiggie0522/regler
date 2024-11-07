import mongoose, { Schema } from 'mongoose';
// import models from './models';

export const issueSchema = new Schema({
    status: {
        type: 'string', 
        enum: ['pending', 'complete', 'Need Feedback'],
        message: '{VALUE} is not a valid role',
        required: true
      },
    startby: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true,
    },
    // url should be in the form of url1,url2,url3....
    studentComments: [{
        filesUrl: {type: 'string'},
        filesName: {type: 'string'},
        student: {type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true},
        answers: [
          {
            answer: {type: 'string', required: true},
    
          }
        ]
      }, { timestamps: true }],
    tutorComments:[{
        content: {type: 'string', required: true},
        // filesUrl: {type: 'string'},
        tutor: {type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true},
    }, { timestamps: true }],
    questions: [
      {
        question : {type: 'string', required: true}
      }
    ],

});
