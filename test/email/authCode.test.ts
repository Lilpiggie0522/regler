import nodemailer from 'nodemailer';
import models from '@/models/models';
import { sendAuthCode } from '@/lib/sendAuthCode';



jest.mock('nodemailer');
jest.mock('@/lib/dbConnect');
jest.mock('@/models/models');

const Student = models.Student;
const Admin = models.Admin;

describe('POST sendTeam Test', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        (nodemailer.createTransport as jest.Mock).mockReturnValue({
            sendMail: jest.fn(),
        });

        Student.findById = jest.fn();
        Admin.findById = jest.fn();
    });
    afterAll(async () => {
        jest.clearAllMocks();
    });
  
    it('should send authentication code to student successfully', async () => {
        (Student.findOne as jest.Mock).mockResolvedValue({
            _id: 'student1',
            studentName: 'Peter Simpson',
            email: 'z1111111@ad.unsw.edu.au',
            zid: 'z1111111',
            course: ['course1'],
        });


        const response = await sendAuthCode('z1111111@ad.unsw.edu.au', 'authcode1', 'student');
        expect(response).toEqual('Send verification code successfully.');
    });
  
    it('should send authentication code to tutor successfully', async () => {
        (Admin.findOne as jest.Mock).mockResolvedValue({
            _id: 'mentor1',
            adminName: 'Spongebob Superman',
            email: 'tutor1@unsw.edu.au',
            role: 'tutor',
            courses: ['course1']
        })
    
        const response = await sendAuthCode('tutor1@unsw.edu.au', 'authcode1', 'tutor');
        expect(response).toEqual('Send verification code successfully.');
    });

    it('should fail to send authentication code to student', async () => {
        (Student.findOne as jest.Mock).mockResolvedValue(null);


        const response = await sendAuthCode('z1111111@ad.unsw.edu.au', 'authcode1', 'student');
        expect(response).toEqual('Invalid Email Address');
    });
  
    it('should fail to send authentication code to tutor', async () => {
        (Admin.findOne as jest.Mock).mockResolvedValue(null)
    
        const response = await sendAuthCode('tutor2@unsw.edu.au', 'authcode1', 'tutor');
        expect(response).toEqual('Invalid Email Address');
    });

});

