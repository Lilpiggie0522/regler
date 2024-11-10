import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import models from "@/models/models";

const Issue = models.Issue;
const Admin = models.Admin;

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        
        const { issueId, adminId } = await req.json();

        if (!issueId || !adminId) {
            return NextResponse.json({ error: "Missing issueId or adminId" }, { status: 400 });
        }

        const issue = await Issue.findById(issueId).exec();
        if (!issue) {
            return NextResponse.json({ error: "This group does not have a issue yet" }, { status: 404 });
        }

        if (issue.status === "complete") {
            return NextResponse.json({ error: "Issue is already closed" }, { status: 405 });
        }

        const admin = await Admin.findById(adminId).exec();
        if (!admin) {
            return NextResponse.json({ error: "You are not an admin" }, { status: 404 });
        }

        const adminHasComment = issue.tutorComments.some(
            (comment: { tutor: string }) => comment.tutor.toString() === adminId
        );

        if (!adminHasComment) {
            return NextResponse.json({ error: "You need to enter opinion before close this issue" }, { status: 403 });
        }

        issue.status = "complete";
        await issue.save();

        return NextResponse.json({ message: "Issue closed successfully", updatedIssue: issue }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
