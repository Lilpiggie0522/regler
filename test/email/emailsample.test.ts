// // // // import {POST} from '@/app/api/adminSystem/initialise/route';
// // // // import { NextRequest } from 'next/server';
// // // // import { MongoMemoryServer } from 'mongodb-memory-server';
// // // // import { createDatabase, initialiseInput, terminateDatabase } from '@/test/testUtils';

// // // // let mongoServer: MongoMemoryServer;

// // // // beforeAll(async () => {
// // // //     // Start a new MongoDB server and connect Mongoose
  
// // // //     // Mock input data to initialize the database
// // // //     const input: initialiseInput = {
// // // //       courseAdmins: [{ adminName: "Admin1", email: "admin1@example.com", role: "admin", courseName: "CS101", term: "T1" }],
// // // //       staffAdmins: [{ adminName: "Tutor1", email: "tutor1@example.com", role: "tutor", courseName: "CS101", term: "T1" }],
// // // //       students: [{ studentName: "Alice", email: "alice@example.com", zid: "z1234567" }],
// // // //       teams: [{ teamName: "Team1", studentsZids: "z1234567", mentorsEmails: "tutor1@example.com" }],
// // // //       course: { courseName: "CS101", mentorsEmails: "tutor1@example.com", teams: "Team1", term: "T1" },
// // // //     };
  
// // // //     // Initialize the database with the mock data
// // // //     mongoServer = await createDatabase(input, mongoServer);
// // // //   });
  
// // // //   afterAll(async () => {
// // // //     // Drop the database and close the server after each test
// // // //     await terminateDatabase(mongoServer);
// // // //   });

// // // import { createCourseInput, createStudentInput, createTeamInput, createAdminInput } from '@/app/api/adminSystem/initialise/route';
// // // // import {CreateIssueInput, POST, DELETE} from '@/app/api/issueSystem/createIssue/route';
// // // import models from '@/models/models';
// // // import mongoose from 'mongoose';
// // // // import { NextRequest } from 'next/server';
// // // import { terminateDatabase } from '@/test/testUtils';
// // // import { MongoMemoryServer } from 'mongodb-memory-server';

// // // let studentId : string, teamId : string, courseId: string;
// // // let notInTeamStudentIds : string;
// // // const { Team, Course, Student, Issue, Reminder, Admin } = models;

// // // let mongoServer: MongoMemoryServer;

// // // interface createIssueInput {
// // //     '_id': '111111'
// // // }

// // // interface createReminderInput {
// // //     team: {
// // //         type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true
// // //     },
// // //     course: {
// // //         type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true
// // //     },
// // //     issue: {
// // //         type: mongoose.Schema.Types.ObjectId, ref: 'Issue', required: true
// // //     },
// // //     schedule: {
// // //         type: Date
// // //     },
// // //     students: [
// // //         {type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true}
// // //     ],
// // //     mentors: [
// // //         {type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true}
// // //     ],
// // // }

// // // interface initialiseInput {
// // //     tutors: createAdminInput[];
// // //     students: createStudentInput[];
// // //     teams: createTeamInput[];
// // //     courses: createCourseInput[];
// // //     Issues: createIssueInput[];
// // //     reminders: createReminderInput[];
// // // }

// // // const input: initialiseInput = {
// // //     students: [{ studentName: "Alice", email: "alice@example.com", zid: "z1234567" }],
// // //     teams: [{ teamName: "Team1", studentsZids: "z1234567", mentorsEmails: "tutor1@example.com" }],
// // //     courses: [{ courseName: "CS101", mentorsEmails: "tutor1@example.com", teams: "Team1", term: "T1" }],
// // //     tutors: [],
// // //     Issues: [],
// // //     reminders: [],
// // // };

// // // export async function initialiseEmailDatabase(input: initialiseInput) {
// // //     console.log(input)
// // // }

// // // beforeAll(async () => {
// // //     try {
// // //         mongoServer = await MongoMemoryServer.create();
// // //         const uri = mongoServer.getUri();
// // //         await mongoose.connect(uri);
// // //         await initialiseEmailDatabase(input);
// // //         return mongoServer;
// // //     } catch (error) {
// // //         throw error;
// // //     }
// // // });
// // // afterAll(async () => {
// // //     await terminateDatabase(mongoServer);
// // // });



// import nodemailer from 'nodemailer';
// import { POST } from '@/app/api/mailingSystem/sendTeam/route';
// // import dbConnect from '@/lib/dbConnect';
// import models from '@/models/models';
// import { NextRequest } from 'next/server';
// // import { NextRequest, NextResponse } from 'next/server';

// jest.mock('nodemailer');
// jest.mock('@/lib/dbConnect');
// jest.mock('@/models/models');

// const { Student, Team, Course, Admin, Reminder } = models;

// describe('POST sendTeam Test', () => {
//     let request: any;
//     let response: any;
    
//     // Initialise database
//     beforeEach(() => {
//         jest.clearAllMocks();
  
