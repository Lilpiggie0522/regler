"use client"
import TeamEvaluationForm from "@/components/teamEvaluationForm"
import { useStudentContext } from "@/context/studentContext"

export default function TeamEvaluationPage() {

  // const studentId = "6703551f9db9e11b38436918";
  // const teamId = "6703551f9db9e11b3843691c";
  // const courseId = "6703551f9db9e11b3843692a";
  // const issueId = '';
  const { useLocalStorageState } = useStudentContext()
  const [studentId] = useLocalStorageState("studentId", "")
  const [teamId] = useLocalStorageState("teamId", "")
  const [courseId] = useLocalStorageState("courseId", "")
  console.log(`student id is: ${studentId}`)
  console.log(`team id is: ${teamId}`)
  console.log(`course id is: ${courseId}`)
  return (
    <>
      <TeamEvaluationForm
        studentId={studentId}
        teamId={teamId}
        courseId={courseId}
        issueId={""}
      />
    </>
  )

}