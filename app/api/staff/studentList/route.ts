import { NextRequest, NextResponse } from 'next/server';
import models from "@/models/models";

const Team = models.Team;
// get courseById
export async function POST(request : NextRequest) {
    try {
        const { email } : { email: string }   = await request.json();
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const groupListResponse = await fetch(`${baseUrl}/api/staff/groupList`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });
        if (!groupListResponse.ok) {
            return groupListResponse;
        }
        const { teams } = await groupListResponse.json();
        const studentSet = new Set();
        for (const team of teams) {
            const teamObj = await Team.findById(team).exec();
            for (const student of teamObj.students) {
                studentSet.add(student);
            }
        }
        const studentList = Array.from(studentSet);
        return NextResponse.json({students: studentList}, {status: 200});
    } catch (error) {
        return NextResponse.json({ error: error}, {status: 500});
    }
}