import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import models from "@/models/models";

const AuthCode = models.AuthCode;
export async function POST(request: NextRequest) {
    try {
        await dbConnect();
        // find the zid and code from the request
        const { zid, code }: { zid: string; code: string } = await request.json();

        // find the auth code entry for the user
        const authCodeEntry = await AuthCode.findOne({ zid }).exec();

        if (!authCodeEntry) {
            return NextResponse.json({ error: 'No code found for user' }, { status: 404 });
        }

        // check if the auth code has expired
        if (new Date() > authCodeEntry.expiresAt) {
            return NextResponse.json({ error: 'Auth code has expired' }, { status: 400 });
        }

        // check if the code is correct
        if (authCodeEntry.code !== code) {
            return NextResponse.json({ error: 'Invalid auth code' }, { status: 400 });
        }

        // correct code
        return NextResponse.json({ message: 'Auth code is valid' }, { status: 200 });
    } catch (error) {
        console.error('Error validating auth code:', error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
