import mongoose, { Schema, Document } from 'mongoose';


interface AuthCodeDocument extends Document {
    zid: string;
    code: string;
    expiresAt: Date;
}

export const authCodeSchema = new Schema<AuthCodeDocument>({
    zid: { type: String, required: true },
    code: { type: String, required: true },
    expiresAt: { type: Date, required: true },
});

