import {CreateIssueInput, POST} from '@/app/api/issueSystem/createIssue/route';
import {PUT} from '@/app/api/issueSystem/updateIssue/route';
import models from '@/models/models';
import { NextRequest } from 'next/server';
import { createDatabase, initialiseInput, terminateDatabase } from '@/test/testUtils';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { UpdateIssueInput } from '@/app/api/issueSystem/updateIssue/route';
import StudentComment from '@/components/studentComment';


let studentId : string, teamId : string, courseId: string;
let sentTeamId: string, BobId: string, sentCourseId: string, issueId: string;

let notInTeamStudentIds : string;
const { Team, Course, Student} = models;
let mongoServer: MongoMemoryServer;
// input fields
beforeAll(async () => {

  const input: initialiseInput = {
    courseAdmins: [{ adminName: "Admin1", email: "admin1@example.com", role: "admin", courseName: "CS101", term: "T1" }],
    staffAdmins: [{ adminName: "Tutor1", email: "tutor1@example.com", role: "tutor", courseName: "CS101", term: "T1" }
      , { adminName: "Tutor2", email: "tutor2@example.com", role: "tutor", courseName: "CS101", term: "T1" }
    ],
    students: [
        { studentName: "Alice", email: "alice@example.com", zid: "z1234567" },
      {studentName: "Bob", email: "bob@example.com",zid: "z5423255"},
      {studentName: "John", email: "Jogn@example.com", zid: "z2222222"}
    ],
    teams: [{ teamName: "Team1", studentsZids: "z1234567,z5423255", mentorsEmails: "tutor1@example.com" },
      { teamName: "Team2", studentsZids: "z2222222", mentorsEmails: "tutor1@example.com,tutor2@example.com" },
    ],
    course: { courseName: "CS101", mentorsEmails: "tutor1@example.com,tutor2@example.com", teams: "Team1,Team2", term: "T1" },
  };

  mongoServer = await createDatabase(input, mongoServer);
  const course = await Course.findOne({}).exec();
  courseId = course._id;
  teamId = course.teams[0];
  const team = await Team.findOne({teamName: "Team1"}).exec();
  const student = await Student.findOne({studentName: "Alice"}).exec();
  studentId = student._id;
  teamId = team._id;
  const notInTeamStudent = await Student.findOne({studentName: "John"}).exec();
  notInTeamStudentIds = notInTeamStudent._id;
  const bob = await Student.findOne({studentName: "Bob"}).exec();
  BobId = bob._id;
  const body : CreateIssueInput = {
    studentId: studentId,
    teamId: teamId,
    courseId: courseId,
    filesUrl: "anc.png,dasd.jpg",
    filesName: "anc,dasd",
    title: "disagreement to the babalala",
    content: "this is a very important issue!!!!"
    };
  
    // create a request
    // bob should be the one update the form
    const req = new NextRequest(new URL('http://localhost/api/issueSystem/createIssue'), {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    });
    const res = await POST(req);

    const json = await res.json();
    //console.log(json.issue.studentComments);
    sentTeamId = json.teamId;

    
    sentCourseId = json.courseId;
    issueId = json.issueId;
  
  
});
afterAll(async () => {
  // Drop the database and close the server after each test
  await terminateDatabase(mongoServer);
});

describe('update issue API Tests', () => {

  it('bob should be able to update his issue', async () => {

    // TODO: check before updating
    // now use bob Id
    const body : UpdateIssueInput = {
      studentId: BobId,
      teamId: sentTeamId,
      courseId: sentCourseId,
      filesUrl: "anc.png,dasd.jpg",
      filesName: "anc,dasd",
      title: "disagreement to the babalala",
      content: "this is a very important issue!!!!",
      issueId: issueId
      };
    
      // Mock a NextRequest with JSON body
      const req = new NextRequest(new URL('http://localhost/api/issueSystem/updateIssue'), {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
      });
    
      // Call the POST handler
      const res = await PUT(req);
      const json = await res.json();
      console.log(JSON.stringify(json));
      expect(res.status).toBe(200);
      expect(json.message).toBe("Issue updated successfully");
      expect(json.updatedIssue.status).toBe("Need Feedback");
      expect(json.updatedIssue._id.toString()).toBe(issueId);
      expect(json.updatedIssue.studentComments.length).toBe(2);
      
    
     
  });
  // if the student is not in the team 400
    // if id is moongoose object but not found user, team or course 404
    
    // if the team does not belong to the course 403
    // if title or content is empty 400
  it('if id is invalid or bad request with empty input', async () => {
    let body : UpdateIssueInput = {
      studentId: notInTeamStudentIds,
      teamId: teamId,
      courseId: courseId,
      filesUrl: "anc.png,dasd.jpg",
      filesName: "anc,dasd",
      title: "disagreement to the babalala",
      content: "this is a very important issue!!!!",
      issueId: issueId
      };
    
     
      let req = new NextRequest(new URL('http://localhost/api/issueSystem/updateIssue'), {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
      });
    
      
      let res = await PUT(req);
      
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
        title: "disagreement to the babalala",
        content: "this is a very important issue!!!!",
        issueId: issueId
        };
      //const json = await res.json(); // Parse the JSON response
      //console.log(json);

      //submitting again should be failed
      req = new NextRequest(new URL('http://localhost/api/issueSystem/updateIssue'), {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
      });

      res = await PUT(req);
      expect(res.status).toBe(404);

      body  = {
        studentId: studentId,
        teamId: sentTeamId,
        courseId: sentCourseId,
        filesUrl: "anc.png,dasd.jpg",
        filesName: "anc,dasd",
        title: "",
        content: "this is a very important issue!!!!",
        issueId: issueId
        };
      req = new NextRequest(new URL('http://localhost/api/issueSystem/updateIssue'), {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
      });
      res = await PUT(req);
      
      expect(res.status).toBe(400);

  });
      // TODO if the issue id is not found return 404


    // TODO if the issue is complete return 405
    
  it('if id is invalid or bad request with empty input', async () => {
    // TODO if student is alreday submitted return 401
    let body : UpdateIssueInput = {
      studentId: studentId,
      teamId: teamId,
      courseId: courseId,
      filesUrl: "anc.png,dasd.jpg",
      filesName: "anc,dasd",
      title: "disagreement to the babalala",
      content: "this is a very important issue!!!!",
      issueId: issueId
      };
    
     
      let req = new NextRequest(new URL('http://localhost/api/issueSystem/updateIssue'), {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
      });
    
      
      let res = await PUT(req);
      
      
      expect(res.status).toBe(401);
      const json = await res.json(); 
      expect(json.error).toBe("Student has already submitted an issue for this team");
    
      // TODO if the issue id is not found return 404
      body  = {
        studentId: BobId,
        teamId: teamId,
        courseId: courseId,
        filesUrl: "anc.png,dasd.jpg",
        filesName: "anc,dasd",
        title: "disagreement to the babalala",
        content: "this is a very important issue!!!!",
        issueId: "671b4dbbd1ab3e8a13457157"
        };
      //const json = await res.json(); // Parse the JSON response
      //console.log(json);

      req = new NextRequest(new URL('http://localhost/api/issueSystem/updateIssue'), {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
      });

      res = await PUT(req);
      expect(res.status).toBe(404);



  });
  it('should refuse update if wrong team and wrong student send update to wrong issue', async () => {
    // TODO if student is alreday submitted return 401
    let John = await Student.findOne({studentName: 'John'}).exec();
    let team = await Team.findOne({teamName: 'Team2'}).exec();
    let JohnId = John._id;
    let teamId2 = team._id;
    let body : UpdateIssueInput = {
      studentId: JohnId,
      teamId: teamId2,
      courseId: courseId,
      filesUrl: "anc.png,dasd.jpg",
      filesName: "anc,dasd",
      title: "disagreement to the babalala",
      content: "this is a very important issue!!!!",
      issueId: issueId
      };
    
     
      let req = new NextRequest(new URL('http://localhost/api/issueSystem/updateIssue'), {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
      });
    
      
      let res = await PUT(req);
      
      
      expect(res.status).toBe(406);
      const json = await res.json(); 
      expect(json.error).toBe("Issue does not belong to this team");
    
  });
});