import csvParser from "csv-parser";
import { Readable } from "stream";
import { createAdminInput, createCourseInput, createStudentInput, createTeamInput } from "../../adminSystem/initialise/route";

export type convertedResult = {
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
export function courseNameRegexCheck(filename: string): string | string[]{
    const courseRegex = /[A-Za-z]{4}[0-9]{4}/;
    const courseMatch = filename.match(courseRegex);
    if (!courseMatch) {
        return "Please include course name in title."
    }

    const courseTermRegex = /[0-9]{2}[Tt][0-3]/;
    const courseTermMatch = filename.match(courseTermRegex);
    if (!courseTermMatch) {
        return "Please include course term in title."
    }
    return [courseMatch![0], courseTermMatch![0]]
}

export function parseCSV(stream: Readable): Promise<DynamicResult[]> {
    const results: DynamicResult[] = []
    return new Promise((resolve, reject) => {
        stream.pipe(csvParser())
            .on("data", (row) => {
                results.push(row)
            })
            .on("end", () => resolve(results))
            .on("error", (err) => reject(err))
    })
}

export async function convertFileData(file: File): Promise<convertedResult[]> {
    const arrayBuffer = await file.arrayBuffer()
    const buffer: Buffer = Buffer.from(arrayBuffer)
    const csvStream = Readable.from(buffer.toString())
    const results = await parseCSV(csvStream)
    const converted: convertedResult[] = results.map(row => {
        const lowerCaseRow = Object.fromEntries(
            Object.entries(row).map(([key, value]) => [key.replace(/\s+/g, "").toLowerCase(), value?.trim()])
        ) as convertedResult
        return lowerCaseRow
    })
    return converted
}

export function validateConvertedData(converted: convertedResult[]): boolean {
    for (const row of converted) {
        if (!(row.name && row.zid && row.groupname && row.class && row.mentor && row.group_id && row.group_id2 && row.email)) {
            return false
        }
    }
    return true
}

export function insertAdmin(converted: convertedResult[], courseAdmins: createAdminInput[], courseInfo: string[]): void {
    const [courseName, courseTerm] = courseInfo
    const adminRows = converted.filter(row => row.course_admin && row.admin_email)
    for (const adminRow of adminRows) {
        const newAdminName = adminRow.course_admin
        const newAdminEmail = adminRow.admin_email
        const alreadyPushedAdmin = courseAdmins.find(admin => admin.email === newAdminEmail)
        if (!alreadyPushedAdmin) {
            const newAdmin: createAdminInput = {
                adminName: newAdminName,
                email: newAdminEmail,
                role: "admin",
                courseName: courseName,
                term: courseTerm
            }
            courseAdmins.push(newAdmin)
        }
    }
}

export function insertTeam(row: convertedResult, teams: createTeamInput[], newCourse: createCourseInput): void {
    const newTeamName = row.groupname
    const alreadyPushedTeam = teams.find(team => team.teamName === newTeamName)
    if (!alreadyPushedTeam) {
        const newTeam: createTeamInput = {
            teamName: newTeamName,
            mentorsEmails: "",
            studentsZids: ""
        }
        teams.push(newTeam)

        // adding team to courses
        if (!newCourse.teams.split(",").includes(newTeamName)) {
            if (newCourse.teams === "") {
                newCourse.teams += newTeamName
            } else {
                newCourse.teams += ","
                newCourse.teams += newTeamName
            }
        }
    }
}

export function insertTutor(row: convertedResult, staffAdmins: createAdminInput[], courseInfo: string[], newCourse: createCourseInput, teamToAdd: createTeamInput): void {
    // find and insert tutors
    const [courseName, courseTerm] = courseInfo
    const newMentorName = row.mentor
    const newMentorEmail = row.mentor_email
    const alreadyPushedMentor = staffAdmins.find(mentor => mentor.email === newMentorEmail)
    // const teamToAdd = teams.find(team => team.teamName === row.groupname)
    if (!alreadyPushedMentor) {
        const newMentor: createAdminInput = {
            adminName: newMentorName,
            email: newMentorEmail,
            courseName: courseName,
            term: courseTerm,
            role: "tutor"
        }
        staffAdmins.push(newMentor)
        // adding mentor email to course
        if (newCourse.mentorsEmails) {
            newCourse.mentorsEmails += ","
        }
        newCourse.mentorsEmails += newMentorEmail
        // adding mentor id to team
        if (teamToAdd) {
            if (!teamToAdd.mentorsEmails.split(",").includes(newMentorEmail)) {
                if (teamToAdd.mentorsEmails) {
                    teamToAdd.mentorsEmails += ","
                }
                teamToAdd.mentorsEmails += newMentorEmail
            }
        }
    } else {
        // if (!newCourse.mentorsEmails.split(',').includes(newMentorEmail)) {
        //     // adding mentor email to course
        //     if (newCourse.mentorsEmails) {
        //         newCourse.mentorsEmails += ','
        //     }
        //     newCourse.mentorsEmails += newMentorEmail
        // }
        
        // adding mentor id to team
        if (teamToAdd) {
            if (!teamToAdd.mentorsEmails.split(",").includes(newMentorEmail)) {
                if (teamToAdd.mentorsEmails) {
                    teamToAdd.mentorsEmails += ","
                }
                teamToAdd.mentorsEmails += newMentorEmail
            }
        }
    }
}

export function insertStudent(row: convertedResult, students: createStudentInput[], teamToAdd: createTeamInput) {
    // find and insert students
    const newStudentName = row.name
    const newStudentEmail = row.email
    const newStudentZid = row.zid
    //const newStudentClass = row.class
    const alreadyPushedStudent = students.find(student => student.zid === newStudentZid)
    if (!alreadyPushedStudent) {
        const newStudent: createStudentInput = {
            studentName: newStudentName,
            email: newStudentEmail,
            zid: newStudentZid,
            //class: newStudentClass
        }
        students.push(newStudent)

        // adding student id to team
        if (teamToAdd) {
            if (!teamToAdd.studentsZids.split(",").includes(newStudentZid)) {
                if (teamToAdd.studentsZids === "") {
                    teamToAdd.studentsZids += newStudentZid
                } else {
                    teamToAdd.studentsZids += ","
                    teamToAdd.studentsZids += newStudentZid
                }
            }
        }
    }
}