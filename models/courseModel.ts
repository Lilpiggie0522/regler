import mongoose, { Schema } from "mongoose"

export const courseSchema = new Schema({
  courseName: {
    type: "string", required: true
  },
  teams: [{ type: mongoose.Schema.Types.ObjectId, ref: "Team", required: false}],
  mentors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: false}],
  assignments: [{
    assignmentName: {
      type: "string", required: true
    }
  }],
  questionBanks: [{
    question: {
      type: "string", required: true
    }
  }],
  term: {type: "string", required: true}
})

courseSchema.index({ courseName: 1, term: 1 }, { unique: true })
// courseSchema.pre('deleteMany', async function(next) {
//     try {
//         const query = this.getFilter();
//         const courseDelete = await models.Course.find(query, '_id');
//         const courseId = courseDelete.map(course => course._id);
//         await models.Reminder.deleteMany({ course: courseId });
//         next();
//     } catch (error) {
//         if (error instanceof Error) {
//             next(error);
//         }
//     }
// });
