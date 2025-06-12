import Exam from '../models/exam.js'

export const createExam = async (req, res) => {
  const exam = await Exam.create(req.body);
  exam.teacherId=req.id;
  console.log(exam.teacherId);
  res.status(201).json(exam);
};

export const getExams = async (req, res) => {
  const exams = await Exam.find();
  res.json(exams);
};

export const getExamById = async (req, res) => {
  const exam = await Exam.findById(req.params.id);
  res.json(exam);
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