import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { validateId } from "@/lib/validateId";
import models from "@/models/models";

const Issue = models.Issue;
const Admin = models.Admin;

export interface TutorOpinionInput {
    issueId: string,
    content: string,
    staffId: string,
}

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const request = await req.json();
        const { issueId, content, staffId } = request as TutorOpinionInput;

        // Validate the team ID
        let response = await validateId(issueId, "Issue");
        if (response) return response;

        response = await validateId(staffId, "Admin");
        if (response) return response;

        // const team = await Team.findById(teamId).populate("issues").exec();
        // If team ID not valid, validatedId.ts will return error 404

        const openIssue = await Issue.findById(issueId).exec();
        // If no issue created or issue has closed, return 404
        if (!openIssue) {
            return NextResponse.json({ error: "This team does not have a pending issue" }, { status: 404 });
        } else if (openIssue.status == "complete") {
            return NextResponse.json({ error: "Cannot add an opinion as this issue is closed" }, { status: 404 });
        }

        // Ensure the content is provided
        if (!content) {
            return NextResponse.json({ error: "Content is required" }, { status: 400 });
        }

        const tutor = await Admin.findById(staffId)
        const tutorId = tutor._id

        // Update the issue by adding the tutor's opinion to the tutorComments array
        // const updatedIssue = await Issue.findOneAndUpdate(
        //     { _id: issueId, "tutorComments.tutor": tutorId }, // Match by issueId and tutorId
        //     {
        //         $set: { "tutorComments.$.content": content }, // Update content
        //     },
        //     { new: true } // Return the updated document
        // )
        // if (!updatedIssue) {
            await Issue.findOneAndUpdate(
                { _id: issueId }, // Match the issueId
                {
                    $push: { tutorComments: {content: content, tutor: tutorId} }, // Push new comment if not found
                },
                { new: true } // Return the updated document
            )
        //}
        return NextResponse.json({ message: "Tutor opinion added successfully"}, { status: 200 });

    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
