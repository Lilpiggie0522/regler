import { NextRequest, NextResponse } from "next/server";
import models from '@/models/models';
import StudentComment from '../../../../../components/studentComment';

const Team = models.Team;
const Issue = models.Issue;

interface StudentResponse {
  studentName: string;
  email: string;
  zid: string;
  isSubmitted: boolean;
  comment : StudentComment;
}
interface StudentComment {
  title: string;
  content: string;
  filesUrl: string;
  filesName: string;
  student: string;
}


type Params = {
    params: {
      teamId: string
    }
  }

export async function GET(req : NextRequest, { params } : Params) {
    try {
        const teamId = params.teamId;
    if (!teamId) {
        return NextResponse.json({ error: "Team ID is required" }, { status: 400 });
      }
      
      const team = await Team.findById(teamId).exec();
      
      if (!team) {
        return NextResponse.json({ error: "Team not found" }, { status: 404 });
      }
    
    
      const existingTeam = await Team.findOne(
        { _id: teamId,
        }
    )
    .exec();
    const issuesIds = existingTeam.issues;
   // console.log(existingTeam)
   let existingIssue = null;
    for (const issueId of issuesIds) {
       existingIssue = await Issue.findById(issueId).exec();
       // console.log(existingIssue);
        if (existingIssue && existingIssue.status === 'pending') {
            break;
        }
    }
    // if (!existingIssue) {
    //   return NextResponse.json({ message: "No pending issue for this team, no information to be returned" }, { status: 200 });
    // }

    const studentIssueInfos : StudentResponse[] = [];
    for (const studentId of existingTeam.students) {
      const studentDetails = await models.Student.findById(studentId).exec();
      const studentComment = existingIssue?.studentComments.find(
        (comment: StudentComment) => comment.student.toString() === studentId.toString()
      );
    
      const isSubmitted = Boolean(studentComment);
      
      const studentIssueInfo: StudentResponse = {
        studentName: studentDetails.studentName,
        email: studentDetails.email,
        zid: studentDetails.email.split('@')[0],
        isSubmitted,
        comment: isSubmitted ? {
          title: studentComment.title,
          content: studentComment.content,
          filesUrl: studentComment.filesUrl,
          filesName: studentComment.filesName,
          student: studentId
        } : {
          title:'not submitted', 
          content: 'not submitted', 
          filesUrl: 'not submitted',
          filesName: 'not submitted',
          student: studentId
        }
      };
      studentIssueInfos.push(studentIssueInfo);

    }
    
    return NextResponse.json({ studentIssueInfos }, { status: 200 });

    } catch (err) { 
      console.error("Error retrieving team:", err);
      return NextResponse.json({ error: "Failed to retrieve team" }, { status: 500 });
    }
  }