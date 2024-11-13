import {POST, studentIdentityCheckInput } from '@/app/api/studentSystem/identityCheck/route';
import models from '@/models/models';
import { NextRequest } from 'next/server';
//import { createMocks } from 'node-mocks-http';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createDatabase, initialiseInput, initialiseDatabase, terminateDatabase } from '@/test/testUtils';

jest.setTimeout(30000);
let studentId : string, teamId : string, courseId: string;
let notInTeamStudentIds : string;
const { Team, Course, Student} = models;
// In-memory MongoDB server instance
let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  // Start a new MongoDB server and connect Mongoose

  // Mock input data to initialize the database
  const input: initialiseInput = {
    courseAdmins: [{ adminName: "Admin1", email: "admin1@example.com", role: "admin", courseName: "CS101", term: "T1" }],
    staffAdmins: [{ adminName: "Tutor1", email: "tutor1@example.com", role: "tutor", courseName: "CS101", term: "T1" }],
    students: [
        { studentName: "Alice", email: "alice@example.com", zid: "z1234567" , class: 'T14A'},
      {studentName: "Bob", email: "bob@example.com",zid: "z5423255", class: 'T14A'},
      {studentName: "John", email: "Jogn@example.com", zid: "z2222222", class: 'T14A'}
    ],
    teams: [{ teamName: "Team1", studentsZids: "z1234567,z5423255", mentorsEmails: "tutor1@example.com" }],
    course: { courseName: "CS101", mentorsEmails: "tutor1@example.com", teams: "Team1", term: "T1" },
  };

  mongoServer = await createDatabase(input, mongoServer);
  const input1: initialiseInput = { 
    courseAdmins: [],
    staffAdmins: [],
    students: [],
    teams: [],
    course: { courseName: "CS888", mentorsEmails: "", teams: "", term: "T1" },
  };
  initialiseDatabase(input1);
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

describe('student identityCheck API Tests', () => {
  
  it('successfully send auth code', async () => {
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
      const idcheckres = await POST(idcheckreq);
        // Verify response status and content
        expect(idcheckres!.status).toBe(200);
    
  });
  
   
  it('invalid student zid exception', async () => {
    const idcheckbody: studentIdentityCheckInput = {
        zID: 'z12345678',
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
    const idcheckres = await POST(idcheckreq);
        // Verify response status and content
        expect(idcheckres!.status).toBe(404);
        const json = await idcheckres!.json(); // Parse the JSON response
        expect(json.error).toBe("Invalid zid!")
    
  });
   
  it('invalid course code or term exception', async () => {
    const idcheckbody: studentIdentityCheckInput = {
        zID: 'z1234567',
        courseCode: 'CS233',
        term: 'T1'
      };
      // Mock a NextRequest with JSON body
      const idcheckreq = new NextRequest(new URL('http://localhost/api/studentSystem/identityCheck'), {
        method: 'POST',
        body: JSON.stringify(idcheckbody),
        headers: { 'Content-Type': 'application/json' },
      });

      // Call the POST handler
      const idcheckres = await POST(idcheckreq);
        // Verify response status and content
      expect(idcheckres!.status).toBe(404);
      const json = await idcheckres!.json(); // Parse the JSON response
      expect(json.error).toBe("course code or term is invalid!")
    const idcheckbody1: studentIdentityCheckInput = {
            zID: 'z1234567',
            courseCode: 'CS101',
            term: 'T3'
          };
          // Mock a NextRequest with JSON body
          const idcheckreq1 = new NextRequest(new URL('http://localhost/api/studentSystem/identityCheck'), {
            method: 'POST',
            body: JSON.stringify(idcheckbody1),
            headers: { 'Content-Type': 'application/json' },
          });
    
          // Call the POST handler
          const idcheckres1 = await POST(idcheckreq1);
          // Verify response status and content
          expect(idcheckres1!.status).toBe(404);
          const json1 = await idcheckres1!.json(); // Parse the JSON response
        expect(json1.error).toBe("course code or term is invalid!")
  });
  it('student is not in a team exception', async () => {
    const idcheckbody: studentIdentityCheckInput = {
        zID: 'z2222222',
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
      const idcheckres = await POST(idcheckreq);
        // Verify response status and content
      expect(idcheckres!.status).toBe(404);
      const json = await idcheckres!.json(); // Parse the JSON response
      expect(json.error).toBe("Student is not in any team!")
   
  });
  it('student is not in the course exception', async () => {
    const idcheckbody: studentIdentityCheckInput = {
        zID: 'z1234567',
        courseCode: 'CS888',
        term: 'T1'
      };
      // Mock a NextRequest with JSON body
      const idcheckreq = new NextRequest(new URL('http://localhost/api/studentSystem/identityCheck'), {
        method: 'POST',
        body: JSON.stringify(idcheckbody),
        headers: { 'Content-Type': 'application/json' },
      });

      // Call the POST handler
      const idcheckres = await POST(idcheckreq);
        // Verify response status and content
      expect(idcheckres!.status).toBe(404);
      const json = await idcheckres!.json(); // Parse the JSON response
      expect(json.error).toBe("Student is not in this course!")
   
  });
});
