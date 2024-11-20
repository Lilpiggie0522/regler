import models from "@/models/models"
import { NextResponse } from "next/server"
import { getAdminsByCourseId, getStudentsByTeamId } from "../opinionsUtil/util"
import deleteReminder from "@/lib/deleteReminder"
import sendLecturerTutor from "@/lib/lecturerTutor"
import sendComment from "@/lib/sendComment"

export interface SubmitOptionProps {
    isAdmin: boolean, staffId: string, content: string, issueId: string, teamId: string, courseId: string;
}

const Issue = models.Issue
export const submitOpinions = async (props : SubmitOptionProps): Promise<NextResponse> => {
  const {isAdmin, staffId, content, issueId, teamId, courseId} = props
  if (isAdmin) {
    const issue = await Issue.findById(issueId)
    if (issue) {
      issue.lecturerComments.push({
        content: content,
        lecturer: staffId 
      })
      await issue.save()
    }
    const students = getStudentsByTeamId(teamId)
    if (!students) return NextResponse.json({ error: "No students found for this team" }, { status: 404 })
    sendComment(teamId, courseId, issueId, content)
  }
  else {
    const tutorComment = {
      content: content,
      tutor: staffId
    }
    const lecturers = await getAdminsByCourseId(courseId)
    if (!lecturers) return NextResponse.json({ error: "No lecturers found for this staff" }, { status: 404 })
    await Issue.updateOne(
      { _id: issueId },
      { $push: { tutorComments: tutorComment } }
    )
    sendLecturerTutor(teamId, courseId, issueId, lecturers)
  }
  const updatedIssue = await Issue.findById(issueId).exec()
  console.log(updatedIssue)
  const message = await deleteReminder(issueId, staffId, "mentor")
  console.log(message)
  return NextResponse.json({ message: "Opinion submitted successfully", updatedIssue }, { status: 200 })

}