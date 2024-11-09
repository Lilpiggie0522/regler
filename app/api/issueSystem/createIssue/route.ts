// create a new issue

// input fields
// student id, team id, course id.

// if it is an valid issue, then create a new issue in database, then tell the mailing system to send it to the team members and tutors.

// if it is not valid, return an error message.

import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@/lib/dbConnect";
import { validateId } from "@/lib/validateId";
import models from "@/models/models";
import sendTeamEmail from "@/lib/sendTeamEmail";

const Issue = models.Issue;
const Student = models.Student;
const Team = models.Team;
const Course = models.Course;

export interface CreateIssueInput {
    studentId: string,
    teamId: string,
    courseId: string,
    filesUrl: string,
    filesName: string,
    assignment: string,
    questions: string[],
    answers: string[],
}
export interface StudentCommentInput {

    filesUrl: string,
    filesName: string,
    student: string,
    answers: Answer[],
}
interface TutorCommentInput {

    content: string,
    filesUrl: string,
    tutor: string,
}
interface DeleteIssueInput {
    issueId: string,
}
export interface Answer{
    answer: string,
}
export interface Question {
    question: string,
}
interface Assignment{
    assignmentName: string,
}
export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const request = await req.json();
        const { studentId, teamId, courseId, filesUrl, assignment, filesName, questions, answers } = request as CreateIssueInput;

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
        // TODO: Check if the assignemnt in the team
        if (!assignment) {
            return NextResponse.json({ error: "Assignment is required" }, { status: 400 });
        }
        const hasAssignment = course.assignments.some((row : Assignment) => row.assignmentName);
        if (!hasAssignment) {
            return NextResponse.json({ error: "Assignment does not exist for this course" }, { status: 404 });
        }

        // if there is a pending issue for the team

        // TODO: if there is additional field to 
        
        const existingTeam = await Team.findOne(
            { _id: teamId,
            }
        )
            .exec();
        // TODO, try to find a issue with that assignment

        // console.log(existingTeam)
        
        const existingIssue = await Issue.find({
            assignment: assignment
        }).exec();
        console.log(existingIssue);
        if (existingIssue.length > 0) {
            return NextResponse.json({ error: "A relative issue already exists for this team" }, { status: 409 });

        }
        

        const curAnswers: Answer[] = answers.map(answer => ({ answer: answer}));

        const curQuestions: Question[] = questions.map(question => ({ question: question }));
        

        console.log("Question input: " + questions)
        console.log("Answer input: " + answers)
        console.log("CurQuestions: " + curQuestions);
        console.log("CurAnswers: " + curAnswers);
        console.log("Assignment:" + assignment);
        const initialStudentComment: StudentCommentInput = {
            
            filesUrl: filesUrl,
            filesName: filesName,
            student: studentId,
            answers: curAnswers,
        }
        const studentCommemts: StudentCommentInput[] = [];
        studentCommemts.push(initialStudentComment);
        const tutorCommemts: TutorCommentInput[] = [];
        const issue = await Issue.create({
            studentComments: studentCommemts,
            tutorComments: tutorCommemts,
            assignment: assignment,
            status: "pending",
            startby: studentId,
            questions: curQuestions
        })
        const issueId = issue._id;
        await Team.updateOne(
            {_id: existingTeam._id }, // filter by the issue ID
            { $push: { issues: issueId } } 
        );
        // calling mailing function send teams
        // TODO: sendTo api on the same server with /api/mailingSystem/sendTeam
        
        if (!(process.env.NODE_ENV === "test")) {
            const mailResponse = await sendTeamEmail(teamId, courseId, studentId, issueId)
            if (!mailResponse.ok) {
                return NextResponse.json({ error: "Failed to send team information to mailing system" }, { status: 500 });
            } 
        }
        return NextResponse.json({ success: true, issue,
            teamId: teamId,
            studentId: studentId,
            courseId: courseId,
            issueId: issueId,
        }, { status: 200 });

        // Additional checks if necessary

        // Continue with the rest of your logic for creating an issue

    } catch (error) {
        console.error("Error in POST request:", error);
        return NextResponse.json({ error: error }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        await dbConnect();
        const request = await req.json();
        const { issueId } = request as DeleteIssueInput;
        const response = await validateId(issueId, "Issue");
        if (response) return response;
        const issue = await Issue.findByIdAndDelete(issueId).exec();
        if (!issue) {
            return NextResponse.json({ error: "Issue not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Issue deleted" }, { status: 200 });
    }
    catch (error) {
        console.error("Error in DELETE request:", error);
        return NextResponse.json({ error: error }, { status: 500 });
    }
}