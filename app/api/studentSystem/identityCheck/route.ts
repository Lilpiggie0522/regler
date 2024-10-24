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
        await dbConnect();
        // Retrieve student and team to check their relations
        const student = await Student.findOne({ zid: zID }).exec();
        if (!student) {
            return NextResponse.json({ error: "Invalid zid" }, { status: 404 });
        }
        const courses = await Course.find({ courseName: courseCode }).exec();
        if (courses.length === 0) {
            return NextResponse.json({ error: "Invalid course code" }, { status: 404 });
        }
        courses.sort((a, b) => a.term - b.term);
        console.log(courses);
        const course = courses.at(-1);
        const courseTerm : string = course.term;
        const teams = course.teams;
        let teamId = null;
        let isStudentInCourse = false;
        for (const team of teams) {
            const currentTeam = await Team.findById(team).exec();
            if (currentTeam.students.includes(student._id)) {
                isStudentInCourse = true;
                teamId = team._id;
                break;
            }
        }
        if (!isStudentInCourse) {
            return NextResponse.json({ error: "Student is not in this course" }, { status: 404 });
        }
        //please note that port may change
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const authcodeCreationResponse = await fetch(`${baseUrl}/api/authcodeSystem/createAuthcode`, {method: 'POST', body: JSON.stringify({zid: zID})})
        if (!authcodeCreationResponse.ok) {
            return authcodeCreationResponse;
        }
        const authCode = await authcodeCreationResponse.json();
        const sendAuthCodeResponse = await fetch(`${baseUrl}/api/mailingSystem/sendAuthCode`, {method: 'POST', body: JSON.stringify({email: student.email, authCode: authCode.authCode, role: 'student'})})
        if (!sendAuthCodeResponse.ok) {
            return sendAuthCodeResponse
        }
        // objectId of student, team and course
        return NextResponse.json({ studentId: student._id, teamId: teamId, courseId: course._id, term: courseTerm }, {status: authcodeCreationResponse.status})
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({error: error.message}, {status: 500})
        }
    }
}


