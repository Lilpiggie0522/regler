import mongoose, { InferSchemaType, Schema, model } from 'mongoose';

const adminSchema = new Schema({
  adminName: {
    type: 'string', required: true
   },
  email: { type: 'string', required: true, unique: true},
  zid: { type: 'string', required: true, select: false, unique: true},
  password: { type: 'string', required: true, select: false },
  courses:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true}],
  role: {
      type: 'string', 
      enum: ['courseAdmin', 'tutor'],
      message: '{VALUE} is not a valid role',
      required: true
    }
});

type Admin = InferSchemaType<typeof adminSchema>;

export default model<Admin>('Admin', adminSchema);