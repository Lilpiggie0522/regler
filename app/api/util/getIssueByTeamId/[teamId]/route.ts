import dbConnect from '@/lib/dbConnect'
import models from '@/models/models'
import { NextRequest, NextResponse } from 'next/server'
type Params = {
    params: {
      teamId: string
    }
}
const Issue = models.Issue
const Team = models.Team

export async function GET(req : NextRequest, { params } : Params) {

    const {teamId} = params
    await dbConnect()
    const team = await Team.findById(teamId)
    if (!team) {
        return NextResponse.json('invalid teamId', {status: 400})    
    }
    const issue_id = team.issues[0]
    const issue = await Issue.findById(issue_id)

    if (!issue) {
        const message = "This team does not have a pending issue,no tutor opinion needed yet"
        return NextResponse.json(message, { status: 200 });    
    }
    const tutorComment = issue.tutorComments[0]?.content
    return NextResponse.json(tutorComment, {status: 200})
}