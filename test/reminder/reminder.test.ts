import { POST } from "@/app/api/mailingSystem/setReminder/route"
import models from "@/models/models"
import cron from "node-cron"
import { deleteReminder } from "@/lib/deleteReminder"

jest.mock("@/lib/dbConnect")
jest.mock("node-cron")
jest.mock("@/models/models")
jest.mock("@/lib/reminderMod")

const Reminder = models.Reminder
const Student = models.Student
const Admin = models.Admin

describe("setReminder POST", () => {
  let response: any
  beforeEach(() => {
    jest.clearAllMocks()
  })
  afterAll(() => {
    jest.clearAllMocks()
  });
  (Reminder.find as jest.Mock).mockResolvedValue([{
    _id: "reminder1",
    team: "team1",
    course: "course1",
    issue: "issue1",
    schedule: new Date(new Date().getTime() - 7*24*60*60*1000),
    students: ["student1", "student2", "student3"],
    mentors: ["mentor1"],
  }])

  it("should successfully go through set reminder and send reminders", async () => {

    cron.schedule = jest.fn()

    response = await POST()
    expect(cron.schedule).toHaveBeenCalledTimes(1)
    expect(response.status).toBe(200)
  })

})

describe("setReminder DELETE", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  afterAll(() => {
    jest.clearAllMocks()
  })

  it("should delete student who submits form from reminder", async () => {
    (Reminder.findOne as jest.Mock).mockResolvedValue({
      _id: "reminder1",
      team: "team1",
      course: "course1",
      issue: "issue1",
      schedule: new Date().getTime(),
      students: ["student2", "student3"],
      mentors: ["mentor1"],
    });
    (Student.findById as jest.Mock).mockResolvedValue({
      _id: "student2",
      studentName: "second student",
      email: "z2222222@ad.unsw.edu.au",
      zid: "z2222222",
      courses: ["course1"],
    })
    Reminder.updateOne = jest.fn()


    const response = await deleteReminder("student2", "issue1", "student")
    expect(response).toEqual("Successfully remove person from reminder")
  })

  it("should delete tutor who submits opinion from reminder", async () => {
    (Reminder.findOne as jest.Mock).mockResolvedValue({
      _id: "reminder1",
      team: "team1",
      course: "course1",
      issue: "issue1",
      schedule: new Date().getTime(),
      students: ["student2", "student3"],
      mentors: ["mentor1"],
    });
    (Admin.findById as jest.Mock).mockResolvedValue({
      _id: "mentor1",
      adminName: "first tutor",
      email: "tutor@ad.unsw.edu.au",
      role: "tutor",
      courses: ["course1"],
    })
    Reminder.updateOne = jest.fn()

    const response = await deleteReminder("mentor1", "issue1", "mentor")
    expect(response).toEqual("Successfully remove person from reminder")
  })

  it("should raise error when reminder not found", async () => {
    (Reminder.findOne as jest.Mock).mockResolvedValue(null)

    const response = await deleteReminder("mentor1", "issue1", "mentor")
    expect(response).toEqual("reminder not found or issue closed")
  })

  it("should raise error when student not found", async () => {
    (Reminder.findOne as jest.Mock).mockResolvedValue({
      _id: "reminder1",
      team: "team1",
      course: "course1",
      issue: "issue1",
      schedule: new Date().getTime(),
      students: ["student2", "student3"],
      mentors: ["mentor1"],
    });
    (Student.findById as jest.Mock).mockResolvedValue(null)
    Reminder.updateOne = jest.fn()

    const response = await deleteReminder("student1", "issue1", "student")
    expect(response).toEqual("student not in the team/ already submitted")
  })

  it("should raise error when tutor not found", async () => {
    (Reminder.findOne as jest.Mock).mockResolvedValue({
      _id: "reminder1",
      team: "team1",
      course: "course1",
      issue: "issue1",
      schedule: new Date().getTime(),
      students: ["student2", "student3"],
      mentors: ["mentor1"],
    });
    (Admin.findById as jest.Mock).mockResolvedValue(null)
    Reminder.updateOne = jest.fn()

    const response = await deleteReminder("mentor2", "issue1", "mentor")
    expect(response).toEqual("tutor not in the team/ already submitted")
  })

})

