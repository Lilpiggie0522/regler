import  mongoose, { Schema } from 'mongoose';

export const adminSchema = new Schema({
  adminName: {
    type: 'string', required: true
   },
  email: { type: 'string', required: true, unique: true},
  role: {
      type: 'string', 
      enum: ['courseAdmin', 'tutor'],
      message: '{VALUE} is not a valid role',
      required: true
  },
  courses: [{type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true}]
});