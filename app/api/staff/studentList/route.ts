import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';;
import models from "@/models/models";

const Admin = models.Admin;
const Course = models.Course;
const Team = models.Team;
// get courseById
export async function POST(request : NextRequest) {
    try {
        const { email } : { email: string }   = await request.json();
        await dbConnect();
        const admin = await Admin.findOne({email: email})
        if (!admin) {
            return NextResponse.json("invalid staff email", {status: 401})
        }
        const courses = admin.courses;
        let studentSet = new Set();
        for (const course of courses) {
            const currentCourse = await Course.findById(course).exec();
            const teams = currentCourse.teams;
            for (const team of teams) {
                const currentTeam = await Team.findById(team).exec();
                for (const student of currentTeam.students) {
                    studentSet.add(student);
                }
            }
        }
        const studentList = Array.from(studentSet);
        return NextResponse.json({studnets: studentList}, {status: 200});
    } catch (error) {
        return NextResponse.json({ error: error}, {status: 500});
    }
}