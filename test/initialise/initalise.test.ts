import { dbInitialization } from "@/app/api/adminSystem/initialise/dbInitialisation"
//import { createMocks } from 'node-mocks-http';
import { MongoMemoryServer } from "mongodb-memory-server"
import { createDatabase, initialiseInput, terminateDatabase } from "@/test/testUtils"

// In-memory MongoDB server instance
let mongoServer: MongoMemoryServer

beforeAll(async () => {
  // Start a new MongoDB server and connect Mongoose

  // Mock input data to initialize the database
  const input: initialiseInput = {
    courseAdmins: [{ adminName: "Admin1", email: "admin1@example.com", role: "admin", courseName: "CS101", term: "T1" }],
    staffAdmins: [{ adminName: "Tutor1", email: "tutor1@example.com", role: "tutor", courseName: "CS101", term: "T1" }],
    students: [{ studentName: "Alice", email: "alice@example.com", zid: "z1234567", class: "T14A" }],
    teams: [{ teamName: "Team1", studentsZids: "z1234567", mentorsEmails: "tutor1@example.com" }],
    course: { courseName: "CS101", mentorsEmails: "tutor1@example.com", teams: "Team1", term: "T1" },
  }

  // Initialize the database with the mock data
  mongoServer = await createDatabase(input, mongoServer)
})

afterAll(async () => {
  // Drop the database and close the server after each test
  await terminateDatabase(mongoServer)
})

describe("Initialisation API Tests", () => {
  
  it("if submit the same structured files should initialize the database and return success", async () => {
    const body = {
      courseAdmins: [{ adminName: "Admin1", email: "admin1@example.com", role: "admin", courseName: "CS101", term: "T1" }],
      staffAdmins: [{ adminName: "Tutor1", email: "tutor1@example.com", role: "tutor", courseName: "CS101", term: "T1" }],
      students: [{ studentName: "Alice", email: "alice@example.com", zid: "z1234567", class: "T14A" }],
      teams: [{ teamName: "Team1", studentsZids: "z1234567", mentorsEmails: "tutor1@example.com" },
        { teamName: "Team2", studentsZids: "z1234567", mentorsEmails: "tutor1@example.com" }
      ],
      course: { courseName: "CS101", mentorsEmails: "tutor1@example.com", teams: "Team1", term: "T1" },
    }
    
    // Call the POST handler
    const res = await dbInitialization(body)
    
    // Verify response status and content
    expect(res.status).toBe(200)
    
    const json = await res.json() // Parse the JSON response
    //console.log(json);
    expect(json.message).toBe("Initialisation successful.")
    
  })
  it ("if submitted new course, students, tutors, admins in the file it will include them too", async() => {
    const body = {
      courseAdmins: [{ adminName: "Wilson", email: "admin2@example.com", role: "admin", courseName: "CS101", term: "T1" }],
      staffAdmins: [{ adminName: "Tutor12", email: "tutor2@example.com", role: "tutor", courseName: "CS101", term: "T1" }],
      students: [{ studentName: "BOB", email: "BOB@example.com", zid: "z1234560", class: "T14A" }],
      teams: [{ teamName: "Team2", studentsZids: "z1234560", mentorsEmails: "tutor1@example.com" }
        , { teamName: "Team3", studentsZids: "z1234567", mentorsEmails: "tutor1@example.com" }
      ],
      course: { courseName: "CS102", mentorsEmails: "tutor2@example.com", teams: "Team3,Team2", term: "T1" },
    }
    
    // Call the POST handler
    const res = await dbInitialization(body)
    
    // Verify response status and content
    expect(res.status).toBe(200)
    const json = await res.json() // Parse the JSON response
    //console.log(json);
    //console.log("courses: " + json.curCourses);
    //console.log("teams: " + json.curTeams);
    expect(json.message).toBe("Initialisation successful.")
    const expectedCourses = [{
      courseName: "CS101",
      term: "T1"
    },
    {
      courseName: "CS102",
      term: "T1"
    }
    ]
    // second course should be add in the courses list
    
    expect(json.curCourses).toMatchObject(expectedCourses)
    // second course should include 2 teams
    expect(json.curCourses[1].teams.length).toBe(2)
  })
  
})
