import { NextRequest, NextResponse } from "next/server";
import mongoose from 'mongoose';
import models from "@/models/models";
import dbConnect from "@/lib/dbConnect";


const Admin = models.Admin;
const Team = models.Team;

const Course = models.Course;
type Params = {
    params: {
      courseId: string
    }
  }
interface TeamListResponse {
    groupName: string;
    lecturer: string;
    status: string;
    tutors: string;
    teamId: string;

}
interface Mentor {
    adminName: string;
}


// get list of teams that belong to the course
export async function GET(req : NextRequest, { params } : Params) {
    const courseId = params.courseId;
    try {
        console.log("The CourseId is:" + courseId);
        await dbConnect();
        if (!mongoose.isValidObjectId(courseId)) {
            return NextResponse.json({error: "invalid course id"}, {status: 400});
        }
        const course = await Course.findById(courseId).exec();
        if (!course) {
            return NextResponse.json({error: "course not found"}, {status: 404});
        }
        const lecturer = await Admin.findOne({ courses: { $in: [courseId] }, role: 'admin' });
        const lecturerName = lecturer.adminName;

        
        const teamIds = course.teams;
        let teams: TeamListResponse[] = [];
        const teamData = await Team.aggregate([
            {
                $match: { _id: { $in: teamIds } }  // Match only specified teams
            },
            {
                $lookup: {
                    from: 'admins',  // Collection for mentors
                    localField: 'mentors',
                    foreignField: '_id',
                    as: 'mentorDetails'
                }
            },
            {
                $lookup: {
                    from: 'issues',  // Collection for issues
                    localField: 'issues',
                    foreignField: '_id',
                    as: 'issueDetails'
                }
            },
            {
                $unwind: {
                    path: '$issueDetails',
                    preserveNullAndEmptyArrays: true  // Allows handling of teams without an associated issue
                }
            },
            // Optional future filtering stage for `issueDetails`:
            // {
            //     $match: { 'issueDetails.someField': someValue }
            // },
            {
                $project: {
                    teamName: 1,
                    _id: 1,
                    'mentorDetails.adminName': 1,  // Only keep mentor names
                    'issueDetails.status': 1,
                    'issueDetails.assignment': 1,
                    'issueDetails._id': 1,       // Only keep issue status
                }
            }
        ]);
        // Process the data for easier use if necessary
        console.log(teamData)
        teams = teamData.map(team => (
            {
            groupName: team.teamName,
            lecturer: lecturerName,
            teamId: team._id,
            tutors: team.mentorDetails.map((mentor: Mentor) => mentor.adminName).join(', '),
            // if there is no any issues, in the team.
            status: team.issueDetails ? getStatus(team.issueDetails.status) : 'Not Started',  // Handle null case for issue
            issueId: team.issueDetails? team.issueDetails._id : null,
            assignment: team.issueDetails? team.issueDetails.assignment : null,  // Handle null case for assignment
        }));
        

        console.log(teams);
        return NextResponse.json({teams}, {status: 200});
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: error}, {status: 500});
    }
    
}

function getStatus(status: string) : string  {
    console.log(status);
    switch (status) {
        // if there is still some students no filled the form
        case 'pending':
            return 'Pending';
        // if the issue is closed or judged by lecturer or anyone with the access to close it.
        case 'complete':
            return 'Complete';
        // if Student's comments are all filled
        case 'Need Feedback':
            return 'Need Feedback';
        default:
            return 'Unknown';
    }
}
