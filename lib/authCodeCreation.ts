import crypto from "crypto";
import dbConnect from "./dbConnect";
import models from "@/models/models";
const AuthCode = models.AuthCode;

// Generate a code with a given length
function generateAuthCode(length: number = 6): string {
    const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let authCode = "";
    const bytes = crypto.randomBytes(length);

    for (let i = 0; i < length; i++) {
        authCode += characters[bytes[i] % characters.length];
    }
    return authCode;
}

// Function to create a unique auth code
export async function createUniqueAuthCode(zid: string): Promise<string> {
    await dbConnect();
    let isUnique = false;
    let authCode = "";
    await AuthCode.deleteMany({ zid });
    // ensure code is unique
    while (!isUnique) {
        authCode = generateAuthCode();
        const existingCode = await AuthCode.findOne({ code: authCode });
        if (!existingCode) {
            isUnique = true;
        }
    }
    const expiresAt: Date = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiration

    await AuthCode.create({
        zid,
        code: authCode,
        expiresAt,
    });

    return authCode;
}