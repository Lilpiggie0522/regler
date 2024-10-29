import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';;
import models from "@/models/models";

const Admin = models.Admin;
const Course = models.Course;

// get courseById
export async function POST(request : NextRequest) {
    try {
        const { email } : { email: string }   = await request.json();
        await dbConnect();
        const admin = await Admin.findOne({email: email})
        if (!admin) {
            return NextResponse.json("invalid staff email", {status: 401})
        }
        let courseList = [];
        for (const course of admin.courses) {
            const currentCourse = await Course.findById(course).exec();
            courseList.push(
                {
                    course: currentCourse.courseName,
                    term: currentCourse.term
                }
            );
        }
        return NextResponse.json({courses: courseList}, {status: 200});
    } catch (error) {
        return NextResponse.json({ error: error}, {status: 500});
    }
}