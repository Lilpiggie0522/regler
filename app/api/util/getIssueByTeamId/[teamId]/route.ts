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
    console.log(issue)
    const tutorComment = issue.tutorComments[0]?.content
    if (!tutorComment) {
        return NextResponse.json('tutor has yet to comment', {status: 400})    
    }
    return NextResponse.json(tutorComment, {status: 200})
}