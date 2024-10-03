
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Course from "@/models/courseModel";

//TODO: get all the courses
export async function GET() {
    await dbConnect();
    const courses = await Course.find({});
    return NextResponse.json(courses, { status: 200 });
}

//TODO: get a course by id
export async function GET(
    request: NextRequest,
    { params }: { params: { courseId: string } }
  ) {
    await dbConnect();
  
    try {
      const { courseId } = params;
      
      // Validate courseId
      if (!courseId) {
        return NextResponse.json({ error: 'Invalid course ID' }, { status: 400 });
      }
  
      // Find the course by ID
      const course = await Course.findById(courseId);
  
      if (!course) {
        return NextResponse.json({ error: 'Course not found' }, { status: 404 });
      }
  
      // Return the course data
      return NextResponse.json(course, { status: 200 });
    } catch (error) {
      console.error('Error fetching course:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }