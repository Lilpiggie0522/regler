import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { initialiseDatabase, initialiseInput } from './test/testUtils';

// In-memory MongoDB server instance
let mongoServer: MongoMemoryServer;

beforeEach(async () => {
  // Start a new MongoDB server and connect Mongoose
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // Mock input data to initialize the database
  const input: initialiseInput = {
    courseAdmins: [{ adminName: "Admin1", email: "admin1@example.com", role: "admin", courseName: "CS101", term: "T1" }],
    staffAdmins: [{ adminName: "Tutor1", email: "tutor1@example.com", role: "tutor", courseName: "CS101", term: "T1" }],
    students: [{ studentName: "Alice", email: "alice@example.com", zid: "z1234567" }],
    teams: [{ teamName: "Team1", studentsZids: "z1234567", mentorsEmails: "tutor1@example.com" }],
    course: { courseName: "CS101", mentorsEmails: "tutor1@example.com", teams: "Team1", term: "T1" },
  };

  // Initialize the database with the mock data
  await initialiseDatabase(input);
});

afterEach(async () => {
  // Drop the database and close the server after each test
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});
