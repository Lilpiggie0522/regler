import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { validateId } from "@/lib/validateId";
import models from "@/models/models";
import { submitOpinions, SubmitOptionProps } from "./submitOpinion";

const Issue = models.Issue;
const Admin = models.Admin;

export interface OpinionInput {
    teamId: string,
    content: string,
    staffId: string,
    courseId: string,
    issueId: string,
}

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const request = await req.json();
        const { teamId, content, staffId, issueId, courseId } = request as OpinionInput;

        // Validate the team ID
        let response = await validateId(issueId, "Issue");
        if (response) return response;

        response = await validateId(staffId, "Admin");
        if (response) return response;

        response = await validateId(teamId, "Team");
        if (response) return response;

        
        const openIssue = await Issue.findById(issueId).exec();
        // If no issue created or issue has closed, return 404
        if (!openIssue) {
            return NextResponse.json({ error: "No pending issues for this team" }, { status: 404 });
        } else if (openIssue.status == "complete") {
            return NextResponse.json({ error: "Issue is already closed" }, { status: 404 });
        }
        
        // Ensure the content is provided
        if (!content) {
            return NextResponse.json({ error: "Content is required" }, { status: 400 });
        }

        const staff = await Admin.findById(staffId).exec();
        if (!staff) return NextResponse.json({ error: "No staff for this team" }, { status:404});

        const isAdmin = staff.role === "admin" ? true : false;

        const submitOpinionsProp : SubmitOptionProps = {
            isAdmin,
            staffId,
            content,
            issueId,
            courseId,
            teamId,
        }
        return await submitOpinions(submitOpinionsProp)

    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
// await sendLecturerTutor(teamId, courseId, issueId, lecturers);