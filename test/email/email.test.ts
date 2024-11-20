import nodemailer from "nodemailer"
import models from "@/models/models"
import { sendTeamEmail } from "@/lib/sendTeamEmail"
import { sendLecturerTutor } from "@/lib/lecturerTutor"
import { sendResult } from "@/lib/sendResult"
import { sendComment } from "@/lib/sendComment"


jest.mock("nodemailer")
jest.mock("@/lib/dbConnect")
jest.mock("@/models/models")

const Student = models.Student
const Team = models.Team
const Course = models.Course
const Reminder = models.Reminder
const Admin = models.Admin
const Issue = models.Issue

describe("sendTeamEmail - send email to students and tutors when a dispute", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (nodemailer.createTransport as jest.Mock).mockReturnValue({
      sendMail: jest.fn(),
    })

    Team.findById = jest.fn()
    Course.findById = jest.fn()
    Student.findById = jest.fn()
    Admin.findById = jest.fn()
    Reminder.create = jest.fn()
  })
  afterAll(async () => {
    jest.clearAllMocks()
  })
  
  it("should send notifications to rest of the team and tutors successfully", async () => {
    (Team.findById as jest.Mock).mockResolvedValue({
      _id: "team1",
      teamName: "Test Team",
      course: "course1",
      students: ["student1", "student2", "student3", "student4"],
      mentors: ["mentor1", "mentor2"],
      issues: ["issue1"],
    });
    (Course.findById as jest.Mock).mockResolvedValue({
      _id: "course1",
      courseName: "TEST3900",
      teams: ["team1"],
      mentors: ["mentor1"],
      term: "24T3",
    });

    (Student.findById as jest.Mock).mockResolvedValueOnce({
      _id: "student1",
      studentName: "Peter Simpson",
      email: "z1111111@ad.unsw.edu.au",
      zid: "z1111111",
      course: ["course1"],
    }).mockResolvedValueOnce({
      _id: "student2",
      studentName: "Mary White",
      email: "z2222222@ad.unsw.edu.au",
      zid: "z2222222",
      course: ["course1"],
    }).mockResolvedValueOnce({
      _id: "student3",
      studentName: "Ben Thompson",
      email: "z3333333@ad.unsw.edu.au",
      zid: "z3333333",
      course: ["course1"],
    }).mockResolvedValueOnce({
      _id: "student4",
      studentName: "Jerry Griffen",
      email: "z4444444@ad.unsw.edu.au",
      zid: "z4444444",
      course: ["course1"],
    });
    
    (Admin.findById as jest.Mock).mockResolvedValueOnce({
      _id: "mentor1",
      adminName: "Spongebob Superman",
      email: "tutor1@unsw.edu.au",
      role: "tutor",
      courses: ["course1"]
    }).mockResolvedValueOnce({
      _id: "mentor2",
      adminName: "Patrick Superman",
      email: "tutor2@unsw.edu.au",
      role: "tutor",
      courses: ["course1"]
    });

    (Reminder.create as jest.Mock).mockResolvedValue({})
    const response = await (await sendTeamEmail("team1", "course1", "student1", "issue1", "assignment1")).json()
    // Send 4 emails to students and send emails to tutors at once (4+1).
    expect(nodemailer.createTransport).toHaveBeenCalledTimes(1)
    expect(nodemailer.createTransport().sendMail).toHaveBeenCalledTimes(5)
    expect(response).toEqual("Notification sent to the team and tutors successfully")
  })
  
  it("should return 'Team not found' if team not exists", async () => {
    (Team.findById as jest.Mock).mockResolvedValue(null)
    
    const response = await (await sendTeamEmail("Invalid team", "course1", "student1", "issue1", "assignment1")).json()
    expect(response).toEqual("Team not found")
  })
  
  it("should return 'Course not found' if course not exists", async () => {
    // Mock Team to exist, but Course to return null
    (Team.findById as jest.Mock).mockResolvedValue({
      _id: "team1",
      students: ["student1", "student2"],
      mentors: ["mentor1"],
      teamName: "Test Team",
    });
    (Course.findById as jest.Mock).mockResolvedValue(null)

    const response = await (await sendTeamEmail("team1", "Invalid course", "student1", "issue1", "assignment1")).json()
    expect(response).toEqual("Course not found")
  })
})



