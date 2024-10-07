'use client'
import TeamEvaluationForm from "@/components/teamEvaluationForm";

export default function TeamEvaluationPage() {
  const studentId = "6703551f9db9e11b38436918";
  const teamId = "6703551f9db9e11b3843691c";
  const courseId = "6703551f9db9e11b3843692a";
  const issueId = '';
  return (
    <>
    <p>abc</p>
    <TeamEvaluationForm
      studentId = {studentId}
      teamId = {teamId}
      courseId = {courseId}
      issueId={issueId}
    />
    </>
  );
}