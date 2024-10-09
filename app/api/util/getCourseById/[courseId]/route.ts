// get courseById
import { NextRequest, NextResponse } from "next/server";
import mongoose from 'mongoose';
import models from "@/models/models";
import dbConnect from "@/lib/dbConnect";


const Course = models.Course;

interface CourseResponse {
    courseName: string;
}

export async function GET( req: NextRequest) {
   
    try {
        await dbConnect();
        const courseId = req.url.split('/').pop();
        console.log(courseId);
        if (!mongoose.isValidObjectId(courseId)) {
            return NextResponse.json({error: "invalid course id"}, {status: 400});
        }
        const course = await Course.findById(courseId).exec();
        if (!course) {
            return NextResponse.json({error: "course not found"}, {status: 404});
        }
        const courseResponse: CourseResponse = {
            courseName: course.courseName,
        }
        return NextResponse.json({courseResponse}, {status: 200});
    } catch (error) {
        return NextResponse.json({ error: error}, {status: 500});
    }
    
}