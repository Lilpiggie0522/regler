import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import models from "@/models/models";
import crypto from 'crypto';
const AuthCode = models.AuthCode;
// Generate a code with a given length
function generateAuthCode(length: number = 6): string {
    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let authCode = '';
    const bytes = crypto.randomBytes(length);

    for (let i = 0; i < length; i++) {
        authCode += characters[bytes[i] % characters.length];
    }
    return authCode;
}

export async function POST(request: NextRequest) {
    try {
        await dbConnect();
        const { zid } = await request.json();
        let isUnique = false;
        let authCode = '';
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

        return NextResponse.json({
            message: 'Auth code generated successfully',
            authCode,
            expiresAt,
        }, { status: 200 });
    } catch (error) {
        console.error('Error generating auth code:', error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
