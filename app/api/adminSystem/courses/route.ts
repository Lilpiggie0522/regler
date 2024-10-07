
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import models from "@/models/models";

const Course = models.Course;

//TODO: get all the courses
export async function GET() {
    await dbConnect();
    const courses = await Course.find({});
    return NextResponse.json(courses, { status: 200 });
}

// input and model of creating a new course!
interface CourseInput {
    courseName: string;
    teams: string[],
    mentors: string[],
}



//TODO: create a course by id
export async function POST(req: NextRequest) {

    try {
        await dbConnect();
        
        const request = await req.json();
        
        const { courseName, teams, mentors } = request as CourseInput;
        console.log("request body: " + request.body);
        
        if (!courseName) {
            return NextResponse.json({ error: "course name not provided" }, {status: 400});
        }
        const course = await Course.create({ courseName, teams, mentors });
        return NextResponse.json(course, {status: 200});
    }
    catch (error) {
        return NextResponse.json({ error: error}, {status: 500});
    }
}