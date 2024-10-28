import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import models from "@/models/models";


const Student = models.Student;
const Team = models.Team;
const Course = models.Course;
const Admin = models.Admin;


export interface createAdminInput {
    adminName: string,
    email: string,
    role: string,
    courseName: string,
    term: string
}

export interface createStudentInput {
    studentName: string,
    email: string,
    zid: string,
}

export interface createTeamInput {
    teamName: string,
    studentsZids: string,
    mentorsEmails: string,
}
// teams = teamName1,teamName2...
export interface createCourseInput {
    courseName: string,
    mentorsEmails: string,
    teams: string,
    term: string
}

export interface initialiseInput {
    courseAdmins: createAdminInput[],
    staffAdmins: createAdminInput[],
    students: createStudentInput[],
    // students and mentors should be in the form of zid,zid2,zid3
    teams: createTeamInput[],
    course: createCourseInput
}



//TODO: get all the courses
export async function POST(req: NextRequest) {
    // step 1 sign up course admins
    // step 2 sign up staff admins
    // step 3 sign up students
    // step 4 create teams and assign students and staff
    // step 5 create courses and assign teams, staff admins and courses admins

    try {
        await dbConnect();
        const request = await req.json();

        const { courseAdmins, staffAdmins, students, teams, course } = request as initialiseInput;
        const term = course?.term
        

        // create course
        let courseId = null;
        const courseFound = await Course.findOne({ courseName: course?.courseName, term: course?.term })
        if (!courseFound) {
            const newCourse = await Course.create({
                courseName: course?.courseName,
                teams: [],
                mentors: [],
                term: term

            })
            courseId = newCourse._id
        } else {
            courseId = courseFound._id
        }
        const currentCourse = await Course.findById(courseId)
        // create students
        for (const student of students) {
            const studentFound = await Student.findOne({email: student.email})
            if (!studentFound) {
                await Student.create({
                    studentName: student.studentName,
                    email: student.email,
                    zid: student.zid,
                    course: [courseId]
                })
            } else {
                const enrolled = studentFound.course.includes(courseId)
                if (!enrolled) {
                    studentFound.course.push(courseId)
                    await studentFound.save()
                }
            }
        }

        // create course admins
        for (const admin of courseAdmins) {
            const adminFound = await Admin.findOne({ email: admin.email })
            if (!adminFound) {
                const newAdmin = await Admin.create({
                    adminName: admin.adminName,
                    email: admin.email,
                    role: admin.role,
                    courses: [courseId]
                })
                currentCourse.mentors.push(newAdmin._id)
            } else {
                const hasId = adminFound.courses.includes((id: string) => id === courseId)
                if (!hasId) {
                    adminFound.courses.push(courseId)
                    await adminFound.save()
                }
                if(!currentCourse.mentors.includes(adminFound._id)) {
                    currentCourse.mentors.push(adminFound._id)
                }
            }
            await currentCourse.save()
        }

        // create tutors(staffAdmins)
        for (const tutor of staffAdmins) {
            const tutorFound = await Admin.findOne({ email: tutor.email })
            if (!tutorFound) {
                const newAdmin = await Admin.create({
                    adminName: tutor.adminName,
                    email: tutor.email,
                    role: tutor.role,
                    courses: [courseId]
                })
                currentCourse.mentors.push(newAdmin._id)
            } else {
                const hasId = tutorFound.courses.includes((id: string) => id === courseId)
                if (!hasId) {
                    tutorFound.courses.push(courseId)
                    await tutorFound.save()
                }
                if(!currentCourse.mentors.includes(tutorFound._id)) {
                    currentCourse.mentors.push(tutorFound._id)
                }
            }
            await currentCourse.save()
        }

        // create teams
        for (const team of teams) {
            const teamFound = await Team.findOne({teamName: team.teamName, course: courseId})
            const passedMentorsEmails = team.mentorsEmails.split(',')
            const passedStudentIds = team.studentsZids.split(',')
            if (!teamFound) {
                const mentorIds = []
                for (const email of passedMentorsEmails) {
                    const mentorForTeam = await Admin.findOne({email: email})
                    if (!mentorForTeam) {
                        return NextResponse.json("cannot find team!", {status: 500})
                    }
                    mentorIds.push(mentorForTeam._id)
                }

                const studentIds = []
                for (const id of passedStudentIds) {
                    const studentInTeam = await Student.findOne({zid: id})
                    if (!studentInTeam) {
                        return NextResponse.json("cannot find student!", {status: 500})
                    }
                    studentIds.push(studentInTeam._id)
                }

                const newTeam = await Team.create({
                    teamName: team.teamName,
                    course: courseId,
                    students: studentIds,
                    mentors: mentorIds,
                    issues: []
                })
                currentCourse.teams.push(newTeam._id)
            } else {
                for (const mentor_email of passedMentorsEmails) {
                    const mentor = await Admin.findOne({email: mentor_email})
                    if (!mentor) {
                        return NextResponse.json("cannot find tutor!", {status: 500})
                    }
                    const hasMentor = teamFound.mentors.includes(mentor._id)
                    if (!hasMentor) {
                        teamFound.mentors.push(mentor._id)
                        await teamFound.save()
                    }
                }
                for (const studentId of passedStudentIds) {
                    const student = await Student.findOne({zid: studentId})
                    if (!student) {
                        return NextResponse.json("cannot find tutor!", {status: 500})
                    }
                    const hasStudent = teamFound.students.includes(student._id)
                    if (!hasStudent) {
                        teamFound.students.push(student._id)
                        await teamFound.save()
                    }
                }
                if (!currentCourse.teams.includes(teamFound._id)) {
                    currentCourse.teams.push(teamFound._id)
                }
            }
            await currentCourse.save()
        }
        const curCourses = await Course.find({}).select('+courseName +teams +mentors').exec();
        const curTeams = await Team.find({}).exec();
        const curStudents = await Student.find({}).exec();
        
        return NextResponse.json({ message: "Initialisation successful.", curCourses, curTeams, curStudents }, { status: 200 });
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: error }, { status: 500 });
    }

}