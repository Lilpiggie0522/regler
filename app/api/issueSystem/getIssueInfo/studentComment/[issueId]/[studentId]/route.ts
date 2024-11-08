import { NextRequest, NextResponse } from "next/server";
import models from "@/models/models";
import { Answer, Question } from "../../../../createIssue/route";


const Student = models.Student;
const Issue = models.Issue;

interface StudentResponse {
  studentName: string;
  email: string;
  comment : StudentComment;
  questions: Question[];
}
export interface StudentComment {

  filesUrl: string;
  filesName: string;
  student: string;
  answers: Answer[];
  
}


type Params = {
    params: {
      issueId: string,
      studentId: string,
    }
  }

export async function GET(req : NextRequest, { params } : Params) {
    try {
        const issueId = params.issueId;
        const studentId = params.studentId;
        if (!issueId || !studentId) {
            return NextResponse.json({ error: "Issue or Student ID is required" }, { status: 400 });
        }
        
        const issue = await Issue.findById(issueId).exec();
        const student = await Student.findById(studentId).exec();
        
        if (!issue || !student) {
            return NextResponse.json({ error: "Issue or Student not found" }, { status: 404 });
        }
        const studentComment : StudentComment = issue.studentComments.find(
            (comment : StudentComment) => comment.student.toString() === studentId.toString()
        );
        if (!studentComment) {
            return NextResponse.json({ error: "Student has not submitted an issue for this team" }, { status: 401 });
        }
        console.log(studentComment);
        const studentResponse : StudentResponse = {
            studentName: student.studentName,
            email: student.email,
            comment: studentComment,
            questions: issue.questions,
        }
        console.log(studentResponse);
        return NextResponse.json({studentResponse}, {status:200});
    } catch (err) {
        return NextResponse.json({error: "Unexpected error: " + err}, {status: 500});
    }
}


