import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import crypto from 'crypto';
import models from "@/models/models";
const AuthCode = models.AuthCode;
const Student = models.Student;
const Team = models.Team;
const Course = models.Course;
export async function POST(request: NextRequest) {
    try {
        const {zID, courseCode, term }: {zID: string ; courseCode: string, term: string }  = await request.json();
        await dbConnect();
        // Retrieve student and team to check their relations
        console.log("zID: " + zID);
        const student = await Student.findOne({ zid: zID });
        console.log("student: " + student);
        if (!student) {
            return NextResponse.json({ error: "Invalid zid" }, { status: 404 });
        }
        const courses = await Course.find({ courseName: courseCode });
        if (courses.length === 0) {
            return NextResponse.json({ error: "Invalid course code" }, { status: 404 });
        }
        console.log(courses);
        let designatedCourse = null;
        for (const course of courses) {
            let currentCourse = await Course.findById(course._id);
            if (currentCourse.term === term) {
                designatedCourse = currentCourse;
                break;
            }
        }
        if (!designatedCourse) {
            return NextResponse.json({ error: "Invalid term" }, { status: 404 });
        }

        const teams = designatedCourse.teams;
        let teamId = null;
        let isStudentInCourse = false;
        for (const team of teams) {
            //console.log ("team: " + team);
            const currentTeam = await Team.findById(team);
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
        if (!teamId) {
            return NextResponse.json({ error: "Student is not in any team" }, { status: 404 });
        }

        if (!isStudentInCourse) {
            return NextResponse.json({ error: "Student is not in this course" }, { status: 404 });
        }

        const authCode = await createUniqueAuthCode(zID);
        console.log(authCode)
        //please note that port may change
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const sendAuthCodeResponse = await fetch(`${baseUrl}/api/mailingSystem/sendAuthCode`, {method: 'POST', body: JSON.stringify({email: student.email, authCode: authCode, role: 'student'})})
        if (!sendAuthCodeResponse.ok) {
            return sendAuthCodeResponse
        }
        // objectId of student, team and course
        return NextResponse.json({studentId: student._id, teamId: teamId, courseId: designatedCourse._id}, {status: 200 })
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error - Team Email:', error);
            return NextResponse.json({error: error.message}, {status: 502})
        }
    }
}

// Generate a code with a given length
function generateAuthCode(length: number = 6): string {
    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let authCode = '';
    const bytes = crypto.randomBytes(length);

    for (let i = 0; i < length; i++) {
        authCode += characters[bytes[i] % characters.length];
    }
    return authCode;
}

// Function to create a unique auth code
async function createUniqueAuthCode(zid: string): Promise<string> {
    await dbConnect();
    let isUnique = false;
    let authCode = '';
    await AuthCode.deleteMany({ zid });
    // ensure code is unique
    while (!isUnique) {
        authCode = generateAuthCode();
        const existingCode = await AuthCode.findOne({ code: authCode });
        if (!existingCode) {
            isUnique = true;
        }
    }
    const expiresAt: Date = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiration

    await AuthCode.create({
        zid,
        code: authCode,
        expiresAt,
    });

    return authCode;
}