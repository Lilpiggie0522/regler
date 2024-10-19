import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import models from '@/models/models';

const {Admin} = models
export async function POST(request: NextRequest) {
    try {
        const {email}: {email: string}  = await request.json();
        console.log(email)
        await dbConnect();
        const admin = await Admin.findOne({email: email})
        if (!admin) {
            return NextResponse.json("invalid email", {status: 401})
        }
        //please note that port may change
        const authcodeCreationResponse = await fetch('http://localhost:3000/api/authcodeSystem/createAuthcode', {method: 'POST', body: JSON.stringify({zid: email})})
        if (!authcodeCreationResponse.ok) {
            console.log(await authcodeCreationResponse.json())
            return NextResponse.json(authcodeCreationResponse, {status: 500})
        }
        const authCode = await authcodeCreationResponse.json();
        const sendAuthCodeResponse = await fetch('http://localhost:3000/api/mailingSystem/sendAuthCode', {method: 'POST', body: JSON.stringify({email: email, authCode: authCode.authCode, role: 'admin'})})
        if (!sendAuthCodeResponse.ok) {
            console.log(await sendAuthCodeResponse.json())
            return NextResponse.json(sendAuthCodeResponse, {status: 500})
        }
        return NextResponse.json("ok", {status: 200})
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error - Team Email:', error);
            return NextResponse.json({error: error.message}, {status: 502})
        }
    }
}