describe("lecturerTutor - send email to lecturers and when tutors provide opinions", () => {
  // let response: any;
    
  beforeEach(() => {
    jest.clearAllMocks();

    (nodemailer.createTransport as jest.Mock).mockReturnValue({
      sendMail: jest.fn(),
    })

    Team.findById = jest.fn()
    Course.findById = jest.fn()
    Student.findById = jest.fn()
    Admin.findById = jest.fn()
    Reminder.create = jest.fn()
    Issue.create = jest.fn()
  })
  afterAll(async () => {
    jest.clearAllMocks()
  })
  
  it("should send notifications to rest of the team and tutors successfully", async () => {
    (Team.findById as jest.Mock).mockResolvedValue({});
    (Course.findById as jest.Mock).mockResolvedValue({});
    (Issue.findById as jest.Mock).mockResolvedValue({});

    (Admin.findById as jest.Mock).mockResolvedValueOnce({
      _id: "lecturer1",
      adminName: "Spongebob Superman",
      email: "lecturer1@unsw.edu.au",
      role: "admin",
      courses: ["course1"]
    }).mockResolvedValueOnce({
      _id: "lecturer2",
      adminName: "Patrick Superman",
      email: "lecturer2@unsw.edu.au",
      role: "admin",
      courses: ["course1"]
    })
    const response = await sendLecturerTutor("team1", "course1", "issue1", ["lecturer1", "lecturer2"])
    // Send 2 emails to admins.
    expect(nodemailer.createTransport).toHaveBeenCalledTimes(1)
    expect(nodemailer.createTransport().sendMail).toHaveBeenCalledTimes(2)
    expect(response).toEqual("Send email successfully")
  })
  
  it("should return team not exists if team not exists", async () => {
    (Team.findById as jest.Mock).mockResolvedValue(null);
    (Course.findById as jest.Mock).mockResolvedValue({});
    (Issue.findById as jest.Mock).mockResolvedValue({})

    const response = await sendLecturerTutor("team1", "course1", "issue1", ["lecturer1", "lecturer2"])
    expect(response).toEqual("team not exists")
  })

  it("should return course not exists if course not exists", async () => {
    (Team.findById as jest.Mock).mockResolvedValue({});
    (Course.findById as jest.Mock).mockResolvedValue(null);
    (Issue.findById as jest.Mock).mockResolvedValue({})

    const response = await sendLecturerTutor("team1", "course1", "issue1", ["lecturer1", "lecturer2"])
    expect(response).toEqual("course not exists")
  })

  it("should return issue not exists if issue not exists", async () => {
    (Team.findById as jest.Mock).mockResolvedValue({});
    (Course.findById as jest.Mock).mockResolvedValue({});
    (Issue.findById as jest.Mock).mockResolvedValue(null)

    const response = await sendLecturerTutor("team1", "course1", "issue1", ["lecturer1", "lecturer2"])
    expect(response).toEqual("issue not exists")
  })

})


describe("sendResult - send closing emails to students when lecturers finish scaling", () => {    
  beforeEach(() => {
    jest.clearAllMocks();

    (nodemailer.createTransport as jest.Mock).mockReturnValue({
      sendMail: jest.fn(),
    })

    Team.findById = jest.fn()
    Course.findById = jest.fn()
    Student.findById = jest.fn()
    Admin.findById = jest.fn()
    Reminder.create = jest.fn()
  })
  afterAll(async () => {
    jest.clearAllMocks()
  })
  
  it("should send closing emails to students successfully", async () => {
    (Team.findById as jest.Mock).mockResolvedValue({
      _id: "team1",
      teamName: "Test Team",
      course: "course1",
      students: ["student1", "student2", "student3", "student4"],
      mentors: ["mentor1", "mentor2"],
      issues: ["issue1"],
    });
    (Course.findById as jest.Mock).mockResolvedValue({
      _id: "course1",
      courseName: "TEST3900",
      teams: ["team1"],
      mentors: ["mentor1"],
      term: "24T3",
    });

    (Student.findById as jest.Mock).mockResolvedValueOnce({
      _id: "student1",
      studentName: "Peter Simpson",
      email: "z1111111@ad.unsw.edu.au",
      zid: "z1111111",
      course: ["course1"],
    }).mockResolvedValueOnce({
      _id: "student2",
      studentName: "Mary White",
      email: "z2222222@ad.unsw.edu.au",
      zid: "z2222222",
      course: ["course1"],
    }).mockResolvedValueOnce({
      _id: "student3",
      studentName: "Ben Thompson",
      email: "z3333333@ad.unsw.edu.au",
      zid: "z3333333",
      course: ["course1"],
    }).mockResolvedValueOnce({
      _id: "student4",
      studentName: "Jerry Griffen",
      email: "z4444444@ad.unsw.edu.au",
      zid: "z4444444",
      course: ["course1"],
    });
        
    // dummy issue
    (Issue.findById as jest.Mock).mockResolvedValue({})

    const response = await sendResult("team1", "course1", "issue1")

    // Send 4 emails to students.
    expect(nodemailer.createTransport).toHaveBeenCalledTimes(1)
    expect(nodemailer.createTransport().sendMail).toHaveBeenCalledTimes(4)
    expect(response).toEqual("Send emails to students successfully")
  })
    

  it("should return team not exists if team not exists", async () => {
    (Team.findById as jest.Mock).mockResolvedValue(null);
    (Course.findById as jest.Mock).mockResolvedValue({});
    (Issue.findById as jest.Mock).mockResolvedValue({})

    const response = await sendResult("team1", "course1", "issue1")
    expect(response).toEqual("team not exists")
  })

  it("should return course not exists if course not exists", async () => {
    (Team.findById as jest.Mock).mockResolvedValue({});
    (Course.findById as jest.Mock).mockResolvedValue(null);
    (Issue.findById as jest.Mock).mockResolvedValue({})

    const response = await sendResult("team1", "course1", "issue1")
    expect(response).toEqual("course not exists")
  })

  it("should return issue not exists if issue not exists", async () => {
    (Team.findById as jest.Mock).mockResolvedValue({});
    (Course.findById as jest.Mock).mockResolvedValue({});
    (Issue.findById as jest.Mock).mockResolvedValue(null)

    const response = await sendResult("team1", "course1", "issue1")
    expect(response).toEqual("issue not exists")
  })
})


