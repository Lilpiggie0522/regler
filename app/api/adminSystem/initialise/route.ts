import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import bcrypt from 'bcrypt';

import models from "@/models/models";

//const Issue = models.Issue;
const Student = models.Student;
const Team = models.Team;
const Course = models.Course;
const Admin = models.Admin;


export interface createAdminInput {
    
    adminName: string,
    email: string,
    zid: string,
    passwordRaw: string,
}
export interface createStudentInput {
    
    studentName: string,
    email: string,
    zid: string,
}
// studentsZids = zid1,zid2,zid3...
// mentorsZids = zid1,zid2,zid3..
export interface createTeamInput {
    teamName: string,
    studentsZids: string,
    mentorsZids: string,
}
// teams = teamName1,teamName2...
export interface createCourseInput {
    courseName: string,
    mentorsZids: string,
    teams: string,
}

export interface initialiseInput {
    courseAdmins: createAdminInput[],
    staffAdmins: createAdminInput[],
    students: createStudentInput[],
    // students and mentors should be in the form of zid,zid2,zid3
    teams: createTeamInput [],
    courses: createCourseInput[]
}



//TODO: get all the courses
export async function POST(req : NextRequest) {
    // step 1 sign up course admins
    // step 2 sign up staff admins
    // step 3 sign up students
    // step 4 create teams and assign students and staff
    // step 5 create courses and assign teams, staff admins and courses admins
    
    try {
        await dbConnect();
        const request = await req.json();
        
        const { courseAdmins, staffAdmins, students, teams, courses } = request as initialiseInput;
        /* delete all the info depends on what client is configured.
        await Admin.deleteMany({});
        await Student.deleteMany({});
        await Team.deleteMany({});
        await Course.deleteMany({});
        await Issue.deleteMany({});
        */

        for (const courseAdmin of courseAdmins) {
            const password = await bcrypt.hash(courseAdmin.passwordRaw, 10);
            await Admin.create({
                adminName: courseAdmin.adminName,
                email: courseAdmin.email,
                zid: courseAdmin.zid,
                password: password,
                role: "courseAdmin",
            });

            console.log(`Course admin ${courseAdmin.adminName} created.`);
        }
        for (const staff of staffAdmins) {
            const password = await bcrypt.hash(staff.passwordRaw, 10);
            await Admin.create({
                adminName: staff.adminName,
                email: staff.email,
                zid: staff.zid,
                password: password,
                role: "tutor",
            });
            console.log(`Staff admin ${staff.adminName} created.`);
        }
        for (const student of students) {
            await Student.create({
                studentName: student.studentName,
                email: student.email,
                zid: student.zid,
            })
        }
        for (const team of teams) {
            const teamStudentZids = team.studentsZids.split(",");
            const teamMentorsZids = team.mentorsZids.split(",");
            // initialise a team
            const newTeam = await Team.create({
                teamName: team.teamName,
                students: [],
                mentors: []
            });
            const studentIds = [];
            const mentorsIds = []; 
            // adding student to Team model
            for (const studentZid of teamStudentZids) {
                // sutd
                const student = await Student.findOne({zid: studentZid}).exec();
                if (!student) {
                    return NextResponse.json({error: `incorrect student zid when adding to the team ${newTeam.teamName}`}, {status:404});
                }
                studentIds.push(student._id);
                
            }
            for (const mentorZid of teamMentorsZids) {
                // mentor
                const mentor = await Admin.findOne({zid: mentorZid}).exec();
                if (!mentor) {
                    return NextResponse.json({error: `incorrect mentor zid: ${mentorZid} when adding to the team ${newTeam.teamName}`}, {status:404});
                }
                mentorsIds.push(mentor._id);
            }
            await newTeam.updateOne({
                students: studentIds,
                mentors: mentorsIds,
            });
        }
        for (const course of courses) {
            const courseTeamNames = course.teams.split(',');
            const courseMentorZids = course.mentorsZids.split(',');
            const newCourse = await Course.create({
                courseName: course.courseName,
                mentors: [],
                teams: [],
                //courseAdmins: course.courseAdmins.split(","),
            });
            const teams = [];
            const mentorsIds = []; 
            // adding student to Team model
            for (const teamName of courseTeamNames) {
                // sutd
                const team = await Team.findOne({teamName: teamName}).exec();
                if (!team) {
                    return NextResponse.json({error: `incorrect team name: ${teamName} when adding to the course ${newCourse.courseName}`}, {status:404});
                }
                teams.push(team._id);
                
            }
            for (const mentorZid of courseMentorZids) {
                // mentor
                const mentor = await Admin.findOne({zid: mentorZid}).exec();
                if (!mentor) {
                    return NextResponse.json({error: `incorrect mentor zid when adding to the course ${newCourse.courseName}`}, {status:404});
                }
                mentorsIds.push(mentor._id);
            }
            await newCourse.updateOne({
                teams: teams,
                mentors: mentorsIds,
            });
        }
        return NextResponse.json({ message: "Initialisation successful.", courses, teams}, {status: 200});
    } catch (error) {
        return NextResponse.json({ error: error}, {status: 500});
    }

}