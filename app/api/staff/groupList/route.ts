import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';;
import models from "@/models/models";

const Admin = models.Admin;
const Course = models.Course;
const Team = models.Team;
// get courseById
export async function POST(request : NextRequest) {
    try {
        const result = []
        const { email, courseName, term } : { email: string, courseName: string, term: string }   = await request.json();
        await dbConnect();
        const admin = await Admin.findOne({email: email})
        if (!admin) {
            return NextResponse.json("invalid staff email", {status: 401})
        }
        const course = await Course.findOne({courseName: courseName, term: term})
        if (!course) {
            return NextResponse.json("invalid course and term", {status: 401})
        }
        const course_objId = course._id
        const lecturer = await Admin.findOne({ courses: { $in: [course_objId] }, role: 'admin' });
        console.log(`lecturer name is: ${lecturer.adminName}`)
        for (const team of course.teams) {
            const teamFound = await Team.findById(team)
            if (teamFound) {
            }
        }
        return NextResponse.json({email, courseName, term}, {status: 200});
    } catch (error) {
        return NextResponse.json({ error: error}, {status: 500});
    }
}