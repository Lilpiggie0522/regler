// get team by Id
import { NextResponse } from "next/server";
import mongoose from 'mongoose';
import models from "@/models/models";



const Team = models.Team;
const Admin = models.Admin;
type Params = {
    params: {
      teamId: string
    }
  }

interface TeamResponse {
    teamName: string;
    mentors: string;
}

export async function GET( { params } : Params) {
    const teamId = params.teamId;
    try {
        if (!mongoose.isValidObjectId(teamId)) {
            return NextResponse.json({error: "invalid course id"}, {status: 400});
        }
        const team = await Team.findById(teamId).exec();
        if (!team) {
            return NextResponse.json({error: "course not found"}, {status: 404});
        }
        const mentorsIds = team.mentors;
        let mentorsNames = '';
        for (const mentorId in mentorsIds) {
            const mentorName = await Admin.findById(mentorId).exec();
            if (mentorName) {
                mentorsNames += mentorName.name + ',';
            }
        }
        const teamResponse : TeamResponse = {
            teamName: team.teamName,
            mentors: mentorsNames.slice(0, -1), // remove trailing comma
        }
        return NextResponse.json({teamResponse}, {status: 200});
    } catch (error) {
        return NextResponse.json({ error: error}, {status: 500});
    }
    
}