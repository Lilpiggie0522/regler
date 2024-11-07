import { NextRequest, NextResponse } from 'next/server';

// Mock data for assignments
let assignments = ['assignment1', 'assignment2'];

type Params = {
    params: {
      courseId: string
    }
  }
// Mock GET method
export async function GET(req : NextRequest, { params } : Params) {
    const courseId = params.courseId;
    try {
        console.log("The CourseId is:" + courseId);
        // await dbConnect();
        // if (!mongoose.isValidObjectId(courseId)) {
        //     return NextResponse.json({error: "invalid course id"}, {status: 400});
        // }
        // const course = await Course.findById(courseId).exec();
        // if (!course) {
        //     return NextResponse.json({error: "course not found"}, {status: 404});
        // }
        // const lecturer = await Admin.findOne({ courses: { $in: [courseId] }, role: 'admin' });
        // const lecturerName = lecturer.adminName;

        
        // const teamIds = course.teams;
        // let teams: TeamListResponse[] = [];
        // const teamData = await Team.aggregate([
        //     {
        //         $match: { _id: { $in: teamIds } }  // Match only specified teams
        //     },
        //     {
        //         $lookup: {
        //             from: 'admins',  // Collection for mentors
        //             localField: 'mentors',
        //             foreignField: '_id',
        //             as: 'mentorDetails'
        //         }
        //     },
        //     {
        //         $lookup: {
        //             from: 'issues',  // Collection for issues
        //             localField: 'issues',
        //             foreignField: '_id',
        //             as: 'issueDetails'
        //         }
        //     },
        //     {
        //         $unwind: {
        //             path: '$issueDetails',
        //             preserveNullAndEmptyArrays: true  // Allows handling of teams without an associated issue
        //         }
        //     },
        //     // Optional future filtering stage for `issueDetails`:
        //     // {
        //     //     $match: { 'issueDetails.someField': someValue }
        //     // },
        //     {
        //         $project: {
        //             teamName: 1,
        //             _id: 1,
        //             'mentorDetails.adminName': 1,  // Only keep mentor names
        //             'issueDetails.status': 1       // Only keep issue status
        //         }
        //     }
        // ]);
        // Process the data for easier use if necessary
        // let assignments = ['assignment1', 'assignment2'];
        

        console.log(assignments);
        return NextResponse.json({assignments}, {status: 200});
    } catch (error) {
        return NextResponse.json({ error: error}, {status: 500});
    }
    
}

// Mock PUT method
export async function PUT(request: NextRequest, { params } : Params) {
    const courseId = params.courseId;
    console.log("going!!!! courseID:", courseId)

    try {
        const { assignments: updatedAssignments } = await request.json(); // Get the assignments from the request body

        // Update the assignments with the new assignments
        assignments = updatedAssignments;

        return NextResponse.json({ message: 'Assignments updated successfully!', assignments }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to update assignments.' }, { status: 500 });
    }
}
