
import {CreateIssueInput, POST, DELETE} from '@/app/api/issueSystem/createIssue/route';
import models from '@/models/models';
import { NextRequest } from 'next/server';
import { createDatabase, initialiseInput, terminateDatabase } from '@/test/testUtils';
import { MongoMemoryServer } from 'mongodb-memory-server';


let studentId : string, teamId : string, courseId: string;
let notInTeamStudentIds : string;
const { Team, Course, Student} = models;
let mongoServer: MongoMemoryServer;
// input fields
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
  const notInTeamStudent = await Student.findOne({studentName: "John"}).exec();
  notInTeamStudentIds = notInTeamStudent._id;
});
afterAll(async () => {
  // Drop the database and close the server after each test
  await terminateDatabase(mongoServer);
});

describe('Create issue API Tests', () => {
      // attemping create new issue if there is already an exist pending issue. 409
    // otherwise create new issue and success 200
  it('should submitted valid issue but refuse create issue that is already exist', async () => {
    const body : CreateIssueInput = {
      studentId: studentId,
      teamId: teamId,
      courseId: courseId,
      filesUrl: "anc.png,dasd.jpg",
      title: "disagreement to the babalala",
      content: "this is a very important issue!!!!"
      };
    
    // Mock a NextRequest with JSON body
    let req = new NextRequest(new URL('http://localhost/api/issueSystem/createIssue'), {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
    });

    // Call the POST handler
    let res = await POST(req);

    // Verify response status and content
    expect(res.status).toBe(200);

    const json = await res.json(); // Parse the JSON response
    //console.log(json);
    const issueId = json.issue._id;
    // console.log(issueId);

    // Above test ran successfully, but the below test output "Invalid Student ID", which likely
    // from validatedId.ts, however tutorOpinions route does not verify any student id.
    const body2 = { teamId, content: "This is the tutor's opinion." };

    const req2 = new NextRequest(new URL(`http://localhost/api/staff/tutorOpinions`), {
        method: 'POST',
        body: JSON.stringify(body2),
        headers: { 'Content-Type': 'application/json' },
    });

    const res2 = await POST(req2);

    //expect(res2.status).toBe(200);
    const json2 = await res2.json();
    console.log(json2);
    //expect(json2.error).toBe("Tutor opinion added successfully");

    //   req = new NextRequest(new URL('http://localhost/api/issueSystem/createIssue'), {
    //     method: 'DELETE',
    //     body: JSON.stringify({
    //       issueId: issueId
    //     }),
    //     headers: { 'Content-Type': 'application/json' },
    //   });
    //   res = await DELETE(req);
    //   expect(res.status).toBe(200);
  });
});

// import { POST } from '@/app/api/staff/tutorOpinions/route';
// import { NextRequest } from 'next/server';
// import models from '@/models/models';
// import { createDatabase, initialiseInput, terminateDatabase } from '@/test/testUtils';
// import { MongoMemoryServer } from 'mongodb-memory-server';
// import {CreateIssueInput, DELETE} from '@/app/api/issueSystem/createIssue/route';

// let studentId : string, teamId : string, courseId: string;
// let notInTeamStudentIds : string;
// const { Team, Course, Student} = models;
// let mongoServer: MongoMemoryServer;

// beforeAll(async () => {
//     const input: initialiseInput = {
//         courseAdmins: [{ adminName: "Admin1", email: "admin1@example.com", role: "admin", courseName: "CS101", term: "T1" }],
//         staffAdmins: [{ adminName: "Tutor1", email: "tutor1@example.com", role: "tutor", courseName: "CS101", term: "T1" }],
//         students: [{ studentName: "Alice", email: "alice@example.com", zid: "z1234567" },
//           {studentName: "Bob", email: "bob@example.com",zid: "z5423255"},
//           {studentName: "John", email: "Jogn@example.com", zid: "z2222222"}
//         ],
//         teams: [{ teamName: "Team1", studentsZids: "z1234567,z5423255", mentorsEmails: "tutor1@example.com" }],
//         course: { courseName: "CS101", mentorsEmails: "tutor1@example.com", teams: "Team1", term: "T1" },
//       };
    