describe("sendComment - send lecturer's comment to students when lecturers finish scaling", () => {    
  beforeEach(() => {
    jest.clearAllMocks();

    (nodemailer.createTransport as jest.Mock).mockReturnValue({
      sendMail: jest.fn(),
    })

    Team.findById = jest.fn()
    Course.findById = jest.fn()
    Student.findById = jest.fn()
    Admin.findById = jest.fn()
    Reminder.create = jest.fn()
  })
  afterAll(async () => {
    jest.clearAllMocks()
  })
  
  it("should send comments to students successfully", async () => {
    (Team.findById as jest.Mock).mockResolvedValue({
      _id: "team1",
      teamName: "Test Team",
      course: "course1",
      students: ["student1", "student2", "student3", "student4"],
      mentors: ["mentor1", "mentor2"],
      issues: ["issue1"],
    });
    (Course.findById as jest.Mock).mockResolvedValue({
      _id: "course1",
      courseName: "TEST3900",
      teams: ["team1"],
      mentors: ["mentor1"],
      term: "24T3",
    });

    (Student.findById as jest.Mock).mockResolvedValueOnce({
      _id: "student1",
      studentName: "Peter Simpson",
      email: "z1111111@ad.unsw.edu.au",
      zid: "z1111111",
      course: ["course1"],
    }).mockResolvedValueOnce({
      _id: "student2",
      studentName: "Mary White",
      email: "z2222222@ad.unsw.edu.au",
      zid: "z2222222",
      course: ["course1"],
    }).mockResolvedValueOnce({
      _id: "student3",
      studentName: "Ben Thompson",
      email: "z3333333@ad.unsw.edu.au",
      zid: "z3333333",
      course: ["course1"],
    }).mockResolvedValueOnce({
      _id: "student4",
      studentName: "Jerry Griffen",
      email: "z4444444@ad.unsw.edu.au",
      zid: "z4444444",
      course: ["course1"],
    });
        
    // dummy issue
    (Issue.findById as jest.Mock).mockResolvedValue({})

    const response = await sendComment("team1", "course1", "issue1", "comment1")

    // Send 4 emails to students.
    expect(nodemailer.createTransport).toHaveBeenCalledTimes(1)
    expect(nodemailer.createTransport().sendMail).toHaveBeenCalledTimes(4)
    expect(response).toEqual("Send emails to students successfully")
  })
    

  it("should return team not exists if team not exists", async () => {
    (Team.findById as jest.Mock).mockResolvedValue(null);
    (Course.findById as jest.Mock).mockResolvedValue({});
    (Issue.findById as jest.Mock).mockResolvedValue({})

    const response = await sendComment("team1", "course1", "issue1", "comment1")
    expect(response).toEqual("team not exists")
  })

  it("should return course not exists if course not exists", async () => {
    (Team.findById as jest.Mock).mockResolvedValue({});
    (Course.findById as jest.Mock).mockResolvedValue(null);
    (Issue.findById as jest.Mock).mockResolvedValue({})

    const response = await sendComment("team1", "course1", "issue1", "comment1")
    expect(response).toEqual("course not exists")
  })

  it("should return issue not exists if issue not exists", async () => {
    (Team.findById as jest.Mock).mockResolvedValue({});
    (Course.findById as jest.Mock).mockResolvedValue({});
    (Issue.findById as jest.Mock).mockResolvedValue(null)

    const response = await sendComment("team1", "course1", "issue1", "comment1")
    expect(response).toEqual("issue not exists")
  })
})