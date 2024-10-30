
import {POST as createIssuePOST, DELETE} from '@/app/api/issueSystem/createIssue/route';
import {POST as opinionPOST} from '@/app/api/staff/tutorOpinions/route';
import models from '@/models/models';
import { NextRequest } from 'next/server';
import { createDatabase, initialiseInput, terminateDatabase } from '@/test/testUtils';
import { MongoMemoryServer } from 'mongodb-memory-server';


let studentId : string, teamId : string, courseId: string;
const { Team, Course, Student} = models;
let mongoServer: MongoMemoryServer;

beforeAll(async () => {

  const input: initialiseInput = {
    courseAdmins: [{ adminName: "Admin1", email: "admin1@example.com", role: "admin", courseName: "CS101", term: "T1" }],
    staffAdmins: [{ adminName: "Tutor1", email: "tutor1@example.com", role: "tutor", courseName: "CS101", term: "T1" }],
    students: [{ studentName: "Alice", email: "alice@example.com", zid: "z1234567" },
      {studentName: "Bob", email: "bob@example.com",zid: "z5423255"},
      {studentName: "John", email: "Jogn@example.com", zid: "z2222222"}
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
});

afterAll(async () => {
  // Drop the database and close the server after each test
  await terminateDatabase(mongoServer);
});

describe('Create tutor opinions API Tests', () => {
    it('Successfully submitted Tutors opinion, resubmit should fail', async () => {
        // Create a issue, return 200 if successful
        const createIssueBody = {
            studentId: studentId,
            teamId: teamId,
            courseId: courseId,
            filesUrl: "anc.png,dasd.jpg",
            title: "disagreement to the babalala",
            content: "this is a very important issue!!!!"
        };
        
        const createIssueRequest = new NextRequest(
            new URL('http://localhost/api/issueSystem/createIssue'),
            {
                method: 'POST',
                body: JSON.stringify(createIssueBody),
                headers: { 'Content-Type': 'application/json' },
            }
        );
        
        const createIssueResponse = await createIssuePOST(createIssueRequest);
        expect(createIssueResponse.status).toBe(200);
        const createIssueJson = await createIssueResponse.json();
        const issueId = createIssueJson.issue._id;
    
        // Update Tutot's opinion after issue succesfully created
        //If success it will return 200
        const opinionBody = {
            teamId: teamId,
            content: "This is the opinion."
        };

        const opinionRequest = new NextRequest(
            new URL('http://localhost/api/staff/tutorOpinions'),
            {
                method: 'POST',
                body: JSON.stringify(opinionBody),
                headers: { 'Content-Type': 'application/json' },
            }
        );
        const opinionResponse = await opinionPOST(opinionRequest);
        expect(opinionResponse.status).toBe(200);
        const opinionJson = await opinionResponse.json();
        expect(opinionJson.message).toBe("Tutor opinion added successfully");

        // Resubmit should return error 400
        const opinionResubmit = new NextRequest(
            new URL('http://localhost/api/staff/tutorOpinions'),
            {
                method: 'POST',
                body: JSON.stringify(opinionBody),
                headers: { 'Content-Type': 'application/json' },
            }
        );
        const opinionResponse2 = await opinionPOST(opinionResubmit);
        expect(opinionResponse2.status).toBe(400);
        const opinionJson2= await opinionResponse2.json();
        expect(opinionJson2.error).toBe("Tutor has already submitted an opinion on this issue");

        // Delete the issue and check if successful, it will return 200
        const deleteIssue = new NextRequest(
            new URL('http://localhost/api/issueSystem/createIssue'), 
            {
                method: 'DELETE',
                body: JSON.stringify({
                    issueId: issueId
                }),
                headers: { 'Content-Type': 'application/json' },
            }
        );

        let res = await DELETE(deleteIssue);
        expect(res.status).toBe(200); 
    });
});

describe('Debug tutor opinions API Tests', () => {
    it('No Issue created or Issue is closed', async () => {
        // If no issue found, return 404
        const opinionBody = {
            teamId: teamId,
            content: "This is the opinion."
        };

        const opinionRequest = new NextRequest(
            new URL('http://localhost/api/staff/tutorOpinions'),
            {
                method: 'POST',
                body: JSON.stringify(opinionBody),
                headers: { 'Content-Type': 'application/json' },
            }
        );
        const opinionResponse = await opinionPOST(opinionRequest);
        expect(opinionResponse.status).toBe(404);
        const opinionJson = await opinionResponse.json();
        expect(opinionJson.error).toBe("No pending issues for this team");
    });

    it('Submit an empty comment or Team id invalid', async () => {
        // Create a issue, return 200 if successful
        const createIssueBody = {
            studentId: studentId,
            teamId: teamId,
            courseId: courseId,
            filesUrl: "anc.png,dasd.jpg",
            title: "disagreement to the babalala",
            content: "this is a very important issue!!!!"
        };
        
        const createIssueRequest = new NextRequest(
            new URL('http://localhost/api/issueSystem/createIssue'),
            {
                method: 'POST',
                body: JSON.stringify(createIssueBody),
                headers: { 'Content-Type': 'application/json' },
            }
        );
        
        const createIssueResponse = await createIssuePOST(createIssueRequest);
        expect(createIssueResponse.status).toBe(200);
        const createIssueJson = await createIssueResponse.json();
        const issueId = createIssueJson.issue._id;

        // Submit an empty comment should fail and return 400
        const opinionBody = {
            teamId: teamId,
            content: ""
        };

        const opinionRequest = new NextRequest(
            new URL('http://localhost/api/staff/tutorOpinions'),
            {
                method: 'POST',
                body: JSON.stringify(opinionBody),
                headers: { 'Content-Type': 'application/json' },
            }
        );
        const opinionResponse = await opinionPOST(opinionRequest);
        expect(opinionResponse.status).toBe(400);
        const opinionJson = await opinionResponse.json();
        expect(opinionJson.error).toBe("Content is required");

        // Submit an invalid team ID should fail and return 400
        const falseTeamId = "falseTeamId"
        const opinionBody2 = {
            teamId: falseTeamId,
            content: "This is the opinion."
        };

        const opinionRequest2 = new NextRequest(
            new URL('http://localhost/api/staff/tutorOpinions'),
            {
                method: 'POST',
                body: JSON.stringify(opinionBody2),
                headers: { 'Content-Type': 'application/json' },
            }
        );
        const opinionResponse2 = await opinionPOST(opinionRequest2);
        expect(opinionResponse2.status).toBe(400);
        const opinionJson2 = await opinionResponse2.json();
        expect(opinionJson2.error).toBe("Invalid Team ID");
    });
});