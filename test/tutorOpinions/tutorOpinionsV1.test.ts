
import {CreateIssueInput, POST as createIssuePOST, DELETE} from "@/app/api/issueSystem/createIssue/route";
import {POST as opinionPOST, OpinionInput} from "@/app/api/staff/submitOpinions/route";
import models from "@/models/models";
import { NextRequest } from "next/server";
import { createDatabase, initialiseInput, terminateDatabase } from "@/test/testUtils";
import { MongoMemoryServer } from "mongodb-memory-server";


let studentId : string, teamId : string, courseId: string, tutorId: string;

let teamId2: string, tutorId2: string, studentId2: string;
const { Team, Course, Student, Admin} = models;
let mongoServer: MongoMemoryServer;
const questions : string[] = [
    
    "How do you do"
    ,
    
    "What is the weather like"
    
]
    
const answers : string[] = [
    "answer1", "answer2"
]

beforeAll(async () => {

    const input: initialiseInput = {
        courseAdmins: [{ adminName: "Admin1", email: "admin1@example.com", role: "admin", courseName: "CS101", term: "T1" }],
        staffAdmins: [{ adminName: "Tutor1", email: "tutor1@example.com", role: "tutor", courseName: "CS101", term: "T1" },
            { adminName: "Tutor2", email: "tutor@example.com", role: "tutor", courseName: "CS101", term: "T1" }
        ],
        students: [{ studentName: "Alice", email: "alice@example.com", zid: "z1234567" },
            {studentName: "Bob", email: "bob@example.com",zid: "z5423255"},
            {studentName: "John", email: "Jogn@example.com", zid: "z2222222"}
        ],
        teams: [{ teamName: "Team1", studentsZids: "z1234567,z5423255", mentorsEmails: "tutor1@example.com" },
            { teamName: "Team2", studentsZids: "z2222222", mentorsEmails: "tutor2@example.com" }
        ],
        course: { courseName: "CS101", mentorsEmails: "tutor1@example.com", teams: "Team1", term: "T1" },
    };

    mongoServer = await createDatabase(input, mongoServer);
    const course = await Course.findOne({}).exec();
    courseId = course._id;
    teamId = course.teams[0];
    const team = await Team.findOne({_id: teamId}).exec();
    studentId = team.students[0];
    const tutor = await Admin.findOne({adminName : "Tutor1"}).exec();
    tutorId = tutor._id;
    teamId2 = course.teams[1];
    const tutor2 = await Admin.findOne({adminName : "Tutor2"}).exec();
    tutorId2 = tutor2._id;
    const student2 = await Student.findOne({studentName : "John"}).exec();
    studentId2 = student2._id;

});

afterAll(async () => {
    // Drop the database and close the server after each test
    await terminateDatabase(mongoServer);
});

