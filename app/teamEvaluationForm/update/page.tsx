"use client"
import TeamEvaluationForm from "@/components/teamEvaluationForm";
import { useSearchParams } from "next/navigation"
import React, { Suspense } from "react";


const UpdateTeamEvaluationForm = () => {

  
    const searchParams = useSearchParams();
    const studentId = searchParams.get("studentId");
    const teamId = searchParams.get("teamId");
    const courseId = searchParams.get("courseId");
    const issueId = searchParams.get("issueId");
    const assigment = searchParams.get("assignment"); 

    return (
    
        <div>
      
            
      
            <TeamEvaluationForm
                studentId={studentId}
                teamId={teamId}
                courseId={courseId}
                issueId={issueId}
                assignment={assigment}
        
            />
      
        </div>
    
    );
}

const UpdateTeamEvaluationFormPage = () => {
    return(
        <Suspense fallback={<div>Loading...</div>}>
            <UpdateTeamEvaluationForm />
        </Suspense>
    )
}

export default UpdateTeamEvaluationFormPage;