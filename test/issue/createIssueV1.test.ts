import {CreateIssueInput, POST} from '@/app/api/issueSystem/createIssue/route';
import models from '@/models/models';
import { NextRequest } from 'next/server';
//import { getTeamIdByStudentId, getCourseIdByTeamId } from '../testUtils';
//import { createMocks } from 'node-mocks-http';

// input fields
const { Team, Course} = models;
describe('Create issue API Tests', () => {

  let studentId : string, teamId : string, courseId: string;
  beforeEach(async() => {
    const course = await Course.findOne({}).exec();
    courseId = course._id;
    teamId = course.teams[0];
    const team = await Team.findOne({_id: teamId}).exec();
    studentId = team.students[0];
  })

  it('if submitted valid issue', async () => {
    // if id is moongoose object but not found user, team or course 404
    // if the student is not in the team 400
    // if the team does not belong to the course 403
    // if title or content is empty 400
    // attemping create new issue if there is already an exist pending issue. 409
    // otherwise create new issue and success 200


    const body : CreateIssueInput = {
      studentId: studentId,
      teamId: teamId,
      courseId: courseId,
      filesUrl: "anc.png,dasd.jpg",
      title: "disagreement to the babalala",
      content: "this is a very important issue!!!!"
      };
    
      // Mock a NextRequest with JSON body
      const req = new NextRequest(new URL('http://localhost/api/issueSystem/createIssue'), {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
      });
    
      // Call the POST handler
      const res = await POST(req);
    
      // Verify response status and content
      expect(res.status).toBe(200);
    
      const json = await res.json(); // Parse the JSON response
      console.log(json);

    
  });
});