//         response = {
//             json: jest.fn().mockReturnValue(response),
//             status: jest.fn().mockReturnValue(response),
//         };
  
//         // Mock nodemailer transport
//         const sendMailMock = jest.fn();
//         (nodemailer.createTransport as jest.Mock).mockReturnValue({
//             sendMail: sendMailMock,
//         });

//         Team.findById = jest.fn();
//         Course.findById = jest.fn();
//         Student.findById = jest.fn();
//         Admin.findById = jest.fn();
//         Reminder.create = jest.fn();
//     });
//     afterAll(async () => {
//         jest.clearAllMocks();
//     });
  
//     it('should send emails to team members and confirmation email to the applicant', async () => {
//         // Mock request data
//         request = {
//             json: jest.fn().mockResolvedValue({
//             teamId: 'team123',
//             courseId: 'course123',
//             studentId: 'student123',
//             issueId: 'issue123',
//             }),
//         } as unknown as NextRequest;
    
//         // Mock Team and Course models
//         (Team.findById as jest.Mock).mockResolvedValue({
//             _id: 'team123',
//             students: ['student123', 'student456'],
//             mentors: ['admin123'],
//             teamName: 'Team Alpha',
//         });
//         (Course.findById as jest.Mock).mockResolvedValue({
//             _id: 'course123',
//             courseName: 'Test Course',
//             teams: ['team123'],
//         });
    
//         // Mock Student models for the team members
//         (Student.findById as jest.Mock).mockResolvedValueOnce({
//             _id: 'student456',
//             studentName: 'Student B',
//             email: 'studentB@example.com',
//         }).mockResolvedValueOnce({
//             _id: 'student123',
//             studentName: 'Student A',
//             email: 'studentA@example.com',
//         });
    
//         // Mock Admin model for mentor emails
//         (Admin.findById as jest.Mock).mockResolvedValue({
//             _id: 'admin123',
//             email: 'admin@example.com',
//         });
    
//         // Mock Reminder creation
//         (Reminder.create as jest.Mock).mockResolvedValue({});
    
//         // Call the POST function
//         await POST(request);
    
//         // Check emails sent to team members and mentors
//         expect(nodemailer.createTransport).toHaveBeenCalled();
//         expect(nodemailer.createTransport().sendMail).toHaveBeenCalledTimes(3); // 2 for team members, 1 for mentors
    
//         // Verify response
//         expect(response.json).toHaveBeenCalledWith(
//             { message: 'Notification sent to the team and tutors successfully' },
//             { status: 200 }
//         );
//     });
  
//     it('should return 404 if team does not exist', async () => {
//         request = {
//             json: jest.fn().mockResolvedValue({
//             teamId: 'team123',
//             courseId: 'course123',
//             studentId: 'student123',
//             issueId: 'issue123',
//             }),
//         } as unknown as NextRequest;
    
//         // Mock Team model to return null
//         (Team.findById as jest.Mock).mockResolvedValue(null);
    
//         await POST(request);
    
//         // Verify response with a 404 error
//         expect(response.json).toHaveBeenCalledWith(
//             { error: 'Team not found' },
//             { status: 404 }
//         );
//     });
  
//     it('should return 404 if course does not exist', async () => {
//         request = {
//             json: jest.fn().mockResolvedValue({
//             teamId: 'team123',
//             courseId: 'course123',
//             studentId: 'student123',
//             issueId: 'issue123',
//             }),
//         } as unknown as NextRequest;
    
//         // Mock Team to exist, but Course to return null
//         (Team.findById as jest.Mock).mockResolvedValue({
//             _id: 'team123',
//             students: ['student123', 'student456'],
//             mentors: ['admin123'],
//             teamName: 'Team Alpha',
//         });
//         (Course.findById as jest.Mock).mockResolvedValue(null);
    
//         await POST(request);
    
//         // Verify response with a 404 error
//         expect(response.json).toHaveBeenCalledWith(
//             { error: 'Course not found' },
//             { status: 404 }
//         );
//     });
  
//     it('should return 404 if student is not in the team', async () => {
//         request = {
//             json: jest.fn().mockResolvedValue({
//             teamId: 'team123',
//             courseId: 'course123',
//             studentId: 'student999', // Non-existent student
//             issueId: 'issue123',
//             }),
//         } as unknown as NextRequest;
    
//         // Mock Team, Course, and students in the team
//         (Team.findById as jest.Mock).mockResolvedValue({
//             _id: 'team123',
//             students: ['student123', 'student456'], // student999 is not here
//             mentors: ['admin123'],
//             teamName: 'Team Alpha',
//         });
//         (Course.findById as jest.Mock).mockResolvedValue({
//             _id: 'course123',
//             courseName: 'Test Course',
//             teams: ['team123'],
//         });
    
//         await POST(request);
    
//         // Verify response with a 404 error
//         expect(response.json).toHaveBeenCalledWith(
//             { error: 'Student not in the team' },
//             { status: 404 }
//         );
//     });
// });