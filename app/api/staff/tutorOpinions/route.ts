import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { validateId } from "@/lib/validateId";
import models from "@/models/models";

const Issue = models.Issue;
const Team = models.Team;

export interface TutorOpinionInput {
    teamId: string,
    content: string,
    staffId: string,
}

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const request = await req.json();
        const { teamId, content, staffId } = request as TutorOpinionInput;

        // Validate the team ID
        let response = await validateId(teamId, "Team");
        if (response) return response;

        response = await validateId(staffId, "Admin");
        if (response) return response;

        const team = await Team.findById(teamId).populate("issues").exec();
        // If team ID not valid, validatedId.ts will return error 404

        const issueId = team.issues[0];
        const openIssue = await Issue.findById(issueId).exec();
        // If no issue created or issue has closed, return 404
        if (!openIssue || openIssue.status !== 'pending') {
            return NextResponse.json({ error: "No pending issues for this team" }, { status: 404 });
        }

        // Check if a tutor has already commented on this issue
        if (openIssue.tutorComments.length > 0) {
            return NextResponse.json({ error: "Tutor has already submitted an opinion on this issue" }, { status: 400 });
        }

        // Ensure the content is provided
        if (!content) {
            return NextResponse.json({ error: "Content is required" }, { status: 400 });
        }

        // Create a new tutor comment
        const tutorComment = {
            content: content,
            tutor: staffId
        };

        // Update the issue by adding the tutor's opinion to the tutorComments array
        let updateIssue = await Issue.updateOne(
            { _id: openIssue._id },
            { $push: { tutorComments: tutorComment } }
        );
        updateIssue = await Issue.findById(issueId).exec();

        return NextResponse.json({ message: "Tutor opinion added successfully", updateIssue, }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
