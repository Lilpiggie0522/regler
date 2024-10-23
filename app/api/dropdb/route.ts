import { NextRequest, NextResponse } from "next/server";
import models from '@/models/models'
const {Admin, Team, Course, Student} = models

export async function GET(req: NextRequest) {
    await Admin.deleteMany()
    await Team.deleteMany()
    await Course.deleteMany()
    await Student.deleteMany()
    return NextResponse.json('ok', {status: 200})
}