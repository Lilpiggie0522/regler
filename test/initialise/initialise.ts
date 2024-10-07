import { initialiseInput } from "@/app/api/adminSystem/initialise/route";
import {CreateIssueInput} from "@/app/api/issueSystem/createIssue/route";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const testSample : initialiseInput = {
    courseAdmins: [
        {
            adminName: "Wilson",
            email: "test@example.com",
            zid: '12345',
            passwordRaw: 'nihaoworld',
           
        }
        ,
        {
            adminName: "Sarah",
            email: "test2@example.com",
            zid: '67890',
            passwordRaw: 'password123',
        }
        , 
    ],
    staffAdmins: [
        {
            adminName: "Joseph",
            email: "test3@example.com",
            zid: '34567',
            passwordRaw: 'secret123',
        },
        {
            adminName: "Sophia",
            email: "test4@example.com",
            zid: '45678',
            passwordRaw: 'iloveyou',
        }
    ],
    students: [
        {
            studentName: 'Yu AI LIN',
            email: "YUAILIN@email.com",
            zid: '64140123',
        },
        {
            studentName: 'Tiffany Wang',
            email: "TIFFANYWANG@email.com",
            zid: '64140124',
        },
        {
            studentName: 'Emily Chen',
            email: "EMILYCHEN@email.com",
            zid: '64140125',
        },
        {
            studentName: 'Michael Lee',
            email: "MICHAELLEE@email.com",
            zid: '64140126',
        }
    ],
    // students and mentors should be in the form of zid,zid2,zid3
    teams: [
        {
            teamName: 'Team 1',
            studentsZids: '64140123,64140124,64140125',
            mentorsZids: '12345,67890',
        },
        {
            teamName: 'Team 2',
            studentsZids: '64140126',
            mentorsZids: '34567,45678',
        }
    ],
    courses: [
        {
            courseName: 'COMP3900',
            mentorsZids: '12345,34567,67890',
            teams: 'Team 1,Team 2'
        }
    ]
        
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createIssueSample: CreateIssueInput = {
    studentId: "6703551f9db9e11b3843691a",
    teamId: "6703551f9db9e11b38436924",
    courseId: "6703551f9db9e11b3843692a",
    filesUrl: "anc.png,dasd.jpg",
    title: "issue 1",
    content: "string",

}