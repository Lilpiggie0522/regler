import { NextRequest, NextResponse } from "next/server";
import models from "@/models/models";

const Course = models.Course;
const Team = models.Team;
const Issue = models.Issue;
export async function POST(request : NextRequest) {
    try {
        const { email } : { email: string }   = await request.json();
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
        const studentListResponse = await fetch(`${baseUrl}/api/staff/studentList`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email })
        });
        if (!studentListResponse.ok) {
            return studentListResponse;
        }
        const groupListResponse = await fetch(`${baseUrl}/api/staff/groupList`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email })
        });
        if (!groupListResponse.ok) {
            return groupListResponse;
        }
        // Parse the JSON response to access the students array
        const { students } = await studentListResponse.json();
        const { teams } = await groupListResponse.json();
        const studentSubmissions = [];
        // record the submission status of each student
        for (const student of students) {
            for (const team of teams) {
                const teamObj = await Team.findById(team).exec();
                if (teamObj.students.includes(student)) {
                    const issueObjs = await Issue.find({ startby: student }).exec();
                    let status = "No Submission";
                    for (const issue of issueObjs) {
                        if (teamObj.issues.includes(issue._id)) {
                            status = "Submitted";
                            break;
                        }
                    }
                    const courseObj = await Course.findById(teamObj.course).exec();
                    const studentObj = await models.Student.findById(student).exec();
                    const studentSubmission = {
                        course: courseObj.courseName,
                        term:  courseObj.term,
                        student: studentObj.studentName,
                        mentors: teamObj.mentors,
                        team: teamObj.teamName,
                        teamId: teamObj._id,
                        status: status,
                    };
                    studentSubmissions.push(studentSubmission);
                }
            }
        }
        console.log(studentSubmissions);
        return NextResponse.json({ submissionsRecord: studentSubmissions }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error}, {status: 500});
    }
}