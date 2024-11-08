import dbConnect from '@/lib/dbConnect';
import models from '@/models/models';
import { NextRequest, NextResponse } from 'next/server';

type Params = {
    params: {
      teamId: string;
    };
};

const Issue = models.Issue;
const Team = models.Team;
const Admin = models.Admin;

export async function GET(req: NextRequest, { params }: Params) {
    try {
        const { teamId } = params;
        await dbConnect();

        const team = await Team.findById(teamId).exec();
        if (!team) {
            return NextResponse.json({ message: 'invalid teamId' }, { status: 400 });
        }

        const issueId = team.issues?.[0]?.toString();
        if (!issueId) {
            return NextResponse.json({ message: "This team does not have a pending issue, no tutor opinion needed yet" }, { status: 400 });
        }

        const issue = await Issue.findById(issueId).exec();
        if (!issue) {
            return NextResponse.json({ message: 'Issue not found' }, { status: 404 });
        }

        if(issue.tutorComments.length == 0) {
            return NextResponse.json({ message: 'No tutor comments are available'}, {status: 402 });
        }
        // content is required when created
        const tutorComment = issue.tutorComments[0].content;
        const tutor = await Admin.findById(issue.tutorComments[0].tutor).exec();
        if (!tutor) {
            return NextResponse.json({ message: 'Tutor not found ' + tutor}, {status: 405 });
        }
        
        return NextResponse.json({ tutorComment, tutorName: tutor.adminName}, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }

}

