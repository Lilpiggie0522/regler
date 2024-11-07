import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import crypto from 'crypto';
import models from "@/models/models";
import sendAuthCode from '@/lib/sendAuthCode';
import { send } from 'process';
const AuthCode = models.AuthCode;
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

// Generate a code with a given length
export function generateAuthCode(length: number = 6): string {
    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let authCode = '';
    const bytes = crypto.randomBytes(length);

    for (let i = 0; i < length; i++) {
        authCode += characters[bytes[i] % characters.length];
    }
    return authCode;
}

// Function to create a unique auth code
export async function createUniqueAuthCode(zid: string): Promise<string> {
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