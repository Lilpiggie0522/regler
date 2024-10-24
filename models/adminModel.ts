import mongoose, { Schema } from 'mongoose';
import models from './models';

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

adminSchema.pre('findOneAndDelete', async function(next) {
  try {
      const Reminder = models.Reminder;
      const query = this.getFilter();
      const tutor = await mongoose.model('Admin').findOne(query);
      if (tutor) {
          await Reminder.deleteMany({ tutor: { $in: tutor } });
      }
      next();
  } catch (error) {
      if (error instanceof Error) {
          next(error);
      }
  }
});

// If 'deleteOne' admin on Admin Model that has _id: 111, pre-middleware will be executed and triggered
// const Admin = models.Admin;
// this = await Admin.findOneAndDelete({ _id: "67148e6edd88f94865e98a76" });
// this.getFilter() = { _id: "67148e6edd88f94865e98a76" };
adminSchema.pre('findOneAndDelete', async function(next) {
  try {
      const Reminder = models.Reminder;
      const query = this.getFilter();
      const tutor = await mongoose.model('Admin').findOne(query);
      if (tutor && tutor.role === 'tutor') {
        await Reminder.updateMany({}, { $pull: { mentors: tutor._id } });
      }
      next();
  } catch (error) {
      if (error instanceof Error) {
          next(error);
      }
  }
});

adminSchema.pre('deleteOne', async function(next) {
  try {
      const Reminder = models.Reminder;
      const query = this.getFilter();
      const tutor = await mongoose.model('Admin').findOne(query);
      if (tutor && tutor.role === 'tutor') {
        await Reminder.updateMany({}, { $pull: { mentors: tutor._id } });
      }
      next();
  } catch (error) {
      if (error instanceof Error) {
          next(error);
      }
  }
});
