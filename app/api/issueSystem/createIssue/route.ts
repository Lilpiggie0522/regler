// create a new issue

// input fields
// student id, team id, course id.

// if it is an valid issue, then create a new issue in database, then tell the mailing system to send it to the team members and tutors.

// if it is not valid, return an error message.

import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@/lib/dbConnect";
import { validateId } from "@/lib/validateId";
import models from "@/models/models";

const Issue = models.Issue;
const Student = models.Student;
const Team = models.Team;
const Course = models.Course;

export interface CreateIssueInput {
    studentId: string,
    teamId: string,
    courseId: string,
    filesUrl: string,
    title: string,
    content: string,
}
interface StudentCommentInput {
    title: string,
    content: string,
    filesUrl: string,
    student: string,
}
interface TutorCommentInput {
    title: string,
    content: string,
    filesUrl: string,
    tutor: string,
}

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const request = await req.json();
        const { studentId, teamId, courseId, filesUrl, title, content } = request as CreateIssueInput;

        // Validate that IDs exist in their respective collections
        let response = await validateId(studentId, "Student");
        if (response) return response; // Return error response if validation fails

        response = await validateId(teamId, "Team");
        if (response) return response;

        response = await validateId(courseId, "Course");
        if (response) return response;

        // Retrieve student and team to check their relations
        const student = await Student.findById(studentId).exec();
        const team = await Team.findById(teamId).exec();
        const course = await Course.findById(courseId).exec();
        if (!team || !student || !course) {
            return NextResponse.json({ error: "Invalid student, team or course data" }, { status: 404 });
        }

        // Check if the student is part of the team
        if (!team.students.includes(student._id)) {
            return NextResponse.json({ error: "Student does not belong to this team" }, { status: 400 });
        }
        // Check if the team has access to the course
        if (!course.teams.includes(team._id)) {
            return NextResponse.json({ error: "Team does not belong to this course" }, { status: 403 });
        }
        if (!title || !content) {
            return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
        }

        const initialStudentComment: StudentCommentInput = {
            title: title,
            content: content,
            filesUrl: filesUrl,
            student: studentId
        }
        const studentCommemts: StudentCommentInput[] = [];
        studentCommemts.push(initialStudentComment);
        const tutorCommemts: TutorCommentInput[] = [];
        const issue = await Issue.create({
            studentComments: studentCommemts,
            tutorComments: tutorCommemts,
            status: "pending",
            startby: studentId
        })
        // calling mailing function send teams
        // TODO: sendTo api on the same server with /api/mailingSystem/sendTeam
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const mailResponse = await fetch(`${baseUrl}/api/mailingSystem/sendTeam`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                teamId: teamId,
                studentId: studentId,
                courseId: courseId,
            }),
        });

        if (!mailResponse.ok) {
            return NextResponse.json({ error: "Failed to send team information to mailing system" }, { status: 500 });
        } 

        return NextResponse.json({ success: true, issue }, { status: 200 });

        // Additional checks if necessary

        // Continue with the rest of your logic for creating an issue

    } catch (error) {
        console.error("Error in POST request:", error);
        return NextResponse.json({ error: error }, { status: 500 });
    }
}