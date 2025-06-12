import jwt from 'jsonwebtoken';
import Exam from '../models/exam.js'
export const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({
      status: 'fail',
      message: 'You are not logged in',
    });
  }

  try {
    const decoded = jwt.verify(authorization, process.env.JWT_SECRET);
    req.id = decoded.id;
    req.role = decoded.role;
    req.userId = decoded.id;
    console.log(req.userId)
    next();
    
  } catch (err) {
    return res.status(401).json({
      status: 'fail',
      message: 'You are not authorized',
    });
  }
};

export const restrictTo = (...role) => {
  return (req, res, next) => {
    if (!role.includes(req.role)) {
      return res.status(403).json({
        status: 'fail',
        message: 'You are not allowed to access this route',
      });
    }
    next();
  };
};

export const restrictToExamParticipants = async (req, res, next) => {
  try {
    const userId = req.id;
    if (req.role === 'teacher') {
              console.log('teacher : ',userId)

      const teacherExams = await Exam.find({ teacherId: userId });

      if (!teacherExams || teacherExams.length === 0) {
        return res.status(403).json({
          status: 'fail',
          message: 'No exams found for this teacher'
        });
      }

      req.exams = teacherExams;

    } else if (req.role === 'student') {
              console.log('student : ',userId)
      const studentExams = await Exam.find({ students: userId });

      if (!studentExams || studentExams.length === 0) {
        return res.status(403).json({
          status: 'fail',
          message: 'No exams found for this student'
        });
      }

      req.exams = studentExams;

    } else {
      return res.status(403).json({
        status: 'fail',
        message: 'Invalid role'
      });
    }

    next();
  } catch (err) {
    console.error('Error in restrictToExamParticipants:', err);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching exams'
    });
  }
};