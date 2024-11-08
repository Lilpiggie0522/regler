//
// update courseById

import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import models from "@/models/models";


const Course = models.Course;
type Params = {
    params: {
      courseId: string
    }
  }

// get all the assignments
export async function GET(req : NextRequest, { params } : Params) {
    const courseId = params.courseId;
    try {
        if (!mongoose.isValidObjectId(courseId)) {
            return NextResponse.json({error: "invalid course id"}, {status: 400});
        }
        const course = await Course.findById(courseId).exec();
        if (!course) {
            return NextResponse.json({error: "course not found"}, {status: 404});
        }
        const assignments = course.assignments;
        return NextResponse.json({assignments}, {status: 200});
    } catch (error) {
        return NextResponse.json({ error: error}, {status: 500});
    }
    
}
// update the assignment by courseId (name)
interface UpdateAssignmentInput {
    assignmentName: string;
}

export async function PUT(req : NextRequest, { params } : Params) {
    const courseId = params.courseId;
    try {
        if (!mongoose.isValidObjectId(courseId)) {
            return NextResponse.json({error: "invalid course id"}, {status: 400});
        }
        const request = await req.json();
        const updateAssignments : UpdateAssignmentInput[]  = request.body.assignments;
        const course = await Course.updateOne({_id : courseId},
            {
                $set:{ assignments: updateAssignments},
            }
        );
        if (!course) {
            return NextResponse.json({error: "course not found"}, {status: 404});
        }
        const currentCourse = await Course.findById(courseId).exec();
        const assignments = currentCourse.assignments
        return NextResponse.json({message: "assignments updated", assignments}, {status: 200});
        
    } catch (error) {
        return NextResponse.json({ error: error}, {status: 500});
    }
    
}
// Add mentors
// Add mentor