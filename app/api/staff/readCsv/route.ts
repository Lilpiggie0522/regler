import dbConnect from '@/lib/dbConnect';
import csvParser from "csv-parser";
import { NextRequest, NextResponse } from "next/server";
import { Readable } from "stream";
import { createStudentInput, createTeamInput, createCourseInput, createAdminInput, initialiseInput } from '../../adminSystem/initialise/route';
import models from '@/models/models';

const { Student, Team, Course, Admin } = models;

type convertedResult = {
    name: string;
    zid: string;
    groupname: string;
    class: string;
    mentor: string;
    group_id: string;
    group_id2: string;
    email: string;
    mentor_email: string;
    course_admin: string;
    admin_email: string;
}

type DynamicResult = {
    [key: string]: string;
};

export async function POST(req: NextRequest) {
    await dbConnect()
    // console.log("request received")
    const formData = await req.formData()
    const file = formData.get('csv') as File
    if (!file) {
        return NextResponse.json('No file found!', { status: 400 })
    }
    const filename: string = file.name
    // console.log(`name is ${filename}`)
    const courseRegex = /COMP[0-9]{4}/
    const courseName = filename.match(courseRegex)?.[0]
    if (!courseName) {
        console.log("wrong name")
        return NextResponse.json('Please include course name in title', { status: 400 })
    }
    const courseTermRegex = /[0-9]{2}[Tt][0-3]/
    const courseTerm = filename.match(courseTermRegex)?.[0]
    if (!courseTerm) {
        return NextResponse.json('Please include course term in title', { status: 400 })
    }
    const arrayBuffer = await file.arrayBuffer()
    const buffer: Buffer = Buffer.from(arrayBuffer)
    const csvStream = Readable.from(buffer)
    const results = await parseCSV(csvStream)
    const converted: convertedResult[] = results.map(row => {
        const lowerCaseRow = Object.fromEntries(
            Object.entries(row).map(([key, value]) => [key.replace(/\s+/g, '').toLowerCase(), value])
        ) as convertedResult
        return lowerCaseRow
    })

    const courseAdmins: createAdminInput[] = []
    const staffAdmins: createAdminInput[] = []
    const students: createStudentInput[] = []
    const teams: createTeamInput[] = []
    let course: createCourseInput | null = null

    await Admin.deleteMany({});
    await Student.deleteMany({});
    await Team.deleteMany({});
    await Course.deleteMany({});

    for (const row of converted) {
        if (!(row.name && row.zid && row.groupname && row.class && row.mentor && row.group_id && row.group_id2 && row.email)) {
            return NextResponse.json("Rows contain empty values, please check the csv file provided!", { status: 400 })
        }
    }

    // create and insert course
    const newCourse: createCourseInput = {
        courseName: courseName,
        term: courseTerm,
        mentorsEmails: '',
        teams: ''
    }
    course = newCourse

    // find and insert admin from file
    const adminRows = converted.filter(row => row.course_admin && row.admin_email)
    for (const adminRow of adminRows) {
        const newAdminName = adminRow.course_admin
        const newAdminEmail = adminRow.admin_email
        const alreadyPushedAdmin = courseAdmins.find(admin => admin.email === newAdminEmail)
        if (!alreadyPushedAdmin) {
            const newAdmin: createAdminInput = {
                adminName: newAdminName,
                email: newAdminEmail,
                role: 'courseAdmin',
                courseName: courseName,
                term: courseTerm
            }
            courseAdmins.push(newAdmin)
        }
    }
    const currentCourse = course
    for (const row of converted) {
        // find and insert teams
        const newTeamName = row.groupname
        const alreadyPushedTeam = teams.find(team => team.teamName === newTeamName)
        if (!alreadyPushedTeam) {
            const newTeam: createTeamInput = {
                teamName: newTeamName,
                mentorsEmails: '',
                studentsZids: ''
            }
            teams.push(newTeam)

            // adding team to courses
            if (currentCourse) {
                if (!currentCourse.teams.split(',').includes(newTeamName)) {
                    if (currentCourse.teams === '') {
                        currentCourse.teams += newTeamName
                    } else {
                        currentCourse.teams += ','
                        currentCourse.teams += newTeamName
                    }
                }
            }
        }
        const teamToAdd = teams.find(team => team.teamName === newTeamName)
        // find and insert tutors
        const newMentorName = row.mentor
        const newMentorEmail = row.mentor_email
        const alreadyPushedMentor = staffAdmins.find(mentor => mentor.email === newMentorEmail)
        if (!alreadyPushedMentor) {
            const newMentor: createAdminInput = {
                adminName: newMentorName,
                email: newMentorEmail,
                courseName: courseName,
                term: courseTerm,
                role: 'tutor'
            }
            staffAdmins.push(newMentor)
            // adding mentor email to course
            if (currentCourse) {
                if(!currentCourse.mentorsEmails.split(',').includes(newMentorEmail)) {
                    if (currentCourse.mentorsEmails === '') {
                        currentCourse.mentorsEmails += newMentorEmail
                    } else {
                        currentCourse.mentorsEmails += ','
                        currentCourse.mentorsEmails += newMentorEmail
                    }
                }
            }

            // adding mentor id to team
            if (teamToAdd) {
                if(!teamToAdd.mentorsEmails.split(',').includes(newMentorEmail)) {
                    if (teamToAdd.mentorsEmails === '') {
                        teamToAdd.mentorsEmails += newMentorEmail
                    } else {
                        teamToAdd.mentorsEmails += ','
                        teamToAdd.mentorsEmails += newMentorEmail
                    }
                }
            }
        }

        // find and insert students
        const newStudentName = row.name
        const newStudentEmail = row.email
        const newStudentZid = row.zid
        const alreadyPushedStudent = students.find(student => student.zid === newStudentZid)
        if (!alreadyPushedStudent) {
            const newStudent: createStudentInput = {
                studentName: newStudentName,
                email: newStudentEmail,
                zid: newStudentZid
            }
            students.push(newStudent)
            
            // adding student id to team
            if (teamToAdd) {
                if(!teamToAdd.studentsZids.split(',').includes(newStudentZid)) {
                    if (teamToAdd.studentsZids === '') {
                        teamToAdd.studentsZids += newStudentZid
                    } else {
                        teamToAdd.studentsZids += ','
                        teamToAdd.studentsZids += newStudentZid
                    }
                }
            }
        }
    }

    const result: initialiseInput = {
        courseAdmins: courseAdmins,
        staffAdmins: staffAdmins,
        students: students,
        teams: teams,
        course: course
    }

    // console.log(result)

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/adminSystem/initialise`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(result)
    })
    if (response.ok) {
        return NextResponse.json(converted, {status: 200})
    } else {
        const errorObj = await response.json()
        const err = errorObj.error
        return NextResponse.json(err, { status: 500 })
    }
}

function parseCSV(stream: Readable): Promise<DynamicResult[]> {
    const results: DynamicResult[] = []
    return new Promise((resolve, reject) => {
        stream.pipe(csvParser())
            .on('data', (row) => {
                results.push(row)
            })
            .on('end', () => resolve(results))
            .on('error', (err) => reject(err))
    })
}