import { POST } from "@/app/api/staff/courseList/route"
import models from "@/models/models"
import { NextRequest } from "next/server"
//import { createMocks } from 'node-mocks-http';
import { MongoMemoryServer } from "mongodb-memory-server"
import { createDatabase, initialiseInput, terminateDatabase } from "@/test/testUtils"

jest.setTimeout(30000)
// Mock the `cookies()` function

jest.mock("next/headers", () => ({
  cookies: jest.fn().mockReturnValue({
    set: jest.fn(),
  }),
}))

let studentId : string, teamId : string, courseId: string
let notInTeamStudentIds : string
const { Team, Course, Student, AuthCode } = models
// In-memory MongoDB server instance
let mongoServer: MongoMemoryServer

beforeAll(async () => {
  // Start a new MongoDB server and connect Mongoose

  // Mock input data to initialize the database
  const input: initialiseInput = {
    courseAdmins: [{ adminName: "Admin1", email: "admin1@example.com", role: "admin", courseName: "CS101", term: "T1" }],
    staffAdmins: [{ adminName: "Tutor1", email: "tutor1@example.com", role: "tutor", courseName: "CS101", term: "T1" }],
    students: [
      { studentName: "Alice", email: "alice@example.com", zid: "z1234567", class: "T14A" },
      {studentName: "Bob", email: "bob@example.com",zid: "z5423255", class: "T14A" },
      {studentName: "John", email: "Jogn@example.com", zid: "z2222222", class: "T14A" }
    ],
    teams: [{ teamName: "Team1", studentsZids: "z1234567,z5423255", mentorsEmails: "tutor1@example.com" }],
    course: { courseName: "CS101", mentorsEmails: "tutor1@example.com", teams: "Team1", term: "T1" },
  }

  mongoServer = await createDatabase(input, mongoServer)
  const course = await Course.findOne({}).exec()
  courseId = course._id
  teamId = course.teams[0]
  const team = await Team.findOne({_id: teamId}).exec()
  studentId = team.students[0]
  const notInTeamStudent = await Student.findOne({studentName: "John"}).exec()
  notInTeamStudentIds = notInTeamStudent._id
})

afterAll(async () => {
  // Drop the database and close the server after each test
  await terminateDatabase(mongoServer)
  
})

describe("staff course list API Tests", () => {
  
  it("get course list successfully", async () => {
    const req = new NextRequest(new URL("http://localhost/api/staff/courseList"), {
      method: "POST",
      body: JSON.stringify({
        email : "admin1@example.com"
      }),
      headers: { "Content-Type": "application/json" },
    })
    const res = await POST(req)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.courses.length).toBe(1)
    expect(json.courses[0].course).toBe("CS101")
    expect(json.courses[0].term).toBe("T1")
  })
  it("unauthorised and unexisted individual 401", async () => {
    let req = new NextRequest(new URL("http://localhost/api/staff/courseList"), {
      method: "POST",
      body: JSON.stringify({
        email : "fakeadmin@example.com"
      }),
      headers: { "Content-Type": "application/json" },
    })
    let res = await POST(req)
    expect(res.status).toBe(401)
    let json = await res.json()
    expect(json).toBe("invalid staff email!")
    req = new NextRequest(new URL("http://localhost/api/staff/courseList"), {
      method: "POST",
      body: JSON.stringify({
        email : "alice@example.com"
      }),
      headers: { "Content-Type": "application/json" },
    })
    res = await POST(req)
    expect(res.status).toBe(401)
    json = await res.json()
    expect(json).toBe("invalid staff email!")
  })
})
