import mongoose from'mongoose';

const resultSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  examId: mongoose.Schema.Types.ObjectId,
  title: String,
  totalQuestions: Number,
  percentage: Number,
  passed: Boolean,
  submittedAt: Date,
  timeTaken: String,
  score: Number,
});

export default mongoose.model('Result', resultSchema);
// id: string;
//   title: string;
//   score: number;
//   totalQuestions: number;
//   percentage: number;
//   passed: boolean;
//   submittedAt: Date;
//   timeTaken?: string;
//   questions?: IQuestionResult[];
// }
