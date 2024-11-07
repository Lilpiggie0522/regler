import { createAdminInput, createCourseInput, createStudentInput, createTeamInput } from '@/app/api/adminSystem/initialise/dbInitialisation'
import * as func from '@/app/api/staff/readCsv/helpers'

import { convertedResult, convertFileData } from '@/app/api/staff/readCsv/helpers'

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
        courseName: courseInfo[0],
        term: courseInfo[1],
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

})

describe("read csv route", () => {
    it('should convert a file to parsed CSV data', async () => {
        const mockCsvData = 'Name,zid,group Name,Class,mentor,group_id,group_id2,email,mentor_email,course_admin,admin_email\
        \npiggie0,z1234567,piggie squad0,T13B,Piggie,z1234567,T13B_Piggie0,z1234567@student.unsw.edu.au,z2232322@unsw.edu.au,\
        real_piggie,z5414078@ad.unsw.edu.au';
        const mockFile = new File([mockCsvData], 'test.csv', { type: 'text/csv' });

        const result = await convertFileData(mockFile);
        expect(result).toStrictEqual([
            {
                name: 'piggie0',
                zid: 'z1234567',
                groupname: 'piggie squad0',
                class: 'T13B',
                mentor: 'Piggie',
                group_id: 'z1234567',
                group_id2: 'T13B_Piggie0',
                email: 'z1234567@student.unsw.edu.au',
                mentor_email: 'z2232322@unsw.edu.au',
                course_admin: 'real_piggie',
                admin_email: 'z5414078@ad.unsw.edu.au'
            }
        ])
    });
})

