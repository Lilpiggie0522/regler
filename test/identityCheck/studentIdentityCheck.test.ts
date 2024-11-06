import { POST } from '@/app/api/studentSystem/identityCheck/route';
import { NextRequest } from 'next/server';
import models from '@/models/models';
import nodemailer from 'nodemailer';

jest.mock('nodemailer');
jest.mock('@/lib/dbConnect');
jest.mock('@/models/models');


const Student = models.Student;
const Team = models.Team;
const Course = models.Course;
const AuthCode = models.AuthCode;
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
        Course.findOne = jest.fn();
        Student.findById = jest.fn();
        Student.findOne = jest.fn();
        Admin.findById = jest.fn();
        AuthCode.findById = jest.fn();
    });
    afterAll(async () => {
        jest.clearAllMocks();
    });
  
    it('Auth code was sent successfully.', async () => {
        request = {
            json: jest.fn().mockResolvedValue({
                zID: 'z5349042',
                courseCode: 'COMP3900',
                term: '24T3',
            }),
        } as unknown as NextRequest;
    
        (Team.findById as jest.Mock).mockResolvedValue({
            _id: 'sweetteam3900',
            teamName: 'cowhorse',
            course: 'comp390024t3',
            students: ['rockyliu1', 'student1', 'student2', 'student3'],
            mentors: ['mentor1', 'mentor2'],
            issues: ['issue1'],
        });
        (Course.findById as jest.Mock).mockResolvedValue({
            _id: 'comp390024t3',
            courseName: 'COMP3900',
            teams: ['sweetteam3900'],
            mentors: ['mentor1', 'mentor2'],
            term: '24T3',
        });

        (Student.findById as jest.Mock).mockResolvedValueOnce({
            _id: 'rockyliu1',
            studentName: 'Rocky Liu',
            email: 'z5349042@ad.unsw.edu.au',
            zid: 'z5349042',
            course: ['comp390024t3'],
        }).mockResolvedValueOnce({
            _id: 'student1',
            studentName: 'Mary White',
            email: 'z2222222@ad.unsw.edu.au',
            zid: 'z2222222',
            course: ['comp390024t3'],
        }).mockResolvedValueOnce({
            _id: 'student2',
            studentName: 'Ben Thompson',
            email: 'z3333333@ad.unsw.edu.au',
            zid: 'z3333333',
            course: ['comp390024t3'],
        }).mockResolvedValueOnce({
            _id: 'student3',
            studentName: 'Jerry Griffen',
            email: 'z4444444@ad.unsw.edu.au',
            zid: 'z4444444',
            course: ['comp390024t3'],
        });
    
        (Admin.findById as jest.Mock).mockResolvedValueOnce({
            _id: 'mentor1',
            adminName: 'Spongebob Superman',
            email: 'tutor1@unsw.edu.au',
            role: 'tutor',
            courses: ['comp390024t3']
        }).mockResolvedValueOnce({
            _id: 'mentor2',
            adminName: 'Patrick Superman',
            email: 'tutor2@unsw.edu.au',
            role: 'tutor',
            courses: ['comp390024t3']
        });

        response = await POST(request);
        expect(response.status).toBe(200);
    });
});

