
import { NextRequest, NextResponse } from "next/server";
import mongoose from 'mongoose';
import models from "@/models/models";


const Course = models.Course;
type Params = {
    params: {
      courseId: string
    }
  }

// get all the questions for the course
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
        const questions = course.questions;
        return NextResponse.json({questions}, {status: 200});
    } catch (error) {
        return NextResponse.json({ error: error}, {status: 500});
    }
    
}
// update the assignment by courseId (name)
interface UpdateQuestionInput {
    question: string;
}

export async function PUT(req : NextRequest, { params } : Params) {
    const courseId = params.courseId;
    try {
        if (!mongoose.isValidObjectId(courseId)) {
            return NextResponse.json({error: "invalid course id"}, {status: 400});
        }
        

        const request = await req.json();
        const updateQuestions : UpdateQuestionInput[]  = request.body.questions;
        const course = await Course.updateOne({_id : courseId},
            {
                $set:{ question: updateQuestions},
            }
        );
        if (!course) {
            return NextResponse.json({error: "course not found"}, {status: 404});
        }
        const currentCourse = await Course.findById(courseId).exec();
        const questions = currentCourse.questions
        return NextResponse.json({message: "question updated", questions}, {status: 200});
        
    } catch (error) {
        return NextResponse.json({ error: error}, {status: 500});
    }
    
  }
