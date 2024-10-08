import  { InferSchemaType, Schema, model } from 'mongoose';

export const adminSchema = new Schema({
  adminName: {
    type: 'string', required: true
   },
  email: { type: 'string', required: true, unique: true},
  zid: { type: 'string', required: true, select: false, unique: true},
  password: { type: 'string', required: true, select: false },
  role: {
      type: 'string', 
      enum: ['courseAdmin', 'tutor'],
      message: '{VALUE} is not a valid role',
      required: true
    }
});
