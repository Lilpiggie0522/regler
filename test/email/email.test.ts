// // import nodemailer from 'nodemailer';
// import { NextRequest } from 'next/server';
// // import { NextRequest, NextResponse } from 'next/server';
// import { POST } from '@/app/api/mailingSystem/sendTeam/route'
// // import dbConnect from '@/lib/dbConnect';

// import models from "@/models/models";

// jest.mock('nodemailer')
// jest.mock('@/lib/dbConnect')
// jest.mock('@/models/models')

// const Student = models.Student;
// const Team = models.Team;
// const Course = models.Course;
// const Reminder = models.Reminder;
// const Admin = models.Admin;

// // const mock_database = {
// //     is: 'string',
// // }
// // console.log(mock_database)
// // Mock the database models
// // Team.findById = jest.fn().mockImplementation((id) => {
// //     return Promise.resolve({
// //         _id: id,
// //         teamName: 'Test Team',
// //         course: 'TEST3900',
// //         students: ['student1', 'student2'],
// //         mentors: ['mentor1'],
// //         issues: '1',
// //     });
// // });
// // Team.findById('teamId')
// // Course.findById = jest.fn().mockImplementation(() => {
// //     return Promise.resolve({
// //         _id: 'teamId',
// //         teamName: 'Test Team',
// //         course: 'TEST3900',
// //         students: ['student1', 'student2'],
// //         mentors: ['mentor1'],
// //         issues: '1',
// //     });
// // });
// // Student.findById = jest.fn().mockImplementation(() => {
// //     return Promise.resolve({
// //         _id: 'teamId',
// //         teamName: 'Test Team',
// //         course: 'TEST3900',
// //         students: ['student1', 'student2'],
// //         mentors: ['mentor1'],
// //         issues: '1',
// //     });
// // });
// // Admin.findById = jest.fn().mockImplementation(() => {
// //     return Promise.resolve({
// //         _id: 'teamId',
// //         teamName: 'Test Team',
// //         course: 'TEST3900',
// //         students: ['student1', 'student2'],
// //         mentors: ['mentor1'],
// //         issues: '1',
// //     });
// // });
// // Reminder.create = jest.fn().mockImplementation(() => {
// //     return Promise.resolve({
// //         _id: 'teamId',
// //         teamName: 'Test Team',
// //         course: 'TEST3900',
// //         students: ['student1', 'student2'],
// //         mentors: ['mentor1'],
// //         issues: '1',
// //     });
// // });

// // nodemailer.createTransport = jest.fn();
// // nodemailer.createTransport.sendMail = jest.fn();


// let input: unknown
// const response = {
//     json: jest.fn().mockReturnValue(input),
//     status: jest.fn().mockReturnValue(input),
// };

// describe('POST sendTeam Test', () => {
//     beforeEach(() => {
//         jest.clearAllMocks();
//     });
//     it('Should successfully notify all team members, tutors and set a reminder.', async () => {
//         const request = {
//             json: jest.fn().mockResolvedValue({
//                 teamId: 'team1',
//                 courseId: 'course1',
//                 studentId: 'student1',
//                 issueId: 'issue1',
//             }),
//         } as unknown as NextRequest;

//         Team.findById = jest.fn().mockImplementation((id) => {
//             return Promise.resolve({
//                 _id: id,
//                 students: ['student1', 'student2', 'student3'],
//                 mentors: ['admin1'],
//                 teamName: 'Test Team',
//                 issue: 'issue1',
//                 course: 'TEST3900',
//             });
//         });

//         Course.findById = jest.fn().mockImplementation((id) => {
//             return Promise.resolve({
//                 _id: id,
//                 mentors: ['admin1'],
//                 courseName: 'TEST3900',
//                 teams: ['team1'],
//                 term: '24T3',
//             });
//         });
        
//         Student.findById = jest.fn().mockImplementation((id) => {
//             return Promise.resolve({
//                 _id: id,
//                 studentName: 'Bob Simpson',
//                 email: 'z1111111@ad.unsw.edu.au',
//                 zid: 'z1111111',
//             });
//         }).mockImplementationOnce((id) => {
//             console.log(id)
//             return Promise.resolve({
//                 _id: 'student2',
//                 studentName: 'Mary White',
//                 email: 'z2222222@ad.unsw.edu.au',
//                 zid: 'z2222222',
//             });
//         }).mockImplementationOnce((id) => {
//             console.log(id)
//             return Promise.resolve({
//                 _id: 'student3',
//                 studentName: 'Tom Pearson',
//                 email: 'z3333333@ad.unsw.edu.au',
//                 zid: 'z3333333',
//             });
//         })
//         // .mockImplementationOnce(() => 'second call');

//         // (Student.findById as jest.Mock)
//         // .mockResolvedValueOnce({
//         //     _id: 'student1',
//         //     studentName: 'Bob Simpson',
//         //     email: 'z1111111@ad.unsw.edu.au',
//         //     zid: 'z1111111',
//         // })
//         // .mockResolvedValueOnce({
//         //     _id: 'student2',
//         //     studentName: 'Mary White',
//         //     email: 'z2222222@ad.unsw.edu.au',
//         //     zid: 'z2222222',
//         // })
//         // .mockResolvedValue({
//         //     _id: 'student3',
//         //     studentName: 'Tom Pearson',
//         //     email: 'z3333333@ad.unsw.edu.au',
//         //     zid: 'z3333333',
//         // });

//         Admin.findById = jest.fn().mockImplementation((id) => {
//             console.log(id)
//             return Promise.resolve({
//                 _id: 'admin1',
//                 email: 'admin1@unsw.edu.au',
//                 adminName: 'Peter Green',
//                 role: 'tutor',
//             });
//         });

//         (Reminder.create as jest.Mock).mockResolvedValue({});
        
        
//         // Send email 4 times,
//         await POST(request);
        
//         // // console.log(Student.findById('S'));
//         // // console.log(Course.findById('course1'));
//         // // console.log(Course.findById('course2'));
//         // expect(Course.findById).toHaveBeenCalledTimes(1);
//         // expect(Team.findById).toHaveBeenCalledTimes(1);

//         // expect(Student.findById).toHaveBeenCalledTimes(3);
//         // expect(Admin.findById).toHaveBeenCalledTimes(1);
//         // expect(Reminder.create).toHaveBeenCalledTimes(1);

//         // expect(nodemailer.createTransport).toHaveBeenCalled();
//         // expect(nodemailer.createTransport().sendMail).toHaveBeenCalledTimes(4);
//         // expect(response.json).toHaveBeenCalledWith(
//         //     { message: 'Notification sent to the team and tutors successfully' },
//         //     { status: 200 }
//         // );
//     });   
//     //     const body = {
//     //         teamId: 'teamId', 
//     //         courseId: 'courseId', 
//     //         studentId: 'studentId', 
//     //         issueId: 'issueId',
//     //     };
        
//     //     // Mock a NextRequest with JSON body
//     //     const req = new NextRequest(new URL('http://localhost/api/mailingSystem/sendTeam'), {
//     //         method: 'POST',
//     //         body: JSON.stringify(body),
//     //         headers: { 'Content-Type': 'application/json' },
//     //     });
        
//     //     // Call the POST handler
//     //     const res: NextResponse = await POST(req);
        
//     //     // Verify response status and content
//     //     expect(res.status).toBe(200);
    
//     //     const json = await res.json(); // Parse the JSON response
//     //     //console.log(json);
//     //     // { message: 'Notification sent to the team and tutors successfully' }, { status: 200 }
//     //     expect(json.message).toBe('Notification sent to the team and tutors successfully');
        
//     // });

// });
