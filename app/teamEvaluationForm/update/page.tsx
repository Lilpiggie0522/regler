
'use client'
import TeamEvaluationForm from "@/components/teamEvaluationForm";

import { useSearchParams } from 'next/navigation'


export default function TeamEvaluationPage() {

  
  const searchParams = useSearchParams();
  const studentId = searchParams.get('studentId');
  const teamId = searchParams.get('teamId');
  const courseId = searchParams.get('courseId');
  const issueId = searchParams.get('issueId') 

  return (
    <div>
      
      <p>Debug: studentId={studentId}, teamId={teamId}, courseId={courseId}, issueId={issueId}</p>
      <TeamEvaluationForm
        studentId={studentId}
        teamId={teamId}
        courseId={courseId}
        issueId={issueId}
      />
    </div>
  );
}