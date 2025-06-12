import mongoose from 'mongoose';
const questionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correctAnswer: String,
  userAnswer: String,
  isCorrect: Boolean
});

const examSchema = new mongoose.Schema({
  title: String,
  questions: [questionSchema],
  teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Teacher ID is required"],
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
});

export default mongoose.model('Exam', examSchema);
