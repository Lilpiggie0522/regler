import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';

import models from "@/models/models";

// const Admin = models.Admin;


/*
    Input: 
        - mentors: List of Admin ids (Tutor) in the team
        - team: Team name in string
        - course: course name in string
    Output: 
        Send email to notify tutors, call by sendTeam
    Error:
        - Check if tutor exists
*/

// {"_id":{"$oid":"67148e6edd88f94865e98a76"},"teamName":"second team","students":["67020f6fb7b79c4588398bf6","6700c9ab53ac3b3c37f5dea3","670222deb7b79c45884600d7"],"mentors":["6710b956dd88f948652e71bf"]}
export async function DELETE() {
    try {
        await dbConnect();
        const Team = models.Team;
        await Team.findOneAndDelete({ _id: '67148e6edd88f94865e98a76' });

        return NextResponse.json({message: 'deleted'}, {status: 200})
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error - notifyTutor:', error);
            return NextResponse.json({error: error.message}, {status: 502})
        }
    }
}
