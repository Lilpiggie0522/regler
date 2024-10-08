import mongoose from 'mongoose';
import { teamSchema } from './teamModel';
import { adminSchema } from './adminModel';
import { courseSchema } from './courseModel';
import { studentSchema } from './studentModel';
import { issueSchema } from './issueModel';
import { authCodeSchema } from './authcodeModel';
// Import other model schemas as needed

const models = {
  Team: mongoose.models.Team || mongoose.model('Team', teamSchema),
  Admin: mongoose.models.Admin || mongoose.model('Admin', adminSchema),
  Course: mongoose.models.Course || mongoose.model('Course', courseSchema),
  Student: mongoose.models.Student || mongoose.model('Student', studentSchema),
  Issue: mongoose.models.Issue || mongoose.model('Issue', issueSchema),
  AuthCode: mongoose.models.AuthCode || mongoose.model('AuthCode', authCodeSchema),
  // Add other model schemas as neede
};

export default models;