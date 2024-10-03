//
// update courseById

import { NextRequest, NextResponse } from "next/server";
import mongoose from 'mongoose';
import Course from '@/models/courseModel';


type Params = {
    params: {
      courseId: string
    }
  }

// get courseById
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
        return NextResponse.json({course}, {status: 200});
    } catch (error) {
        return NextResponse.json({ error: error}, {status: 500});
    }
    
  }
// delete courseById
export async function DELETE(req : NextRequest, { params } : Params) {
    const courseId = params.courseId;
    try {
        if (!mongoose.isValidObjectId(courseId)) {
            return NextResponse.json({error: "invalid course id"}, {status: 400});
        }
        const course = await Course.findByIdAndDelete(courseId).exec();
        if (!course) {
            return NextResponse.json({error: "course not found"}, {status: 404});
        }
        return NextResponse.json({message:"Course deleted", course}, {status: 200});
    } catch (error) {
        return NextResponse.json({ error: error}, {status: 500});
    }
    
  }
// Add mentors
// Add mentor