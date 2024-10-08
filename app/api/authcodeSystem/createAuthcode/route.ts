import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect'; // 假设你有用于连接 MongoDB 的函数
import models from "@/models/models";

const AuthCode = models.AuthCode;
// Generate a code with a given length
function generateAuthCode(length: number = 6): string {
    const characters: string = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let authCode: string = '';
    for (let i = 0; i < length; i++) {
        authCode += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return authCode;
}

export async function POST(request: NextRequest) {
    try {
        await dbConnect();
        const { zid } = await request.json();
        const authCode: string = generateAuthCode();
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
