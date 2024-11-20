import dbConnect from "@/lib/dbConnect"
import models from "@/models/models"


// /*
//     Overview:
//     This function deletes job and update database when student submits form
//     Input: 
//         - id: Unique object id (team/student/course/issue)
//         - type: strings to indicate type of id
//     Output: 
//         Delete object if id in (team/course/issue)
//         Delete student if id in student
//     Error:
//         - Reminder not found
//         - Tutor not found
//         - Student not found
// */
export async function deleteReminder(issueId: string, personId: string, type: string) {
  try {
    await dbConnect()
        
    // check if mentor or student exists
    const reminder = await models.Reminder.findOne({ issue: issueId })
    if (!reminder) {
      return "reminder not found or issue closed"
    }
    if (type === "student") {
      const student = await models.Student.findById(personId)
      if (!student) {
        return "student not in the team/ already submitted"
      }
      await models.Reminder.updateOne({ issue: issueId }, { $pull: { students: personId } })
    } else if (type === "mentor") {
      const mentor = await models.Admin.findById({ _id: personId })
      if (!mentor) {
        return "tutor not in the team/ already submitted"
      }
      await models.Reminder.updateOne({ issue: issueId }, { $pull: { mentors: personId } })
    } else {
      return "Incorrect type"
    }
    return "Successfully remove person from reminder"
  } catch (error) {
    if (error instanceof Error) {
      return `Unexpected error: ${error}`
    }
  }
}

export default deleteReminder