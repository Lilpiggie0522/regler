import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';

import models from "@/models/models";

const Student = models.Student;
const Team = models.Team;
const Course = models.Course;
export async function POST(request: NextRequest) {
    try {
        const {zID, courseCode }: {zID: string ; courseCode: string }  = await request.json();
        // * convert inputs to lowercase
        //todo
        //1. find email from zid
        //2.  add check for student in this course
        // Check if email exists and student name is correct
        console.log()
        await dbConnect();
        // Retrieve student and team to check their relations
        const student = await Student.findOne({ zid: zID }).exec();
        console.log("student: " + student);
        if (!student) {
            return NextResponse.json({ error: "Invalid zID." }, { status: 404 });
        }
        const course = await Course.findOne({ courseName: courseCode }).exec();
        if (!course) {
            return NextResponse.json({ error: "Invalid Course Code." }, { status: 404 });
        }
        
        const teams = course.teams;
        let teamId = null;
        let isStudentInCourse = false;
        for (const team of teams) {
            //console.log ("team: " + team);
            const currentTeam = await Team.findById(team).exec();
            //console.log("team: " + currentTeam)
            if (!currentTeam) {
                continue;
            }
            if (currentTeam.students.includes(student._id)) {
                isStudentInCourse = true;
                teamId = team._id;
                break;
            }
        }
        console.log("HI3")
        if (!isStudentInCourse) {
            return NextResponse.json({ error: "Student is not in this course." }, { status: 404 });
        }
        //please note that port may change
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const authcodeCreationResponse = await fetch(`${baseUrl}/api/authcodeSystem/createAuthcode`, {method: 'POST', body: JSON.stringify({zid: zID})})
        if (!authcodeCreationResponse.ok) {
            return authcodeCreationResponse;
        }
        console.log("HI")
        const authCode = await authcodeCreationResponse.json();
        const sendAuthCodeResponse = await fetch(`${baseUrl}/api/mailingSystem/sendAuthCode`, {method: 'POST', body: JSON.stringify({email: student.email, authCode: authCode.authCode, role: 'student'})})
        if (!sendAuthCodeResponse.ok) {
            return sendAuthCodeResponse
        }
        // objectId of student, team and course
        return NextResponse.json({studentId: student._id, teamId: teamId, courseId: course._id}, {status: authcodeCreationResponse.status})
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error - Team Email:', error);
            return NextResponse.json({error: error.message}, {status: 502})
        }
    }
}
