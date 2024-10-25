import { createCourseInput, createStudentInput, createTeamInput, createAdminInput } from '@/app/api/adminSystem/initialise/route';
import models from '@/models/models';
//import mongoose from 'mongoose';


// Destructure models for convenience
const { Student, Team, Course, Admin } = models;

// Define the input type for initializing the database
export interface initialiseInput {
  courseAdmins: createAdminInput[];
  staffAdmins: createAdminInput[];
  students: createStudentInput[];
  teams: createTeamInput[];
  course: createCourseInput;
}

// Function to initialize the database with the provided input
export async function initialiseDatabase(input: initialiseInput) {
  const { courseAdmins, staffAdmins, students, teams, course } = input;
  const term = course.term;

  // Create the course
  let courseDoc = await Course.findOne({ courseName: course.courseName, term });
  if (!courseDoc) {
    courseDoc = await Course.create({
      courseName: course.courseName,
      term,
      teams: [],
      mentors: [],
    });
  }

  // Create students
  for (const student of students) {
    const studentExists = await Student.findOne({ email: student.email });
    if (!studentExists) {
      await Student.create({ ...student, course: [courseDoc._id] });
    }
  }

  // Create admins and assign them to the course
  for (const admin of [...courseAdmins, ...staffAdmins]) {
    const adminDoc = await Admin.findOneAndUpdate(
      { email: admin.email },
      { ...admin, courses: [courseDoc._id] },
      { upsert: true, new: true }
    );
    if (!courseDoc.mentors.includes(adminDoc._id)) {
      courseDoc.mentors.push(adminDoc._id);
    }
  }

  // Create teams and assign students and mentors
  for (const team of teams) {
    const studentIds = await Student.find({ zid: { $in: team.studentsZids.split(',') } }).select('_id');
    const mentorIds = await Admin.find({ email: { $in: team.mentorsEmails.split(',') } }).select('_id');

    const newTeam = await Team.create({
      teamName: team.teamName,
      course: courseDoc._id,
      students: studentIds.map(s => s._id),
      mentors: mentorIds.map(m => m._id),
    });

    courseDoc.teams.push(newTeam._id);
  }

  // Save the course with all assigned teams and mentors
  await courseDoc.save();
}/*
export async function getTeamIdByStudentId(studentId: string): Promise<string | null> {
  
}
export async function getCourseIdByTeamId(teamId: string): Promise<string | null> {

}*/


