import {studentIdentityCheckInput,POST as idCheckPost} from '@/app/api/studentSystem/identityCheck/route';
import { POST } from '@/app/api/authcodeSystem/checkAuthcode/route';
import models from '@/models/models';
import { NextRequest } from 'next/server';
//import { createMocks } from 'node-mocks-http';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createDatabase, initialiseInput, terminateDatabase } from '@/test/testUtils';


// Mock the `cookies()` function

jest.mock('next/headers', () => ({
  cookies: jest.fn().mockReturnValue({
      set: jest.fn(),
  }),
}))

let studentId : string, teamId : string, courseId: string;
let notInTeamStudentIds : string;
const { Team, Course, Student, AuthCode } = models;
// In-memory MongoDB server instance
let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  // Start a new MongoDB server and connect Mongoose

  // Mock input data to initialize the database
  const input: initialiseInput = {
    courseAdmins: [{ adminName: "Admin1", email: "admin1@example.com", role: "admin", courseName: "CS101", term: "T1" }],
    staffAdmins: [{ adminName: "Tutor1", email: "tutor1@example.com", role: "tutor", courseName: "CS101", term: "T1" }],
    students: [
        { studentName: "Alice", email: "alice@example.com", zid: "z1234567" },
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
  const notInTeamStudent = await Student.findOne({studentName: "John"}).exec();
  notInTeamStudentIds = notInTeamStudent._id;
});

afterAll(async () => {
  // Drop the database and close the server after each test
  await terminateDatabase(mongoServer);
  
});

describe('student checkAuthCode API Tests', () => {
  
  it('auth code check was successful', async () => {
    const authCodeCheckbody = {
        zid: 'z1234567',
        code: 'No code found for user!'
    };
    
    
    const authCodeCheckreq = new NextRequest(new URL('http://localhost/api/authcodeSystem/checkAuthcode'), {
        method: 'POST',
        body: JSON.stringify(authCodeCheckbody),
        headers: { 'Content-Type': 'application/json' },
      });
    const authCodeCheckres = await POST(authCodeCheckreq);
    expect(authCodeCheckres.status).toBe(404);
    const json = await authCodeCheckres.json();
    expect(json.error).toBe('No code found for user!');
  });

    
  it('Erroneous auth code', async () => {
    const idcheckbody: studentIdentityCheckInput = {
        zID: 'z1234567',
        courseCode: 'CS101',
        term: 'T1'
      };
      // Mock a NextRequest with JSON body
      const idcheckreq = new NextRequest(new URL('http://localhost/api/studentSystem/identityCheck'), {
        method: 'POST',
        body: JSON.stringify(idcheckbody),
        headers: { 'Content-Type': 'application/json' },
      });
      // Call the POST handler
      const idcheckres = await idCheckPost(idcheckreq);
      // Verify response status and content
    expect(idcheckres!.status).toBe(200);

    const authCodeCheckbody = {
        zid: 'z1234567',
        code: '++++++'
    }
    
    const authCodeCheckreq = new NextRequest(new URL('http://localhost/api/authcodeSystem/checkAuthcode'), {
        method: 'POST',
        body: JSON.stringify(authCodeCheckbody),
        headers: { 'Content-Type': 'application/json' },
      });
    const authCodeCheckres = await POST(authCodeCheckreq);
    expect(authCodeCheckres.status).toBe(400);
    const json = await authCodeCheckres.json();
    expect(json.error).toBe('Invalid auth code!');
    
  });

    it('Erroneous auth code', async () => {
    const idcheckbody: studentIdentityCheckInput = {
        zID: 'z1234567',
        courseCode: 'CS101',
        term: 'T1'
      };
      // Mock a NextRequest with JSON body
      const idcheckreq = new NextRequest(new URL('http://localhost/api/studentSystem/identityCheck'), {
        method: 'POST',
        body: JSON.stringify(idcheckbody),
        headers: { 'Content-Type': 'application/json' },
      });
      // Call the POST handler
      const idcheckres = await idCheckPost(idcheckreq);
      // Verify response status and content
    expect(idcheckres!.status).toBe(200);

    const authCodeCheckbody = {
        zid: 'z1234567',
        code: '++++++'
    }
    
    const authCodeCheckreq = new NextRequest(new URL('http://localhost/api/authcodeSystem/checkAuthcode'), {
        method: 'POST',
        body: JSON.stringify(authCodeCheckbody),
        headers: { 'Content-Type': 'application/json' },
      });
    const authCodeCheckres = await POST(authCodeCheckreq);
    expect(authCodeCheckres.status).toBe(400);
    const json = await authCodeCheckres.json();
    expect(json.error).toBe('Invalid auth code!');
    
  }); 
  it('Correct auth code', async () => {
    const idcheckbody: studentIdentityCheckInput = {
        zID: 'z1234567',
        courseCode: 'CS101',
        term: 'T1'
      };
      // Mock a NextRequest with JSON body
      const idcheckreq = new NextRequest(new URL('http://localhost/api/studentSystem/identityCheck'), {
        method: 'POST',
        body: JSON.stringify(idcheckbody),
        headers: { 'Content-Type': 'application/json' },
      });
      // Call the POST handler
      const idcheckres = await idCheckPost(idcheckreq);
      // Verify response status and content
    expect(idcheckres!.status).toBe(200);
    const authCode = await AuthCode.findOne({zid: 'z1234567'}).exec();
    const authCodeCheckbody = {
        zid: 'z1234567',
        code: authCode.code
    }

    const authCodeCheckreq = new NextRequest(new URL('http://localhost/api/authcodeSystem/checkAuthcode'), {
        method: 'POST',
        body: JSON.stringify(authCodeCheckbody),
        headers: { 'Content-Type': 'application/json' },
      });
    const authCodeCheckres = await POST(authCodeCheckreq);
    expect(authCodeCheckres.status).toBe(200);
  });
 
    
});
