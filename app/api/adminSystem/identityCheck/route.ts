import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import models from '@/models/models';

const {Admin} = models
export async function POST(request: NextRequest) {
    try {
        const {email}: {email: string}  = await request.json();
        await dbConnect();
        console.log(`email is ${email}`)
        const admin = await Admin.findOne({email: email})
        if (!admin) {
            return NextResponse.json("Invalid Email", {status: 401})
        }
        //please note that port may change
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const authcodeCreationResponse = await fetch(`${baseUrl}/api/authcodeSystem/createAuthcode`, {method: 'POST', body: JSON.stringify({zid: email})})
        if (!authcodeCreationResponse.ok) {
            console.log(await authcodeCreationResponse.json())
            return NextResponse.json(authcodeCreationResponse, {status: 500})
        }
        const authCode = await authcodeCreationResponse.json();
        const sendAuthCodeResponse = await fetch(`${baseUrl}/api/mailingSystem/sendAuthCode`, {method: 'POST', body: JSON.stringify({email: email, authCode: authCode.authCode, role: 'admin'})})
        if (!sendAuthCodeResponse.ok) {
            console.log(await sendAuthCodeResponse.json())
            return NextResponse.json(sendAuthCodeResponse, {status: 500})
        }
        // object id of staff and role
        return NextResponse.json({email: admin.email, role: admin.role, _id: admin._id}, {status: 200})
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error - Team Email:', error);
            return NextResponse.json({error: error.message}, {status: 502})
        }
    }
}
