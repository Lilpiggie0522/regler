import { NextRequest, NextResponse } from "next/server"

import dbConnect from "@/lib/dbConnect"
import { validateId } from "@/lib/validateId"
import models from "@/models/models"
import { Answer, StudentCommentInput } from "../createIssue/route"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import StudentComment from "../../../../components/studentComment"
import deleteReminder from "@/lib/deleteReminder"


const Issue = models.Issue
const Student = models.Student
const Team = models.Team
const Course = models.Course
//const Admin = models.Admin;


export interface UpdateIssueInput {
    studentId: string,
    teamId: string,
    courseId: string,
    filesUrl: string,
    filesName: string,
    issueId: string,
    answers: string[],
}


export async function PUT(req: NextRequest) {
  try {
    await dbConnect()
    const request = await req.json()
    const { studentId, teamId, courseId, filesUrl, issueId, filesName, answers} = request as UpdateIssueInput
    let response = await validateId(studentId, "Student")
    if (response) return response // Return error response if validation fails

    response = await validateId(teamId, "Team")
    if (response) return response

    response = await validateId(courseId, "Course")
    if (response) return response

    // Retrieve student and team to check their relations
    const student = await Student.findById(studentId).exec()
    const team = await Team.findById(teamId).exec()
    const course = await Course.findById(courseId).exec()
    if (!team || !student || !course) {
      return NextResponse.json({ error: "Invalid student, team or course data" }, { status: 404 })
    }

    // Check if the student is part of the team
    if (!team.students.includes(student._id)) {
      return NextResponse.json({ error: "Student does not belong to this team" }, { status: 400 })
    }
    // Check if the team has access to the course
    if (!course.teams.includes(team._id)) {
      return NextResponse.json({ error: "Team does not belong to this course" }, { status: 403 })
    }

    // if there is a pending issue for the team
    const existingIssue = await Issue.findById(issueId).exec()
    if (!existingIssue) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 })
    }
    if (existingIssue.status === "complete") {
      return NextResponse.json({ error: "Issue has already been closed" }, { status: 405 })
    }
    // Check if the issue exists in the team 
    if (!team.issues.includes(existingIssue._id)) {
      return NextResponse.json({ error: "Issue does not belong to this team" }, { status: 406 })
    }
        
    const curAnswers: Answer[] = answers.map(answer => ({ answer }))
    const issues = existingIssue.studentComments.filter((comment: { student: string; }) => comment.student.toString() === studentId)
    if(issues.length > 0) {
      return NextResponse.json({ error: "Student has already submitted an issue for this team" }, { status: 401 })
    }
    const newStudentComment : StudentCommentInput = {

      filesUrl: filesUrl,
      filesName: filesName,
      student: studentId,
      answers: curAnswers
    } 
    // update issue
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    await Issue.updateOne(
      {
        _id: existingIssue._id,
                
      }, // filter by the issue ID
      { 
        $push: { studentComments: newStudentComment },
        $set: { status: existingIssue.studentComments.length + 1 === team.students.length ? "Need Feedback" : "pending" } 
        
      } 
            
    )

    const updatedIssue = await Issue.findById(existingIssue._id).exec()


    // TODO: Should delete this student at remainder after submission
    await deleteReminder(issueId, studentId, "student")

    return NextResponse.json({ message: "Issue updated successfully", updatedIssue}, { status: 200 })

  } catch (error) {
    console.error("Error updating issue:", error)
    return NextResponse.json({ error: error }, { status: 500 })
  };
}