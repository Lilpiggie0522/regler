import nodemailer from 'nodemailer';
import { POST } from '@/app/api/mailingSystem/sendTeam/route';
import models from '@/models/models';
import { NextRequest } from 'next/server';


jest.mock('nodemailer');
jest.mock('@/lib/dbConnect');
jest.mock('@/models/models');

const Student = models.Student;
const Team = models.Team;
const Course = models.Course;
const Reminder = models.Reminder;
const Admin = models.Admin;

describe('POST sendTeam Test', () => {
    let request: any;
    let response: any;
    
    beforeEach(() => {
        jest.clearAllMocks();

        (nodemailer.createTransport as jest.Mock).mockReturnValue({
            sendMail: jest.fn(),
        });

        Team.findById = jest.fn();
        Course.findById = jest.fn();
        Student.findById = jest.fn();
        Admin.findById = jest.fn();
        Reminder.create = jest.fn();
    });
    afterAll(async () => {
        jest.clearAllMocks();
    });
  
    it('should send notifications to rest of the team and tutors successfully', async () => {
        request = {
            json: jest.fn().mockResolvedValue({
                teamId: 'team1',
                courseId: 'course1',
                studentId: 'student1',
                issueId: 'issue1',
            }),
        } as Partial<NextRequest>;
    
        (Team.findById as jest.Mock).mockResolvedValue({
            _id: 'team1',
            teamName: 'Test Team',
            course: 'course1',
            students: ['student1', 'student2', 'student3', 'student4'],
            mentors: ['mentor1', 'mentor2'],
            issues: ['issue1'],
        });
        (Course.findById as jest.Mock).mockResolvedValue({
            _id: 'course1',
            courseName: 'TEST3900',
            teams: ['team1'],
            mentors: ['mentor1'],
            term: '24T3',
        });

        (Student.findById as jest.Mock).mockResolvedValueOnce({
            _id: 'student1',
            studentName: 'Peter Simpson',
            email: 'z1111111@ad.unsw.edu.au',
            zid: 'z1111111',
            course: ['course1'],
        }).mockResolvedValueOnce({
            _id: 'student2',
            studentName: 'Mary White',
            email: 'z2222222@ad.unsw.edu.au',
            zid: 'z2222222',
            course: ['course1'],
        }).mockResolvedValueOnce({
            _id: 'student3',
            studentName: 'Ben Thompson',
            email: 'z3333333@ad.unsw.edu.au',
            zid: 'z3333333',
            course: ['course1'],
        }).mockResolvedValueOnce({
            _id: 'student4',
            studentName: 'Jerry Griffen',
            email: 'z4444444@ad.unsw.edu.au',
            zid: 'z4444444',
            course: ['course1'],
        });
    
        (Admin.findById as jest.Mock).mockResolvedValueOnce({
            _id: 'mentor1',
            adminName: 'Spongebob Superman',
            email: 'tutor1@unsw.edu.au',
            role: 'tutor',
            courses: ['course1']
        }).mockResolvedValueOnce({
            _id: 'mentor2',
            adminName: 'Patrick Superman',
            email: 'tutor2@unsw.edu.au',
            role: 'tutor',
            courses: ['course1']
        });

        (Reminder.create as jest.Mock).mockResolvedValue({});

        response = await POST(request);
    
        // Send 4 emails to students and send emails to tutors at once (4+1).
        expect(nodemailer.createTransport).toHaveBeenCalledTimes(1);
        expect(nodemailer.createTransport().sendMail).toHaveBeenCalledTimes(5);
        expect(response.status).toBe(200);
    });
  
    it('should return 404 if team not exists', async () => {
        request = {
            json: jest.fn().mockResolvedValue({
                teamId: 'Invalid team',
                courseId: 'course1',
                studentId: 'student1',
                issueId: 'issue1',
            }),
        } as unknown as NextRequest;
    
        (Team.findById as jest.Mock).mockResolvedValue(null);
    
        response = await POST(request);
        expect(response.status).toBe(404);
    });
  
    it('should return 404 if course not exists', async () => {
        request = {
            json: jest.fn().mockResolvedValue({
                teamId: 'team1',
                courseId: 'Invalid course',
                studentId: 'student1',
                issueId: 'issue1',
            }),
        } as unknown as NextRequest;
    
        // Mock Team to exist, but Course to return null
        (Team.findById as jest.Mock).mockResolvedValue({
            _id: 'team1',
            students: ['student1', 'student2'],
            mentors: ['mentor1'],
            teamName: 'Test Team',
        });
        (Course.findById as jest.Mock).mockResolvedValue(null);
    
        response = await POST(request);
        expect(response.status).toBe(404);
    });
});

