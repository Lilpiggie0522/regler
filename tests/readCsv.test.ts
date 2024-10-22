import { createAdminInput, createCourseInput, createStudentInput, createTeamInput } from '@/app/api/adminSystem/initialise/route'
import * as func from '../app/api/staff/readCsv/helpers'
import { convertedResult } from '@/app/api/staff/readCsv/helpers'

jest.mock('csv-parser', () => jest.fn())
const converted: convertedResult[] = [
    {
        name: 'piggie',
        zid: 'z5414088',
        groupname: 'danny\'s group',
        class: 'T22A_12',
        mentor: 'danny',
        group_id: 'T22A_12',
        group_id2: 'z5414088',
        email: 'z5414088@ad.unsw.edu.au',
        mentor_email: 'z111111@unsw.edu.au',
        course_admin: 'chris',
        admin_email: 'chris@unsw.edu.au',
    },
    {
        name: 'piggie1',
        zid: 'z5414082',
        groupname: 'danny\'s group',
        class: 'T22A_12',
        mentor: 'danny',
        group_id: 'T22A_12',
        group_id2: 'z5414088',
        email: 'z5414028@ad.unsw.edu.au',
        mentor_email: 'z111111@unsw.edu.au',
        course_admin: 'chris',
        admin_email: 'chris@unsw.edu.au'
    }
]

let courseAdmins: createAdminInput[] = []
let staffAdmins: createAdminInput[] = []
let students: createStudentInput[] = []
let teams: createTeamInput[] = []
let newCourse: createCourseInput = {
    courseName: '',
    term: '',
    mentorsEmails: '',
    teams: ''
}

let convertedData: convertedResult[] = []
const courseInfo = ['COMP3900', '24T3']

beforeEach(() => {
    courseAdmins = []
    staffAdmins = []
    students = []
    teams = []
    newCourse = {
        courseName: '',
        term: '',
        mentorsEmails: '',
        teams: ''
    }
    convertedData = [
        {
            name: "piggie0",
            zid: "z1234567",
            groupname: "piggie squad 0",
            class: "T13B",
            mentor: "Piggie",
            group_id: "z1234567",
            group_id2: "T13B_Piggie0",
            email: "z1234567@student.unsw.edu.au",
            mentor_email: "z2232322@unsw.edu.au",
            course_admin: "real_piggie",
            admin_email: "z5414078@unsw.edu.au",
        },
        {
            name: "piggie1",
            zid: "z1234568",
            groupname: "piggie squad 0",
            class: "T13B",
            mentor: "Piggie",
            group_id: "z1234568",
            group_id2: "T13B_Piggie0",
            email: "z1234568@student.unsw.edu.au",
            mentor_email: "z2232322@unsw.edu.au",
            course_admin: "",
            admin_email: "",
        },
        {
            name: "piggie2",
            zid: "z1234569",
            groupname: "piggie squad 0",
            class: "T13B",
            mentor: "Piggie",
            group_id: "z1234569",
            group_id2: "T13B_Piggie0",
            email: "z1234569@student.unsw.edu.au",
            mentor_email: "z2232322@unsw.edu.au",
            course_admin: "",
            admin_email: "",
        },
        {
            name: "piggie3",
            zid: "z1234571",
            groupname: "piggie squad 1",
            class: "T13B",
            mentor: "Piggie1",
            group_id: "z1234571",
            group_id2: "T13B_Piggie1",
            email: "z1234571@student.unsw.edu.au",
            mentor_email: "z2232323@unsw.edu.au",
            course_admin: "",
            admin_email: "",
        },
        {
            name: "piggie4",
            zid: "z1234572",
            groupname: "piggie squad 1",
            class: "T13B",
            mentor: "Piggie1",
            group_id: "z1234572",
            group_id2: "T13B_Piggie1",
            email: "z1234572@student.unsw.edu.au",
            mentor_email: "z2232323@unsw.edu.au",
            course_admin: "",
            admin_email: "",
        },
        {
            name: "doggie0",
            zid: "z1234576",
            groupname: "doggie squad 0",
            class: "T21A",
            mentor: "Doggie",
            group_id: "z1234576",
            group_id2: "T21A_Doggie0",
            email: "z1234576@student.unsw.edu.au",
            mentor_email: "z2232324@unsw.edu.au",
            course_admin: "",
            admin_email: "",
        },
        {
            name: "doggie1",
            zid: "z1234577",
            groupname: "doggie squad 0",
            class: "T21A",
            mentor: "Doggie",
            group_id: "z1234577",
            group_id2: "T21A_Doggie0",
            email: "z1234577@student.unsw.edu.au",
            mentor_email: "z2232324@unsw.edu.au",
            course_admin: "",
            admin_email: "",
        },
        {
            name: "Jeffrey",
            zid: "z5414078",
            groupname: "jeffrey squad",
            class: "T22A",
            mentor: "Danny",
            group_id: "z5414078",
            group_id2: "T22A_Danny",
            email: "belikov9519@gmail.com",
            mentor_email: "cowhorse3900@outlook.com",
            course_admin: "",
            admin_email: "",
        },
        {
            name: "Wilson",
            zid: "z5423255",
            groupname: "jeffrey squad",
            class: "T22A",
            mentor: "Danny",
            group_id: "z5423255",
            group_id2: "T22A_Danny",
            email: "wilsonzhu2003@gmail.com",
            mentor_email: "cowhorse3900@outlook.com",
            course_admin: "",
            admin_email: "",
        },
        {
            name: "Guojing",
            zid: "z5450260",
            groupname: "jeffrey squad",
            class: "T22A",
            mentor: "Danny",
            group_id: "z5450260",
            group_id2: "T22A_Danny",
            email: "z5450260@ad.unsw.edu.au",
            mentor_email: "cowhorse3900@outlook.com",
            course_admin: "",
            admin_email: "",
        },
        {
            name: "Rocky",
            zid: "z5349042",
            groupname: "jeffrey squad",
            class: "T22A",
            mentor: "Danny",
            group_id: "z5349042",
            group_id2: "T22A_Danny",
            email: "z5349042@ad.unsw.edu.au",
            mentor_email: "cowhorse3900@outlook.com",
            course_admin: "",
            admin_email: "",
        },
        {
            name: "Ruiqi",
            zid: "z5361545",
            groupname: "jeffrey squad",
            class: "T22A",
            mentor: "Danny",
            group_id: "z5361545",
            group_id2: "T22A_Danny",
            email: "z5361545@ad.unsw.edu.au",
            mentor_email: "cowhorse3900@outlook.com",
            course_admin: "",
            admin_email: "",
        },
        {
            name: "Waner",
            zid: "z5417505",
            groupname: "jeffrey squad",
            class: "T22A",
            mentor: "Danny",
            group_id: "z5417505",
            group_id2: "T22A_Danny",
            email: "z5417505@ad.unsw.edu.au",
            mentor_email: "cowhorse3900@outlook.com",
            course_admin: "",
            admin_email: "",
        },
    ];
})

