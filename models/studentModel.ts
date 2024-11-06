import mongoose, { Schema } from 'mongoose';
import models from './models';

export const studentSchema = new Schema({
    studentName: {
        type: 'string', required: true
    },
    email: { type: 'string', required: true, unique: true},
    zid: { type: 'string', required: true, select: false, unique: true},
    course: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true}],
    //class: { type: 'string', required: true},
});


// If 'deleteOne' student on Student Model that has _id: 111, pre-middleware will be executed and triggered
// const Student = models.Student;
// this = await Student.findOneAndDelete({ _id: "67148e6edd88f94865e98a76" });
// this.getFilter() = { _id: "67148e6edd88f94865e98a76" };
studentSchema.pre('findOneAndDelete', async function(next) {
    try {
        const Reminder = models.Reminder;
        const query = this.getFilter();
        const student = await mongoose.model('Student').findOne(query);
        if (student) {
            await Reminder.updateMany({}, { $pull: { students: student._id } });
        }
        next();
    } catch (error) {
        if (error instanceof Error) {
            next(error);
        }
    }
});

studentSchema.pre('deleteOne', async function(next) {
    try {
        const Reminder = models.Reminder;
        const query = this.getFilter();
        const student = await mongoose.model('Student').findOne(query);
        if (student) {
            await Reminder.updateMany({}, { $pull: { students: student._id } });
        }
        next();
    } catch (error) {
        if (error instanceof Error) {
            next(error);
        }
    }
});

