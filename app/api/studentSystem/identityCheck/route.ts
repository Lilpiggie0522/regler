import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { createUniqueAuthCode } from '@/lib/authCodeCreation';
import models from "@/models/models";
import sendAuthCode from '@/lib/sendAuthCode';
const Student = models.Student;
const Team = models.Team;
const Course = models.Course;
export interface studentIdentityCheckInput {
    zID: string;
    courseCode: string;
    term: string;
}
export async function POST(request: NextRequest) {
    try {
        let {zID, courseCode, term } = await request.json() as studentIdentityCheckInput;
        // Convert zID to lowercase
        // term to uppercase
        // courseCode to uppercase
        zID = zID.toLowerCase();
        term = term.toUpperCase();
        courseCode = courseCode.toUpperCase();
        await dbConnect();
        // Retrieve student and team to check their relations
        console.log("zID: " + zID);
        const student = await Student.findOne({ zid: zID }).exec();
        console.log("student: " + student);
        if (!student) {
            return NextResponse.json({ error: "Invalid zid!" }, { status: 404 });
        }
        // assume the combination of courseCode and term is unique
        const course = await Course.findOne({ courseName: courseCode, term: term }).exec();
        if (!course) {
            return NextResponse.json({ error: "course code or term is invalid!" }, { status: 404 });
        }
        console.log(course);
        const studentCourses = student.course;
        if (!studentCourses.includes(course._id)) {
            return NextResponse.json({ error: "Student is not in this course!" }, { status: 404 });
        }
        const designatedCourse = await Course.findById(course).exec();
        const teams = designatedCourse.teams;
        let teamId = null;
        for (const team of teams) {
            //console.log ("team: " + team);
            const currentTeam = await Team.findById(team).exec();
            //console.log("team: " + currentTeam)
            if (!currentTeam) {
                continue;
            }
            if (currentTeam.students.includes(student._id)) {
                teamId = team._id;
                break;
            }
        }
        if (!teamId) {
            return NextResponse.json({ error: "Student is not in any team!" }, { status: 404 });
        }
        const authCode = await createUniqueAuthCode(zID);
        sendAuthCode(student.email, authCode, 'student');
        return NextResponse.json({studentId: student._id, teamId: teamId, courseId: designatedCourse._id}, {status: 200 })
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({error: error.message}, {status: 502})
        }
    }
}

