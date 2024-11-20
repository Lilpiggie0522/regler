// get team by Id
import { NextRequest, NextResponse } from "next/server"
import mongoose from "mongoose"
import models from "@/models/models"
import dbConnect from "@/lib/dbConnect"



const Team = models.Team
const Admin = models.Admin
interface TeamResponse {
    teamName: string;
    mentors: string;
}

export async function GET( req : NextRequest) {
    
  try {
    await dbConnect()
    const teamId = req.url.split("/").pop()
    if (!mongoose.isValidObjectId(teamId)) {
      return NextResponse.json({error: "invalid team id"}, {status: 400})
    }
    const team = await Team.findById(teamId).exec()
    if (!team) {
      return NextResponse.json({error: "course not found"}, {status: 404})
    }
    const mentorsIds = team.mentors
    let mentorsNames = ""
    for (const mentorId of mentorsIds) {
      const mentor = await Admin.findById(mentorId).exec()
      if (mentor) {
        mentorsNames += mentor.adminName + ","
      }
    }
    const teamResponse : TeamResponse = {
      teamName: team.teamName,
      mentors: mentorsNames.slice(0, -1), // remove trailing comma
    }
    return NextResponse.json(teamResponse, {status: 200})
  } catch (error) {
    return NextResponse.json({ error: error}, {status: 500})
  }
    
}