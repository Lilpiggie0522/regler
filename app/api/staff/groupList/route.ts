import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';;
import models from "@/models/models";
import mongoose from 'mongoose';

const Admin = models.Admin;
const Course = models.Course;
const Team = models.Team;
const Issue = models.Issue;

// get courseById
export async function POST(request: NextRequest) {
    try {
        const result = []
        const { email, courseName, term }: { email: string, courseName: string, term: string } = await request.json();
        await dbConnect();
        const admin = await Admin.findOne({ email: email })
        if (!admin) {
            return NextResponse.json("invalid staff email", { status: 401 })
        }
        const course = await Course.findOne({ courseName: courseName, term: term })
        if (!course) {
            return NextResponse.json("invalid course and term", { status: 401 })
        }
        const course_objId = course._id
        const lecturer = await Admin.findOne({ courses: { $in: [course_objId] }, role: 'admin' });
        const lecturerName = lecturer.adminName
        for (const team of course.teams) {
            const teamFound = await Team.findById(team)
            if (teamFound) {
                const mentors = teamFound.mentors
                let mentorStr = ''
                for (const mentor_id of mentors) {
                    const tutor = await Admin.findById(mentor_id)
                    if (!mentorStr) {
                        mentorStr += tutor.adminName
                    } else {
                        mentorStr += ','
                        mentorStr += tutor.adminName
                    }
                }
                const status = await getStatus(teamFound.students)
                const newGroupInfo = {
                    groupName: teamFound.teamName,
                    tutors: mentorStr,
                    lecturer: lecturerName,
                    status: status
                }
                result.push(newGroupInfo)
            }
        }
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}

async function getStatus(teamMembers: mongoose.Schema.Types.ObjectId[]) {
    let groupStatus = 'Not Started'
    // check for student issue creation
    let issue = null
    for (const student of teamMembers) {
        const issueFound = await Issue.findOne({ startby: student })
        if (issueFound) {
            issue = issueFound
            groupStatus = 'Pending'
            break
        }
    }
    if (groupStatus === 'Not Started') {
        return groupStatus
    }

    // check for all student response
    for (const student of teamMembers) {
        const commentFound = issue.studentComments.find((comment: { student: mongoose.Schema.Types.ObjectId; }) => comment.student === student)
        if (!commentFound) {
            return groupStatus
        }
    }
    groupStatus = 'Need Feedback'
    // check for lecturer and tutor
    if (issue && issue.tutorComments.length > 0) {
        groupStatus = 'Completed'
    }
    return groupStatus
}