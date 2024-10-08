import dbConnect from '@/lib/dbConnect';
import csvParser from "csv-parser";
import { NextRequest, NextResponse } from "next/server";
import { Readable } from "stream";
import { createStudentInput, createTeamInput, createCourseInput, createAdminInput, initialiseInput } from '../../adminSystem/initialise/route';
import models from '@/models/models';

const {Student, Team, Course, Admin} = models;

type rawResult = {
    email: string;
    group_id: string;
    group_id2: string;
    mentor: string;
    class: string;
    groupname: string;
    zid: string;
    name: string;
}

// interface csvType {
//     name: string,
//     zid: number,
//     groupname: string,
//     class: string,
//     mentor: string,
//     group_id: number,
//     group_id2: number,
//     email: string
// }

export async function POST(req: NextRequest) {
    await dbConnect()
    // console.log("request received")
    const formData = await req.formData()
    const file = formData.get('csv') as File
    if (!file) {
        return NextResponse.json({ message: 'No file found!' }, { status: 409 })
    }
    const filename: string = file.name
    // console.log(`name is ${filename}`)
    const courseRegex = /COMP[0-9]{4}/
    const courseNameFound = filename.match(courseRegex)?.[0]
    if (!courseNameFound) {
        console.log("wrong name")
        return NextResponse.json({ message: 'Please include course name in title' }, { status: 406 })
    }
    const arrayBuffer = await file.arrayBuffer()
    const buffer: Buffer = Buffer.from(arrayBuffer)
    const csvStream = Readable.from(buffer)
    const results: rawResult[] = await parseCSV(csvStream)
    // console.log("parsed result is following:")
    // console.log(results)
    const converted: rawResult[] = results.map(row => {
        const lowerCaseRow = Object.fromEntries(
            Object.entries(row).map(([key, value]) => [key.toLowerCase().replace(/\s+/g, ''), value])
        ) as rawResult
        return lowerCaseRow
    })
    // console.log("converted result is following:")
    // console.log(converted)
    const validResults: rawResult[] = converted.filter(row =>
        row.name && row.zid && row.groupname && row.class
        && row.mentor && row.group_id && row.group_id2
        && row.email
    )
    // console.log("valid results are: ")
    // console.log(validResults)
    const courseAdmins: createAdminInput[] = []
    const staffAdmins: createAdminInput[] = []
    const students: createStudentInput[] = []
    const teams: createTeamInput[] = []
    const courses: createCourseInput[] = []

    for (const row of validResults) {
        // admin operations
        const admin = await Admin.findOne({
            adminName: row.mentor
        })
        if (!admin) { // no admins
            const adminFound: createAdminInput | undefined = courseAdmins.find(admin => admin.adminName === row.mentor)
            if (!adminFound) {
                const newAdmin: createAdminInput = {
                    adminName: row.mentor,
                    email: `${row.mentor}@unsw.edu.au`,
                    zid: `${row.zid}21`,
                    passwordRaw: 'don\'t know'
                }
                courseAdmins.push(newAdmin)
            }
        }

        // student operations
        const student = await Student.findOne({
            zid: row.zid
        })
        if (!student) { // database no student
            const studentFound: createStudentInput | undefined = students.find(student => student.zid === row.zid)
            if (!studentFound) { // array no student
                const newStudent: createStudentInput = {
                    studentName: row.name,
                    email: row.email,
                    zid: row.zid
                }
                students.push(newStudent)
            }
        }

        // team operations
        const team = await Team.findOne({
            teamName: row.groupname
        })
        if (!team) {
            const teamFound: createTeamInput | undefined = teams.find(team => team.teamName === row.groupname)
            if (!teamFound) {
                const newTeam: createTeamInput = {
                    teamName: row.groupname,
                    studentsZids: '',
                    mentorsZids: ''
                }
                newTeam.studentsZids += row.zid
                teams.push(newTeam)
            } else {
                teamFound.studentsZids += ','
                teamFound.studentsZids += row.zid
            }
        }
    }
    // course operations
    const course = await Course.findOne({
        courseName: courseNameFound
    })
    if (!course) {
        // console.log('no courses')
        const newCourse: createCourseInput = {
            courseName: courseNameFound,
            mentorsZids: '',
            teams: ''
        }
        for (const team of teams) {
            if (newCourse.teams === '') {
                newCourse.teams += team.teamName
            } else {
                newCourse.teams += ','
                newCourse.teams += team.teamName
            }
        }
        courses.push(newCourse)
    }
    const result: initialiseInput = {
        courseAdmins: courseAdmins,
        staffAdmins: staffAdmins,
        students: students,
        teams: teams,
        courses: courses
    }
    // console.log("final result is: ")
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
        return NextResponse.json(validResults, { status: 200 })
    } else {
        const errorObj = await response.json()
        const err = errorObj.error
        console.log(err)
        return NextResponse.json(err, {status: 500})
    }
}

function parseCSV(stream: Readable): Promise<rawResult[]> {
    const results: rawResult[] = []
    return new Promise((resolve, reject) => {
        stream.pipe(csvParser())
            .on('data', (row) => {
                results.push(row)
            })
            .on('end', () => resolve(results))
            .on('error', (err) => reject(err))
    })
}