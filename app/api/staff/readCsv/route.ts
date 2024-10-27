import { NextRequest, NextResponse } from "next/server";
import { createStudentInput, createTeamInput, createCourseInput, createAdminInput, initialiseInput } from '../../adminSystem/initialise/route';
import { convertFileData, courseNameRegexCheck, insertAdmin, insertStudent, insertTeam, insertTutor, validateConvertedData } from "./helpers";

export async function POST(req: NextRequest) {
    // console.log("request received")
    const formData = await req.formData()
    const file = formData.get('csv') as File
    if (!file) {
        return NextResponse.json('Incorrect file type or no file attached', { status: 400 })
    }
    const filename: string = file.name
    // console.log(`name is ${filename}`)
    const regexResult = courseNameRegexCheck(filename)
    if (typeof regexResult === 'string') {
        return NextResponse.json(regexResult, { status: 400 })
    }
    const [courseName, courseTerm] = regexResult

    const converted = await convertFileData(file)
    if (!validateConvertedData(converted)) {
        return NextResponse.json("Rows contain empty values, please check the csv file provided!", { status: 400 })
    }
    const courseAdmins: createAdminInput[] = []
    const staffAdmins: createAdminInput[] = []
    const students: createStudentInput[] = []
    const teams: createTeamInput[] = []
    const newCourse: createCourseInput = {
        courseName: courseName,
        term: courseTerm,
        mentorsEmails: '',
        teams: ''
    }

    const courseInfo = [courseName, courseTerm]
    // create and insert course
    insertAdmin(converted, courseAdmins, courseInfo)
    for (const row of converted) {
        // find and insert teams
        insertTeam(row, teams, newCourse)
        const teamToAdd = teams.find(team => team.teamName === row.groupname)
        insertTutor(row, staffAdmins, courseInfo, newCourse, teamToAdd!)
        insertStudent(row, students, teamToAdd!)
    }

    const result: initialiseInput = {
        courseAdmins: courseAdmins,
        staffAdmins: staffAdmins,
        students: students,
        teams: teams,
        course: newCourse
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/adminSystem/initialise`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(result)
    })
    if (response.ok) {
        return NextResponse.json(converted, { status: 200 })
    } else {
        const errorObj = await response.json()
        const err = errorObj.error
        return NextResponse.json(err, { status: 500 })
    }
}