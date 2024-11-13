import { NextRequest } from 'next/server';
import { POST as closeIssuePOST } from '@/app/api/issueSystem/closeIssue/route';
import { CreateIssueInput, POST as createIssuePOST } from '@/app/api/issueSystem/createIssue/route';
import { OpinionInput, POST as opinionPOST } from '@/app/api/staff/submitOpinions/route';
import models from '@/models/models';
import { createDatabase, initialiseInput, terminateDatabase } from '@/test/testUtils';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;
let studentId: string, teamId: string, courseId: string, adminId: string, issueId: string;
const { Course, Team, Admin, Issue } = models;

beforeAll(async () => {
    const input: initialiseInput = {
        courseAdmins: [{ adminName: "Admin1", email: "admin1@example.com", role: "admin", courseName: "CS101", term: "T1" }],
        staffAdmins: [{ adminName: "Tutor1", email: "tutor1@example.com", role: "tutor", courseName: "CS101", term: "T1" }],
        students: [{ studentName: "Alice", email: "alice@example.com", zid: "z1234567", class: 'T14A'  }],
        teams: [{ teamName: "Team1", studentsZids: "z1234567", mentorsEmails: "tutor1@example.com" }],
        course: { courseName: "CS101", mentorsEmails: "tutor1@example.com", teams: "Team1", term: "T1" },
    };

    mongoServer = await createDatabase(input, mongoServer);

    const course = await Course.findOne({}).exec();
    courseId = course._id;
    teamId = course.teams[0];
    const team = await Team.findOne({ _id: teamId }).exec();
    studentId = team.students[0];
    const admin = await Admin.findOne({ adminName: "Tutor1" }).exec();
    adminId = admin._id;

    // Create an issue for the team to use in tests
    const createIssueBody: CreateIssueInput = {
        studentId,
        teamId,
        courseId,
        filesUrl: "file1.png,file2.jpg",
        filesName: "file1,file2",
        questions: ["Question 1", "Question 2"],
        answers: ["Answer 1", "Answer 2"],
        assignment: "Project 1",
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
    const createIssueJson = await createIssueResponse.json();
    issueId = createIssueJson.issue._id;
});

afterAll(async () => {
    await terminateDatabase(mongoServer);
});

describe('Close Issue API Tests', () => {
    it('Cannot close if no admin id or issue id', async () => {
        const closeIssueRequest = new NextRequest(
            new URL('http://localhost/api/issueSystem/closeIssue'),
            {
                method: 'POST',
                body: JSON.stringify({ }),
                headers: { 'Content-Type': 'application/json' },
            }
        );

        const closeIssueResponse = await closeIssuePOST(closeIssueRequest);
        expect(closeIssueResponse.status).toBe(400);
        const closeIssueJson = await closeIssueResponse.json();
        expect(closeIssueJson.error).toBe("Missing issueId or adminId");
    });

    it('Cannot close if issue does not exist', async () => {
        const invalidIssueId = "772efc5db97c6659d9abc9e5";
        const closeIssueRequest = new NextRequest(
            new URL('http://localhost/api/issueSystem/closeIssue'),
            {
                method: 'POST',
                body: JSON.stringify({ issueId: invalidIssueId, adminId: adminId }),
                headers: { 'Content-Type': 'application/json' },
            }
        );

        const closeIssueResponse = await closeIssuePOST(closeIssueRequest);
        expect(closeIssueResponse.status).toBe(404);
        const closeIssueJson = await closeIssueResponse.json();
        expect(closeIssueJson.error).toBe("This group does not have a issue yet");
    });

    it('Cannot close if admin does not exist', async () => {
        const invalidAdminId = "77187c1baafe7cebd87d9afd";
        const closeIssueRequest = new NextRequest(
            new URL('http://localhost/api/issueSystem/closeIssue'),
            {
                method: 'POST',
                body: JSON.stringify({ issueId, adminId: invalidAdminId }),
                headers: { 'Content-Type': 'application/json' },
            }
        );

        const closeIssueResponse = await closeIssuePOST(closeIssueRequest);
        expect(closeIssueResponse.status).toBe(404);
        const closeIssueJson = await closeIssueResponse.json();
        expect(closeIssueJson.error).toBe("You are not an admin");
    });

    it('Fail to close issue if admin has not commented', async () => {
        const closeIssueRequest = new NextRequest(
            new URL('http://localhost/api/issueSystem/closeIssue'),
            {
                method: 'POST',
                body: JSON.stringify({ issueId, adminId: adminId }),
                headers: { 'Content-Type': 'application/json' },
            }
        );

        const closeIssueResponse = await closeIssuePOST(closeIssueRequest);
        expect(closeIssueResponse.status).toBe(403);
        const closeIssueJson = await closeIssueResponse.json();
        expect(closeIssueJson.error).toBe("You need to enter opinion before close this issue");
    });

    it('Successfully close an issue after submit admin opinion', async () => {
        const opinionBody: OpinionInput = {
            issueId,
            content: "This is a tutor's opinion.",
            staffId: adminId,
            teamId,
            courseId,
        };

        const opinionRequest = new NextRequest(
            new URL('http://localhost/api/staff/submitOpinions'),
            {
                method: 'POST',
                body: JSON.stringify(opinionBody),
                headers: { 'Content-Type': 'application/json' },
            }
        );
        const opinionResponse = await opinionPOST(opinionRequest);
        expect(opinionResponse.status).toBe(200);

        const closeIssueRequest = new NextRequest(
            new URL('http://localhost/api/issueSystem/closeIssue'),
            {
                method: 'POST',
                body: JSON.stringify({ issueId, adminId: adminId }),
                headers: { 'Content-Type': 'application/json' },
            }
        );

        const closeIssueResponse = await closeIssuePOST(closeIssueRequest);
        expect(closeIssueResponse.status).toBe(200);
        const closeIssueJson = await closeIssueResponse.json();
        expect(closeIssueJson.message).toBe("Issue closed successfully");

        const closedIssue = await Issue.findById(issueId).exec();
        expect(closedIssue.status).toBe("complete");
    });

    it('Cannot re-close a issue if it is already closed', async () => {
        const closeIssueRequest = new NextRequest(
            new URL('http://localhost/api/issueSystem/closeIssue'),
            {
                method: 'POST',
                body: JSON.stringify({ issueId, adminId: adminId }),
                headers: { 'Content-Type': 'application/json' },
            }
        );

        const closeIssueResponse = await closeIssuePOST(closeIssueRequest);
        expect(closeIssueResponse.status).toBe(405);
        const closeIssueJson = await closeIssueResponse.json();
        expect(closeIssueJson.error).toBe("Issue is already closed");
    });
});