describe("data insertion", () => {
    test('admin_test: insert admins', () => {
        func.insertAdmin(convertedData, courseAdmins, courseInfo)
        expect(courseAdmins).toStrictEqual([
            {
                adminName: "real_piggie",
                email: "z5414078@unsw.edu.au",
                role: 'admin',
                courseName: courseInfo[0],
                term: courseInfo[1]
            }
        ])
    })

    test('admin_test: insert admins twice', () => {
        func.insertAdmin(convertedData, courseAdmins, courseInfo)
        func.insertAdmin(convertedData, courseAdmins, courseInfo)
        expect(courseAdmins).toStrictEqual([
            {
                adminName: "real_piggie",
                email: "z5414078@unsw.edu.au",
                role: 'admin',
                courseName: courseInfo[0],
                term: courseInfo[1]
            }
        ])
    })

    test('team_test: insert team', () => {
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

    test('team_test: two tutors in a team', () => {
        convertedData.push({
            name: "hehe boi",
            zid: "z5417509",
            groupname: "jeffrey squad",
            class: "T22A",
            mentor: "test mentor",
            group_id: "z5417505",
            group_id2: "T22A_Danny",
            email: "z5417509@ad.unsw.edu.au",
            mentor_email: "hehe_boi@bbc.co.uk",
            course_admin: "",
            admin_email: ""
        })
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
                studentsZids: 'z5414078,z5423255,z5450260,z5349042,z5361545,z5417505,z5417509',
                mentorsEmails: 'cowhorse3900@outlook.com,hehe_boi@bbc.co.uk'
            },
        ])
    })

    test("team_test: mentor added in a team, but also mentor of next team", () => {
        convertedData.push({
            name: "hehe boi",
            zid: "z5417509",
            groupname: "jeffrey squad",
            class: "T22A",
            mentor: "test mentor",
            group_id: "z5417505",
            group_id2: "T22A_Danny",
            email: "z5417509@ad.unsw.edu.au",
            mentor_email: "hehe_boi@bbc.co.uk",
            course_admin: "",
            admin_email: ""
        })
        convertedData.push({
            name: "special kid",
            zid: "z5322112",
            groupname: "child_prodigy",
            class: "T22A",
            mentor: "Danny",
            group_id: "z5417505",
            group_id2: "T22A_Danny",
            email: "z5322112@ad.unsw.edu.au",
            mentor_email: "cowhorse3900@outlook.com",
            course_admin: "",
            admin_email: "",
        },)
        convertedData.push({
            name: "even more special kid",
            zid: "z5555555",
            groupname: "child_prodigy",
            class: "T22A",
            mentor: "test mentor",
            group_id: "z5555555",
            group_id2: "T22A_Danny",
            email: "z5555555@ad.unsw.edu.au",
            mentor_email: "hehe_boi@bbc.co.uk",
            course_admin: "",
            admin_email: "",
        },)
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
                studentsZids: 'z5414078,z5423255,z5450260,z5349042,z5361545,z5417505,z5417509',
                mentorsEmails: 'cowhorse3900@outlook.com,hehe_boi@bbc.co.uk'
            },
            {
                teamName: 'child_prodigy',
                studentsZids: 'z5322112,z5555555',
                mentorsEmails: 'cowhorse3900@outlook.com,hehe_boi@bbc.co.uk'
            }
        ])
    })

    test('student_test: insert students', () => {
        for (const row of convertedData) {
            func.insertTeam(row, teams, newCourse)
            const teamToAdd = teams.find(team => team.teamName === row.groupname)
            func.insertTutor(row, staffAdmins, courseInfo, newCourse, teamToAdd!)
            func.insertStudent(row, students, teamToAdd!)
        }
        expect(students).toStrictEqual([
            {
                studentName: 'piggie0',
                email: 'z1234567@student.unsw.edu.au',
                zid: 'z1234567'
            },
            {
                studentName: 'piggie1',
                email: 'z1234568@student.unsw.edu.au',
                zid: 'z1234568'
            },
            {
                studentName: 'piggie2',
                email: 'z1234569@student.unsw.edu.au',
                zid: 'z1234569'
            },
            {
                studentName: 'piggie3',
                email: 'z1234571@student.unsw.edu.au',
                zid: 'z1234571'
            },
            {
                studentName: 'piggie4',
                email: 'z1234572@student.unsw.edu.au',
                zid: 'z1234572'
            },
            {
                studentName: 'doggie0',
                email: 'z1234576@student.unsw.edu.au',
                zid: 'z1234576'
            },
            {
                studentName: 'doggie1',
                email: 'z1234577@student.unsw.edu.au',
                zid: 'z1234577'
            },
            {
                studentName: 'Jeffrey',
                email: 'belikov9519@gmail.com',
                zid: 'z5414078'
            },
            {
                studentName: 'Wilson',
                email: 'wilsonzhu2003@gmail.com',
                zid: 'z5423255'
            },
            {
                studentName: 'Guojing',
                email: 'z5450260@ad.unsw.edu.au',
                zid: 'z5450260'
            },
            {
                studentName: 'Rocky',
                email: 'z5349042@ad.unsw.edu.au',
                zid: 'z5349042'
            },
            {
                studentName: 'Ruiqi',
                email: 'z5361545@ad.unsw.edu.au',
                zid: 'z5361545'
            },
            {
                studentName: 'Waner',
                email: 'z5417505@ad.unsw.edu.au',
                zid: 'z5417505'
            },
        ])
    })

    test('insert courses', () => {
        for (const row of convertedData) {
            func.insertTeam(row, teams, newCourse)
            const teamToAdd = teams.find(team => team.teamName === row.groupname)
            func.insertTutor(row, staffAdmins, courseInfo, newCourse, teamToAdd!)
            func.insertStudent(row, students, teamToAdd!)
        }
        expect(newCourse).toStrictEqual({
            courseName: 'COMP3900',
            mentorsEmails: 'z2232322@unsw.edu.au,z2232323@unsw.edu.au,z2232324@unsw.edu.au,cowhorse3900@outlook.com',
            teams: 'piggie squad 0,piggie squad 1,doggie squad 0,jeffrey squad',
            term: '24T3'
        })
    })
})