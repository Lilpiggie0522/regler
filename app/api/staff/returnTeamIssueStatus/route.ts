import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { email }: { email: string } = await request.json();
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

        const response = await fetch(`${baseUrl}/api/staff/returnIndividualIssueStatus`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        if (!response.ok) {
            return NextResponse.json({ error: "Failed to fetch individual submissions" }, { status: response.status });
        }
        const { submissionsRecord: individualSubList } = await response.json();
        console.log("Fetched individualSubList:", individualSubList); 
        const groupListResponse = await fetch(`${baseUrl}/api/staff/groupList`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        if (!groupListResponse.ok) {
            return NextResponse.json({ error: "Failed to fetch group list" }, { status: groupListResponse.status });
        }

        const { teams } = await groupListResponse.json();
        console.log(individualSubList);
        console.log(teams);

        const teamSubmissionsRecord = [];

        for (const team of teams) {
            const teamSubList = individualSubList.filter((sub: { team: { toString: () => string; }; }) => sub.team.toString() === team.toString());
            if (teamSubList.length === 0) continue; 

            let status = "Not Started";
            let hasEveryoneComplete = true;

            for (const teammate of teamSubList) {
                if (teammate.status === "Submitted") {
                    status = "Pending";
                }
                if (teammate.status === "No Submission") {
                    hasEveryoneComplete = false;
                }
            }

            if (hasEveryoneComplete) {
                status = "Need Feedback";
            }

            const teamSubmission = {
                course: teamSubList[0].course,
                term: teamSubList[0].term,
                mentors: teamSubList[0].mentors,
                team: team,
                status: status,
            };
            teamSubmissionsRecord.push(teamSubmission);
        }

        return NextResponse.json({ teamSubmissionsRecord }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
