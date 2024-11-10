import dbConnect from "@/lib/dbConnect";
import models from "@/models/models";

const {Course, Team} = models;

export const getAdminsByCourseId = async (courseId: string): Promise<string[] | null> => {
    try {
        await dbConnect();
        const course = await Course.findById(courseId);
        if (!course) {
            return null;
        }

        const admins = await Course.aggregate([
            { $match: { _id: courseId } },
            {
                $lookup: {
                    from: "admins",
                    localField: "mentors",
                    foreignField: "_id",
                    as: "adminsDetails",
                }
            },
            { $unwind: "$adminsDetails" },
            { $match: { "adminsDetails.role": "admin" } },
            { $project: { "adminsDetails._id": 1 } }
        ]);

        // Ensure _id is a string and map the results
        const adminIds = admins.map(doc => String(doc.adminsDetails._id)); // Ensure _id is cast to string

        // Return the admin IDs as a string array
        return adminIds;
    } catch (error) {
        console.error(error); // Log the error for debugging purposes
        return null; // Return null in case of an error
    }
};
export const getStudentsByTeamId = async (teamId: string) => {
    try {
        await dbConnect();
        const team = await Team.findById(teamId);
        if (!team) {
            return null;
        }
        const students = await Team.aggregate([
            { $match: { _id: teamId } },
            {
                $lookup: {
                    from: "students",
                    localField: "students",
                    foreignField: "_id",
                    as: "studentDeatils",
                }
            },
            { $unwind: "$studentDeatils" },
            //{ $match: { "adminsDetails.role": "admin" } },
            { $project: { "studentDeatils._id": 1 } }
        ]);
        console.log(students);
        return students.map(doc => doc.studentDeatils._id);
    } catch (error) {
        return error;
    }
};