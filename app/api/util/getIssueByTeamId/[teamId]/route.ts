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
            return NextResponse.json({ message: "This team does not have a pending issue, no tutor opinion needed yet" }, { status: 200 });
        }

        const issue = await Issue.findById(issueId).exec();
        if (!issue) {
            return NextResponse.json({ message: 'Issue not found' }, { status: 404 });
        }

        const tutorComment = issue.tutorComments?.[0]?.content || 'No tutor comments available';
        
        return NextResponse.json({ tutorComment }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
}
