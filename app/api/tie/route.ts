import dbConnect from "@/lib/dbConnect";
import models from "@/models/models";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const c_name = req.nextUrl.searchParams.get('name')
    console.log(c_name)
    await dbConnect()

    const Admin = models.Admin;
    try {
        const admins = await Admin.aggregate([
            {
                $lookup: {
                    from: 'courses',
                    localField: 'courses',
                    foreignField: '_id',
                    as: 'courseDetails'
                }
            },
            // {
            //     $unwind: '$courseDetails'
            // },
            {
                $match: {
                    'courseDetails.courseName': c_name
                }
            },
            // {
            //     // Optional: Project only the necessary fields
            //     $project: {
            //         adminName: 1,
            //         email: 1,
            //         role: 1,
            //         'courseDetails.courseName': 1,
            //         'courseDetails.term': 1
            //     }
            // }
            {
                $project: {
                    adminName: 1,
                    'courseDetails.teams': 1
                }
            }
        ])
        return NextResponse.json(admins, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json("something wrong", { status: 404 })
    }
}