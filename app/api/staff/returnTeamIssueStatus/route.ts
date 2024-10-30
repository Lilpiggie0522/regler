import { NextRequest, NextResponse } from 'next/server';
import models from "@/models/models";

export async function POST(request: NextRequest) {
    try {
        // Destructure email, course, and term from the request body
        const { email, course, term }: { email: string; course: string; term: string } = await request.json();
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

        // Fetch individual submissions
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

        // Fetch the group list
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
            const teamSubList = individualSubList.filter((sub: { teamId: { toString: () => string; }; }) => sub.teamId.toString() === team.toString());
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

            const mentors = [];
            for (const mentor of teamSubList[0].mentors) {
                const mentorObj = await models.Admin.findById(mentor).exec();
                if (mentorObj.role === "tutor") {
                    mentors.push(mentorObj.adminName);
                }
            }

            const teamSubmission = {
                course: teamSubList[0].course,
                term: teamSubList[0].term,
                mentors: mentors,
                team: teamSubList[0].team,
                status: status,
            };
            teamSubmissionsRecord.push(teamSubmission);
        }

        // Include course and term in the response if needed
        return NextResponse.json({ teamSubmissionsRecord, course, term }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error || "An error occurred" }, { status: 500 });
    }
}
