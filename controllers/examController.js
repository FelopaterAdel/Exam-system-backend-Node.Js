import Exam from '../models/exam.js'

import User from "../models/User.js";

export const createExam = async (req, res) => {
  try {
    const { title, questions, students } = req.body;
    const teacherId = req.id;

    if (!title || !questions || !teacherId || !students) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const studentDocs = await User.find({ email: { $in: students } });

    if (studentDocs.length !== students.length) {
      return res.status(404).json({
        message: "Some student emails not found",
        found: studentDocs.map(s => s.email),
      });
    }

    const studentIds = studentDocs.map((student) => student._id);

    const exam = new Exam({
      title,
      questions,
      teacherId,
      students: studentIds,
    });

    await exam.save();

    res.status(201).json({
      message: "Exam created successfully",
      exam,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getExams = async (req, res) => {
  try {
    const populatedExams = await Promise.all(
      req.exams.map(async exam =>
        await Exam.findById(exam._id)
          .populate("students", "email")
          .populate("teacherId", "email")
      )
    );

    const simplifiedExams = populatedExams.map(exam => ({
      _id: exam._id,
      title: exam.title,
      questions: exam.questions,
      students: exam.students.map(s => s.email),
      teacherEmail: exam.teacherId?.email || null,
    }));

    res.json(simplifiedExams);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id)
      .populate("students", "email")
      .populate("teacherId", "email");

    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    const simplifiedExam = {
      _id: exam._id,
      title: exam.title,
      questions: exam.questions,
      students: exam.students.map((s) => s.email),
      teacherEmail: exam.teacherId?.email || null,
    };

    res.json(simplifiedExam);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const editExam = async (req, res) => {
  const newExam =req.body;
  let exam = await Exam.findByIdAndUpdate(req.params.id,newExam ,{new:true});
  res.json(exam);
};
export const deleteExam = async (req, res) => {
  let exam = await Exam.findByIdAndDelete(req.params.id)
  if (exam) {
    res.status(200).json({
      status: "delete success",
    })
  } else {
    res.status(400).json({
      status: "faild",
      message: "product not found",

    })
  }
}