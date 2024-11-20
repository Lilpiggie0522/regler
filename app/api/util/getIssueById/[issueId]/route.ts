import dbConnect from "@/lib/dbConnect"
import models from "@/models/models"
import { NextRequest, NextResponse } from "next/server"

type Params = {
    params: {
      issueId: string;
    };
};

const Issue = models.Issue
const Admin = models.Admin

interface Comment {
    name: string;
    content: string
}

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { issueId } = params
    await dbConnect()

    if (!issueId) {
      return NextResponse.json({ message: "This team does not have a pending issue, no tutor opinion needed yet" }, { status: 200 })
    }

    const issue = await Issue.findById(issueId).exec()
    if (!issue) {
      return NextResponse.json({ message: "Issue not found" }, { status: 404 })
    }

    if(issue.tutorComments.length == 0) {
      return NextResponse.json({ message: "No tutor comments are available"}, {status: 200 })
    }
    // content is required when created
    const tutorComments = issue.tutorComments
    const adminResult: Comment[] = []
    const tutorResult: Comment[] = []
    for (const comment of tutorComments) {
      const staff = await Admin.findById(comment.tutor)
      if (!staff) {
        return NextResponse.json("No tutor found!", {status: 400})
      }
      if (staff.role === "admin") {
        adminResult.push({name: staff.adminName, content: comment.content})
      } else {
        tutorResult.push({name: staff.adminName, content: comment.content})
      }
    }
    return NextResponse.json({lecturerComments: adminResult, tutorComments: tutorResult}, {status: 200})

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }

}

