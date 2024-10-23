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
        let courses = await Course.find({ courseName: courseCode }).exec();
        if (courses.length == 0) {
            return NextResponse.json({ error: "Invalid course code" }, { status: 404 });
        }
        courses.sort((a, b) => a.term - b.term);
        const course = courses.at(-1);
        console.log(course);
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
        const authcodeCreationResponse = await fetch('http://localhost:3000/api/authcodeSystem/createAuthcode', {method: 'POST', body: JSON.stringify({zid: zID})})
        if (!authcodeCreationResponse.ok) {
            return authcodeCreationResponse;
        }
        const authCode = await authcodeCreationResponse.json();
        const sendAuthCodeResponse = await fetch('http://localhost:3000/api/mailingSystem/sendAuthCode', {method: 'POST', body: JSON.stringify({email: student.email, authCode: authCode.authCode, role: 'student'})})
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


