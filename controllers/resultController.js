import Result from '../models/result.js';
import Exam from '../models/exam.js';
export const submitExam = async (req, res) => {
  try {
    const { examId } = req.params;
    const { answers } = req.body;

    if (!examId) {
      return res.status(400).json({ error: 'Exam ID is required' });
    }

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ error: 'Answers must be provided as an array' });
    }

    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    if (answers.length !== exam.questions.length) {
      return res.status(400).json({
        error: `Expected ${exam.questions.length} answers, received ${answers.length}`
      });
    }

    let score = 0;
    const results = [];

    exam.questions.forEach((question, index) => {
      const userAnswer = answers[index];
      const isCorrect = question.correctAnswer == userAnswer;

      if (isCorrect) {
        score++;
      }
      results.push({
        questionId: question._id,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        points: isCorrect ? 1 : 0
      });

      console.log(`Q${index + 1}: User: ${userAnswer}, Correct: ${question.correctAnswer}, Match: ${isCorrect}`);
    });

    const totalQuestions = exam.questions.length;
    const percentage = Math.round((score / totalQuestions) * 100);

    const examResult = {
      examId: exam._id,
      userId: req.user?.id, // Assuming you have user info from auth middleware
      answers,
      title:exam.title,
      score,
      totalQuestions,
      percentage,
      passed: percentage >= 50,
      submittedAt: new Date(),
      results // Detailed question-by-question results
    };
     await Result.create(examResult);


    console.log(`Exam completed: ${score}/${totalQuestions} (${percentage}%)`);

    // Return result
    res.status(200).json({
      success: true,
      message: 'Exam submitted successfully',
      result: {
        examId: exam._id,
        examTitle: exam.title,
        score,
        totalQuestions,
        percentage,
        passed: percentage >= 50, // Assuming 60% pass mark
        submittedAt: examResult.submittedAt
      }
    });

  } catch (error) {
    console.error('Error submitting exam:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to process exam submission'
    });
  }
};

// Additional: Get exam results endpoint
export const getExamResult = async (req, res) => {
  try {
    const { examId } = req.params;
    const userId = req.user?.id;

    // Find the user's exam result
    const result = await Result.findOne({
      examId,
      userId
    }).populate('examId', 'title description');

    if (!result) {
      return res.status(404).json({ error: 'Exam result not found' });
    }

    res.status(200).json({
      success: true,
      result
    });

  } catch (error) {
    console.error('Error fetching exam result:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch exam result'
    });
  }
};
