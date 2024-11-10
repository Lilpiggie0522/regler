import dbConnect from "@/lib/dbConnect";
import models from "@/models/models";
import { NextRequest, NextResponse } from "next/server";

type Params = {
    params: {
      issueId: string;
    };
};

interface TutorComment {
    tutor: string;
    content: string;
}
interface LectuerComment {
    lecturer: string;
    content: string;
}
const Issue = models.Issue;
const Admin = models.Admin;

export async function GET(req: NextRequest, { params }: Params) {
    try {
        
        await dbConnect();

        const { issueId } = params;
        if (!issueId) {
            return NextResponse.json({ message: "This team does not have a pending issue, no tutor opinion needed yet" }, { status: 400 });
        }

        const issue = await Issue.findById(issueId).exec();
        if (!issue) {
            return NextResponse.json({ message: "Issue not found" }, { status: 404 });
        }

        if(issue.tutorComments.length == 0) {
            return NextResponse.json({ message: "No tutor comments are available"}, {status: 402 });
        }
        // content is required when created
        const tutorComments = await Promise.all(
            issue.tutorComments.map(async (comment : TutorComment) => {
                const tutor = await Admin.findById(comment.tutor).exec();
                return {
                    content: comment.content,
                    tutorName: tutor.adminName, 
                };
            }));
        console.log("tutorComments: " + tutorComments);
        const lecturerComments = await Promise.all(
            issue.lecturerComments.map(async (comment : LectuerComment) => {
                console.log(comment.lecturer);
                const lecturer = await Admin.findById(comment.lecturer).exec();
                
                return {
                    content: comment.content,
                    lecturerName: lecturer.adminName, 
                };
            }));
        console.log("lecturerComments: " +lecturerComments);

        

        
        return NextResponse.json({ tutorComments, lecturerComments}, { status: 200 });
    } catch (error) {
        // console.error(error);
        return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
    }

}

