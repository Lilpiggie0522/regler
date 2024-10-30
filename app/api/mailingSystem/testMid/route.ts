import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';

// import models from "@/models/models";

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

// Student:
// {"_id":{"$oid":"67020f6fb7b79c4588398bf6"},"studentName":"Multi Test","email":"z5361545@ad.unsw.edu.au","zid":"z5361545"}

// {"_id":{"$oid":"6700c9ab53ac3b3c37f5dea3"},"studentName":"Cow Horse","email":"cowhorse3900@outlook.com","zid":"z1314996"}
export async function DELETE() {
    try {
        await dbConnect();
        // const Team = models.Team;
        // await Team.findOneAndDelete({ _id: '67148e6edd88f94865e98a76' });
        // const Student = models.Student;
        // await Student.deleteOne({ _id: '67020f6fb7b79c4588398bf6' });
        // await Student.deleteOne({ _id: '6700c9ab53ac3b3c37f5dea3' });


        const input = {
            issueId: '670799fbb7b79c4588c8177d',
            personId: '67020f6fb7b79c4588398bf6',
            type: 'student',
        }

        const response = await fetch('http://localhost:3000/api/mailingSystem/setReminder', {
            method: 'DELETE', 
            headers: { 'Content-Type': 'application/json', }, 
            body: JSON.stringify(input)})
        const result = await response.json();

        return NextResponse.json({message: `deleted ${result}`}, {status: 200})
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error - notifyTutor:', error);
            return NextResponse.json({error: error.message}, {status: 502})
        }
    }
}
