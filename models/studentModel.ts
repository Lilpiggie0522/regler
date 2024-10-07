import { InferSchemaType, Schema, model } from 'mongoose';

export const studentSchema = new Schema({
    studentName: {
        type: 'string', required: true
    },
    email: { type: 'string', required: true, unique: true},
    zid: { type: 'string', required: true, select: false, unique: true},

});
