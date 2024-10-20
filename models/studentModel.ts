import { Schema } from 'mongoose';
// import mongoose, { Schema } from 'mongoose';
// import { reminderSchema } from './reminderModel';
// import models from './models';

export const studentSchema = new Schema({
    studentName: {
        type: 'string', required: true
    },
    email: { type: 'string', required: true, unique: true},
    zid: { type: 'string', required: true, select: false, unique: true},

});


// studentSchema.pre('deleteMany', async function(next) {
//     try {
//         const Reminder = models.Reminder;

//         const query = this.getFilter();
//         const studentsToDelete = await mongoose.model('Student').find(query, '_id');
//         const studentIds = studentsToDelete.map(student => student._id);
//         await Reminder.deleteMany({ students: { $in: studentIds } });
//         next();
//     } catch (error) {
//         if (error instanceof Error) {
//             next(error);
//         }
//     }
// });