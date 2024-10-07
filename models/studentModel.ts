import { InferSchemaType, Schema, models, model } from 'mongoose';

const studentSchema = new Schema({
    studentName: {
        type: 'string', required: true
    },
    email: { type: 'string', required: true, unique: true},
    zid: { type: 'string', required: true, select: false, unique: true},

});


type Student = InferSchemaType<typeof studentSchema>;

export default models.Student || model<Student>('Student', studentSchema);
// export default model<Student>('Student', studentSchema);