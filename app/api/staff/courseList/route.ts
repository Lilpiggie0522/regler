import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/dbConnect"
import models from "@/models/models"

const Admin = models.Admin
const Course = models.Course

// get courseById
export async function POST(request : NextRequest) {
  try {
    const { email } : { email: string }   = await request.json()
    await dbConnect()
    const admin = await Admin.findOne({email: email})
    if (!admin) {
      return NextResponse.json("invalid staff email!", {status: 401})
    }
    // Step 1: Fetch all courses for the admin at once
    const coursesFound = await Course.find({ _id: { $in: admin.courses } })

    // Step 2: Map the course data to the required format
    const courseList = coursesFound.map(course => ({
      id: course._id,
      course: course.courseName,
      term: course.term
    }))
    // console.log('Fetched courses:', courseList);
    return NextResponse.json({courses: courseList}, {status: 200})
  } catch (error) {
    return NextResponse.json({ error: error}, {status: 500})
  }
}