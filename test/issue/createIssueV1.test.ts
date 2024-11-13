import {CreateIssueInput, POST, DELETE} from "@/app/api/issueSystem/createIssue/route";
import models from "@/models/models";
import { NextRequest } from "next/server";
import { createDatabase, initialiseInput, terminateDatabase } from "@/test/testUtils";
import { MongoMemoryServer } from "mongodb-memory-server";

let studentId : string, teamId : string, courseId: string;
let notInTeamStudentIds : string;
const { Team, Course, Student} = models;
let mongoServer: MongoMemoryServer;

const questions : string[] = [
  
    "How do you do"
    ,
  
    "What is the weather like"
  
]

const answers : string[] = [
    "answer1", "answer2"
]
// input fields
beforeAll(async () => {

    const input: initialiseInput = {
        courseAdmins: [{ adminName: "Admin1", email: "admin1@example.com", role: "admin", courseName: "CS101", term: "T1" }],
        staffAdmins: [{ adminName: "Tutor1", email: "tutor1@example.com", role: "tutor", courseName: "CS101", term: "T1" }],
        students: [{ studentName: "Alice", email: "alice@example.com", zid: "z1234567", class: 'T14A'  },
            {studentName: "Bob", email: "bob@example.com",zid: "z5423255", class: 'T14A' },
            {studentName: "John", email: "Jogn@example.com", zid: "z2222222", class: 'T14A' }
        ],
        teams: [{ teamName: "Team1", studentsZids: "z1234567,z5423255", mentorsEmails: "tutor1@example.com" }],
        course: { courseName: "CS101", mentorsEmails: "tutor1@example.com", teams: "Team1", term: "T1" },
    };

    mongoServer = await createDatabase(input, mongoServer);
    const course = await Course.findOne({}).exec();
    courseId = course._id;
    teamId = course.teams[0];
    const team = await Team.findOne({_id: teamId}).exec();
    studentId = team.students[0];
    const notInTeamStudent = await Student.findOne({studentName: "John"}).exec();
    notInTeamStudentIds = notInTeamStudent._id;
});
afterAll(async () => {
    // Drop the database and close the server after each test
    await terminateDatabase(mongoServer);
});



describe("Create issue API Tests", () => {
    jest.setTimeout(40000)
    // attemping create new issue if there is already an exist pending issue. 409
    // otherwise create new issue and success 200
    it("should submitted valid issue but refuse create issue that is already exist", async () => {
        const body : CreateIssueInput = {
            studentId: studentId,
            teamId: teamId,
            courseId: courseId,
            filesUrl: "anc.png,dasd.jpg",
            filesName: "anc,dasd",
            questions: questions,
            answers: answers,
            assignment:"default project",
        };
    
        // Mock a NextRequest with JSON body
        let req = new NextRequest(new URL("http://localhost/api/issueSystem/createIssue"), {
            method: "POST",
            body: JSON.stringify(body),
            headers: { "Content-Type": "application/json" },
        });
    
        // Call the POST handler
        let res = await POST(req);
    
        // Verify response status and content
        expect(res.status).toBe(200);
    
        const json = await res.json(); // Parse the JSON response
        //console.log(json);
        const issueId = json.issue._id;
        // console.log(issueId);

        //submitting again should be failed
        req = new NextRequest(new URL("http://localhost/api/issueSystem/createIssue"), {
            method: "POST",
            body: JSON.stringify(body),
            headers: { "Content-Type": "application/json" },
        });

        res = await POST(req);
        expect(res.status).toBe(409);
        req = new NextRequest(new URL("http://localhost/api/issueSystem/createIssue"), {
            method: "DELETE",
            body: JSON.stringify({
                issueId: issueId
            }),
            headers: { "Content-Type": "application/json" },
        });
        res = await DELETE(req);
        expect(res.status).toBe(200);
    });
    // if the student is not in the team 400
    // if id is moongoose object but not found user, team or course 404
    
    // if the team does not belong to the course 403
    // if title or content is empty 400
    it("if id is invalid or bad request with empty input", async () => {
        let body : CreateIssueInput = {
            studentId: notInTeamStudentIds,
            teamId: teamId,
            courseId: courseId,
            filesUrl: "anc.png,dasd.jpg",
            filesName: "anc,dasd",
            questions: questions,
            answers: answers,
            assignment:"default project",
        };
    
     
        let req = new NextRequest(new URL("http://localhost/api/issueSystem/createIssue"), {
            method: "POST",
            body: JSON.stringify(body),
            headers: { "Content-Type": "application/json" },
        });
    
      
        let res = await POST(req);
      
        // if the student is not in the team 400
        expect(res.status).toBe(400);
        const json = await res.json(); // Parse the JSON response
        expect(json.error).toBe("Student does not belong to this team")
    
        // not existing id should be 404 not found
        body  = {
            studentId: "671b4dbbd1ab3e8a13457157",
            teamId: teamId,
            courseId: courseId,
            filesUrl: "anc.png,dasd.jpg",
            filesName: "anc,dasd",
            questions: questions,
            answers: answers,
            assignment:"default project",
        };
        //const json = await res.json(); // Parse the JSON response
        //console.log(json);

      
        req = new NextRequest(new URL("http://localhost/api/issueSystem/createIssue"), {
            method: "POST",
            body: JSON.stringify(body),
            headers: { "Content-Type": "application/json" },
        });

        res = await POST(req);
        expect(res.status).toBe(404);

        body  = {
            studentId: studentId,
            teamId: teamId,
            courseId: courseId,
            filesUrl: "anc.png,dasd.jpg",
            filesName: "anc,dasd",
            questions: questions,
            answers: answers,
            assignment: "",
        
        };
        req = new NextRequest(new URL("http://localhost/api/issueSystem/createIssue"), {
            method: "POST",
            body: JSON.stringify(body),
            headers: { "Content-Type": "application/json" },
        });
        res = await POST(req);
        expect(res.status).toBe(400);
  
    
    });
});