<<<<<<< HEAD
describe("Create tutor opinions API Tests", () => {
    it("Successfully submitted Tutors opinion, resubmit should fail", async () => {
=======
describe('Create tutor opinions API Tests', () => {
    it('Successfully submitted Tutors opinion, resubmit add after previous opinion', async () => {
>>>>>>> master
        // Create a issue, return 200 if successful
        const createIssueBody : CreateIssueInput = {
            studentId: studentId,
            teamId: teamId,
            courseId: courseId,
            filesUrl: "anc.png,dasd.jpg",
            filesName: "anc,dasd",
            questions: questions,
            answers: answers,
            assignment:"default project",
        };
        
        const createIssueRequest = new NextRequest(
            new URL("http://localhost/api/issueSystem/createIssue"),
            {
                method: "POST",
                body: JSON.stringify(createIssueBody),
                headers: { "Content-Type": "application/json" },
            }
        );
        
        const createIssueResponse = await createIssuePOST(createIssueRequest);
        expect(createIssueResponse.status).toBe(200);
        const createIssueJson = await createIssueResponse.json();
        const issueId = createIssueJson.issue._id;
    
        // Update Tutot's opinion after issue succesfully created
        //If success it will return 200
        const opinionBody : OpinionInput = {
            teamId: teamId,
            courseId : courseId,
            issueId : issueId,
            content: "This is the opinion.",
            staffId: tutorId,
        };

        const opinionRequest = new NextRequest(
            new URL("http://localhost/api/staff/submitOpinions"),
            {
                method: "POST",
                body: JSON.stringify(opinionBody),
                headers: { "Content-Type": "application/json" },
            }
        );
        console.log("opinionBody: " + JSON.stringify(opinionBody));
        const opinionResponse = await opinionPOST(opinionRequest);
        const opinionJson = await opinionResponse.json();
<<<<<<< HEAD
        console.log("json: " + opinionJson.error);

        expect(opinionResponse.status).toBe(200);

        expect(opinionJson.message).toBe("Opinion submitted successfully");
        expect(opinionJson.updatedIssue.tutorComments[0].tutor.toString()).toBe(tutorId.toString());
        expect(opinionJson.updatedIssue.tutorComments[0].content).toBe("This is the opinion.");
=======
        console.log(opinionJson);
        expect(opinionJson.message).toBe("Tutor opinion added successfully");

        // Resubmit should add another opinon
        const opinionResubmit = new NextRequest(
            new URL('http://localhost/api/staff/tutorOpinions'),
            {
                method: 'POST',
                body: JSON.stringify(opinionBody),
                headers: { 'Content-Type': 'application/json' },
            }
        );
        const opinionResponse2 = await opinionPOST(opinionResubmit);
        expect(opinionResponse2.status).toBe(200);
        const opinionJson2= await opinionResponse2.json();
        expect(opinionJson2.message).toBe("Tutor opinion added successfully");
>>>>>>> master

        // Delete the issue and check if successful, it will return 200
        const deleteIssue = new NextRequest(
            new URL("http://localhost/api/issueSystem/createIssue"), 
            {
                method: "DELETE",
                body: JSON.stringify({
                    issueId: issueId
                }),
                headers: { "Content-Type": "application/json" },
            }
        );

        const res = await DELETE(deleteIssue);
        expect(res.status).toBe(200); 
    });
});

describe("Debug tutor opinions API Tests", () => {
    it("No Issue created or Issue is closed", async () => {
        // If no issue found, return 404
        const opinionBody : OpinionInput= {
            teamId: teamId2,
            content: "This is the opinion.",
            staffId: tutorId2,
            courseId: courseId,
            issueId: "671b4dbbd1ab3e8a13457157"
        };

        const opinionRequest = new NextRequest(
            new URL("http://localhost/api/staff/submitOpinions"),
            {
                method: "POST",
                body: JSON.stringify(opinionBody),
                headers: { "Content-Type": "application/json" },
            }
        );
        const opinionResponse = await opinionPOST(opinionRequest);
        expect(opinionResponse.status).toBe(400);
        const opinionJson = await opinionResponse.json();
        expect(opinionJson.error).toBe("Invalid Issue ID");
    });

    it("Submit an empty comment or Team id invalid", async () => {
        // Create a issue, return 200 if successful
        const createIssueBody : CreateIssueInput = {
            studentId: studentId2,
            teamId: teamId2,
            courseId: courseId,
            filesUrl: "anc.png,dasd.jpg",
            filesName: "anc,dasd",
            questions: questions,
            answers: answers,
            assignment:"default project",
        };
        
        const createIssueRequest = new NextRequest(
            new URL("http://localhost/api/issueSystem/createIssue"),
            {
                method: "POST",
                body: JSON.stringify(createIssueBody),
                headers: { "Content-Type": "application/json" },
            }
        );
        
        const createIssueResponse = await createIssuePOST(createIssueRequest);
        expect(createIssueResponse.status).toBe(200);
        const createIssueJson = await createIssueResponse.json();
        const issueId = createIssueJson.issue._id;

        // Submit an empty comment should fail and return 400
        const opinionBody : OpinionInput = {
            teamId: teamId2,
            content: "",
            staffId: tutorId2,
            issueId: issueId,
            courseId: courseId,
        };

        const opinionRequest = new NextRequest(
            new URL("http://localhost/api/staff/submitOpinions"),
            {
                method: "POST",
                body: JSON.stringify(opinionBody),
                headers: { "Content-Type": "application/json" },
            }
        );
        const opinionResponse = await opinionPOST(opinionRequest);
        expect(opinionResponse.status).toBe(400);
        const opinionJson = await opinionResponse.json();
        expect(opinionJson.error).toBe("Content is required");

        // Submit an invalid team ID should fail and return 400
        const falseTeamId = "falseTeamId"
        const opinionBody2 : OpinionInput = {
            teamId: falseTeamId,
            content: "This is the opinion.",
            staffId: tutorId2,
            courseId,
            issueId
        };

        const opinionRequest2 = new NextRequest(
            new URL("http://localhost/api/staff/submitOpinions"),
            {
                method: "POST",
                body: JSON.stringify(opinionBody2),
                headers: { "Content-Type": "application/json" },
            }
        );
        const opinionResponse2 = await opinionPOST(opinionRequest2);
        expect(opinionResponse2.status).toBe(400);
        const opinionJson2 = await opinionResponse2.json();
        expect(opinionJson2.error).toBe("Invalid Team ID");
    });
});