describe("Tests for csv", () => {
    test('regex valid name', () => {
        const courseName = 'COMP3900_24T3GOODTEAMS'
        expect(func.courseNameRegexCheck(courseName)).toEqual(['COMP3900', '24T3'])
    })

    test('regex invalid name', () => {
        const courseName = 'COMPd3kls_24T3GOODTEAMS'
        expect(func.courseNameRegexCheck(courseName)).toBe('Please include course name in title')
    })

    test('regex invalid term', () => {
        const courseName = 'COMP3822_24glstgGOODTEAMS'
        expect(func.courseNameRegexCheck(courseName)).toBe('Please include course term in title')
    })

    test('validate data test -> valid data', () => {
        expect(func.validateConvertedData(converted)).toBeTruthy()
    })

    test('validate data test -> invalid data', () => {
        converted[0].class = ''
        expect(func.validateConvertedData(converted)).toBeFalsy()
    })

    test('insert admins', () => {
        func.insertAdmin(convertedData, courseAdmins, courseInfo)
        expect(courseAdmins).toStrictEqual([
            {
                adminName: "real_piggie",
                email: "z5414078@unsw.edu.au",
                role: 'courseAdmin',
                courseName: courseInfo[0],
                term: courseInfo[1]
            }
        ])
    })

    test('insert admins twice', () => {
        func.insertAdmin(convertedData, courseAdmins, courseInfo)
        func.insertAdmin(convertedData, courseAdmins, courseInfo)
        expect(courseAdmins).toStrictEqual([
            {
                adminName: "real_piggie",
                email: "z5414078@unsw.edu.au",
                role: 'courseAdmin',
                courseName: courseInfo[0],
                term: courseInfo[1]
            }
        ])
    })

    test('insert team', () => {
        for (const row of convertedData) {
            func.insertTeam(row, teams, newCourse)
            const teamToAdd = teams.find(team => team.teamName === row.groupname)
            func.insertTutor(row, staffAdmins, courseInfo, newCourse, teamToAdd!)
            func.insertStudent(row, students, teamToAdd!)
        }
        expect(teams).toStrictEqual([
            {
                teamName: 'piggie squad 0',
                studentsZids: 'z1234567,z1234568,z1234569',
                mentorsEmails: 'z2232322@unsw.edu.au'
            },
            {
                teamName: 'piggie squad 1',
                studentsZids: 'z1234571,z1234572',
                mentorsEmails: 'z2232323@unsw.edu.au'
            },
            {
                teamName: 'doggie squad 0',
                studentsZids: 'z1234576,z1234577',
                mentorsEmails: 'z2232324@unsw.edu.au'
            },
            {
                teamName: 'jeffrey squad',
                studentsZids: 'z5414078,z5423255,z5450260,z5349042,z5361545,z5417505',
                mentorsEmails: 'cowhorse3900@outlook.com'
            },
        ])
    })

})