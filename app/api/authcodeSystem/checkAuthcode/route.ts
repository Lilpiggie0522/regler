import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import models from "@/models/models";
import { signJWT } from '@/util/jwt';
import { cookies } from 'next/headers'

const AuthCode = models.AuthCode;
const Admin = models.Admin
const Student = models.Student

export async function POST(request: NextRequest) {
    try {
        await dbConnect();
        // find the zid and code from the request
        // zid refers to both student zid and admin email
        const { zid, code }: { zid: string; code: string } = await request.json();
        const emailRegex = /^[a-zA-Z0-9]+@[a-zA-Z\.]+((unsw\.edu\.au)|(\.com))$/
        const staffEmail = zid.match(emailRegex)?.[0]
        let isStaff = false
        if (staffEmail) {
            console.log("staff yes")
            isStaff = true
        }
        // find the auth code entry for the user
        const authCodeEntry = await AuthCode.findOne({ zid: zid }).exec();

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
        let data = null
        if (isStaff) {
            const staff = await Admin.findOne({ email: zid })
            const role = staff!.role
            const id = staff._id
            data = {
                role: role,
                id: id
            }
        } else {
            const student = await Student.findOne({ zid: zid })
            const role = 'student'
            const id = student._id
            data = {
                role: role,
                id: id
            }
        }
        const token = await signJWT(data.id, data.role)
        const twoHoursFromNow = new Date(Date.now() + 60 * 60 * 1000 * 2)
        cookies().set('token', token, { expires: twoHoursFromNow, httpOnly: true, path: '/'})
        console.log(token)
        return NextResponse.json(token, { status: 200 });
    } catch (error) {
        console.error('Error validating auth code:', error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}