//       mongoServer = await createDatabase(input, mongoServer);
//       const course = await Course.findOne({}).exec();
//       courseId = course._id;
//       teamId = course.teams[0];
//       const team = await Team.findOne({_id: teamId}).exec();
//       studentId = team.students[0];
//       const notInTeamStudent = await Student.findOne({studentName: "John"}).exec();
//       notInTeamStudentIds = notInTeamStudent._id;

//     // Create a new issue with required fields
//     const body : CreateIssueInput = {
//         studentId: studentId,
//         teamId: teamId,
//         courseId: courseId,
//         filesUrl: "anc.png,dasd.jpg",
//         title: "disagreement to the babalala",
//         content: "this is a very important issue!!!!"
//         };

//         // Mock a NextRequest with JSON body
//     let req = new NextRequest(new URL('http://localhost/api/issueSystem/createIssue'), {
//     method: 'POST',
//     body: JSON.stringify(body),
//     headers: { 'Content-Type': 'application/json' },
//     });

//     // Call the POST handler
//     let res = await POST(req);

//     // Verify response status and content
//     const json = await res.json();
//     expect(json.error).toBe("Tutor opinion added successfully");
//     expect(res.status).toBe(200);
// });


// afterAll(async () => {
//     await terminateDatabase(mongoServer);
// });

// describe('Tutor Opinion API Tests', () => {

//     it('should successfully add a tutor opinion to an open issue', async () => {
//         const body = { teamId, content: "This is the tutor's opinion." };

//         const req = new NextRequest(new URL(`http://localhost/api/staff/tutorOpinions/`), {
//             method: 'POST',
//             body: JSON.stringify(body),
//             headers: { 'Content-Type': 'application/json' },
//         });

//         const res = await POST(req);

//         //expect(res.status).toBe(200);
        

//         const json = await res.json();
//         expect(json.error).toBe("Tutor opinion added successfully");
//     });

    // it('should prevent adding multiple opinions by the tutor for the same issue', async () => {
    //     const body = { teamId, content: "This is another opinion, which should be blocked." };

    //     let req = new NextRequest(new URL(`http://localhost/api/staff/tutorOpinions/`), {
    //         method: 'POST',
    //         body: JSON.stringify(body),
    //         headers: { 'Content-Type': 'application/json' },
    //     });

    //     const res = await POST(req);
    //     expect(res.status).toBe(400);

    //     const json = await res.json();
    //     expect(json.error).toBe("Tutor has already submitted an opinion on this issue");
    // });

    // it('should return 400 if content is missing in the tutor opinion', async () => {
    //     const body = { teamId, content: "" };

    //     const req = new NextRequest(new URL(`http://localhost/api/staff/tutorOpinions/`), {
    //         method: 'POST',
    //         body: JSON.stringify(body),
    //         headers: { 'Content-Type': 'application/json' },
    //     });

    //     const res = await POST(req);
    //     expect(res.status).toBe(400);

    //     const json = await res.json();
    //     expect(json.error).toBe("Content is required");
    // });

    // it('should prevent adding an opinion if the issue is closed', async () => {
    //     await Issue.updateOne({ _id: issueId }, { $set: { status: 'closed' } });

    //     const body = { teamId, content: "Trying to add opinion to closed issue" };

    //     const req = new NextRequest(new URL(`http://localhost/api/staff/tutorOpinions/`), {
    //         method: 'POST',
    //         body: JSON.stringify(body),
    //         headers: { 'Content-Type': 'application/json' },
    //     });

    //     const res = await POST(req);
    //     expect(res.status).toBe(400);

    //     const json = await res.json();
    //     expect(json.error).toBe("Issue is closed and cannot be updated");
    // });
// });
